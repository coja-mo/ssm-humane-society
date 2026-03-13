'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import OverviewTab from '@/components/admin/OverviewTab';
import PetsTab from '@/components/admin/PetsTab';
import ApplicationsTab from '@/components/admin/ApplicationsTab';
import DonationsTab from '@/components/admin/DonationsTab';
import EventsTab from '@/components/admin/EventsTab';
import FostersTab from '@/components/admin/FostersTab';
import VolunteersTab from '@/components/admin/VolunteersTab';
import AnnouncementsTab from '@/components/admin/AnnouncementsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import LostFoundTab from '@/components/admin/LostFoundTab';
import IntakeTab from '@/components/admin/IntakeTab';
import SuppliesTab from '@/components/admin/SuppliesTab';
import KennelsTab from '@/components/admin/KennelsTab';
import MessagesTab from '@/components/admin/MessagesTab';
import ReportsTab from '@/components/admin/ReportsTab';
import ActivityTab from '@/components/admin/ActivityTab';
import UsersTab from '@/components/admin/UsersTab';

/* ─── SVG ICONS ─── */
const Icons = {
  overview: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  pets: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10c-2 0-3 1-3 3 0 1.5 1 3 3 3s3-1.5 3-3c0-2-1-3-3-3z"/><circle cx="7" cy="6" r="2"/><circle cx="17" cy="6" r="2"/><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/></svg>,
  applications: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  donations: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  events: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  fosters: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  volunteers: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  announcements: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 003 3h14a3 3 0 003-3zm-2-2V9a7 7 0 00-14 0v6"/><path d="M12 24a2 2 0 002-2h-4a2 2 0 002 2z"/></svg>,
  messages: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  activity: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  lostfound: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  refresh: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  back: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  seed: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  mail: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  intake: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
  reports: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
  supplies: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  kennels: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
};

const TAB_CONFIG = [
  { id: 'overview',      label: 'Overview',      icon: 'overview',      section: 'main' },
  { id: 'pets',          label: 'Pets',           icon: 'pets',          section: 'main' },
  { id: 'applications',  label: 'Applications',   icon: 'applications',  section: 'main' },
  { id: 'intake',        label: 'Intake',         icon: 'intake',        section: 'main' },
  { id: 'donations',     label: 'Donations',      icon: 'donations',     section: 'operations' },
  { id: 'events',        label: 'Events',         icon: 'events',        section: 'operations' },
  { id: 'fosters',       label: 'Fosters',        icon: 'fosters',       section: 'operations' },
  { id: 'volunteers',    label: 'Volunteers',     icon: 'volunteers',    section: 'operations' },
  { id: 'lostfound',     label: 'Lost & Found',   icon: 'lostfound',     section: 'operations' },
  { id: 'supplies',      label: 'Supplies',       icon: 'supplies',      section: 'operations' },
  { id: 'kennels',       label: 'Kennels',        icon: 'kennels',       section: 'operations' },
  { id: 'announcements', label: 'News',           icon: 'announcements', section: 'communications' },
  { id: 'messages',      label: 'Messages',       icon: 'messages',      section: 'communications' },
  { id: 'reports',       label: 'Reports',        icon: 'reports',       section: 'system' },
  { id: 'users',         label: 'Users',          icon: 'users',         section: 'system' },
  { id: 'activity',      label: 'Activity',       icon: 'activity',      section: 'system' },
  { id: 'settings',      label: 'Settings',       icon: 'settings',      section: 'system' },
];

const SECTIONS = {
  main: 'Management',
  operations: 'Operations',
  communications: 'Communication',
  system: 'System',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pets, setPets] = useState([]);
  const [apps, setApps] = useState([]);
  const [donations, setDonations] = useState([]);
  const [events, setEvents] = useState([]);
  const [fosters, setFosters] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [settings, setSettings] = useState({});
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activity, setActivity] = useState([]);
  const [lostFound, setLostFound] = useState([]);
  const [intakes, setIntakes] = useState([]);
  const [reports, setReports] = useState(null);
  const [supplies, setSupplies] = useState([]);
  const [kennels, setKennels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [tabKey, setTabKey] = useState(0);

  const switchTab = (id) => {
    setTabKey(k => k + 1);
    setActiveTab(id);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, p, a, d, ev, f, v, an, st, u, msg, act, lf, ink, rpt, sup, ken] = await Promise.all([
        fetch('/api/stats').then(r => r.json()).catch(() => null),
        fetch('/api/pets').then(r => r.json()).catch(() => []),
        fetch('/api/applications').then(r => r.json()).catch(() => []),
        fetch('/api/donations').then(r => r.json()).catch(() => []),
        fetch('/api/events').then(r => r.json()).catch(() => []),
        fetch('/api/foster').then(r => r.json()).catch(() => []),
        fetch('/api/volunteers').then(r => r.json()).catch(() => []),
        fetch('/api/announcements').then(r => r.json()).catch(() => []),
        fetch('/api/settings').then(r => r.json()).catch(() => ({})),
        fetch('/api/users').then(r => r.json()).catch(() => []),
        fetch('/api/messages').then(r => r.json()).catch(() => []),
        fetch('/api/activity?limit=100').then(r => r.json()).catch(() => []),
        fetch('/api/lost-found').then(r => r.json()).catch(() => []),
        fetch('/api/intake').then(r => r.json()).catch(() => []),
        fetch('/api/reports').then(r => r.json()).catch(() => null),
        fetch('/api/supplies').then(r => r.json()).catch(() => []),
        fetch('/api/kennels').then(r => r.json()).catch(() => []),
      ]);
      setStats(s); setPets(Array.isArray(p) ? p : []);
      setApps(Array.isArray(a) ? a : []); setDonations(Array.isArray(d) ? d : []);
      setEvents(Array.isArray(ev) ? ev : []); setFosters(Array.isArray(f) ? f : []);
      setVolunteers(Array.isArray(v) ? v : []); setAnnouncements(Array.isArray(an) ? an : []);
      setSettings(st || {}); setUsers(Array.isArray(u) ? u : []);
      setMessages(Array.isArray(msg) ? msg : []); setActivity(Array.isArray(act) ? act : []);
      setLostFound(Array.isArray(lf) ? lf : []);
      setIntakes(Array.isArray(ink) ? ink : []); setReports(rpt);
      setSupplies(Array.isArray(sup) ? sup : []); setKennels(Array.isArray(ken) ? ken : []);
    } catch (err) { console.error('Load error:', err); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // === HANDLERS (same logic, preserved) ===
  const addPet = async (data) => { const res = await fetch('/api/pets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const pet = await res.json(); setPets(prev => [...prev, pet]); } };
  const updatePet = async (id, data) => { const res = await fetch(`/api/pets/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const pet = await res.json(); setPets(prev => prev.map(p => p.id === id ? pet : p)); } };
  const deletePet = async (id) => { await fetch(`/api/pets/${id}`, { method: 'DELETE' }); setPets(prev => prev.filter(p => p.id !== id)); };

  const updateAppStatus = async (id, status) => { await fetch(`/api/applications/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a)); };
  const addAppNote = async (id, note) => { const res = await fetch(`/api/applications/${id}/notes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(note) }); if (res.ok) { const app = await res.json(); setApps(prev => prev.map(a => a.id === id ? app : a)); } };
  const deleteApp = async (id) => { await fetch(`/api/applications/${id}`, { method: 'DELETE' }); setApps(prev => prev.filter(a => a.id !== id)); };
  const updateApp = async (id, data) => { const res = await fetch(`/api/applications/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const app = await res.json(); setApps(prev => prev.map(a => a.id === id ? app : a)); } };

  const addDonation = async (data) => { const res = await fetch('/api/donations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const d = await res.json(); setDonations(prev => [d, ...prev]); } };
  const updateDonation = async (id, data) => { const res = await fetch(`/api/donations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const d = await res.json(); setDonations(prev => prev.map(x => x.id === id ? d : x)); } };
  const deleteDonation = async (id) => { await fetch(`/api/donations/${id}`, { method: 'DELETE' }); setDonations(prev => prev.filter(d => d.id !== id)); };

  const addEvent = async (data) => { const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const e = await res.json(); setEvents(prev => [e, ...prev]); } };
  const updateEvent = async (id, data) => { const res = await fetch(`/api/events/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const e = await res.json(); setEvents(prev => prev.map(x => x.id === id ? e : x)); } };
  const deleteEvent = async (id) => { await fetch(`/api/events/${id}`, { method: 'DELETE' }); setEvents(prev => prev.filter(e => e.id !== id)); };

  const addFoster = async (data) => { const res = await fetch('/api/foster', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const f = await res.json(); setFosters(prev => [f, ...prev]); } };
  const updateFoster = async (id, data) => { const res = await fetch(`/api/foster/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const f = await res.json(); setFosters(prev => prev.map(x => x.id === id ? f : x)); } };
  const deleteFoster = async (id) => { await fetch(`/api/foster/${id}`, { method: 'DELETE' }); setFosters(prev => prev.filter(f => f.id !== id)); };

  const addVolunteer = async (data) => { const res = await fetch('/api/volunteers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const v = await res.json(); setVolunteers(prev => [v, ...prev]); } };
  const updateVolunteer = async (id, data) => { const res = await fetch(`/api/volunteers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const v = await res.json(); setVolunteers(prev => prev.map(x => x.id === id ? v : x)); } };
  const deleteVolunteer = async (id) => { await fetch(`/api/volunteers/${id}`, { method: 'DELETE' }); setVolunteers(prev => prev.filter(v => v.id !== id)); };
  const logVolunteerHours = async (id, hours, shiftInfo) => { const res = await fetch(`/api/volunteers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _action: 'log-hours', hours, shiftInfo }) }); if (res.ok) { const v = await res.json(); setVolunteers(prev => prev.map(x => x.id === id ? v : x)); } };

  const addAnnouncement = async (data) => { const res = await fetch('/api/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const a = await res.json(); setAnnouncements(prev => [a, ...prev]); } };
  const updateAnnouncement = async (id, data) => { const res = await fetch(`/api/announcements/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const a = await res.json(); setAnnouncements(prev => prev.map(x => x.id === id ? a : x)); } };
  const deleteAnnouncement = async (id) => { await fetch(`/api/announcements/${id}`, { method: 'DELETE' }); setAnnouncements(prev => prev.filter(a => a.id !== id)); };

  const saveSettings = async (data) => { const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const s = await res.json(); setSettings(s); } };

  // Messages handlers
  const markMessageRead = async (id) => { await fetch(`/api/messages/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'read' }) }); setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m)); };
  const deleteMessage = async (id) => { await fetch(`/api/messages/${id}`, { method: 'DELETE' }); setMessages(prev => prev.filter(m => m.id !== id)); };

  // Lost & Found handlers
  const addLostFound = async (data) => { const res = await fetch('/api/lost-found', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const lf = await res.json(); setLostFound(prev => [lf, ...prev]); } };
  const updateLostFound = async (id, data) => { const res = await fetch(`/api/lost-found/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const lf = await res.json(); setLostFound(prev => prev.map(x => x.id === id ? lf : x)); } };
  const deleteLostFound = async (id) => { await fetch(`/api/lost-found/${id}`, { method: 'DELETE' }); setLostFound(prev => prev.filter(lf => lf.id !== id)); };

  // Seed demo data
  const seedData = async () => { await fetch('/api/seed', { method: 'POST' }); load(); };

  // Intake handlers
  const addIntake = async (data) => { const res = await fetch('/api/intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const i = await res.json(); setIntakes(prev => [i, ...prev]); } };
  const updateIntake = async (id, data) => { const res = await fetch(`/api/intake/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const i = await res.json(); setIntakes(prev => prev.map(x => x.id === id ? i : x)); } };
  const deleteIntake = async (id) => { await fetch(`/api/intake/${id}`, { method: 'DELETE' }); setIntakes(prev => prev.filter(i => i.id !== id)); };

  // Supplies handlers
  const addSupply = async (data) => { const res = await fetch('/api/supplies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const s = await res.json(); setSupplies(prev => [s, ...prev]); } };
  const updateSupply = async (id, data) => { const res = await fetch(`/api/supplies/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const s = await res.json(); setSupplies(prev => prev.map(x => x.id === id ? s : x)); } };
  const deleteSupply = async (id) => { await fetch(`/api/supplies/${id}`, { method: 'DELETE' }); setSupplies(prev => prev.filter(s => s.id !== id)); };

  // Kennels handlers
  const addKennel = async (data) => { const res = await fetch('/api/kennels', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const k = await res.json(); setKennels(prev => [...prev, k]); } };
  const updateKennel = async (id, data) => { const res = await fetch(`/api/kennels/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { const k = await res.json(); setKennels(prev => prev.map(x => x.id === id ? k : x)); } };
  const deleteKennel = async (id) => { await fetch(`/api/kennels/${id}`, { method: 'DELETE' }); setKennels(prev => prev.filter(k => k.id !== id)); };

  // Admin search
  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults(null); return; }
    const lower = q.toLowerCase();
    const results = [];
    pets.filter(p => (p.name || '').toLowerCase().includes(lower) || (p.breed || '').toLowerCase().includes(lower)).forEach(p => results.push({ type: 'pet', label: `🐾 ${p.name} (${p.breed})`, tab: 'pets' }));
    apps.filter(a => (a.applicantName || '').toLowerCase().includes(lower) || (a.petName || '').toLowerCase().includes(lower)).forEach(a => results.push({ type: 'application', label: `📋 ${a.applicantName} → ${a.petName}`, tab: 'applications' }));
    volunteers.filter(v => `${v.firstName} ${v.lastName}`.toLowerCase().includes(lower)).forEach(v => results.push({ type: 'volunteer', label: `👥 ${v.firstName} ${v.lastName}`, tab: 'volunteers' }));
    fosters.filter(f => `${f.firstName} ${f.lastName}`.toLowerCase().includes(lower)).forEach(f => results.push({ type: 'foster', label: `🏠 ${f.firstName} ${f.lastName}`, tab: 'fosters' }));
    donations.filter(d => (d.donorName || '').toLowerCase().includes(lower)).forEach(d => results.push({ type: 'donation', label: `💝 ${d.donorName} — $${d.amount}`, tab: 'donations' }));
    events.filter(e => (e.title || '').toLowerCase().includes(lower)).forEach(e => results.push({ type: 'event', label: `📅 ${e.title}`, tab: 'events' }));
    messages.filter(m => (m.name || '').toLowerCase().includes(lower) || (m.subject || '').toLowerCase().includes(lower)).forEach(m => results.push({ type: 'message', label: `💬 ${m.name}: ${m.subject || 'No subject'}`, tab: 'messages' }));
    users.filter(u => (u.name || '').toLowerCase().includes(lower) || (u.email || '').toLowerCase().includes(lower)).forEach(u => results.push({ type: 'user', label: `👤 ${u.name} (${u.email})`, tab: 'users' }));
    setSearchResults(results.slice(0, 10));
  };

  const pendingApps = apps.filter(a => a.status === 'submitted');
  const pendingCount = pendingApps.length;
  const unreadMessages = messages.filter(m => m.status === 'unread').length;

  // Group tabs by section
  const grouped = {};
  TAB_CONFIG.forEach(t => { if (!grouped[t.section]) grouped[t.section] = []; grouped[t.section].push(t); });

  const roleColor = (role) => {
    switch (role) {
      case 'admin': return { bg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', text: '#fff' };
      case 'staff': return { bg: 'linear-gradient(135deg, #10B981, #059669)', text: '#fff' };
      case 'volunteer': return { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', text: '#fff' };
      case 'foster': return { bg: 'linear-gradient(135deg, #EC4899, #DB2777)', text: '#fff' };
      default: return { bg: 'var(--bg-secondary)', text: 'var(--text-secondary)' };
    }
  };

  return (
    <div className="admin-shell">
      {/* ═══════ SIDEBAR ═══════ */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-brand-inner">
            <div className="admin-sidebar-logo">🐾</div>
            <div>
              <div className="admin-sidebar-title">SSM Humane</div>
              <div className="admin-sidebar-subtitle">Staff Portal</div>
            </div>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {Object.entries(grouped).map(([section, tabs]) => (
            <div key={section} className="admin-nav-section">
              <div className="admin-nav-section-title">{SECTIONS[section]}</div>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => switchTab(tab.id)}
                >
                  <span className="admin-nav-icon">{Icons[tab.icon]}</span>
                  <span style={{ flex: 1 }}>{tab.label}</span>
                  {tab.id === 'applications' && pendingCount > 0 && (
                    <span className="admin-nav-badge">{pendingCount}</span>
                  )}
                  {tab.id === 'messages' && unreadMessages > 0 && (
                    <span className="admin-nav-badge">{unreadMessages}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-nav-item" onClick={load}>
            <span className="admin-nav-icon">{Icons.refresh}</span>
            <span>Refresh Data</span>
          </button>
          <Link href="/" className="admin-nav-item">
            <span className="admin-nav-icon">{Icons.back}</span>
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* ═══════ MAIN ═══════ */}
      <main className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-topbar-greeting">
              <h2>{getGreeting()}, Admin 👋</h2>
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
          <div className="admin-topbar-right">
            <div className="admin-topbar-search" style={{ position: 'relative' }}>
              {Icons.search}
              <input type="text" placeholder="Search pets, people, events..." value={searchQuery} onChange={e => handleSearch(e.target.value)} />
              {searchResults && searchResults.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: 'var(--bg-primary)', border: '1.5px solid var(--border-light)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden', maxHeight: '320px', overflowY: 'auto' }}>
                  {searchResults.map((r, i) => (
                    <button key={i} onClick={() => { switchTab(r.tab); setSearchQuery(''); setSearchResults(null); }} style={{ display: 'block', width: '100%', padding: '10px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', borderBottom: '1px solid var(--border-light)', fontFamily: 'inherit', color: 'var(--text-primary)' }}>
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
              {searchResults && searchResults.length === 0 && searchQuery && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: 'var(--bg-primary)', border: '1.5px solid var(--border-light)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No results for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
            <button className="admin-topbar-icon-btn" title="Notifications">
              {Icons.bell}
              {pendingCount > 0 && <span className="admin-topbar-dot" />}
            </button>
            <div className="admin-topbar-avatar" title="Admin User">A</div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content" key={tabKey}>
          {activeTab === 'overview' && (
            <OverviewTab stats={stats} loading={loading} recentApps={pendingApps} onReviewApp={updateAppStatus} onSwitchTab={switchTab} pets={pets} donations={donations} volunteers={volunteers} events={events} fosters={fosters} />
          )}
          {activeTab === 'pets' && (
            <PetsTab pets={pets} loading={loading} onAddPet={addPet} onDeletePet={deletePet} onUpdatePet={updatePet} />
          )}
          {activeTab === 'applications' && (
            <ApplicationsTab apps={apps} onUpdateStatus={updateAppStatus} onAddNote={addAppNote} onDeleteApp={deleteApp} onUpdateApp={updateApp} />
          )}
          {activeTab === 'donations' && (
            <DonationsTab donations={donations} loading={loading} onAdd={addDonation} onUpdate={updateDonation} onDelete={deleteDonation} />
          )}
          {activeTab === 'events' && (
            <EventsTab events={events} loading={loading} onAdd={addEvent} onUpdate={updateEvent} onDelete={deleteEvent} />
          )}
          {activeTab === 'fosters' && (
            <FostersTab fosters={fosters} pets={pets} loading={loading} onAdd={addFoster} onUpdate={updateFoster} onDelete={deleteFoster} />
          )}
          {activeTab === 'volunteers' && (
            <VolunteersTab volunteers={volunteers} loading={loading} onAdd={addVolunteer} onUpdate={updateVolunteer} onDelete={deleteVolunteer} onLogHours={logVolunteerHours} />
          )}
          {activeTab === 'announcements' && (
            <AnnouncementsTab announcements={announcements} onAdd={addAnnouncement} onUpdate={updateAnnouncement} onDelete={deleteAnnouncement} />
          )}
          {activeTab === 'users' && (
            <UsersTab users={users} onUpdateUser={(id, updated) => setUsers(prev => prev.map(x => x.id === id ? updated : x))} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab settings={settings} onSave={saveSettings} />
          )}

          {/* ═══ MESSAGES TAB ═══ */}
          {activeTab === 'messages' && (
            <MessagesTab />
          )}

          {/* ═══ ACTIVITY TAB ═══ */}
          {activeTab === 'activity' && (
            <ActivityTab activity={activity} onSeedData={seedData} />
          )}

          {/* ═══ LOST & FOUND TAB ═══ */}
          {activeTab === 'lostfound' && (
            <LostFoundTab items={lostFound} onAdd={addLostFound} onUpdate={updateLostFound} onDelete={deleteLostFound} />
          )}

          {/* ═══ INTAKE TAB ═══ */}
          {activeTab === 'intake' && (
            <IntakeTab intakes={intakes} onAdd={addIntake} onUpdate={updateIntake} onDelete={deleteIntake} />
          )}

          {/* ═══ REPORTS TAB ═══ */}
          {activeTab === 'reports' && (
            <ReportsTab reports={reports} pets={pets} apps={apps} donations={donations} volunteers={volunteers} fosters={fosters} events={events} intakes={intakes} />
          )}

          {/* ═══ SUPPLIES TAB ═══ */}
          {activeTab === 'supplies' && (
            <SuppliesTab supplies={supplies} onAdd={addSupply} onUpdate={updateSupply} onDelete={deleteSupply} />
          )}

          {/* ═══ KENNELS TAB ═══ */}
          {activeTab === 'kennels' && (
            <KennelsTab kennels={kennels} pets={pets} onAdd={addKennel} onUpdate={updateKennel} onDelete={deleteKennel} />
          )}
        </div>
      </main>
    </div>
  );
}
