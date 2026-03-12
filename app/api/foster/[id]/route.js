import { NextResponse } from 'next/server';
import { getFosters, updateFoster, deleteFoster } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const fosters = await getFosters();
  const foster = fosters.find(f => f.id === id);
  if (!foster) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(foster);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const foster = await updateFoster(id, body);
  if (!foster) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(foster);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await deleteFoster(id);
  return NextResponse.json({ success: true });
}
