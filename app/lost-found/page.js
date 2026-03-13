'use client';
import usePageTitle from '@/hooks/usePageTitle';
import { useState, useEffect } from 'react';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const PET_TYPES = ['dog', 'cat', 'bird', 'rabbit', 'other'];

export default function LostFoundPage() {
  useScrollReveal();
  usePageTitle('Lost & Found');
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    type: 'lost', petType: 'dog', name: '', breed: '', color: '',
    description: '', location: '', date: new Date().toISOString().split('T')[0],
    contactName: '', contactPhone: '', contactEmail: '',
  });

  useEffect(() => {
    fetch('/api/lost-found').then(r => r.json()).then(data => setItems(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/lost-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const item = await res.json();
        setItems(prev => [item, ...prev]);
        setSubmitted(true);
      }
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  const filtered = filter === 'all' ? items.filter(i => i.status === 'active') : items.filter(i => i.type === filter && i.status === 'active');
  const lostCount = items.filter(i => i.type === 'lost' && i.status === 'active').length;
  const foundCount = items.filter(i => i.type === 'found' && i.status === 'active').length;

  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge badge-blue reveal" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="search" size={14} color="var(--blue-700)" /> Community Board
          </span>
          <h1 className="reveal">Lost & <span className="text-gradient">Found Pets</span></h1>
          <p className="reveal" style={{ color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '600px', margin: '12px auto 32px', lineHeight: 1.8 }}>
            Help reunite lost pets with their families. Browse active reports or submit your own.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '32px' }} className="reveal">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rose-500)' }}><AnimatedCounter target={lostCount} /></div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pets Lost</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green-500)' }}><AnimatedCounter target={foundCount} /></div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pets Found</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--blue-500)' }}><AnimatedCounter target={items.filter(i => i.status === 'resolved').length} /></div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reunited</div>
            </div>
          </div>

          <button className="btn btn-primary reveal" onClick={() => setShowForm(!showForm)} style={{ borderRadius: '100px', padding: '14px 32px' }}>
            {showForm ? '✕ Close Form' : '📋 Report a Lost or Found Pet'}
          </button>
        </div>
      </section>

      {/* Report Form */}
      {showForm && !submitted && (
        <section style={{ paddingBottom: '40px' }}>
          <div className="container" style={{ maxWidth: '700px' }}>
            <div className="card" style={{ padding: '40px' }}>
              <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Submit a Report</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Report Type *</label>
                    <select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                      <option value="lost">I Lost a Pet</option>
                      <option value="found">I Found a Pet</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pet Type *</label>
                    <select className="form-input form-select" value={form.petType} onChange={e => setForm({...form, petType: e.target.value})}>
                      {PET_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group"><label className="form-label">Pet Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="If known" /></div>
                  <div className="form-group"><label className="form-label">Breed</label><input className="form-input" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} placeholder="e.g. Labrador Mix" /></div>
                </div>
                <div className="grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group"><label className="form-label">Color / Markings</label><input className="form-input" value={form.color} onChange={e => setForm({...form, color: e.target.value})} placeholder="e.g. Brown with white chest" /></div>
                  <div className="form-group"><label className="form-label">Date *</label><input className="form-input" type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
                </div>
                <div className="form-group" style={{ marginBottom: '16px' }}><label className="form-label">Location *</label><input className="form-input" required value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Where was the pet last seen or found?" /></div>
                <div className="form-group" style={{ marginBottom: '16px' }}><label className="form-label">Description</label><textarea className="form-input form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Collar, microchip, behavior, any identifying features..." /></div>
                <div className="grid-2" style={{ marginBottom: '16px' }}>
                  <div className="form-group"><label className="form-label">Your Name *</label><input className="form-input" required value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} /></div>
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}><label className="form-label">Email *</label><input className="form-input" type="email" required value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} /></div>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}>
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {submitted && (
        <section style={{ paddingBottom: '40px' }}>
          <div className="container text-center" style={{ maxWidth: '500px' }}>
            <div className="card" style={{ padding: '40px' }}>
              <IconCircle name="check" size={64} color="var(--green-500)" bgOpacity={0.15} style={{ margin: '0 auto 16px' }} />
              <h2>Report Submitted!</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.6 }}>Your report is now visible on the community board. We hope you find your pet soon!</p>
              <button onClick={() => { setSubmitted(false); setShowForm(false); }} className="btn btn-primary" style={{ marginTop: '20px' }}>View Reports</button>
            </div>
          </div>
        </section>
      )}

      {/* Listings */}
      <section style={{ paddingBottom: '80px' }}>
        <div className="container">
          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {['all', 'lost', 'found'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '10px 24px', borderRadius: '100px', fontWeight: 600, fontSize: '0.9rem',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: filter === f ? (f === 'lost' ? '#E11D48' : f === 'found' ? 'var(--green-600)' : 'var(--blue-500)') : 'var(--bg-secondary)',
                  color: filter === f ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                {f === 'all' ? `All Active (${items.filter(i => i.status === 'active').length})` : f === 'lost' ? `🔴 Lost (${lostCount})` : `🟢 Found (${foundCount})`}
              </button>
            ))}
          </div>

          {/* Report Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {filtered.map(item => (
              <div key={item.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{
                  padding: '12px 20px',
                  background: item.type === 'lost' ? 'linear-gradient(135deg, #FEE2E2, #FECACA)' : 'linear-gradient(135deg, var(--green-50), var(--green-100))',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: item.type === 'lost' ? '#E11D48' : 'var(--green-800)',
                  }}>
                    {item.type === 'lost' ? '🔴 LOST PET' : '🟢 FOUND PET'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.date}</span>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                      background: item.type === 'lost' ? '#FEE2E2' : 'var(--green-50)',
                    }}>
                      {item.petType === 'dog' ? '🐕' : item.petType === 'cat' ? '🐈' : item.petType === 'bird' ? '🐦' : item.petType === 'rabbit' ? '🐰' : '🐾'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{item.name || 'Unknown Name'}</h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.breed || 'Unknown breed'}{item.color ? ` • ${item.color}` : ''}</span>
                    </div>
                  </div>
                  {item.description && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>{item.description}</p>}
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>📍 {item.location}</span>
                    <span>👤 Contact: {item.contactName}</span>
                    {item.contactPhone && <span>📞 {item.contactPhone}</span>}
                    {item.contactEmail && <span>✉️ {item.contactEmail}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card text-center" style={{ padding: '60px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.4 }}>🔍</div>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>No active reports</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                There are currently no active {filter !== 'all' ? filter : ''} pet reports. If you&apos;ve lost or found a pet, please submit a report above.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Tips & Resources */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="text-center reveal" style={{ marginBottom: '8px' }}>Helpful <span className="text-gradient">Tips</span></h2>
          <p className="text-center reveal" style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>Steps to increase your chances of a happy reunion</p>
          <div className="grid-2 stagger" style={{ gap: '24px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>
                <IconCircle name="search" size={36} color="var(--rose-500)" bgOpacity={0.15} /> If You&apos;ve Lost Your Pet
              </h3>
              <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Search your neighbourhood immediately — pets often stay close',
                  'Put their food, water, and a familiar blanket outside',
                  'Post on local social media groups (SSM Lost Pets, Buy & Sell)',
                  'Call the shelter at 705-949-3573 to check incoming strays',
                  'Contact local vet clinics — someone may bring them in',
                  'Put up posters with a clear photo and your phone number',
                ].map((tip, i) => (
                  <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip}</li>
                ))}
              </ol>
            </div>
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem' }}>
                <IconCircle name="heart" size={36} color="var(--green-500)" bgOpacity={0.15} /> If You&apos;ve Found a Pet
              </h3>
              <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Check for an ID tag or collar with contact information',
                  'Take the pet to a vet or shelter to scan for a microchip',
                  'Post a "Found" report here and on social media',
                  'Do NOT post identifying details publicly — ask the owner to describe them',
                  'Provide food, water, and a safe space while searching for the owner',
                ].map((tip, i) => (
                  <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Microchip CTA */}
      <section className="section">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="card card-3d reveal" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <IconCircle name="shield" size={56} color="var(--blue-500)" bgOpacity={0.15} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '6px' }}>Microchip Your Pet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Microchipped pets are <strong>20x more likely</strong> to be returned. Our shelter offers microchipping for just $25. Contact us to schedule.
              </p>
            </div>
            <a href="tel:7059493573" className="btn btn-primary btn-sm" style={{ borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
              <Icon name="phone" size={14} color="#fff" /> 705-949-3573
            </a>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="section section-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ maxWidth: '600px', position: 'relative' }}>
          <h2 className="reveal" style={{ marginBottom: '12px' }}>Need <span style={{ color: 'var(--rose-400)' }}>Immediate Help</span>?</h2>
          <p className="reveal" style={{ color: '#94A3B8', marginBottom: '28px', lineHeight: 1.7 }}>
            If you&apos;ve found an injured or distressed animal, contact us immediately.
          </p>
          <div className="grid-2 stagger" style={{ gap: '16px' }}>
            <a href="tel:7059493573" className="card" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', padding: '24px', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
              <IconCircle name="phone" size={44} color="var(--green-400)" bgOpacity={0.15} style={{ margin: '0 auto 10px' }} />
              <h4 style={{ color: '#F1F5F9', marginBottom: '4px' }}>Call Us</h4>
              <p style={{ color: 'var(--green-400)', fontWeight: 700 }}>705-949-3573</p>
            </a>
            <a href="mailto:info@ssmhumanesociety.ca" className="card" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', padding: '24px', textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
              <IconCircle name="mail" size={44} color="var(--blue-400)" bgOpacity={0.15} style={{ margin: '0 auto 10px' }} />
              <h4 style={{ color: '#F1F5F9', marginBottom: '4px' }}>Email Us</h4>
              <p style={{ color: 'var(--blue-400)', fontWeight: 700, fontSize: '0.9rem' }}>info@ssmhumanesociety.ca</p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
