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

  // === PET HANDLERS ===
  const addPet = async (data) => {
    const res = await fetch('/api/pets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const pet = await res.json(); setPets(prev => [...prev, pet]); }
  };
  const updatePet = async (id, data) => {
    const res = await fetch(`/api/pets/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const pet = await res.json(); setPets(prev => prev.map(p => p.id === id ? pet : p)); }
  };
  const deletePet = async (id) => {
    await fetch(`/api/pets/${id}`, { method: 'DELETE' });
    setPets(prev => prev.filter(p => p.id !== id));
  };

  // === APPLICATION HANDLERS ===
  const updateAppStatus = async (id, status) => {
    await fetch(`/api/applications/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };
  const addAppNote = async (id, note) => {
    const res = await fetch(`/api/applications/${id}/notes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(note) });
    if (res.ok) { const app = await res.json(); setApps(prev => prev.map(a => a.id === id ? app : a)); }
  };
  const deleteApp = async (id) => {
    await fetch(`/api/applications/${id}`, { method: 'DELETE' });
    setApps(prev => prev.filter(a => a.id !== id));
  };

  // === DONATION HANDLERS ===
  const addDonation = async (data) => {
    const res = await fetch('/api/donations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const d = await res.json(); setDonations(prev => [d, ...prev]); }
  };
  const updateDonation = async (id, data) => {
    const res = await fetch(`/api/donations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const d = await res.json(); setDonations(prev => prev.map(x => x.id === id ? d : x)); }
  };
  const deleteDonation = async (id) => {
    await fetch(`/api/donations/${id}`, { method: 'DELETE' });
    setDonations(prev => prev.filter(d => d.id !== id));
  };

  // === EVENT HANDLERS ===
  const addEvent = async (data) => {
    const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const e = await res.json(); setEvents(prev => [e, ...prev]); }
  };
  const updateEvent = async (id, data) => {
    const res = await fetch(`/api/events/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const e = await res.json(); setEvents(prev => prev.map(x => x.id === id ? e : x)); }
  };
  const deleteEvent = async (id) => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // === FOSTER HANDLERS ===
  const addFoster = async (data) => {
    const res = await fetch('/api/foster', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const f = await res.json(); setFosters(prev => [f, ...prev]); }
  };
  const updateFoster = async (id, data) => {
    const res = await fetch(`/api/foster/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const f = await res.json(); setFosters(prev => prev.map(x => x.id === id ? f : x)); }
  };
  const deleteFoster = async (id) => {
    await fetch(`/api/foster/${id}`, { method: 'DELETE' });
    setFosters(prev => prev.filter(f => f.id !== id));
  };

  // === VOLUNTEER HANDLERS ===
  const addVolunteer = async (data) => {
    const res = await fetch('/api/volunteers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const v = await res.json(); setVolunteers(prev => [v, ...prev]); }
  };
  const updateVolunteer = async (id, data) => {
    const res = await fetch(`/api/volunteers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const v = await res.json(); setVolunteers(prev => prev.map(x => x.id === id ? v : x)); }
  };
  const deleteVolunteer = async (id) => {
    await fetch(`/api/volunteers/${id}`, { method: 'DELETE' });
    setVolunteers(prev => prev.filter(v => v.id !== id));
  };
  const logVolunteerHours = async (id, hours, shiftInfo) => {
    const res = await fetch(`/api/volunteers/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _action: 'log-hours', hours, shiftInfo }) });
    if (res.ok) { const v = await res.json(); setVolunteers(prev => prev.map(x => x.id === id ? v : x)); }
  };

  // === ANNOUNCEMENT HANDLERS ===
  const addAnnouncement = async (data) => {
    const res = await fetch('/api/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const a = await res.json(); setAnnouncements(prev => [a, ...prev]); }
  };
  const updateAnnouncement = async (id, data) => {
    const res = await fetch(`/api/announcements/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const a = await res.json(); setAnnouncements(prev => prev.map(x => x.id === id ? a : x)); }
  };
  const deleteAnnouncement = async (id) => {
    await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // === SETTINGS HANDLER ===
  const saveSettings = async (data) => {
    const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (res.ok) { const s = await res.json(); setSettings(s); }
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'pets', label: 'Pets', icon: '🐾' },
    { id: 'applications', label: 'Applications', icon: '📝', badge: apps.filter(a => a.status === 'submitted').length },
    { id: 'donations', label: 'Donations', icon: '💰' },
    { id: 'events', label: 'Events', icon: '📅' },
    { id: 'fosters', label: 'Fosters', icon: '🏡' },
    { id: 'volunteers', label: 'Volunteers', icon: '🤝' },
    { id: 'announcements', label: 'News', icon: '📢' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const pendingApps = apps.filter(a => a.status === 'submitted');

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="dashboard" style={{ gridTemplateColumns: '240px 1fr' }}>
        {/* Sidebar */}
        <div className="sidebar" style={{ paddingTop: '100px', width: '240px' }}>
          <div className="sidebar-header">
            <div style={{ fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🐾 <span>Admin Panel</span>
            </div>
          </div>
          {TABS.map(tab => (
            <button key={tab.id} className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ position: 'relative' }}>
              <span>{tab.icon}</span>
              <span style={{ flex: 1 }}>{tab.label}</span>
              {tab.badge > 0 && (
                <span style={{
                  background: 'var(--rose-500)', color: '#fff', borderRadius: '100px',
                  padding: '2px 8px', fontSize: '0.7rem', fontWeight: 700, minWidth: '20px', textAlign: 'center'
                }}>{tab.badge}</span>
              )}
            </button>
          ))}
          <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
            <button className="sidebar-link" onClick={load} style={{ color: 'var(--text-accent)' }}>
              🔄 Refresh Data
            </button>
            <Link href="/" className="sidebar-link">← Back to Site</Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main" style={{ marginLeft: '240px', padding: '32px' }}>
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
              <h1 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>👥 User Management ({users.length})</h1>
              <div style={{ display: 'grid', gap: '12px' }}>
                {users.map(u => (
                  <div key={u.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: u.role === 'admin' ? 'var(--blue-100)' : 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: u.role === 'admin' ? 'var(--blue-700)' : 'var(--green-700)' }}>
                        {(u.name || u.email || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name || 'Unnamed'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {u.email} · Joined {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select className="form-input form-select" value={u.role || 'adopter'}
                        onChange={async (e) => {
                          const res = await fetch(`/api/users/${u.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: e.target.value }) });
                          if (res.ok) { const updated = await res.json(); setUsers(prev => prev.map(x => x.id === u.id ? updated : x)); }
                        }}
                        style={{ padding: '4px 28px 4px 8px', fontSize: '0.85rem', width: 'auto' }}>
                        <option value="adopter">Adopter</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="foster">Foster</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                      <span className={`badge ${u.role === 'admin' ? 'badge-blue' : u.role === 'staff' ? 'badge-green' : 'badge-outline'}`}>{u.role || 'adopter'}</span>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👥</div>
                    <p style={{ color: 'var(--text-muted)' }}>No registered users yet.</p>
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === 'settings' && (
            <SettingsTab settings={settings} onSave={saveSettings} />
          )}
        </div>
      </div>
    </div>
  );
}
