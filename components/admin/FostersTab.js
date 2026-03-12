'use client';
import { useState } from 'react';

export default function FostersTab({ fosters, pets, loading, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
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
  const statusColors = { applied: '#F59E0B', approved: 'var(--green-500)', active: 'var(--blue-500)', completed: 'var(--text-muted)', declined: 'var(--rose-500)' };

  const filtered = fosters.filter(f => filter === 'all' || f.status === filter);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>🏡 Foster Program ({fosters.length})</h1>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancel' : '+ Add Foster'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Active Fosters', value: fosters.filter(f => f.status === 'active').length, color: 'var(--blue-500)', icon: '🏡' },
          { label: 'Pending Approval', value: fosters.filter(f => f.status === 'applied').length, color: '#F59E0B', icon: '⏳' },
          { label: 'Approved', value: fosters.filter(f => f.status === 'approved').length, color: 'var(--green-500)', icon: '✅' },
          { label: 'Completed', value: fosters.filter(f => f.status === 'completed').length, color: 'var(--text-muted)', icon: '🎉' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="stat-card-value" style={{ color: s.color, fontSize: '1.5rem' }}>{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
              <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>
            {s} {s !== 'all' && `(${fosters.filter(f => f.status === s).length})`}
          </button>
        ))}
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>➕ New Foster Application</h3>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">First Name *</label>
              <input className="form-input" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Last Name *</label>
              <input className="form-input" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
          </div>
          <div className="grid-3">
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
            <label style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.hasYard} onChange={e => setForm({...form, hasYard: e.target.checked})} /> Has Yard</label>
            <label style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.hasPets} onChange={e => setForm({...form, hasPets: e.target.checked})} /> Has Other Pets</label>
            <label style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.hasChildren} onChange={e => setForm({...form, hasChildren: e.target.checked})} /> Has Children</label>
          </div>
          <button type="submit" className="btn btn-primary">Submit Application</button>
        </form>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {filtered.map(f => (
          <div key={f.id} className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--blue-700)', fontSize: '1rem' }}>
                  {(f.firstName || '?')[0]}{(f.lastName || '?')[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{f.firstName} {f.lastName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    📧 {f.email} {f.phone && `· 📞 ${f.phone}`} · 🏠 {f.housingType}
                    {f.petName && ` · 🐾 Fostering: ${f.petName}`}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="badge" style={{ background: `${statusColors[f.status]}20`, color: statusColors[f.status] }}>{f.status}</span>
                <select className="form-input form-select" value={f.status}
                  onChange={e => onUpdate(f.id, { status: e.target.value })}
                  style={{ padding: '4px 28px 4px 8px', fontSize: '0.8rem', width: 'auto', minWidth: '100px' }}>
                  <option value="applied">Applied</option><option value="approved">Approved</option>
                  <option value="active">Active</option><option value="completed">Completed</option>
                  <option value="declined">Declined</option>
                </select>
                {f.status === 'approved' && (
                  <select className="form-input form-select"
                    onChange={e => { if (e.target.value) { const pet = pets.find(p => p.id === e.target.value); onUpdate(f.id, { petId: e.target.value, petName: pet?.name, status: 'active', startDate: new Date().toISOString().split('T')[0] }); } }}
                    style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto', minWidth: '120px' }}>
                    <option value="">Assign Pet...</option>
                    {(pets || []).filter(p => p.status === 'available').map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                )}
                <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete?')) onDelete(f.id); }} style={{ padding: '4px 8px' }}>✕</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏡</div>
            <p style={{ color: 'var(--text-muted)' }}>No foster applications yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
