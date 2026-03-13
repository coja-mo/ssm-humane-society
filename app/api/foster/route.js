import { NextResponse } from 'next/server';
import { getFosters, createFoster } from '@/lib/db';

export async function GET(request) {
  let fosters = await getFosters();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const excludeDrafts = searchParams.get('excludeDrafts');

  if (userId) fosters = fosters.filter(f => f.userId === userId);
  if (status) fosters = fosters.filter(f => f.status === status);
  if (excludeDrafts === 'true') fosters = fosters.filter(f => f.status !== 'draft');

  fosters.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json(fosters);
}

export async function POST(request) {
  const body = await request.json();
  const foster = await createFoster(body);
  return NextResponse.json(foster, { status: 201 });
}
