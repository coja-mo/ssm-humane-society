'use client';
import { useState } from 'react';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const ROLES = [
  { icon: 'dog', title: 'Dog Walking', desc: 'Help our dogs get exercise and socialization. Walk dogs around the shelter grounds and nearby trails.', time: '2-3 hrs', color: 'var(--blue-400)', skills: ['Physical fitness', 'Dog handling'] },
  { icon: 'cat', title: 'Cat Socialization', desc: 'Spend time with our cats — playing, grooming, and giving them the attention they need to thrive.', time: '2-3 hrs', color: 'var(--green-500)', skills: ['Patience', 'Cat experience'] },
  { icon: 'shield', title: 'Kennel Care', desc: 'Help keep our shelter clean and comfortable. Feed animals, refresh water, and clean living spaces.', time: '3-4 hrs', color: 'var(--blue-500)', skills: ['Physical work', 'Reliability'] },
  { icon: 'camera', title: 'Photography', desc: 'Take beautiful photos of adoptable animals to showcase them online and help them find homes faster.', time: '2-3 hrs', color: 'var(--rose-400)', skills: ['Camera skills', 'Creativity'] },
  { icon: 'calendar', title: 'Event Support', desc: 'Help organize and run fundraising events, adoption drives, and community outreach programs.', time: 'Varies', color: 'var(--blue-600)', skills: ['Organization', 'People skills'] },
  { icon: 'edit', title: 'Admin Support', desc: 'Help with data entry, phone calls, social media management, filing, and general office tasks.', time: '2-4 hrs', color: 'var(--green-600)', skills: ['Computer skills', 'Communication'] },
  { icon: 'medical', title: 'Vet Assistant', desc: 'Support our veterinary team during routine procedures, medication administration, and animal transport.', time: '3-4 hrs', color: '#F59E0B', skills: ['Medical interest', 'Calm demeanor'] },
  { icon: 'people', title: 'Mentorship', desc: 'Help train and orient new volunteers. Share your experience and help build our team.', time: '2-3 hrs', color: '#8B5CF6', skills: ['Leadership', 'Experience'] },
];

const STEPS = [
  { num: '01', title: 'Apply Online', desc: 'Fill out our volunteer application below. Tell us about yourself and which roles interest you.' },
  { num: '02', title: 'Orientation', desc: 'Attend a 1-hour orientation session to learn about shelter policies, safety, and animal handling.' },
  { num: '03', title: 'Training', desc: 'Get hands-on training in your chosen roles with experienced staff and mentors.' },
  { num: '04', title: 'Start Helping!', desc: 'Schedule your shifts and start making a difference in the lives of shelter animals.' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Dog Walker', text: 'Volunteering here has been the highlight of my week for 3 years. The staff are wonderful and the dogs are so grateful.', years: 3 },
  { name: 'Mike R.', role: 'Event Coordinator', text: 'I started as a casual volunteer and now help run our biggest fundraisers. The community impact is incredible.', years: 5 },
  { name: 'Lisa K.', role: 'Cat Socializer', text: 'There\'s nothing like seeing a shy cat come out of its shell because of the time you spent with it. Pure joy.', years: 2 },
];

export default function VolunteerPage() {
  useScrollReveal();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', age: '', motivation: '', availability: 'both', experience: '', emergencyContact: '', emergencyPhone: '' });

  function toggleRole(title) {
    setSelectedRoles(prev => prev.includes(title) ? prev.filter(r => r !== title) : [...prev, title]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const [firstName, ...rest] = form.name.split(' ');
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, lastName: rest.join(' ') || '',
          email: form.email, phone: form.phone,
          interests: selectedRoles.map(r => r.toLowerCase().replace(/\s+/g, '-')),
          availability: [form.availability], skills: [],
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
          <IconCircle name="check" size={80} color="var(--green-500)" bgOpacity={0.15} style={{ margin: '0 auto 24px' }} />
          <h1 style={{ marginBottom: '16px' }}>Application <span className="text-gradient">Submitted!</span></h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
            Thank you for your interest in volunteering! We&apos;ll review your application and get back to you within a few business days.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '32px' }}>
            In the meantime, follow us on social media for shelter updates and volunteer spotlights!
          </p>
          <a href="/" className="btn btn-primary">Return Home</a>
        </div>
      </section>
    );
  }

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(41,171,226,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="people" size={14} color="var(--blue-700)" /> Join Our Team
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Become a <span className="text-gradient">Volunteer</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Your time and skills can make a real difference in the lives of shelter animals!
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="container">
          <div className="grid-4 stagger" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {[
              { n: 250, suffix: '+', label: 'Active Volunteers', icon: 'people', color: 'var(--blue-500)' },
              { n: 12000, suffix: '+', label: 'Hours Donated', icon: 'clock', color: 'var(--green-500)' },
              { n: 45, suffix: '+', label: 'Years of Service', icon: 'calendar', color: 'var(--rose-400)' },
              { n: 8, suffix: '', label: 'Volunteer Roles', icon: 'star', color: '#F59E0B' },
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

      {/* How It Works */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="text-center reveal" style={{ marginBottom: '8px' }}>How It <span className="text-gradient">Works</span></h2>
          <p className="text-center reveal" style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '0.9rem' }}>
            Getting started is easy — here&apos;s what to expect
          </p>
          <div className="grid-4 stagger">
            {STEPS.map((step, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '28px 20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '4rem', fontWeight: 900, color: 'var(--blue-50)', lineHeight: 1, fontFamily: 'var(--font-display)' }}>{step.num}</div>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--blue-500)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', margin: '0 auto 14px', boxShadow: '0 4px 12px rgba(41,171,226,0.3)' }}>{i + 1}</div>
                  <h4 style={{ marginBottom: '8px', fontSize: '0.95rem' }}>{step.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.82rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="section">
        <div className="container">
          <h2 className="text-center reveal" style={{ marginBottom: '8px' }}>Choose Your <span className="text-gradient">Role</span></h2>
          <p className="text-center reveal" style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>Click to select roles that interest you · {selectedRoles.length} selected</p>
          <div className="grid-4 stagger" style={{ marginBottom: '48px' }}>
            {ROLES.map((item, i) => {
              const selected = selectedRoles.includes(item.title);
              return (
                <button key={i} onClick={() => toggleRole(item.title)} className="card card-3d" style={{
                  textAlign: 'left', cursor: 'pointer',
                  borderColor: selected ? item.color : 'var(--border-light)',
                  boxShadow: selected ? `0 0 20px ${item.color}25` : 'var(--shadow-sm)',
                }}>
                  <div style={{ height: '4px', background: selected ? item.color : 'var(--border-light)', transition: 'background 0.3s' }} />
                  <div className="card-body" style={{ padding: '24px', textAlign: 'center' }}>
                    <IconCircle name={item.icon} size={52} color={item.color} bgOpacity={selected ? 0.2 : 0.12} style={{
                      margin: '0 auto 14px', transition: 'all 0.3s',
                      boxShadow: selected ? `0 0 20px ${item.color}30` : 'none'
                    }} />
                    <h3 style={{ marginBottom: '6px', fontSize: '0.95rem' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.82rem', marginBottom: '10px' }}>{item.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '100px', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>⏱ {item.time}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {item.skills.map(s => <span key={s} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', background: 'var(--blue-50)', color: 'var(--blue-700)' }}>{s}</span>)}
                    </div>
                    {selected && (
                      <div style={{ marginTop: '10px', color: item.color, fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <Icon name="check" size={14} color={item.color} /> Selected
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Application Form */}
          <div className="card reveal" style={{ padding: '40px', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '8px', textAlign: 'center' }}>Volunteer Application</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
              Fill out the form below and we&apos;ll be in touch within 2-3 business days
            </p>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full name" /></div>
                <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@email.com" /></div>
              </div>
              <div className="grid-3">
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="(705) 555-0123" /></div>
                <div className="form-group"><label className="form-label">Age *</label><input className="form-input" type="number" required value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="18" /></div>
                <div className="form-group"><label className="form-label">Availability</label>
                  <select className="form-input form-select" value={form.availability} onChange={e => setForm({...form, availability: e.target.value})}><option value="weekdays">Weekdays</option><option value="weekends">Weekends</option><option value="both">Both</option><option value="evenings">Evenings Only</option></select>
                </div>
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
              <div className="form-group"><label className="form-label">Previous Experience</label><textarea className="form-input form-textarea" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} placeholder="Any previous volunteer or animal care experience..." style={{ minHeight: '80px' }} /></div>
              <div className="form-group"><label className="form-label">Why do you want to volunteer? *</label><textarea className="form-input form-textarea" required value={form.motivation} onChange={e => setForm({...form, motivation: e.target.value})} placeholder="Tell us about yourself..." /></div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Emergency Contact</label><input className="form-input" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} placeholder="Contact name" /></div>
                <div className="form-group"><label className="form-label">Emergency Phone</label><input className="form-input" type="tel" value={form.emergencyPhone} onChange={e => setForm({...form, emergencyPhone: e.target.value})} placeholder="(705) 555-0000" /></div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                <Icon name="people" size={16} color="#fff" /> {submitting ? 'Submitting...' : 'Apply to Volunteer'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="text-center reveal" style={{ marginBottom: '32px' }}>Hear From Our <span className="text-gradient">Volunteers</span></h2>
          <div className="grid-3 stagger">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--blue-50)', color: 'var(--blue-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', margin: '0 auto 14px' }}>
                  {t.name[0]}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.88rem', marginBottom: '16px' }}>&ldquo;{t.text}&rdquo;</p>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.role} · {t.years} years</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
