'use client';
import { useState } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import Icon, { IconCircle } from '@/components/ui/Icon';

export default function SurrenderPage() {
  useScrollReveal();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    petType: 'dog', petName: '', breed: '', age: '', sex: 'male', weight: '', color: '',
    spayedNeutered: false, vaccinated: false, microchipped: false,
    medicalNotes: '', behaviorNotes: '', reason: '',
    ownerName: '', ownerEmail: '', ownerPhone: '', ownerAddress: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'surrender' }),
      });
      if (res.ok) setSubmitted(true);
    } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <section style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="container text-center" style={{ maxWidth: '600px' }}>
          <IconCircle name="check" size={80} color="var(--green-500)" bgOpacity={0.15} style={{ margin: '0 auto 24px' }} />
          <h1 style={{ marginBottom: '16px' }}>Request <span className="text-gradient">Received</span></h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
            Thank you for reaching out. Our team will review your surrender request and contact you within 2–3 business days
            to schedule a drop-off appointment.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
            Please do not abandon your pet. We are here to help find the best solution for both you and your animal.
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
          <span className="badge badge-blue reveal" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="home" size={14} color="var(--blue-700)" /> Pet Surrender
          </span>
          <h1 className="reveal">Surrendering a <span className="text-gradient">Pet</span></h1>
          <p className="reveal" style={{ color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '600px', margin: '12px auto 0', lineHeight: 1.8 }}>
            We understand this is a difficult decision. We&apos;re here to help ensure your pet finds a loving new home.
            Please fill out the form below so we can prepare for your pet&apos;s arrival.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: '80px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Important Info */}
          <div className="card reveal" style={{ padding: '28px', marginBottom: '32px', borderLeft: '4px solid var(--blue-500)' }}>
            <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="info" size={18} color="var(--blue-500)" /> Before You Surrender
            </h3>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px' }}>
              <li>Consider reaching out to our behavior helpline — behavioral issues can often be resolved</li>
              <li>We may be able to help with temporary boarding while you find new housing</li>
              <li>Surrender is by appointment only — do NOT leave animals unattended</li>
              <li>A surrender fee of $50 may apply to help cover veterinary costs</li>
            </ul>
          </div>

          {/* Multi-Step Form */}
          <div className="card reveal" style={{ padding: '40px' }}>
            {/* Step Indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
              {[1, 2, 3].map(s => (
                <button key={s} onClick={() => setStep(s)} style={{
                  width: '40px', height: '40px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: step === s ? 'var(--blue-500)' : step > s ? 'var(--green-500)' : 'var(--bg-secondary)',
                  color: step >= s ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.9rem',
                  transition: 'all 0.3s ease', fontFamily: 'inherit',
                }}>
                  {step > s ? '✓' : s}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Pet Info */}
              {step === 1 && (
                <>
                  <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Pet Information</h2>
                  <div className="grid-2" style={{ marginBottom: '16px' }}>
                    <div className="form-group"><label className="form-label">Pet Type *</label>
                      <select className="form-input form-select" value={form.petType} onChange={e => update('petType', e.target.value)}>
                        <option value="dog">Dog</option><option value="cat">Cat</option><option value="bird">Bird</option><option value="rabbit">Rabbit</option><option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group"><label className="form-label">Pet Name *</label><input className="form-input" required value={form.petName} onChange={e => update('petName', e.target.value)} /></div>
                  </div>
                  <div className="grid-2" style={{ marginBottom: '16px' }}>
                    <div className="form-group"><label className="form-label">Breed</label><input className="form-input" value={form.breed} onChange={e => update('breed', e.target.value)} placeholder="e.g. Labrador Mix" /></div>
                    <div className="form-group"><label className="form-label">Color/Markings</label><input className="form-input" value={form.color} onChange={e => update('color', e.target.value)} /></div>
                  </div>
                  <div className="grid-2" style={{ marginBottom: '16px' }}>
                    <div className="form-group"><label className="form-label">Age</label><input className="form-input" value={form.age} onChange={e => update('age', e.target.value)} placeholder="e.g. 3 years" /></div>
                    <div className="form-group"><label className="form-label">Sex</label>
                      <select className="form-input form-select" value={form.sex} onChange={e => update('sex', e.target.value)}>
                        <option value="male">Male</option><option value="female">Female</option><option value="unknown">Unknown</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '20px' }}><label className="form-label">Weight (lbs)</label><input className="form-input" type="number" value={form.weight} onChange={e => update('weight', e.target.value)} /></div>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {[['spayedNeutered', 'Spayed/Neutered'], ['vaccinated', 'Up to date on vaccines'], ['microchipped', 'Microchipped']].map(([key, label]) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input type="checkbox" checked={form[key]} onChange={e => update(key, e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--blue-500)' }} />
                        {label}
                      </label>
                    ))}
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}>Next: Medical & Behavior →</button>
                </>
              )}

              {/* Step 2: Medical / Behavior */}
              {step === 2 && (
                <>
                  <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Medical & Behavior</h2>
                  <div className="form-group" style={{ marginBottom: '16px' }}><label className="form-label">Medical Notes</label><textarea className="form-input form-textarea" value={form.medicalNotes} onChange={e => update('medicalNotes', e.target.value)} placeholder="Any medical conditions, medications, allergies, recent vet visits..." /></div>
                  <div className="form-group" style={{ marginBottom: '16px' }}><label className="form-label">Behavior Notes</label><textarea className="form-input form-textarea" value={form.behaviorNotes} onChange={e => update('behaviorNotes', e.target.value)} placeholder="How does the pet behave with children, other animals, strangers? Any triggers or concerns?" /></div>
                  <div className="form-group" style={{ marginBottom: '24px' }}><label className="form-label">Reason for Surrender *</label><textarea className="form-input form-textarea" required value={form.reason} onChange={e => update('reason', e.target.value)} placeholder="Please explain why you need to surrender your pet..." /></div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" onClick={() => setStep(1)} className="btn" style={{ flex: 1, background: 'var(--bg-secondary)', border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-lg)' }}>← Back</button>
                    <button type="button" onClick={() => setStep(3)} className="btn btn-primary" style={{ flex: 2, borderRadius: 'var(--radius-lg)' }}>Next: Your Info →</button>
                  </div>
                </>
              )}

              {/* Step 3: Owner Info */}
              {step === 3 && (
                <>
                  <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Your Information</h2>
                  <div className="grid-2" style={{ marginBottom: '16px' }}>
                    <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" required value={form.ownerName} onChange={e => update('ownerName', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" required value={form.ownerEmail} onChange={e => update('ownerEmail', e.target.value)} /></div>
                  </div>
                  <div className="grid-2" style={{ marginBottom: '16px' }}>
                    <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" type="tel" required value={form.ownerPhone} onChange={e => update('ownerPhone', e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.ownerAddress} onChange={e => update('ownerAddress', e.target.value)} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button type="button" onClick={() => setStep(2)} className="btn" style={{ flex: 1, background: 'var(--bg-secondary)', border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-lg)' }}>← Back</button>
                    <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Icon name="check" size={16} color="#fff" /> {submitting ? 'Submitting...' : 'Submit Surrender Request'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
