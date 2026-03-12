import { NextResponse } from 'next/server';
import { getAnnouncements, createAnnouncement } from '@/lib/db';

export async function GET() {
  const items = await getAnnouncements();
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json(items);
}

export async function POST(request) {
  const body = await request.json();
  const item = await createAnnouncement(body);
  return NextResponse.json(item, { status: 201 });
}
