import { NextResponse } from 'next/server';
import { getApplications, addApplicationNote } from '@/lib/db';

// Add note to an application
export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const app = await addApplicationNote(id, body);
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(app);
}
