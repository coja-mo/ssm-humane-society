import { NextResponse } from 'next/server';
import { getEvents, updateEvent, deleteEvent, registerForEvent } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const events = await getEvents();
  const event = events.find(e => e.id === id);
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(event);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  if (body._action === 'register') {
    const event = await registerForEvent(id, body.registration);
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(event);
  }
  const event = await updateEvent(id, body);
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(event);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await deleteEvent(id);
  return NextResponse.json({ success: true });
}
