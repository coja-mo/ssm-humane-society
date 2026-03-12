import { NextResponse } from 'next/server';
import { getEvents, createEvent } from '@/lib/db';

export async function GET() {
  const events = await getEvents();
  events.sort((a, b) => new Date(b.date) - new Date(a.date));
  return NextResponse.json(events);
}

export async function POST(request) {
  const body = await request.json();
  const event = await createEvent(body);
  return NextResponse.json(event, { status: 201 });
}
