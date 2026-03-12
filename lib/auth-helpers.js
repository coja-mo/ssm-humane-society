import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ssm-humane-society-secret-key-2026';

/**
 * Get the current authenticated user from the auth-token cookie.
 * Use this in Server Components and API routes (not Edge middleware — use jose there).
 * Returns user payload or null if not authenticated.
 */
export async function getServerUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Require authentication — throws if not logged in.
 * Returns the user payload.
 */
export async function requireAuth() {
  const user = await getServerUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

/**
 * Require admin/staff role — throws if not admin or staff.
 * Returns the user payload.
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (!['admin', 'staff'].includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
}

/**
 * Get user from request headers (set by middleware).
 * Faster than cookie verification since middleware already verified.
 */
export function getUserFromHeaders(request) {
  const id = request.headers.get('x-user-id');
  const role = request.headers.get('x-user-role');
  const email = request.headers.get('x-user-email');
  if (!id) return null;
  return { id, role, email };
}
