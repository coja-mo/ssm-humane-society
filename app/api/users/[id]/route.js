import { NextResponse } from 'next/server';
import { updateUser, getAllUsers } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const users = await getAllUsers();
  const user = users.find(u => u.id === id);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { password, ...sanitized } = user;
  return NextResponse.json(sanitized);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const user = await updateUser(id, body);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { password, ...sanitized } = user;
  return NextResponse.json(sanitized);
}
