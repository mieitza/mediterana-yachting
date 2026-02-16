'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Info } from 'lucide-react';

const defaults = {
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

interface EmailTemplatesFormProps {
  templates?: Record<string, any> | null;
}

export function EmailTemplatesForm({ templates }: EmailTemplatesFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [senderName, setSenderName] = useState(templates?.senderName || defaults.senderName);
  const [contactEmail, setContactEmail] = useState(templates?.contactEmail || defaults.contactEmail);
  const [contactPhone, setContactPhone] = useState(templates?.contactPhone || defaults.contactPhone);
  const [signatureText, setSignatureText] = useState(templates?.signatureText || defaults.signatureText);

  const [inquirySubject, setInquirySubject] = useState(templates?.inquirySubject || defaults.inquirySubject);
  const [inquiryBody, setInquiryBody] = useState(templates?.inquiryBody || defaults.inquiryBody);

  const [welcomeSubject, setWelcomeSubject] = useState(templates?.welcomeSubject || defaults.welcomeSubject);
  const [welcomeBody, setWelcomeBody] = useState(templates?.welcomeBody || defaults.welcomeBody);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/email-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName,
          contactEmail,
          contactPhone,
          signatureText,
          inquirySubject,
          inquiryBody,
          welcomeSubject,
          welcomeBody,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      router.refresh();
      alert('Email templates saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save email templates');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Variable Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Available template variables:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <div><code className="bg-blue-100 px-1 rounded">{'{{name}}'}</code> — Customer&apos;s name</div>
              <div><code className="bg-blue-100 px-1 rounded">{'{{greeting}}'}</code> — &quot;Dear Name&quot; or &quot;Dear Explorer&quot;</div>
              <div><code className="bg-blue-100 px-1 rounded">{'{{yachtName}}'}</code> — Yacht name (if applicable)</div>
              <div><code className="bg-blue-100 px-1 rounded">{'{{destinationName}}'}</code> — Destination name (if applicable)</div>
              <div><code className="bg-blue-100 px-1 rounded">{'{{signature}}'}</code> — Your signature text (below)</div>
              <div><code className="bg-blue-100 px-1 rounded">{'{{senderName}}'}</code> — Business name</div>
              <div><code className="bg-blue-100 px-1 rounded">{'{{contactEmail}}'}</code> — Contact email</div>
              <div><code className="bg-blue-100 px-1 rounded">{'{{contactPhone}}'}</code> — Contact phone</div>
              <div><code className="bg-blue-100 px-1 rounded">{'{{unsubscribeUrl}}'}</code> — Unsubscribe link (newsletter only)</div>
            </div>
            <p className="mt-2 text-xs">
              Use <code className="bg-blue-100 px-1 rounded">{'{{#yachtName}}...{{/yachtName}}'}</code> to conditionally show a line only when the variable has a value.
            </p>
          </div>
        </div>
      </div>

      {/* Shared Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Sender Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senderName">Sender Name</Label>
            <Input id="senderName" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input id="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="signatureText">Signature</Label>
          <textarea
            id="signatureText"
            value={signatureText}
            onChange={(e) => setSignatureText(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-slate-500">Used wherever {'{{signature}}'} appears in templates.</p>
        </div>
      </div>

      {/* Inquiry Confirmation */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Inquiry Confirmation Email</h3>
        <p className="text-sm text-slate-500 mb-4">Sent to customers after they submit an inquiry form.</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inquirySubject">Subject Line</Label>
            <Input id="inquirySubject" value={inquirySubject} onChange={(e) => setInquirySubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inquiryBody">Email Body</Label>
            <textarea
              id="inquiryBody"
              value={inquiryBody}
              onChange={(e) => setInquiryBody(e.target.value)}
              rows={16}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Newsletter Welcome */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Newsletter Welcome Email</h3>
        <p className="text-sm text-slate-500 mb-4">Sent to new newsletter subscribers.</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcomeSubject">Subject Line</Label>
            <Input id="welcomeSubject" value={welcomeSubject} onChange={(e) => setWelcomeSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="welcomeBody">Email Body</Label>
            <textarea
              id="welcomeBody"
              value={welcomeBody}
              onChange={(e) => setWelcomeBody(e.target.value)}
              rows={20}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 -mx-6 px-6 py-4 mt-8 flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Templates
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
