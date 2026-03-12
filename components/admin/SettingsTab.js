'use client';
import { useState, useEffect } from 'react';

export default function SettingsTab({ settings, onSave }) {
  const [form, setForm] = useState(settings || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(settings || {}); }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateHours = (day, field, value) => {
    setForm(f => ({
      ...f,
      hours: { ...(f.hours || {}), [day]: { ...(f.hours?.[day] || {}), [field]: value } }
    }));
  };

  const updateFees = (key, value) => {
    setForm(f => ({
      ...f,
      adoptionFees: { ...(f.adoptionFees || {}), [key]: Number(value) || 0 }
    }));
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>⚙️ Settings</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {saved && <span style={{ color: 'var(--green-500)', fontWeight: 600 }}>✓ Saved!</span>}
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </div>

      {/* Shelter Info */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>🏢 Shelter Information</h3>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Shelter Name</label>
            <input className="form-input" value={form.shelterName || ''} onChange={e => setForm({...form, shelterName: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Short Name</label>
            <input className="form-input" value={form.shortName || ''} onChange={e => setForm({...form, shortName: e.target.value})} />
          </div>
        </div>
        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Charitable #</label>
            <input className="form-input" value={form.charitableNumber || ''} onChange={e => setForm({...form, charitableNumber: e.target.value})} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <input className="form-input" value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} />
        </div>
      </div>

      {/* Hours */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>⏰ Operating Hours</h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          {days.map(day => (
            <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ width: '100px', fontWeight: 600, textTransform: 'capitalize' }}>{day}</span>
              <input className="form-input" type="time" value={form.hours?.[day]?.open || ''}
                onChange={e => updateHours(day, 'open', e.target.value)}
                style={{ width: '130px', padding: '6px 10px', fontSize: '0.9rem' }} />
              <span style={{ color: 'var(--text-muted)' }}>to</span>
              <input className="form-input" type="time" value={form.hours?.[day]?.close || ''}
                onChange={e => updateHours(day, 'close', e.target.value)}
                style={{ width: '130px', padding: '6px 10px', fontSize: '0.9rem' }} />
              <button className="btn btn-sm btn-ghost" onClick={() => updateHours(day, 'open', 'closed')}>Set Closed</button>
            </div>
          ))}
        </div>
      </div>

      {/* Adoption Fees */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>💰 Adoption Fees</h3>
        <div className="grid-3" style={{ gap: '16px' }}>
          {Object.entries(form.adoptionFees || {}).map(([key, val]) => (
            <div key={key} className="form-group">
              <label className="form-label" style={{ textTransform: 'capitalize' }}>{key}</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>$</span>
                <input className="form-input" type="number" value={val} onChange={e => updateFees(key, e.target.value)}
                  style={{ paddingLeft: '28px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>🌐 Social Media</h3>
        <div className="grid-3">
          {Object.entries(form.socialMedia || {}).map(([key, val]) => (
            <div key={key} className="form-group">
              <label className="form-label" style={{ textTransform: 'capitalize' }}>{key}</label>
              <input className="form-input" value={val || ''} onChange={e => setForm({
                ...form, socialMedia: { ...(form.socialMedia || {}), [key]: e.target.value }
              })} />
            </div>
          ))}
        </div>
      </div>

      {/* Site Controls */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>🔧 Site Controls</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.maintenanceMode || false}
              onChange={e => setForm({...form, maintenanceMode: e.target.checked})} />
            <div>
              <div style={{ fontWeight: 600 }}>🚧 Maintenance Mode</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Display maintenance page to public visitors</div>
            </div>
          </label>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Announcement Banner</label>
            <input className="form-input" value={form.announcementBanner || ''} placeholder="Leave empty to hide banner"
              onChange={e => setForm({...form, announcementBanner: e.target.value})} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Displays across top of public site</div>
          </div>
        </div>
      </div>
    </>
  );
}
