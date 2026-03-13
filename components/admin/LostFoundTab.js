'use client';
import { useState } from 'react';

function LostFoundDetail({ item, allItems, onUpdate }) {
  const [noteText, setNoteText] = useState('');
  const addNote = () => { if (!noteText.trim()) return; const notes = [...(item.notes || []), { id: `n-${Date.now()}`, text: noteText, author: 'Staff', createdAt: new Date().toISOString() }]; onUpdate(item.id, { notes }); setNoteText(''); };
  // Simple matching: find opposite type with same species & similar description
  const matches = allItems.filter(other => other.id !== item.id && other.type !== item.type && other.species === item.species && other.status !== 'resolved').slice(0, 5);
  return (
    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>{item.type === 'lost' ? '🔍 Lost Pet Details' : '📍 Found Pet Details'}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
            {[{ l: 'Pet Name', v: item.petName }, { l: 'Species', v: item.species }, { l: 'Breed', v: item.breed }, { l: 'Color', v: item.color }, { l: 'Size', v: item.size }, { l: 'Sex', v: item.sex }, { l: 'Age', v: item.age }, { l: 'Microchipped', v: item.microchipped ? 'Yes' : item.microchipped === false ? 'No' : null }, { l: 'Microchip #', v: item.microchipNumber }, { l: 'Location', v: item.location }, { l: 'Date', v: item.dateReported ? new Date(item.dateReported).toLocaleDateString() : null }, { l: 'Collar/Tags', v: item.collarDescription }].filter(i => i.v != null).map(i => (
              <div key={i.l} style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--text-muted)', fontWeight: 500, minWidth: '90px' }}>{i.l}:</span><span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{i.v}</span></div>
            ))}
          </div>
          {item.description && <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '10px', fontSize: '0.84rem', lineHeight: 1.6 }}><strong>Description:</strong> {item.description}</div>}
          <div style={{ marginTop: '12px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-accent)' }}>👤 Contact Information</h4>
            {[{ l: 'Name', v: item.contactName }, { l: 'Phone', v: item.contactPhone }, { l: 'Email', v: item.contactEmail }].filter(i => i.v).map(i => (
              <div key={i.l} style={{ display: 'flex', gap: '8px', fontSize: '0.84rem', padding: '2px 0' }}><span style={{ color: 'var(--text-muted)', minWidth: '60px' }}>{i.l}:</span><span style={{ fontWeight: 500 }}>{i.v}</span></div>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>🔗 Potential Matches ({matches.length})</h4>
          {matches.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {matches.map(m => (
                <div key={m.id} style={{ padding: '12px 16px', background: '#FFFBEB', borderRadius: '10px', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: m.type === 'found' ? '#ECFDF5' : '#FEF2F2', color: m.type === 'found' ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{m.type === 'found' ? '📍' : '🔍'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.petName || 'Unknown'} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>— {m.type}</span></div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.breed} · {m.color} · {m.location}</div>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '8px', background: '#FEF3C7', color: '#B45309', fontSize: '0.72rem', fontWeight: 700 }}>Possible Match</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--bg-primary)', borderRadius: '10px' }}>No potential matches found</div>
          )}
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            {item.status !== 'resolved' && <button onClick={() => onUpdate(item.id, { status: 'resolved', resolvedAt: new Date().toISOString() })} className="btn btn-sm btn-primary" style={{ borderRadius: '10px', padding: '8px 20px' }}>✅ Mark Resolved</button>}
            <button onClick={() => onUpdate(item.id, { status: 'investigating' })} className="btn btn-sm btn-ghost" style={{ borderRadius: '10px', padding: '8px 20px' }}>🔎 Investigating</button>
          </div>
        </div>
      </div>
      <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px' }}>📝 Notes</h4>
        {(item.notes || []).map(n => (<div key={n.id} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '8px', fontSize: '0.84rem' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><strong style={{ fontSize: '0.82rem' }}>{n.author}</strong><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(n.createdAt).toLocaleString()}</span></div>{n.text}</div>))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input className="form-input" placeholder="Add a note..." value={noteText} onChange={e => setNoteText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem', borderRadius: '10px' }} />
          <button className="btn btn-sm btn-primary" onClick={addNote} style={{ borderRadius: '10px', padding: '8px 18px' }}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default function LostFoundTab({ items, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ type: 'lost', petName: '', species: 'dog', breed: '', color: '', size: 'medium', sex: '', age: '', location: '', description: '', contactName: '', contactPhone: '', contactEmail: '', dateReported: '', microchipped: false, microchipNumber: '', collarDescription: '' });
  const handleSubmit = (e) => { e.preventDefault(); onAdd(form); setForm({ type: 'lost', petName: '', species: 'dog', breed: '', color: '', size: 'medium', sex: '', age: '', location: '', description: '', contactName: '', contactPhone: '', contactEmail: '', dateReported: '', microchipped: false, microchipNumber: '', collarDescription: '' }); setShowAdd(false); };
  const filtered = items.filter(i => { if (filter === 'lost' && i.type !== 'lost') return false; if (filter === 'found' && i.type !== 'found') return false; if (filter === 'resolved' && i.status !== 'resolved') return false; if (filter === 'active' && i.status === 'resolved') return false; if (search) { const s = search.toLowerCase(); return (i.petName || '').toLowerCase().includes(s) || (i.breed || '').toLowerCase().includes(s) || (i.location || '').toLowerCase().includes(s); } return true; });

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Lost & Found</h1><p className="admin-page-subtitle">{items.length} reports · {items.filter(i => i.status !== 'resolved').length} active</p></div>
        <div className="admin-page-actions"><button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }} onClick={() => setShowAdd(!showAdd)}>{showAdd ? '✕ Cancel' : '+ New Report'}</button></div>
      </div>
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[{ label: 'Lost', val: items.filter(i => i.type === 'lost' && i.status !== 'resolved').length, icon: '🔍', accent: '#EF4444', bg: '#FEF2F2' }, { label: 'Found', val: items.filter(i => i.type === 'found' && i.status !== 'resolved').length, icon: '📍', accent: '#10B981', bg: '#ECFDF5' }, { label: 'Resolved', val: items.filter(i => i.status === 'resolved').length, icon: '✅', accent: '#3B82F6', bg: '#EFF6FF' }, { label: 'Total', val: items.length, icon: '📊', accent: '#8B5CF6', bg: '#F5F3FF' }].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}><div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div><div className="admin-stat-value admin-counter">{s.val}</div><div className="admin-stat-label">{s.label}</div></div>
        ))}
      </div>
      <div className="admin-filters">
        {['all', 'lost', 'found', 'active', 'resolved'].map(f => (<button key={f} className={`admin-filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f === 'all' ? 'All' : f === 'lost' ? '🔍 Lost' : f === 'found' ? '📍 Found' : f === 'active' ? '⏳ Active' : '✅ Resolved'}</button>))}
        <input className="admin-filter-search" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title"><span>➕</span> New Report</div></div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Type *</label><select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="lost">Lost</option><option value="found">Found</option></select></div>
              <div className="form-group"><label className="form-label">Pet Name</label><input className="form-input" value={form.petName} onChange={e => setForm({...form, petName: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Species</label><select className="form-input form-select" value={form.species} onChange={e => setForm({...form, species: e.target.value})}><option value="dog">Dog</option><option value="cat">Cat</option><option value="other">Other</option></select></div>
            </div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Breed</label><input className="form-input" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Color</label><input className="form-input" value={form.color} onChange={e => setForm({...form, color: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Size</label><select className="form-input form-select" value={form.size} onChange={e => setForm({...form, size: e.target.value})}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></div>
            </div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Location Last Seen/Found *</label><input className="form-input" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.dateReported} onChange={e => setForm({...form, dateReported: e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ minHeight: '60px' }} placeholder="Distinguishing features, behavior..." /></div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Contact Name *</label><input className="form-input" required value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" required value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} /></div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>Submit Report</button>
          </form>
        </div>
      )}
      <div className="admin-list">
        {filtered.map(item => (
          <div key={item.id} className="admin-panel" style={{ marginBottom: '8px', borderLeft: `3px solid ${item.type === 'lost' ? '#EF4444' : '#10B981'}` }}>
            <div style={{ padding: '16px 24px', cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: item.type === 'lost' ? '#FEF2F2' : '#ECFDF5', color: item.type === 'lost' ? '#EF4444' : '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{item.type === 'lost' ? '🔍' : '📍'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{item.petName || 'Unknown'} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.85rem' }}>— {item.type === 'lost' ? 'Lost' : 'Found'} {item.species}</span></div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                    <span>📍 {item.location}</span>{item.breed && <span>🐾 {item.breed}</span>}{item.color && <span>🎨 {item.color}</span>}
                    <span>📅 {new Date(item.dateReported || item.createdAt).toLocaleDateString()}</span>
                    <span>👤 {item.contactName}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  <span className={`admin-status admin-status-${item.status === 'resolved' ? 'approved' : item.type === 'lost' ? 'rejected' : 'active'}`}>{item.status || item.type}</span>
                  <button className="btn btn-sm btn-danger" onClick={e => { e.stopPropagation(); if (confirm('Delete?')) onDelete(item.id); }} style={{ borderRadius: '10px', padding: '5px 12px', fontSize: '0.78rem' }}>✕</button>
                </div>
              </div>
            </div>
            {expandedId === item.id && <LostFoundDetail item={item} allItems={items} onUpdate={onUpdate} />}
          </div>
        ))}
        {filtered.length === 0 && (<div className="admin-panel"><div className="admin-empty"><div className="admin-empty-icon">🔍</div><div className="admin-empty-title">No reports</div><div className="admin-empty-text">Lost and found pet reports will appear here.</div></div></div>)}
      </div>
    </>
  );
}
