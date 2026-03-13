'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [stats, setStats] = useState({ applications: 0, favorites: 0, adoptions: 0 });
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', bio: '',
  });
  const [passwordData, setPasswordData] = useState({
    current: '', newPass: '', confirm: '',
  });
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    applicationStatus: true,
    newPets: true,
    events: false,
    newsletter: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/auth/login'); return; }
    const parsed = JSON.parse(u);
    setUser(parsed);
    setFormData(prev => ({
      ...prev,
      name: parsed.name || '',
      email: parsed.email || '',
      phone: parsed.phone || '',
    }));

    // Fetch live stats
    fetch('/api/applications').then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        const userApps = data.filter(a => !a.isDraft);
        setStats(prev => ({
          ...prev,
          applications: userApps.length,
          adoptions: userApps.filter(a => a.status === 'completed' || a.status === 'approved').length,
        }));
      }
    }).catch(() => {});

    const favs = localStorage.getItem('favorites');
    if (favs) {
      try { setStats(prev => ({ ...prev, favorites: JSON.parse(favs).length })); }
      catch {}
    }
  }, [router]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    // Simulate save
    await new Promise(r => setTimeout(r, 1000));
    const updated = { ...user, name: formData.name, email: formData.email, phone: formData.phone };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (passwordData.newPass !== passwordData.confirm) return;
    if (passwordData.newPass.length < 6) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setPasswordData({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setSaved(false), 3000);
  }

  function handleLogout() {
    localStorage.removeItem('user');
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/');
  }

  if (!user) return null;

  const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'March 2026';

  const SECTIONS = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
  ];

  return (
    <section style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>Dashboard</Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Profile & Settings</span>
        </div>

        {/* Success Toast */}
        {saved && (
          <div style={{
            position: 'fixed', top: '100px', right: '24px', zIndex: 9999,
            background: 'var(--green-500)', color: '#fff',
            padding: '14px 24px', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', gap: '10px',
            fontWeight: '600', fontSize: '0.9rem',
            boxShadow: '0 8px 30px rgba(16,185,129,0.3)',
            animation: 'authAlertSlide 0.3s ease',
          }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Changes saved successfully!
          </div>
        )}

        <div className="profile-grid">
          {/* Sidebar Card */}
          <div className="profile-sidebar-card">
            <div className="profile-avatar-large">{initials}</div>
            <div className="profile-user-name">{user.name || 'User'}</div>
            <div className="profile-user-email">{user.email}</div>
            <div className="profile-user-role">
              🐾 {user.role === 'admin' ? 'Administrator' : 'Adopter'}
            </div>
            <div className="profile-stats-row">
              <div className="profile-stat">
                <div className="profile-stat-num">{stats.applications}</div>
                <div className="profile-stat-label">Applications</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num">{stats.favorites}</div>
                <div className="profile-stat-label">Favorites</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num">{stats.adoptions}</div>
                <div className="profile-stat-label">Adoptions</div>
              </div>
            </div>
            <div style={{ marginTop: '20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Member since {memberSince}
            </div>

            {/* Section Nav */}
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                    fontWeight: activeSection === s.id ? '700' : '500',
                    fontSize: '0.88rem', width: '100%', textAlign: 'left',
                    background: activeSection === s.id ? 'var(--blue-50)' : 'transparent',
                    color: activeSection === s.id ? 'var(--blue-700)' : 'var(--text-secondary)',
                    transition: 'all 0.2s', cursor: 'pointer', border: 'none',
                  }}
                >
                  <span>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="profile-content">
            {/* Personal Info Section */}
            {activeSection === 'personal' && (
              <div className="profile-section" style={{ animation: 'fadeInUp 0.4s ease both' }}>
                <div className="profile-section-header">
                  <h2 className="profile-section-title">👤 Personal Information</h2>
                </div>
                <form onSubmit={handleSaveProfile}>
                  <div className="profile-form-grid">
                    <div className="auth-field">
                      <label className="auth-label">Full Name</label>
                      <div className="auth-input-wrap">
                        <input className="auth-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Email Address</label>
                      <div className="auth-input-wrap">
                        <input className="auth-input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@email.com" />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Phone Number</label>
                      <div className="auth-input-wrap">
                        <input className="auth-input" type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="(705) 555-0123" />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">City</label>
                      <div className="auth-input-wrap">
                        <input className="auth-input" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="Sault Ste. Marie" />
                      </div>
                    </div>
                    <div className="auth-field" style={{ gridColumn: 'span 2' }}>
                      <label className="auth-label">Address</label>
                      <div className="auth-input-wrap">
                        <input className="auth-input" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="123 Example St" />
                      </div>
                    </div>
                    <div className="auth-field" style={{ gridColumn: 'span 2' }}>
                      <label className="auth-label">Bio</label>
                      <div className="auth-input-wrap">
                        <textarea className="auth-input" style={{ minHeight: '100px', resize: 'vertical' }} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell us about yourself and your experience with pets..." />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                    <button type="submit" className="auth-submit-btn" disabled={saving} style={{ width: 'auto', padding: '12px 32px' }}>
                      {saving ? <><span className="auth-spinner" /> Saving...</> : '💾 Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="profile-section" style={{ animation: 'fadeInUp 0.4s ease both' }}>
                <div className="profile-section-header">
                  <h2 className="profile-section-title">🔒 Security</h2>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Change Password</h3>
                <form onSubmit={handleChangePassword}>
                  <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div className="auth-field">
                      <label className="auth-label">Current Password</label>
                      <div className="auth-input-wrap">
                        <input className="auth-input" type="password" value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })} placeholder="Enter current password" required />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">New Password</label>
                      <div className="auth-input-wrap">
                        <input className="auth-input" type="password" value={passwordData.newPass} onChange={e => setPasswordData({ ...passwordData, newPass: e.target.value })} placeholder="Min. 6 characters" required />
                      </div>
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Confirm New Password</label>
                      <div className="auth-input-wrap">
                        <input className="auth-input" type="password" value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })} placeholder="Re-enter new password" required />
                      </div>
                      {passwordData.confirm && passwordData.newPass && (
                        <div style={{ fontSize: '0.8rem', marginTop: '6px', fontWeight: 500, color: passwordData.newPass === passwordData.confirm ? '#10B981' : '#EF4444' }}>
                          {passwordData.newPass === passwordData.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </div>
                      )}
                    </div>
                    <button type="submit" className="auth-submit-btn" disabled={saving} style={{ width: 'auto', alignSelf: 'flex-start', padding: '12px 32px' }}>
                      {saving ? <><span className="auth-spinner" /> Updating...</> : '🔑 Update Password'}
                    </button>
                  </div>
                </form>

                <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-light)', paddingTop: '28px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '8px' }}>Active Sessions</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                    Manage your active sessions across devices
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      💻
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Current Session</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This device · Active now</div>
                    </div>
                    <span className="badge badge-green">Active</span>
                  </div>
                </div>

                <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-light)', paddingTop: '28px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '8px', color: 'var(--rose-500)' }}>Danger Zone</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                    Permanently delete your account and all associated data
                  </p>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="profile-section" style={{ animation: 'fadeInUp 0.4s ease both' }}>
                <div className="profile-section-header">
                  <h2 className="profile-section-title">🔔 Notification Preferences</h2>
                </div>
                {[
                  { key: 'applicationStatus', title: 'Application Updates', desc: 'Get notified when your adoption application status changes' },
                  { key: 'newPets', title: 'New Pets Available', desc: 'Be the first to know when new pets are available for adoption' },
                  { key: 'events', title: 'Events & Activities', desc: 'Stay updated on adoption events and community activities' },
                  { key: 'emailUpdates', title: 'Email Updates', desc: 'Receive periodic email updates about the shelter' },
                  { key: 'newsletter', title: 'Newsletter', desc: 'Monthly newsletter with success stories and tips' },
                ].map(opt => (
                  <div key={opt.key} className="notif-option">
                    <div className="notif-option-info">
                      <div className="notif-option-title">{opt.title}</div>
                      <div className="notif-option-desc">{opt.desc}</div>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${notifications[opt.key] ? 'active' : ''}`}
                      onClick={() => setNotifications(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                      aria-label={`Toggle ${opt.title}`}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button className="auth-submit-btn" onClick={async () => { setSaving(true); await new Promise(r => setTimeout(r, 800)); setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }} style={{ width: 'auto', padding: '12px 32px' }}>
                    {saving ? <><span className="auth-spinner" /> Saving...</> : '💾 Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <div className="profile-section" style={{ animation: 'fadeInUp 0.4s ease both' }}>
                <div className="profile-section-header">
                  <h2 className="profile-section-title">⚙️ Preferences</h2>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px' }}>Pet Preferences</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Help us show you the most relevant pets
                </p>

                <div className="profile-form-grid">
                  <div className="auth-field">
                    <label className="auth-label">Preferred Pet Type</label>
                    <select className="auth-input" style={{ appearance: 'auto' }} defaultValue="">
                      <option value="">Any</option>
                      <option value="dog">Dogs</option>
                      <option value="cat">Cats</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Age Preference</label>
                    <select className="auth-input" style={{ appearance: 'auto' }} defaultValue="">
                      <option value="">Any age</option>
                      <option value="puppy">Puppy/Kitten</option>
                      <option value="young">Young (1-3 years)</option>
                      <option value="adult">Adult (3-7 years)</option>
                      <option value="senior">Senior (7+ years)</option>
                    </select>
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Size Preference</label>
                    <select className="auth-input" style={{ appearance: 'auto' }} defaultValue="">
                      <option value="">Any size</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Living Situation</label>
                    <select className="auth-input" style={{ appearance: 'auto' }} defaultValue="">
                      <option value="">Prefer not to say</option>
                      <option value="house">House with yard</option>
                      <option value="house-no-yard">House without yard</option>
                      <option value="apartment">Apartment/Condo</option>
                      <option value="rural">Rural Property</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button className="auth-submit-btn" onClick={async () => { setSaving(true); await new Promise(r => setTimeout(r, 800)); setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }} style={{ width: 'auto', padding: '12px 32px' }}>
                    {saving ? <><span className="auth-spinner" /> Saving...</> : '💾 Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* Sign Out / Back */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                ← Back to Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ color: 'var(--rose-500)' }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
              <div className="modal-header">
                <h3 style={{ color: 'var(--rose-500)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⚠️ Delete Account
                </h3>
                <button onClick={() => setShowDeleteModal(false)} style={{ fontSize: '1.3rem', color: 'var(--text-muted)' }}>✕</button>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                  Are you sure you want to delete your account? This action is <strong>permanent</strong> and cannot be undone. All your data, including applications and favorites, will be removed.
                </p>
                <div style={{ padding: '14px', background: '#FEF2F2', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#B91C1C' }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  This cannot be undone
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-ghost btn-sm" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="btn btn-danger btn-sm">Delete My Account</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
