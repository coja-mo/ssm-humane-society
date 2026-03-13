'use client';
import { useState } from 'react';

// ──── Star Rating ────
function StarRating({ value, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '110px' }}>{label}</span>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} type="button" onClick={() => onChange(n)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '2px', color: n <= (value || 0) ? '#F59E0B' : '#D1D5DB', transition: 'color 0.15s' }}>
            ★
          </button>
        ))}
      </div>
      {value && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{value}/5</span>}
    </div>
  );
}

// ──── Toggle Check ────
function ToggleCheck({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', background: checked ? 'rgba(16, 185, 129, 0.08)' : 'transparent', transition: 'all 0.2s', fontSize: '0.84rem' }}>
      <input type="checkbox" checked={checked || false} onChange={e => onChange(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--green-500)' }} />
      <span style={{ color: checked ? 'var(--green-600)' : 'var(--text-secondary)', fontWeight: checked ? 600 : 400 }}>{label}</span>
    </label>
  );
}

// ──── Foster Detail ────
function FosterDetail({ foster, onUpdate }) {
  const checklist = foster.reviewChecklist || {};
  const scoring = foster.scoring || {};

  const updateChecklist = (field, value) => {
    const updated = { ...(foster.reviewChecklist || {}), [field]: value };
    onUpdate(foster.id, { reviewChecklist: updated });
  };

  const updateScoring = (field, value) => {
    const updated = { ...(foster.scoring || {}), [field]: value };
    onUpdate(foster.id, { scoring: updated });
  };

  return (
    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
      {/* Application Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>👤 Contact Information</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
            {[
              { l: 'Name', v: `${foster.firstName || ''} ${foster.lastName || ''}`.trim() },
              { l: 'Email', v: foster.email },
              { l: 'Phone', v: foster.phone },
              { l: 'Address', v: foster.address },
            ].filter(i => i.v).map(i => (
              <div key={i.l} style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500, minWidth: '70px' }}>{i.l}:</span>
                <span style={{ fontWeight: 500 }}>{i.v}</span>
              </div>
            ))}
          </div>

          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '16px', marginBottom: '10px', color: 'var(--text-accent)' }}>🏠 Home Environment</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
            {[
              { l: 'Housing', v: foster.housingType },
              { l: 'Has Yard', v: foster.hasYard ? 'Yes' : 'No' },
              { l: 'Has Pets', v: foster.hasPets ? `Yes — ${foster.currentPets || 'details not provided'}` : 'No' },
              { l: 'Children', v: foster.hasChildren ? `Yes — ages: ${foster.childrenAges || 'not specified'}` : 'No' },
              { l: 'Availability', v: foster.availability },
            ].filter(i => i.v).map(i => (
              <div key={i.l} style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500, minWidth: '80px' }}>{i.l}:</span>
                <span style={{ fontWeight: 500 }}>{i.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>🐾 Experience & Preferences</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
            {foster.experience && (
              <div>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Experience:</span>
                <p style={{ marginTop: '4px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{foster.experience}</p>
              </div>
            )}
            {foster.preferredPetTypes?.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                {foster.preferredPetTypes.map(t => (
                  <span key={t} style={{ padding: '4px 10px', borderRadius: '100px', background: 'var(--blue-50)', color: 'var(--blue-700)', fontSize: '0.78rem', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            )}
            {foster.vetReference && (
              <div style={{ marginTop: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Vet Reference:</span> {foster.vetReference}
              </div>
            )}
            {foster.emergencyContact && (
              <div>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Emergency Contact:</span> {foster.emergencyContact}
              </div>
            )}
          </div>

          {/* Assigned Pet */}
          {foster.petName && (
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'var(--green-50)', borderRadius: '10px', border: '1px solid var(--green-100)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--green-800)', marginBottom: '4px' }}>🐾 Currently Fostering</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{foster.petName}</div>
              {foster.startDate && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Since: {foster.startDate}</div>}
            </div>
          )}
        </div>
      </div>

      {/* Staff Review Tools */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
        {/* Review Checklist */}
        <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px' }}>✅ Review Checklist</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <ToggleCheck label="Home check completed" checked={checklist.homeCheckDone} onChange={v => updateChecklist('homeCheckDone', v)} />
            <ToggleCheck label="Home check passed" checked={checklist.homeCheckPassed} onChange={v => updateChecklist('homeCheckPassed', v)} />
            <ToggleCheck label="Vet reference verified" checked={checklist.vetRefVerified} onChange={v => updateChecklist('vetRefVerified', v)} />
            <ToggleCheck label="Emergency plan confirmed" checked={checklist.emergencyPlan} onChange={v => updateChecklist('emergencyPlan', v)} />
            <ToggleCheck label="Pet compatibility assessed" checked={checklist.petCompatibility} onChange={v => updateChecklist('petCompatibility', v)} />
            <ToggleCheck label="Foster agreement signed" checked={checklist.agreementSigned} onChange={v => updateChecklist('agreementSigned', v)} />
          </div>
        </div>

        {/* Scoring */}
        <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px' }}>⭐ Foster Scoring</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <StarRating label="Housing" value={scoring.housing} onChange={v => updateScoring('housing', v)} />
            <StarRating label="Experience" value={scoring.experience} onChange={v => updateScoring('experience', v)} />
            <StarRating label="Availability" value={scoring.availability} onChange={v => updateScoring('availability', v)} />
            <StarRating label="Overall" value={scoring.overall} onChange={v => updateScoring('overall', v)} />
          </div>
          {(scoring.housing || scoring.experience || scoring.availability || scoring.overall) && (
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Average Score</span>
              <span style={{ fontWeight: 700, color: 'var(--text-accent)', fontSize: '0.88rem' }}>
                {(([scoring.housing, scoring.experience, scoring.availability, scoring.overall].filter(Boolean).reduce((a,b) => a+b, 0) / [scoring.housing, scoring.experience, scoring.availability, scoring.overall].filter(Boolean).length) || 0).toFixed(1)}/5
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px' }}>📝 Staff Notes</h4>
        {(foster.notes || []).map(note => (
          <div key={note.id || note.createdAt} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '8px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong style={{ fontSize: '0.82rem' }}>{note.author || 'Staff'}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{note.createdAt ? new Date(note.createdAt).toLocaleString() : ''}</span>
            </div>
            {note.text}
          </div>
        ))}
        <NoteInput onAdd={(text) => {
          const notes = [...(foster.notes || []), { id: `n-${Date.now()}`, text, author: 'Staff', createdAt: new Date().toISOString() }];
          onUpdate(foster.id, { notes });
        }} />
      </div>
    </div>
  );
}

function NoteInput({ onAdd }) {
  const [text, setText] = useState('');
  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
      <input className="form-input" placeholder="Add a note..."
        value={text} onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { onAdd(text); setText(''); } }}
        style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem', borderRadius: '10px' }} />
      <button className="btn btn-sm btn-primary" onClick={() => { if (text.trim()) { onAdd(text); setText(''); } }}
        style={{ borderRadius: '10px', padding: '8px 18px' }}>Add</button>
    </div>
  );
}

// ──── Main Component ────
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
  const filtered = fosters.filter(f => filter === 'all' || f.status === filter);

  const statusColors = {
    applied: '#F59E0B', approved: '#10B981', active: '#3B82F6',
    completed: '#8B5CF6', declined: '#EF4444',
  };

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
        {filtered.map(f => {
          const isExpanded = expandedId === f.id;
          const scoring = f.scoring || {};
          const avgScore = [scoring.housing, scoring.experience, scoring.availability, scoring.overall].filter(Boolean);
          const avg = avgScore.length ? (avgScore.reduce((a,b) => a+b, 0) / avgScore.length).toFixed(1) : null;
          const checklist = f.reviewChecklist || {};
          const checkCount = Object.values(checklist).filter(Boolean).length;

          return (
            <div key={f.id} className="admin-panel" style={{ marginBottom: '8px' }}>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '12px',
                        background: `${statusColors[f.status] || '#9CA3AF'}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.85rem', color: statusColors[f.status] || 'var(--text-muted)',
                      }}>
                        {(f.firstName || '?')[0]}{(f.lastName || '?')[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{f.firstName} {f.lastName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                          <span>📧 {f.email}</span>
                          {f.phone && <span>📞 {f.phone}</span>}
                          <span>🏠 {f.housingType}</span>
                          {avg && <span>⭐ {avg}/5</span>}
                          {checkCount > 0 && <span>✅ {checkCount}/6</span>}
                        </div>
                      </div>
                    </div>
                    {f.petName && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '54px' }}>
                        Currently fostering: <strong>{f.petName}</strong>
                        {f.startDate && <> · Since {f.startDate}</>}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
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
                  </div>
                </div>

                {/* Expand Toggle */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginLeft: '54px' }}>
                  <button style={{
                    fontSize: '0.82rem', color: 'var(--text-accent)',
                    background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }} onClick={() => setExpandedId(isExpanded ? null : f.id)}>
                    <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: '0.2s', display: 'inline-block' }}>▶</span>
                    {isExpanded ? 'Hide Details' : 'Full Review'}
                  </button>
                  <button style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => { if (confirm('Delete foster?')) onDelete(f.id); }}>
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {isExpanded && <FosterDetail foster={f} onUpdate={onUpdate} />}
            </div>
          );
        })}
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
