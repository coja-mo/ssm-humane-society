'use client';
import { useState } from 'react';

const TYPES = ['standard', 'isolation', 'medical', 'outdoor', 'nursery'];
const SIZES = ['small', 'medium', 'large', 'xlarge'];
const STATUS_COLORS = { available: '#DCFCE7', occupied: '#DBEAFE', maintenance: '#FEF3C7', reserved: '#F3E8FF' };
const STATUS_TEXT = { available: 'var(--green-800)', occupied: 'var(--blue-800)', maintenance: '#92400E', reserved: '#6B21A8' };
const TYPE_EMOJI = { standard: '🏠', isolation: '🔒', medical: '🏥', outdoor: '🌳', nursery: '👶' };

export default function KennelsTab({ kennels = [], pets = [], onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    name: '', building: 'Main', type: 'standard', capacity: 1,
    size: 'medium', features: [], notes: '',
  });

  const filtered = filter === 'all' ? kennels : kennels.filter(k => k.status === filter);
  const available = kennels.filter(k => k.status === 'available').length;
  const occupied = kennels.filter(k => k.status === 'occupied').length;
  const totalCapacity = kennels.reduce((sum, k) => sum + (k.capacity || 1), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd({ ...form, capacity: parseInt(form.capacity) || 1 });
    setForm({ name: '', building: 'Main', type: 'standard', capacity: 1, size: 'medium', features: [], notes: '' });
    setShowForm(false);
  };

  const assignPet = async (kennelId, petId, petName) => {
    await onUpdate(kennelId, { assignedPetId: petId, assignedPetName: petName, status: petId ? 'occupied' : 'available' });
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Kennel Management</h1>
          <p className="admin-page-subtitle">{kennels.length} kennels — {available} available, {occupied} occupied</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 600 }}>
            {showForm ? '✕ Cancel' : '+ Add Kennel'}
          </button>
        </div>
      </div>

      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Available', val: available, color: 'var(--green-500)' },
          { label: 'Occupied', val: occupied, color: 'var(--blue-500)' },
          { label: 'Maintenance', val: kennels.filter(k => k.status === 'maintenance').length, color: 'var(--amber-500)' },
          { label: 'Total Capacity', val: totalCapacity, color: 'var(--text-muted)' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.color }}><div className="admin-stat-value">{s.val}</div><div className="admin-stat-label">{s.label}</div></div>
        ))}
      </div>

      {showForm && (
        <div className="admin-panel" style={{ marginBottom: '20px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title">🏠 Add Kennel</div></div>
          <div className="admin-panel-body">
            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid admin-form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-group"><label className="form-label">Kennel Name/Number *</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. K-101, Run A" /></div>
                <div className="form-group"><label className="form-label">Building</label><input className="form-input" value={form.building} onChange={e => setForm({...form, building: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Type</label>
                  <select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-form-grid admin-form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-group"><label className="form-label">Size</label>
                  <select className="form-input form-select" value={form.size} onChange={e => setForm({...form, size: e.target.value})}>
                    {SIZES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Capacity</label><input className="form-input" type="number" min="1" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} /></div>
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Features</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {['heated', 'outdoor-access', 'window', 'camera', 'water-bowl', 'double-door'].map(feat => (
                    <label key={feat} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input type="checkbox" checked={form.features.includes(feat)} onChange={e => setForm({...form, features: e.target.checked ? [...form.features, feat] : form.features.filter(f => f !== feat)})} style={{ accentColor: 'var(--blue-500)' }} />
                      {feat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}><label className="form-label">Notes</label><textarea className="form-input form-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px' }}>Add Kennel</button>
            </form>
          </div>
        </div>
      )}

      <div className="admin-filters">
        {['all', 'available', 'occupied', 'maintenance', 'reserved'].map(f => (
          <button key={f} className={`admin-filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? kennels.length : kennels.filter(k => k.status === f).length})
          </button>
        ))}
      </div>

      {/* Kennel Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
        {filtered.sort((a, b) => a.name.localeCompare(b.name)).map(kennel => (
          <div key={kennel.id} className="admin-panel" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: STATUS_COLORS[kennel.status] || '#F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {TYPE_EMOJI[kennel.type] || '🏠'} {kennel.name}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.7)', padding: '2px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, color: STATUS_TEXT[kennel.status] || 'var(--text-secondary)', textTransform: 'uppercase' }}>
                {kennel.status}
              </span>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                <span>📐 {kennel.size} • Capacity: {kennel.capacity} • {kennel.building}</span>
                <span>🏷️ {kennel.type}</span>
                {kennel.features?.length > 0 && <span>✨ {kennel.features.map(f => f.replace(/-/g, ' ')).join(', ')}</span>}
                {kennel.assignedPetName && <span style={{ fontWeight: 600, color: 'var(--blue-600)' }}>🐾 {kennel.assignedPetName}</span>}
              </div>

              {/* Assign Pet */}
              {kennel.status === 'available' && (
                <select style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1.5px solid var(--border-light)', fontSize: '0.82rem', background: 'var(--bg-secondary)', marginBottom: '8px', fontFamily: 'inherit' }}
                  value="" onChange={e => { const p = pets.find(p => p.id === e.target.value); if (p) assignPet(kennel.id, p.id, p.name); }}>
                  <option value="">Assign a pet...</option>
                  {pets.filter(p => p.status === 'available').map(p => <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>)}
                </select>
              )}
              {kennel.status === 'occupied' && (
                <button onClick={() => assignPet(kennel.id, null, '')} style={{ width: '100%', padding: '6px', borderRadius: '8px', border: '1.5px solid var(--border-light)', background: 'var(--bg-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, marginBottom: '8px', fontFamily: 'inherit' }}>
                  Release Pet
                </button>
              )}

              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => onUpdate(kennel.id, { status: 'maintenance' })} style={{ flex: 1, background: '#FEF3C7', color: '#92400E', border: 'none', padding: '5px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}>🔧 Maint.</button>
                <button onClick={() => onDelete(kennel.id)} style={{ background: '#FFE4E6', color: 'var(--rose-600)', border: 'none', padding: '5px 8px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="admin-panel" style={{ gridColumn: '1 / -1' }}><div className="admin-empty"><div className="admin-empty-icon">🏠</div><div className="admin-empty-title">No kennels found</div><div className="admin-empty-text">Add kennels to manage your shelter spaces.</div></div></div>
        )}
      </div>
    </>
  );
}
