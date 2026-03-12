import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth-helpers';

/**
 * GET /api/auth/me — Returns the current authenticated user from the cookie.
 * Used by client components to verify session and get user data.
 */
export async function GET() {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone || '',
      createdAt: user.createdAt,
    },
  });
}
