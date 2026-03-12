import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const APPS_PATH = path.join(process.cwd(), 'lib', 'data', 'applications.json');

async function getApps() {
  try { return JSON.parse(await fs.readFile(APPS_PATH, 'utf8')); }
  catch { return []; }
}
async function saveApps(apps) { await fs.writeFile(APPS_PATH, JSON.stringify(apps, null, 2)); }

export async function GET(request, { params }) {
  const { id } = await params;
  const apps = await getApps();
  const app = apps.find(a => a.id === id);
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(app);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const apps = await getApps();
  const idx = apps.findIndex(a => a.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  apps[idx] = { ...apps[idx], ...body, updatedAt: new Date().toISOString() };
  await saveApps(apps);
  return NextResponse.json(apps[idx]);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  let apps = await getApps();
  apps = apps.filter(a => a.id !== id);
  await saveApps(apps);
  return NextResponse.json({ success: true });
}
