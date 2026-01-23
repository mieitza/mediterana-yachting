import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, teamMembers } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allTeamMembers = await db.select().from(teamMembers).all();
    return NextResponse.json(allTeamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const newMember = {
      id: nanoid(),
      name: body.name,
      role: body.role,
      image: body.image || null,
      bio: body.bio || null,
      email: body.email || null,
      linkedin: body.linkedin || null,
      order: body.order || 0,
    };

    db.insert(teamMembers).values(newMember).run();

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}
