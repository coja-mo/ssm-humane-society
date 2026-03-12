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
  const statusColors = { upcoming: 'var(--blue-500)', active: 'var(--green-500)', completed: 'var(--text-muted)', cancelled: 'var(--rose-500)' };
  const typeIcons = { general: '📅', 'adoption-day': '🐾', fundraiser: '💰', education: '📚', volunteer: '🤝' };

  const filtered = events.filter(ev => {
    if (filter !== 'all' && ev.type !== filter) return false;
    return true;
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>📅 Events ({events.length})</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowAdd(!showAdd); }}>
          {showAdd ? '✕ Cancel' : '+ Create Event'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {types.map(t => (
          <button key={t} className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(t)} style={{ textTransform: 'capitalize' }}>{t.replace(/-/g, ' ')}</button>
        ))}
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>{editId ? '✏️ Edit Event' : '➕ Create Event'}</h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="general">General</option><option value="adoption-day">Adoption Day</option>
                <option value="fundraiser">Fundraiser</option><option value="education">Education</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
          </div>
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input className="form-input" type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input className="form-input" type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} />
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Capacity</label>
              <input className="form-input" type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} placeholder="Unlimited" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.requiresRegistration} onChange={e => setForm({...form, requiresRegistration: e.target.checked})} />
              Requires Registration
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isPublic} onChange={e => setForm({...form, isPublic: e.target.checked})} />
              Public Event
            </label>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Create'} Event</button>
            <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {filtered.map(ev => (
          <div key={ev.id} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <div style={{ fontSize: '2rem' }}>{typeIcons[ev.type] || '📅'}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{ev.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  📅 {ev.date} · ⏰ {ev.startTime}–{ev.endTime} · 📍 {ev.location}
                  {ev.capacity && ` · 👥 ${(ev.registrations || []).length}/${ev.capacity}`}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="badge" style={{ background: `${statusColors[ev.status]}20`, color: statusColors[ev.status] }}>{ev.status}</span>
              <select className="form-input form-select" value={ev.status}
                onChange={e => onUpdate(ev.id, { status: e.target.value })}
                style={{ padding: '4px 28px 4px 8px', fontSize: '0.8rem', width: 'auto', minWidth: '100px' }}>
                <option value="upcoming">Upcoming</option><option value="active">Active</option>
                <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
              </select>
              <button className="btn btn-sm btn-ghost" onClick={() => startEdit(ev)}>✏️</button>
              <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete?')) onDelete(ev.id); }} style={{ padding: '4px 8px' }}>✕</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
            <p style={{ color: 'var(--text-muted)' }}>No events created yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
