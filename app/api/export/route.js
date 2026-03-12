import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'lib/data');

function loadJSON(file) {
  const path = join(DATA_DIR, file);
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf-8')) : [];
}

function toCSV(data, fields) {
  if (!data.length) return '';
  const header = fields.join(',');
  const rows = data.map(item =>
    fields.map(f => {
      let val = item[f] ?? '';
      if (typeof val === 'object') val = JSON.stringify(val);
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    }).join(',')
  );
  return [header, ...rows].join('\n');
}

const EXPORTABLE = {
  pets: {
    file: 'pets.json',
    fields: ['id', 'name', 'type', 'breed', 'age', 'sex', 'weight', 'status', 'description', 'createdAt'],
  },
  applications: {
    file: 'applications.json',
    fields: ['id', 'petName', 'applicantName', 'email', 'phone', 'status', 'createdAt'],
  },
  donations: {
    file: 'donations.json',
    fields: ['id', 'donorName', 'email', 'amount', 'type', 'status', 'createdAt'],
  },
  volunteers: {
    file: 'volunteers.json',
    fields: ['id', 'firstName', 'lastName', 'email', 'phone', 'status', 'totalHours', 'createdAt'],
  },
  fosters: {
    file: 'fosters.json',
    fields: ['id', 'firstName', 'lastName', 'email', 'phone', 'status', 'createdAt'],
  },
  events: {
    file: 'events.json',
    fields: ['id', 'title', 'date', 'time', 'location', 'status', 'createdAt'],
  },
  messages: {
    file: 'messages.json',
    fields: ['id', 'name', 'email', 'subject', 'message', 'status', 'createdAt'],
  },
  'lost-found': {
    file: 'lost-found.json',
    fields: ['id', 'type', 'petType', 'name', 'breed', 'color', 'location', 'date', 'status', 'contactName', 'contactEmail', 'createdAt'],
  },
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get('entity');
  const format = searchParams.get('format') || 'csv';

  if (!entity || !EXPORTABLE[entity]) {
    return NextResponse.json(
      { error: 'Invalid entity. Available: ' + Object.keys(EXPORTABLE).join(', ') },
      { status: 400 }
    );
  }

  const config = EXPORTABLE[entity];
  const data = loadJSON(config.file);

  if (format === 'json') {
    return NextResponse.json(data);
  }

  const csv = toCSV(data, config.fields);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${entity}-export-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
