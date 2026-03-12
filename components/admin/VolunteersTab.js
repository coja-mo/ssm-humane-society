'use client';
import { useState } from 'react';

export default function VolunteersTab({ volunteers, loading, onAdd, onUpdate, onDelete, onLogHours }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [logId, setLogId] = useState(null);
  const [logForm, setLogForm] = useState({ hours: '', task: 'general', date: '', notes: '' });
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
    skills: '', interests: [], availability: [], emergencyContact: '', emergencyPhone: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) });
    setForm({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
      skills: '', interests: [], availability: [], emergencyContact: '', emergencyPhone: '' });
    setShowAdd(false);
  };

  const handleLogHours = (volId) => {
    if (!logForm.hours) return;
    onLogHours(volId, Number(logForm.hours), { task: logForm.task, date: logForm.date || undefined, notes: logForm.notes });
    setLogForm({ hours: '', task: 'general', date: '', notes: '' });
    setLogId(null);
  };

  const statuses = ['all', 'applied', 'approved', 'active', 'inactive'];
  const interestOptions = ['dog-walking', 'cat-socialization', 'events', 'admin', 'cleaning', 'transport', 'fundraising', 'photography'];
  const availOptions = ['weekday-morning', 'weekday-afternoon', 'weekday-evening', 'weekend-morning', 'weekend-afternoon'];

  const totalHours = volunteers.reduce((s, v) => s + (v.hoursLogged || 0), 0);
  const filtered = volunteers.filter(v => filter === 'all' || v.status === filter);

  const toggleInterest = (val) => setForm(f => ({...f, interests: f.interests.includes(val) ? f.interests.filter(i => i !== val) : [...f.interests, val]}));
  const toggleAvail = (val) => setForm(f => ({...f, availability: f.availability.includes(val) ? f.availability.filter(a => a !== val) : [...f.availability, val]}));

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Volunteers</h1>
          <p className="admin-page-subtitle">{volunteers.length} volunteers · {totalHours} total hours contributed</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }}
            onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? '✕ Cancel' : '+ Add Volunteer'}
          </button>
        </div>
      </div>

      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Active', val: volunteers.filter(v => v.status === 'active').length, icon: '✅', accent: '#3B82F6', bg: '#EFF6FF' },
          { label: 'Pending', val: volunteers.filter(v => v.status === 'applied').length, icon: '⏳', accent: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Total Hours', val: totalHours, icon: '⏱️', accent: '#10B981', bg: '#ECFDF5' },
          { label: 'Total Volunteers', val: volunteers.length, icon: '👥', accent: '#8B5CF6', bg: '#F5F3FF' },
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
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header">
            <div className="admin-panel-title"><span>➕</span> Add Volunteer</div>
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
              <div className="form-group"><label className="form-label">Date of Birth</label>
                <input className="form-input" type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} /></div>
            </div>
            <div className="form-group"><label className="form-label">Skills (comma separated)</label>
              <input className="form-input" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="animal handling, first aid..." /></div>

            <div className="form-group"><label className="form-label">Interests</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {interestOptions.map(i => (
                  <button key={i} type="button" className={`admin-filter-pill ${form.interests.includes(i) ? 'active' : ''}`}
                    onClick={() => toggleInterest(i)} style={{ fontSize: '0.78rem', padding: '5px 12px' }}>
                    {i.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group"><label className="form-label">Availability</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {availOptions.map(a => (
                  <button key={a} type="button" className={`admin-filter-pill ${form.availability.includes(a) ? 'active' : ''}`}
                    onClick={() => toggleAvail(a)} style={{ fontSize: '0.78rem', padding: '5px 12px' }}>
                    {a.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Emergency Contact</label>
                <input className="form-input" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Emergency Phone</label>
                <input className="form-input" value={form.emergencyPhone} onChange={e => setForm({...form, emergencyPhone: e.target.value})} /></div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>Add Volunteer</button>
          </form>
        </div>
      )}

      <div className="admin-list">
        {filtered.map(v => (
          <div key={v.id} className="admin-panel" style={{ marginBottom: '8px' }}>
            <div className="admin-list-item" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
              <div className="admin-list-avatar" style={{ background: 'var(--green-50)', color: 'var(--green-700)', borderRadius: '12px' }}>
                {(v.firstName || '?')[0]}{(v.lastName || '?')[0]}
              </div>
              <div className="admin-list-info">
                <div className="admin-list-name">{v.firstName} {v.lastName}</div>
                <div className="admin-list-meta">
                  <span>📧 {v.email}</span>
                  <span>⏱️ {v.hoursLogged || 0}h logged</span>
                  {(v.interests || []).length > 0 && <span>{v.interests.slice(0, 3).map(i => i.replace(/-/g, ' ')).join(', ')}</span>}
                </div>
              </div>
              <div className="admin-list-actions">
                <span className={`admin-status admin-status-${v.status}`}>{v.status}</span>
                <select className="form-input form-select" value={v.status}
                  onChange={e => onUpdate(v.id, { status: e.target.value, ...(e.target.value === 'active' ? { startDate: new Date().toISOString().split('T')[0] } : {}) })}
                  style={{ padding: '5px 28px 5px 10px', fontSize: '0.8rem', width: 'auto', minWidth: '100px', borderRadius: '10px' }}>
                  <option value="applied">Applied</option><option value="approved">Approved</option>
                  <option value="active">Active</option><option value="inactive">Inactive</option>
                </select>
                <button className="btn btn-sm btn-ghost" onClick={() => setLogId(logId === v.id ? null : v.id)}
                  style={{ borderRadius: '10px', padding: '5px 14px', fontSize: '0.82rem' }}>
                  ⏱️ Log Hours
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete?')) onDelete(v.id); }}
                  style={{ borderRadius: '10px', padding: '5px 12px' }}>✕</button>
              </div>
            </div>

            {/* Hour Logging Panel */}
            <div className={`admin-detail-drawer ${logId === v.id ? 'open' : ''}`}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: '0 0 80px' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Hours</label>
                  <input className="form-input" type="number" step="0.5" value={logForm.hours}
                    onChange={e => setLogForm({...logForm, hours: e.target.value})}
                    style={{ padding: '8px 10px', fontSize: '0.85rem', borderRadius: '10px' }} />
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: '0 0 130px' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Task</label>
                  <select className="form-input form-select" value={logForm.task}
                    onChange={e => setLogForm({...logForm, task: e.target.value})}
                    style={{ padding: '8px 10px', fontSize: '0.85rem', borderRadius: '10px' }}>
                    <option value="general">General</option><option value="dog-walking">Dog Walking</option>
                    <option value="cat-care">Cat Care</option><option value="cleaning">Cleaning</option>
                    <option value="event">Event</option><option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: '0 0 140px' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Date</label>
                  <input className="form-input" type="date" value={logForm.date}
                    onChange={e => setLogForm({...logForm, date: e.target.value})}
                    style={{ padding: '8px 10px', fontSize: '0.85rem', borderRadius: '10px' }} />
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => handleLogHours(v.id)}
                  style={{ borderRadius: '10px', padding: '9px 20px' }}>Log Hours</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="admin-panel"><div className="admin-empty">
            <div className="admin-empty-icon">🤝</div>
            <div className="admin-empty-title">No volunteers yet</div>
            <div className="admin-empty-text">Volunteer applications will appear here as they come in.</div>
          </div></div>
        )}
      </div>
    </>
  );
}
