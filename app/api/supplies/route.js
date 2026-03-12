import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

const FILE = join(process.cwd(), 'lib/data/supplies.json');
function read() { return existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf-8')) : []; }
function write(data) { writeFileSync(FILE, JSON.stringify(data, null, 2)); }

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req) {
  const body = await req.json();
  const item = {
    id: uuid(),
    name: body.name || '',
    category: body.category || 'food', // food, medical, cleaning, toys, bedding, equipment, other
    quantity: body.quantity || 0,
    unit: body.unit || 'units', // units, lbs, oz, bags, boxes, cases, bottles
    minQuantity: body.minQuantity || 5,
    cost: body.cost || 0,
    supplier: body.supplier || '',
    location: body.location || 'Main Storage',
    notes: body.notes || '',
    lastOrdered: body.lastOrdered || null,
    status: body.quantity <= body.minQuantity ? 'low' : 'in-stock',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const data = read();
  data.unshift(item);
  write(data);
  return NextResponse.json(item, { status: 201 });
}
