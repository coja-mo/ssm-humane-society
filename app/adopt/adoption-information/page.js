'use client';
import { useState } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const STEPS = [
  {
    step: '01', icon: 'search', title: 'Browse Our Pets', color: 'var(--blue-400)',
    desc: 'Explore our available pets online by type, age, and personality. Each pet profile includes photos, personality traits, and any special requirements.',
    details: ['Filter by dogs, cats, and critters', 'Read detailed personality descriptions', 'See medical history and restrictions', 'Save favorites to your dashboard'],
  },
  {
    step: '02', icon: 'edit', title: 'Submit an Application', color: 'var(--green-500)',
    desc: 'Found your match? Fill out our online adoption application. It takes about 10 minutes and covers your living situation, experience, and preferences.',
    details: ['Personal & contact information', 'Home environment details', 'Pet ownership experience', 'Your preferences and expectations'],
  },
  {
    step: '03', icon: 'check', title: 'Application Review', color: '#F59E0B',
    desc: 'Our adoption team reviews each application carefully to ensure the best match for both you and the pet. We typically respond within 1–3 business days.',
    details: ['Staff reviews your application', 'Reference and landlord checks if applicable', 'We may call to discuss details', 'Track your status in your dashboard'],
  },
  {
    step: '04', icon: 'heart', title: 'Meet & Greet', color: 'var(--rose-400)',
    desc: 'Once approved, we\'ll schedule a meet-and-greet at the shelter. This is a chance for you and the animal to interact and make sure it\'s a great fit.',
    details: ['Spend quality time with the pet', 'Bring all household members', 'Ask our staff any questions', 'Introduce your current pet if applicable'],
  },
  {
    step: '05', icon: 'home', title: 'Welcome Home!', color: 'var(--blue-500)',
    desc: 'Finalize the adoption, pay the adoption fee, and bring your new family member home! We\'ll send you off with everything you need for the first few days.',
    details: ['Complete adoption contract', 'Pay adoption fee', 'Receive take-home care package', 'Post-adoption support available'],
  },
];

const FEES = [
  { type: 'Dogs', emoji: '🐕', fee: '$250 – $350', includes: ['Spay/Neuter', 'Vaccinations (DHPP, Rabies)', 'Microchip', 'Deworming', 'Flea Treatment', 'Vet Health Check'], color: 'var(--blue-500)', popular: true },
  { type: 'Cats', emoji: '🐈', fee: '$150 – $200', includes: ['Spay/Neuter', 'Vaccinations (FVRCP, Rabies)', 'Microchip', 'Deworming', 'Flea Treatment', 'Vet Health Check'], color: 'var(--green-500)', popular: false },
  { type: 'Critters', emoji: '🐰', fee: '$25 – $75', includes: ['Health Check', 'Age-Appropriate Vaccines', 'Parasite Treatment', 'Care Guide'], color: 'var(--rose-400)', popular: false },
];

const FAQS = [
  { q: 'How old do I have to be to adopt?', a: 'You must be at least 18 years old and have valid government-issued photo ID.' },
  { q: 'Can I adopt if I rent my home?', a: 'Yes! You\'ll need to provide proof that your landlord allows pets (a letter or lease clause). We may contact your landlord for verification.' },
  { q: 'What if the adoption doesn\'t work out?', a: 'We want every adoption to succeed. If issues arise, contact us for support. If the placement truly isn\'t working, we will take the animal back — we never want an animal to end up homeless.' },
  { q: 'Can I adopt a pet for someone else as a gift?', a: 'We strongly discourage surprise pet gifts. The person who will be the primary caretaker must be part of the adoption process.' },
  { q: 'Are viewing rooms open for walk-ins?', a: 'Our viewing rooms are currently closed for walk-ins. All adoptions are done by application to ensure the best match for every family.' },
  { q: 'How long does the process take?', a: 'Typically 2–5 business days from application submission to bringing your pet home, depending on application volume and any required checks.' },
];

export default function AdoptionInformationPage() {
  useScrollReveal();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      {/* Hero */}
      <section style={{
        paddingTop: '120px', paddingBottom: '60px',
        background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', justifyContent: 'center', marginBottom: '16px' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
            <span>/</span>
            <Link href="/adopt" style={{ color: 'var(--text-muted)' }}>Adopt</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Adoption Guide</span>
          </div>
          <span className="badge badge-blue" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="book" size={14} color="var(--blue-700)" /> Complete Guide
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '16px' }}>
            Adoption <span className="text-gradient">Guide</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8', fontSize: '1.05rem' }}>
            Everything you need to know about adopting a pet from the Sault Ste. Marie Humane Society — from browsing to bringing your new friend home.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div className="container glass" style={{
          display: 'flex', justifyContent: 'space-around', padding: '32px',
          flexWrap: 'wrap', gap: '24px', borderRadius: 'var(--radius-xl)',
          maxWidth: '800px', margin: '0 auto', position: 'relative', top: '-32px',
        }}>
          {[
            { target: 1847, label: 'Successful Adoptions', icon: 'home', color: 'var(--blue-500)' },
            { target: 3, label: 'Day Avg. Response', suffix: '', icon: 'clock', color: 'var(--green-500)' },
            { target: 95, label: '% Happy Matches', suffix: '%', icon: 'heart', color: 'var(--rose-400)' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: '120px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: stat.color }}>
                <AnimatedCounter target={stat.target} suffix={stat.suffix || ''} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="section" style={{ paddingTop: '40px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="text-center reveal" style={{ fontSize: '2rem', marginBottom: '12px' }}>
            The Adoption <span className="text-gradient">Process</span>
          </h2>
          <p className="text-center reveal" style={{ color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px' }}>
            Five simple steps to welcome your new best friend home.
          </p>
          <div style={{ display: 'grid', gap: '24px' }}>
            {STEPS.map((s, i) => (
              <div key={i} className="card card-3d reveal" style={{ overflow: 'hidden' }}>
                <div style={{ height: '4px', background: s.color }} />
                <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${s.color}22, ${s.color}11)`,
                        border: `2px solid ${s.color}33`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon name={s.icon} size={22} color={s.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: s.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          STEP {s.step}
                        </div>
                        <h3 style={{ fontSize: '1.2rem' }}>{s.title}</h3>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.92rem' }}>{s.desc}</p>
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {s.details.map((d, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 14px', background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)', fontSize: '0.85rem',
                      }}>
                        <Icon name="check" size={14} color={s.color} />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Adoption Fees */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <h2 className="text-center reveal" style={{ fontSize: '2rem', marginBottom: '12px' }}>
            Adoption <span className="text-gradient">Fees</span>
          </h2>
          <p className="text-center reveal" style={{ color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px' }}>
            Every fee directly supports the medical care and wellbeing of shelter animals.
          </p>
          <div className="grid-3 stagger">
            {FEES.map((f, i) => (
              <div key={i} className="card card-3d" style={{ overflow: 'hidden', position: 'relative' }}>
                {f.popular && (
                  <div style={{
                    position: 'absolute', top: '16px', right: '-28px', transform: 'rotate(45deg)',
                    background: f.color, color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                    padding: '4px 40px', letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>
                    Popular
                  </div>
                )}
                <div style={{ height: '4px', background: f.color }} />
                <div style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{f.emoji}</div>
                  <h3 style={{ marginBottom: '4px' }}>{f.type}</h3>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800,
                    color: f.color, marginBottom: '20px',
                  }}>
                    {f.fee}
                  </div>
                  <div style={{ display: 'grid', gap: '8px', textAlign: 'left' }}>
                    {f.includes.map((item, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <Icon name="check" size={14} color="var(--green-500)" /> {item}
                      </div>
                    ))}
                  </div>
                  <Link href={`/apply/${f.type.toLowerCase().replace('critters', 'critter')}`}
                    className="btn btn-primary" style={{
                      width: '100%', marginTop: '24px', borderRadius: 'var(--radius-lg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                    <Icon name="edit" size={16} color="#fff" /> Apply for {f.type}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Bring */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="grid-2" style={{ gap: '32px', alignItems: 'start' }}>
            <div className="card reveal-left" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <IconCircle name="check" size={40} color="var(--green-500)" bgOpacity={0.12} />
                <h3>What to Bring</h3>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {[
                  'Government-issued photo ID',
                  'Proof of address (utility bill, lease)',
                  'Landlord permission letter (if renting)',
                  'Carrier or crate (for cats/critters)',
                  'Leash and collar (for dogs)',
                  'Adoption fee (cash, debit, or credit)',
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)', fontSize: '0.9rem',
                  }}>
                    <Icon name="check" size={14} color="var(--green-500)" /> {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="card reveal-right" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <IconCircle name="shield" size={40} color="var(--blue-500)" bgOpacity={0.12} />
                <h3>Requirements</h3>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {[
                  'Must be 18 years or older',
                  'Stable housing situation',
                  'Ability to provide veterinary care',
                  'All household members agree',
                  'Current pets up-to-date on vaccines',
                  'Meet-and-greet with existing pets may be required',
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)', fontSize: '0.9rem',
                  }}>
                    <Icon name="shield" size={14} color="var(--blue-500)" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="text-center reveal" style={{ fontSize: '2rem', marginBottom: '40px' }}>
            Common <span className="text-gradient">Questions</span>
          </h2>
          <div className="reveal" style={{ display: 'grid', gap: '10px' }}>
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="card" style={{
                  overflow: 'hidden', transition: 'all 0.3s ease',
                  boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  borderColor: isOpen ? 'var(--border-accent)' : 'var(--border-light)',
                }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)} style={{
                    width: '100%', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '14px',
                    fontWeight: '600', fontSize: '0.95rem',
                    color: isOpen ? 'var(--text-accent)' : 'var(--text-primary)',
                    textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit',
                  }}>
                    <Icon name="paw" size={16} color={isOpen ? 'var(--blue-500)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{faq.q}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{
                      transition: 'transform 0.3s ease',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                      color: 'var(--text-muted)', flexShrink: 0,
                    }}>
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? '300px' : '0', overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                    padding: isOpen ? '0 24px 18px 54px' : '0 24px 0 54px',
                  }}>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.9rem' }}>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        padding: '64px 0',
        background: 'linear-gradient(135deg, var(--bg-dark-section), #162338)',
        color: 'var(--text-on-dark)', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container" style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '16px' }}>
            Ready to Meet Your <span style={{ color: 'var(--blue-400)' }}>New Best Friend</span>?
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '480px', margin: '0 auto 32px', fontSize: '1rem', lineHeight: '1.7' }}>
            Your perfect companion is waiting. Start by browsing our available pets.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/adopt" className="btn btn-primary btn-lg" style={{
              borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}>
              <Icon name="paw" size={18} color="#fff" /> Browse Pets
            </Link>
            <Link href="/contact" className="btn btn-lg" style={{
              borderRadius: '100px', background: 'rgba(255,255,255,0.1)',
              border: '1.5px solid rgba(255,255,255,0.2)', color: '#fff',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backdropFilter: 'blur(20px)',
            }}>
              <Icon name="phone" size={18} color="#fff" /> Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
