'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon, { IconCircle } from '@/components/ui/Icon';

export default function VisitsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [visits, setVisits] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    date: '', time: '', purpose: 'meet-pets', petId: '', petName: '', notes: '',
  });

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(data => {
      if (data.authenticated) {
        setUser(data.user);
        setForm(f => ({ ...f, visitorName: data.user.name, visitorEmail: data.user.email }));
      } else {
        const u = localStorage.getItem('user');
        if (!u) { router.push('/auth/login'); return; }
        const parsed = JSON.parse(u);
        setUser(parsed);
        setForm(f => ({ ...f, visitorName: parsed.name, visitorEmail: parsed.email }));
      }
    }).catch(() => router.push('/auth/login'));

    fetch('/api/pets').then(r => r.json()).then(data => setPets(Array.isArray(data) ? data.filter(p => p.status === 'available') : [])).catch(() => {});
    fetch('/api/visits').then(r => r.json()).then(data => setVisits(Array.isArray(data) ? data : [])).catch(() => {});
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, visitorName: user?.name, visitorEmail: user?.email }),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  // Get only the current user's visits
  const myVisits = visits.filter(v => v.visitorEmail === user?.email);

  // Generate available time slots
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split('T')[0];
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30).toISOString().split('T')[0];

  if (submitted) {
    return (
      <section style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="container text-center" style={{ maxWidth: '600px' }}>
          <IconCircle name="check" size={80} color="var(--green-500)" bgOpacity={0.15} style={{ margin: '0 auto 24px' }} />
          <h1 style={{ marginBottom: '16px' }}>Visit <span className="text-gradient">Booked!</span></h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
            Your visit is confirmed for <strong>{form.date}</strong> at <strong>{form.time}</strong>.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
            We&apos;ll send a reminder to {user?.email}. Please arrive 5 minutes early.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
            <button onClick={() => setSubmitted(false)} className="btn" style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-light)' }}>Book Another</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="calendar" size={14} color="var(--blue-700)" /> Schedule a Visit
            </span>
            <h1>Book a <span className="text-gradient">Shelter Visit</span></h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '500px', margin: '12px auto 0' }}>
              Come meet our animals in person! Schedule a time to visit and find your new best friend.
            </p>
          </div>

          {/* Visit Form */}
          <div className="card" style={{ padding: '40px', marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '24px' }}>
              <Icon name="calendar" size={20} color="var(--blue-500)" /> Select a Date & Time
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid-2" style={{ marginBottom: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Visit Date *</label>
                  <input className="form-input" type="date" required min={minDate} max={maxDate} value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time *</label>
                  <select className="form-input form-select" required value={form.time} onChange={e => setForm({...form, time: e.target.value})}>
                    <option value="">Select a time</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="1:30 PM">1:30 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="3:30 PM">3:30 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Purpose of Visit</label>
                  <select className="form-input form-select" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})}>
                    <option value="meet-pets">Meet Adoptable Pets</option>
                    <option value="specific-pet">Visit a Specific Pet</option>
                    <option value="volunteer">Volunteer Orientation</option>
                    <option value="foster-pickup">Foster Pickup</option>
                    <option value="donation-dropoff">Donation Drop-off</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {form.purpose === 'specific-pet' && (
                  <div className="form-group">
                    <label className="form-label">Which Pet?</label>
                    <select className="form-input form-select" value={form.petName} onChange={e => setForm({...form, petName: e.target.value})}>
                      <option value="">Select a pet</option>
                      {pets.map(p => <option key={p.id} value={p.name}>{p.name} ({p.type} • {p.breed})</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Notes (optional)</label>
                <textarea className="form-input form-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Anything we should know? Special accommodations, bringing kids, etc." />
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Icon name="calendar" size={16} color="#fff" /> {submitting ? 'Booking...' : 'Book Visit'}
              </button>
            </form>
          </div>

          {/* Previous Visits */}
          {myVisits.length > 0 && (
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '20px' }}>Your Scheduled Visits</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myVisits.map(v => (
                  <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                    <IconCircle name="calendar" size={40} color="var(--blue-500)" bgOpacity={0.1} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{v.date} at {v.time}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {v.purpose === 'specific-pet' ? `Visiting ${v.petName}` : v.purpose.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </div>
                    </div>
                    <span style={{ background: 'var(--green-100)', color: 'var(--green-800)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600 }}>
                      {v.status || 'Confirmed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid-2" style={{ marginTop: '40px' }}>
            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <IconCircle name="clock" size={48} color="var(--blue-500)" bgOpacity={0.1} style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Shelter Hours</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Mon–Fri: 10am–5pm<br />
                Sat: 10am–4pm<br />
                Sun: 12pm–4pm
              </p>
            </div>
            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <IconCircle name="location" size={48} color="var(--green-500)" bgOpacity={0.1} style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Location</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                SSM Humane Society<br />
                175 Old Garden River Rd<br />
                Sault Ste. Marie, ON
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
