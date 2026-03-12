import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'lib', 'data');

// Generic JSON file helpers
async function readJSON(filename) {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, filename), 'utf8');
    return JSON.parse(data);
  } catch { return []; }
}

async function writeJSON(filename, data) {
  await fs.writeFile(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

async function readJSONObject(filename) {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, filename), 'utf8');
    return JSON.parse(data);
  } catch { return {}; }
}

async function writeJSONObject(filename, data) {
  await fs.writeFile(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

// ============ PETS ============
export async function getPets() { return readJSON('pets.json'); }
export async function savePets(pets) { return writeJSON('pets.json', pets); }
export async function getPetById(id) {
  const pets = await getPets();
  return pets.find(p => p.id === id) || null;
}
export async function createPet(data) {
  const pets = await getPets();
  const pet = {
    ...data,
    id: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    dateAdded: new Date().toISOString().split('T')[0],
    status: data.status || 'available',
    medicalNotes: data.medicalNotes || [],
    weight: data.weight || null,
    microchipId: data.microchipId || null,
    spayedNeutered: data.spayedNeutered || false,
    vaccinated: data.vaccinated || false,
    intakeDate: data.intakeDate || new Date().toISOString().split('T')[0],
    intakeType: data.intakeType || 'surrender',
    fosterHome: data.fosterHome || null,
    adoptionFee: data.adoptionFee || 0,
  };
  pets.push(pet);
  await savePets(pets);
  return pet;
}
export async function updatePet(id, data) {
  const pets = await getPets();
  const idx = pets.findIndex(p => p.id === id);
  if (idx === -1) return null;
  pets[idx] = { ...pets[idx], ...data, updatedAt: new Date().toISOString() };
  await savePets(pets);
  return pets[idx];
}
export async function deletePet(id) {
  let pets = await getPets();
  const len = pets.length;
  pets = pets.filter(p => p.id !== id);
  await savePets(pets);
  return pets.length < len;
}

// ============ APPLICATIONS ============
export async function getApplications() { return readJSON('applications.json'); }
export async function saveApplications(apps) { return writeJSON('applications.json', apps); }
export async function getApplicationById(id) {
  const apps = await getApplications();
  return apps.find(a => a.id === id) || null;
}
export async function createApplication(data) {
  const apps = await getApplications();
  const app = {
    id: Date.now().toString(),
    ...data,
    status: 'submitted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
    assignedTo: null,
    reviewDate: null,
    visitDate: null,
    homeCheckDate: null,
    homeCheckResult: null,
  };
  apps.push(app);
  await saveApplications(apps);
  return app;
}
export async function updateApplication(id, data) {
  const apps = await getApplications();
  const idx = apps.findIndex(a => a.id === id);
  if (idx === -1) return null;
  apps[idx] = { ...apps[idx], ...data, updatedAt: new Date().toISOString() };
  await saveApplications(apps);
  return apps[idx];
}
export async function addApplicationNote(id, note) {
  const apps = await getApplications();
  const idx = apps.findIndex(a => a.id === id);
  if (idx === -1) return null;
  if (!apps[idx].notes) apps[idx].notes = [];
  apps[idx].notes.push({
    id: Date.now().toString(),
    text: note.text,
    author: note.author || 'Staff',
    createdAt: new Date().toISOString(),
  });
  apps[idx].updatedAt = new Date().toISOString();
  await saveApplications(apps);
  return apps[idx];
}
export async function deleteApplication(id) {
  let apps = await getApplications();
  apps = apps.filter(a => a.id !== id);
  await saveApplications(apps);
  return true;
}

// ============ DONATIONS ============
export async function getDonations() { return readJSON('donations.json'); }
export async function saveDonations(donations) { return writeJSON('donations.json', donations); }
export async function createDonation(data) {
  const donations = await getDonations();
  const donation = {
    id: Date.now().toString(),
    ...data,
    amount: Number(data.amount) || 0,
    type: data.type || 'one-time', // one-time, monthly, in-kind
    category: data.category || 'general', // general, medical, food, shelter, event
    status: data.status || 'completed',
    paymentMethod: data.paymentMethod || 'online',
    receiptSent: false,
    taxReceiptNumber: data.amount >= 20 ? `TR-${Date.now()}` : null,
    donorName: data.donorName || 'Anonymous',
    donorEmail: data.donorEmail || '',
    donorPhone: data.donorPhone || '',
    isAnonymous: data.isAnonymous || false,
    dedicatedTo: data.dedicatedTo || null,
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
  };
  donations.push(donation);
  await saveDonations(donations);
  return donation;
}
export async function updateDonation(id, data) {
  const donations = await getDonations();
  const idx = donations.findIndex(d => d.id === id);
  if (idx === -1) return null;
  donations[idx] = { ...donations[idx], ...data, updatedAt: new Date().toISOString() };
  await saveDonations(donations);
  return donations[idx];
}
export async function deleteDonation(id) {
  let donations = await getDonations();
  donations = donations.filter(d => d.id !== id);
  await saveDonations(donations);
  return true;
}
export async function getDonationStats() {
  const donations = await getDonations();
  const now = new Date();
  const thisMonth = donations.filter(d => {
    const date = new Date(d.createdAt);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const thisYear = donations.filter(d => new Date(d.createdAt).getFullYear() === now.getFullYear());
  return {
    totalAllTime: donations.reduce((s, d) => s + (d.amount || 0), 0),
    totalThisMonth: thisMonth.reduce((s, d) => s + (d.amount || 0), 0),
    totalThisYear: thisYear.reduce((s, d) => s + (d.amount || 0), 0),
    countAllTime: donations.length,
    countThisMonth: thisMonth.length,
    monthlyRecurring: donations.filter(d => d.type === 'monthly').reduce((s, d) => s + (d.amount || 0), 0),
    averageDonation: donations.length ? Math.round(donations.reduce((s, d) => s + (d.amount || 0), 0) / donations.length) : 0,
    topDonors: Object.entries(
      donations.reduce((acc, d) => {
        if (d.isAnonymous) return acc;
        acc[d.donorName] = (acc[d.donorName] || 0) + (d.amount || 0);
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, total]) => ({ name, total })),
  };
}

// ============ EVENTS ============
export async function getEvents() { return readJSON('events.json'); }
export async function saveEvents(events) { return writeJSON('events.json', events); }
export async function createEvent(data) {
  const events = await getEvents();
  const event = {
    id: Date.now().toString(),
    ...data,
    title: data.title || '',
    description: data.description || '',
    date: data.date || new Date().toISOString().split('T')[0],
    startTime: data.startTime || '10:00',
    endTime: data.endTime || '14:00',
    location: data.location || 'SSM Humane Society',
    type: data.type || 'general', // adoption-day, fundraiser, education, general, volunteer
    capacity: data.capacity || null,
    registrations: [],
    status: data.status || 'upcoming', // upcoming, active, completed, cancelled
    image: data.image || null,
    requiresRegistration: data.requiresRegistration || false,
    isPublic: data.isPublic !== false,
    createdAt: new Date().toISOString(),
    createdBy: data.createdBy || 'admin',
  };
  events.push(event);
  await saveEvents(events);
  return event;
}
export async function updateEvent(id, data) {
  const events = await getEvents();
  const idx = events.findIndex(e => e.id === id);
  if (idx === -1) return null;
  events[idx] = { ...events[idx], ...data, updatedAt: new Date().toISOString() };
  await saveEvents(events);
  return events[idx];
}
export async function deleteEvent(id) {
  let events = await getEvents();
  events = events.filter(e => e.id !== id);
  await saveEvents(events);
  return true;
}
export async function registerForEvent(eventId, registration) {
  const events = await getEvents();
  const idx = events.findIndex(e => e.id === eventId);
  if (idx === -1) return null;
  if (!events[idx].registrations) events[idx].registrations = [];
  events[idx].registrations.push({
    id: Date.now().toString(),
    ...registration,
    registeredAt: new Date().toISOString(),
  });
  await saveEvents(events);
  return events[idx];
}

// ============ FOSTER APPLICATIONS ============
export async function getFosters() { return readJSON('fosters.json'); }
export async function saveFosters(fosters) { return writeJSON('fosters.json', fosters); }
export async function createFoster(data) {
  const fosters = await getFosters();
  const foster = {
    id: Date.now().toString(),
    ...data,
    status: data.status || 'applied', // applied, approved, active, completed, declined
    petId: data.petId || null,
    petName: data.petName || null,
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    experience: data.experience || '',
    housingType: data.housingType || '',
    hasYard: data.hasYard || false,
    hasPets: data.hasPets || false,
    currentPets: data.currentPets || '',
    hasChildren: data.hasChildren || false,
    childrenAges: data.childrenAges || '',
    availability: data.availability || '',
    preferredPetTypes: data.preferredPetTypes || [],
    vetReference: data.vetReference || '',
    emergencyContact: data.emergencyContact || '',
    notes: [],
    homeCheckCompleted: false,
    homeCheckDate: null,
    homeCheckResult: null,
    suppliesProvided: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  fosters.push(foster);
  await saveFosters(fosters);
  return foster;
}
export async function updateFoster(id, data) {
  const fosters = await getFosters();
  const idx = fosters.findIndex(f => f.id === id);
  if (idx === -1) return null;
  fosters[idx] = { ...fosters[idx], ...data, updatedAt: new Date().toISOString() };
  await saveFosters(fosters);
  return fosters[idx];
}
export async function deleteFoster(id) {
  let fosters = await getFosters();
  fosters = fosters.filter(f => f.id !== id);
  await saveFosters(fosters);
  return true;
}

// ============ VOLUNTEERS ============
export async function getVolunteers() { return readJSON('volunteers.json'); }
export async function saveVolunteers(vols) { return writeJSON('volunteers.json', vols); }
export async function createVolunteer(data) {
  const vols = await getVolunteers();
  const vol = {
    id: Date.now().toString(),
    ...data,
    status: data.status || 'applied', // applied, approved, active, inactive
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    email: data.email || '',
    phone: data.phone || '',
    dateOfBirth: data.dateOfBirth || null,
    skills: data.skills || [],
    availability: data.availability || [],
    interests: data.interests || [], // dog-walking, cat-socialization, events, admin, cleaning, transport
    emergencyContact: data.emergencyContact || '',
    emergencyPhone: data.emergencyPhone || '',
    hoursLogged: 0,
    shifts: [],
    trainingCompleted: [],
    backgroundCheckDate: null,
    backgroundCheckStatus: null,
    notes: [],
    startDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  vols.push(vol);
  await saveVolunteers(vols);
  return vol;
}
export async function updateVolunteer(id, data) {
  const vols = await getVolunteers();
  const idx = vols.findIndex(v => v.id === id);
  if (idx === -1) return null;
  vols[idx] = { ...vols[idx], ...data, updatedAt: new Date().toISOString() };
  await saveVolunteers(vols);
  return vols[idx];
}
export async function deleteVolunteer(id) {
  let vols = await getVolunteers();
  vols = vols.filter(v => v.id !== id);
  await saveVolunteers(vols);
  return true;
}
export async function logVolunteerHours(id, hours, shiftInfo) {
  const vols = await getVolunteers();
  const idx = vols.findIndex(v => v.id === id);
  if (idx === -1) return null;
  vols[idx].hoursLogged = (vols[idx].hoursLogged || 0) + hours;
  if (!vols[idx].shifts) vols[idx].shifts = [];
  vols[idx].shifts.push({
    id: Date.now().toString(),
    hours,
    date: shiftInfo.date || new Date().toISOString().split('T')[0],
    task: shiftInfo.task || 'general',
    notes: shiftInfo.notes || '',
    loggedAt: new Date().toISOString(),
  });
  vols[idx].updatedAt = new Date().toISOString();
  await saveVolunteers(vols);
  return vols[idx];
}

// ============ ANNOUNCEMENTS ============
export async function getAnnouncements() { return readJSON('announcements.json'); }
export async function saveAnnouncements(items) { return writeJSON('announcements.json', items); }
export async function createAnnouncement(data) {
  const items = await getAnnouncements();
  const item = {
    id: Date.now().toString(),
    title: data.title || '',
    content: data.content || '',
    category: data.category || 'general', // general, urgent, event, adoption, fundraiser
    priority: data.priority || 'normal', // low, normal, high, urgent
    isPublished: data.isPublished !== false,
    isPinned: data.isPinned || false,
    publishDate: data.publishDate || new Date().toISOString(),
    expiryDate: data.expiryDate || null,
    author: data.author || 'Staff',
    image: data.image || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.push(item);
  await saveAnnouncements(items);
  return item;
}
export async function updateAnnouncement(id, data) {
  const items = await getAnnouncements();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
  await saveAnnouncements(items);
  return items[idx];
}
export async function deleteAnnouncement(id) {
  let items = await getAnnouncements();
  items = items.filter(i => i.id !== id);
  await saveAnnouncements(items);
  return true;
}

// ============ SETTINGS ============
export async function getSettings() {
  return readJSONObject('settings.json');
}
export async function saveSettings(settings) {
  return writeJSONObject('settings.json', settings);
}
export async function updateSettings(patch) {
  const settings = await getSettings();
  const updated = { ...settings, ...patch, updatedAt: new Date().toISOString() };
  await saveSettings(updated);
  return updated;
}

// ============ USERS ============
export async function getAllUsers() { return readJSON('users.json'); }
export async function updateUser(id, data) {
  const users = await getAllUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  const { password, ...rest } = data;
  users[idx] = { ...users[idx], ...rest, updatedAt: new Date().toISOString() };
  await writeJSON('users.json', users);
  return users[idx];
}

// ============ ACTIVITY LOG ============
export async function getActivityLog() { return readJSON('activity.json'); }
export async function saveActivityLog(log) { return writeJSON('activity.json', log); }
export async function logActivity(action, entity, entityId, details, actor) {
  const log = await getActivityLog();
  const entry = {
    id: Date.now().toString(),
    action,       // 'created', 'updated', 'deleted', 'status-changed'
    entity,       // 'pet', 'application', 'donation', 'event', 'foster', 'volunteer', 'announcement', 'settings'
    entityId,
    details: details || '',
    actor: actor || 'system',
    timestamp: new Date().toISOString(),
  };
  log.unshift(entry); // newest first
  // Keep last 500 entries
  if (log.length > 500) log.length = 500;
  await saveActivityLog(log);
  return entry;
}

// ============ AGGREGATE STATS ============
export async function getDashboardStats() {
  const [pets, apps, donations, events, fosters, volunteers] = await Promise.all([
    getPets(), getApplications(), getDonations(), getEvents(), getFosters(), getVolunteers()
  ]);
  
  const now = new Date();
  const thisMonth = (arr, dateField = 'createdAt') => arr.filter(i => {
    const d = new Date(i[dateField]);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  
  return {
    pets: {
      total: pets.length,
      available: pets.filter(p => p.status === 'available').length,
      adopted: pets.filter(p => p.status === 'adopted').length,
      fostered: pets.filter(p => p.status === 'fostered').length,
      dogs: pets.filter(p => p.type === 'dog').length,
      cats: pets.filter(p => p.type === 'cat').length,
      critters: pets.filter(p => p.type === 'critter').length,
    },
    applications: {
      total: apps.length,
      pending: apps.filter(a => a.status === 'submitted').length,
      reviewing: apps.filter(a => a.status === 'reviewing').length,
      approved: apps.filter(a => a.status === 'approved').length,
      adopted: apps.filter(a => a.status === 'adopted').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
      thisMonth: thisMonth(apps).length,
    },
    donations: {
      totalAmount: donations.reduce((s, d) => s + (d.amount || 0), 0),
      thisMonth: thisMonth(donations).reduce((s, d) => s + (d.amount || 0), 0),
      count: donations.length,
      monthlyRecurring: donations.filter(d => d.type === 'monthly').reduce((s, d) => s + (d.amount || 0), 0),
    },
    events: {
      total: events.length,
      upcoming: events.filter(e => e.status === 'upcoming').length,
      totalRegistrations: events.reduce((s, e) => s + (e.registrations?.length || 0), 0),
    },
    fosters: {
      total: fosters.length,
      active: fosters.filter(f => f.status === 'active').length,
      applied: fosters.filter(f => f.status === 'applied').length,
      approved: fosters.filter(f => f.status === 'approved').length,
    },
    volunteers: {
      total: volunteers.length,
      active: volunteers.filter(v => v.status === 'active').length,
      applied: volunteers.filter(v => v.status === 'applied').length,
      totalHours: volunteers.reduce((s, v) => s + (v.hoursLogged || 0), 0),
    },
  };
}
