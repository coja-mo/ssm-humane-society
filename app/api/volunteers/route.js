import { NextResponse } from 'next/server';
import { getVolunteers, createVolunteer } from '@/lib/db';

export async function GET() {
  const volunteers = await getVolunteers();
  volunteers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json(volunteers);
}

export async function POST(request) {
  const body = await request.json();
  const volunteer = await createVolunteer(body);
  return NextResponse.json(volunteer, { status: 201 });
}
