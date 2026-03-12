'use client';
import { useState } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

export default function FosterPage() {
  useScrollReveal();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', experience: '', preferredType: 'any' });

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const [firstName, ...rest] = form.name.split(' ');
      const res = await fetch('/api/foster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, lastName: rest.join(' ') || '',
          email: form.email, phone: form.phone,
          experience: form.experience,
          preferredPetTypes: [form.preferredType],
        }),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) { console.error(err); }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <section style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="container text-center" style={{ maxWidth: '600px' }}>
          <IconCircle name="home" size={80} color="var(--green-500)" bgOpacity={0.15} style={{ margin: '0 auto 24px' }} />
          <h1 style={{ marginBottom: '16px' }}>Application <span className="text-gradient">Received!</span></h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>
            Thank you for your interest in fostering! Our team will review your application and contact you within 3–5 business days.
          </p>
          <Link href="/" className="btn btn-primary">Return Home</Link>
        </div>
      </section>
    );
  }
  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="home" size={14} color="var(--blue-700)" /> Make a Difference
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Become a <span className="text-gradient">Foster Parent</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Every year dozens of shelter animals are given a second chance, thanks to the caring hearts of our volunteer foster homes.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        <div className="container">
          <div className="grid-4 stagger" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {[
              { n: 62, label: 'Animals Fostered', icon: 'paw', color: 'var(--blue-500)' },
              { n: 48, label: 'Foster Families', icon: 'home', color: 'var(--green-500)' },
              { n: 95, label: '% Adoption Rate', suffix: '', icon: 'check', color: 'var(--blue-400)' },
              { n: 100, label: '% Care Covered', suffix: '', icon: 'heart', color: 'var(--rose-400)' },
            ].map(s => (
              <div key={s.label} className="card card-3d" style={{ textAlign: 'center', padding: '24px' }}>
                <IconCircle name={s.icon} size={44} color={s.color} bgOpacity={0.15} style={{ margin: '0 auto 12px' }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-accent)' }}>
                  <AnimatedCounter target={s.n} suffix={s.suffix ?? '+'} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="reveal">
            <div className="card" style={{ padding: '40px', marginBottom: '32px' }}>
              <h2 style={{ marginBottom: '16px' }}>Why <span className="text-gradient">Foster</span>?</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '20px' }}>
                The shelter environment can be stressful for certain animals. Being able to place these pets into foster homes is incredibly important! Fostering is truly a hands-on, life-saving volunteer experience.
              </p>
              <div className="grid-2" style={{ gap: '12px' }}>
                {['We provide all food & supplies', 'Veterinary care is covered', 'Ongoing support from staff', 'Flexible commitment times', 'Save a life directly', 'Best volunteer experience'].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <Icon name="check" size={16} color="var(--green-500)" />
                    <span style={{ fontSize: '0.9rem' }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="story-card" style={{ padding: '32px', marginBottom: '32px', textAlign: 'center' }}>
              <IconCircle name="heart" size={56} color="var(--rose-400)" bgOpacity={0.15} style={{ margin: '0 auto 16px' }} />
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.8', maxWidth: '500px', margin: '0 auto 16px', fontSize: '1rem' }}>
                &ldquo;We fostered a litter of kittens and ended up adopting two! The support from the shelter team was amazing. Fostering is the most rewarding thing we&apos;ve ever done.&rdquo;
              </p>
              <p style={{ fontWeight: 700 }}>— The Patel Family</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Foster family since 2023</p>
            </div>

            <div className="card" style={{ padding: '40px' }}>
              <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Apply to Foster</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Name *</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your full name" /></div>
                  <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@email.com" /></div>
                </div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="(705) 555-0123" /></div>
                <div className="form-group"><label className="form-label">Experience with animals *</label><textarea className="form-input form-textarea" required value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} placeholder="Tell us about your experience..." /></div>
                <div className="form-group"><label className="form-label">What type of animal would you like to foster?</label>
                  <select className="form-input form-select" value={form.preferredType} onChange={e => setForm({...form, preferredType: e.target.value})}><option value="dogs">Dogs</option><option value="cats">Cats</option><option value="kittens">Kittens</option><option value="puppies">Puppies</option><option value="any">Any</option></select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Icon name="home" size={16} color="#fff" /> {submitting ? 'Submitting...' : 'Submit Foster Application'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
