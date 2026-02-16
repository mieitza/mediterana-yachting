import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Mediterana Yachting",
  description: "Terms and conditions for using Mediterana Yachting services and website.",
};

export default function TermsOfServicePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-navy">
        <div className="container mx-auto px-4 text-white text-center">
          <h1 className="text-shadow">Terms of Service</h1>
          <p className="mt-4 text-lg text-white/80">
            Last updated: January 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg prose-luxury">
            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using the Mediterana Yachting website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
            </p>

            <h2>Services Description</h2>
            <p>
              Mediterana Yachting provides yacht charter brokerage services, connecting clients with yacht owners and operators for charter experiences in the Mediterranean region. We act as an intermediary and facilitate the booking process.
            </p>

            <h2>Booking and Reservations</h2>
            <p>When you submit a charter inquiry or booking request:</p>
            <ul>
              <li>All charter agreements are subject to availability and confirmation</li>
              <li>Pricing and availability may change until a booking is confirmed</li>
              <li>Specific terms, conditions, and cancellation policies apply to each charter and will be provided before confirmation</li>
              <li>A deposit is typically required to secure a booking</li>
            </ul>

            <h2>User Responsibilities</h2>
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate and complete information when making inquiries or bookings</li>
              <li>Use our website and services only for lawful purposes</li>
              <li>Not misuse or attempt to disrupt our website or services</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2>Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and design elements, is the property of Mediterana Yachting or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or use any content without our written permission.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              Mediterana Yachting acts as a charter broker and intermediary. While we carefully vet our partner yachts and operators:
            </p>
            <ul>
              <li>We are not responsible for the actions, omissions, or negligence of yacht owners, captains, or crew</li>
              <li>Charter agreements are between you and the yacht owner/operator</li>
              <li>We recommend appropriate travel and charter insurance</li>
              <li>Our liability is limited to the brokerage services we provide</li>
            </ul>

            <h2>Website Use Disclaimer</h2>
            <p>
              The information on this website is provided for general informational purposes. While we strive for accuracy:
            </p>
            <ul>
              <li>Yacht specifications, images, and availability may change</li>
              <li>Prices are indicative and subject to confirmation</li>
              <li>We make no warranties about the completeness or reliability of any information</li>
            </ul>

            <h2>Third-Party Links</h2>
            <p>
              Our website may contain links to external websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of Greece. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Athens, Greece.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this website. Your continued use of our services constitutes acceptance of any changes.
            </p>

            <h2>Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us:
            </p>
            <ul>
              <li>Email: <a href="mailto:charter@mediteranayachting.com">charter@mediteranayachting.com</a></li>
              <li>Visit our <Link href="/contact">Contact Page</Link></li>
            </ul>

            <h2>Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
