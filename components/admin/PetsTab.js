'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PetsTab({ pets, loading, onAddPet, onDeletePet, onUpdatePet }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', type: 'dog', breed: '', age: 'Adult', gender: 'Male',
    description: '', traits: '', weight: '', spayedNeutered: false,
    vaccinated: false, adoptionFee: '', microchipId: '', intakeType: 'surrender',
    restrictions: '', medicalNotes: '',
  });

  const resetForm = () => {
    setForm({ name: '', type: 'dog', breed: '', age: 'Adult', gender: 'Male',
      description: '', traits: '', weight: '', spayedNeutered: false,
      vaccinated: false, adoptionFee: '', microchipId: '', intakeType: 'surrender',
      restrictions: '', medicalNotes: '' });
    setEditId(null);
    setShowAdd(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const petData = {
      ...form,
      traits: form.traits.split(',').map(t => t.trim()).filter(Boolean),
      restrictions: form.restrictions.split(',').map(t => t.trim()).filter(Boolean),
      medicalNotes: form.medicalNotes ? [{ note: form.medicalNotes, date: new Date().toISOString() }] : [],
      weight: form.weight ? Number(form.weight) : null,
      adoptionFee: form.adoptionFee ? Number(form.adoptionFee) : 0,
      photo: `/pets/${form.name.toLowerCase().replace(/\s+/g, '-')}.webp`,
    };
    if (editId) { onUpdatePet(editId, petData); } else { onAddPet(petData); }
    resetForm();
  };

  const startEdit = (pet) => {
    setForm({
      name: pet.name, type: pet.type, breed: pet.breed || '', age: pet.age,
      gender: pet.gender, description: pet.description || '',
      traits: (pet.traits || []).join(', '), weight: pet.weight || '',
      spayedNeutered: pet.spayedNeutered || false, vaccinated: pet.vaccinated || false,
      adoptionFee: pet.adoptionFee || '', microchipId: pet.microchipId || '',
      intakeType: pet.intakeType || 'surrender',
      restrictions: (pet.restrictions || []).join(', '), medicalNotes: '',
    });
    setEditId(pet.id);
    setShowAdd(true);
  };

  const filtered = pets.filter(p => {
    if (filter !== 'all' && p.type !== filter && p.status !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !(p.breed || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const typeIcon = (t) => t === 'dog' ? '🐕' : t === 'cat' ? '🐈' : '🐹';
  const typeColor = (t) => t === 'dog' ? { bg: '#EBF8FF', accent: '#29ABE2' } : t === 'cat' ? { bg: '#FFFBEB', accent: '#F59E0B' } : { bg: '#ECFDF5', accent: '#10B981' };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manage Pets</h1>
          <p className="admin-page-subtitle">{pets.length} animals in the shelter system</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }}
            onClick={() => { resetForm(); setShowAdd(!showAdd); }}>
            {showAdd ? '✕ Cancel' : '+ Add Pet'}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Dogs', val: pets.filter(p => p.type === 'dog').length, icon: '🐕', accent: '#29ABE2', bg: '#EBF8FF' },
          { label: 'Cats', val: pets.filter(p => p.type === 'cat').length, icon: '🐈', accent: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Available', val: pets.filter(p => p.status === 'available').length, icon: '✅', accent: '#10B981', bg: '#ECFDF5' },
          { label: 'Adopted', val: pets.filter(p => p.status === 'adopted').length, icon: '🏠', accent: '#8B5CF6', bg: '#F5F3FF' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}>
            <div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div>
            <div className="admin-stat-value admin-counter">{s.val}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="admin-filters">
        {['all', 'dog', 'cat', 'critter', 'available', 'adopted', 'fostered'].map(f => (
          <button key={f} className={`admin-filter-pill ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <input className="admin-filter-search" placeholder="🔍 Search by name or breed..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Add/Edit Form */}
      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <span>{editId ? '✏️' : '➕'}</span> {editId ? 'Edit Pet' : 'Add New Pet'}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="dog">Dog</option><option value="cat">Cat</option><option value="critter">Critter</option>
                </select>
              </div>
            </div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group">
                <label className="form-label">Breed</label>
                <input className="form-input" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <select className="form-input form-select" value={form.age} onChange={e => setForm({...form, age: e.target.value})}>
                  <option>Puppy</option><option>Kitten</option><option>Young</option><option>Adult</option><option>Senior</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-input form-select" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                  <option>Male</option><option>Female</option><option>Unknown</option>
                </select>
              </div>
            </div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group">
                <label className="form-label">Weight (lbs)</label>
                <input className="form-input" type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Adoption Fee ($)</label>
                <input className="form-input" type="number" value={form.adoptionFee} onChange={e => setForm({...form, adoptionFee: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Microchip ID</label>
                <input className="form-input" value={form.microchipId} onChange={e => setForm({...form, microchipId: e.target.value})} />
              </div>
            </div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group">
                <label className="form-label">Intake Type</label>
                <select className="form-input form-select" value={form.intakeType} onChange={e => setForm({...form, intakeType: e.target.value})}>
                  <option value="surrender">Owner Surrender</option><option value="stray">Stray</option>
                  <option value="transfer">Transfer</option><option value="seized">Seized</option>
                  <option value="born-in-care">Born in Care</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', paddingTop: '28px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form.spayedNeutered} onChange={e => setForm({...form, spayedNeutered: e.target.checked})} />
                  Spayed/Neutered
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={form.vaccinated} onChange={e => setForm({...form, vaccinated: e.target.checked})} />
                  Vaccinated
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-input form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group">
                <label className="form-label">Traits (comma separated)</label>
                <input className="form-input" value={form.traits} onChange={e => setForm({...form, traits: e.target.value})} placeholder="playful, friendly, calm" />
              </div>
              <div className="form-group">
                <label className="form-label">Restrictions (comma separated)</label>
                <input className="form-input" value={form.restrictions} onChange={e => setForm({...form, restrictions: e.target.value})} placeholder="no-young-children, experienced-owner" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Medical Notes</label>
              <textarea className="form-input" value={form.medicalNotes} onChange={e => setForm({...form, medicalNotes: e.target.value})} style={{ minHeight: '80px' }} />
            </div>
            <div className="admin-panel-footer" style={{ padding: '0', borderTop: 'none', justifyContent: 'flex-start' }}>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>{editId ? 'Update Pet' : 'Save Pet'}</button>
              <button type="button" className="btn btn-ghost" onClick={resetForm} style={{ borderRadius: '12px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Pet List */}
      {loading ? (
        <div className="admin-list">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="admin-skeleton admin-skeleton-row" />)}
        </div>
      ) : (
        <div className="admin-list">
          {filtered.map(pet => {
            const tc = typeColor(pet.type);
            return (
              <div key={pet.id} className="admin-list-item">
                <div className="admin-list-avatar" style={{ background: tc.bg, color: tc.accent, fontSize: '1.3rem', borderRadius: '14px' }}>
                  {typeIcon(pet.type)}
                </div>
                <div className="admin-list-info">
                  <div className="admin-list-name">{pet.name}</div>
                  <div className="admin-list-meta">
                    <span>{pet.breed}</span>
                    <span>{pet.age} · {pet.gender}</span>
                    {pet.weight && <span>{pet.weight} lbs</span>}
                    {pet.microchipId && <span>📟 {pet.microchipId}</span>}
                  </div>
                </div>
                <div className="admin-list-actions">
                  {pet.spayedNeutered && <span title="Spayed/Neutered" style={{ fontSize: '0.85rem' }}>✅</span>}
                  {pet.vaccinated && <span title="Vaccinated" style={{ fontSize: '0.85rem' }}>💉</span>}
                  <span className={`admin-status admin-status-${pet.status}`}>{pet.status}</span>
                  <Link href={`/adopt/${pet.id}`} className="btn btn-sm btn-ghost" style={{ borderRadius: '10px', padding: '6px 14px', fontSize: '0.8rem' }}>View</Link>
                  <button className="btn btn-sm btn-ghost" onClick={() => startEdit(pet)} style={{ borderRadius: '10px', padding: '6px 14px', fontSize: '0.8rem' }}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete this pet?')) onDeletePet(pet.id); }}
                    style={{ borderRadius: '10px', padding: '6px 14px', fontSize: '0.8rem' }}>Delete</button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="admin-panel">
              <div className="admin-empty">
                <div className="admin-empty-icon">🔍</div>
                <div className="admin-empty-title">No pets match your filters</div>
                <div className="admin-empty-text">Try adjusting your search or filter criteria.</div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
