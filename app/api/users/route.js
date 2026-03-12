import { NextResponse } from 'next/server';
import { getAllUsers, updateUser } from '@/lib/db';

export async function GET() {
  const users = await getAllUsers();
  // Strip passwords from response
  const sanitized = users.map(({ password, ...rest }) => rest);
  return NextResponse.json(sanitized);
}
