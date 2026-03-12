import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const FILE = join(process.cwd(), 'lib/data/lost-found.json');
function read() { return existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf-8')) : []; }
function write(data) { writeFileSync(FILE, JSON.stringify(data, null, 2)); }

export async function GET(req, { params }) {
  const { id } = await params;
  const item = read().find(x => x.id === id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  const updates = await req.json();
  const data = read();
  const idx = data.findIndex(x => x.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data[idx] = { ...data[idx], ...updates, updatedAt: new Date().toISOString() };
  write(data);
  return NextResponse.json(data[idx]);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const data = read().filter(x => x.id !== id);
  write(data);
  return NextResponse.json({ ok: true });
}
