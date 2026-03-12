'use client';
import { useState } from 'react';

export default function EventsTab({ events, loading, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    title: '', description: '', date: '', startTime: '10:00', endTime: '14:00',
    location: 'SSM Humane Society', type: 'general', capacity: '',
    requiresRegistration: false, isPublic: true, status: 'upcoming',
  });

  const resetForm = () => {
    setForm({ title: '', description: '', date: '', startTime: '10:00', endTime: '14:00',
      location: 'SSM Humane Society', type: 'general', capacity: '',
      requiresRegistration: false, isPublic: true, status: 'upcoming' });
    setEditId(null); setShowAdd(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, capacity: form.capacity ? Number(form.capacity) : null };
    if (editId) { onUpdate(editId, data); } else { onAdd(data); }
    resetForm();
  };

  const startEdit = (ev) => {
    setForm({ title: ev.title, description: ev.description || '', date: ev.date || '',
      startTime: ev.startTime || '10:00', endTime: ev.endTime || '14:00',
      location: ev.location || '', type: ev.type || 'general', capacity: ev.capacity || '',
      requiresRegistration: ev.requiresRegistration || false, isPublic: ev.isPublic !== false,
      status: ev.status || 'upcoming' });
    setEditId(ev.id); setShowAdd(true);
  };

  const types = ['all', 'general', 'adoption-day', 'fundraiser', 'education', 'volunteer'];
  const typeIcons = { general: '📅', 'adoption-day': '🐾', fundraiser: '💰', education: '📚', volunteer: '🤝' };
  const typeColors = { general: '#3B82F6', 'adoption-day': '#EC4899', fundraiser: '#10B981', education: '#8B5CF6', volunteer: '#06B6D4' };

  const filtered = events.filter(ev => filter === 'all' || ev.type === filter);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Events</h1>
          <p className="admin-page-subtitle">{events.length} events · {events.filter(e => e.status === 'upcoming').length} upcoming</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }}
            onClick={() => { resetForm(); setShowAdd(!showAdd); }}>
            {showAdd ? '✕ Cancel' : '+ Create Event'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Upcoming', val: events.filter(e => e.status === 'upcoming').length, icon: '📅', accent: '#3B82F6', bg: '#EFF6FF' },
          { label: 'Active Now', val: events.filter(e => e.status === 'active').length, icon: '🎯', accent: '#10B981', bg: '#ECFDF5' },
          { label: 'Completed', val: events.filter(e => e.status === 'completed').length, icon: '✅', accent: '#8B5CF6', bg: '#F5F3FF' },
          { label: 'Total Events', val: events.length, icon: '📊', accent: '#F97316', bg: '#FFF7ED' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}>
            <div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div>
            <div className="admin-stat-value admin-counter">{s.val}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-filters">
        {types.map(t => (
          <button key={t} className={`admin-filter-pill ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}>
            {t === 'all' ? 'All Events' : (typeIcons[t] || '') + ' ' + t.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header">
            <div className="admin-panel-title"><span>{editId ? '✏️' : '➕'}</span> {editId ? 'Edit Event' : 'Create Event'}</div>
          </div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Type</label>
                <select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="general">General</option><option value="adoption-day">Adoption Day</option>
                  <option value="fundraiser">Fundraiser</option><option value="education">Education</option>
                  <option value="volunteer">Volunteer</option>
                </select></div>
            </div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Date *</label>
                <input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Start Time</label>
                <input className="form-input" type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">End Time</label>
                <input className="form-input" type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} /></div>
            </div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Location</label>
                <input className="form-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Capacity</label>
                <input className="form-input" type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} placeholder="Unlimited" /></div>
            </div>
            <div className="form-group"><label className="form-label">Description</label>
              <textarea className="form-input form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={form.requiresRegistration} onChange={e => setForm({...form, requiresRegistration: e.target.checked})} /> Requires Registration
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={form.isPublic} onChange={e => setForm({...form, isPublic: e.target.checked})} /> Public Event
              </label>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>{editId ? 'Update' : 'Create'} Event</button>
              <button type="button" className="btn btn-ghost" onClick={resetForm} style={{ borderRadius: '12px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-list">
        {filtered.map(ev => (
          <div key={ev.id} className="admin-list-item">
            <div className="admin-list-avatar" style={{
              background: `${typeColors[ev.type] || '#3B82F6'}12`,
              color: typeColors[ev.type] || '#3B82F6',
              fontSize: '1.3rem', borderRadius: '14px',
            }}>
              {typeIcons[ev.type] || '📅'}
            </div>
            <div className="admin-list-info">
              <div className="admin-list-name">{ev.title}</div>
              <div className="admin-list-meta">
                <span>📅 {ev.date}</span>
                <span>⏰ {ev.startTime}–{ev.endTime}</span>
                <span>📍 {ev.location}</span>
                {ev.capacity && <span>👥 {(ev.registrations || []).length}/{ev.capacity}</span>}
              </div>
            </div>
            <div className="admin-list-actions">
              <span className={`admin-status admin-status-${ev.status}`}>{ev.status}</span>
              <select className="form-input form-select" value={ev.status}
                onChange={e => onUpdate(ev.id, { status: e.target.value })}
                style={{ padding: '5px 28px 5px 10px', fontSize: '0.8rem', width: 'auto', minWidth: '100px', borderRadius: '10px' }}>
                <option value="upcoming">Upcoming</option><option value="active">Active</option>
                <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
              </select>
              <button className="btn btn-sm btn-ghost" onClick={() => startEdit(ev)} style={{ borderRadius: '10px', padding: '5px 12px' }}>✏️</button>
              <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete?')) onDelete(ev.id); }}
                style={{ borderRadius: '10px', padding: '5px 12px' }}>✕</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="admin-panel"><div className="admin-empty">
            <div className="admin-empty-icon">📅</div>
            <div className="admin-empty-title">No events yet</div>
            <div className="admin-empty-text">Create your first event to start organizing shelter activities.</div>
          </div></div>
        )}
      </div>
    </>
  );
}
