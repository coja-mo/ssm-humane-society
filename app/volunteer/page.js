'use client';
import { useState } from 'react';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const ROLES = [
  { icon: 'dog', title: 'Dog Walking', desc: 'Help our dogs get exercise and socialization. Walk dogs around the shelter grounds.', color: 'var(--blue-400)' },
  { icon: 'cat', title: 'Cat Socialization', desc: 'Spend time with our cats — playing, grooming, and giving them attention.', color: 'var(--green-500)' },
  { icon: 'shield', title: 'Kennel Care', desc: 'Help keep our shelter clean and comfortable for the animals.', color: 'var(--blue-500)' },
  { icon: 'camera', title: 'Photography', desc: 'Take photos of adoptable animals to help them get noticed online.', color: 'var(--rose-400)' },
  { icon: 'calendar', title: 'Event Support', desc: 'Help organize and run fundraising events and adoption drives.', color: 'var(--blue-600)' },
  { icon: 'edit', title: 'Admin Support', desc: 'Help with data entry, phone calls, social media, and admin tasks.', color: 'var(--green-600)' },
];

export default function VolunteerPage() {
  useScrollReveal();
  const [selectedRoles, setSelectedRoles] = useState([]);

  function toggleRole(title) {
    setSelectedRoles(prev => prev.includes(title) ? prev.filter(r => r !== title) : [...prev, title]);
  }

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="people" size={14} color="var(--blue-700)" /> Join Our Team
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Become a <span className="text-gradient">Volunteer</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Your time and skills can make a real difference in the lives of shelter animals!
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="container">
          <div className="grid-3 stagger" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {[
              { n: 250, suffix: '+', label: 'Active Volunteers', icon: 'people', color: 'var(--blue-500)' },
              { n: 12000, suffix: '+', label: 'Hours Donated', icon: 'clock', color: 'var(--green-500)' },
              { n: 45, suffix: '+', label: 'Years of Service', icon: 'calendar', color: 'var(--rose-400)' },
            ].map(s => (
              <div key={s.label} className="card card-3d" style={{ textAlign: 'center', padding: '24px' }}>
                <IconCircle name={s.icon} size={44} color={s.color} bgOpacity={0.15} style={{ margin: '0 auto 12px' }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-accent)' }}>
                  <AnimatedCounter target={s.n} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="text-center reveal" style={{ marginBottom: '8px' }}>Choose Your <span className="text-gradient">Role</span></h2>
          <p className="text-center reveal" style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>Click to select roles that interest you</p>
          <div className="grid-3 stagger" style={{ marginBottom: '48px' }}>
            {ROLES.map((item, i) => {
              const selected = selectedRoles.includes(item.title);
              return (
                <button key={i} onClick={() => toggleRole(item.title)} className="card card-3d" style={{ 
                  textAlign: 'left', cursor: 'pointer',
                  borderColor: selected ? item.color : 'var(--border-light)',
                  boxShadow: selected ? `0 0 20px ${item.color}25` : 'var(--shadow-sm)',
                }}>
                  <div style={{ height: '4px', background: selected ? item.color : 'var(--border-light)', transition: 'background 0.3s' }} />
                  <div className="card-body" style={{ padding: '28px', textAlign: 'center' }}>
                    <IconCircle name={item.icon} size={56} color={item.color} bgOpacity={selected ? 0.2 : 0.12} style={{ 
                      margin: '0 auto 16px', transition: 'all 0.3s',
                      boxShadow: selected ? `0 0 20px ${item.color}30` : 'none'
                    }} />
                    <h3 style={{ marginBottom: '8px', fontSize: '1rem' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.85rem' }}>{item.desc}</p>
                    {selected && (
                      <div style={{ marginTop: '12px', color: item.color, fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <Icon name="check" size={14} color={item.color} /> Selected
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="card reveal" style={{ padding: '40px', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Volunteer Application</h2>
            <form onSubmit={e => e.preventDefault()}>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="Full name" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@email.com" /></div>
              </div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" placeholder="(705) 555-0123" /></div>
                <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" placeholder="18" /></div>
              </div>
              {selectedRoles.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Selected Roles</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedRoles.map(r => (
                      <span key={r} className="badge badge-blue" style={{ padding: '6px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }} onClick={() => toggleRole(r)}>
                        {r} <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="form-group"><label className="form-label">Why do you want to volunteer?</label><textarea className="form-input form-textarea" placeholder="Tell us about yourself..." /></div>
              <div className="form-group"><label className="form-label">Availability</label>
                <select className="form-input form-select"><option>Weekdays</option><option>Weekends</option><option>Both</option><option>Evenings Only</option></select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Icon name="people" size={16} color="#fff" /> Apply to Volunteer
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
