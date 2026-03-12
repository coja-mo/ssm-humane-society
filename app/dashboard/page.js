'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const STATUS_LABELS = {
  submitted: { label: 'Submitted', color: 'var(--blue-500)', icon: '📝' },
  reviewing: { label: 'Under Review', color: '#F59E0B', icon: '🔍' },
  approved: { label: 'Approved', color: 'var(--green-500)', icon: '✅' },
  'visit-scheduled': { label: 'Visit Scheduled', color: '#8B5CF6', icon: '📅' },
  adopted: { label: 'Adopted!', color: '#EC4899', icon: '🏠' },
  rejected: { label: 'Not Approved', color: 'var(--rose-500)', icon: '❌' },
};

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    fetch('/api/applications').then(r => r.json()).then(data => {
      setApps(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (!user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px', flexDirection: 'column' }}>
        <h2>Please sign in to view your dashboard</h2>
        <Link href="/auth/login" className="btn btn-primary" style={{ marginTop: '16px' }}>Sign In</Link>
      </div>
    );
  }

  return (
    <section style={{ paddingTop: '120px', minHeight: '100vh' }}>
      <div className="container">
        <div className="dashboard-header">
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
            Welcome back, <span className="text-gradient">{user.name || 'Friend'}</span>! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your adoption journey from here.</p>
        </div>

        {/* Quick Links */}
        <div className="stats-grid" style={{ marginBottom: '40px' }}>
          {[
            { icon: '📝', label: 'My Applications', count: apps.length, href: '/dashboard/applications', color: 'var(--blue-500)' },
            { icon: '❤️', label: 'Saved Pets', count: 0, href: '/dashboard/favorites', color: 'var(--rose-500)' },
            { icon: '📅', label: 'Upcoming Visits', count: apps.filter(a => a.status === 'visit-scheduled').length, href: '/dashboard/visits', color: '#8B5CF6' },
            { icon: '🐾', label: 'Browse Pets', count: '41', href: '/adopt', color: 'var(--green-500)' },
          ].map(item => (
            <Link key={item.label} href={item.href} className="stat-card" style={{ textDecoration: 'none', transition: 'all 0.3s', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-card-value" style={{ color: item.color }}>{item.count}</div>
                  <div className="stat-card-label">{item.label}</div>
                </div>
                <div style={{ fontSize: '2rem' }}>{item.icon}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.3rem' }}>Recent Applications</h2>
            <Link href="/adopt" className="btn btn-sm btn-primary">+ New Application</Link>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : apps.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🐾</div>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>No applications yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Ready to find your furever friend? Browse our available pets!</p>
              <Link href="/adopt" className="btn btn-primary">Browse Pets →</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {apps.slice(0, 5).map(app => {
                const status = STATUS_LABELS[app.status] || STATUS_LABELS.submitted;
                return (
                  <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {status.icon} {app.petInterest || app.type} Adoption
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Submitted {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="pipeline" style={{ margin: 0 }}>
                      {['submitted', 'reviewing', 'approved', 'visit-scheduled', 'adopted'].map(s => (
                        <div key={s} className={`pipeline-step ${app.status === s ? 'active' : Object.keys(STATUS_LABELS).indexOf(s) < Object.keys(STATUS_LABELS).indexOf(app.status) ? 'completed' : ''}`} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
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
      </div>
    </section>
  );
}
