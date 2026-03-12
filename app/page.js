'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import useScrollReveal from '@/components/effects/useScrollReveal';
import PetImage from '@/components/pets/PetImage';
import pets from '@/lib/data/pets.json';

const FEATURED = pets.slice(0, 6);

export default function Home() {
  useScrollReveal();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % FEATURED.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="hero" id="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge">
            <span>🐾</span>
            <span>Sault Ste. Marie Humane Society</span>
          </div>
          <h1 className="hero-title">
            Every Pet Deserves a <span className="text-gradient">Loving Home</span>
          </h1>
          <p className="hero-subtitle">
            We&apos;re committed to improving the lives of animals through rescue, adoption, and education. 
            Over 100 furry friends are searching for their furever homes right now.
          </p>
          <div className="hero-actions">
            <Link href="/adopt" className="btn btn-primary btn-lg">
              🐕 Meet Our Pets
            </Link>
            <Link href="/donate" className="btn btn-secondary btn-lg">
              ❤️ Make a Donation
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number"><AnimatedCounter target={1847} /></div>
              <div className="hero-stat-label">Pets Adopted</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number"><AnimatedCounter target={41} /></div>
              <div className="hero-stat-label">Pets Available</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number"><AnimatedCounter target={250} suffix="+" /></div>
              <div className="hero-stat-label">Volunteers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number"><AnimatedCounter target={45} suffix="+" /></div>
              <div className="hero-stat-label">Years Serving SSM</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURED PETS ========== */}
      <section className="section" id="featured-pets">
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '48px' }}>
            <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>✨ Looking for Love</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '12px' }}>
              Meet Our <span className="text-gradient">Featured Friends</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              These amazing animals are waiting for someone just like you. Give them a chance at a happy life.
            </p>
          </div>
          <div className="pet-grid stagger">
            {FEATURED.map((pet, i) => (
              <Link href={`/adopt/${pet.id}`} key={pet.id} className="pet-card">
                <div className="pet-card-img-wrap">
                  <PetImage pet={pet} />
                  <span className="pet-card-badge">
                    <span className="badge badge-green">Available</span>
                  </span>
                </div>
                <div className="pet-card-body">
                  <h3 className="pet-card-name">{pet.name}</h3>
                  <p className="pet-card-meta">{pet.breed} · {pet.age} · {pet.gender}</p>
                  <div className="pet-card-traits">
                    {pet.traits.slice(0, 3).map(t => (
                      <span key={t} className="badge badge-outline">{t.replace(/-/g,' ')}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center reveal" style={{ marginTop: '48px' }}>
            <Link href="/adopt" className="btn btn-primary btn-lg">
              View All {pets.length} Pets →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== WHY ADOPT ========== */}
      <section className="section section-dark" id="why-adopt">
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '12px' }}>
              Why <span style={{ color: 'var(--blue-400)' }}>Adopt</span>?
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
              When you adopt, you save a life and gain a loyal companion. Here&apos;s why adoption matters.
            </p>
          </div>
          <div className="grid-3 stagger">
            {[
              { icon: '💙', title: 'Save a Life', desc: 'Every adoption opens space for another animal in need. You\'re not just gaining a pet — you\'re saving a life.' },
              { icon: '🏠', title: 'Give a Second Chance', desc: 'Many shelter animals have been abandoned or surrendered. Your home becomes their safe haven and fresh start.' },
              { icon: '🤝', title: 'Unconditional Love', desc: 'Adopted pets know they\'ve been saved. The bond you form with a rescue animal is truly special and lasting.' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="card-body" style={{ textAlign: 'center', padding: '40px 32px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{item.icon}</div>
                  <h3 style={{ marginBottom: '12px', fontSize: '1.3rem' }}>{item.title}</h3>
                  <p style={{ color: '#94A3B8', lineHeight: '1.7' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '48px' }}>
            <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>📋 Simple Process</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '12px' }}>
              How <span className="text-gradient">Adoption Works</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Our streamlined process makes it easy to welcome a new furry family member into your home.
            </p>
          </div>
          <div className="grid-4 stagger">
            {[
              { step: '01', icon: '🔍', title: 'Browse Pets', desc: 'Explore our available dogs, cats, and critters. Filter by type, age, and traits.' },
              { step: '02', icon: '📝', title: 'Apply Online', desc: 'Fill out our interactive adoption application right from your browser. No PDFs!' },
              { step: '03', icon: '✅', title: 'Get Approved', desc: 'Our staff reviews your application and contacts you. Track status in your dashboard.' },
              { step: '04', icon: '🏠', title: 'Welcome Home', desc: 'Schedule a meet-and-greet, then bring your new best friend home!' },
            ].map((item, i) => (
              <div key={i} className="card">
                <div className="card-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'var(--blue-100)', color: 'var(--blue-700)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: '800', margin: '0 auto 16px',
                  }}>{item.step}</div>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.icon}</div>
                  <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="section" id="cta-section" style={{
        background: 'linear-gradient(135deg, var(--blue-500), var(--blue-700))',
        color: '#fff', textAlign: 'center'
      }}>
        <div className="container reveal">
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '16px' }}>
            Ready to Change a Life?
          </h2>
          <p style={{ maxWidth: '500px', margin: '0 auto 32px', opacity: 0.9, fontSize: '1.1rem' }}>
            Your new best friend is waiting. Start the adoption process today or help us by donating, fostering, or volunteering.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/adopt" className="btn btn-lg" style={{ background: '#fff', color: 'var(--blue-700)' }}>
              🐾 Browse Pets
            </Link>
            <Link href="/donate" className="btn btn-lg" style={{ background: 'transparent', border: '2px solid #fff', color: '#fff' }}>
              ❤️ Donate Now
            </Link>
          </div>
        </div>
      </section>

      {/* ========== NEWS ========== */}
      <section className="section" id="news">
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '12px' }}>
              Latest <span className="text-gradient">News</span>
            </h2>
          </div>
          <div className="grid-3 stagger">
            {[
              { title: 'Online 50/50 Raffle!', desc: 'Support the shelter and win big with our online 50/50 raffle. Tickets available now!', date: 'Mar 10, 2026' },
              { title: 'Viewing Rooms Update', desc: 'Our viewing rooms are currently closed. All adoptions are done by application process.', date: 'Mar 5, 2026' },
              { title: 'Join Our Foster Team!', desc: 'Every year dozens of shelter animals are given a second chance thanks to our volunteer foster homes.', date: 'Feb 28, 2026' },
            ].map((item, i) => (
              <div key={i} className="card">
                <div className="card-body" style={{ padding: '32px' }}>
                  <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>{item.date}</span>
                  <h3 style={{ marginBottom: '12px', fontSize: '1.2rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>{item.desc}</p>
                  <Link href="/events" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--text-accent)', fontWeight: '600', fontSize: '0.9rem' }}>
                    Read more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
