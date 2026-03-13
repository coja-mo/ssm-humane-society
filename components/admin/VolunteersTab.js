'use client';
import { useState } from 'react';

function VolunteerDetail({ volunteer, onUpdate }) {
  const [noteText, setNoteText] = useState('');
  const skills = volunteer.skills || [];
  const interests = volunteer.interests || [];
  const availability = volunteer.availability || [];
  const shiftLog = volunteer.shiftLog || [];
  const checklist = volunteer.reviewChecklist || {};

  const updateChecklist = (field, value) => {
    const updated = { ...(volunteer.reviewChecklist || {}), [field]: value };
    onUpdate(volunteer.id, { reviewChecklist: updated });
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    const notes = [...(volunteer.notes || []), { id: `n-${Date.now()}`, text: noteText, author: 'Staff', createdAt: new Date().toISOString() }];
    onUpdate(volunteer.id, { notes }); setNoteText('');
  };

  return (
    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>👤 Contact & Personal</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
            {[{ l: 'Name', v: `${volunteer.firstName} ${volunteer.lastName}` }, { l: 'Email', v: volunteer.email }, { l: 'Phone', v: volunteer.phone }, { l: 'DOB', v: volunteer.dateOfBirth }, { l: 'Emergency', v: volunteer.emergencyContact }, { l: 'Emerg. Phone', v: volunteer.emergencyPhone }, { l: 'Start Date', v: volunteer.startDate }, { l: 'Hours', v: `${volunteer.hoursLogged || 0}h logged` }].filter(i => i.v).map(i => (
              <div key={i.l} style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--text-muted)', fontWeight: 500, minWidth: '90px' }}>{i.l}:</span><span style={{ fontWeight: 500 }}>{i.v}</span></div>
            ))}
          </div>
          {skills.length > 0 && (<div style={{ marginTop: '12px' }}><div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>SKILLS</div><div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>{skills.map(s => <span key={s} style={{ padding: '3px 10px', borderRadius: '100px', background: 'var(--blue-50)', color: 'var(--blue-700)', fontSize: '0.75rem', fontWeight: 600 }}>{s}</span>)}</div></div>)}
          {interests.length > 0 && (<div style={{ marginTop: '10px' }}><div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>INTERESTS</div><div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>{interests.map(i => <span key={i} style={{ padding: '3px 10px', borderRadius: '100px', background: 'var(--green-50)', color: 'var(--green-700)', fontSize: '0.75rem', fontWeight: 600 }}>{i.replace(/-/g, ' ')}</span>)}</div></div>)}
          {availability.length > 0 && (<div style={{ marginTop: '10px' }}><div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>AVAILABILITY</div><div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>{availability.map(a => <span key={a} style={{ padding: '3px 10px', borderRadius: '100px', background: '#F5F3FF', color: '#6D28D9', fontSize: '0.75rem', fontWeight: 600 }}>{a.replace(/-/g, ' ')}</span>)}</div></div>)}
        </div>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>✅ Onboarding Checklist</h4>
          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
            {[{ key: 'backgroundCheck', label: 'Background check completed' }, { key: 'orientationDone', label: 'Orientation completed' }, { key: 'trainingDone', label: 'Training modules finished' }, { key: 'waiversSigned', label: 'Waivers & agreements signed' }, { key: 'emergencyInfo', label: 'Emergency info on file' }, { key: 'uniformIssued', label: 'Badge/uniform issued' }].map(item => (
              <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', background: checklist[item.key] ? 'rgba(16,185,129,0.08)' : 'transparent', transition: 'all 0.2s', fontSize: '0.84rem' }}>
                <input type="checkbox" checked={checklist[item.key] || false} onChange={e => updateChecklist(item.key, e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--green-500)' }} />
                <span style={{ color: checklist[item.key] ? 'var(--green-600)' : 'var(--text-secondary)', fontWeight: checklist[item.key] ? 600 : 400 }}>{item.label}</span>
              </label>
            ))}
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}><span>Progress</span><span style={{ fontWeight: 700, color: 'var(--text-accent)' }}>{Object.values(checklist).filter(Boolean).length}/6</span></div>
          </div>

          {shiftLog.length > 0 && (<>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-accent)' }}>⏱️ Recent Shifts</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {shiftLog.slice(-10).reverse().map((shift, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid var(--border-light)', fontSize: '0.82rem' }}>
                  <span style={{ textTransform: 'capitalize' }}>{(shift.task || 'general').replace(/-/g, ' ')}</span>
                  <span><strong>{shift.hours}h</strong> · {shift.date || '—'}</span>
                </div>
              ))}
            </div>
          </>)}
        </div>
      </div>
      <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px' }}>📝 Staff Notes</h4>
        {(volunteer.notes || []).map(n => (
          <div key={n.id} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '8px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><strong style={{ fontSize: '0.82rem' }}>{n.author}</strong><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(n.createdAt).toLocaleString()}</span></div>{n.text}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input className="form-input" placeholder="Add a note..." value={noteText} onChange={e => setNoteText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem', borderRadius: '10px' }} />
          <button className="btn btn-sm btn-primary" onClick={addNote} style={{ borderRadius: '10px', padding: '8px 18px' }}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default function VolunteersTab({ volunteers, loading, onAdd, onUpdate, onDelete, onLogHours }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [logId, setLogId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [logForm, setLogForm] = useState({ hours: '', task: 'general', date: '', notes: '' });
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', skills: '', interests: [], availability: [], emergencyContact: '', emergencyPhone: '' });
  const handleSubmit = (e) => { e.preventDefault(); onAdd({ ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) }); setForm({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', skills: '', interests: [], availability: [], emergencyContact: '', emergencyPhone: '' }); setShowAdd(false); };
  const handleLogHours = (volId) => { if (!logForm.hours) return; onLogHours(volId, Number(logForm.hours), { task: logForm.task, date: logForm.date || undefined, notes: logForm.notes }); setLogForm({ hours: '', task: 'general', date: '', notes: '' }); setLogId(null); };
  const statuses = ['all', 'applied', 'approved', 'active', 'inactive'];
  const interestOptions = ['dog-walking', 'cat-socialization', 'events', 'admin', 'cleaning', 'transport', 'fundraising', 'photography'];
  const availOptions = ['weekday-morning', 'weekday-afternoon', 'weekday-evening', 'weekend-morning', 'weekend-afternoon'];
  const totalHours = volunteers.reduce((s, v) => s + (v.hoursLogged || 0), 0);
  const toggleInterest = (val) => setForm(f => ({...f, interests: f.interests.includes(val) ? f.interests.filter(i => i !== val) : [...f.interests, val]}));
  const toggleAvail = (val) => setForm(f => ({...f, availability: f.availability.includes(val) ? f.availability.filter(a => a !== val) : [...f.availability, val]}));
  const filtered = volunteers.filter(v => {
    if (filter !== 'all' && v.status !== filter) return false;
    if (search) { const s = search.toLowerCase(); return `${v.firstName} ${v.lastName}`.toLowerCase().includes(s) || (v.email || '').toLowerCase().includes(s); }
    return true;
  });

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Volunteers</h1><p className="admin-page-subtitle">{volunteers.length} volunteers · {totalHours} total hours</p></div>
        <div className="admin-page-actions"><button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }} onClick={() => setShowAdd(!showAdd)}>{showAdd ? '✕ Cancel' : '+ Add Volunteer'}</button></div>
      </div>
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[{ label: 'Active', val: volunteers.filter(v => v.status === 'active').length, icon: '✅', accent: '#3B82F6', bg: '#EFF6FF' }, { label: 'Pending', val: volunteers.filter(v => v.status === 'applied').length, icon: '⏳', accent: '#F59E0B', bg: '#FFFBEB' }, { label: 'Total Hours', val: totalHours, icon: '⏱️', accent: '#10B981', bg: '#ECFDF5' }, { label: 'Total', val: volunteers.length, icon: '👥', accent: '#8B5CF6', bg: '#F5F3FF' }].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}><div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div><div className="admin-stat-value admin-counter">{s.val}</div><div className="admin-stat-label">{s.label}</div></div>
        ))}
      </div>
      <div className="admin-filters">
        {statuses.map(s => (<button key={s} className={`admin-filter-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>))}
        <input className="admin-filter-search" placeholder="🔍 Search volunteers..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title"><span>➕</span> Add Volunteer</div></div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">First Name *</label><input className="form-input" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Last Name *</label><input className="form-input" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
            </div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Date of Birth</label><input className="form-input" type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Skills (comma separated)</label><input className="form-input" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="animal handling, first aid..." /></div>
            <div className="form-group"><label className="form-label">Interests</label><div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{interestOptions.map(i => (<button key={i} type="button" className={`admin-filter-pill ${form.interests.includes(i) ? 'active' : ''}`} onClick={() => toggleInterest(i)} style={{ fontSize: '0.78rem', padding: '5px 12px' }}>{i.replace(/-/g, ' ')}</button>))}</div></div>
            <div className="form-group"><label className="form-label">Availability</label><div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{availOptions.map(a => (<button key={a} type="button" className={`admin-filter-pill ${form.availability.includes(a) ? 'active' : ''}`} onClick={() => toggleAvail(a)} style={{ fontSize: '0.78rem', padding: '5px 12px' }}>{a.replace(/-/g, ' ')}</button>))}</div></div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Emergency Contact</label><input className="form-input" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Emergency Phone</label><input className="form-input" value={form.emergencyPhone} onChange={e => setForm({...form, emergencyPhone: e.target.value})} /></div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>Add Volunteer</button>
          </form>
        </div>
      )}
      <div className="admin-list">
        {filtered.map(v => {
          const isExpanded = expandedId === v.id;
          const checklist = v.reviewChecklist || {};
          const checkCount = Object.values(checklist).filter(Boolean).length;
          return (
            <div key={v.id} className="admin-panel" style={{ marginBottom: '8px' }}>
              <div style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--green-50)', color: 'var(--green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>{(v.firstName || '?')[0]}{(v.lastName || '?')[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{v.firstName} {v.lastName}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                      <span>📧 {v.email}</span><span>⏱️ {v.hoursLogged || 0}h</span>
                      {(v.interests || []).length > 0 && <span>{v.interests.slice(0, 2).map(i => i.replace(/-/g, ' ')).join(', ')}</span>}
                      {checkCount > 0 && <span>✅ {checkCount}/6</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                    <span className={`admin-status admin-status-${v.status}`}>{v.status}</span>
                    <select className="form-input form-select" value={v.status} onChange={e => onUpdate(v.id, { status: e.target.value, ...(e.target.value === 'active' ? { startDate: new Date().toISOString().split('T')[0] } : {}) })} style={{ padding: '5px 28px 5px 10px', fontSize: '0.8rem', width: 'auto', minWidth: '100px', borderRadius: '10px' }}>
                      <option value="applied">Applied</option><option value="approved">Approved</option><option value="active">Active</option><option value="inactive">Inactive</option>
                    </select>
                    <button className="btn btn-sm btn-ghost" onClick={() => setLogId(logId === v.id ? null : v.id)} style={{ borderRadius: '10px', padding: '5px 14px', fontSize: '0.82rem' }}>⏱️ Log</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginLeft: '56px' }}>
                  <button style={{ fontSize: '0.82rem', color: 'var(--text-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setExpandedId(isExpanded ? null : v.id)}>
                    <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: '0.2s', display: 'inline-block' }}>▶</span> {isExpanded ? 'Hide' : 'Full Profile'}
                  </button>
                  <button style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { if (confirm('Delete?')) onDelete(v.id); }}>🗑️ Delete</button>
                </div>
              </div>
              <div className={`admin-detail-drawer ${logId === v.id ? 'open' : ''}`}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ marginBottom: 0, flex: '0 0 80px' }}><label className="form-label" style={{ fontSize: '0.78rem' }}>Hours</label><input className="form-input" type="number" step="0.5" value={logForm.hours} onChange={e => setLogForm({...logForm, hours: e.target.value})} style={{ padding: '8px 10px', fontSize: '0.85rem', borderRadius: '10px' }} /></div>
                  <div className="form-group" style={{ marginBottom: 0, flex: '0 0 130px' }}><label className="form-label" style={{ fontSize: '0.78rem' }}>Task</label><select className="form-input form-select" value={logForm.task} onChange={e => setLogForm({...logForm, task: e.target.value})} style={{ padding: '8px 10px', fontSize: '0.85rem', borderRadius: '10px' }}><option value="general">General</option><option value="dog-walking">Dog Walking</option><option value="cat-care">Cat Care</option><option value="cleaning">Cleaning</option><option value="event">Event</option><option value="admin">Admin</option></select></div>
                  <div className="form-group" style={{ marginBottom: 0, flex: '0 0 140px' }}><label className="form-label" style={{ fontSize: '0.78rem' }}>Date</label><input className="form-input" type="date" value={logForm.date} onChange={e => setLogForm({...logForm, date: e.target.value})} style={{ padding: '8px 10px', fontSize: '0.85rem', borderRadius: '10px' }} /></div>
                  <button className="btn btn-sm btn-primary" onClick={() => handleLogHours(v.id)} style={{ borderRadius: '10px', padding: '9px 20px' }}>Log Hours</button>
                </div>
              </div>
              {isExpanded && <VolunteerDetail volunteer={v} onUpdate={onUpdate} />}
            </div>
          );
        })}
        {filtered.length === 0 && (<div className="admin-panel"><div className="admin-empty"><div className="admin-empty-icon">🤝</div><div className="admin-empty-title">No volunteers yet</div><div className="admin-empty-text">Volunteer applications will appear here as they come in.</div></div></div>)}
      </div>
    </>
  );
}
