import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

const FILE = join(process.cwd(), 'lib/data/intakes.json');
function read() { return existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf-8')) : []; }
function write(data) { writeFileSync(FILE, JSON.stringify(data, null, 2)); }

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req) {
  const body = await req.json();
  const intake = {
    id: uuid(),
    type: body.type || 'surrender', // surrender, stray, transfer, confiscation, return
    status: body.status || 'pending', // pending, accepted, declined, completed
    // Animal info
    petType: body.petType || 'dog',
    petName: body.petName || '',
    breed: body.breed || 'Unknown',
    age: body.age || '',
    sex: body.sex || 'unknown',
    weight: body.weight || '',
    color: body.color || '',
    spayedNeutered: body.spayedNeutered || false,
    vaccinated: body.vaccinated || false,
    microchipped: body.microchipped || false,
    medicalNotes: body.medicalNotes || '',
    behaviorNotes: body.behaviorNotes || '',
    reason: body.reason || '',
    // Owner info (for surrenders)
    ownerName: body.ownerName || '',
    ownerEmail: body.ownerEmail || '',
    ownerPhone: body.ownerPhone || '',
    ownerAddress: body.ownerAddress || '',
    // Location info (for strays)
    foundLocation: body.foundLocation || '',
    // Processing
    scheduledDate: body.scheduledDate || '',
    assignedTo: body.assignedTo || '',
    notes: body.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const data = read();
  data.unshift(intake);
  write(data);
  return NextResponse.json(intake, { status: 201 });
}
