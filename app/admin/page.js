'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import './admin.css';
import OverviewTab from '@/components/admin/OverviewTab';
import PetsTab from '@/components/admin/PetsTab';
import ApplicationsTab from '@/components/admin/ApplicationsTab';
import DonationsTab from '@/components/admin/DonationsTab';
import EventsTab from '@/components/admin/EventsTab';
import FostersTab from '@/components/admin/FostersTab';
import VolunteersTab from '@/components/admin/VolunteersTab';
import AnnouncementsTab from '@/components/admin/AnnouncementsTab';
import SettingsTab from '@/components/admin/SettingsTab';

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
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  refresh: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  back: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
};

const TAB_CONFIG = [
  { id: 'overview',      label: 'Overview',      icon: 'overview',      section: 'main' },
  { id: 'pets',          label: 'Pets',           icon: 'pets',          section: 'main' },
  { id: 'applications',  label: 'Applications',   icon: 'applications',  section: 'main' },
  { id: 'donations',     label: 'Donations',      icon: 'donations',     section: 'operations' },
  { id: 'events',        label: 'Events',         icon: 'events',        section: 'operations' },
  { id: 'fosters',       label: 'Fosters',        icon: 'fosters',       section: 'operations' },
  { id: 'volunteers',    label: 'Volunteers',     icon: 'volunteers',    section: 'operations' },
  { id: 'announcements', label: 'News',           icon: 'announcements', section: 'communications' },
  { id: 'users',         label: 'Users',          icon: 'users',         section: 'system' },
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
  const [tabKey, setTabKey] = useState(0);

  const switchTab = (id) => {
    setTabKey(k => k + 1);
    setActiveTab(id);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, p, a, d, ev, f, v, an, st, u] = await Promise.all([
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
      ]);
      setStats(s); setPets(Array.isArray(p) ? p : []);
      setApps(Array.isArray(a) ? a : []); setDonations(Array.isArray(d) ? d : []);
      setEvents(Array.isArray(ev) ? ev : []); setFosters(Array.isArray(f) ? f : []);
      setVolunteers(Array.isArray(v) ? v : []); setAnnouncements(Array.isArray(an) ? an : []);
      setSettings(st || {}); setUsers(Array.isArray(u) ? u : []);
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

  const pendingApps = apps.filter(a => a.status === 'submitted');
  const pendingCount = pendingApps.length;

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
            <div className="admin-topbar-search">
              {Icons.search}
              <input type="text" placeholder="Search anything..." />
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
            <OverviewTab stats={stats} loading={loading} recentApps={pendingApps} onReviewApp={updateAppStatus} />
          )}
          {activeTab === 'pets' && (
            <PetsTab pets={pets} loading={loading} onAddPet={addPet} onDeletePet={deletePet} onUpdatePet={updatePet} />
          )}
          {activeTab === 'applications' && (
            <ApplicationsTab apps={apps} onUpdateStatus={updateAppStatus} onAddNote={addAppNote} onDeleteApp={deleteApp} />
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
            <>
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">User Management</h1>
                  <p className="admin-page-subtitle">{users.length} registered {users.length === 1 ? 'user' : 'users'} across all roles</p>
                </div>
              </div>

              {/* Role Summary */}
              <div className="admin-stats" style={{ marginBottom: '24px' }}>
                {[
                  { label: 'Admins', val: users.filter(u => u.role === 'admin').length, accent: '#3B82F6', bg: '#EFF6FF', icon: '🛡️' },
                  { label: 'Staff', val: users.filter(u => u.role === 'staff').length, accent: '#10B981', bg: '#ECFDF5', icon: '👔' },
                  { label: 'Volunteers', val: users.filter(u => u.role === 'volunteer').length, accent: '#F59E0B', bg: '#FFFBEB', icon: '🤝' },
                  { label: 'Adopters', val: users.filter(u => !u.role || u.role === 'adopter').length, accent: '#8B5CF6', bg: '#F5F3FF', icon: '🏠' },
                ].map(s => (
                  <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}>
                    <div className="admin-stat-top">
                      <div className="admin-stat-icon">{s.icon}</div>
                    </div>
                    <div className="admin-stat-value admin-counter">{s.val}</div>
                    <div className="admin-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Users List */}
              <div className="admin-list">
                {users.map(u => {
                  const rc = roleColor(u.role);
                  return (
                    <div key={u.id} className="admin-list-item">
                      <div className="admin-list-avatar" style={{ background: rc.bg, color: rc.text }}>
                        {(u.name || u.email || '?')[0].toUpperCase()}
                      </div>
                      <div className="admin-list-info">
                        <div className="admin-list-name">{u.name || 'Unnamed User'}</div>
                        <div className="admin-list-meta">
                          <span>{u.email}</span>
                          <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="admin-list-actions">
                        <select
                          className="form-input form-select"
                          value={u.role || 'adopter'}
                          onChange={async (e) => {
                            const res = await fetch(`/api/users/${u.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: e.target.value }) });
                            if (res.ok) { const updated = await res.json(); setUsers(prev => prev.map(x => x.id === u.id ? updated : x)); }
                          }}
                          style={{ padding: '6px 32px 6px 12px', fontSize: '0.82rem', width: 'auto', borderRadius: '10px' }}
                        >
                          <option value="adopter">Adopter</option>
                          <option value="volunteer">Volunteer</option>
                          <option value="foster">Foster</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                        <span className={`admin-status admin-status-${u.role === 'admin' ? 'approved' : u.role === 'staff' ? 'active' : 'applied'}`}>
                          {u.role || 'adopter'}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {users.length === 0 && (
                  <div className="admin-panel">
                    <div className="admin-empty">
                      <div className="admin-empty-icon">👥</div>
                      <div className="admin-empty-title">No registered users</div>
                      <div className="admin-empty-text">Users will appear here once they create accounts on the public site.</div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === 'settings' && (
            <SettingsTab settings={settings} onSave={saveSettings} />
          )}
        </div>
      </main>
    </div>
  );
}
