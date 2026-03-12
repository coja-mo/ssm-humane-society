import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const APPS_PATH = path.join(process.cwd(), 'lib', 'data', 'applications.json');

async function getApps() {
  try { return JSON.parse(await fs.readFile(APPS_PATH, 'utf8')); }
  catch { return []; }
}
async function saveApps(apps) { await fs.writeFile(APPS_PATH, JSON.stringify(apps, null, 2)); }

export async function GET() {
  const apps = await getApps();
  return NextResponse.json(apps);
}

export async function POST(request) {
  const body = await request.json();
  const apps = await getApps();
  const app = { id: Date.now().toString(), ...body, status: 'submitted', createdAt: new Date().toISOString(), notes: [] };
  apps.push(app);
  await saveApps(apps);
  return NextResponse.json(app, { status: 201 });
}
