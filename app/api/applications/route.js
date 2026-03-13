import { getApplications, createApplication } from '@/lib/db';
import { ok, created, badRequest, withErrorHandler, parseBody, validateRequired } from '@/lib/api-helpers';

export const GET = withErrorHandler(async (request) => {
  const apps = await getApplications();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const excludeDrafts = searchParams.get('excludeDrafts');

  let filtered = apps;
  if (userId) filtered = filtered.filter(a => a.userId === userId);
  if (status) filtered = filtered.filter(a => a.status === status);
  if (excludeDrafts === 'true') filtered = filtered.filter(a => a.status !== 'draft');

  return ok(filtered);
});

export const POST = withErrorHandler(async (request) => {
  const body = await parseBody(request);
  if (!body) return badRequest('Invalid JSON body');

  const app = await createApplication(body);
  return created(app);
});
