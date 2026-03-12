'use client';
import { useState } from 'react';

const TYPE_COLORS = {
  lost: { bg: '#FFE4E6', text: '#E11D48', label: 'Lost' },
  found: { bg: 'var(--green-100)', text: 'var(--green-800)', label: 'Found' },
};

const PET_TYPES = ['dog', 'cat', 'bird', 'rabbit', 'other'];

export default function LostFoundTab({ items = [], onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    type: 'lost', petType: 'dog', name: '', breed: '', color: '',
    description: '', location: '', date: new Date().toISOString().split('T')[0],
    contactName: '', contactPhone: '', contactEmail: '',
  });

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);
  const lost = items.filter(i => i.type === 'lost' && i.status === 'active').length;
  const found = items.filter(i => i.type === 'found' && i.status === 'active').length;
  const resolved = items.filter(i => i.status === 'resolved').length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd(form);
    setForm({ type: 'lost', petType: 'dog', name: '', breed: '', color: '', description: '', location: '', date: new Date().toISOString().split('T')[0], contactName: '', contactPhone: '', contactEmail: '' });
    setShowForm(false);
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Lost &amp; Found</h1>
          <p className="admin-page-subtitle">{items.length} reports — {lost} lost, {found} found, {resolved} resolved</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ borderRadius: '12px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            {showForm ? '✕ Cancel' : '+ New Report'}
          </button>
        </div>
      </div>

      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Active Lost', val: lost, color: 'var(--rose-500)' },
          { label: 'Active Found', val: found, color: 'var(--green-500)' },
          { label: 'Resolved', val: resolved, color: 'var(--blue-500)' },
          { label: 'Total Reports', val: items.length, color: 'var(--text-muted)' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.color }}>
            <div className="admin-stat-value">{s.val}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="admin-panel" style={{ marginBottom: '20px' }}>
          <div className="admin-panel-header">
            <div className="admin-panel-title">📋 New Report</div>
          </div>
          <div className="admin-panel-body">
            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid admin-form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Report Type *</label>
                  <select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})} required>
                    <option value="lost">Lost Pet</option>
                    <option value="found">Found Pet</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pet Type *</label>
                  <select className="form-input form-select" value={form.petType} onChange={e => setForm({...form, petType: e.target.value})} required>
                    {PET_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
              </div>
              <div className="admin-form-grid admin-form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-group"><label className="form-label">Pet Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="If known" /></div>
                <div className="form-group"><label className="form-label">Breed</label><input className="form-input" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} placeholder="e.g. Labrador" /></div>
                <div className="form-group"><label className="form-label">Color</label><input className="form-input" value={form.color} onChange={e => setForm({...form, color: e.target.value})} placeholder="e.g. Brown/White" /></div>
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}><label className="form-label">Location *</label><input className="form-input" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Where was the pet last seen or found?" /></div>
              <div className="form-group" style={{ marginBottom: '16px' }}><label className="form-label">Description</label><textarea className="form-input form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Identifying features, collar, microchip, behavior..." /></div>
              <div className="admin-form-grid admin-form-grid-3" style={{ marginBottom: '20px' }}>
                <div className="form-group"><label className="form-label">Contact Name *</label><input className="form-input" required value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} /></div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px' }}>Submit Report</button>
            </form>
          </div>
        </div>
      )}

      <div className="admin-filters">
        {['all', 'lost', 'found'].map(f => (
          <button key={f} className={`admin-filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-list">
        {filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(item => {
          const tc = TYPE_COLORS[item.type] || TYPE_COLORS.lost;
          return (
            <div key={item.id} className="admin-list-item" style={{ borderLeft: `3px solid ${tc.text}` }}>
              <div className="admin-list-avatar" style={{ background: tc.bg, color: tc.text, fontSize: '1.1rem' }}>
                {item.petType === 'dog' ? '🐕' : item.petType === 'cat' ? '🐈' : item.petType === 'bird' ? '🐦' : item.petType === 'rabbit' ? '🐰' : '🐾'}
              </div>
              <div className="admin-list-info">
                <div className="admin-list-name">
                  <span style={{ background: tc.bg, color: tc.text, padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, marginRight: '8px' }}>{tc.label}</span>
                  {item.name || 'Unknown'} — {item.breed || 'Unknown breed'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  📍 {item.location} {item.color ? `• Color: ${item.color} ` : ''}• {item.date}
                </div>
                {item.description && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>{item.description.slice(0, 100)}{item.description.length > 100 ? '...' : ''}</div>}
                <div className="admin-list-meta">
                  <span>👤 {item.contactName}</span>
                  {item.contactPhone && <span>📞 {item.contactPhone}</span>}
                  {item.contactEmail && <span>✉️ {item.contactEmail}</span>}
                </div>
              </div>
              <div className="admin-list-actions" style={{ flexDirection: 'column', gap: '6px' }}>
                {item.status === 'active' && (
                  <button onClick={() => onUpdate(item.id, { status: 'resolved' })} style={{ background: 'var(--green-50)', color: 'var(--green-700)', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    ✓ Resolved
                  </button>
                )}
                <span className={`admin-status admin-status-${item.status === 'resolved' ? 'completed' : item.type === 'lost' ? 'cancelled' : 'active'}`}>
                  {item.status}
                </span>
                <button onClick={() => onDelete(item.id)} style={{ background: '#FFE4E6', color: 'var(--rose-600)', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="admin-panel">
            <div className="admin-empty">
              <div className="admin-empty-icon">🔍</div>
              <div className="admin-empty-title">No reports found</div>
              <div className="admin-empty-text">Lost and found pet reports will appear here.</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
