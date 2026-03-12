'use client';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';

export default function AboutPage() {
  useScrollReveal();
  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '60px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>🐾 About Us</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '16px' }}>
            Saving Lives <span className="text-gradient">Since 1978</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8', fontSize: '1.05rem' }}>
            The Sault Ste. Marie Humane Society is committed to improving the lives of animals through rescue, adoption, and education. We are a registered charity serving the Algoma District.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '64px' }}>
            <div className="reveal-left">
              <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Our <span className="text-gradient">Mission</span></h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                We exist to protect and improve the lives of animals in our community. Through rescue operations, adoption services, foster programs, and community education, we work tirelessly to ensure every animal has the chance to live a happy, healthy life.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                Our shelter at 962 Second Line East houses over 100 animals on any given day. We rely on the generosity of our community — every donation, volunteer hour, and adoption makes a real difference.
              </p>
            </div>
            <div className="reveal-right" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { n: 1847, label: 'Pets Adopted', icon: '🏠' },
                { n: 250, label: 'Volunteers', icon: '🤝', suffix: '+' },
                { n: 45, label: 'Years Serving SSM', icon: '📅', suffix: '+' },
                { n: 100, label: 'Animals in Care', icon: '🐾', suffix: '+' },
              ].map(s => (
                <div key={s.label} className="card" style={{ textAlign: 'center', padding: '24px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-accent)' }}>
                    <AnimatedCounter target={s.n} suffix={s.suffix || ''} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <h2 className="text-center reveal" style={{ fontSize: '2rem', marginBottom: '40px' }}>What <span style={{ color: 'var(--blue-400)' }}>We Do</span></h2>
          <div className="grid-3 stagger">
            {[
              { icon: '🏥', title: 'Rescue & Shelter', desc: 'We provide a safe haven for abandoned, surrendered, and stray animals. Our team assesses each animal\'s needs and provides appropriate care.' },
              { icon: '🏠', title: 'Adoption Services', desc: 'Our application-based adoption process helps match pets with the right families. We ensure every adoption is a success through careful screening.' },
              { icon: '❤️', title: 'Foster Program', desc: 'Our foster network provides temporary homes for animals who need extra care. Foster parents play a critical role in our mission.' },
              { icon: '📚', title: 'Community Education', desc: 'We educate the public on responsible pet ownership, animal welfare, and the importance of spaying/neutering.' },
              { icon: '🏥', title: 'Medical Care', desc: 'Every animal receives veterinary exams, vaccinations, spay/neuter surgery, and any necessary medical treatment.' },
              { icon: '🔍', title: 'Lost & Found', desc: 'We help reunite lost pets with their families and work closely with animal control services in our community.' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{item.icon}</div>
                  <h3 style={{ marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ color: '#94A3B8', lineHeight: '1.7', fontSize: '0.9rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container text-center reveal">
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Visit <span className="text-gradient">Our Shelter</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>962 Second Line East, Sault Ste. Marie, ON P6B 4K4</p>
          <div className="grid-3" style={{ maxWidth: '600px', margin: '0 auto', gap: '24px' }}>
            <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>Mon-Sat</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>12 PM - 5 PM</div>
            </div>
            <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>Sunday</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Closed</div>
            </div>
            <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>Phone</div>
              <div style={{ color: 'var(--text-accent)', fontSize: '0.9rem' }}>705-949-3573</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
