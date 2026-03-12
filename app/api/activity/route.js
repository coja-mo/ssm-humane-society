import { getActivityLog, logActivity } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const entity = searchParams.get('entity');
  const limit = Number(searchParams.get('limit')) || 50;
  
  let log = await getActivityLog();
  if (entity) log = log.filter(e => e.entity === entity);
  return NextResponse.json(log.slice(0, limit));
}

export async function POST(request) {
  const { action, entity, entityId, details, actor } = await request.json();
  const entry = await logActivity(action, entity, entityId, details, actor);
  return NextResponse.json(entry, { status: 201 });
}
