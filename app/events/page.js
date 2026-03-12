'use client';
import { useState, useEffect } from 'react';
import useScrollReveal from '@/components/effects/useScrollReveal';

const EVENTS = [
  { title: 'Online 50/50 Raffle!', date: 'Ongoing', dateObj: null, desc: 'Support the shelter and win big with our online 50/50 raffle. Tickets are available now — the jackpot keeps growing!', type: 'Fundraiser', icon: '🎰', color: 'var(--blue-500)' },
  { title: 'Spring Adoption Event', date: 'April 12, 2026', dateObj: '2026-04-12', desc: 'Meet our adoptable animals in person at our special spring adoption event. Reduced adoption fees for the day!', type: 'Adoption', icon: '🐾', color: 'var(--green-500)' },
  { title: 'Paws in the Park', date: 'June 14, 2026', dateObj: '2026-06-14', desc: 'Join us at Bellevue Park for a day of fun, food, and furry friends. Dog-friendly activities, vendors, and more!', type: 'Community', icon: '🌳', color: 'var(--blue-400)' },
  { title: 'Golf Tournament Fundraiser', date: 'July 18, 2026', dateObj: '2026-07-18', desc: 'Tee off for a great cause! Annual golf tournament with prizes, dinner, and silent auction.', type: 'Fundraiser', icon: '⛳', color: 'var(--rose-400)' },
];

function Countdown({ targetDate }) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0 });
  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
      });
    }
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <div className="countdown">
      {[['days', time.days], ['hours', time.hours], ['mins', time.mins]].map(([label, val]) => (
        <div key={label} className="countdown-unit">
          <div className="countdown-number">{val}</div>
          <div className="countdown-label">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function EventsPage() {
  useScrollReveal();
  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>🎉 Get Involved</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}><span className="text-gradient">Events</span> & Fundraisers</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Join us at upcoming events and help support our mission to save animal lives.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Timeline layout */}
          <div className="timeline reveal">
            {EVENTS.map((event, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-date">{event.date}</div>
                <div className="card card-3d" style={{ overflow: 'hidden' }}>
                  <div style={{ height: '6px', background: event.color }} />
                  <div className="card-body" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '2rem' }}>{event.icon}</span>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{event.title}</h3>
                        <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>{event.type}</span>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.9rem', marginBottom: '16px' }}>{event.desc}</p>
                    {event.dateObj && <Countdown targetDate={event.dateObj} />}
                    {!event.dateObj && <div style={{ padding: '8px 16px', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)', display: 'inline-block', fontSize: '0.85rem', color: 'var(--green-600)', fontWeight: 600 }}>🟢 Happening Now</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
