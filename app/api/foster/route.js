import { NextResponse } from 'next/server';
import { getFosters, createFoster } from '@/lib/db';

export async function GET() {
  const fosters = await getFosters();
  fosters.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json(fosters);
}

export async function POST(request) {
  const body = await request.json();
  const foster = await createFoster(body);
  return NextResponse.json(foster, { status: 201 });
}
