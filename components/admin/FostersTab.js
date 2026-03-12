'use client';
import { useState } from 'react';

export default function FostersTab({ fosters, pets, loading, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '',
    experience: '', housingType: 'house', hasYard: false, hasPets: false,
    currentPets: '', hasChildren: false, childrenAges: '', availability: '',
    preferredPetTypes: [], vetReference: '', emergencyContact: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ firstName: '', lastName: '', email: '', phone: '', address: '',
      experience: '', housingType: 'house', hasYard: false, hasPets: false,
      currentPets: '', hasChildren: false, childrenAges: '', availability: '',
      preferredPetTypes: [], vetReference: '', emergencyContact: '' });
    setShowAdd(false);
  };

  const statuses = ['all', 'applied', 'approved', 'active', 'completed', 'declined'];
  const filtered = fosters.filter(f => filter === 'all' || f.status === filter);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Foster Program</h1>
          <p className="admin-page-subtitle">{fosters.length} foster families · {fosters.filter(f => f.status === 'active').length} active placements</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }}
            onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? '✕ Cancel' : '+ Add Foster'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Active Fosters', val: fosters.filter(f => f.status === 'active').length, icon: '🏡', accent: '#3B82F6', bg: '#EFF6FF' },
          { label: 'Pending', val: fosters.filter(f => f.status === 'applied').length, icon: '⏳', accent: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Approved', val: fosters.filter(f => f.status === 'approved').length, icon: '✅', accent: '#10B981', bg: '#ECFDF5' },
          { label: 'Completed', val: fosters.filter(f => f.status === 'completed').length, icon: '🎉', accent: '#8B5CF6', bg: '#F5F3FF' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}>
            <div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div>
            <div className="admin-stat-value admin-counter">{s.val}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-filters">
        {statuses.map(s => (
          <button key={s} className={`admin-filter-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} {s !== 'all' && `(${fosters.filter(f => f.status === s).length})`}
          </button>
        ))}
      </div>

      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header">
            <div className="admin-panel-title"><span>➕</span> New Foster Application</div>
          </div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">First Name *</label>
                <input className="form-input" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Last Name *</label>
                <input className="form-input" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
            </div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Email *</label>
                <input className="form-input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Housing Type</label>
                <select className="form-input form-select" value={form.housingType} onChange={e => setForm({...form, housingType: e.target.value})}>
                  <option value="house">House</option><option value="apartment">Apartment</option>
                  <option value="condo">Condo</option><option value="townhouse">Townhouse</option>
                </select></div>
            </div>
            <div className="form-group"><label className="form-label">Address</label>
              <input className="form-input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Experience with animals</label>
              <textarea className="form-input" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} style={{ minHeight: '60px' }} /></div>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
              <label style={{ display: 'flex', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={form.hasYard} onChange={e => setForm({...form, hasYard: e.target.checked})} /> Has Yard</label>
              <label style={{ display: 'flex', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={form.hasPets} onChange={e => setForm({...form, hasPets: e.target.checked})} /> Has Other Pets</label>
              <label style={{ display: 'flex', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={form.hasChildren} onChange={e => setForm({...form, hasChildren: e.target.checked})} /> Has Children</label>
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>Submit Application</button>
          </form>
        </div>
      )}

      <div className="admin-list">
        {filtered.map(f => (
          <div key={f.id} className="admin-list-item">
            <div className="admin-list-avatar" style={{ background: 'var(--blue-50)', color: 'var(--blue-700)', borderRadius: '12px' }}>
              {(f.firstName || '?')[0]}{(f.lastName || '?')[0]}
            </div>
            <div className="admin-list-info">
              <div className="admin-list-name">{f.firstName} {f.lastName}</div>
              <div className="admin-list-meta">
                <span>📧 {f.email}</span>
                {f.phone && <span>📞 {f.phone}</span>}
                <span>🏠 {f.housingType}</span>
                {f.petName && <span>🐾 Fostering: {f.petName}</span>}
              </div>
            </div>
            <div className="admin-list-actions">
              <span className={`admin-status admin-status-${f.status}`}>{f.status}</span>
              <select className="form-input form-select" value={f.status}
                onChange={e => onUpdate(f.id, { status: e.target.value })}
                style={{ padding: '5px 28px 5px 10px', fontSize: '0.8rem', width: 'auto', minWidth: '100px', borderRadius: '10px' }}>
                <option value="applied">Applied</option><option value="approved">Approved</option>
                <option value="active">Active</option><option value="completed">Completed</option>
                <option value="declined">Declined</option>
              </select>
              {f.status === 'approved' && (
                <select className="form-input form-select"
                  onChange={e => { if (e.target.value) { const pet = pets.find(p => p.id === e.target.value); onUpdate(f.id, { petId: e.target.value, petName: pet?.name, status: 'active', startDate: new Date().toISOString().split('T')[0] }); } }}
                  style={{ padding: '5px 10px', fontSize: '0.8rem', width: 'auto', minWidth: '120px', borderRadius: '10px' }}>
                  <option value="">Assign Pet...</option>
                  {(pets || []).filter(p => p.status === 'available').map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}
              <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete?')) onDelete(f.id); }}
                style={{ borderRadius: '10px', padding: '5px 12px' }}>✕</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="admin-panel"><div className="admin-empty">
            <div className="admin-empty-icon">🏡</div>
            <div className="admin-empty-title">No foster applications</div>
            <div className="admin-empty-text">Foster applications will appear here as they are submitted.</div>
          </div></div>
        )}
      </div>
    </>
  );
}
