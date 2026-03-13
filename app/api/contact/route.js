import { promises as fs } from 'fs';
import path from 'path';
import { ok, created, badRequest, withErrorHandler, parseBody, validateRequired } from '@/lib/api-helpers';

const DATA_PATH = path.join(process.cwd(), 'lib', 'data', 'contact-messages.json');

async function getMessages() {
  try { return JSON.parse(await fs.readFile(DATA_PATH, 'utf8')); }
  catch { return []; }
}
async function saveMessages(msgs) { await fs.writeFile(DATA_PATH, JSON.stringify(msgs, null, 2)); }

export const GET = withErrorHandler(async () => {
  const messages = await getMessages();
  return ok(messages);
});

export const POST = withErrorHandler(async (request) => {
  const body = await parseBody(request);
  if (!body) return badRequest('Invalid JSON body');

  const { valid, missing } = validateRequired(body, ['name', 'email', 'message']);
  if (!valid) return badRequest(`Missing required fields: ${missing.join(', ')}`);

  const messages = await getMessages();
  const msg = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: body.name,
    email: body.email,
    subject: body.subject || 'General Inquiry',
    message: body.message,
    status: 'unread',
    createdAt: new Date().toISOString(),
  };
  messages.unshift(msg);
  await saveMessages(messages);
  return created(msg);
});
