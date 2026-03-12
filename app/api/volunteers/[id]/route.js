import { NextResponse } from 'next/server';
import { getVolunteers, updateVolunteer, deleteVolunteer, logVolunteerHours } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const volunteers = await getVolunteers();
  const vol = volunteers.find(v => v.id === id);
  if (!vol) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(vol);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  if (body._action === 'log-hours') {
    const vol = await logVolunteerHours(id, body.hours, body.shiftInfo || {});
    if (!vol) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(vol);
  }
  const vol = await updateVolunteer(id, body);
  if (!vol) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(vol);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await deleteVolunteer(id);
  return NextResponse.json({ success: true });
}
