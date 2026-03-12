import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

const FILE = join(process.cwd(), 'lib/data/pets.json');
function read() { return existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf-8')) : []; }
function write(data) { writeFileSync(FILE, JSON.stringify(data, null, 2)); }

// GET /api/pets/[id]/medical — get medical records for a pet
export async function GET(req, { params }) {
  const { id } = await params;
  const pets = read();
  const pet = pets.find(p => p.id === id);
  if (!pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
  return NextResponse.json(pet.medicalRecords || []);
}

// POST /api/pets/[id]/medical — add a medical record
export async function POST(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const pets = read();
  const idx = pets.findIndex(p => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });

  const record = {
    id: uuid(),
    type: body.type || 'checkup', // vaccination, surgery, medication, checkup, test, other
    title: body.title || '',
    description: body.description || '',
    veterinarian: body.veterinarian || '',
    date: body.date || new Date().toISOString().split('T')[0],
    nextDue: body.nextDue || null,
    cost: body.cost || 0,
    notes: body.notes || '',
    createdAt: new Date().toISOString(),
  };

  if (!pets[idx].medicalRecords) pets[idx].medicalRecords = [];
  pets[idx].medicalRecords.unshift(record);
  pets[idx].updatedAt = new Date().toISOString();
  write(pets);

  return NextResponse.json(record, { status: 201 });
}
