'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import useScrollReveal from '@/components/effects/useScrollReveal';
import PetImage from '@/components/pets/PetImage';
import FeaturedCarousel from '@/components/pets/FeaturedCarousel';
import Icon, { IconCircle } from '@/components/ui/Icon';
import pets from '@/lib/data/pets.json';


const URGENT = [...pets].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)).slice(0, 3);

const TESTIMONIALS = [
  { quote: "Adopting Tucker was the best decision we ever made. He's brought so much joy to our family!", author: "Sarah M.", role: "Adopted Tucker, 2025" },
  { quote: "The fostering experience was incredible. The staff supported us every step of the way.", author: "Jamie & Chris L.", role: "Foster Family" },
  { quote: "Volunteering here changed my life. Seeing animals find loving homes is the most rewarding thing.", author: "David K.", role: "Volunteer since 2022" },
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
      {/* ===== HERO — Apple-bold with animated gradient orbs ===== */}
      <section className="hero" id="hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {/* Animated gradient orbs */}
        <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden' }}>
          <div style={{
            position:'absolute', top:'-30%', right:'-20%', width:'800px', height:'800px',
            background:'radial-gradient(circle, rgba(41,171,226,0.12) 0%, transparent 60%)',
            animation:'float 8s ease-in-out infinite', borderRadius:'50%'
          }} />
          <div style={{
            position:'absolute', bottom:'-20%', left:'-15%', width:'600px', height:'600px',
            background:'radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 60%)',
            animation:'float 10s ease-in-out infinite reverse', borderRadius:'50%'
          }} />
          <div style={{
            position:'absolute', top:'40%', left:'50%', width:'400px', height:'400px',
            background:'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 60%)',
            animation:'float 12s ease-in-out infinite', borderRadius:'50%', transform:'translateX(-50%)'
          }} />
        </div>

        <div className="container" style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:'800px' }}>
          <div className="hero-badge" style={{ animation:'fadeInDown 0.8s ease both' }}>
            <Icon name="paw" size={15} color="var(--blue-500)" />
            <span>Sault Ste. Marie &middot; Humane Society</span>
          </div>
          <h1 style={{
            fontFamily:'var(--font-display)', fontSize:'clamp(3.2rem, 7vw, 5rem)',
            fontWeight:800, lineHeight:1.1, marginBottom:'28px', letterSpacing:'-0.05em',
            animation:'fadeInUp 0.8s ease 0.2s both', padding:'4px 0'
          }}>
            Every Pet Deserves a{' '}
            <span key={heroWord} className="text-gradient" style={{ display:'inline-block', animation:'fadeInUp 0.5s ease both' }}>
              {words[heroWord]}
            </span>{' '}
            Home
          </h1>
          <p style={{
            fontSize:'1.15rem', lineHeight:1.75, color:'var(--text-secondary)',
            maxWidth:'560px', margin:'0 auto 44px',
            animation:'fadeInUp 0.8s ease 0.4s both'
          }}>
            We rescue, rehabilitate, and rehome animals in the Algoma District. 
            Over <strong style={{ color:'var(--text-primary)' }}>100 furry friends</strong> are waiting for their forever families.
          </p>
          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap', animation:'fadeInUp 0.8s ease 0.6s both' }}>
            <Link href="/adopt" className="btn btn-primary btn-lg" style={{ 
              borderRadius:'100px', fontSize:'1rem', padding:'16px 36px',
              display:'inline-flex', alignItems:'center', gap:'10px',
            }}>
              <Icon name="search" size={18} color="#fff" /> Meet Our Pets
            </Link>
            <Link href="/donate" className="btn btn-secondary btn-lg" style={{ 
              borderRadius:'100px', fontSize:'1rem', padding:'16px 36px', 
              display:'inline-flex', alignItems:'center', gap:'10px',
            }}>
              <Icon name="heart" size={18} color="var(--rose-500)" /> Donate
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:'absolute', bottom:'32px', left:'50%', transform:'translateX(-50%)', zIndex:2 }}>
          <div style={{
            width:'22px', height:'36px', borderRadius:'11px', border:'2px solid var(--border-light)',
            display:'flex', justifyContent:'center', paddingTop:'6px', opacity:0.4
          }}>
            <div style={{ width:'2px', height:'6px', borderRadius:'2px', background:'var(--text-accent)', animation:'fadeInDown 2s ease infinite' }} />
          </div>
        </div>
      </section>

      {/* ===== STATS — glass bar ===== */}
      <section style={{ borderBottom:'1px solid var(--border-light)' }}>
        <div className="container glass" style={{ 
          display:'flex', justifyContent:'space-around', padding:'36px 32px', 
          flexWrap:'wrap', gap:'24px', borderRadius:'var(--radius-xl)',
          margin:'0 auto', position:'relative', top:'-36px',
          maxWidth:'900px'
        }}>
          {[
            { target: 1847, label: 'Pets Adopted', icon: 'home' },
            { target: 41, label: 'Available Now', icon: 'paw' },
            { target: 250, label: 'Volunteers', suffix: '+', icon: 'people' },
            { target: 45, label: 'Years Serving SSM', suffix: '+', icon: 'calendar' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign:'center', minWidth:'110px' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em' }}>
                <AnimatedCounter target={stat.target} suffix={stat.suffix || ''} />
              </div>
              <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:'4px', letterSpacing:'0.06em', textTransform:'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PETS ===== */}
      <section className="section" id="featured-pets" style={{ paddingTop:'60px' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign:'center', marginBottom:'56px' }}>
            <h2 style={{ fontSize:'clamp(2rem, 4vw, 2.8rem)', marginBottom:'16px' }}>
              Meet Our <span className="text-gradient">Featured Friends</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', maxWidth:'480px', margin:'0 auto' }}>
              These amazing animals are ready for their forever homes.
            </p>
          </div>
          <FeaturedCarousel />
          <div className="text-center reveal" style={{ marginTop:'48px' }}>
            <Link href="/adopt" className="btn btn-primary btn-lg" style={{ display:'inline-flex', alignItems:'center', gap:'8px' }}>
              View All {pets.length} Pets <Icon name="arrow" size={16} color="#fff" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== LONGEST WAITING ===== */}
      <section className="section" style={{ background:'var(--bg-secondary)', padding:'80px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign:'center', marginBottom:'48px' }}>
            <h2 style={{ fontSize:'clamp(1.8rem, 3vw, 2.5rem)', marginBottom:'12px' }}>
              They&apos;ve Been <span className="text-gradient-warm">Waiting the Longest</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', maxWidth:'440px', margin:'0 auto' }}>
              Could you be the one they&apos;ve been waiting for?
            </p>
          </div>
          <div className="grid-3 stagger">
            {URGENT.map(pet => (
              <Link href={`/adopt/${pet.id}`} key={pet.id} className="pet-card">
                <div className="pet-card-img-wrap">
                  <PetImage pet={pet} />
                </div>
                <div className="pet-card-body">
                  <h3 className="pet-card-name">{pet.name}</h3>
                  <p className="pet-card-meta">{pet.breed} · {pet.age}</p>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:'6px', display:'flex', alignItems:'center', gap:'6px' }}>
                    <Icon name="clock" size={13} color="var(--text-muted)" />
                    Waiting since {new Date(pet.dateAdded).toLocaleDateString('en-US', { month:'short', day:'numeric' })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY ADOPT — dark section with glass cards ===== */}
      <section className="section section-dark" id="why-adopt" style={{ position:'relative', overflow:'hidden' }}>
        {/* Ambient gradient orb for dark section */}
        <div style={{
          position:'absolute', top:'-20%', right:'-10%', width:'600px', height:'600px',
          background:'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 60%)',
          borderRadius:'50%'
        }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div className="text-center reveal" style={{ marginBottom:'56px' }}>
            <h2 style={{ fontSize:'clamp(2rem, 4vw, 2.8rem)', marginBottom:'16px' }}>
              Why <span style={{ color:'var(--blue-400)' }}>Adopt</span>?
            </h2>
            <p style={{ color:'#7B8FA3', maxWidth:'460px', margin:'0 auto' }}>
              When you adopt, you save a life and gain a loyal companion.
            </p>
          </div>
          <div className="grid-3 stagger">
            {[
              { icon:'heart', title:'Save a Life', desc:'Every adoption opens space for another animal in need. You\'re not just gaining a pet — you\'re saving a life.', color:'var(--blue-400)' },
              { icon:'home', title:'A Fresh Start', desc:'Many shelter animals have been abandoned or surrendered. Your home becomes their safe haven and fresh beginning.', color:'var(--teal-400)' },
              { icon:'people', title:'Unconditional Love', desc:'The bond with a rescue animal is truly special. Adopted pets know they\'ve been given a second chance.', color:'var(--violet-400)' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ 
                background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.06)',
                backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
                textAlign:'center', padding:'48px 32px',
              }}>
                <IconCircle name={item.icon} size={52} color={item.color} bgOpacity={0.12} style={{ margin:'0 auto 24px' }} />
                <h3 style={{ marginBottom:'12px', fontSize:'1.15rem' }}>{item.title}</h3>
                <p style={{ color:'#8298AD', lineHeight:'1.7', fontSize:'0.92rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section" style={{ padding:'80px 0' }}>
        <div className="container" style={{ maxWidth:'620px' }}>
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

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" style={{ background:'var(--bg-secondary)', padding:'80px 0' }} id="how-it-works">
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom:'56px' }}>
            <h2 style={{ fontSize:'clamp(2rem, 4vw, 2.8rem)', marginBottom:'12px' }}>
              How <span className="text-gradient">It Works</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', maxWidth:'440px', margin:'0 auto' }}>
              Four simple steps to welcome a new family member.
            </p>
          </div>
          <div className="grid-4 stagger">
            {[
              { step:'01', icon:'search', title:'Browse', desc:'Explore our available pets by type, age, and personality.', color:'var(--blue-400)' },
              { step:'02', icon:'edit', title:'Apply', desc:'Quick online application — we make it easy.', color:'var(--teal-400)' },
              { step:'03', icon:'check', title:'Approve', desc:'We review and contact you within a few days.', color:'var(--green-500)' },
              { step:'04', icon:'home', title:'Welcome', desc:'Schedule a meet-and-greet and bring your friend home!', color:'var(--violet-400)' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign:'center', padding:'36px 24px', position:'relative' }}>
                <div style={{
                  fontFamily:'var(--font-display)', fontSize:'2.5rem', fontWeight:800,
                  color:'var(--border-light)', position:'absolute', top:'8px', right:'14px',
                  lineHeight:1, opacity:0.6
                }}>{item.step}</div>
                <IconCircle name={item.icon} size={44} color={item.color} bgOpacity={0.1} style={{ margin:'0 auto 16px' }} />
                <h3 style={{ marginBottom:'8px', fontSize:'1rem' }}>{item.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GET INVOLVED ===== */}
      <section className="section" style={{ padding:'80px 0' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom:'48px' }}>
            <h2 style={{ fontSize:'clamp(2rem, 4vw, 2.8rem)', marginBottom:'12px' }}>
              Ways to <span className="text-gradient">Get Involved</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', maxWidth:'460px', margin:'0 auto' }}>
              There are many ways to make a difference in an animal&apos;s life.
            </p>
          </div>
          <div className="grid-4 stagger">
            {[
              { icon:'paw', title:'Adopt', desc:'Give a shelter pet a loving forever home. Browse available animals today.', color:'var(--blue-400)', href:'/adopt' },
              { icon:'home', title:'Foster', desc:'Open your home temporarily and help pets prepare for adoption.', color:'var(--green-500)', href:'/foster' },
              { icon:'people', title:'Volunteer', desc:'Join 250+ volunteers helping with animal care, events, and outreach.', color:'#8B5CF6', href:'/volunteer' },
              { icon:'heart', title:'Donate', desc:'Every dollar goes directly toward medical care, food, and shelter operations.', color:'var(--rose-400)', href:'/donate' },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="card card-3d" style={{ padding:'32px 24px', textAlign:'center', textDecoration:'none', color:'inherit', display:'block' }}>
                <IconCircle name={item.icon} size={48} color={item.color} bgOpacity={0.12} style={{ margin:'0 auto 16px' }} />
                <h3 style={{ marginBottom:'8px', fontSize:'1.05rem' }}>{item.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:'1.6', marginBottom:'12px' }}>{item.desc}</p>
                <span style={{ color:item.color, fontWeight:600, fontSize:'0.82rem', display:'inline-flex', alignItems:'center', gap:'4px' }}>
                  Learn More <Icon name="arrow" size={12} color={item.color} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY PARTNERS ===== */}
      <section style={{ background:'var(--bg-secondary)', padding:'48px 0' }}>
        <div className="container reveal">
          <div className="text-center" style={{ marginBottom:'28px' }}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:'8px' }}>Supported By</div>
            <h3 style={{ fontSize:'1.2rem' }}>Our Community <span className="text-gradient">Partners</span></h3>
          </div>
          <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:'32px', alignItems:'center' }}>
            {[
              { name:'City of Sault Ste. Marie', emoji:'🏛️' },
              { name:'PetSmart Charities', emoji:'🐾' },
              { name:'Algoma Veterinary Clinic', emoji:'🏥' },
              { name:'Northern Credit Union', emoji:'🏦' },
              { name:'Soo Today Media', emoji:'📰' },
              { name:'Algoma University', emoji:'🎓' },
            ].map((partner, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'12px 20px', background:'var(--bg-card)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border-light)' }}>
                <span style={{ fontSize:'1.2rem' }}>{partner.emoji}</span>
                <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text-muted)' }}>{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHELTER LIFE ===== */}
      <section className="section" style={{ padding:'80px 0' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom:'48px' }}>
            <h2 style={{ fontSize:'clamp(2rem, 4vw, 2.8rem)', marginBottom:'12px' }}>
              Inside the <span className="text-gradient-warm">Shelter</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', maxWidth:'480px', margin:'0 auto' }}>
              A glimpse into daily life and the work that goes into caring for every animal.
            </p>
          </div>
          <div className="grid-3 stagger">
            {[
              { title:'Morning Rounds', desc:'Every day starts with health checks, feeding, and enrichment activities for all 100+ animals in our care.', icon:'clock', color:'var(--blue-400)', stat:'6:30 AM' },
              { title:'Medical Care', desc:'Our veterinary team provides vaccinations, spay/neuter surgeries, dental care, and emergency treatments.', icon:'medical', color:'var(--green-500)', stat:'2,400+' },
              { title:'Training & Socialization', desc:'Volunteers and staff work daily on behavior training to help animals become adoptable and confident.', icon:'star', color:'#F59E0B', stat: '8 hrs/day' },
            ].map((item, i) => (
              <div key={i} className="card card-3d" style={{ padding:'32px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:'12px', right:'16px', fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:800, color:'var(--border-light)', opacity:0.5 }}>{item.stat}</div>
                <IconCircle name={item.icon} size={44} color={item.color} bgOpacity={0.12} style={{ marginBottom:'16px' }} />
                <h3 style={{ marginBottom:'10px', fontSize:'1.05rem' }}>{item.title}</h3>
                <p style={{ color:'var(--text-muted)', fontSize:'0.88rem', lineHeight:'1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA — bold gradient ===== */}
      <section style={{
        background:'linear-gradient(135deg, var(--blue-500), #0EA5E9, var(--blue-600))',
        backgroundSize:'200% 200%', animation:'auroraShift 8s ease infinite',
        color:'#fff', textAlign:'center', padding:'80px 0',
        position:'relative', overflow:'hidden'
      }}>
        {/* Glass overlay for depth */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }} />
        <div className="container reveal" style={{ maxWidth:'580px', position:'relative', zIndex:1 }}>
          <h2 style={{ fontSize:'clamp(2rem, 4vw, 2.8rem)', marginBottom:'16px' }}>
            Ready to Change a Life?
          </h2>
          <p style={{ maxWidth:'400px', margin:'0 auto 36px', opacity:0.85, fontSize:'1.05rem', lineHeight:1.75 }}>
            Your new best friend is waiting. Start the journey today.
          </p>
          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/adopt" className="btn btn-lg" style={{ 
              background:'#fff', color:'var(--blue-700)', borderRadius:'100px', padding:'16px 36px',
              fontWeight:700, display:'inline-flex', alignItems:'center', gap:'8px',
              boxShadow:'0 4px 20px rgba(0,0,0,0.15)'
            }}>
              <Icon name="paw" size={18} color="var(--blue-700)" /> Browse Pets
            </Link>
            <Link href="/donate" className="btn btn-lg" style={{ 
              background:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.3)', 
              color:'#fff', borderRadius:'100px', padding:'16px 36px',
              display:'inline-flex', alignItems:'center', gap:'8px',
              backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)'
            }}>
              <Icon name="heart" size={18} color="#fff" /> Donate
            </Link>
          </div>
        </div>
      </section>

      {/* ===== NEWS ===== */}
      <section className="section" id="news" style={{ padding:'80px 0' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom:'48px' }}>
            <h2 style={{ fontSize:'clamp(2rem, 4vw, 2.8rem)', marginBottom:'12px' }}>
              Latest <span className="text-gradient">Updates</span>
            </h2>
          </div>
          <div className="grid-3 stagger">
            {[
              { title: 'Online 50/50 Raffle', desc: 'Support the shelter and win big. Tickets available now — the jackpot keeps growing!', date: 'Mar 10', icon:'trophy', href: '/events' },
              { title: 'Viewing Rooms Update', desc: 'All adoptions are done by application to ensure the best match for every family.', date: 'Mar 5', icon:'home', href: '/about' },
              { title: 'Join Our Foster Team', desc: 'Dozens of animals get a second chance each year thanks to volunteer foster homes.', date: 'Feb 28', icon:'heart', href: '/foster' },
            ].map((item, i) => (
              <Link href={item.href} key={i} className="card" style={{ padding:'32px', textDecoration: 'none', color: 'inherit', transition: 'all 0.3s ease' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
                  <IconCircle name={item.icon} size={36} color="var(--blue-500)" bgOpacity={0.08} />
                  <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', letterSpacing:'0.03em' }}>{item.date}</span>
                </div>
                <h3 style={{ marginBottom:'10px', fontSize:'1.05rem' }}>{item.title}</h3>
                <p style={{ color:'var(--text-secondary)', lineHeight:'1.7', fontSize:'0.9rem', marginBottom: '12px' }}>{item.desc}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-accent)', fontWeight: 600, fontSize: '0.85rem' }}>
                  Read more <Icon name="arrow" size={14} color="var(--text-accent)" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
