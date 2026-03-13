'use client';
import { useState } from 'react';

const typeIcons = { general: '📅', 'adoption-day': '🐾', fundraiser: '💰', education: '📚', volunteer: '🤝' };
const typeColors = { general: '#3B82F6', 'adoption-day': '#EC4899', fundraiser: '#10B981', education: '#8B5CF6', volunteer: '#06B6D4' };

function EventDetail({ event, onUpdate }) {
  const [noteText, setNoteText] = useState('');
  const attendees = event.registrations || [];
  const checklist = event.checklist || {};

  const updateChecklist = (field, value) => {
    const updated = { ...(event.checklist || {}), [field]: value };
    onUpdate(event.id, { checklist: updated });
  };

  return (
    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Event Info */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>📋 Event Details</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
            {[
              { l: 'Title', v: event.title },
              { l: 'Date', v: event.date },
              { l: 'Time', v: `${event.startTime || '—'} – ${event.endTime || '—'}` },
              { l: 'Location', v: event.location },
              { l: 'Type', v: event.type?.replace(/-/g, ' ') },
              { l: 'Capacity', v: event.capacity ? `${attendees.length}/${event.capacity}` : 'Unlimited' },
              { l: 'Registration', v: event.requiresRegistration ? 'Required' : 'Open' },
              { l: 'Visibility', v: event.isPublic !== false ? 'Public' : 'Private' },
            ].filter(i => i.v).map(i => (
              <div key={i.l} style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500, minWidth: '90px' }}>{i.l}:</span>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{i.v}</span>
              </div>
            ))}
          </div>
          {event.description && (
            <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '10px', fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {event.description}
            </div>
          )}
        </div>

        {/* Event Checklist */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>✅ Preparation Checklist</h4>
          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { key: 'venueBooked', label: 'Venue booked & confirmed' },
                { key: 'suppliesReady', label: 'Supplies & materials ready' },
                { key: 'staffAssigned', label: 'Staff/volunteers assigned' },
                { key: 'promotionSent', label: 'Promotional materials sent' },
                { key: 'signageReady', label: 'Signage & banners prepared' },
                { key: 'budgetApproved', label: 'Budget approved' },
              ].map(item => (
                <label key={item.key} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                  padding: '6px 10px', borderRadius: '8px',
                  background: checklist[item.key] ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                  transition: 'all 0.2s', fontSize: '0.84rem',
                }}>
                  <input type="checkbox" checked={checklist[item.key] || false}
                    onChange={e => updateChecklist(item.key, e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--green-500)' }} />
                  <span style={{ color: checklist[item.key] ? 'var(--green-600)' : 'var(--text-secondary)', fontWeight: checklist[item.key] ? 600 : 400 }}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Progress</span>
              <span style={{ fontWeight: 700, color: 'var(--text-accent)' }}>
                {Object.values(checklist).filter(Boolean).length}/6
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendees/Registrations */}
      {attendees.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>👥 Registrations ({attendees.length})</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
            {attendees.map((a, i) => (
              <div key={i} style={{
                padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: '10px',
                border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                  {(a.name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Notes */}
      <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px' }}>📝 Event Notes</h4>
        {(event.notes || []).map(note => (
          <div key={note.id || note.createdAt} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '8px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong style={{ fontSize: '0.82rem' }}>{note.author || 'Staff'}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{note.createdAt ? new Date(note.createdAt).toLocaleString() : ''}</span>
            </div>
            {note.text}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input className="form-input" placeholder="Add a note..."
            value={noteText} onChange={e => setNoteText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && noteText.trim()) {
                const notes = [...(event.notes || []), { id: `n-${Date.now()}`, text: noteText, author: 'Staff', createdAt: new Date().toISOString() }];
                onUpdate(event.id, { notes });
                setNoteText('');
              }
            }}
            style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem', borderRadius: '10px' }} />
          <button className="btn btn-sm btn-primary" onClick={() => {
            if (noteText.trim()) {
              const notes = [...(event.notes || []), { id: `n-${Date.now()}`, text: noteText, author: 'Staff', createdAt: new Date().toISOString() }];
              onUpdate(event.id, { notes });
              setNoteText('');
            }
          }} style={{ borderRadius: '10px', padding: '8px 18px' }}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default function EventsTab({ events, loading, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
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

  const filtered = events.filter(ev => {
    if (filter !== 'all' && ev.type !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (ev.title || '').toLowerCase().includes(s) || (ev.location || '').toLowerCase().includes(s) || (ev.description || '').toLowerCase().includes(s);
    }
    return true;
  });

  // Timeline: group events by proximity to today
  const now = new Date();
  const upcoming = filtered.filter(e => e.status === 'upcoming' && new Date(e.date) >= now);
  const past = filtered.filter(e => e.status === 'completed' || new Date(e.date) < now);

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
          { label: 'Total Registrations', val: events.reduce((s, e) => s + (e.registrations || []).length, 0), icon: '👥', accent: '#F97316', bg: '#FFF7ED' },
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
        <input className="admin-filter-search" placeholder="🔍 Search events..."
          value={search} onChange={e => setSearch(e.target.value)} />
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
        {filtered.map(ev => {
          const isExpanded = expandedId === ev.id;
          const checklist = ev.checklist || {};
          const checkCount = Object.values(checklist).filter(Boolean).length;
          const atts = (ev.registrations || []).length;

          return (
            <div key={ev.id} className="admin-panel" style={{ marginBottom: '8px' }}>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: `${typeColors[ev.type] || '#3B82F6'}12`,
                      color: typeColors[ev.type] || '#3B82F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.3rem', flexShrink: 0,
                    }}>
                      {typeIcons[ev.type] || '📅'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{ev.title}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                        <span>📅 {ev.date}</span>
                        <span>⏰ {ev.startTime}–{ev.endTime}</span>
                        <span>📍 {ev.location}</span>
                        {ev.capacity && <span>👥 {atts}/{ev.capacity}</span>}
                        {checkCount > 0 && <span>✅ {checkCount}/6</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                    <span className={`admin-status admin-status-${ev.status}`}>{ev.status}</span>
                    <select className="form-input form-select" value={ev.status}
                      onChange={e => onUpdate(ev.id, { status: e.target.value })}
                      style={{ padding: '5px 28px 5px 10px', fontSize: '0.8rem', width: 'auto', minWidth: '100px', borderRadius: '10px' }}>
                      <option value="upcoming">Upcoming</option><option value="active">Active</option>
                      <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginLeft: '62px' }}>
                  <button style={{ fontSize: '0.82rem', color: 'var(--text-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => setExpandedId(isExpanded ? null : ev.id)}>
                    <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: '0.2s', display: 'inline-block' }}>▶</span>
                    {isExpanded ? 'Hide Details' : 'Full Details'}
                  </button>
                  <button style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => startEdit(ev)}>✏️ Edit</button>
                  <button style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => { if (confirm('Delete?')) onDelete(ev.id); }}>🗑️ Delete</button>
                </div>
              </div>
              {isExpanded && <EventDetail event={ev} onUpdate={onUpdate} />}
            </div>
          );
        })}
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
