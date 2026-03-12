'use client';
import useScrollReveal from '@/components/effects/useScrollReveal';

export default function EventsPage() {
  useScrollReveal();
  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}><span className="text-gradient">Events</span> & Fundraisers</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Join us at upcoming events and help support our mission to save animal lives.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="grid-2 stagger">
            {[
              { title: 'Online 50/50 Raffle!', date: 'Ongoing', desc: 'Support the shelter and win big with our online 50/50 raffle. Tickets are available now — the jackpot keeps growing!', type: 'Fundraiser' },
              { title: 'Spring Adoption Event', date: 'April 2026', desc: 'Meet our adoptable animals in person at our special spring adoption event. Reduced adoption fees for the day!', type: 'Adoption' },
              { title: 'Paws in the Park', date: 'June 2026', desc: 'Join us at Bellevue Park for a day of fun, food, and furry friends. Dog-friendly activities, vendors, and more!', type: 'Community' },
              { title: 'Golf Tournament Fundraiser', date: 'July 2026', desc: 'Tee off for a great cause! Annual golf tournament with prizes, dinner, and silent auction.', type: 'Fundraiser' },
            ].map((event, i) => (
              <div key={i} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ height: '180px', background: 'linear-gradient(135deg, var(--blue-500), var(--blue-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', opacity: 0.8 }}>{event.type}</div>
                  </div>
                </div>
                <div className="card-body" style={{ padding: '24px' }}>
                  <span className="badge badge-blue" style={{ marginBottom: '8px', display: 'inline-block' }}>📅 {event.date}</span>
                  <h3 style={{ marginBottom: '8px' }}>{event.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.9rem' }}>{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
