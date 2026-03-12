import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'lib/data');
function loadJSON(file) {
  const path = join(DATA_DIR, file);
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf-8')) : [];
}

function getMonthLabel(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || '6months'; // 6months, 12months, all

  const pets = loadJSON('pets.json');
  const apps = loadJSON('applications.json');
  const donations = loadJSON('donations.json');
  const volunteers = loadJSON('volunteers.json');
  const fosters = loadJSON('fosters.json');
  const events = loadJSON('events.json');
  const messages = loadJSON('messages.json');
  const intakes = loadJSON('intakes.json');
  const lostFound = loadJSON('lost-found.json');

  const now = new Date();
  const monthsBack = period === '12months' ? 12 : period === 'all' ? 120 : 6;
  const cutoff = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);

  // Monthly trends
  const months = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: getMonthLabel(d), start: d, end: new Date(d.getFullYear(), d.getMonth() + 1, 0) });
  }

  const trends = months.map(m => {
    const inRange = (arr, field = 'createdAt') => arr.filter(x => {
      const d = new Date(x[field]);
      return d >= m.start && d <= m.end;
    }).length;

    return {
      month: m.label,
      adoptions: apps.filter(a => a.status === 'approved' && new Date(a.updatedAt || a.createdAt) >= m.start && new Date(a.updatedAt || a.createdAt) <= m.end).length,
      applications: inRange(apps),
      donations: inRange(donations),
      donationAmount: donations.filter(d => new Date(d.createdAt) >= m.start && new Date(d.createdAt) <= m.end).reduce((sum, d) => sum + (d.amount || 0), 0),
      intakes: inRange(intakes),
      volunteers: inRange(volunteers),
      fosters: inRange(fosters),
    };
  });

  // Aggregate stats
  const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const avgDonation = donations.length ? (totalDonations / donations.length).toFixed(2) : 0;
  const totalVolunteerHours = volunteers.reduce((sum, v) => sum + (v.totalHours || 0), 0);

  // Pet type breakdown
  const petBreakdown = {};
  pets.forEach(p => { petBreakdown[p.type || 'other'] = (petBreakdown[p.type || 'other'] || 0) + 1; });

  // Status breakdown
  const statusBreakdown = {};
  pets.forEach(p => { statusBreakdown[p.status || 'available'] = (statusBreakdown[p.status || 'available'] || 0) + 1; });

  // Application status breakdown
  const appStatus = {};
  apps.forEach(a => { appStatus[a.status || 'submitted'] = (appStatus[a.status || 'submitted'] || 0) + 1; });

  // Age distribution
  const ageGroups = { 'Puppy/Kitten (0-1)': 0, 'Young (1-3)': 0, 'Adult (3-7)': 0, 'Senior (7+)': 0 };
  pets.forEach(p => {
    const age = parseInt(p.age) || 0;
    if (age <= 1) ageGroups['Puppy/Kitten (0-1)']++;
    else if (age <= 3) ageGroups['Young (1-3)']++;
    else if (age <= 7) ageGroups['Adult (3-7)']++;
    else ageGroups['Senior (7+)']++;
  });

  return NextResponse.json({
    summary: {
      totalPets: pets.length,
      availablePets: pets.filter(p => p.status === 'available').length,
      totalApplications: apps.length,
      approvedApplications: apps.filter(a => a.status === 'approved').length,
      pendingApplications: apps.filter(a => a.status === 'submitted').length,
      totalDonations: totalDonations,
      donationCount: donations.length,
      avgDonation: parseFloat(avgDonation),
      totalVolunteers: volunteers.length,
      activeVolunteers: volunteers.filter(v => v.status === 'active').length,
      totalVolunteerHours,
      totalFosters: fosters.length,
      activeFosters: fosters.filter(f => f.status === 'active' || f.status === 'approved').length,
      totalEvents: events.length,
      upcomingEvents: events.filter(e => new Date(e.date) > now).length,
      totalMessages: messages.length,
      unreadMessages: messages.filter(m => m.status === 'unread').length,
      totalIntakes: intakes.length,
      lostFound: { lost: lostFound.filter(l => l.type === 'lost' && l.status === 'active').length, found: lostFound.filter(l => l.type === 'found' && l.status === 'active').length, resolved: lostFound.filter(l => l.status === 'resolved').length },
    },
    trends,
    breakdowns: {
      petTypes: petBreakdown,
      petStatus: statusBreakdown,
      applicationStatus: appStatus,
      ageDistribution: ageGroups,
    },
  });
}
