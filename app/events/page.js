'use client';
import { useState, useEffect } from 'react';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const EVENTS = [
  { title: 'Online 50/50 Raffle!', date: 'Ongoing', dateObj: null, desc: 'Support the shelter and win big with our online 50/50 raffle. Tickets are available now — the jackpot keeps growing!', type: 'Fundraiser', icon: 'trophy', color: 'var(--blue-500)', featured: false, location: 'Online', spots: null },
  { title: 'Spring Adoption Event', date: 'April 12, 2026', dateObj: '2026-04-12', desc: 'Meet our adoptable animals in person at our special spring adoption event. Reduced adoption fees for the day! Activities for the whole family including face painting, food trucks, and a pet photo booth.', type: 'Adoption', icon: 'paw', color: 'var(--green-500)', featured: true, location: '962 Second Line East, SSM', spots: 200 },
  { title: 'Paws in the Park', date: 'June 14, 2026', dateObj: '2026-06-14', desc: 'Join us at Bellevue Park for a day of fun, food, and furry friends. Dog-friendly activities, vendors, and more!', type: 'Community', icon: 'leaf', color: 'var(--blue-400)', featured: false, location: 'Bellevue Park, SSM', spots: 500 },
  { title: 'Golf Tournament Fundraiser', date: 'July 18, 2026', dateObj: '2026-07-18', desc: 'Tee off for a great cause! Annual golf tournament with prizes, dinner, and silent auction.', type: 'Fundraiser', icon: 'star', color: 'var(--rose-400)', featured: false, location: 'Sault Golf Club', spots: 72 },
  { title: 'Volunteer Appreciation BBQ', date: 'August 2, 2026', dateObj: '2026-08-02', desc: 'Celebrating our incredible volunteers with a summer BBQ, awards, and fun. All current and past volunteers welcome!', type: 'Volunteer', icon: 'people', color: '#8B5CF6', featured: false, location: 'Shelter Grounds', spots: 150 },
  { title: 'Kitten Shower', date: 'May 10, 2026', dateObj: '2026-05-10', desc: 'Help us prepare for kitten season! Bring supplies from our wishlist and cuddle some kittens. Refreshments provided!', type: 'Community', icon: 'heart', color: 'var(--rose-500)', featured: false, location: 'SSM Humane Society', spots: 80 },
];

const PAST_EVENTS = [
  { title: 'Holiday Bake Sale', date: 'Dec 14, 2025', desc: 'Our community came together for a festive bake sale that raised $3,200 for shelter animals.', type: 'Fundraiser', raised: '$3,200', attendees: 180 },
  { title: 'Fall Adoption Drive', date: 'Oct 18, 2025', desc: '22 animals found their forever homes during our record-breaking fall adoption drive!', type: 'Adoption', raised: '22 adoptions', attendees: 340 },
  { title: 'Summer Dog Wash', date: 'Aug 9, 2025', desc: 'Over 80 dogs got pampered while their owners helped raise funds for the shelter.', type: 'Community', raised: '$1,800', attendees: 120 },
  { title: 'Charity Trivia Night', date: 'Sep 20, 2025', desc: 'Teams competed in a night of trivia, laughs, and friendly competition for a great cause.', type: 'Fundraiser', raised: '$2,400', attendees: 96 },
  { title: 'Pet First Aid Workshop', date: 'Jul 12, 2025', desc: 'Community members learned essential pet first aid skills from our veterinary staff.', type: 'Education', raised: 'Free event', attendees: 45 },
];

const EVENT_TYPES = ['All', 'Adoption', 'Fundraiser', 'Community', 'Volunteer', 'Education'];

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
  const [typeFilter, setTypeFilter] = useState('All');

  const featuredEvent = EVENTS.find(e => e.featured);
  const otherEvents = EVENTS.filter(e => !e.featured);
  const filteredEvents = typeFilter === 'All' ? otherEvents : otherEvents.filter(e => e.type === typeFilter);
  const filteredPast = typeFilter === 'All' ? PAST_EVENTS : PAST_EVENTS.filter(e => e.type === typeFilter);

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
          You&apos;re RSVP&apos;d for {rsvpToast}!
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

      {/* Community Impact Stats */}
      <section style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div className="container glass" style={{
          display: 'flex', justifyContent: 'space-around', padding: '28px 32px',
          flexWrap: 'wrap', gap: '20px', borderRadius: 'var(--radius-xl)',
          maxWidth: '800px', margin: '0 auto', position: 'relative', top: '-28px',
        }}>
          {[
            { target: 24, label: 'Events This Year', icon: 'calendar', color: 'var(--blue-500)' },
            { target: 2800, label: 'Community Members', icon: 'people', color: 'var(--green-500)' },
            { target: 47000, label: 'Raised in 2025', prefix: '$', icon: 'trophy', color: '#F59E0B' },
            { target: 156, label: 'Animals Helped', icon: 'paw', color: 'var(--rose-400)' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>
                {stat.prefix || ''}<AnimatedCounter target={stat.target} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && typeFilter === 'All' && (
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Icon name="calendar" size={14} color="var(--text-muted)" /> {featuredEvent.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Icon name="location" size={14} color="var(--text-muted)" /> {featuredEvent.location}
                    </span>
                    {featuredEvent.spots && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <Icon name="people" size={14} color="var(--text-muted)" /> {featuredEvent.spots} spots available
                      </span>
                    )}
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

      {/* Type Filters */}
      <section style={{ paddingTop: '20px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="reveal" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            {EVENT_TYPES.map(type => {
              const count = type === 'All' ? otherEvents.length : otherEvents.filter(e => e.type === type).length;
              return (
                <button key={type} onClick={() => setTypeFilter(type)} style={{
                  padding: '8px 16px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                  background: typeFilter === type ? 'linear-gradient(135deg, var(--blue-500), var(--blue-600))' : 'var(--bg-secondary)',
                  color: typeFilter === type ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit', transition: 'all 0.2s ease',
                  boxShadow: typeFilter === type ? '0 2px 8px rgba(41,171,226,0.3)' : 'none',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}>
                  {type}
                  {count > 0 && <span style={{ padding: '0 6px', borderRadius: '100px', fontSize: '0.72rem', background: typeFilter === type ? 'rgba(255,255,255,0.2)' : 'var(--bg-card)' }}>{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="reveal" style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icon name="calendar" size={22} color="var(--text-accent)" /> Upcoming Events
          </h2>
          {filteredEvents.length === 0 ? (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📅</div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>No upcoming events in this category</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Try selecting &ldquo;All&rdquo; to see all events.</div>
            </div>
          ) : (
            <div className="timeline reveal">
              {filteredEvents.map((event, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-date">{event.date}</div>
                  <div className="card card-3d" style={{ overflow: 'hidden' }}>
                    <div style={{ height: '6px', background: event.color }} />
                    <div className="card-body" style={{ padding: '28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <IconCircle name={event.icon} size={48} color={event.color} bgOpacity={0.15} />
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{event.title}</h3>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>{event.type}</span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Icon name="location" size={12} color="var(--text-muted)" /> {event.location}
                            </span>
                          </div>
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
                        {event.spots && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon name="people" size={12} color="var(--text-muted)" /> {event.spots} spots
                          </span>
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
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="reveal" style={{ marginBottom: '8px' }}>Past <span className="text-gradient">Events</span></h2>
          <p className="reveal" style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '0.9rem' }}>
            A look back at what our community has accomplished together.
          </p>
          {filteredPast.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No past events in this category.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }} className="stagger">
              {filteredPast.map((event, i) => (
                <div key={i} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>{event.type}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{event.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '12px' }}>{event.desc}</p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{
                      padding: '6px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)',
                      display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem',
                      color: 'var(--green-600)', fontWeight: 700,
                    }}>
                      <Icon name="trophy" size={12} color="var(--green-600)" /> {event.raised}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icon name="people" size={12} color="var(--text-muted)" /> {event.attendees} attended
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Host Your Own Event */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="grid-2 reveal" style={{ gap: '24px', alignItems: 'center' }}>
            <div>
              <IconCircle name="star" size={56} color="#F59E0B" bgOpacity={0.15} style={{ marginBottom: '16px' }} />
              <h2 style={{ marginBottom: '12px' }}>Host a <span className="text-gradient">Fundraiser</span></h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>
                Want to organize an event for the shelter? Whether it&apos;s a bake sale, car wash, or birthday fundraiser — we&apos;d love your support!
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['We provide promotional materials', 'Tax receipts for all donations', 'Social media promotion included', 'Staff support available'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <Icon name="check" size={14} color="var(--green-500)" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎪</div>
              <h3 style={{ marginBottom: '8px' }}>Get Started</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                Contact us to discuss your event idea and how we can help make it a success.
              </p>
              <a href="mailto:events@ssmhumanesociety.ca" className="btn btn-primary" style={{ borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
                <Icon name="mail" size={16} color="#fff" /> Contact Events Team
              </a>
            </div>
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
