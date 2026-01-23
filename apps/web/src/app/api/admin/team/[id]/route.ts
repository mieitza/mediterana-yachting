import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, teamMembers } from '@/lib/db';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const member = db.select().from(teamMembers).where(eq(teamMembers.id, id)).get();

    if (!member) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existingMember = db.select().from(teamMembers).where(eq(teamMembers.id, id)).get();

    if (!existingMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    const updatedMember = {
      name: body.name,
      role: body.role,
      image: body.image || null,
      bio: body.bio || null,
      email: body.email || null,
      linkedin: body.linkedin || null,
      order: body.order || 0,
      updatedAt: new Date(),
    };

    db.update(teamMembers).set(updatedMember).where(eq(teamMembers.id, id)).run();

    return NextResponse.json({ ...existingMember, ...updatedMember });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existingMember = db.select().from(teamMembers).where(eq(teamMembers.id, id)).get();

    if (!existingMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    db.delete(teamMembers).where(eq(teamMembers.id, id)).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
