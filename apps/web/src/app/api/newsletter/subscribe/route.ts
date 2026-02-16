import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db, newsletterSubscribers } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getWelcomeEmail } from '@/lib/email/templates';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

interface SubscribeData {
  email: string;
  name?: string;
  source?: string;
  turnstileToken: string;
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Skip verification if Turnstile is not properly configured
  // Secret keys start with '0x' prefix
  if (!secretKey || !secretKey.startsWith('0x')) {
    console.warn('Turnstile secret key not configured, skipping verification');
    return true;
  }

  // If no token was provided, verification fails
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
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
    console.error('Turnstile verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: SubscribeData = await request.json();

    // Validate required fields
    if (!data.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Verify Turnstile token
    const isValid = await verifyTurnstile(data.turnstileToken);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, data.email.toLowerCase()))
      .get();

    if (existing) {
      if (existing.status === 'active') {
        // Already subscribed and active
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed to our newsletter.',
        });
      } else {
        // Re-activate unsubscribed user
        db.update(newsletterSubscribers)
          .set({
            status: 'active',
            unsubscribedAt: null,
            source: data.source || existing.source,
          })
          .where(eq(newsletterSubscribers.id, existing.id))
          .run();

        return NextResponse.json({
          success: true,
          message: 'Welcome back! You have been re-subscribed.',
        });
      }
    }

    // Create new subscriber
    const unsubscribeToken = nanoid(32);
    const subscriberId = nanoid();

    db.insert(newsletterSubscribers).values({
      id: subscriberId,
      email: data.email.toLowerCase(),
      name: data.name || null,
      source: data.source || 'website',
      unsubscribeToken,
      status: 'active',
    }).run();

    // Send welcome email
    const resend = getResendClient();
    if (resend) {
      try {
        const welcome = getWelcomeEmail({
          name: data.name,
          unsubscribeToken,
        });
        await resend.emails.send({
          from: 'Mediterana Yachting <noreply@mediteranayachting.com>',
          to: data.email,
          subject: welcome.subject,
          text: welcome.body,
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the subscription if email fails
      }
    } else {
      console.log('Resend not configured, skipping welcome email');
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! Check your inbox for a welcome message.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
