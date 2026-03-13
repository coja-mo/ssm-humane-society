import { getDonations, createDonation, getDonationStats } from '@/lib/db';
import { ok, created, badRequest, withErrorHandler, parseBody } from '@/lib/api-helpers';

export const GET = withErrorHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('stats') === 'true') {
    const stats = await getDonationStats();
    return ok(stats);
  }
  const donations = await getDonations();
  donations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return ok(donations);
});

export const POST = withErrorHandler(async (request) => {
  const body = await parseBody(request);
  if (!body) return badRequest('Invalid JSON body');
  const donation = await createDonation(body);
  return created(donation);
});
