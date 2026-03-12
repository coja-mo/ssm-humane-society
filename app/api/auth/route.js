import { NextResponse } from 'next/server';
import { createUser, authenticateUser, createToken } from '@/lib/auth';

export async function POST(request) {
  const body = await request.json();
  const { action, email, password, name, phone } = body;

  if (action === 'register') {
    const result = await createUser(email, password, name, 'adopter', phone);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    const token = createToken(result.user);
    const res = NextResponse.json({ user: result.user });
    res.cookies.set('auth-token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' });
    return res;
  }

  if (action === 'login') {
    const result = await authenticateUser(email, password);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 401 });
    const token = createToken(result.user);
    const res = NextResponse.json({ user: result.user });
    res.cookies.set('auth-token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' });
    return res;
  }

  if (action === 'logout') {
    const res = NextResponse.json({ success: true });
    res.cookies.delete('auth-token');
    return res;
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
