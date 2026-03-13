import { getPets, createPet } from '@/lib/db';
import { ok, created, badRequest, serverError, withErrorHandler, parseBody, validateRequired } from '@/lib/api-helpers';

export const GET = withErrorHandler(async () => {
  const pets = await getPets();
  return ok(pets);
});

export const POST = withErrorHandler(async (request) => {
  const body = await parseBody(request);
  if (!body) return badRequest('Invalid JSON body');

  const { valid, missing } = validateRequired(body, ['name', 'type']);
  if (!valid) return badRequest(`Missing required fields: ${missing.join(', ')}`);

  const pet = await createPet(body);
  return created(pet);
});
