import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PETS_PATH = path.join(process.cwd(), 'lib', 'data', 'pets.json');

async function getPets() {
  try { return JSON.parse(await fs.readFile(PETS_PATH, 'utf8')); }
  catch { return []; }
}
async function savePets(pets) { await fs.writeFile(PETS_PATH, JSON.stringify(pets, null, 2)); }

export async function GET() {
  const pets = await getPets();
  return NextResponse.json(pets);
}

export async function POST(request) {
  const body = await request.json();
  const pets = await getPets();
  const pet = { ...body, id: body.name.toLowerCase().replace(/\s+/g, '-'), dateAdded: new Date().toISOString().split('T')[0], status: 'available' };
  pets.push(pet);
  await savePets(pets);
  return NextResponse.json(pet, { status: 201 });
}
