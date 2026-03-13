'use client';
import usePageTitle from '@/hooks/usePageTitle';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const IMPACTS = [
  { amount: 10, icon: 'food', title: 'Feed a Friend', desc: 'Provides a week of nutritious food for one shelter animal.', color: 'var(--blue-400)' },
  { amount: 25, icon: 'medical', title: 'Vaccinations', desc: 'Covers vaccinations for a puppy or kitten arriving at the shelter.', color: 'var(--green-500)' },
  { amount: 50, icon: 'shield', title: 'Medical Checkup', desc: 'Funds a complete veterinary examination for a shelter animal.', color: 'var(--blue-500)' },
  { amount: 100, icon: 'scissors', title: 'Spay/Neuter', desc: 'Covers the cost of spay or neuter surgery for one animal.', color: 'var(--rose-400)' },
  { amount: 250, icon: 'fire', title: 'Emergency Care', desc: 'Provides emergency veterinary treatment when animals arrive injured.', color: 'var(--rose-500)' },
  { amount: 500, icon: 'home', title: 'Full Journey', desc: 'Covers an animal\'s complete care from intake to adoption day.', color: 'var(--green-600)' },
];

export default function DonatePage() {
  useScrollReveal();
  usePageTitle('Donate');
  const [amount, setAmount] = useState(50);
  const [isMonthly, setIsMonthly] = useState(false);
  const [thermometerWidth, setThermometerWidth] = useState(0);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donating, setDonating] = useState(false);
  const [donated, setDonated] = useState(false);
  const [receiptId, setReceiptId] = useState('');
  const presets = [10, 25, 50, 100, 250, 500];

  useEffect(() => { setTimeout(() => setThermometerWidth(73), 500); }, []);

  const activeImpacts = IMPACTS.filter(i => amount >= i.amount);

  async function handleDonate() {
    if (!donorName.trim() || !donorEmail.trim()) return;
    setDonating(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          amount,
          type: isMonthly ? 'monthly' : 'one-time',
          method: 'online',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setReceiptId(data.id || `SSM-${Date.now()}`);
        setDonated(true);
      }
    } catch (err) { console.error(err); }
    setDonating(false);
  }

  if (donated) {
    return (
      <section style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="container text-center" style={{ maxWidth: '600px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>💝</div>
          <h1 style={{ marginBottom: '12px' }}>Thank You, <span className="text-gradient">{donorName.split(' ')[0]}!</span></h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px', fontSize: '1.05rem' }}>
            Your {isMonthly ? 'monthly ' : ''}donation of <strong>${amount}</strong> will make a real difference in the lives of shelter animals.
          </p>
          <div className="card" style={{ padding: '24px', maxWidth: '400px', margin: '0 auto 32px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="check" size={16} color="var(--green-500)" /> Donation Receipt
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Amount:</span><strong>${amount}{isMonthly ? '/month' : ''}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Donor:</span><span>{donorName}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Receipt #:</span><span style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{receiptId}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Date:</span><span>{new Date().toLocaleDateString()}</span></div>
            </div>
            {amount >= 20 && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-light)', fontSize: '0.82rem', color: 'var(--green-700)', background: 'rgba(16,185,129,0.05)', padding: '10px 12px', borderRadius: '8px' }}>
                ✅ A tax receipt will be emailed to {donorEmail}
              </div>
            )}
          </div>
          <a href="/" className="btn btn-primary" style={{ borderRadius: '100px' }}>Return Home</a>
        </div>
      </section>
    );
  }

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '60px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-rose" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="heart" size={14} color="var(--rose-600)" /> Support Our Mission
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '12px' }}>Make a <span className="text-gradient">Donation</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', marginBottom: '32px' }}>
            Your generosity directly impacts the lives of animals in our care. Every dollar counts.
          </p>
          <div className="reveal" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="target" size={14} color="var(--text-muted)" /> Spring Campaign</span>
              <span style={{ fontWeight: 700, color: 'var(--text-accent)' }}><AnimatedCounter target={73} suffix="%" /> of $50,000 goal</span>
            </div>
            <div className="thermometer"><div className="thermometer-fill" style={{ width: thermometerWidth + '%' }} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>$36,500 raised</span><span>$50,000 goal</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="grid-2" style={{ gap: '40px', alignItems: 'start' }}>
            <div className="card reveal-left" style={{ padding: '40px' }}>
              <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Choose Your Gift</h2>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '100px', padding: '4px' }}>
                  {[{ v: false, label: 'One-Time' }, { v: true, label: 'Monthly' }].map(opt => (
                    <button key={String(opt.v)} onClick={() => setIsMonthly(opt.v)} className="btn btn-sm" style={{ 
                      borderRadius: '100px', 
                      background: isMonthly === opt.v ? 'var(--bg-card)' : 'transparent',
                      boxShadow: isMonthly === opt.v ? 'var(--shadow-sm)' : 'none',
                      color: isMonthly === opt.v ? 'var(--text-primary)' : 'var(--text-muted)',
                      display: 'inline-flex', alignItems: 'center', gap: '6px'
                    }}>
                      {opt.label} {opt.v && <Icon name="heart" size={12} color={isMonthly ? 'var(--blue-500)' : 'var(--text-muted)'} />}
                    </button>
                  ))}
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
                  <Icon name="sparkle" size={16} color="var(--green-600)" />
                  <span>Monthly donors save <strong>${(amount * 12).toLocaleString()}/year</strong> worth of animal lives!</span>
                </div>
              )}
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <input className="form-input" placeholder="Your Name *" value={donorName} onChange={e => setDonorName(e.target.value)} style={{ borderRadius: 'var(--radius-md)' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <input className="form-input" type="email" placeholder="Email (for receipt) *" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} style={{ borderRadius: 'var(--radius-md)' }} />
              </div>
              <button className="btn btn-lg" onClick={handleDonate} disabled={donating || !donorName.trim() || !donorEmail.trim()} style={{ 
                width: '100%', borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, #F43F5E, #E11D48)', color: '#fff',
                boxShadow: '0 4px 20px rgba(244,63,94,0.3)', fontSize: '1.05rem',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: (!donorName.trim() || !donorEmail.trim()) ? 0.6 : 1,
              }}>
                <Icon name="heart" size={18} color="#fff" /> {donating ? 'Processing...' : `Donate $${amount}${isMonthly ? '/month' : ''} Now`}
              </button>
              <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icon name="lock" size={12} color="var(--text-muted)" /> Secure payment · Tax receipt for donations of $20+</span>
                <span>Charitable Registration #: 89238 0023 RR0001</span>
              </p>
            </div>

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
                      opacity: isActive ? 1 : 0.5, transition: 'all 0.3s ease',
                      boxShadow: isActive ? 'var(--shadow-sm)' : 'none', cursor: 'pointer'
                    }} onClick={() => setAmount(impact.amount)}>
                      <IconCircle name={impact.icon} size={44} color={impact.color} bgOpacity={0.15} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{impact.title}</span>
                          <span style={{ color: 'var(--text-accent)' }}>${impact.amount}+</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{impact.desc}</div>
                      </div>
                      {isActive && <Icon name="check" size={18} color="var(--green-500)" />}
                    </div>
                  );
                })}
              </div>
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

      {/* More Ways to Give */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="text-center reveal" style={{ marginBottom: '8px' }}>More Ways to <span className="text-gradient">Give</span></h2>
          <p className="text-center reveal" style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>Every act of generosity makes a difference</p>
          <div className="grid-4 stagger">
            {[
              { icon: 'paw', title: 'In-Kind Donations', desc: 'Drop off food, blankets, toys, and cleaning supplies at the shelter.', color: 'var(--blue-400)' },
              { icon: 'book', title: 'Amazon Wishlist', desc: 'Order supplies directly from our Amazon wishlist and ship them to us.', color: '#F59E0B' },
              { icon: 'people', title: 'Corporate Matching', desc: 'Many employers match charitable donations. Double your impact!', color: 'var(--green-500)' },
              { icon: 'calendar', title: 'Planned Giving', desc: 'Include us in your will or estate plan and leave a lasting legacy.', color: '#8B5CF6' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
                <IconCircle name={item.icon} size={48} color={item.color} bgOpacity={0.15} style={{ margin: '0 auto 14px' }} />
                <h4 style={{ marginBottom: '8px', fontSize: '0.95rem' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donor Testimonial */}
      <section className="section">
        <div className="container" style={{ maxWidth: '650px' }}>
          <div className="story-card reveal-scale" style={{ padding: '40px', textAlign: 'center' }}>
            <IconCircle name="heart" size={56} color="var(--rose-400)" bgOpacity={0.15} style={{ margin: '0 auto 20px' }} />
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.9, maxWidth: '480px', margin: '0 auto 20px', fontSize: '1.05rem' }}>
              &ldquo;Knowing that my monthly donation helps feed and care for 100+ animals gives me so much peace. This shelter is doing incredible work for Sault Ste. Marie.&rdquo;
            </p>
            <p style={{ fontWeight: 700 }}>— Jennifer W.</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly donor since 2022</p>
          </div>
        </div>
      </section>

      {/* Legacy & Memorial Giving */}
      <section className="section section-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ maxWidth: '600px', position: 'relative' }}>
          <h2 className="reveal" style={{ marginBottom: '12px' }}>Leave a <span style={{ color: 'var(--rose-400)' }}>Lasting Legacy</span></h2>
          <p className="reveal" style={{ color: '#94A3B8', marginBottom: '32px', lineHeight: 1.7 }}>
            Honor someone special with a memorial or tribute donation. We&apos;ll send a beautiful card acknowledging your gift.
          </p>
          <div className="grid-2 stagger" style={{ gap: '16px', marginBottom: '32px' }}>
            {[
              { title: 'Memorial Donation', desc: 'Honor the memory of a loved one or beloved pet', icon: 'ribbon', color: 'var(--rose-400)' },
              { title: 'Tribute Donation', desc: 'Celebrate a birthday, anniversary, or special occasion', icon: 'star', color: '#F59E0B' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', padding: '28px', textAlign: 'center' }}>
                <IconCircle name={item.icon} size={44} color={item.color} bgOpacity={0.15} style={{ margin: '0 auto 12px' }} />
                <h4 style={{ color: '#F1F5F9', marginBottom: '6px' }}>{item.title}</h4>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/contact" className="btn btn-primary btn-lg reveal" style={{ borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="mail" size={18} color="#fff" /> Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
