import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'lib', 'data', 'newsletter.json');

async function getSubs() {
  try { return JSON.parse(await fs.readFile(DATA_PATH, 'utf8')); }
  catch { return []; }
}
async function saveSubs(subs) { await fs.writeFile(DATA_PATH, JSON.stringify(subs, null, 2)); }

export async function GET() {
  const subs = await getSubs();
  return NextResponse.json({ subscribers: subs, count: subs.length });
}

export async function POST(request) {
  const body = await request.json();
  const subs = await getSubs();

  // Prevent duplicate emails
  if (subs.find(s => s.email === body.email)) {
    return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
  }

  const sub = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    email: body.email,
    subscribedAt: new Date().toISOString(),
    active: true,
  };
  subs.push(sub);
  await saveSubs(subs);
  return NextResponse.json(sub, { status: 201 });
}
