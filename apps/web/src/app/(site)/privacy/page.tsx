import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Mediterana Yachting",
  description: "Learn how Mediterana Yachting collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-navy">
        <div className="container mx-auto px-4 text-white text-center">
          <h1 className="text-shadow">Privacy Policy</h1>
          <p className="mt-4 text-lg text-white/80">
            Last updated: January 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-bg-base">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg prose-luxury">
            <h2>Introduction</h2>
            <p>
              Mediterana Yachting (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or use our services.
            </p>

            <h2>Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li><strong>Contact Information:</strong> Name, email address, phone number, and postal address when you submit inquiries or book a charter.</li>
              <li><strong>Charter Details:</strong> Preferences, dates, destinations, and special requests related to your yacht charter.</li>
              <li><strong>Newsletter Subscription:</strong> Email address and optional name when you subscribe to The Captain&apos;s Log.</li>
              <li><strong>Communications:</strong> Records of correspondence when you contact us.</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your charter inquiries and bookings</li>
              <li>Communicate with you about your charter arrangements</li>
              <li>Send newsletter updates if you have subscribed</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul>
              <li><strong>Yacht Owners and Crew:</strong> To facilitate your charter booking</li>
              <li><strong>Service Providers:</strong> Who assist us in operating our website and conducting our business</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2>Newsletter Unsubscribe</h2>
            <p>
              You can unsubscribe from our newsletter at any time by clicking the unsubscribe link at the bottom of any email we send, or by contacting us directly.
            </p>

            <h2>Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us analyze website traffic and improve our services.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <ul>
              <li>Email: <a href="mailto:charter@mediteranayachting.com">charter@mediteranayachting.com</a></li>
              <li>Visit our <Link href="/contact">Contact Page</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
