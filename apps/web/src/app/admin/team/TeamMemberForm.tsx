'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { ImagePicker } from '@/components/admin/ImagePicker';
import type { TeamMember } from '@/lib/db/schema';

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().max(300, 'Bio must be 300 characters or less').optional(),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  order: z.coerce.number().min(0).default(0),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

interface TeamMemberFormProps {
  member?: TeamMember;
}

export function TeamMemberForm({ member }: TeamMemberFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const initialImage = member?.image ? JSON.parse(member.image) : null;
  const [memberImage, setMemberImage] = useState<{ url: string; alt?: string } | null>(initialImage);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: member?.name || '',
      role: member?.role || '',
      bio: member?.bio || '',
      email: member?.email || '',
      linkedin: member?.linkedin || '',
      order: member?.order || 0,
    },
  });

  const onSubmit = async (data: TeamMemberFormData) => {
    setIsSaving(true);

    try {
      const payload = {
        ...data,
        image: memberImage ? JSON.stringify(memberImage) : null,
      };

      const url = member ? `/api/admin/team/${member.id}` : '/api/admin/team';
      const method = member ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save team member');
      }

      router.push('/admin/team');
      router.refresh();
    } catch (error) {
      console.error('Error saving team member:', error);
      alert(error instanceof Error ? error.message : 'Failed to save team member');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input id="role" {...register('role')} placeholder="e.g., Charter Specialist" />
            {errors.role && (
              <p className="text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              {...register('bio')}
              rows={3}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Brief bio (max 300 characters)"
            />
            {errors.bio && (
              <p className="text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input id="order" type="number" {...register('order')} min={0} />
            <p className="text-xs text-slate-500">Lower numbers appear first</p>
          </div>
        </div>
      </div>

      {/* Photo */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Photo</h3>

        <ImagePicker
          label="Team Member Photo"
          value={memberImage}
          onChange={setMemberImage}
          placeholder="Select a photo from media library"
        />
      </div>

      {/* Contact */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="name@mediterana.com" />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" {...register('linkedin')} placeholder="https://linkedin.com/in/..." />
            {errors.linkedin && (
              <p className="text-sm text-red-600">{errors.linkedin.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/team')}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {member ? 'Update Team Member' : 'Add Team Member'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
