const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mediteranayachting.com';

interface WelcomeEmailParams {
  name?: string | null;
  unsubscribeToken: string;
}

export function formatWelcomeEmail({ name, unsubscribeToken }: WelcomeEmailParams): string {
  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;
  const greeting = name ? `Dear ${name}` : 'Dear Explorer';

  return `
${greeting},

Welcome to the Mediterana Yachting family. You've just joined an exclusive community of discerning travelers who appreciate the finer things in life.

From our Captain's Log, you'll receive:

- Curated destination guides and hidden Mediterranean gems
- Exclusive yacht charter opportunities
- Seasonal sailing insights and travel inspiration
- Insider tips from our expert crew

Your next adventure awaits.

Fair winds and following seas,
The Mediterana Yachting Team

---
Mediterana Yachting
charter@mediteranayachting.com
+30 123 456 789

To unsubscribe, visit: ${unsubscribeUrl}
`.trim();
}

export function formatUnsubscribeConfirmation(): string {
  return `
You have been successfully unsubscribed from the Mediterana Yachting newsletter.

We're sorry to see you go, but you can always rejoin the journey by subscribing again on our website.

Fair winds,
The Mediterana Yachting Team

---
Mediterana Yachting
https://www.mediteranayachting.com
`.trim();
}

export function generateUnsubscribeUrl(token: string): string {
  return `${baseUrl}/api/newsletter/unsubscribe?token=${token}`;
}
