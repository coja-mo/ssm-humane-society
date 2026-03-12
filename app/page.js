'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import useScrollReveal from '@/components/effects/useScrollReveal';
import PetImage from '@/components/pets/PetImage';
import pets from '@/lib/data/pets.json';

const FEATURED = pets.slice(0, 6);
const URGENT = [...pets].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)).slice(0, 3);

const TESTIMONIALS = [
  { quote: "Adopting Tucker from SSM Humane Society was the best decision we ever made. He's brought so much joy to our family!", author: "Sarah M.", role: "Adopted Tucker, 2025", pet: "🐕" },
  { quote: "The fostering experience was incredible. The staff supported us every step of the way. We ended up adopting our foster cat!", author: "Jamie & Chris L.", role: "Foster Family", pet: "🐈" },
  { quote: "Volunteering here changed my life. Seeing animals find loving homes makes every hour worthwhile.", author: "David K.", role: "Volunteer since 2022", pet: "💙" },
];

const SUCCESS_STORIES = [
  { before: 'Scared and alone', after: 'Living his best life', name: 'Timber', emoji: '🐕', color: 'var(--blue-400)' },
  { before: 'Abandoned at 2 weeks', after: 'Now a therapy cat', name: 'Snowball', emoji: '🐈', color: 'var(--green-500)' },
  { before: 'Found injured on road', after: 'Healthy & loved', name: 'Robin', emoji: '🐕', color: 'var(--rose-400)' },
];

export default function Home() {
  useScrollReveal();
  const [heroWord, setHeroWord] = useState(0);
  const words = ['Loving', 'Forever', 'Happy', 'Caring', 'Warm'];
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setHeroWord(prev => (prev + 1) % words.length);
    }, 3000);
    const testimonialTimer = setInterval(() => {
      setTestimonialIdx(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => { clearInterval(wordTimer); clearInterval(testimonialTimer); };
  }, []);

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="hero" id="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Aurora gradient background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'linear-gradient(-45deg, rgba(14,165,233,0.12), rgba(6,182,212,0.08), rgba(16,185,129,0.1), rgba(59,130,246,0.08))',
          backgroundSize: '400% 400%',
          animation: 'auroraShift 15s ease infinite',
        }} />
        {/* Morphing blob accent */}
        <div style={{
          position: 'absolute', top: '10%', right: '-5%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(41,171,226,0.12) 0%, transparent 70%)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          animation: 'morphBlob 8s ease-in-out infinite',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
          borderRadius: '40% 60% 70% 30% / 30% 70% 40% 60%',
          animation: 'morphBlob 10s ease-in-out infinite reverse',
          zIndex: 0
        }} />

        {/* Floating tags */}
        <div className="float-tag" style={{ top: '20%', left: '8%', animationDelay: '0s' }}>🐕 41 Pets Available</div>
        <div className="float-tag" style={{ top: '30%', right: '6%', animationDelay: '1.5s' }}>❤️ 1,847 Adopted</div>
        <div className="float-tag" style={{ bottom: '25%', left: '12%', animationDelay: '3s' }}>🏠 45+ Years</div>

        <div className="hero-content" style={{ zIndex: 2 }}>
          <div className="hero-badge" style={{ animation: 'fadeInDown 0.8s ease, glowPulse 3s ease-in-out infinite 1s' }}>
            <span>🐾</span>
            <span>Sault Ste. Marie Humane Society</span>
          </div>
          <h1 className="hero-title">
            Every Pet Deserves a{' '}
            <span key={heroWord} className="text-shimmer" style={{ 
              display: 'inline-block',
              animation: 'fadeInUp 0.5s ease both',
            }}>
              {words[heroWord]}
            </span>{' '}
            Home
          </h1>
          <p className="hero-subtitle">
            We&apos;re committed to improving the lives of animals through rescue, adoption, and education. 
            Over 100 furry friends are searching for their furever homes right now.
          </p>
          <div className="hero-actions">
            <Link href="/adopt" className="btn btn-primary btn-lg glow-border-hover" style={{ 
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, var(--blue-500), var(--blue-600))',
              fontSize: '1.05rem'
            }}>
              🐕 Meet Our Pets
            </Link>
            <Link href="/donate" className="btn btn-lg" style={{ 
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(244,63,94,0.05))',
              border: '2px solid rgba(244,63,94,0.3)',
              color: 'var(--rose-500)',
              fontSize: '1.05rem'
            }}>
              ❤️ Make a Donation
            </Link>
          </div>
          <div className="hero-stats" style={{ marginTop: '56px' }}>
            {[
              { target: 1847, label: 'Pets Adopted', icon: '🏠' },
              { target: 41, label: 'Pets Available', icon: '🐾' },
              { target: 250, label: 'Volunteers', suffix: '+', icon: '🤝' },
              { target: 45, label: 'Years Serving SSM', suffix: '+', icon: '📅' },
            ].map((stat, i) => (
              <div key={i} className="hero-stat" style={{ animation: `fadeInUp 0.6s ease ${0.8 + i * 0.15}s both` }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{stat.icon}</div>
                <div className="hero-stat-number"><AnimatedCounter target={stat.target} suffix={stat.suffix || ''} /></div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          animation: 'float 2s ease-in-out infinite', zIndex: 2
        }}>
          <div style={{ width: '24px', height: '40px', borderRadius: '12px', border: '2px solid var(--text-muted)', display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
            <div style={{ width: '3px', height: '8px', borderRadius: '2px', background: 'var(--text-accent)', animation: 'fadeInDown 1.5s ease infinite' }} />
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
            {FEATURED.map((pet) => (
              <Link href={`/adopt/${pet.id}`} key={pet.id} className="pet-card card-3d">
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
            <Link href="/adopt" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-xl)' }}>
              View All {pets.length} Pets →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== URGENTLY NEEDED ========== */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '40px' }}>
            <span className="badge badge-rose" style={{ marginBottom: '12px', display: 'inline-block' }}>🕐 Longest in Shelter</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '12px' }}>
              They&apos;ve Been <span style={{ color: 'var(--rose-500)' }}>Waiting the Longest</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto' }}>
              These pets have been at our shelter the longest. Could you be the one they&apos;ve been waiting for?
            </p>
          </div>
          <div className="grid-3 stagger">
            {URGENT.map(pet => (
              <Link href={`/adopt/${pet.id}`} key={pet.id} className="pet-card glow-border-hover" style={{ borderColor: 'rgba(244,63,94,0.2)' }}>
                <div className="pet-card-img-wrap">
                  <PetImage pet={pet} />
                  <span className="pet-card-badge">
                    <span className="badge badge-rose">🕐 Waiting</span>
                  </span>
                </div>
                <div className="pet-card-body">
                  <h3 className="pet-card-name">{pet.name}</h3>
                  <p className="pet-card-meta">{pet.breed} · {pet.age}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    At shelter since {new Date(pet.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY ADOPT ========== */}
      <section className="section section-dark wave-divider wave-divider-top" id="why-adopt">
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
              <div key={i} className="card card-3d" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="card-body" style={{ textAlign: 'center', padding: '40px 32px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px', animation: `float ${3 + i}s ease-in-out infinite` }}>{item.icon}</div>
                  <h3 style={{ marginBottom: '12px', fontSize: '1.3rem' }}>{item.title}</h3>
                  <p style={{ color: '#94A3B8', lineHeight: '1.7' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SUCCESS STORIES ========== */}
      <section className="section" id="success-stories">
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '48px' }}>
            <span className="badge badge-green" style={{ marginBottom: '12px', display: 'inline-block' }}>🎉 Happy Endings</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '12px' }}>
              Success <span className="text-gradient">Stories</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Every adoption writes a new chapter. Here are some of our favorite happy endings.
            </p>
          </div>
          <div className="grid-3 stagger">
            {SUCCESS_STORIES.map((story, i) => (
              <div key={i} className="story-card" style={{ padding: '32px', textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>{story.emoji}</div>
                <h3 style={{ marginBottom: '16px', fontSize: '1.3rem' }}>{story.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '12px' }}>
                  <div style={{ padding: '8px 16px', background: 'rgba(244,63,94,0.1)', borderRadius: '100px', fontSize: '0.8rem', color: 'var(--rose-500)', fontWeight: 600 }}>
                    {story.before}
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>→</span>
                  <div style={{ padding: '8px 16px', background: 'rgba(16,185,129,0.1)', borderRadius: '100px', fontSize: '0.8rem', color: 'var(--green-600)', fontWeight: 600 }}>
                    {story.after}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="text-center reveal" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '8px' }}>
              What Our <span className="text-gradient">Community</span> Says
            </h2>
          </div>
          <div className="reveal-scale">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card" style={{ 
                display: i === testimonialIdx ? 'block' : 'none',
                animation: 'fadeInUp 0.5s ease both'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{t.pet}</div>
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <p className="testimonial-author">{t.author}</p>
                <p className="testimonial-role">{t.role}</p>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} style={{
                  width: i === testimonialIdx ? '24px' : '8px', height: '8px', borderRadius: '100px',
                  background: i === testimonialIdx ? 'var(--blue-500)' : 'var(--border-light)',
                  transition: 'all 0.3s ease', border: 'none', cursor: 'pointer'
                }} aria-label={`Testimonial ${i + 1}`} />
              ))}
            </div>
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
              <div key={i} className="card card-3d">
                <div className="card-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--blue-100), var(--blue-200))', color: 'var(--blue-700)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: '800', margin: '0 auto 16px',
                    boxShadow: '0 4px 12px rgba(41,171,226,0.2)'
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
        color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Animated gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(-45deg, rgba(16,185,129,0.2), transparent 40%, rgba(139,92,246,0.15), transparent)',
          backgroundSize: '400% 400%',
          animation: 'auroraShift 8s ease infinite',
        }} />
        <div className="container reveal" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>🐾</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '16px' }}>
            Ready to Change a Life?
          </h2>
          <p style={{ maxWidth: '500px', margin: '0 auto 32px', opacity: 0.9, fontSize: '1.1rem' }}>
            Your new best friend is waiting. Start the adoption process today or help us by donating, fostering, or volunteering.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/adopt" className="btn btn-lg" style={{ 
              background: '#fff', color: 'var(--blue-700)', borderRadius: 'var(--radius-xl)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              fontWeight: 700
            }}>
              🐾 Browse Pets
            </Link>
            <Link href="/donate" className="btn btn-lg" style={{ 
              background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', 
              color: '#fff', borderRadius: 'var(--radius-xl)',
              backdropFilter: 'blur(8px)'
            }}>
              ❤️ Donate Now
            </Link>
          </div>
        </div>
      </section>

      {/* ========== NEWS ========== */}
      <section className="section" id="news">
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '48px' }}>
            <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>📰 Stay Updated</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '12px' }}>
              Latest <span className="text-gradient">News</span>
            </h2>
          </div>
          <div className="grid-3 stagger">
            {[
              { title: 'Online 50/50 Raffle!', desc: 'Support the shelter and win big with our online 50/50 raffle. Tickets available now!', date: 'Mar 10, 2026', icon: '🎰' },
              { title: 'Viewing Rooms Update', desc: 'Our viewing rooms are currently closed. All adoptions are done by application process.', date: 'Mar 5, 2026', icon: '🏠' },
              { title: 'Join Our Foster Team!', desc: 'Every year dozens of shelter animals are given a second chance thanks to our volunteer foster homes.', date: 'Feb 28, 2026', icon: '❤️' },
            ].map((item, i) => (
              <div key={i} className="card card-3d">
                <div className="card-body" style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                    <span className="badge badge-blue">{item.date}</span>
                  </div>
                  <h3 style={{ marginBottom: '12px', fontSize: '1.2rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>{item.desc}</p>
                  <Link href="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '16px', color: 'var(--text-accent)', fontWeight: '600', fontSize: '0.9rem', transition: 'gap 0.3s' }}>
                    Read more <span>→</span>
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
