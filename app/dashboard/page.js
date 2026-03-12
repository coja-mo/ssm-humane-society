'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const STATUS_LABELS = {
  submitted: { label: 'Submitted', color: 'var(--blue-500)', icon: '📝' },
  reviewing: { label: 'Under Review', color: '#F59E0B', icon: '🔍' },
  approved: { label: 'Approved', color: 'var(--green-500)', icon: '✅' },
  'visit-scheduled': { label: 'Visit Scheduled', color: '#8B5CF6', icon: '📅' },
  adopted: { label: 'Adopted!', color: '#EC4899', icon: '🏠' },
  rejected: { label: 'Not Approved', color: 'var(--rose-500)', icon: '❌' },
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'applications', label: 'Applications', icon: '📝' },
  { id: 'favorites', label: 'Favorites', icon: '❤️' },
  { id: 'visits', label: 'Visits', icon: '📅' },
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showWelcome, setShowWelcome] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/auth/login'); return; }
    setUser(JSON.parse(u));

    // Show welcome banner for new registrations
    if (searchParams.get('welcome') === 'true') {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 8000);
    }

    // Load applications
    fetch('/api/applications').then(r => r.json()).then(data => {
      setApps(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));

    // Load favorites from localStorage
    const savedFavs = localStorage.getItem('favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, [router, searchParams]);

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
  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';

  return (
    <section style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container">

        {/* Welcome Banner for New Users */}
        {showWelcome && (
          <div className="dash-welcome-banner" style={{ animation: 'fadeInUp 0.6s ease both' }}>
            <div className="dash-welcome-content">
              <div className="dash-welcome-title">
                Welcome to the family, {user.name?.split(' ')[0] || 'Friend'}! 🎉
              </div>
              <div className="dash-welcome-sub">
                Your account is all set. Start exploring pets available for adoption!
              </div>
            </div>
            <div className="dash-welcome-emoji">🐾</div>
          </div>
        )}

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>
              My Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Welcome back, <span className="text-gradient">{user.name || 'Friend'}</span> 👋
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/dashboard/profile" className="btn btn-secondary btn-sm" style={{ borderRadius: '100px' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </Link>
            <Link href="/adopt" className="btn btn-primary btn-sm" style={{ borderRadius: '100px' }}>
              🐾 Browse Pets
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'pet-filter-btn active' : 'pet-filter-btn'}
              style={{ whiteSpace: 'nowrap' }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats */}
            <div className="stats-grid" style={{ marginBottom: '32px' }}>
              {[
                { icon: '📝', label: 'Applications', count: apps.length, color: 'var(--blue-500)', href: '#' },
                { icon: '❤️', label: 'Saved Pets', count: favorites.length, color: 'var(--rose-500)', href: '#' },
                { icon: '📅', label: 'Upcoming Visits', count: apps.filter(a => a.status === 'visit-scheduled').length, color: '#8B5CF6', href: '#' },
                { icon: '✅', label: 'Adoptions', count: apps.filter(a => a.status === 'adopted').length, color: 'var(--green-500)', href: '#' },
              ].map(item => (
                <button key={item.label} onClick={() => setActiveTab(item.label === 'Saved Pets' ? 'favorites' : item.label === 'Upcoming Visits' ? 'visits' : 'applications')} className="stat-card" style={{ textDecoration: 'none', transition: 'all 0.3s', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="stat-card-value" style={{ color: item.color }}>{item.count}</div>
                      <div className="stat-card-label">{item.label}</div>
                    </div>
                    <div style={{ fontSize: '2rem', opacity: 0.8 }}>{item.icon}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Recent Applications */}
            <div className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📝 Recent Applications
                </h2>
                <Link href="/adopt" className="btn btn-sm btn-primary" style={{ borderRadius: '100px' }}>
                  + New Application
                </Link>
              </div>

              {loading ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[1,2,3].map(i => (
                    <div key={i} className="skeleton" style={{ height: '72px', borderRadius: '12px' }} />
                  ))}
                </div>
              ) : apps.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px', animation: 'float 4s ease-in-out infinite' }}>🐾</div>
                  <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>No applications yet</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                    Ready to find your furever friend? Browse our adorable available pets and start your adoption journey!
                  </p>
                  <Link href="/adopt" className="btn btn-primary" style={{ borderRadius: '100px' }}>Browse Pets →</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {apps.slice(0, 5).map(app => {
                    const status = STATUS_LABELS[app.status] || STATUS_LABELS.submitted;
                    return (
                      <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', gap: '16px', flexWrap: 'wrap', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${status.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                            {status.icon}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                              {app.petInterest || app.type} Adoption
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge" style={{ background: `${status.color}15`, color: status.color }}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
              {[
                { icon: '🐕', title: 'Browse Dogs', desc: 'Find your perfect pup', href: '/adopt?type=dog' },
                { icon: '🐈', title: 'Browse Cats', desc: 'Find your purr-fect match', href: '/adopt?type=cat' },
                { icon: '📅', title: 'Book a Visit', desc: 'Meet our animals in person', href: '/contact' },
                { icon: '🤝', title: 'Volunteer', desc: 'Help us make a difference', href: '/volunteer' },
              ].map(action => (
                <Link key={action.title} href={action.href} className="card" style={{ padding: '24px', textDecoration: 'none', display: 'block' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{action.icon}</div>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>{action.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{action.desc}</div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>My Applications</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Track the status of all your adoption applications
                </p>
              </div>
              <Link href="/adopt" className="btn btn-primary btn-sm" style={{ borderRadius: '100px' }}>
                + New Application
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '100px' }} />)}
              </div>
            ) : apps.length === 0 ? (
              <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'float 4s ease-in-out infinite' }}>📋</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No applications yet</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 28px' }}>
                  When you apply to adopt a pet, your applications will appear here so you can track their progress.
                </p>
                <Link href="/adopt" className="btn btn-primary" style={{ borderRadius: '100px' }}>Browse Available Pets →</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {apps.map(app => {
                  const status = STATUS_LABELS[app.status] || STATUS_LABELS.submitted;
                  return (
                    <div key={app.id} className="card" style={{ padding: '24px', boxShadow: 'none', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${status.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                            {status.icon}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>{app.petInterest || app.type} Adoption</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                              Submitted {new Date(app.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        <span className="badge" style={{ background: `${status.color}15`, color: status.color, padding: '6px 16px' }}>
                          {status.label}
                        </span>
                      </div>
                      {/* Progress Pipeline */}
                      <div className="pipeline" style={{ margin: 0 }}>
                        {['submitted', 'reviewing', 'approved', 'visit-scheduled', 'adopted'].map(s => (
                          <div
                            key={s}
                            className={`pipeline-step ${app.status === s ? 'active' : Object.keys(STATUS_LABELS).indexOf(s) < Object.keys(STATUS_LABELS).indexOf(app.status) ? 'completed' : ''}`}
                            style={{ padding: '8px 14px', fontSize: '0.72rem' }}
                          >
                            {STATUS_LABELS[s]?.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Saved Pets</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Pets you&apos;ve loved — they&apos;re waiting for you!
              </p>
            </div>
            {favorites.length === 0 ? (
              <div className="favorites-empty">
                <div className="favorites-empty-icon">💕</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No saved pets yet</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 28px' }}>
                  When you tap the heart icon on a pet&apos;s profile, they&apos;ll be saved here so you can easily find them later.
                </p>
                <Link href="/adopt" className="btn btn-primary" style={{ borderRadius: '100px' }}>
                  ❤️ Browse & Save Pets
                </Link>
              </div>
            ) : (
              <div className="pet-grid">
                {/* This would render saved pet cards */}
                {favorites.map((petId, i) => (
                  <Link key={i} href={`/adopt/${petId}`} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🐾</div>
                    <div style={{ fontWeight: '600' }}>View Pet</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Visits Tab */}
        {activeTab === 'visits' && (
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Upcoming Visits</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Your scheduled visits to meet our animals
              </p>
            </div>
            {apps.filter(a => a.status === 'visit-scheduled').length === 0 ? (
              <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'float 4s ease-in-out infinite' }}>📅</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No visits scheduled</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 28px' }}>
                  Once your application is approved, we&apos;ll schedule a visit for you to meet your potential new family member. You can also contact us to arrange a visit!
                </p>
                <Link href="/contact" className="btn btn-primary" style={{ borderRadius: '100px' }}>
                  📞 Contact Us
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {apps.filter(a => a.status === 'visit-scheduled').map(app => (
                  <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#8B5CF620', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      📅
                    </div>
                    <div>
                      <div style={{ fontWeight: '700' }}>{app.petInterest || app.type} Visit</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Contact us for scheduling details
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Account Summary Footer */}
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue-500), var(--green-500))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem' }}>
              {initials}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Member since {memberSince}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/dashboard/profile" className="btn btn-ghost btn-sm">
              ⚙️ Settings
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ color: 'var(--rose-500)' }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <section style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <div className="container" style={{ display: 'grid', gap: '20px' }}>
          <div className="skeleton" style={{ height: '60px', borderRadius: '16px' }} />
          <div className="skeleton" style={{ height: '200px', borderRadius: '16px' }} />
          <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }} />
        </div>
      </section>
    }>
      <DashboardContent />
    </Suspense>
  );
}
