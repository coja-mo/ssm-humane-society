import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

const FILE = join(process.cwd(), 'lib/data/pets.json');
function read() { return existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf-8')) : []; }
function write(data) { writeFileSync(FILE, JSON.stringify(data, null, 2)); }

// GET /api/pets/[id]/waitlist — get waitlist for a pet
export async function GET(req, { params }) {
  const { id } = await params;
  const pets = read();
  const pet = pets.find(p => p.id === id);
  if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
  return NextResponse.json(pet.waitlist || []);
}

// POST /api/pets/[id]/waitlist — add someone to the waitlist
export async function POST(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const pets = read();
  const idx = pets.findIndex(p => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

  const entry = {
    id: uuid(),
    name: body.name || '',
    email: body.email || '',
    phone: body.phone || '',
    notes: body.notes || '',
    priority: body.priority || 'normal',
    createdAt: new Date().toISOString(),
  };

  if (!pets[idx].waitlist) pets[idx].waitlist = [];
  // Check for duplicate email
  if (pets[idx].waitlist.some(w => w.email === entry.email)) {
    return NextResponse.json({ error: 'Already on waitlist' }, { status: 409 });
  }
  pets[idx].waitlist.push(entry);
  write(pets);

  return NextResponse.json(entry, { status: 201 });
}
