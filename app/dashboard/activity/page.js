'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon, { IconCircle } from '@/components/ui/Icon';

const MOCK_ACTIVITY = [
  // Today
  { id: 1, icon: '📅', color: 'var(--blue-500)', title: 'Visit Scheduled', desc: 'Meeting Luna on Saturday at 10:00 AM at the shelter.', time: 'Just now', type: 'visit', group: 'Today' },
  { id: 2, icon: '✉️', color: 'var(--green-500)', title: 'Message Received', desc: 'Staff replied to your adoption inquiry about Luna.', time: '15 min ago', type: 'message', group: 'Today' },
  { id: 3, icon: '❤️', color: 'var(--rose-500)', title: 'Saved Bella to Favorites', desc: 'Golden Retriever Mix · 4 years old · Female', time: '1 hour ago', type: 'favorite', group: 'Today' },
  { id: 4, icon: '🐾', color: 'var(--blue-400)', title: 'Browsed Adoption Gallery', desc: 'You viewed 8 available pets in the adoption gallery.', time: '2 hours ago', type: 'browse', group: 'Today' },
  // Yesterday
  { id: 5, icon: '📝', color: '#F59E0B', title: 'Application Status Updated', desc: 'Application for Luna moved to: Interview Stage', time: 'Yesterday, 3:30 PM', type: 'application', group: 'Yesterday' },
  { id: 6, icon: '🌟', color: 'var(--green-500)', title: 'Completed Pet Match Quiz', desc: 'Your top match: Luna with 92% compatibility!', time: 'Yesterday, 2:00 PM', type: 'quiz', group: 'Yesterday' },
  { id: 7, icon: '❤️', color: 'var(--rose-500)', title: 'Saved Luna to Favorites', desc: 'Domestic Shorthair · 2 years old · Female', time: 'Yesterday, 1:45 PM', type: 'favorite', group: 'Yesterday' },
  { id: 8, icon: '❤️', color: 'var(--rose-500)', title: 'Saved Buddy to Favorites', desc: 'Labrador Mix · 3 years old · Male', time: 'Yesterday, 1:30 PM', type: 'favorite', group: 'Yesterday' },
  // This Week
  { id: 9, icon: '📝', color: '#F59E0B', title: 'Submitted Adoption Application', desc: 'Application for Luna · Status: Under Review', time: 'Monday, 10:00 AM', type: 'application', group: 'This Week' },
  { id: 10, icon: '🔔', color: '#8B5CF6', title: 'Enabled Notifications', desc: 'You\'ll now receive updates about new pets and application status.', time: 'Monday, 9:45 AM', type: 'settings', group: 'This Week' },
  { id: 11, icon: '👤', color: 'var(--blue-500)', title: 'Updated Profile', desc: 'Added phone number and pet preferences.', time: 'Sunday, 4:00 PM', type: 'profile', group: 'This Week' },
  // Earlier
  { id: 12, icon: '🎉', color: 'var(--green-500)', title: 'Account Created', desc: 'Welcome to SSM Humane Society! Your journey begins.', time: 'Last Saturday', type: 'account', group: 'Earlier' },
  { id: 13, icon: '✉️', color: 'var(--blue-500)', title: 'Email Verified', desc: 'Your email address has been successfully verified.', time: 'Last Saturday', type: 'account', group: 'Earlier' },
];

const FILTERS = [
  { id: 'all', label: 'All', icon: 'book' },
  { id: 'application', label: 'Applications', icon: 'edit' },
  { id: 'favorite', label: 'Favorites', icon: 'heart' },
  { id: 'message', label: 'Messages', icon: 'mail' },
  { id: 'visit', label: 'Visits', icon: 'calendar' },
  { id: 'account', label: 'Account', icon: 'lock' },
];

export default function ActivityPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/auth/login'); return; }
    setUser(JSON.parse(u));
  }, [router]);

  if (!user) return null;

  const filtered = MOCK_ACTIVITY.filter(a => {
    if (filter !== 'all' && a.type !== filter) return false;
    if (searchQ) return a.title.toLowerCase().includes(searchQ.toLowerCase()) || a.desc.toLowerCase().includes(searchQ.toLowerCase());
    return true;
  });

  const groups = [...new Set(filtered.map(a => a.group))];

  const stats = [
    { label: 'Total Actions', value: MOCK_ACTIVITY.length, icon: 'book', color: 'var(--blue-500)' },
    { label: 'This Week', value: MOCK_ACTIVITY.filter(a => a.group !== 'Earlier').length, icon: 'calendar', color: 'var(--green-500)' },
    { label: 'Favorites', value: MOCK_ACTIVITY.filter(a => a.type === 'favorite').length, icon: 'heart', color: 'var(--rose-400)' },
    { label: 'Applications', value: MOCK_ACTIVITY.filter(a => a.type === 'application').length, icon: 'edit', color: '#F59E0B' },
  ];

  return (
    <section style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontWeight: '600' }}>Activity</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Activity Timeline</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Everything you&apos;ve done on your adoption journey
            </p>
          </div>
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Icon name="search" size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="form-input" placeholder="Search activity..."
              value={searchQ} onChange={e => setSearchQ(e.target.value)}
              style={{ paddingLeft: '34px', fontSize: '0.85rem', borderRadius: 'var(--radius-lg)' }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <IconCircle name={s.icon} size={40} color={s.color} bgOpacity={0.12} />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
          {FILTERS.map(f => {
            const count = f.id === 'all' ? MOCK_ACTIVITY.length : MOCK_ACTIVITY.filter(a => a.type === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '8px 16px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                  background: filter === f.id ? 'linear-gradient(135deg, var(--blue-500), var(--blue-600))' : 'var(--bg-secondary)',
                  color: filter === f.id ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                  boxShadow: filter === f.id ? '0 2px 8px rgba(41,171,226,0.3)' : 'none',
                }}
              >
                <Icon name={f.icon} size={14} color={filter === f.id ? '#fff' : 'var(--text-muted)'} />
                {f.label}
                <span style={{
                  padding: '0 6px', borderRadius: '100px', fontSize: '0.72rem',
                  background: filter === f.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-card)',
                }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Grouped Timeline */}
        <div className="card" style={{ padding: '32px 32px 32px 48px' }}>
          {groups.map(group => (
            <div key={group} style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                color: 'var(--text-muted)', marginBottom: '14px', paddingBottom: '8px',
                borderBottom: '1px solid var(--border-light)',
              }}>{group}</div>
              <div className="activity-timeline">
                {filtered.filter(a => a.group === group).map((item, i) => (
                  <div key={item.id} className="activity-item" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="activity-dot" style={{ background: item.color }}>
                      <span style={{ fontSize: '0.7rem' }}>{item.icon}</span>
                    </div>
                    <div className="activity-content" style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div>
                          <div className="activity-title">{item.title}</div>
                          <div className="activity-desc">{item.desc}</div>
                        </div>
                        <div className="activity-time" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{item.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>No activity found</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {searchQ ? 'Try a different search term.' : 'Try selecting a different filter above.'}
              </div>
            </div>
          )}
        </div>

        {/* Back link */}
        <div style={{ marginTop: '24px' }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="arrow" size={14} style={{ transform: 'rotate(180deg)' }} /> Back to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
