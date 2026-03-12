'use client';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';

export default function FosterPage() {
  useScrollReveal();
  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>🏠 Make a Difference</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Become a <span className="text-gradient">Foster Parent</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Every year dozens of shelter animals are given a second chance, thanks to the caring hearts of our volunteer foster homes. Could you be next?
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="reveal">
            <div className="card" style={{ padding: '40px', marginBottom: '32px' }}>
              <h2 style={{ marginBottom: '16px' }}>Why <span className="text-gradient">Foster</span>?</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '20px' }}>
                The shelter environment can be stressful for certain animals. Being able to place these pets into foster homes is incredibly important! Fostering is truly a hands-on, life-saving volunteer experience.
              </p>
              <div className="grid-2" style={{ gap: '16px' }}>
                {['We provide all food & supplies', 'Veterinary care is covered', 'Ongoing support from staff', 'Flexible commitment times', 'Save a life directly', 'Best volunteer experience'].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ color: 'var(--green-500)' }}>✓</span>
                    <span style={{ fontSize: '0.9rem' }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: '40px' }}>
              <h2 style={{ marginBottom: '24px' }}>Apply to Foster</h2>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="Your full name" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@email.com" /></div>
              </div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" placeholder="(705) 555-0123" /></div>
              <div className="form-group"><label className="form-label">Experience with animals</label><textarea className="form-input form-textarea" placeholder="Tell us about your experience..." /></div>
              <div className="form-group"><label className="form-label">What type of animal would you like to foster?</label>
                <select className="form-input form-select"><option>Dogs</option><option>Cats</option><option>Kittens</option><option>Puppies</option><option>Any</option></select>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }}>Submit Foster Application 🏠</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
