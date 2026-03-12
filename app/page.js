'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import useScrollReveal from '@/components/effects/useScrollReveal';
import PetImage from '@/components/pets/PetImage';
import Icon, { IconCircle } from '@/components/ui/Icon';
import pets from '@/lib/data/pets.json';

const FEATURED = pets.slice(0, 6);
const URGENT = [...pets].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)).slice(0, 3);

const TESTIMONIALS = [
  { quote: "Adopting Tucker was the best decision we ever made. He's brought so much joy to our family!", author: "Sarah M.", role: "Adopted Tucker, 2025" },
  { quote: "The fostering experience was incredible. The staff supported us every step of the way.", author: "Jamie & Chris L.", role: "Foster Family" },
  { quote: "Volunteering here changed my life. Seeing animals find loving homes makes every hour worthwhile.", author: "David K.", role: "Volunteer since 2022" },
];

export default function Home() {
  useScrollReveal();
  const [heroWord, setHeroWord] = useState(0);
  const words = ['Loving', 'Forever', 'Happy', 'Caring'];
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const wordTimer = setInterval(() => setHeroWord(prev => (prev + 1) % words.length), 3500);
    const testimonialTimer = setInterval(() => setTestimonialIdx(prev => (prev + 1) % TESTIMONIALS.length), 6000);
    return () => { clearInterval(wordTimer); clearInterval(testimonialTimer); };
  }, []);

  return (
    <>
      {/* ===== HERO — clean, spacious, confident ===== */}
      <section className="hero" id="hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        {/* Single subtle aurora — no competing blobs */}
        <div style={{
          position:'absolute', inset:0, zIndex:0,
          background:'linear-gradient(-45deg, rgba(14,165,233,0.06), rgba(6,182,212,0.04), rgba(16,185,129,0.05), rgba(59,130,246,0.04))',
          backgroundSize:'400% 400%', animation:'auroraShift 20s ease infinite',
        }} />
        {/* Single soft radial accent */}
        <div style={{
          position:'absolute', top:'-20%', right:'-15%', width:'700px', height:'700px',
          background:'radial-gradient(circle, rgba(41,171,226,0.07) 0%, transparent 65%)',
          zIndex:0
        }} />

        <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:'800px' }}>
          <div className="hero-badge" style={{ animation:'fadeInDown 0.8s ease both', marginBottom:'24px' }}>
            <Icon name="paw" size={16} color="var(--blue-500)" />
            <span>Sault Ste. Marie Humane Society</span>
          </div>
          <h1 style={{
            fontFamily:'var(--font-display)', fontSize:'clamp(2.5rem, 5.5vw, 4rem)',
            fontWeight:800, lineHeight:1.1, marginBottom:'24px', letterSpacing:'-0.02em'
          }}>
            Every Pet Deserves a{' '}
            <span key={heroWord} className="text-gradient" style={{ display:'inline-block', animation:'fadeInUp 0.5s ease both' }}>
              {words[heroWord]}
            </span>{' '}
            Home
          </h1>
          <p style={{
            fontSize:'1.15rem', lineHeight:1.7, color:'var(--text-secondary)',
            maxWidth:'580px', margin:'0 auto 40px'
          }}>
            We rescue, rehabilitate, and rehome animals in the Algoma District. 
            Over 100 furry friends are waiting for their forever families.
          </p>
          <div style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/adopt" className="btn btn-primary btn-lg" style={{ 
              borderRadius:'100px', fontSize:'1rem', padding:'16px 36px',
              display:'inline-flex', alignItems:'center', gap:'10px',
              boxShadow:'0 8px 30px rgba(41,171,226,0.25)'
            }}>
              <Icon name="search" size={18} color="#fff" /> Meet Our Pets
            </Link>
            <Link href="/donate" className="btn btn-lg" style={{ 
              borderRadius:'100px', fontSize:'1rem', padding:'16px 36px', 
              background:'transparent', border:'2px solid var(--border-light)',
              display:'inline-flex', alignItems:'center', gap:'10px',
            }}>
              <Icon name="heart" size={18} color="var(--rose-500)" /> Donate
            </Link>
          </div>
        </div>

        {/* Minimal scroll hint */}
        <div style={{ position:'absolute', bottom:'40px', left:'50%', transform:'translateX(-50%)', zIndex:2 }}>
          <div style={{
            width:'24px', height:'40px', borderRadius:'12px', border:'2px solid var(--border-light)',
            display:'flex', justifyContent:'center', paddingTop:'8px', opacity:0.5
          }}>
            <div style={{ width:'2px', height:'8px', borderRadius:'2px', background:'var(--text-accent)', animation:'fadeInDown 2s ease infinite' }} />
          </div>
        </div>
      </section>

      {/* ===== STATS BAR — compact, elegant ===== */}
      <section style={{ borderBottom:'1px solid var(--border-light)', background:'var(--bg-card)' }}>
        <div className="container" style={{ display:'flex', justifyContent:'space-around', padding:'32px 24px', flexWrap:'wrap', gap:'24px' }}>
          {[
            { target: 1847, label: 'Pets Adopted', icon: 'home' },
            { target: 41, label: 'Pets Available', icon: 'paw' },
            { target: 250, label: 'Volunteers', suffix: '+', icon: 'people' },
            { target: 45, label: 'Years of Service', suffix: '+', icon: 'calendar' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign:'center', minWidth:'120px' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, color:'var(--text-primary)' }}>
                <AnimatedCounter target={stat.target} suffix={stat.suffix || ''} />
              </div>
              <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:'4px', letterSpacing:'0.03em', textTransform:'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PETS — clean grid, no competing elements ===== */}
      <section className="section" id="featured-pets">
        <div className="container">
          <div className="reveal" style={{ textAlign:'center', marginBottom:'56px' }}>
            <h2 style={{ fontSize:'clamp(2rem, 4vw, 2.8rem)', marginBottom:'16px' }}>
              Meet Our <span className="text-gradient">Featured Friends</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', maxWidth:'500px', margin:'0 auto', fontSize:'1.05rem' }}>
              These amazing animals are ready for their forever homes.
            </p>
          </div>
          <div className="pet-grid stagger">
            {FEATURED.map((pet) => (
              <Link href={`/adopt/${pet.id}`} key={pet.id} className="pet-card card-3d">
                <div className="pet-card-img-wrap">
                  <PetImage pet={pet} />
                  <span className="pet-card-badge">
                    <span className="badge badge-green" style={{ display:'inline-flex', alignItems:'center', gap:'4px' }}>
                      <Icon name="check" size={12} color="var(--green-800)" /> Available
                    </span>
                  </span>
                </div>
                <div className="pet-card-body">
                  <h3 className="pet-card-name">{pet.name}</h3>
                  <p className="pet-card-meta">{pet.breed} · {pet.age} · {pet.gender}</p>
                  <div className="pet-card-traits">
                    {pet.traits.slice(0, 2).map(t => (
                      <span key={t} className="badge badge-outline">{t.replace(/-/g,' ')}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center reveal" style={{ marginTop:'48px' }}>
            <Link href="/adopt" className="btn btn-primary" style={{ borderRadius:'100px', display:'inline-flex', alignItems:'center', gap:'8px', padding:'14px 32px' }}>
              View All {pets.length} Pets <Icon name="arrow" size={16} color="#fff" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== LONGEST WAITING — empathetic, not heavy ===== */}
      <section className="section" style={{ background:'var(--bg-secondary)', padding:'80px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign:'center', marginBottom:'48px' }}>
            <h2 style={{ fontSize:'clamp(1.8rem, 3vw, 2.5rem)', marginBottom:'12px' }}>
              They&apos;ve Been <span style={{ color:'var(--rose-500)' }}>Waiting the Longest</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', maxWidth:'480px', margin:'0 auto' }}>
              Could you be the one they&apos;ve been waiting for?
            </p>
          </div>
          <div className="grid-3 stagger">
            {URGENT.map(pet => (
              <Link href={`/adopt/${pet.id}`} key={pet.id} className="pet-card card-3d">
                <div className="pet-card-img-wrap">
                  <PetImage pet={pet} />
                </div>
                <div className="pet-card-body">
                  <h3 className="pet-card-name">{pet.name}</h3>
                  <p className="pet-card-meta">{pet.breed} · {pet.age}</p>
                  <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginTop:'8px', display:'flex', alignItems:'center', gap:'6px' }}>
                    <Icon name="clock" size={13} color="var(--text-muted)" />
                    Since {new Date(pet.dateAdded).toLocaleDateString('en-US', { month:'short', day:'numeric' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY ADOPT — on dark, 3 clean cards ===== */}
      <section className="section section-dark" id="why-adopt" style={{ padding:'100px 0' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom:'56px' }}>
            <h2 style={{ fontSize:'clamp(2rem, 4vw, 2.8rem)', marginBottom:'16px' }}>
              Why <span style={{ color:'var(--blue-400)' }}>Adopt</span>?
            </h2>
            <p style={{ color:'#94A3B8', maxWidth:'480px', margin:'0 auto' }}>
              When you adopt, you save a life and gain a loyal companion.
            </p>
          </div>
          <div className="grid-3 stagger">
            {[
              { icon:'heart', title:'Save a Life', desc:'Every adoption opens space for another animal in need. You\'re not just gaining a pet — you\'re saving a life.', color:'var(--blue-400)' },
              { icon:'home', title:'A Second Chance', desc:'Many shelter animals have been abandoned or surrendered. Your home becomes their safe haven and fresh start.', color:'var(--green-500)' },
              { icon:'people', title:'Unconditional Love', desc:'The bond you form with a rescue animal is truly special. Adopted pets know they\'ve been saved.', color:'var(--rose-400)' },
            ].map((item, i) => (
              <div key={i} className="card card-3d" style={{ background:'rgba(255,255,255,0.04)', borderColor:'rgba(255,255,255,0.08)', textAlign:'center', padding:'48px 32px' }}>
                <IconCircle name={item.icon} size={56} color={item.color} bgOpacity={0.15} style={{ margin:'0 auto 24px' }} />
                <h3 style={{ marginBottom:'12px', fontSize:'1.2rem' }}>{item.title}</h3>
                <p style={{ color:'#94A3B8', lineHeight:'1.7', fontSize:'0.95rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS — one at a time, clean ===== */}
      <section className="section" style={{ padding:'80px 0' }}>
        <div className="container" style={{ maxWidth:'640px' }}>
          <div className="text-center reveal" style={{ marginBottom:'40px' }}>
            <h2 style={{ fontSize:'clamp(1.8rem, 3vw, 2.4rem)' }}>
              From Our <span className="text-gradient">Community</span>
            </h2>
          </div>
          <div className="reveal-scale">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card" style={{ 
                display: i === testimonialIdx ? 'block' : 'none',
                animation:'fadeInUp 0.5s ease both'
              }}>
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <p className="testimonial-author">{t.author}</p>
                <p className="testimonial-role">{t.role}</p>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'24px' }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} style={{
                  width: i === testimonialIdx ? '24px' : '8px', height:'8px', borderRadius:'100px',
                  background: i === testimonialIdx ? 'var(--blue-500)' : 'var(--border-light)',
                  transition:'all 0.3s ease', border:'none', cursor:'pointer'
                }} aria-label={`Testimonial ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS — clean step cards ===== */}
      <section className="section" style={{ background:'var(--bg-secondary)', padding:'80px 0' }} id="how-it-works">
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom:'56px' }}>
            <h2 style={{ fontSize:'clamp(2rem, 4vw, 2.8rem)', marginBottom:'12px' }}>
              How <span className="text-gradient">It Works</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', maxWidth:'460px', margin:'0 auto' }}>
              Four simple steps to welcome a new family member.
            </p>
          </div>
          <div className="grid-4 stagger">
            {[
              { step:'01', icon:'search', title:'Browse', desc:'Explore our available pets. Filter by type, age, and personality.', color:'var(--blue-400)' },
              { step:'02', icon:'edit', title:'Apply', desc:'Fill out our online adoption application — quick and easy.', color:'var(--green-500)' },
              { step:'03', icon:'check', title:'Approve', desc:'We review your application and contact you within days.', color:'var(--blue-600)' },
              { step:'04', icon:'home', title:'Welcome', desc:'Schedule a meet-and-greet and bring your friend home!', color:'var(--rose-400)' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign:'center', padding:'36px 24px', position:'relative' }}>
                <div style={{
                  fontFamily:'var(--font-display)', fontSize:'3rem', fontWeight:800,
                  color:'var(--border-light)', position:'absolute', top:'12px', right:'16px',
                  lineHeight:1
                }}>{item.step}</div>
                <IconCircle name={item.icon} size={48} color={item.color} bgOpacity={0.12} style={{ margin:'0 auto 16px' }} />
                <h3 style={{ marginBottom:'8px', fontSize:'1.05rem' }}>{item.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:'0.88rem', lineHeight:'1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA — focused, clean gradient ===== */}
      <section style={{
        background:'linear-gradient(135deg, var(--blue-500), var(--blue-700))',
        color:'#fff', textAlign:'center', padding:'80px 0',
      }}>
        <div className="container reveal" style={{ maxWidth:'600px' }}>
          <h2 style={{ fontSize:'clamp(2rem, 4vw, 2.8rem)', marginBottom:'16px' }}>
            Ready to Change a Life?
          </h2>
          <p style={{ maxWidth:'420px', margin:'0 auto 32px', opacity:0.85, fontSize:'1.05rem', lineHeight:1.7 }}>
            Your new best friend is waiting. Start the journey today.
          </p>
          <div style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/adopt" className="btn btn-lg" style={{ 
              background:'#fff', color:'var(--blue-700)', borderRadius:'100px', padding:'16px 36px',
              fontWeight:700, display:'inline-flex', alignItems:'center', gap:'8px'
            }}>
              <Icon name="paw" size={18} color="var(--blue-700)" /> Browse Pets
            </Link>
            <Link href="/donate" className="btn btn-lg" style={{ 
              background:'rgba(255,255,255,0.12)', border:'2px solid rgba(255,255,255,0.3)', 
              color:'#fff', borderRadius:'100px', padding:'16px 36px',
              display:'inline-flex', alignItems:'center', gap:'8px'
            }}>
              <Icon name="heart" size={18} color="#fff" /> Donate
            </Link>
          </div>
        </div>
      </section>

      {/* ===== NEWS — minimal, three cards ===== */}
      <section className="section" id="news" style={{ padding:'80px 0' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom:'48px' }}>
            <h2 style={{ fontSize:'clamp(2rem, 4vw, 2.8rem)', marginBottom:'12px' }}>
              Latest <span className="text-gradient">Updates</span>
            </h2>
          </div>
          <div className="grid-3 stagger">
            {[
              { title: 'Online 50/50 Raffle', desc: 'Support the shelter and win big. Tickets available now — the jackpot keeps growing!', date: 'Mar 10', icon:'trophy' },
              { title: 'Viewing Rooms Update', desc: 'All adoptions are done by application. This ensures the best match for every family.', date: 'Mar 5', icon:'home' },
              { title: 'Join Our Foster Team', desc: 'Dozens of animals get a second chance each year thanks to volunteer foster homes.', date: 'Feb 28', icon:'heart' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding:'32px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
                  <IconCircle name={item.icon} size={36} color="var(--blue-500)" bgOpacity={0.1} />
                  <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{item.date}</span>
                </div>
                <h3 style={{ marginBottom:'10px', fontSize:'1.1rem' }}>{item.title}</h3>
                <p style={{ color:'var(--text-secondary)', lineHeight:'1.7', fontSize:'0.92rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
