'use client';
import { useState } from 'react';

const TYPE_LABELS = { surrender: 'Surrender', stray: 'Stray', transfer: 'Transfer', confiscation: 'Confiscation', return: 'Return' };
const STATUS_COLORS = { pending: 'submitted', accepted: 'active', completed: 'completed', declined: 'cancelled' };

export default function IntakeTab({ intakes = [], onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    type: 'stray', petType: 'dog', petName: '', breed: '', age: '', sex: 'unknown',
    weight: '', color: '', foundLocation: '', notes: '', assignedTo: '',
    scheduledDate: '',
  });

  const filtered = filter === 'all' ? intakes : intakes.filter(i => i.status === filter);
  const pending = intakes.filter(i => i.status === 'pending').length;
  const accepted = intakes.filter(i => i.status === 'accepted').length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd(form);
    setForm({ type: 'stray', petType: 'dog', petName: '', breed: '', age: '', sex: 'unknown', weight: '', color: '', foundLocation: '', notes: '', assignedTo: '', scheduledDate: '' });
    setShowForm(false);
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Animal Intake</h1>
          <p className="admin-page-subtitle">{intakes.length} records — {pending} pending, {accepted} accepted</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 600 }}>
            {showForm ? '✕ Cancel' : '+ New Intake'}
          </button>
        </div>
      </div>

      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Pending', val: pending, color: 'var(--amber-500)' },
          { label: 'Accepted', val: accepted, color: 'var(--green-500)' },
          { label: 'Completed', val: intakes.filter(i => i.status === 'completed').length, color: 'var(--blue-500)' },
          { label: 'Total', val: intakes.length, color: 'var(--text-muted)' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.color }}>
            <div className="admin-stat-value">{s.val}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="admin-panel" style={{ marginBottom: '20px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title">📋 New Intake Record</div></div>
          <div className="admin-panel-body">
            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid admin-form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-group"><label className="form-label">Type *</label>
                  <select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="stray">Stray</option><option value="surrender">Surrender</option><option value="transfer">Transfer</option><option value="confiscation">Confiscation</option><option value="return">Return</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Animal Type *</label>
                  <select className="form-input form-select" value={form.petType} onChange={e => setForm({...form, petType: e.target.value})}>
                    <option value="dog">Dog</option><option value="cat">Cat</option><option value="bird">Bird</option><option value="rabbit">Rabbit</option><option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Scheduled Date</label><input className="form-input" type="date" value={form.scheduledDate} onChange={e => setForm({...form, scheduledDate: e.target.value})} /></div>
              </div>
              <div className="admin-form-grid admin-form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.petName} onChange={e => setForm({...form, petName: e.target.value})} placeholder="If known" /></div>
                <div className="form-group"><label className="form-label">Breed</label><input className="form-input" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Color</label><input className="form-input" value={form.color} onChange={e => setForm({...form, color: e.target.value})} /></div>
              </div>
              <div className="admin-form-grid admin-form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-group"><label className="form-label">Age</label><input className="form-input" value={form.age} onChange={e => setForm({...form, age: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Sex</label>
                  <select className="form-input form-select" value={form.sex} onChange={e => setForm({...form, sex: e.target.value})}>
                    <option value="male">Male</option><option value="female">Female</option><option value="unknown">Unknown</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Weight (lbs)</label><input className="form-input" type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} /></div>
              </div>
              {form.type === 'stray' && (
                <div className="form-group" style={{ marginBottom: '16px' }}><label className="form-label">Found Location</label><input className="form-input" value={form.foundLocation} onChange={e => setForm({...form, foundLocation: e.target.value})} placeholder="Where was the animal found?" /></div>
              )}
              <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '16px' }}>
                <div className="form-group"><label className="form-label">Assigned To</label><input className="form-input" value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} placeholder="Staff member" /></div>
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}><label className="form-label">Notes</label><textarea className="form-input form-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Medical observations, behavior, condition..." /></div>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px' }}>Create Intake Record</button>
            </form>
          </div>
        </div>
      )}

      <div className="admin-filters">
        {['all', 'pending', 'accepted', 'completed', 'declined'].map(f => (
          <button key={f} className={`admin-filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {f !== 'all' ? `(${intakes.filter(i => i.status === f).length})` : `(${intakes.length})`}
          </button>
        ))}
      </div>

      <div className="admin-list">
        {filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(item => (
          <div key={item.id} className="admin-list-item">
            <div className="admin-list-avatar" style={{ background: item.type === 'surrender' ? '#FEF3C7' : item.type === 'stray' ? '#DBEAFE' : 'var(--bg-secondary)', fontSize: '1.1rem' }}>
              {item.petType === 'dog' ? '🐕' : item.petType === 'cat' ? '🐈' : item.petType === 'bird' ? '🐦' : '🐾'}
            </div>
            <div className="admin-list-info">
              <div className="admin-list-name">
                <span style={{ background: item.type === 'surrender' ? '#FEF3C7' : '#DBEAFE', color: item.type === 'surrender' ? '#92400E' : '#1E40AF', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, marginRight: '8px' }}>
                  {TYPE_LABELS[item.type] || item.type}
                </span>
                {item.petName || 'Unnamed'} — {item.breed || 'Unknown breed'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {item.petType} • {item.sex} • {item.age || 'Age unknown'}{item.foundLocation ? ` • Found: ${item.foundLocation}` : ''}
              </div>
              {item.reason && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>Reason: {item.reason.slice(0, 80)}{item.reason.length > 80 ? '...' : ''}</div>}
              <div className="admin-list-meta">
                {item.ownerName && <span>👤 {item.ownerName}</span>}
                {item.assignedTo && <span>🏥 {item.assignedTo}</span>}
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="admin-list-actions" style={{ flexDirection: 'column', gap: '6px' }}>
              {item.status === 'pending' && (
                <>
                  <button onClick={() => onUpdate(item.id, { status: 'accepted' })} style={{ background: 'var(--green-50)', color: 'var(--green-700)', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Accept</button>
                  <button onClick={() => onUpdate(item.id, { status: 'declined' })} style={{ background: '#FFE4E6', color: 'var(--rose-600)', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Decline</button>
                </>
              )}
              {item.status === 'accepted' && (
                <button onClick={() => onUpdate(item.id, { status: 'completed' })} style={{ background: 'var(--blue-50)', color: 'var(--blue-700)', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Complete</button>
              )}
              <span className={`admin-status admin-status-${STATUS_COLORS[item.status] || 'submitted'}`}>{item.status}</span>
              <button onClick={() => onDelete(item.id)} style={{ background: '#FFE4E6', color: 'var(--rose-600)', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="admin-panel"><div className="admin-empty"><div className="admin-empty-icon">📦</div><div className="admin-empty-title">No intake records</div><div className="admin-empty-text">Animal intake and surrender records will appear here.</div></div></div>
        )}
      </div>
    </>
  );
}
