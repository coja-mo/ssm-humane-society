import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const APPS_PATH = path.join(process.cwd(), 'lib', 'data', 'applications.json');

async function getApps() {
  try { return JSON.parse(await fs.readFile(APPS_PATH, 'utf8')); }
  catch { return []; }
}
async function saveApps(apps) { await fs.writeFile(APPS_PATH, JSON.stringify(apps, null, 2)); }

export async function GET(request) {
  const apps = await getApps();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const excludeDrafts = searchParams.get('excludeDrafts');

  let filtered = apps;
  if (userId) filtered = filtered.filter(a => a.userId === userId);
  if (status) filtered = filtered.filter(a => a.status === status);
  if (excludeDrafts === 'true') filtered = filtered.filter(a => a.status !== 'draft');

  return NextResponse.json(filtered);
}

export async function POST(request) {
  const body = await request.json();
  const apps = await getApps();
  const app = {
    id: Date.now().toString(),
    ...body,
    status: body.status || 'submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
    reviewChecklist: {
      vetReferenceContacted: false,
      vetReferenceVerified: false,
      landlordContacted: false,
      homeCheckScheduled: false,
      homeCheckPassed: null,
      allMembersMet: false,
    },
    scoring: {
      housingSuitability: null,
      petExperience: null,
      careCommitment: null,
      overallMatch: null,
    },
    assignedTo: null,
    reviewDate: null,
    homeCheckDate: null,
    homeCheckNotes: '',
  };
  apps.push(app);
  await saveApps(apps);
  return NextResponse.json(app, { status: 201 });
}
