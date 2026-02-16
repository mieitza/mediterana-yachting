import { db, emailTemplates } from '@/lib/db';

interface TemplateData {
  senderName: string;
  contactEmail: string;
  contactPhone: string;
  signatureText: string;
  inquirySubject: string;
  inquiryBody: string;
  welcomeSubject: string;
  welcomeBody: string;
}

const defaults: TemplateData = {
  senderName: 'Mediterana Yachting',
  contactEmail: 'charter@mediteranayachting.com',
  contactPhone: '+30 123 456 789',
  signatureText: 'Fair winds and following seas,\nThe Mediterana Yachting Team',
  inquirySubject: 'Thank you for your inquiry - Mediterana Yachting',
  inquiryBody: `Dear {{name}},

Thank you for your inquiry. We have received your message and a member of our team will be in touch within 24 hours.

{{#yachtName}}You expressed interest in: {{yachtName}}{{/yachtName}}
{{#destinationName}}You're interested in exploring: {{destinationName}}{{/destinationName}}

In the meantime, feel free to browse our fleet at https://www.mediteranayachting.com/yachts or explore our destinations at https://www.mediteranayachting.com/destinations.

{{signature}}

---
{{senderName}}
{{contactEmail}}
{{contactPhone}}`,
  welcomeSubject: 'Welcome Aboard - Mediterana Yachting',
  welcomeBody: `{{greeting}},

Welcome to the Mediterana Yachting family. You've just joined an exclusive community of discerning travelers who appreciate the finer things in life.

From our Captain's Log, you'll receive:

- Curated destination guides and hidden Mediterranean gems
- Exclusive yacht charter opportunities
- Seasonal sailing insights and travel inspiration
- Insider tips from our expert crew

Your next adventure awaits.

{{signature}}

---
{{senderName}}
{{contactEmail}}
{{contactPhone}}

To unsubscribe, visit: {{unsubscribeUrl}}`,
};

function getTemplateData(): TemplateData {
  try {
    const row = db.select().from(emailTemplates).get();
    if (!row) return defaults;

    return {
      senderName: row.senderName || defaults.senderName,
      contactEmail: row.contactEmail || defaults.contactEmail,
      contactPhone: row.contactPhone || defaults.contactPhone,
      signatureText: row.signatureText || defaults.signatureText,
      inquirySubject: row.inquirySubject || defaults.inquirySubject,
      inquiryBody: row.inquiryBody || defaults.inquiryBody,
      welcomeSubject: row.welcomeSubject || defaults.welcomeSubject,
      welcomeBody: row.welcomeBody || defaults.welcomeBody,
    };
  } catch {
    return defaults;
  }
}

/** Replace {{variable}} placeholders and handle conditional blocks */
function render(template: string, vars: Record<string, string>): string {
  let result = template;

  // Process conditional blocks: {{#var}}content{{/var}}
  result = result.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_match, key, content) => {
    return vars[key] ? content.replace(/\{\{(\w+)\}\}/g, (_m: string, k: string) => vars[k] || '') : '';
  });

  // Replace simple variables
  result = result.replace(/\{\{(\w+)\}\}/g, (_match, key) => vars[key] || '');

  // Clean up empty lines from conditional blocks
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}

interface InquiryVars {
  name: string;
  yachtName?: string;
  destinationName?: string;
}

export function getInquiryConfirmation(vars: InquiryVars): { subject: string; body: string } {
  const data = getTemplateData();

  const templateVars: Record<string, string> = {
    name: vars.name,
    yachtName: vars.yachtName || '',
    destinationName: vars.destinationName || '',
    signature: data.signatureText,
    senderName: data.senderName,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
  };

  return {
    subject: render(data.inquirySubject, templateVars),
    body: render(data.inquiryBody, templateVars),
  };
}

interface WelcomeVars {
  name?: string | null;
  unsubscribeToken: string;
}

export function getWelcomeEmail(vars: WelcomeVars): { subject: string; body: string } {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mediteranayachting.com';
  const data = getTemplateData();

  const templateVars: Record<string, string> = {
    greeting: vars.name ? `Dear ${vars.name}` : 'Dear Explorer',
    name: vars.name || 'Explorer',
    signature: data.signatureText,
    senderName: data.senderName,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    unsubscribeUrl: `${baseUrl}/api/newsletter/unsubscribe?token=${vars.unsubscribeToken}`,
  };

  return {
    subject: render(data.welcomeSubject, templateVars),
    body: render(data.welcomeBody, templateVars),
  };
}
