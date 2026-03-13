'use client';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const PET_SERVICES = [
  { icon: 'home', title: 'Adoption Services', desc: 'Browse available pets online and apply to adopt. Our staff will guide you through the process and help find your perfect match.', link: '/adopt', color: 'var(--blue-400)', popular: true },
  { icon: 'heart', title: 'Foster Program', desc: 'Open your home temporarily to an animal in need. We provide supplies, veterinary care, and support throughout the experience.', link: '/foster', color: 'var(--rose-400)', popular: false },
  { icon: 'medical', title: 'Veterinary Care', desc: 'All shelter animals receive medical exams, vaccinations, spay/neuter surgery, microchipping, and any necessary treatment.', link: '/contact', color: 'var(--green-500)', popular: false },
  { icon: 'scissors', title: 'Spay/Neuter Program', desc: 'All adopted animals are spayed/neutered. We advocate for spaying and neutering to reduce the number of homeless animals.', link: '/contact', color: 'var(--green-700)', popular: true },
];

const COMMUNITY_SERVICES = [
  { icon: 'search', title: 'Lost & Found', desc: 'Lost your pet? Found a stray? Contact us — we work with animal control to help reunite pets with their families.', link: '/lost-found', color: 'var(--blue-500)' },
  { icon: 'book', title: 'Education Programs', desc: 'We offer educational programs about responsible pet ownership, animal welfare, and the benefits of adoption.', link: '/contact', color: 'var(--blue-300)' },
  { icon: 'people', title: 'Volunteer Opportunities', desc: 'Give your time to make a difference. We have volunteer opportunities for individuals, groups, and corporate teams.', link: '/volunteer', color: 'var(--green-600)' },
  { icon: 'paw', title: 'Animal Surrender', desc: 'If you can no longer care for your pet, contact us to discuss surrender options. We ensure every animal finds a safe home.', link: '/surrender', color: 'var(--rose-500)' },
  { icon: 'ribbon', title: 'Community Outreach', desc: 'We participate in community events, school visits, and awareness campaigns to promote animal welfare.', link: '/events', color: 'var(--blue-600)' },
];

export default function ServicesPage() {
  useScrollReveal();
  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="medical" size={14} color="var(--blue-700)" /> How We Help
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Our <span className="text-gradient">Services</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            We provide a comprehensive range of services to help animals and pet owners across the Algoma District.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div className="container glass" style={{
          display: 'flex', justifyContent: 'space-around', padding: '28px 32px',
          flexWrap: 'wrap', gap: '20px', borderRadius: 'var(--radius-xl)',
          maxWidth: '700px', margin: '0 auto', position: 'relative', top: '-28px',
        }}>
          {[
            { target: 9, label: 'Services Offered', icon: 'medical', color: 'var(--blue-500)' },
            { target: 1847, label: 'Animals Helped', icon: 'paw', color: 'var(--green-500)' },
            { target: 45, label: 'Years of Service', suffix: '+', icon: 'calendar', color: 'var(--rose-400)' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: stat.color }}>
                <AnimatedCounter target={stat.target} suffix={stat.suffix || ''} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pet Services */}
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Pet <span className="text-gradient">Services</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Direct care and support for animals in our shelter.</p>
          </div>
          <div className="grid-2 stagger" style={{ gap: '20px' }}>
            {PET_SERVICES.map((item, i) => (
              <Link key={i} href={item.link} className="card card-3d" style={{ textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
                {item.popular && (
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    padding: '3px 10px', borderRadius: '100px',
                    background: item.color, color: '#fff', fontSize: '0.65rem',
                    fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>
                    Popular
                  </div>
                )}
                <div style={{ height: '4px', background: item.color }} />
                <div className="card-body" style={{ padding: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <IconCircle name={item.icon} size={56} color={item.color} bgOpacity={0.15} style={{ flexShrink: 0 }} />
                  <div>
                    <h3 style={{ marginBottom: '8px' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.9rem', marginBottom: '12px' }}>{item.desc}</p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-accent)', fontWeight: 600, fontSize: '0.85rem' }}>
                      Learn more <Icon name="arrow" size={14} color="var(--text-accent)" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Services */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Community <span className="text-gradient">Programs</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Engaging our community to build a better world for animals.</p>
          </div>
          <div className="grid-3 stagger">
            {COMMUNITY_SERVICES.map((item, i) => (
              <Link key={i} href={item.link} className="card card-3d" style={{ textDecoration: 'none' }}>
                <div style={{ height: '4px', background: item.color }} />
                <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                  <IconCircle name={item.icon} size={56} color={item.color} bgOpacity={0.15} style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ marginBottom: '12px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.9rem' }}>{item.desc}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '16px', color: 'var(--text-accent)', fontWeight: 600, fontSize: '0.85rem' }}>
                    Learn more <Icon name="arrow" size={14} color="var(--text-accent)" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="story-card reveal-scale" style={{ padding: '40px', textAlign: 'center' }}>
            <IconCircle name="heart" size={56} color="var(--rose-400)" bgOpacity={0.15} style={{ margin: '0 auto 20px' }} />
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.9', maxWidth: '500px', margin: '0 auto 20px', fontSize: '1.05rem' }}>
              &ldquo;The team at the humane society went above and beyond to help us find the perfect family dog. Their adoption process was smooth, supportive, and clearly designed with the animal&apos;s best interest in mind.&rdquo;
            </p>
            <p style={{ fontWeight: 700 }}>— Rachel & James T.</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Adopted Cooper, 2025</p>
          </div>
        </div>
      </section>

      {/* Dark CTA Section */}
      <section className="section section-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <h2 className="reveal" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '16px' }}>
            How Can <span style={{ color: 'var(--blue-400)' }}>You Help</span>?
          </h2>
          <p className="reveal" style={{ color: '#94A3B8', maxWidth: '500px', margin: '0 auto 40px', lineHeight: '1.7' }}>
            Whether you adopt, foster, volunteer, or donate — every action makes a difference in the life of an animal.
          </p>
          <div className="grid-4 stagger" style={{ maxWidth: '900px', margin: '0 auto 40px' }}>
            {[
              { icon: 'paw', title: 'Adopt', desc: 'Give a pet their forever home', link: '/adopt', color: 'var(--blue-400)' },
              { icon: 'home', title: 'Foster', desc: 'Provide temporary safe haven', link: '/foster', color: 'var(--green-500)' },
              { icon: 'people', title: 'Volunteer', desc: 'Donate your time and skills', link: '/volunteer', color: 'var(--rose-400)' },
              { icon: 'heart', title: 'Donate', desc: 'Fund critical animal care', link: '/donate', color: '#F59E0B' },
            ].map((item, i) => (
              <Link key={i} href={item.link} className="card" style={{
                background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)',
                textAlign: 'center', padding: '32px 20px', textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}>
                <IconCircle name={item.icon} size={48} color={item.color} bgOpacity={0.15} style={{ margin: '0 auto 14px' }} />
                <h4 style={{ marginBottom: '6px', color: '#F1F5F9' }}>{item.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{item.desc}</p>
              </Link>
            ))}
          </div>
          <Link href="/contact" className="btn btn-primary btn-lg reveal" style={{ borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="mail" size={18} color="#fff" /> Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
