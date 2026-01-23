'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Calendar, Ship, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  yachtId: string | null;
  destinationId: string | null;
  source: string | null;
  status: 'new' | 'read' | 'replied' | 'archived';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
];

export default function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<string>('new');
  const [inquiryId, setInquiryId] = useState<string>('');

  useEffect(() => {
    async function loadInquiry() {
      const { id } = await params;
      setInquiryId(id);

      try {
        const response = await fetch(`/api/admin/inquiries/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/admin/inquiries');
            return;
          }
          throw new Error('Failed to fetch inquiry');
        }
        const data = await response.json();
        setInquiry(data);
        setNotes(data.notes || '');
        setStatus(data.status);

        // Mark as read if new
        if (data.status === 'new') {
          await fetch(`/api/admin/inquiries/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'read' }),
          });
          setStatus('read');
        }
      } catch (error) {
        console.error('Error loading inquiry:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInquiry();
  }, [params, router]);

  const handleUpdate = async () => {
    if (!inquiryId) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update inquiry');
      }

      alert('Inquiry updated successfully');
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Failed to update inquiry');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!inquiryId || !confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete inquiry');
      }

      router.push('/admin/inquiries');
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <AdminHeader title="Inquiry" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="flex flex-col h-full">
        <AdminHeader title="Inquiry Not Found" />
        <div className="flex-1 p-6">
          <p>The inquiry could not be found.</p>
          <Link href="/admin/inquiries" className="text-primary hover:underline">
            Back to Inquiries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Inquiry Details">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/inquiries">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </AdminHeader>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="text-lg font-medium text-slate-600">
                    {inquiry.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{inquiry.name}</p>
                  <p className="text-sm text-slate-500">Name</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <a href={`mailto:${inquiry.email}`} className="font-medium text-primary hover:underline">
                    {inquiry.email}
                  </a>
                  <p className="text-sm text-slate-500">Email</p>
                </div>
              </div>

              {inquiry.phone && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <a href={`tel:${inquiry.phone}`} className="font-medium text-primary hover:underline">
                      {inquiry.phone}
                    </a>
                    <p className="text-sm text-slate-500">Phone</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500">Submitted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Message</h2>

            {inquiry.source && (
              <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                {inquiry.source === 'yacht' && <Ship className="h-4 w-4" />}
                {inquiry.source === 'destination' && <MapPin className="h-4 w-4" />}
                <span>
                  Interest: {inquiry.source === 'yacht' ? 'Chartering a Yacht' :
                            inquiry.source === 'destination' ? 'Exploring a Destination' :
                            'General Inquiry'}
                </span>
              </div>
            )}

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-700 whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </div>

          {/* Status & Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Status & Notes</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full md:w-48 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Internal Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add internal notes about this inquiry..."
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleUpdate} disabled={updating}>
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button variant="outline" asChild>
                  <a href={`mailto:${inquiry.email}?subject=Re: Your inquiry to Mediterana Yachting`}>
                    Reply via Email
                  </a>
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
