import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db, inquiries, yachts, destinations } from "@/lib/db";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getInquiryConfirmation } from "@/lib/email/templates";

// Lazy-initialize Resend only when API key is available
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

interface InquiryData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  interestType: "yacht" | "destination" | "general";
  yachtSlug?: string;
  yachtName?: string;
  destinationSlug?: string;
  destinationName?: string;
  dates?: string;
  turnstileToken: string;
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Skip verification if Turnstile is not properly configured
  // Secret keys start with '0x' prefix
  if (!secretKey || !secretKey.startsWith("0x")) {
    console.warn("Turnstile secret key not configured, skipping verification");
    return true;
  }

  // If no token was provided, verification fails
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

function getSubjectLine(data: InquiryData): string {
  if (data.yachtName) {
    return `Charter Inquiry: ${data.yachtName}`;
  }
  if (data.destinationName) {
    return `Destination Inquiry: ${data.destinationName}`;
  }
  return "New Charter Inquiry";
}

function formatEmailBody(data: InquiryData): string {
  let body = `
New inquiry from Mediterana Yachting website

---

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ""}
Interest: ${data.interestType === "yacht" ? "Chartering a Yacht" : data.interestType === "destination" ? "Exploring a Destination" : "General Inquiry"}
${data.yachtName ? `Yacht: ${data.yachtName}` : ""}
${data.destinationName ? `Destination: ${data.destinationName}` : ""}
${data.dates ? `Preferred Dates: ${data.dates}` : ""}

Message:
${data.message}

---

Reply directly to this email to respond to the customer.
`;

  return body.trim();
}

function formatConfirmationEmail(data: InquiryData): { subject: string; body: string } {
  return getInquiryConfirmation({
    name: data.name,
    yachtName: data.yachtName,
    destinationName: data.destinationName,
  });
}

export async function POST(request: NextRequest) {
  try {
    const data: InquiryData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message || !data.interestType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Verify Turnstile token
    const isValid = await verifyTurnstile(data.turnstileToken);
    if (!isValid) {
      return NextResponse.json(
        { error: "Security verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Look up yacht and destination IDs if provided
    let yachtId: string | null = null;
    let destinationId: string | null = null;

    if (data.yachtSlug) {
      const yacht = db.select({ id: yachts.id }).from(yachts).where(eq(yachts.slug, data.yachtSlug)).get();
      if (yacht) yachtId = yacht.id;
    }

    if (data.destinationSlug) {
      const destination = db.select({ id: destinations.id }).from(destinations).where(eq(destinations.slug, data.destinationSlug)).get();
      if (destination) destinationId = destination.id;
    }

    // Save inquiry to database
    db.insert(inquiries).values({
      id: nanoid(),
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      yachtId,
      destinationId,
      source: data.interestType,
      status: 'new',
    }).run();

    const contactEmail = process.env.CONTACT_EMAIL || "charter@mediteranayachting.com";

    // Check if Resend is configured
    const resend = getResendClient();
    if (!resend) {
      console.log("Resend not configured, logging inquiry:");
      console.log(data);
      return NextResponse.json({
        success: true,
        message: "Inquiry received (email not configured)",
      });
    }

    // Send notification email to business
    await resend.emails.send({
      from: "Mediterana Yachting <noreply@mediteranayachting.com>",
      to: contactEmail,
      reply_to: data.email,
      subject: getSubjectLine(data),
      text: formatEmailBody(data),
    });

    // Send confirmation email to customer
    const confirmation = formatConfirmationEmail(data);
    await resend.emails.send({
      from: "Mediterana Yachting <noreply@mediteranayachting.com>",
      to: data.email,
      subject: confirmation.subject,
      text: confirmation.body,
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry sent successfully",
    });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry. Please try again." },
      { status: 500 }
    );
  }
}
