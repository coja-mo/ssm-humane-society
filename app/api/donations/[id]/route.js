import { NextResponse } from 'next/server';
import { getDonations, updateDonation, deleteDonation } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const donations = await getDonations();
  const donation = donations.find(d => d.id === id);
  if (!donation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(donation);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const donation = await updateDonation(id, body);
  if (!donation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(donation);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await deleteDonation(id);
  return NextResponse.json({ success: true });
}
