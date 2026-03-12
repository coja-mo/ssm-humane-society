'use client';
import { useState } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';

export default function DonatePage() {
  useScrollReveal();
  const [amount, setAmount] = useState(50);
  const presets = [10, 25, 50, 100, 250, 500];

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '60px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>❤️ Support Our Mission</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '12px' }}>Make a <span className="text-gradient">Donation</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Your generosity directly impacts the lives of animals in our care. Every dollar counts.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card reveal" style={{ padding: '40px' }}>
            <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Choose Your Gift</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {presets.map(p => (
                <button key={p} className={`btn ${amount === p ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAmount(p)} style={{ fontSize: '1.1rem' }}>
                  ${p}
                </button>
              ))}
            </div>
            <div className="form-group">
              <label className="form-label">Custom Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: 'var(--text-muted)' }}>$</span>
                <input className="form-input" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ paddingLeft: '36px', fontSize: '1.2rem', fontWeight: '700' }} />
              </div>
            </div>
            <div style={{ background: 'var(--blue-50)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '8px', color: 'var(--blue-700)' }}>💙 Your ${amount} donation can provide:</h4>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '2', paddingLeft: '20px', fontSize: '0.9rem' }}>
                {amount >= 10 && <li>Food for one animal for a week</li>}
                {amount >= 25 && <li>Vaccinations for a puppy or kitten</li>}
                {amount >= 50 && <li>Medical checkup for a shelter animal</li>}
                {amount >= 100 && <li>Spay/neuter surgery</li>}
                {amount >= 250 && <li>Emergency veterinary care</li>}
                {amount >= 500 && <li>Full care for an animal from intake to adoption</li>}
              </ul>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              ❤️ Donate ${amount} Now
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Tax receipt will be issued for donations of $20 or more. Charitable Registration #: 89238 0023 RR0001
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
