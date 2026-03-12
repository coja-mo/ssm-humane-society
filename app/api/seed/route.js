import { NextResponse } from 'next/server';

// Seed data script — POST to /api/seed to populate demo data
export async function POST() {
  const { createDonation, createEvent, createVolunteer, createFoster, createAnnouncement, logActivity } = await import('@/lib/db');

  // Seed donations
  const donationSeeds = [
    { amount: 250, donorName: 'Margaret Thompson', donorEmail: 'margaret@email.com', type: 'one-time', category: 'general', paymentMethod: 'online', dedicatedTo: 'In memory of Buddy' },
    { amount: 100, donorName: 'Robert Chen', donorEmail: 'rchen@email.com', type: 'monthly', category: 'medical', paymentMethod: 'e-transfer' },
    { amount: 50, donorName: 'Sarah Williams', donorEmail: 'sarah.w@email.com', type: 'one-time', category: 'food', paymentMethod: 'cash' },
    { amount: 500, donorName: 'Northern Credit Union', donorEmail: 'community@ncu.ca', type: 'one-time', category: 'shelter', paymentMethod: 'cheque', notes: 'Annual corporate donation' },
    { amount: 75, donorName: 'Emily Parker', donorEmail: 'eparker@email.com', type: 'monthly', category: 'general', paymentMethod: 'online' },
    { amount: 25, donorName: 'Anonymous', isAnonymous: true, type: 'one-time', category: 'general', paymentMethod: 'online' },
    { amount: 1000, donorName: 'Rotary Club of SSM', donorEmail: 'rotary@ssm.ca', type: 'one-time', category: 'medical', paymentMethod: 'cheque', notes: 'Spring fundraiser proceeds' },
    { amount: 30, donorName: 'Lisa Tremblay', donorEmail: 'lisa.t@email.com', type: 'one-time', category: 'food', paymentMethod: 'online', dedicatedTo: 'In honour of my cat Whiskers' },
  ];

  // Seed events
  const eventSeeds = [
    { title: 'Online 50/50 Raffle!', description: 'Support the shelter and win big with our online 50/50 raffle. Tickets available now!', date: null, type: 'fundraiser', status: 'active', location: 'Online', isPublic: true },
    { title: 'Spring Adoption Event', description: 'Meet our adoptable animals in person. Reduced adoption fees for the day!', date: '2026-04-12', startTime: '10:00', endTime: '16:00', type: 'adoption-day', location: 'SSM Humane Society', capacity: 100, requiresRegistration: false },
    { title: 'Paws in the Park', description: 'Join us at Bellevue Park for a day of fun, food, and furry friends. Dog-friendly activities, vendors, and more!', date: '2026-06-14', startTime: '11:00', endTime: '15:00', type: 'general', location: 'Bellevue Park', capacity: 200 },
    { title: 'Golf Tournament Fundraiser', description: 'Tee off for a great cause! Annual golf tournament with prizes, dinner, and silent auction.', date: '2026-07-18', startTime: '08:00', endTime: '18:00', type: 'fundraiser', location: 'Sault Golf Club', capacity: 72, requiresRegistration: true },
    { title: 'Volunteer Orientation', description: 'New volunteer orientation and training session. Learn about our shelter operations and how you can help.', date: '2026-04-05', startTime: '09:00', endTime: '12:00', type: 'volunteer', location: 'SSM Humane Society', capacity: 20, requiresRegistration: true },
    { title: 'Pet First Aid Workshop', description: 'Free workshop on pet first aid basics. Open to the public. Learn essential skills to keep your pets safe.', date: '2026-05-10', startTime: '13:00', endTime: '15:00', type: 'education', location: 'SSM Public Library', capacity: 30, requiresRegistration: true },
  ];

  // Seed volunteers
  const volunteerSeeds = [
    { firstName: 'Amanda', lastName: 'Bouchard', email: 'amanda.b@email.com', phone: '705-555-0101', interests: ['dog-walking', 'events'], availability: ['weekend-morning', 'weekend-afternoon'], skills: ['animal handling', 'first aid'], status: 'active', hoursLogged: 124 },
    { firstName: 'Tyler', lastName: 'MacLeod', email: 'tyler.m@email.com', phone: '705-555-0102', interests: ['cat-socialization', 'photography'], availability: ['weekday-evening'], skills: ['photography', 'social media'], status: 'active', hoursLogged: 87 },
    { firstName: 'Priya', lastName: 'Sharma', email: 'priya.s@email.com', phone: '705-555-0103', interests: ['admin', 'fundraising'], availability: ['weekday-morning', 'weekday-afternoon'], skills: ['data entry', 'bookkeeping'], status: 'active', hoursLogged: 203 },
    { firstName: 'Jake', lastName: 'Wilson', email: 'jake.w@email.com', phone: '705-555-0104', interests: ['dog-walking', 'cleaning'], availability: ['weekend-morning'], skills: ['animal handling'], status: 'applied' },
    { firstName: 'Nancy', lastName: 'Lafleur', email: 'nancy.l@email.com', phone: '705-555-0105', interests: ['cat-socialization', 'transport'], availability: ['weekday-morning'], skills: ['driving', 'animal handling'], status: 'approved' },
  ];

  // Seed fosters
  const fosterSeeds = [
    { firstName: 'Sarah', lastName: 'Patel', email: 'sarah.patel@email.com', phone: '705-555-0201', address: '123 Queen St, SSM', housingType: 'house', hasYard: true, hasPets: true, currentPets: 'One cat, Mimi', hasChildren: true, childrenAges: '8, 12', experience: 'Have fostered 3 litters of kittens previously', status: 'active', petName: 'Luna', preferredPetTypes: ['kittens', 'cats'] },
    { firstName: 'David', lastName: 'Murphy', email: 'david.m@email.com', phone: '705-555-0202', address: '456 Great Northern Rd, SSM', housingType: 'house', hasYard: true, hasPets: false, hasChildren: false, experience: 'Lifelong dog owner, experienced with large breeds', status: 'approved', preferredPetTypes: ['dogs'] },
    { firstName: 'Claire', lastName: 'Dubois', email: 'claire.d@email.com', phone: '705-555-0203', address: '789 Second Line, SSM', housingType: 'apartment', hasYard: false, hasPets: false, hasChildren: false, experience: 'First-time foster but very enthusiastic and has done research', status: 'applied', preferredPetTypes: ['cats'] },
  ];

  // Seed announcements
  const announcementSeeds = [
    { title: 'Spring Adoption Event Coming April 12!', content: 'Mark your calendars! We\'re hosting a special spring adoption event with reduced fees. Meet dozens of adorable animals looking for their forever homes.', category: 'adoption', priority: 'high', isPublished: true, isPinned: true },
    { title: 'New Volunteer Orientation - April 5', content: 'Interested in volunteering? Join us for our next orientation session. No experience necessary — just a love for animals!', category: 'general', priority: 'normal', isPublished: true },
    { title: 'Emergency Medical Fund Drive', content: 'Help us reach our $5,000 goal for emergency veterinary care. Every dollar helps save a life. Donate online or in person.', category: 'fundraiser', priority: 'urgent', isPublished: true, isPinned: true },
    { title: 'Holiday Hours Update', content: 'We will be closed on Good Friday (April 3) and Easter Monday (April 6). Regular hours resume Tuesday, April 7.', category: 'general', priority: 'high', isPublished: true, expiryDate: '2026-04-07' },
    { title: 'Success Story: Buddy Finds His Forever Home!', content: 'After 6 months at the shelter, our sweet boy Buddy has been adopted by the Johnson family. We\'re so happy for him!', category: 'adoption', priority: 'normal', isPublished: true },
  ];

  // Execute all seeds
  const results = { donations: 0, events: 0, volunteers: 0, fosters: 0, announcements: 0 };
  
  for (const d of donationSeeds) { await createDonation(d); results.donations++; }
  for (const e of eventSeeds) { await createEvent(e); results.events++; }
  for (const v of volunteerSeeds) { await createVolunteer(v); results.volunteers++; }
  for (const f of fosterSeeds) { await createFoster(f); results.fosters++; }
  for (const a of announcementSeeds) { await createAnnouncement(a); results.announcements++; }

  await logActivity('created', 'system', 'seed', `Seeded: ${results.donations} donations, ${results.events} events, ${results.volunteers} volunteers, ${results.fosters} fosters, ${results.announcements} announcements`, 'admin');

  return NextResponse.json({ success: true, seeded: results });
}
