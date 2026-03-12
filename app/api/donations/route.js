import { NextResponse } from 'next/server';
import { getDonations, createDonation, getDonationStats } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const stats = searchParams.get('stats');
  if (stats === 'true') {
    const donationStats = await getDonationStats();
    return NextResponse.json(donationStats);
  }
  const donations = await getDonations();
  // Sort newest first
  donations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return NextResponse.json(donations);
}

export async function POST(request) {
  const body = await request.json();
  const donation = await createDonation(body);
  return NextResponse.json(donation, { status: 201 });
}
