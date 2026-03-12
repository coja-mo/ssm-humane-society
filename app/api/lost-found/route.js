import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

const FILE = join(process.cwd(), 'lib/data/lost-found.json');
function read() { return existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf-8')) : []; }
function write(data) { writeFileSync(FILE, JSON.stringify(data, null, 2)); }

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req) {
  const body = await req.json();
  const item = {
    id: uuid(),
    type: body.type || 'lost', // 'lost' or 'found'
    status: body.status || 'active',
    petType: body.petType || 'dog',
    name: body.name || '',
    breed: body.breed || 'Unknown',
    color: body.color || '',
    description: body.description || '',
    location: body.location || '',
    date: body.date || new Date().toISOString().split('T')[0],
    contactName: body.contactName || '',
    contactPhone: body.contactPhone || '',
    contactEmail: body.contactEmail || '',
    imageUrl: body.imageUrl || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const data = read();
  data.unshift(item);
  write(data);
  return NextResponse.json(item, { status: 201 });
}
