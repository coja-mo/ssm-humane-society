'use client';
import { useState, useEffect } from 'react';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';

const IMPACTS = [
  { amount: 10, icon: '🍖', title: 'Feed a Friend', desc: 'Provides a week of nutritious food for one shelter animal.' },
  { amount: 25, icon: '💉', title: 'Vaccinations', desc: 'Covers vaccinations for a puppy or kitten arriving at the shelter.' },
  { amount: 50, icon: '🩺', title: 'Medical Checkup', desc: 'Funds a complete veterinary examination for a shelter animal.' },
  { amount: 100, icon: '✂️', title: 'Spay/Neuter', desc: 'Covers the cost of spay or neuter surgery for one animal.' },
  { amount: 250, icon: '🏥', title: 'Emergency Care', desc: 'Provides emergency veterinary treatment when animals arrive injured.' },
  { amount: 500, icon: '🏠', title: 'Full Journey', desc: 'Covers an animal\'s complete care from intake to adoption day.' },
];

export default function DonatePage() {
  useScrollReveal();
  const [amount, setAmount] = useState(50);
  const [isMonthly, setIsMonthly] = useState(false);
  const [thermometerWidth, setThermometerWidth] = useState(0);
  const presets = [10, 25, 50, 100, 250, 500];

  useEffect(() => {
    setTimeout(() => setThermometerWidth(73), 500);
  }, []);

  const activeImpacts = IMPACTS.filter(i => amount >= i.amount);

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '60px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-rose" style={{ marginBottom: '12px', display: 'inline-block' }}>❤️ Support Our Mission</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '12px' }}>Make a <span className="text-gradient">Donation</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', marginBottom: '32px' }}>
            Your generosity directly impacts the lives of animals in our care. Every dollar counts.
          </p>
          {/* Fundraising thermometer */}
          <div className="reveal" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>🎯 Spring Campaign</span>
              <span style={{ fontWeight: 700, color: 'var(--text-accent)' }}><AnimatedCounter target={73} suffix="%" /> of $50,000 goal</span>
            </div>
            <div className="thermometer">
              <div className="thermometer-fill" style={{ width: thermometerWidth + '%' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>$36,500 raised</span>
              <span>$50,000 goal</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="grid-2" style={{ gap: '40px', alignItems: 'start' }}>
            {/* Donation form */}
            <div className="card reveal-left" style={{ padding: '40px' }}>
              <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Choose Your Gift</h2>
              
              {/* Monthly / One-time toggle */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '100px', padding: '4px' }}>
                  <button 
                    onClick={() => setIsMonthly(false)}
                    className="btn btn-sm" 
                    style={{ 
                      borderRadius: '100px', 
                      background: !isMonthly ? 'var(--bg-card)' : 'transparent',
                      boxShadow: !isMonthly ? 'var(--shadow-sm)' : 'none',
                      color: !isMonthly ? 'var(--text-primary)' : 'var(--text-muted)'
                    }}
                  >
                    One-Time
                  </button>
                  <button 
                    onClick={() => setIsMonthly(true)}
                    className="btn btn-sm"
                    style={{ 
                      borderRadius: '100px',
                      background: isMonthly ? 'var(--bg-card)' : 'transparent',
                      boxShadow: isMonthly ? 'var(--shadow-sm)' : 'none',
                      color: isMonthly ? 'var(--text-primary)' : 'var(--text-muted)'
                    }}
                  >
                    Monthly 💙
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {presets.map(p => (
                  <button key={p} className={`btn ${amount === p ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAmount(p)} style={{ fontSize: '1.05rem', borderRadius: 'var(--radius-md)' }}>
                    ${p}
                  </button>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Custom Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: 'var(--text-muted)', fontSize: '1.2rem' }}>$</span>
                  <input className="form-input" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ paddingLeft: '36px', fontSize: '1.2rem', fontWeight: '700' }} />
                </div>
              </div>
              {isMonthly && (
                <div style={{ background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--green-700)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💚</span>
                  <span>Monthly donors save <strong>${(amount * 12).toLocaleString()}/year</strong> worth of animal lives!</span>
                </div>
              )}
              <button className="btn btn-lg" style={{ 
                width: '100%', borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, #F43F5E, #E11D48)', color: '#fff',
                boxShadow: '0 4px 20px rgba(244,63,94,0.3)', fontSize: '1.05rem'
              }}>
                ❤️ Donate ${amount}{isMonthly ? '/month' : ''} Now
              </button>
              <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                🔒 Secure payment · Tax receipt for donations of $20+
                <br />Charitable Registration #: 89238 0023 RR0001
              </p>
            </div>

            {/* Impact cards */}
            <div className="reveal-right">
              <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Your Impact</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {IMPACTS.map((impact, i) => {
                  const isActive = amount >= impact.amount;
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'var(--bg-card)' : 'var(--bg-secondary)',
                      border: `1px solid ${isActive ? 'var(--border-accent)' : 'var(--border-light)'}`,
                      opacity: isActive ? 1 : 0.5,
                      transition: 'all 0.3s ease',
                      boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setAmount(impact.amount)}
                    >
                      <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{impact.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{impact.title}</span>
                          <span style={{ color: 'var(--text-accent)' }}>${impact.amount}+</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{impact.desc}</div>
                      </div>
                      {isActive && <span style={{ color: 'var(--green-500)', fontSize: '1.2rem' }}>✓</span>}
                    </div>
                  );
                })}
              </div>

              {/* Donor stats */}
              <div className="card" style={{ marginTop: '20px', padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(41,171,226,0.05), rgba(16,185,129,0.05))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-accent)' }}><AnimatedCounter target={847} /></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Donors This Year</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--green-600)' }}><AnimatedCounter target={36500} prefix="$" /></div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Raised So Far</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
