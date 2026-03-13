'use client';
import { useState } from 'react';
import Link from 'next/link';

function PetDetail({ pet, onUpdate }) {
  const [noteText, setNoteText] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const medicalNotes = pet.medicalNotes || [];
  const weightHistory = pet.weightHistory || [];

  const addMedicalNote = () => {
    if (!noteText.trim()) return;
    const notes = [...medicalNotes, { note: noteText, date: new Date().toISOString(), author: 'Staff' }];
    onUpdate(pet.id, { medicalNotes: notes }); setNoteText('');
  };

  const addWeight = () => {
    if (!weightInput) return;
    const history = [...weightHistory, { weight: Number(weightInput), date: new Date().toISOString() }];
    onUpdate(pet.id, { weightHistory: history, weight: Number(weightInput) }); setWeightInput('');
  };

  return (
    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>📋 Pet Profile</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
            {[{ l: 'Name', v: pet.name }, { l: 'Species', v: pet.type }, { l: 'Breed', v: pet.breed }, { l: 'Age', v: pet.age }, { l: 'Gender', v: pet.gender }, { l: 'Weight', v: pet.weight ? `${pet.weight} lbs` : null }, { l: 'Microchip', v: pet.microchipId }, { l: 'Intake', v: pet.intakeType }, { l: 'Fee', v: pet.adoptionFee ? `$${pet.adoptionFee}` : null }, { l: 'Spayed/Neutered', v: pet.spayedNeutered ? '✅ Yes' : '❌ No' }, { l: 'Vaccinated', v: pet.vaccinated ? '✅ Yes' : '❌ No' }, { l: 'Status', v: pet.status }, { l: 'Intake Date', v: pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : null }, { l: 'Days in Care', v: pet.createdAt ? Math.floor((Date.now() - new Date(pet.createdAt).getTime()) / 86400000) + ' days' : null }].filter(i => i.v != null).map(i => (
              <div key={i.l} style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--text-muted)', fontWeight: 500, minWidth: '110px' }}>{i.l}:</span><span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{i.v}</span></div>
            ))}
          </div>
          {(pet.traits || []).length > 0 && (
            <div style={{ marginTop: '12px' }}><div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>TRAITS</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>{pet.traits.map(t => <span key={t} style={{ padding: '3px 10px', borderRadius: '100px', background: 'var(--blue-50)', color: 'var(--blue-700)', fontSize: '0.75rem', fontWeight: 600 }}>{t}</span>)}</div></div>
          )}
          {(pet.restrictions || []).length > 0 && (
            <div style={{ marginTop: '10px' }}><div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>RESTRICTIONS</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>{pet.restrictions.map(r => <span key={r} style={{ padding: '3px 10px', borderRadius: '100px', background: '#FEF2F2', color: '#EF4444', fontSize: '0.75rem', fontWeight: 600 }}>{r.replace(/-/g, ' ')}</span>)}</div></div>
          )}
          {pet.description && <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '10px', fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{pet.description}</div>}
        </div>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>🏥 Medical Timeline</h4>
          <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '16px' }}>
            {medicalNotes.length > 0 ? medicalNotes.slice().reverse().map((n, i) => (
              <div key={i} style={{ padding: '10px 14px', borderLeft: '3px solid var(--blue-300)', marginBottom: '8px', background: 'var(--bg-primary)', borderRadius: '0 10px 10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.78rem', color: 'var(--blue-700)' }}>{n.author || 'Vet'}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{new Date(n.date).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '0.84rem', lineHeight: 1.5 }}>{n.note}</div>
              </div>
            )) : <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '16px', textAlign: 'center' }}>No medical records yet</div>}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input className="form-input" placeholder="Add medical note..." value={noteText} onChange={e => setNoteText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMedicalNote()} style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem', borderRadius: '10px' }} />
            <button className="btn btn-sm btn-primary" onClick={addMedicalNote} style={{ borderRadius: '10px', padding: '8px 18px' }}>Add</button>
          </div>

          {/* Weight Tracking */}
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '20px', marginBottom: '10px', color: 'var(--text-accent)' }}>⚖️ Weight Tracker</h4>
          {weightHistory.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px', marginBottom: '12px', padding: '0 4px' }}>
              {weightHistory.slice(-12).map((w, i) => {
                const max = Math.max(...weightHistory.map(h => h.weight));
                const pct = max ? (w.weight / max * 100) : 50;
                return <div key={i} style={{ flex: 1, height: `${Math.max(pct, 10)}%`, background: 'linear-gradient(to top, var(--blue-400), var(--blue-300))', borderRadius: '3px', minWidth: '8px', position: 'relative' }} title={`${w.weight} lbs – ${new Date(w.date).toLocaleDateString()}`} />;
              })}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input className="form-input" type="number" step="0.1" placeholder="Weight (lbs)" value={weightInput} onChange={e => setWeightInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addWeight()} style={{ width: '120px', padding: '8px 10px', fontSize: '0.85rem', borderRadius: '10px' }} />
            <button className="btn btn-sm btn-ghost" onClick={addWeight} style={{ borderRadius: '10px', padding: '6px 14px', fontSize: '0.82rem' }}>📏 Log Weight</button>
          </div>

          {/* Quick Status */}
          <div style={{ marginTop: '20px', padding: '14px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px' }}>Quick Update</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['available', 'adopted', 'fostered', 'medical-hold', 'pending'].map(s => (
                <button key={s} onClick={() => onUpdate(pet.id, { status: s })}
                  className={`btn btn-sm ${pet.status === s ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ borderRadius: '10px', padding: '5px 14px', fontSize: '0.78rem', textTransform: 'capitalize' }}>
                  {s.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PetsTab({ pets, loading, onAddPet, onDeletePet, onUpdatePet }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [form, setForm] = useState({
    name: '', type: 'dog', breed: '', age: 'Adult', gender: 'Male',
    description: '', traits: '', weight: '', spayedNeutered: false,
    vaccinated: false, adoptionFee: '', microchipId: '', intakeType: 'surrender',
    restrictions: '', medicalNotes: '',
  });

  const resetForm = () => {
    setForm({ name: '', type: 'dog', breed: '', age: 'Adult', gender: 'Male', description: '', traits: '', weight: '', spayedNeutered: false, vaccinated: false, adoptionFee: '', microchipId: '', intakeType: 'surrender', restrictions: '', medicalNotes: '' });
    setEditId(null); setShowAdd(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const petData = { ...form, traits: form.traits.split(',').map(t => t.trim()).filter(Boolean), restrictions: form.restrictions.split(',').map(t => t.trim()).filter(Boolean), medicalNotes: form.medicalNotes ? [{ note: form.medicalNotes, date: new Date().toISOString() }] : [], weight: form.weight ? Number(form.weight) : null, adoptionFee: form.adoptionFee ? Number(form.adoptionFee) : 0, photo: `/pets/${form.name.toLowerCase().replace(/\s+/g, '-')}.webp` };
    if (editId) { onUpdatePet(editId, petData); } else { onAddPet(petData); }
    resetForm();
  };

  const startEdit = (pet) => {
    setForm({ name: pet.name, type: pet.type, breed: pet.breed || '', age: pet.age, gender: pet.gender, description: pet.description || '', traits: (pet.traits || []).join(', '), weight: pet.weight || '', spayedNeutered: pet.spayedNeutered || false, vaccinated: pet.vaccinated || false, adoptionFee: pet.adoptionFee || '', microchipId: pet.microchipId || '', intakeType: pet.intakeType || 'surrender', restrictions: (pet.restrictions || []).join(', '), medicalNotes: '' });
    setEditId(pet.id); setShowAdd(true);
  };

  const typeIcon = (t) => t === 'dog' ? '🐕' : t === 'cat' ? '🐈' : '🐹';
  const typeColor = (t) => t === 'dog' ? { bg: '#EBF8FF', accent: '#29ABE2' } : t === 'cat' ? { bg: '#FFFBEB', accent: '#F59E0B' } : { bg: '#ECFDF5', accent: '#10B981' };

  let filtered = pets.filter(p => {
    if (filter !== 'all' && p.type !== filter && p.status !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !(p.breed || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sortBy === 'fee') return (b.adoptionFee || 0) - (a.adoptionFee || 0);
    return 0;
  });

  // Longest waiting
  const longestWaiting = [...pets].filter(p => p.status === 'available' && p.createdAt).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).slice(0, 3);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manage Pets</h1>
          <p className="admin-page-subtitle">{pets.length} animals · {pets.filter(p => p.status === 'available').length} available for adoption</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }}
            onClick={() => { resetForm(); setShowAdd(!showAdd); }}>
            {showAdd ? '✕ Cancel' : '+ Add Pet'}
          </button>
        </div>
      </div>

      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Dogs', val: pets.filter(p => p.type === 'dog').length, icon: '🐕', accent: '#29ABE2', bg: '#EBF8FF' },
          { label: 'Cats', val: pets.filter(p => p.type === 'cat').length, icon: '🐈', accent: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Available', val: pets.filter(p => p.status === 'available').length, icon: '✅', accent: '#10B981', bg: '#ECFDF5' },
          { label: 'Adopted', val: pets.filter(p => p.status === 'adopted').length, icon: '🏠', accent: '#8B5CF6', bg: '#F5F3FF' },
          { label: 'Fostered', val: pets.filter(p => p.status === 'fostered').length, icon: '💛', accent: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Medical Hold', val: pets.filter(p => p.status === 'medical-hold').length, icon: '🏥', accent: '#EF4444', bg: '#FEF2F2' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}>
            <div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div>
            <div className="admin-stat-value admin-counter">{s.val}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Longest Waiting */}
      {longestWaiting.length > 0 && (
        <div className="admin-panel" style={{ marginBottom: '20px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title"><span>⏰</span> Longest Waiting</div></div>
          <div className="admin-panel-body" style={{ padding: '12px 24px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {longestWaiting.map(p => {
                const days = Math.floor((Date.now() - new Date(p.createdAt).getTime()) / 86400000);
                const tc = typeColor(p.type);
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 18px', background: tc.bg, borderRadius: '12px', flex: 1, border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '1.4rem' }}>{typeIcon(p.type)}</div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.breed} · <strong style={{ color: days > 60 ? '#EF4444' : days > 30 ? '#F59E0B' : 'var(--text-secondary)' }}>{days} days</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="admin-filters">
        {['all', 'dog', 'cat', 'critter', 'available', 'adopted', 'fostered', 'medical-hold'].map(f => (
          <button key={f} className={`admin-filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'medical-hold' ? '🏥 Medical' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="admin-filter-divider" />
        <select className="form-input form-select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '6px 30px 6px 10px', fontSize: '0.8rem', borderRadius: '10px', width: 'auto' }}>
          <option value="name">Sort: Name</option><option value="newest">Sort: Newest</option><option value="oldest">Sort: Oldest</option><option value="fee">Sort: Fee</option>
        </select>
        <input className="admin-filter-search" placeholder="🔍 Search by name or breed..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title"><span>{editId ? '✏️' : '➕'}</span> {editId ? 'Edit Pet' : 'Add New Pet'}</div></div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Type *</label><select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="dog">Dog</option><option value="cat">Cat</option><option value="critter">Critter</option></select></div>
            </div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Breed</label><input className="form-input" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Age</label><select className="form-input form-select" value={form.age} onChange={e => setForm({...form, age: e.target.value})}><option>Puppy</option><option>Kitten</option><option>Young</option><option>Adult</option><option>Senior</option></select></div>
              <div className="form-group"><label className="form-label">Gender</label><select className="form-input form-select" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}><option>Male</option><option>Female</option><option>Unknown</option></select></div>
            </div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Weight (lbs)</label><input className="form-input" type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Adoption Fee ($)</label><input className="form-input" type="number" value={form.adoptionFee} onChange={e => setForm({...form, adoptionFee: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Microchip ID</label><input className="form-input" value={form.microchipId} onChange={e => setForm({...form, microchipId: e.target.value})} /></div>
            </div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Intake Type</label><select className="form-input form-select" value={form.intakeType} onChange={e => setForm({...form, intakeType: e.target.value})}><option value="surrender">Owner Surrender</option><option value="stray">Stray</option><option value="transfer">Transfer</option><option value="seized">Seized</option><option value="born-in-care">Born in Care</option></select></div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', paddingTop: '28px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}><input type="checkbox" checked={form.spayedNeutered} onChange={e => setForm({...form, spayedNeutered: e.target.checked})} /> Spayed/Neutered</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}><input type="checkbox" checked={form.vaccinated} onChange={e => setForm({...form, vaccinated: e.target.checked})} /> Vaccinated</label>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Description *</label><textarea className="form-input form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Traits (comma separated)</label><input className="form-input" value={form.traits} onChange={e => setForm({...form, traits: e.target.value})} placeholder="playful, friendly, calm" /></div>
              <div className="form-group"><label className="form-label">Restrictions (comma separated)</label><input className="form-input" value={form.restrictions} onChange={e => setForm({...form, restrictions: e.target.value})} placeholder="no-young-children, experienced-owner" /></div>
            </div>
            <div className="form-group"><label className="form-label">Medical Notes</label><textarea className="form-input" value={form.medicalNotes} onChange={e => setForm({...form, medicalNotes: e.target.value})} style={{ minHeight: '80px' }} /></div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>{editId ? 'Update Pet' : 'Save Pet'}</button>
              <button type="button" className="btn btn-ghost" onClick={resetForm} style={{ borderRadius: '12px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="admin-list">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="admin-skeleton admin-skeleton-row" />)}</div>
      ) : (
        <div className="admin-list">
          {filtered.map(pet => {
            const tc = typeColor(pet.type);
            const isExpanded = expandedId === pet.id;
            const days = pet.createdAt ? Math.floor((Date.now() - new Date(pet.createdAt).getTime()) / 86400000) : null;
            return (
              <div key={pet.id} className="admin-panel" style={{ marginBottom: '8px' }}>
                <div style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: tc.bg, color: tc.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{typeIcon(pet.type)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {pet.name}
                        {days && days > 30 && <span style={{ padding: '2px 8px', borderRadius: '100px', background: days > 60 ? '#FEF2F2' : '#FFFBEB', color: days > 60 ? '#EF4444' : '#F59E0B', fontSize: '0.68rem', fontWeight: 700 }}>{days}d waiting</span>}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                        <span>{pet.breed}</span><span>{pet.age} · {pet.gender}</span>
                        {pet.weight && <span>⚖️ {pet.weight} lbs</span>}
                        {pet.microchipId && <span>📟 {pet.microchipId}</span>}
                        {pet.spayedNeutered && <span>✅ S/N</span>}
                        {pet.vaccinated && <span>💉 Vacc</span>}
                        {(pet.medicalNotes || []).length > 0 && <span>🏥 {pet.medicalNotes.length} records</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                      <span className={`admin-status admin-status-${pet.status}`}>{pet.status}</span>
                      <Link href={`/adopt/${pet.id}`} className="btn btn-sm btn-ghost" style={{ borderRadius: '10px', padding: '6px 14px', fontSize: '0.8rem' }}>👁 View</Link>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginLeft: '62px' }}>
                    <button style={{ fontSize: '0.82rem', color: 'var(--text-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setExpandedId(isExpanded ? null : pet.id)}>
                      <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: '0.2s', display: 'inline-block' }}>▶</span> {isExpanded ? 'Hide' : 'Full Profile'}
                    </button>
                    <button style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => startEdit(pet)}>✏️ Edit</button>
                    <button style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { if (confirm('Delete?')) onDeletePet(pet.id); }}>🗑️ Delete</button>
                  </div>
                </div>
                {isExpanded && <PetDetail pet={pet} onUpdate={onUpdatePet} />}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="admin-panel"><div className="admin-empty"><div className="admin-empty-icon">🔍</div><div className="admin-empty-title">No pets match your filters</div><div className="admin-empty-text">Try adjusting your search or filter criteria.</div></div></div>
          )}
        </div>
      )}
    </>
  );
}
