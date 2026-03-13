'use client';
import { useState, useEffect } from 'react';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const EVENTS = [
  { title: 'Online 50/50 Raffle!', date: 'Ongoing', dateObj: null, desc: 'Support the shelter and win big with our online 50/50 raffle. Tickets are available now — the jackpot keeps growing!', type: 'Fundraiser', icon: 'trophy', color: 'var(--blue-500)', featured: false },
  { title: 'Spring Adoption Event', date: 'April 12, 2026', dateObj: '2026-04-12', desc: 'Meet our adoptable animals in person at our special spring adoption event. Reduced adoption fees for the day! Activities for the whole family including face painting, food trucks, and a pet photo booth.', type: 'Adoption', icon: 'paw', color: 'var(--green-500)', featured: true },
  { title: 'Paws in the Park', date: 'June 14, 2026', dateObj: '2026-06-14', desc: 'Join us at Bellevue Park for a day of fun, food, and furry friends. Dog-friendly activities, vendors, and more!', type: 'Community', icon: 'leaf', color: 'var(--blue-400)', featured: false },
  { title: 'Golf Tournament Fundraiser', date: 'July 18, 2026', dateObj: '2026-07-18', desc: 'Tee off for a great cause! Annual golf tournament with prizes, dinner, and silent auction.', type: 'Fundraiser', icon: 'star', color: 'var(--rose-400)', featured: false },
];

const PAST_EVENTS = [
  { title: 'Holiday Bake Sale', date: 'Dec 14, 2025', desc: 'Our community came together for a festive bake sale that raised $3,200 for shelter animals.', type: 'Fundraiser', raised: '$3,200' },
  { title: 'Fall Adoption Drive', date: 'Oct 18, 2025', desc: '22 animals found their forever homes during our record-breaking fall adoption drive!', type: 'Adoption', raised: '22 adoptions' },
  { title: 'Summer Dog Wash', date: 'Aug 9, 2025', desc: 'Over 80 dogs got pampered while their owners helped raise funds for the shelter.', type: 'Community', raised: '$1,800' },
];

function Countdown({ targetDate }) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0 });
  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return;
      setTime({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), mins: Math.floor((diff % 3600000) / 60000) });
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
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notified, setNotified] = useState(false);
  const [rsvps, setRsvps] = useState({});
  const [rsvpToast, setRsvpToast] = useState(null);

  const featuredEvent = EVENTS.find(e => e.featured);
  const otherEvents = EVENTS.filter(e => !e.featured);

  function handleRsvp(title) {
    setRsvps(prev => ({ ...prev, [title]: true }));
    setRsvpToast(title);
    setTimeout(() => setRsvpToast(null), 3000);
  }

  function handleNotify(e) {
    e.preventDefault();
    setNotified(true);
    setNotifyEmail('');
    setTimeout(() => setNotified(false), 4000);
  }

  return (
    <>
      {/* RSVP Toast */}
      {rsvpToast && (
        <div style={{
          position: 'fixed', top: '100px', right: '24px', zIndex: 9999,
          background: 'var(--green-500)', color: '#fff',
          padding: '14px 24px', borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', gap: '10px',
          fontWeight: 600, fontSize: '0.9rem',
          boxShadow: '0 8px 30px rgba(16,185,129,0.3)',
          animation: 'authAlertSlide 0.3s ease',
        }}>
          <Icon name="check" size={16} color="#fff" />
          You're RSVP'd for {rsvpToast}!
        </div>
      )}

      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="calendar" size={14} color="var(--blue-700)" /> Get Involved
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}><span className="text-gradient">Events</span> & Fundraisers</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Join us at upcoming events and help support our mission to save animal lives.
          </p>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <section className="section" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <div className="card card-3d reveal" style={{ overflow: 'hidden', position: 'relative' }}>
              <div style={{
                position: 'absolute', top: '16px', right: '16px', zIndex: 2,
                padding: '4px 14px', borderRadius: '100px',
                background: featuredEvent.color, color: '#fff', fontSize: '0.7rem',
                fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <Icon name="star" size={10} color="#fff" /> Featured Event
              </div>
              <div style={{ height: '6px', background: `linear-gradient(90deg, ${featuredEvent.color}, var(--blue-400))` }} />
              <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <IconCircle name={featuredEvent.icon} size={56} color={featuredEvent.color} bgOpacity={0.15} />
                    <div>
                      <span className="badge badge-outline" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>{featuredEvent.type}</span>
                      <h2 style={{ fontSize: '1.5rem' }}>{featuredEvent.title}</h2>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.95rem', marginBottom: '20px' }}>
                    {featuredEvent.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Icon name="calendar" size={14} color="var(--text-muted)" /> {featuredEvent.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Icon name="location" size={14} color="var(--text-muted)" /> 962 Second Line East, SSM
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  {featuredEvent.dateObj && <Countdown targetDate={featuredEvent.dateObj} />}
                  <button className="btn btn-primary btn-lg" onClick={() => handleRsvp(featuredEvent.title)} disabled={rsvps[featuredEvent.title]} style={{
                    marginTop: '20px', width: '100%', borderRadius: 'var(--radius-lg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    background: rsvps[featuredEvent.title] ? 'var(--green-500)' : featuredEvent.color,
                  }}>
                    <Icon name="check" size={16} color="#fff" /> {rsvps[featuredEvent.title] ? '✓ You\'re Going!' : 'RSVP — I\'ll Be There!'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="reveal" style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icon name="calendar" size={22} color="var(--text-accent)" /> Upcoming Events
          </h2>
          <div className="timeline reveal">
            {otherEvents.map((event, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-date">{event.date}</div>
                <div className="card card-3d" style={{ overflow: 'hidden' }}>
                  <div style={{ height: '6px', background: event.color }} />
                  <div className="card-body" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <IconCircle name={event.icon} size={48} color={event.color} bgOpacity={0.15} />
                      <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{event.title}</h3>
                        <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>{event.type}</span>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.9rem', marginBottom: '16px' }}>{event.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      {event.dateObj && <Countdown targetDate={event.dateObj} />}
                      {!event.dateObj && (
                        <div style={{ padding: '8px 16px', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--green-600)', fontWeight: 600 }}>
                          <Icon name="check" size={14} color="var(--green-600)" /> Happening Now
                        </div>
                      )}
                      <button className="btn btn-sm btn-secondary" onClick={() => handleRsvp(event.title)} disabled={rsvps[event.title]} style={{
                        borderRadius: 'var(--radius-md)', marginLeft: 'auto',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        ...(rsvps[event.title] ? { background: 'var(--green-50)', color: 'var(--green-700)', borderColor: 'var(--green-200)' } : {}),
                      }}>
                        <Icon name={rsvps[event.title] ? 'check' : 'calendar'} size={14} /> {rsvps[event.title] ? 'Going!' : 'RSVP'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="reveal" style={{ marginBottom: '8px' }}>Past <span className="text-gradient">Events</span></h2>
          <p className="reveal" style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '0.9rem' }}>
            A look back at what our community has accomplished together.
          </p>
          <div className="grid-3 stagger">
            {PAST_EVENTS.map((event, i) => (
              <div key={i} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>{event.type}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.date}</span>
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{event.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '12px' }}>{event.desc}</p>
                <div style={{
                  padding: '8px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)',
                  display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem',
                  color: 'var(--green-600)', fontWeight: 700,
                }}>
                  <Icon name="trophy" size={12} color="var(--green-600)" /> {event.raised}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Notified CTA */}
      <section className="section section-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ maxWidth: '600px', position: 'relative' }}>
          <IconCircle name="mail" size={56} color="var(--blue-400)" bgOpacity={0.15} style={{ margin: '0 auto 20px' }} />
          <h2 className="reveal" style={{ marginBottom: '12px' }}>Never Miss an <span style={{ color: 'var(--blue-400)' }}>Event</span></h2>
          <p className="reveal" style={{ color: '#94A3B8', marginBottom: '28px', lineHeight: '1.7' }}>
            Get notified about upcoming events, adoption drives, and fundraisers.
          </p>
          <form onSubmit={handleNotify} className="reveal">
            <div style={{ display: 'flex', gap: '10px', maxWidth: '450px', margin: '0 auto' }}>
              <input
                type="email" required placeholder="Your email address..."
                value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)}
                style={{
                  flex: 1, padding: '14px 20px', borderRadius: '100px',
                  border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
                  color: '#fff', fontSize: '0.9rem', outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '100px', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="mail" size={14} color="#fff" /> {notified ? 'Done!' : 'Notify Me'}
              </button>
            </div>
            {notified && (
              <p style={{ color: 'var(--green-400)', marginTop: '12px', fontSize: '0.85rem', animation: 'fadeInUp 0.4s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Icon name="check" size={14} color="var(--green-400)" /> You&apos;ll be notified about future events!
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
