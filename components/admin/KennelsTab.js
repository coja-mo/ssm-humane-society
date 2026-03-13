'use client';
import { useState } from 'react';

const statusColors = { available: '#10B981', occupied: '#3B82F6', maintenance: '#F59E0B', cleaning: '#06B6D4', reserved: '#8B5CF6' };

export default function KennelsTab({ kennels, pets, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({ name: '', size: 'medium', section: 'A', features: '', status: 'available', maxCapacity: '1' });
  const handleSubmit = (e) => { e.preventDefault(); onAdd({ ...form, maxCapacity: Number(form.maxCapacity), features: form.features.split(',').map(f => f.trim()).filter(Boolean) }); setForm({ name: '', size: 'medium', section: 'A', features: '', status: 'available', maxCapacity: '1' }); setShowAdd(false); };
  const filtered = kennels.filter(k => { if (filter !== 'all' && k.status !== filter) return false; return true; });
  const sections = [...new Set(kennels.map(k => k.section || 'A'))].sort();
  const occupiedCount = kennels.filter(k => k.status === 'occupied').length;
  const availCount = kennels.filter(k => k.status === 'available').length;
  const maintCount = kennels.filter(k => k.status === 'maintenance' || k.status === 'cleaning').length;

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Kennel Management</h1><p className="admin-page-subtitle">{kennels.length} kennels · {occupiedCount} occupied · {availCount} available</p></div>
        <div className="admin-page-actions"><button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }} onClick={() => setShowAdd(!showAdd)}>{showAdd ? '✕ Cancel' : '+ Add Kennel'}</button></div>
      </div>
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[{ label: 'Available', val: availCount, icon: '✅', accent: '#10B981', bg: '#ECFDF5' }, { label: 'Occupied', val: occupiedCount, icon: '🐾', accent: '#3B82F6', bg: '#EFF6FF' }, { label: 'Maintenance', val: maintCount, icon: '🔧', accent: '#F59E0B', bg: '#FFFBEB' }, { label: 'Occupancy', val: kennels.length ? `${Math.round((occupiedCount / kennels.length) * 100)}%` : '0%', icon: '📊', accent: '#8B5CF6', bg: '#F5F3FF' }].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}><div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div><div className="admin-stat-value admin-counter">{s.val}</div><div className="admin-stat-label">{s.label}</div></div>
        ))}
      </div>

      {/* Visual Kennel Map */}
      <div className="admin-panel" style={{ marginBottom: '20px' }}>
        <div className="admin-panel-header"><div className="admin-panel-title"><span style={{ fontSize: '1.1rem' }}>🗺️</span> Kennel Map</div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem' }}>
            {Object.entries(statusColors).map(([s, c]) => (<div key={s} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', borderRadius: '3px', background: c }} /><span style={{ textTransform: 'capitalize' }}>{s}</span></div>))}
          </div>
        </div>
        <div className="admin-panel-body">
          {sections.map(section => (
            <div key={section} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Section {section}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '6px' }}>
                {kennels.filter(k => (k.section || 'A') === section).map(k => {
                  const color = statusColors[k.status] || '#6B7280';
                  const assignedPet = k.assignedPetId ? pets.find(p => p.id === k.assignedPetId) : null;
                  return (
                    <button key={k.id} onClick={() => setExpandedId(expandedId === k.id ? null : k.id)}
                      style={{ padding: '10px 8px', borderRadius: '10px', border: expandedId === k.id ? `2px solid ${color}` : '1.5px solid var(--border-light)', background: `${color}10`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color }}>{k.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{k.size}</div>
                      {assignedPet && <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-accent)', marginTop: '2px' }}>{assignedPet.name}</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-filters">
        {['all', 'available', 'occupied', 'maintenance', 'cleaning'].map(s => (<button key={s} className={`admin-filter-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>))}
      </div>
      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title"><span>➕</span> Add Kennel</div></div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Name/Number *</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="K-01" /></div>
              <div className="form-group"><label className="form-label">Size</label><select className="form-input form-select" value={form.size} onChange={e => setForm({...form, size: e.target.value})}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option><option value="xl">XL</option></select></div>
              <div className="form-group"><label className="form-label">Section</label><input className="form-input" value={form.section} onChange={e => setForm({...form, section: e.target.value})} placeholder="A" /></div>
            </div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Max Capacity</label><input className="form-input" type="number" value={form.maxCapacity} onChange={e => setForm({...form, maxCapacity: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Features (comma separated)</label><input className="form-input" value={form.features} onChange={e => setForm({...form, features: e.target.value})} placeholder="heated, outdoor access..." /></div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>Add Kennel</button>
          </form>
        </div>
      )}
      <div className="admin-list">
        {filtered.map(k => {
          const color = statusColors[k.status] || '#6B7280';
          const assignedPet = k.assignedPetId ? pets.find(p => p.id === k.assignedPetId) : null;
          const isExpanded = expandedId === k.id;
          return (
            <div key={k.id} className="admin-panel" style={{ marginBottom: '8px' }}>
              <div style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>{k.name}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Kennel {k.name}
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>Section {k.section || 'A'}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                      <span>📐 {k.size}</span>
                      {assignedPet && <span>🐾 {assignedPet.name}</span>}
                      {(k.features || []).length > 0 && <span>✨ {k.features.join(', ')}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                    <span className={`admin-status admin-status-${k.status}`}>{k.status}</span>
                    <select className="form-input form-select" value={k.status} onChange={e => onUpdate(k.id, { status: e.target.value })} style={{ padding: '5px 28px 5px 10px', fontSize: '0.8rem', width: 'auto', minWidth: '110px', borderRadius: '10px' }}>
                      <option value="available">Available</option><option value="occupied">Occupied</option><option value="maintenance">Maintenance</option><option value="cleaning">Cleaning</option><option value="reserved">Reserved</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginLeft: '56px' }}>
                  <button style={{ fontSize: '0.82rem', color: 'var(--text-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setExpandedId(isExpanded ? null : k.id)}>
                    <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: '0.2s', display: 'inline-block' }}>▶</span> {isExpanded ? 'Hide' : 'Details'}
                  </button>
                  <button style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { if (confirm('Delete?')) onDelete(k.id); }}>🗑️</button>
                </div>
              </div>
              {isExpanded && (
                <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>📋 Info</h4>
                      {[{ l: 'Status', v: k.status }, { l: 'Size', v: k.size }, { l: 'Section', v: k.section }, { l: 'Capacity', v: k.maxCapacity }, { l: 'Features', v: (k.features || []).join(', ') || 'None' }].map(i => (
                        <div key={i.l} style={{ display: 'flex', gap: '8px', padding: '4px 0', fontSize: '0.84rem' }}><span style={{ color: 'var(--text-muted)', minWidth: '80px' }}>{i.l}:</span><span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{i.v}</span></div>
                      ))}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>🐾 Assign Pet</h4>
                      <select className="form-input form-select" value={k.assignedPetId || ''} onChange={e => onUpdate(k.id, { assignedPetId: e.target.value || null, status: e.target.value ? 'occupied' : 'available' })} style={{ marginBottom: '12px' }}>
                        <option value="">No pet assigned</option>
                        {pets.filter(p => p.status === 'available' || p.id === k.assignedPetId).map(p => <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>)}
                      </select>
                      {assignedPet && (
                        <div style={{ padding: '14px', background: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1D4ED8' }}>🐾 {assignedPet.name}</div>
                          <div style={{ fontSize: '0.82rem', color: '#1E40AF' }}>{assignedPet.breed} · {assignedPet.age}</div>
                        </div>
                      )}
                      {k.lastCleanedAt && <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>🧹 Last cleaned: {new Date(k.lastCleanedAt).toLocaleDateString()}</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (<div className="admin-panel"><div className="admin-empty"><div className="admin-empty-icon">🏠</div><div className="admin-empty-title">No kennels</div><div className="admin-empty-text">Add kennels to manage shelter housing.</div></div></div>)}
      </div>
    </>
  );
}
