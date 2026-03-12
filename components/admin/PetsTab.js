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
    if (editId) {
      onUpdatePet(editId, petData);
    } else {
      onAddPet(petData);
    }
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
      restrictions: (pet.restrictions || []).join(', '),
      medicalNotes: '',
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

  const typeIcon = (t) => t === 'dog' ? '🐕' : t === 'cat' ? '🐈' : '🐦';
  const statusColor = (s) => s === 'available' ? 'badge-green' : s === 'adopted' ? 'badge-blue' : 'badge-rose';

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Manage Pets ({pets.length})</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowAdd(!showAdd); }}>
          {showAdd ? '✕ Cancel' : '+ Add Pet'}
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        {['all', 'dog', 'cat', 'critter', 'available', 'adopted', 'fostered'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
        ))}
        <input className="form-input" placeholder="Search by name or breed..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '8px 16px', fontSize: '0.9rem' }} />
      </div>

      {/* Add/Edit Form */}
      {showAdd && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>{editId ? '✏️ Edit Pet' : '➕ Add New Pet'}</h3>
          <div className="grid-2">
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
          <div className="grid-3">
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
          <div className="grid-3">
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
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Intake Type</label>
              <select className="form-input form-select" value={form.intakeType} onChange={e => setForm({...form, intakeType: e.target.value})}>
                <option value="surrender">Owner Surrender</option><option value="stray">Stray</option>
                <option value="transfer">Transfer</option><option value="seized">Seized</option>
                <option value="born-in-care">Born in Care</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', paddingTop: '28px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.spayedNeutered} onChange={e => setForm({...form, spayedNeutered: e.target.checked})} />
                Spayed/Neutered
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.vaccinated} onChange={e => setForm({...form, vaccinated: e.target.checked})} />
                Vaccinated
              </label>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-input form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          </div>
          <div className="grid-2">
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
            <textarea className="form-input form-textarea" value={form.medicalNotes} onChange={e => setForm({...form, medicalNotes: e.target.value})} style={{ minHeight: '80px' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary">{editId ? 'Update Pet' : 'Save Pet'}</button>
            <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      {/* Pet List */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {filtered.map(pet => (
          <div key={pet.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {typeIcon(pet.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{pet.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {pet.breed} · {pet.age} · {pet.gender}
                  {pet.weight && ` · ${pet.weight} lbs`}
                  {pet.microchipId && ` · 📟 ${pet.microchipId}`}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '4px', marginRight: '8px' }}>
                {pet.spayedNeutered && <span title="Spayed/Neutered" style={{ fontSize: '0.85rem' }}>✅</span>}
                {pet.vaccinated && <span title="Vaccinated" style={{ fontSize: '0.85rem' }}>💉</span>}
              </div>
              <span className={`badge ${statusColor(pet.status)}`}>{pet.status}</span>
              <Link href={`/adopt/${pet.id}`} className="btn btn-sm btn-ghost">View</Link>
              <button className="btn btn-sm btn-ghost" onClick={() => startEdit(pet)}>✏️</button>
              <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete this pet?')) onDeletePet(pet.id); }}>Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <p style={{ color: 'var(--text-muted)' }}>No pets match your filters.</p>
          </div>
        )}
      </div>
    </>
  );
}
