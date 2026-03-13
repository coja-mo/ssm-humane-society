'use client';
import { useState, useEffect } from 'react';

export default function SettingsTab({ settings, onSave }) {
  const [form, setForm] = useState(settings || {});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('shelter');

  useEffect(() => { setForm(settings || {}); }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateHours = (day, field, value) => {
    setForm(f => ({ ...f, hours: { ...(f.hours || {}), [day]: { ...(f.hours?.[day] || {}), [field]: value } } }));
  };

  const updateFees = (key, value) => {
    setForm(f => ({ ...f, adoptionFees: { ...(f.adoptionFees || {}), [key]: Number(value) || 0 } }));
  };

  const updateNotification = (key, value) => {
    setForm(f => ({ ...f, notifications: { ...(f.notifications || {}), [key]: value } }));
  };

  const updateSecurity = (key, value) => {
    setForm(f => ({ ...f, security: { ...(f.security || {}), [key]: value } }));
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const sections = [
    { id: 'shelter', icon: '🏢', label: 'Shelter Info' },
    { id: 'hours', icon: '⏰', label: 'Operating Hours' },
    { id: 'fees', icon: '💰', label: 'Adoption Fees' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'email', icon: '📧', label: 'Email Templates' },
    { id: 'appearance', icon: '🎨', label: 'Appearance' },
    { id: 'social', icon: '🌐', label: 'Social Media' },
    { id: 'security', icon: '🔒', label: 'Security' },
    { id: 'integrations', icon: '🔗', label: 'Integrations' },
    { id: 'controls', icon: '🔧', label: 'Site Controls' },
    { id: 'backup', icon: '💾', label: 'Backup & Export' },
  ];

  const notifs = form.notifications || {};
  const security = form.security || {};

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Configure your shelter&apos;s information, controls, and integrations</p>
        </div>
        <div className="admin-page-actions">
          {saved && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--green-600)', fontWeight: 600, fontSize: '0.9rem', animation: 'adminFadeIn 0.3s ease' }}>✓ Saved successfully!</span>
          )}
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}
            style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }}>
            {saving ? '⏳ Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
        {/* Settings Sidebar */}
        <div style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
          <div className="admin-panel" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '8px' }}>
              {sections.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '10px', border: 'none',
                  background: activeSection === s.id ? 'var(--blue-50)' : 'transparent',
                  color: activeSection === s.id ? 'var(--blue-700)' : 'var(--text-secondary)',
                  fontWeight: activeSection === s.id ? 700 : 500,
                  fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                  fontFamily: 'inherit',
                }}>
                  <span style={{ fontSize: '1rem' }}>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Shelter Information */}
          {activeSection === 'shelter' && (
            <div className="admin-panel">
              <div className="admin-panel-header"><div className="admin-panel-title"><span>🏢</span> Shelter Information</div></div>
              <div className="admin-panel-body">
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="form-group"><label className="form-label">Shelter Name</label><input className="form-input" value={form.shelterName || ''} onChange={e => setForm({...form, shelterName: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Short Name</label><input className="form-input" value={form.shortName || ''} onChange={e => setForm({...form, shortName: e.target.value})} /></div>
                </div>
                <div className="admin-form-grid admin-form-grid-3">
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Charitable #</label><input className="form-input" value={form.charitableNumber || ''} onChange={e => setForm({...form, charitableNumber: e.target.value})} /></div>
                </div>
                <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} /></div>
                <div className="admin-form-grid admin-form-grid-3">
                  <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city || 'Sault Ste. Marie'} onChange={e => setForm({...form, city: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Province</label><input className="form-input" value={form.province || 'Ontario'} onChange={e => setForm({...form, province: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Postal Code</label><input className="form-input" value={form.postalCode || ''} onChange={e => setForm({...form, postalCode: e.target.value})} /></div>
                </div>
                <div className="form-group"><label className="form-label">Mission Statement</label><textarea className="form-input" value={form.missionStatement || ''} onChange={e => setForm({...form, missionStatement: e.target.value})} style={{ minHeight: '80px' }} placeholder="Our mission is to..." /></div>
              </div>
            </div>
          )}

          {/* Operating Hours */}
          {activeSection === 'hours' && (
            <div className="admin-panel">
              <div className="admin-panel-header"><div className="admin-panel-title"><span>⏰</span> Operating Hours</div></div>
              <div className="admin-panel-body" style={{ padding: '12px 24px 24px' }}>
                {days.map(day => (
                  <div key={day} className="admin-settings-row">
                    <span style={{ width: '100px', fontWeight: 600, textTransform: 'capitalize', fontSize: '0.9rem' }}>{day}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input className="form-input" type="time" value={form.hours?.[day]?.open || ''}
                        onChange={e => updateHours(day, 'open', e.target.value)}
                        style={{ width: '130px', padding: '8px 10px', fontSize: '0.88rem', borderRadius: '10px' }} />
                      <span style={{ color: 'var(--text-muted)' }}>to</span>
                      <input className="form-input" type="time" value={form.hours?.[day]?.close || ''}
                        onChange={e => updateHours(day, 'close', e.target.value)}
                        style={{ width: '130px', padding: '8px 10px', fontSize: '0.88rem', borderRadius: '10px' }} />
                      <button className="btn btn-sm btn-ghost" onClick={() => updateHours(day, 'open', 'closed')}
                        style={{ borderRadius: '10px', padding: '5px 14px', fontSize: '0.78rem' }}>Set Closed</button>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '12px 0', fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Note: Changes to hours will be reflected on the public site immediately upon saving.</div>
              </div>
            </div>
          )}

          {/* Adoption Fees */}
          {activeSection === 'fees' && (
            <div className="admin-panel">
              <div className="admin-panel-header"><div className="admin-panel-title"><span>💰</span> Adoption Fees</div></div>
              <div className="admin-panel-body">
                <div className="admin-form-grid admin-form-grid-3" style={{ gap: '16px' }}>
                  {Object.entries(form.adoptionFees || {}).map(([key, val]) => (
                    <div key={key} className="form-group">
                      <label className="form-label" style={{ textTransform: 'capitalize' }}>{key}</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600 }}>$</span>
                        <input className="form-input" type="number" value={val} onChange={e => updateFees(key, e.target.value)} style={{ paddingLeft: '32px' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '20px', padding: '14px 18px', background: 'var(--bg-secondary)', borderRadius: '12px', fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                  <strong>Fees include:</strong> Spay/neuter surgery, age-appropriate vaccinations, microchip, flea treatment, deworming, and a 2-week health guarantee.
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="admin-panel">
              <div className="admin-panel-header"><div className="admin-panel-title"><span>🔔</span> Notification Preferences</div></div>
              <div className="admin-panel-body">
                {[
                  { key: 'newApplication', label: 'New Adoption Application', desc: 'Get notified when someone submits an adoption application' },
                  { key: 'newMessage', label: 'New Contact Message', desc: 'Get notified when a visitor sends a message via the contact form' },
                  { key: 'newDonation', label: 'New Donation', desc: 'Get notified when a donation is received' },
                  { key: 'newVolunteer', label: 'Volunteer Application', desc: 'Get notified when someone applies to volunteer' },
                  { key: 'lowStock', label: 'Low Stock Alert', desc: 'Get notified when supplies fall below threshold' },
                  { key: 'kennelFull', label: 'Kennel Capacity Warning', desc: 'Get notified when kennels reach 90% capacity' },
                  { key: 'dailyDigest', label: 'Daily Digest Email', desc: 'Receive a daily summary of all activity' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive a weekly analytics report' },
                ].map(item => (
                  <div key={item.key} className="admin-settings-row">
                    <div>
                      <div className="admin-settings-row-label">{item.label}</div>
                      <div className="admin-settings-row-desc">{item.desc}</div>
                    </div>
                    <label className="admin-toggle">
                      <input type="checkbox" checked={notifs[item.key] || false} onChange={e => updateNotification(item.key, e.target.checked)} />
                      <span className="admin-toggle-track" /><span className="admin-toggle-thumb" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Templates */}
          {activeSection === 'email' && (
            <div className="admin-panel">
              <div className="admin-panel-header"><div className="admin-panel-title"><span>📧</span> Email Templates</div></div>
              <div className="admin-panel-body">
                {[
                  { key: 'applicationReceived', label: 'Application Received', desc: 'Sent when someone submits an adoption application', placeholder: 'Thank you for applying to adopt from SSM Humane Society...' },
                  { key: 'applicationApproved', label: 'Application Approved', desc: 'Sent when an application is approved', placeholder: 'Great news! Your adoption application has been approved...' },
                  { key: 'applicationDeclined', label: 'Application Declined', desc: 'Sent when an application is declined', placeholder: 'Thank you for your interest...' },
                  { key: 'donationThankYou', label: 'Donation Thank You', desc: 'Auto-sent after a donation is received', placeholder: 'Thank you for your generous donation...' },
                  { key: 'volunteerWelcome', label: 'Volunteer Welcome', desc: 'Sent when a volunteer application is approved', placeholder: 'Welcome to the SSM Humane Society volunteer team...' },
                ].map(tpl => (
                  <div key={tpl.key} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tpl.label}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tpl.desc}</div></div>
                      <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '6px', background: (form.emailTemplates || {})[tpl.key] ? '#ECFDF5' : '#FEF2F2', color: (form.emailTemplates || {})[tpl.key] ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                        {(form.emailTemplates || {})[tpl.key] ? 'Customized' : 'Default'}
                      </span>
                    </div>
                    <textarea className="form-input" value={(form.emailTemplates || {})[tpl.key] || ''} placeholder={tpl.placeholder}
                      onChange={e => setForm(f => ({ ...f, emailTemplates: { ...(f.emailTemplates || {}), [tpl.key]: e.target.value } }))}
                      style={{ minHeight: '80px', fontSize: '0.85rem' }} />
                  </div>
                ))}
                <div style={{ padding: '12px 16px', background: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE', fontSize: '0.82rem', color: '#1D4ED8' }}>
                  💡 Use <code style={{ background: 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: '4px' }}>{'{name}'}</code>, <code style={{ background: 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: '4px' }}>{'{petName}'}</code>, <code style={{ background: 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: '4px' }}>{'{shelterName}'}</code> as template variables.
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="admin-panel">
              <div className="admin-panel-header"><div className="admin-panel-title"><span>🎨</span> Appearance</div></div>
              <div className="admin-panel-body">
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Primary Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input type="color" value={form.primaryColor || '#29ABE2'} onChange={e => setForm({...form, primaryColor: e.target.value})} style={{ width: '50px', height: '38px', borderRadius: '8px', border: '2px solid var(--border-light)', cursor: 'pointer', padding: '2px' }} />
                      <input className="form-input" value={form.primaryColor || '#29ABE2'} onChange={e => setForm({...form, primaryColor: e.target.value})} style={{ fontFamily: 'monospace' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Accent Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input type="color" value={form.accentColor || '#10B981'} onChange={e => setForm({...form, accentColor: e.target.value})} style={{ width: '50px', height: '38px', borderRadius: '8px', border: '2px solid var(--border-light)', cursor: 'pointer', padding: '2px' }} />
                      <input className="form-input" value={form.accentColor || '#10B981'} onChange={e => setForm({...form, accentColor: e.target.value})} style={{ fontFamily: 'monospace' }} />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Logo URL</label>
                  <input className="form-input" value={form.logoUrl || ''} onChange={e => setForm({...form, logoUrl: e.target.value})} placeholder="/images/logo.png" />
                </div>
                <div className="form-group">
                  <label className="form-label">Favicon URL</label>
                  <input className="form-input" value={form.faviconUrl || ''} onChange={e => setForm({...form, faviconUrl: e.target.value})} placeholder="/favicon.ico" />
                </div>
                <div className="admin-settings-row">
                  <div><div className="admin-settings-row-label">🌙 Dark Mode Default</div><div className="admin-settings-row-desc">Set dark mode as the default theme for visitors</div></div>
                  <label className="admin-toggle"><input type="checkbox" checked={form.darkModeDefault || false} onChange={e => setForm({...form, darkModeDefault: e.target.checked})} /><span className="admin-toggle-track" /><span className="admin-toggle-thumb" /></label>
                </div>
                <div className="admin-settings-row">
                  <div><div className="admin-settings-row-label">✨ Animations</div><div className="admin-settings-row-desc">Enable smooth animations and transitions site-wide</div></div>
                  <label className="admin-toggle"><input type="checkbox" checked={form.animationsEnabled !== false} onChange={e => setForm({...form, animationsEnabled: e.target.checked})} /><span className="admin-toggle-track" /><span className="admin-toggle-thumb" /></label>
                </div>
              </div>
            </div>
          )}

          {/* Social Media */}
          {activeSection === 'social' && (
            <div className="admin-panel">
              <div className="admin-panel-header"><div className="admin-panel-title"><span>🌐</span> Social Media</div></div>
              <div className="admin-panel-body">
                {[
                  { key: 'facebook', icon: '📘', label: 'Facebook', placeholder: 'https://facebook.com/ssmhumanesociety' },
                  { key: 'instagram', icon: '📸', label: 'Instagram', placeholder: 'https://instagram.com/ssmhumanesociety' },
                  { key: 'twitter', icon: '🐦', label: 'Twitter / X', placeholder: 'https://x.com/ssmhumanesociety' },
                  { key: 'youtube', icon: '📺', label: 'YouTube', placeholder: 'https://youtube.com/@ssmhumanesociety' },
                  { key: 'tiktok', icon: '🎵', label: 'TikTok', placeholder: 'https://tiktok.com/@ssmhumanesociety' },
                ].map(s => (
                  <div key={s.key} className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{s.icon} {s.label}</label>
                    <input className="form-input" value={(form.socialMedia || {})[s.key] || ''} placeholder={s.placeholder}
                      onChange={e => setForm(f => ({ ...f, socialMedia: { ...(f.socialMedia || {}), [s.key]: e.target.value } }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="admin-panel">
              <div className="admin-panel-header"><div className="admin-panel-title"><span>🔒</span> Security & Access</div></div>
              <div className="admin-panel-body">
                {[
                  { key: 'twoFactorRequired', label: '🔐 Require 2FA for Admin', desc: 'All admin users must enable two-factor authentication' },
                  { key: 'sessionTimeout', label: '⏱️ Auto-logout after 30 min', desc: 'Automatically sign out inactive sessions' },
                  { key: 'ipRestriction', label: '🌐 IP Restriction', desc: 'Restrict admin access to approved IP addresses' },
                  { key: 'auditLogging', label: '📋 Audit Logging', desc: 'Log all admin actions for compliance' },
                  { key: 'passwordExpiry', label: '🔑 Password Expiry (90 days)', desc: 'Require password changes every 90 days' },
                ].map(item => (
                  <div key={item.key} className="admin-settings-row">
                    <div><div className="admin-settings-row-label">{item.label}</div><div className="admin-settings-row-desc">{item.desc}</div></div>
                    <label className="admin-toggle"><input type="checkbox" checked={security[item.key] || false} onChange={e => updateSecurity(item.key, e.target.checked)} /><span className="admin-toggle-track" /><span className="admin-toggle-thumb" /></label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeSection === 'integrations' && (
            <div className="admin-panel">
              <div className="admin-panel-header"><div className="admin-panel-title"><span>🔗</span> Integrations</div></div>
              <div className="admin-panel-body">
                {[
                  { key: 'petfinder', label: 'Petfinder', desc: 'Sync adoptable pets to Petfinder.com', icon: '🐾', connected: (form.integrations || {}).petfinder },
                  { key: 'adoptapet', label: 'Adopt-a-Pet', desc: 'Sync adoptable pets to Adopt-a-Pet.com', icon: '🏠', connected: (form.integrations || {}).adoptapet },
                  { key: 'mailchimp', label: 'Mailchimp', desc: 'Sync newsletter subscribers and send campaigns', icon: '📧', connected: (form.integrations || {}).mailchimp },
                  { key: 'stripe', label: 'Stripe', desc: 'Process online donations and adoption fees', icon: '💳', connected: (form.integrations || {}).stripe },
                  { key: 'googleAnalytics', label: 'Google Analytics', desc: 'Track website traffic and user behavior', icon: '📊', connected: (form.integrations || {}).googleAnalytics },
                ].map(int => (
                  <div key={int.key} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: int.connected ? '#ECFDF5' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{int.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{int.label}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{int.desc}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: int.connected ? '#10B981' : '#D1D5DB' }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: int.connected ? 'var(--green-600)' : 'var(--text-muted)' }}>{int.connected ? 'Connected' : 'Not connected'}</span>
                      <button onClick={() => setForm(f => ({ ...f, integrations: { ...(f.integrations || {}), [int.key]: !int.connected } }))}
                        className={`btn btn-sm ${int.connected ? 'btn-danger' : 'btn-primary'}`} style={{ borderRadius: '10px', padding: '6px 16px', fontSize: '0.78rem' }}>
                        {int.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Site Controls */}
          {activeSection === 'controls' && (
            <div className="admin-panel">
              <div className="admin-panel-header"><div className="admin-panel-title"><span>🔧</span> Site Controls</div></div>
              <div className="admin-panel-body">
                <div className="admin-settings-row">
                  <div><div className="admin-settings-row-label">🚧 Maintenance Mode</div><div className="admin-settings-row-desc">Display maintenance page to public visitors</div></div>
                  <label className="admin-toggle"><input type="checkbox" checked={form.maintenanceMode || false} onChange={e => setForm({...form, maintenanceMode: e.target.checked})} /><span className="admin-toggle-track" /><span className="admin-toggle-thumb" /></label>
                </div>
                <div className="admin-settings-row">
                  <div><div className="admin-settings-row-label">🐾 Adoptions Paused</div><div className="admin-settings-row-desc">Temporarily disable new adoption applications</div></div>
                  <label className="admin-toggle"><input type="checkbox" checked={form.adoptionsPaused || false} onChange={e => setForm({...form, adoptionsPaused: e.target.checked})} /><span className="admin-toggle-track" /><span className="admin-toggle-thumb" /></label>
                </div>
                <div className="admin-settings-row">
                  <div><div className="admin-settings-row-label">🤝 Volunteer Applications Open</div><div className="admin-settings-row-desc">Allow new volunteer applications from the public</div></div>
                  <label className="admin-toggle"><input type="checkbox" checked={form.volunteerOpen !== false} onChange={e => setForm({...form, volunteerOpen: e.target.checked})} /><span className="admin-toggle-track" /><span className="admin-toggle-thumb" /></label>
                </div>
                <div style={{ paddingTop: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Announcement Banner</label>
                    <input className="form-input" value={form.announcementBanner || ''} placeholder="Leave empty to hide banner"
                      onChange={e => setForm({...form, announcementBanner: e.target.value})} />
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>Displays across top of public site. Leave empty to hide.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backup & Export */}
          {activeSection === 'backup' && (
            <div className="admin-panel">
              <div className="admin-panel-header"><div className="admin-panel-title"><span>💾</span> Backup & Data Export</div></div>
              <div className="admin-panel-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  {[
                    { label: 'Export All Data', desc: 'Download a complete JSON backup of all shelter data', icon: '📦', action: 'Full Backup' },
                    { label: 'Export Pets', desc: 'Download pets database as CSV', icon: '🐾', action: 'Pets CSV' },
                    { label: 'Export Donations', desc: 'Download donation records as CSV', icon: '💰', action: 'Donations CSV' },
                    { label: 'Export Volunteers', desc: 'Download volunteer records as CSV', icon: '🤝', action: 'Volunteers CSV' },
                    { label: 'Export Applications', desc: 'Download adoption applications as CSV', icon: '📋', action: 'Applications CSV' },
                    { label: 'Export Events', desc: 'Download events calendar as CSV', icon: '📅', action: 'Events CSV' },
                  ].map(exp => (
                    <div key={exp.label} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{exp.icon}</span>
                        <div><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{exp.label}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{exp.desc}</div></div>
                      </div>
                      <button className="btn btn-sm btn-ghost" style={{ borderRadius: '10px', padding: '6px 16px', fontSize: '0.78rem', width: '100%' }}>
                        📥 {exp.action}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="admin-callout-warning" style={{ padding: '14px 18px', borderLeft: '4px solid #F59E0B', background: 'rgba(245,158,11,0.04)', borderRadius: '12px' }}>
                  <strong>⚠️ Data Retention:</strong> All records are stored locally. We recommend creating backups regularly to prevent data loss.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
