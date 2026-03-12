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
  const statusColors = { applied: '#F59E0B', approved: 'var(--green-500)', active: 'var(--blue-500)', inactive: 'var(--text-muted)' };
  const interestOptions = ['dog-walking', 'cat-socialization', 'events', 'admin', 'cleaning', 'transport', 'fundraising', 'photography'];
  const availOptions = ['weekday-morning', 'weekday-afternoon', 'weekday-evening', 'weekend-morning', 'weekend-afternoon'];

  const totalHours = volunteers.reduce((s, v) => s + (v.hoursLogged || 0), 0);
  const filtered = volunteers.filter(v => filter === 'all' || v.status === filter);

  const toggleInterest = (val) => {
    setForm(f => ({...f, interests: f.interests.includes(val) ? f.interests.filter(i => i !== val) : [...f.interests, val]}));
  };
  const toggleAvail = (val) => {
    setForm(f => ({...f, availability: f.availability.includes(val) ? f.availability.filter(a => a !== val) : [...f.availability, val]}));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>🤝 Volunteers ({volunteers.length})</h1>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancel' : '+ Add Volunteer'}
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Active', value: volunteers.filter(v => v.status === 'active').length, color: 'var(--blue-500)', icon: '✅' },
          { label: 'Pending', value: volunteers.filter(v => v.status === 'applied').length, color: '#F59E0B', icon: '⏳' },
          { label: 'Total Hours', value: totalHours, color: 'var(--green-500)', icon: '⏱️' },
          { label: 'Total Volunteers', value: volunteers.length, color: '#8B5CF6', icon: '👥' },
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
            onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
        ))}
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>➕ Add Volunteer</h3>
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
            <div className="form-group"><label className="form-label">Date of Birth</label>
              <input className="form-input" type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} /></div>
          </div>
          <div className="form-group"><label className="form-label">Skills (comma separated)</label>
            <input className="form-input" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} placeholder="animal handling, first aid..." /></div>
          <div className="form-group"><label className="form-label">Interests</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {interestOptions.map(i => (
                <button key={i} type="button" className={`btn btn-sm ${form.interests.includes(i) ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => toggleInterest(i)} style={{ textTransform: 'capitalize' }}>{i.replace(/-/g, ' ')}</button>
              ))}
            </div>
          </div>
          <div className="form-group"><label className="form-label">Availability</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {availOptions.map(a => (
                <button key={a} type="button" className={`btn btn-sm ${form.availability.includes(a) ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => toggleAvail(a)} style={{ textTransform: 'capitalize' }}>{a.replace(/-/g, ' ')}</button>
              ))}
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Emergency Contact</label>
              <input className="form-input" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Emergency Phone</label>
              <input className="form-input" value={form.emergencyPhone} onChange={e => setForm({...form, emergencyPhone: e.target.value})} /></div>
          </div>
          <button type="submit" className="btn btn-primary">Add Volunteer</button>
        </form>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {filtered.map(v => (
          <div key={v.id} className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--green-700)' }}>
                  {(v.firstName || '?')[0]}{(v.lastName || '?')[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{v.firstName} {v.lastName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    📧 {v.email} · ⏱️ {v.hoursLogged || 0}h logged
                    {(v.interests || []).length > 0 && ` · ${v.interests.slice(0, 3).join(', ')}`}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="badge" style={{ background: `${statusColors[v.status]}20`, color: statusColors[v.status] }}>{v.status}</span>
                <select className="form-input form-select" value={v.status}
                  onChange={e => onUpdate(v.id, { status: e.target.value, ...(e.target.value === 'active' ? { startDate: new Date().toISOString().split('T')[0] } : {}) })}
                  style={{ padding: '4px 28px 4px 8px', fontSize: '0.8rem', width: 'auto', minWidth: '100px' }}>
                  <option value="applied">Applied</option><option value="approved">Approved</option>
                  <option value="active">Active</option><option value="inactive">Inactive</option>
                </select>
                <button className="btn btn-sm btn-ghost" onClick={() => setLogId(logId === v.id ? null : v.id)}>⏱️ Log</button>
                <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete?')) onDelete(v.id); }} style={{ padding: '4px 8px' }}>✕</button>
              </div>
            </div>
            {logId === v.id && (
              <div style={{ marginTop: '12px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: '0 0 80px' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Hours</label>
                  <input className="form-input" type="number" step="0.5" value={logForm.hours}
                    onChange={e => setLogForm({...logForm, hours: e.target.value})} style={{ padding: '6px 8px', fontSize: '0.85rem' }} />
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: '0 0 120px' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Task</label>
                  <select className="form-input form-select" value={logForm.task}
                    onChange={e => setLogForm({...logForm, task: e.target.value})} style={{ padding: '6px 8px', fontSize: '0.85rem' }}>
                    <option value="general">General</option><option value="dog-walking">Dog Walking</option>
                    <option value="cat-care">Cat Care</option><option value="cleaning">Cleaning</option>
                    <option value="event">Event</option><option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: '0 0 130px' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Date</label>
                  <input className="form-input" type="date" value={logForm.date}
                    onChange={e => setLogForm({...logForm, date: e.target.value})} style={{ padding: '6px 8px', fontSize: '0.85rem' }} />
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => handleLogHours(v.id)}>Log Hours</button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤝</div>
            <p style={{ color: 'var(--text-muted)' }}>No volunteers yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
