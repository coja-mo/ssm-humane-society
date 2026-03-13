import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'lib', 'data', 'contact-messages.json');

async function getMessages() {
  try { return JSON.parse(await fs.readFile(DATA_PATH, 'utf8')); }
  catch { return []; }
}
async function saveMessages(msgs) { await fs.writeFile(DATA_PATH, JSON.stringify(msgs, null, 2)); }

export async function GET() {
  const messages = await getMessages();
  return NextResponse.json(messages);
}

export async function POST(request) {
  const body = await request.json();
  const messages = await getMessages();
  const msg = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: body.name || 'Anonymous',
    email: body.email || '',
    subject: body.subject || 'General Inquiry',
    message: body.message || '',
    status: 'unread',
    createdAt: new Date().toISOString(),
  };
  messages.unshift(msg);
  await saveMessages(messages);
  return NextResponse.json(msg, { status: 201 });
}
