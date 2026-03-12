import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const FILE = path.join(process.cwd(), 'lib', 'data', 'messages.json');

async function readMessages() {
  try {
    const data = await fs.readFile(FILE, 'utf8');
    return JSON.parse(data);
  } catch { return []; }
}

async function writeMessages(messages) {
  await fs.writeFile(FILE, JSON.stringify(messages, null, 2));
}

export async function GET(request, { params }) {
  const { id } = await params;
  const messages = await readMessages();
  const msg = messages.find(m => m.id === id);
  if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(msg);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const data = await request.json();
  const messages = await readMessages();
  const idx = messages.findIndex(m => m.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  messages[idx] = { ...messages[idx], ...data, updatedAt: new Date().toISOString() };
  await writeMessages(messages);
  return NextResponse.json(messages[idx]);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const messages = await readMessages();
  const filtered = messages.filter(m => m.id !== id);
  await writeMessages(filtered);
  return NextResponse.json({ success: true });
}
