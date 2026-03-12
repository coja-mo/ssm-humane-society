import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

const FILE = join(process.cwd(), 'lib/data/visits.json');
function read() { return existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf-8')) : []; }
function write(data) { writeFileSync(FILE, JSON.stringify(data, null, 2)); }

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req) {
  const body = await req.json();
  const visit = {
    id: uuid(),
    visitorName: body.visitorName || '',
    visitorEmail: body.visitorEmail || '',
    visitorPhone: body.visitorPhone || '',
    date: body.date || '',
    time: body.time || '',
    purpose: body.purpose || 'meet-pets',
    petId: body.petId || null,
    petName: body.petName || '',
    notes: body.notes || '',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  const data = read();
  data.unshift(visit);
  write(data);
  return NextResponse.json(visit, { status: 201 });
}
