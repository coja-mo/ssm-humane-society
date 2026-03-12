import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PETS_PATH = path.join(process.cwd(), 'lib', 'data', 'pets.json');

async function getPets() {
  try { return JSON.parse(await fs.readFile(PETS_PATH, 'utf8')); }
  catch { return []; }
}
async function savePets(pets) { await fs.writeFile(PETS_PATH, JSON.stringify(pets, null, 2)); }

export async function GET(request, { params }) {
  const { id } = await params;
  const pets = await getPets();
  const pet = pets.find(p => p.id === id);
  if (!pet) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(pet);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const pets = await getPets();
  const idx = pets.findIndex(p => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  pets[idx] = { ...pets[idx], ...body };
  await savePets(pets);
  return NextResponse.json(pets[idx]);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  let pets = await getPets();
  pets = pets.filter(p => p.id !== id);
  await savePets(pets);
  return NextResponse.json({ success: true });
}
