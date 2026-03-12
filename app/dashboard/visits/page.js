'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MOCK_VISITS = [
  {
    id: '1', petName: 'Luna', petBreed: 'Domestic Shorthair', petEmoji: '🐱',
    date: '2026-03-15', time: '10:00 AM', status: 'confirmed',
    location: 'SSM Humane Society - Cat Wing', notes: 'Please arrive 10 minutes early.',
  },
  {
    id: '2', petName: 'Buddy', petBreed: 'Labrador Mix', petEmoji: '🐕',
    date: '2026-03-18', time: '2:00 PM', status: 'pending',
    location: 'SSM Humane Society - Dog Yard', notes: 'Weather permitting. Indoor alternative available.',
  },
];

const STATUS_MAP = {
  confirmed: { label: 'Confirmed', color: 'var(--green-500)', icon: '✅' },
  pending: { label: 'Pending', color: '#F59E0B', icon: '⏳' },
  completed: { label: 'Completed', color: 'var(--blue-500)', icon: '🎉' },
  cancelled: { label: 'Cancelled', color: 'var(--rose-500)', icon: '❌' },
};

export default function VisitsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/auth/login'); return; }
    setUser(JSON.parse(u));
  }, [router]);

  if (!user) return null;

  return (
    <section style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontWeight: '600' }}>Visits</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>📅 My Visits</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Scheduled visits to meet your potential new family members</p>
          </div>
          <Link href="/contact" className="btn btn-primary btn-sm" style={{ borderRadius: '100px' }}>
            📞 Schedule a Visit
          </Link>
        </div>

        {/* Upcoming Visits */}
        {MOCK_VISITS.length > 0 ? (
          <>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', fontWeight: '700' }}>Upcoming</h2>
            <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
              {MOCK_VISITS.map(visit => {
                const st = STATUS_MAP[visit.status] || STATUS_MAP.pending;
                const d = new Date(visit.date);
                const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
                const dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

                return (
                  <div key={visit.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: '0' }}>
                      {/* Date Side */}
                      <div style={{
                        background: 'linear-gradient(135deg, var(--blue-500), var(--green-500))',
                        color: '#fff', padding: '24px 28px', minWidth: '120px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
                          {d.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1 }}>
                          {d.getDate()}
                        </div>
                        <div style={{ fontSize: '0.72rem', fontWeight: '500', opacity: 0.8, marginTop: '2px' }}>
                          {dayName}
                        </div>
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1, padding: '24px 28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {visit.petEmoji} Meet {visit.petName}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{visit.petBreed}</div>
                          </div>
                          <span className="badge" style={{ background: `${st.color}15`, color: st.color }}>
                            {st.icon} {st.label}
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '0.88rem' }}>
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Time</div>
                            <div style={{ fontWeight: '600' }}>🕐 {visit.time}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Location</div>
                            <div style={{ fontWeight: '600' }}>📍 {visit.location}</div>
                          </div>
                        </div>

                        {visit.notes && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                            💡 {visit.notes}
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-primary btn-sm" style={{ borderRadius: '100px' }}>
                            📍 Get Directions
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ borderRadius: '100px' }}>
                            📅 Add to Calendar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tips Card */}
            <div className="card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(59,130,246,0.04), rgba(16,185,129,0.04))' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px' }}>📋 Visit Day Tips</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {[
                  { icon: '⏰', tip: 'Arrive 10 minutes early to complete paperwork' },
                  { icon: '👨‍👩‍👧', tip: 'Bring all household members who will interact with the pet' },
                  { icon: '🐕', tip: 'If you have other pets, let us know for a meet & greet' },
                  { icon: '❓', tip: 'Prepare a list of questions about the pet\'s care' },
                ].map(t => (
                  <div key={t.tip} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.85rem' }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{t.icon}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{t.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="card" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'float 4s ease-in-out infinite' }}>📅</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No visits scheduled</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 28px' }}>
              Once your application is approved, we&apos;ll schedule a visit for you. You can also contact us to arrange one!
            </p>
            <Link href="/contact" className="btn btn-primary" style={{ borderRadius: '100px' }}>📞 Contact Us</Link>
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm">← Back to Dashboard</Link>
        </div>
      </div>
    </section>
  );
}
