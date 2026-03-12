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

export async function GET() {
  const messages = await readMessages();
  return NextResponse.json(messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
}

export async function POST(request) {
  const data = await request.json();
  const messages = await readMessages();
  const message = {
    id: Date.now().toString(),
    name: data.name || '',
    email: data.email || '',
    subject: data.subject || '',
    message: data.message || '',
    status: 'unread', // unread, read, replied
    repliedAt: null,
    replyText: null,
    createdAt: new Date().toISOString(),
  };
  messages.push(message);
  await writeMessages(messages);
  return NextResponse.json(message, { status: 201 });
}
