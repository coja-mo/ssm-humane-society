import { NextResponse } from 'next/server';
import { getAnnouncements, updateAnnouncement, deleteAnnouncement } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const items = await getAnnouncements();
  const item = items.find(i => i.id === id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const item = await updateAnnouncement(id, body);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await deleteAnnouncement(id);
  return NextResponse.json({ success: true });
}
