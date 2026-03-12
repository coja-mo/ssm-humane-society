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
    setTimeout(() => setSaved(false), 2500);
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
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Configure your shelter&apos;s information and site controls</p>
        </div>
        <div className="admin-page-actions">
          {saved && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--green-600)', fontWeight: 600, fontSize: '0.9rem',
              animation: 'adminFadeIn 0.3s ease',
            }}>✓ Saved successfully!</span>
          )}
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}
            style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }}>
            {saving ? '⏳ Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </div>

      {/* Shelter Info */}
      <div className="admin-panel" style={{ marginBottom: '24px' }}>
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <div className="admin-settings-section-icon">🏢</div>
            Shelter Information
          </div>
        </div>
        <div className="admin-panel-body">
          <div className="admin-form-grid admin-form-grid-2">
            <div className="form-group"><label className="form-label">Shelter Name</label>
              <input className="form-input" value={form.shelterName || ''} onChange={e => setForm({...form, shelterName: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Short Name</label>
              <input className="form-input" value={form.shortName || ''} onChange={e => setForm({...form, shortName: e.target.value})} /></div>
          </div>
          <div className="admin-form-grid admin-form-grid-3">
            <div className="form-group"><label className="form-label">Phone</label>
              <input className="form-input" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Email</label>
              <input className="form-input" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Charitable #</label>
              <input className="form-input" value={form.charitableNumber || ''} onChange={e => setForm({...form, charitableNumber: e.target.value})} /></div>
          </div>
          <div className="form-group"><label className="form-label">Address</label>
            <input className="form-input" value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} /></div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="admin-panel" style={{ marginBottom: '24px' }}>
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <div className="admin-settings-section-icon">⏰</div>
            Operating Hours
          </div>
        </div>
        <div className="admin-panel-body" style={{ padding: '12px 24px 24px' }}>
          {days.map(day => (
            <div key={day} className="admin-settings-row">
              <span style={{ width: '100px', fontWeight: 600, textTransform: 'capitalize', fontSize: '0.9rem' }}>{day}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input className="form-input" type="time" value={form.hours?.[day]?.open || ''}
                  onChange={e => updateHours(day, 'open', e.target.value)}
                  style={{ width: '130px', padding: '8px 10px', fontSize: '0.88rem', borderRadius: '10px' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>to</span>
                <input className="form-input" type="time" value={form.hours?.[day]?.close || ''}
                  onChange={e => updateHours(day, 'close', e.target.value)}
                  style={{ width: '130px', padding: '8px 10px', fontSize: '0.88rem', borderRadius: '10px' }} />
                <button className="btn btn-sm btn-ghost" onClick={() => updateHours(day, 'open', 'closed')}
                  style={{ borderRadius: '10px', padding: '5px 14px', fontSize: '0.78rem' }}>Set Closed</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adoption Fees */}
      <div className="admin-panel" style={{ marginBottom: '24px' }}>
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <div className="admin-settings-section-icon">💰</div>
            Adoption Fees
          </div>
        </div>
        <div className="admin-panel-body">
          <div className="admin-form-grid admin-form-grid-3" style={{ gap: '16px' }}>
            {Object.entries(form.adoptionFees || {}).map(([key, val]) => (
              <div key={key} className="form-group">
                <label className="form-label" style={{ textTransform: 'capitalize' }}>{key}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600 }}>$</span>
                  <input className="form-input" type="number" value={val} onChange={e => updateFees(key, e.target.value)}
                    style={{ paddingLeft: '32px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="admin-panel" style={{ marginBottom: '24px' }}>
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <div className="admin-settings-section-icon">🌐</div>
            Social Media
          </div>
        </div>
        <div className="admin-panel-body">
          <div className="admin-form-grid admin-form-grid-3">
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
      </div>

      {/* Site Controls */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <div className="admin-settings-section-icon">🔧</div>
            Site Controls
          </div>
        </div>
        <div className="admin-panel-body">
          <div className="admin-settings-row">
            <div>
              <div className="admin-settings-row-label">🚧 Maintenance Mode</div>
              <div className="admin-settings-row-desc">Display maintenance page to public visitors</div>
            </div>
            <label className="admin-toggle">
              <input type="checkbox" checked={form.maintenanceMode || false}
                onChange={e => setForm({...form, maintenanceMode: e.target.checked})} />
              <span className="admin-toggle-track" />
              <span className="admin-toggle-thumb" />
            </label>
          </div>
          <div style={{ paddingTop: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Announcement Banner</label>
              <input className="form-input" value={form.announcementBanner || ''} placeholder="Leave empty to hide banner"
                onChange={e => setForm({...form, announcementBanner: e.target.value})} />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>Displays across top of public site</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
