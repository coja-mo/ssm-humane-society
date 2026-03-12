'use client';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

export default function AboutPage() {
  useScrollReveal();
  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '60px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '0', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="paw" size={14} color="var(--blue-700)" /> About Us
          </span>
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
              <span className="badge badge-blue" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="heart" size={14} color="var(--blue-700)" /> Our Story
              </span>
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
                { n: 1847, label: 'Pets Adopted', icon: 'home', color: 'var(--blue-500)' },
                { n: 250, label: 'Volunteers', icon: 'people', suffix: '+', color: 'var(--green-500)' },
                { n: 45, label: 'Years Serving SSM', icon: 'calendar', suffix: '+', color: 'var(--rose-400)' },
                { n: 100, label: 'Animals in Care', icon: 'paw', suffix: '+', color: 'var(--blue-400)' },
              ].map((s) => (
                <div key={s.label} className="card card-3d" style={{ textAlign: 'center', padding: '28px 20px' }}>
                  <IconCircle name={s.icon} size={48} color={s.color} bgOpacity={0.15} style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: s.color }}>
                    <AnimatedCounter target={s.n} suffix={s.suffix || ''} />
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 className="text-center reveal" style={{ fontSize: '2rem', marginBottom: '40px' }}>Our <span className="text-gradient">Journey</span></h2>
          <div className="timeline reveal">
            {[
              { year: '1978', title: 'Founded', desc: 'The Sault Ste. Marie Humane Society was established by a group of passionate animal welfare advocates.' },
              { year: '1995', title: 'New Shelter', desc: 'Moved to our current location at 962 Second Line East, providing a larger facility for animals in need.' },
              { year: '2010', title: 'Foster Program Launch', desc: 'Launched our foster care program, dramatically increasing our capacity to help animals.' },
              { year: '2024', title: 'Digital Transformation', desc: 'Launched our online adoption application system and digital community platform.' },
              { year: 'Today', title: '45+ Years of Service', desc: 'Continuing to serve the Algoma District with rescue, adoption, education, and community programs.' },
            ].map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-date">{item.year}</div>
                <h4 style={{ marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark wave-divider-top">
        <div className="container">
          <h2 className="text-center reveal" style={{ fontSize: '2rem', marginBottom: '40px' }}>What <span style={{ color: 'var(--blue-400)' }}>We Do</span></h2>
          <div className="grid-3 stagger">
            {[
              { icon: 'medical', title: 'Rescue & Shelter', desc: 'We provide a safe haven for abandoned, surrendered, and stray animals. Our team assesses each animal\'s needs and provides appropriate care.', color: 'var(--blue-400)' },
              { icon: 'home', title: 'Adoption Services', desc: 'Our application-based adoption process helps match pets with the right families. We ensure every adoption is a success through careful screening.', color: 'var(--green-500)' },
              { icon: 'heart', title: 'Foster Program', desc: 'Our foster network provides temporary homes for animals who need extra care. Foster parents play a critical role in our mission.', color: 'var(--rose-400)' },
              { icon: 'book', title: 'Community Education', desc: 'We educate the public on responsible pet ownership, animal welfare, and the importance of spaying/neutering.', color: 'var(--blue-300)' },
              { icon: 'shield', title: 'Medical Care', desc: 'Every animal receives veterinary exams, vaccinations, spay/neuter surgery, and any necessary medical treatment.', color: 'var(--green-600)' },
              { icon: 'search', title: 'Lost & Found', desc: 'We help reunite lost pets with their families and work closely with animal control services in our community.', color: 'var(--blue-500)' },
            ].map((item, i) => (
              <div key={i} className="card card-3d" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                  <IconCircle name={item.icon} size={56} color={item.color} bgOpacity={0.2} style={{ margin: '0 auto 16px', animation: `float ${3 + i * 0.5}s ease-in-out infinite` }} />
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
            {[
              { label: 'Mon-Sat', value: '12 PM - 5 PM', icon: 'clock' },
              { label: 'Sunday', value: 'Closed', icon: 'calendar' },
              { label: 'Phone', value: '705-949-3573', icon: 'phone', accent: true },
            ].map((item, i) => (
              <div key={i} className="card card-3d" style={{ padding: '24px', textAlign: 'center' }}>
                <IconCircle name={item.icon} size={40} color={item.accent ? 'var(--text-accent)' : 'var(--blue-400)'} bgOpacity={0.12} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: '700', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ color: item.accent ? 'var(--text-accent)' : 'var(--text-muted)', fontSize: '0.9rem' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
