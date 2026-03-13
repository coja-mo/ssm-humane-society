'use client';
import { useState } from 'react';

const statusColors = { 'pending-eval': '#F59E0B', 'in-treatment': '#3B82F6', 'ready': '#10B981', 'transferred': '#8B5CF6', 'adopted-out': '#EC4899', 'euthanized': '#EF4444' };
const typeIcons = { stray: '🐾', surrender: '📋', transfer: '🔄', confiscation: '⚖️', 'born-in-care': '👶' };

function IntakeDetail({ intake, onUpdate }) {
  const [noteText, setNoteText] = useState('');
  const checklist = intake.medicalChecklist || {};
  const updateChecklist = (field, value) => { onUpdate(intake.id, { medicalChecklist: { ...checklist, [field]: value } }); };
  const addNote = () => { if (!noteText.trim()) return; const notes = [...(intake.notes || []), { id: `n-${Date.now()}`, text: noteText, author: 'Staff', createdAt: new Date().toISOString() }]; onUpdate(intake.id, { notes }); setNoteText(''); };
  return (
    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>📋 Intake Information</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
            {[{ l: 'Animal', v: intake.animalName }, { l: 'Species', v: intake.species }, { l: 'Breed', v: intake.breed }, { l: 'Age', v: intake.age }, { l: 'Sex', v: intake.sex }, { l: 'Color', v: intake.color }, { l: 'Weight', v: intake.weight ? `${intake.weight} lbs` : null }, { l: 'Microchip', v: intake.microchip }, { l: 'Source', v: intake.type }, { l: 'Location Found', v: intake.locationFound }, { l: 'Brought By', v: intake.surrenderName }, { l: 'Phone', v: intake.surrenderPhone }, { l: 'Date', v: intake.intakeDate || intake.createdAt ? new Date(intake.intakeDate || intake.createdAt).toLocaleDateString() : null }].filter(i => i.v).map(i => (
              <div key={i.l} style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--text-muted)', fontWeight: 500, minWidth: '100px' }}>{i.l}:</span><span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{i.v}</span></div>
            ))}
          </div>
          {intake.reason && <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '10px', fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}><strong>Reason:</strong> {intake.reason}</div>}
          {intake.behaviorNotes && <div style={{ marginTop: '8px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '10px', fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}><strong>Behavior:</strong> {intake.behaviorNotes}</div>}
        </div>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>🏥 Medical Intake Checklist</h4>
          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
            {[{ key: 'visualExam', label: 'Visual examination completed' }, { key: 'weighIn', label: 'Weight recorded' }, { key: 'temperatureCheck', label: 'Temperature taken' }, { key: 'fecalTest', label: 'Fecal sample collected' }, { key: 'dewormed', label: 'Deworming administered' }, { key: 'fleaTreatment', label: 'Flea/tick treatment applied' }, { key: 'vaccinations', label: 'Vaccinations given' }, { key: 'microchipScanned', label: 'Scanned for microchip' }, { key: 'quarantineAssessed', label: 'Quarantine assessed' }, { key: 'photoTaken', label: 'Intake photos taken' }].map(item => (
              <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '5px 10px', borderRadius: '8px', background: checklist[item.key] ? 'rgba(16,185,129,0.08)' : 'transparent', transition: 'all 0.2s', fontSize: '0.82rem' }}>
                <input type="checkbox" checked={checklist[item.key] || false} onChange={e => updateChecklist(item.key, e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--green-500)' }} />
                <span style={{ color: checklist[item.key] ? 'var(--green-600)' : 'var(--text-secondary)', fontWeight: checklist[item.key] ? 600 : 400 }}>{item.label}</span>
              </label>
            ))}
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}><span>Progress</span><span style={{ fontWeight: 700, color: 'var(--text-accent)' }}>{Object.values(checklist).filter(Boolean).length}/10</span></div>
          </div>
        </div>
      </div>
      <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px' }}>📝 Notes</h4>
        {(intake.notes || []).map(n => (<div key={n.id} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '8px', fontSize: '0.84rem' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><strong style={{ fontSize: '0.82rem' }}>{n.author}</strong><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(n.createdAt).toLocaleString()}</span></div>{n.text}</div>))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input className="form-input" placeholder="Add a note..." value={noteText} onChange={e => setNoteText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem', borderRadius: '10px' }} />
          <button className="btn btn-sm btn-primary" onClick={addNote} style={{ borderRadius: '10px', padding: '8px 18px' }}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default function IntakeTab({ intakes, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ animalName: '', species: 'dog', breed: '', age: '', sex: 'unknown', color: '', weight: '', type: 'stray', locationFound: '', surrenderName: '', surrenderPhone: '', reason: '', behaviorNotes: '', intakeDate: '' });
  const handleSubmit = (e) => { e.preventDefault(); onAdd(form); setForm({ animalName: '', species: 'dog', breed: '', age: '', sex: 'unknown', color: '', weight: '', type: 'stray', locationFound: '', surrenderName: '', surrenderPhone: '', reason: '', behaviorNotes: '', intakeDate: '' }); setShowAdd(false); };
  const filtered = intakes.filter(i => { if (filter !== 'all' && i.type !== filter && i.status !== filter) return false; if (search) { const s = search.toLowerCase(); return (i.animalName || '').toLowerCase().includes(s) || (i.breed || '').toLowerCase().includes(s); } return true; });

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Animal Intake</h1><p className="admin-page-subtitle">{intakes.length} intake records</p></div>
        <div className="admin-page-actions"><button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }} onClick={() => setShowAdd(!showAdd)}>{showAdd ? '✕ Cancel' : '+ New Intake'}</button></div>
      </div>
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[{ label: 'Stray', val: intakes.filter(i => i.type === 'stray').length, icon: '🐾', accent: '#3B82F6', bg: '#EFF6FF' }, { label: 'Surrender', val: intakes.filter(i => i.type === 'surrender').length, icon: '📋', accent: '#F59E0B', bg: '#FFFBEB' }, { label: 'Transfer', val: intakes.filter(i => i.type === 'transfer').length, icon: '🔄', accent: '#10B981', bg: '#ECFDF5' }, { label: 'Pending Eval', val: intakes.filter(i => i.status === 'pending-eval').length, icon: '⏳', accent: '#8B5CF6', bg: '#F5F3FF' }].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}><div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div><div className="admin-stat-value admin-counter">{s.val}</div><div className="admin-stat-label">{s.label}</div></div>
        ))}
      </div>
      <div className="admin-filters">
        {['all', 'stray', 'surrender', 'transfer'].map(t => (<button key={t} className={`admin-filter-pill ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t === 'all' ? 'All' : (typeIcons[t] || '') + ' ' + t.charAt(0).toUpperCase() + t.slice(1)}</button>))}
        <div className="admin-filter-divider" />
        {['pending-eval', 'in-treatment', 'ready'].map(s => (<button key={s} className={`admin-filter-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</button>))}
        <input className="admin-filter-search" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title"><span>➕</span> New Intake Record</div></div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Animal Name</label><input className="form-input" value={form.animalName} onChange={e => setForm({...form, animalName: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Species</label><select className="form-input form-select" value={form.species} onChange={e => setForm({...form, species: e.target.value})}><option value="dog">Dog</option><option value="cat">Cat</option><option value="rabbit">Rabbit</option><option value="bird">Bird</option><option value="other">Other</option></select></div>
              <div className="form-group"><label className="form-label">Breed</label><input className="form-input" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} /></div>
            </div>
            <div className="admin-form-grid admin-form-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div className="form-group"><label className="form-label">Age</label><input className="form-input" value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="e.g. 2 years" /></div>
              <div className="form-group"><label className="form-label">Sex</label><select className="form-input form-select" value={form.sex} onChange={e => setForm({...form, sex: e.target.value})}><option value="unknown">Unknown</option><option value="male">Male</option><option value="female">Female</option></select></div>
              <div className="form-group"><label className="form-label">Color</label><input className="form-input" value={form.color} onChange={e => setForm({...form, color: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Weight (lbs)</label><input className="form-input" type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} /></div>
            </div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Intake Type *</label><select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="stray">Stray</option><option value="surrender">Surrender</option><option value="transfer">Transfer</option><option value="confiscation">Confiscation</option><option value="born-in-care">Born in Care</option></select></div>
              <div className="form-group"><label className="form-label">Intake Date</label><input className="form-input" type="date" value={form.intakeDate} onChange={e => setForm({...form, intakeDate: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Location Found</label><input className="form-input" value={form.locationFound} onChange={e => setForm({...form, locationFound: e.target.value})} /></div>
            </div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Surrenderer / Finder Name</label><input className="form-input" value={form.surrenderName} onChange={e => setForm({...form, surrenderName: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Contact Phone</label><input className="form-input" value={form.surrenderPhone} onChange={e => setForm({...form, surrenderPhone: e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Reason for Intake</label><textarea className="form-input" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} style={{ minHeight: '60px' }} /></div>
            <div className="form-group"><label className="form-label">Behavior Notes</label><textarea className="form-input" value={form.behaviorNotes} onChange={e => setForm({...form, behaviorNotes: e.target.value})} style={{ minHeight: '60px' }} /></div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>Record Intake</button>
          </form>
        </div>
      )}
      <div className="admin-list">
        {filtered.map(item => (
          <div key={item.id} className="admin-panel" style={{ marginBottom: '8px' }}>
            <div style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${statusColors[item.status] || '#6B7280'}12`, color: statusColors[item.status] || '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{typeIcons[item.type] || '📦'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{item.animalName || 'Unknown Animal'} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem' }}>— {item.species} {item.breed ? `(${item.breed})` : ''}</span></div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                    <span>{typeIcons[item.type]} {item.type}</span>{item.age && <span>🎂 {item.age}</span>}{item.sex && item.sex !== 'unknown' && <span>⚧ {item.sex}</span>}<span>📅 {new Date(item.intakeDate || item.createdAt).toLocaleDateString()}</span>
                    {Object.values(item.medicalChecklist || {}).filter(Boolean).length > 0 && <span>🏥 {Object.values(item.medicalChecklist).filter(Boolean).length}/10</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  <span className={`admin-status admin-status-${item.status === 'pending-eval' ? 'submitted' : item.status === 'ready' ? 'approved' : 'reviewing'}`}>{(item.status || '').replace(/-/g, ' ')}</span>
                  <select className="form-input form-select" value={item.status} onChange={e => onUpdate(item.id, { status: e.target.value })} style={{ padding: '5px 28px 5px 10px', fontSize: '0.8rem', width: 'auto', minWidth: '100px', borderRadius: '10px' }}>
                    <option value="pending-eval">Pending Eval</option><option value="in-treatment">In Treatment</option><option value="ready">Ready</option><option value="transferred">Transferred</option><option value="adopted-out">Adopted Out</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginLeft: '56px' }}>
                <button style={{ fontSize: '0.82rem', color: 'var(--text-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                  <span style={{ transform: expandedId === item.id ? 'rotate(90deg)' : 'none', transition: '0.2s', display: 'inline-block' }}>▶</span> {expandedId === item.id ? 'Hide' : 'Full Details'}
                </button>
                <button style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { if (confirm('Delete?')) onDelete(item.id); }}>🗑️ Delete</button>
              </div>
            </div>
            {expandedId === item.id && <IntakeDetail intake={item} onUpdate={onUpdate} />}
          </div>
        ))}
        {filtered.length === 0 && (<div className="admin-panel"><div className="admin-empty"><div className="admin-empty-icon">📦</div><div className="admin-empty-title">No intake records</div><div className="admin-empty-text">Record new intakes as animals arrive at the shelter.</div></div></div>)}
      </div>
    </>
  );
}
