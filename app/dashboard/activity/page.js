'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MOCK_ACTIVITY = [
  { id: 1, icon: '🎉', color: 'var(--green-500)', title: 'Account Created', desc: 'Welcome to SSM Humane Society! Your journey begins.', time: 'Just now', type: 'account' },
  { id: 2, icon: '✉️', color: 'var(--blue-500)', title: 'Email Verified', desc: 'Your email address has been successfully verified.', time: '5 min ago', type: 'account' },
  { id: 3, icon: '🐾', color: 'var(--blue-400)', title: 'Browsed Adoption Gallery', desc: 'You viewed 12 available pets in the adoption gallery.', time: '15 min ago', type: 'browse' },
  { id: 4, icon: '❤️', color: 'var(--rose-500)', title: 'Saved Luna to Favorites', desc: 'Domestic Shorthair · 2 years old · Female', time: '20 min ago', type: 'favorite' },
  { id: 5, icon: '❤️', color: 'var(--rose-500)', title: 'Saved Buddy to Favorites', desc: 'Labrador Mix · 3 years old · Male', time: '22 min ago', type: 'favorite' },
  { id: 6, icon: '📝', color: '#F59E0B', title: 'Submitted Adoption Application', desc: 'Application for Luna · Status: Under Review', time: '30 min ago', type: 'application' },
  { id: 7, icon: '🔔', color: '#8B5CF6', title: 'Enabled Notifications', desc: 'You\'ll now receive updates about new pets and application status.', time: '35 min ago', type: 'settings' },
  { id: 8, icon: '🌟', color: 'var(--green-500)', title: 'Completed Pet Match Quiz', desc: 'Your top match: Luna with 92% compatibility!', time: '1 hour ago', type: 'quiz' },
  { id: 9, icon: '👤', color: 'var(--blue-500)', title: 'Updated Profile', desc: 'Added phone number and pet preferences.', time: '2 hours ago', type: 'profile' },
  { id: 10, icon: '📅', color: '#8B5CF6', title: 'Visit Scheduled', desc: 'Meeting Luna on Saturday at 10:00 AM.', time: '3 hours ago', type: 'visit' },
];

const FILTERS = [
  { id: 'all', label: 'All Activity', icon: '📊' },
  { id: 'application', label: 'Applications', icon: '📝' },
  { id: 'favorite', label: 'Favorites', icon: '❤️' },
  { id: 'account', label: 'Account', icon: '👤' },
];

export default function ActivityPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/auth/login'); return; }
    setUser(JSON.parse(u));
  }, [router]);

  if (!user) return null;

  const filtered = filter === 'all' ? MOCK_ACTIVITY : MOCK_ACTIVITY.filter(a => a.type === filter);

  return (
    <section style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontWeight: '600' }}>Activity</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Activity Timeline</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Everything you&apos;ve done on your adoption journey
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={filter === f.id ? 'pet-filter-btn active' : 'pet-filter-btn'}
              onClick={() => setFilter(f.id)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="card" style={{ padding: '32px 32px 32px 48px' }}>
          <div className="activity-timeline">
            {filtered.map((item, i) => (
              <div key={item.id} className="activity-item" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="activity-dot" style={{ background: item.color }}>
                  <span style={{ fontSize: '0.7rem' }}>{item.icon}</span>
                </div>
                <div className="activity-content">
                  <div className="activity-title">{item.title}</div>
                  <div className="activity-desc">{item.desc}</div>
                  <div className="activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>No activity in this category</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Try selecting a different filter above.
              </div>
            </div>
          )}
        </div>

        {/* Back link */}
        <div style={{ marginTop: '24px' }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm">← Back to Dashboard</Link>
        </div>
      </div>
    </section>
  );
}
