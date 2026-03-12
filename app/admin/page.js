'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [pets, setPets] = useState([]);
  const [apps, setApps] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddPet, setShowAddPet] = useState(false);
  const [newPet, setNewPet] = useState({ name: '', type: 'dog', breed: '', age: 'Adult', gender: 'Male', description: '', traits: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/pets').then(r => r.json()),
      fetch('/api/applications').then(r => r.json()),
    ]).then(([p, a]) => {
      setPets(Array.isArray(p) ? p : []);
      setApps(Array.isArray(a) ? a : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function addPet(e) {
    e.preventDefault();
    const petData = { ...newPet, traits: newPet.traits.split(',').map(t => t.trim()).filter(Boolean), restrictions: [], photo: `/pets/${newPet.name.toLowerCase().replace(/\s+/g, '-')}.webp` };
    const res = await fetch('/api/pets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(petData) });
    if (res.ok) {
      const pet = await res.json();
      setPets(prev => [...prev, pet]);
      setShowAddPet(false);
      setNewPet({ name: '', type: 'dog', breed: '', age: 'Adult', gender: 'Male', description: '', traits: '' });
    }
  }

  async function updateAppStatus(id, status) {
    await fetch(`/api/applications/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  async function deletePet(id) {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/pets/${id}`, { method: 'DELETE' });
    setPets(prev => prev.filter(p => p.id !== id));
  }

  const pendingApps = apps.filter(a => a.status === 'submitted');
  const adoptedCount = apps.filter(a => a.status === 'adopted').length;

  const TABS = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'pets', label: '🐾 Pets', icon: '🐾' },
    { id: 'applications', label: '📝 Applications', icon: '📝' },
    { id: 'announcements', label: '📢 News', icon: '📢' },
  ];

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="dashboard" style={{ gridTemplateColumns: '240px 1fr' }}>
        {/* Sidebar */}
        <div className="sidebar" style={{ paddingTop: '100px' }}>
          <div className="sidebar-header">
            <div style={{ fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🐾 <span>Admin Panel</span>
            </div>
          </div>
          {TABS.map(tab => (
            <button key={tab.id} className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <span>{tab.icon}</span>
              <span>{tab.label.replace(tab.icon + ' ', '')}</span>
            </button>
          ))}
          <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
            <Link href="/" className="sidebar-link">← Back to Site</Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main" style={{ marginLeft: '240px', padding: '32px' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Dashboard Overview</h1>
              <div className="stats-grid">
                {[
                  { label: 'Total Pets', value: pets.length, icon: '🐾', color: 'var(--blue-500)' },
                  { label: 'Pending Applications', value: pendingApps.length, icon: '📝', color: '#F59E0B' },
                  { label: 'Adoptions', value: adoptedCount, icon: '🏠', color: 'var(--green-500)' },
                  { label: 'Total Applications', value: apps.length, icon: '📊', color: '#8B5CF6' },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div className="stat-card-value" style={{ color: s.color }}>{loading ? '—' : s.value}</div>
                        <div className="stat-card-label">{s.label}</div>
                      </div>
                      <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
              {pendingApps.length > 0 && (
                <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>⚠️ Pending Review ({pendingApps.length})</h3>
                  {pendingApps.slice(0, 5).map(app => (
                    <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <div>
                        <div style={{ fontWeight: '600' }}>{app.firstName} {app.lastName}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interested in: {app.petInterest || app.type}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-sm btn-primary" onClick={() => updateAppStatus(app.id, 'reviewing')}>Review</button>
                        <button className="btn btn-sm" style={{ background: 'var(--green-100)', color: 'var(--green-800)' }} onClick={() => updateAppStatus(app.id, 'approved')}>Approve</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pets Tab */}
          {activeTab === 'pets' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.8rem' }}>Manage Pets ({pets.length})</h1>
                <button className="btn btn-primary" onClick={() => setShowAddPet(!showAddPet)}>
                  {showAddPet ? '✕ Cancel' : '+ Add Pet'}
                </button>
              </div>

              {showAddPet && (
                <form onSubmit={addPet} className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Add New Pet</h3>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input className="form-input" value={newPet.name} onChange={e => setNewPet({ ...newPet, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type *</label>
                      <select className="form-input form-select" value={newPet.type} onChange={e => setNewPet({ ...newPet, type: e.target.value })}>
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="critter">Critter</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Breed</label>
                      <input className="form-input" value={newPet.breed} onChange={e => setNewPet({ ...newPet, breed: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Age</label>
                      <select className="form-input form-select" value={newPet.age} onChange={e => setNewPet({ ...newPet, age: e.target.value })}>
                        <option>Puppy</option><option>Young</option><option>Adult</option><option>Senior</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select className="form-input form-select" value={newPet.gender} onChange={e => setNewPet({ ...newPet, gender: e.target.value })}>
                        <option>Male</option><option>Female</option><option>Unknown</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea className="form-input form-textarea" value={newPet.description} onChange={e => setNewPet({ ...newPet, description: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Traits (comma separated)</label>
                    <input className="form-input" value={newPet.traits} onChange={e => setNewPet({ ...newPet, traits: e.target.value })} placeholder="playful, friendly, calm" />
                  </div>
                  <button type="submit" className="btn btn-primary">Save Pet</button>
                </form>
              )}

              <div style={{ display: 'grid', gap: '12px' }}>
                {pets.map(pet => (
                  <div key={pet.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        {pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐈' : '🐦'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{pet.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{pet.breed} · {pet.age} · {pet.gender}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="badge badge-green">{pet.status}</span>
                      <Link href={`/adopt/${pet.id}`} className="btn btn-sm btn-ghost">View</Link>
                      <button className="btn btn-sm btn-danger" onClick={() => deletePet(pet.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Applications ({apps.length})</h1>
              <div style={{ display: 'grid', gap: '12px' }}>
                {apps.length === 0 ? (
                  <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
                    <p style={{ color: 'var(--text-muted)' }}>No applications received yet.</p>
                  </div>
                ) : apps.map(app => (
                  <div key={app.id} className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>
                          {app.firstName} {app.lastName}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          📧 {app.email} · 📞 {app.phone} · 📅 {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          Interested in: <strong>{app.petInterest || app.type}</strong> · Housing: {app.housing} ({app.ownRent})
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['submitted', 'reviewing', 'approved', 'visit-scheduled', 'adopted', 'rejected'].map(s => (
                          <button key={s} className={`btn btn-sm ${app.status === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => updateAppStatus(app.id, s)} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                            {s.replace(/-/g, ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>News & Announcements</h1>
              <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📢</div>
                <h3 style={{ marginBottom: '8px' }}>Coming Soon</h3>
                <p style={{ color: 'var(--text-muted)' }}>News management will be available in the next update.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
