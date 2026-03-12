import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

const FILE = join(process.cwd(), 'lib/data/kennels.json');
function read() { return existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf-8')) : []; }
function write(data) { writeFileSync(FILE, JSON.stringify(data, null, 2)); }

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req) {
  const body = await req.json();
  const kennel = {
    id: uuid(),
    name: body.name || '',
    building: body.building || 'Main',
    type: body.type || 'standard', // standard, isolation, medical, outdoor, nursery
    capacity: body.capacity || 1,
    status: body.status || 'available', // available, occupied, maintenance, reserved
    assignedPetId: body.assignedPetId || null,
    assignedPetName: body.assignedPetName || '',
    size: body.size || 'medium', // small, medium, large, xlarge
    features: body.features || [], // heated, outdoor-access, window, camera
    notes: body.notes || '',
    lastCleaned: body.lastCleaned || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const data = read();
  data.push(kennel);
  write(data);
  return NextResponse.json(kennel, { status: 201 });
}
