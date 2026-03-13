'use client';
import { useState } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import Icon, { IconCircle } from '@/components/ui/Icon';

const ALTERNATIVES = [
  { icon: 'phone', title: 'Behavioral Helpline', desc: 'Many behavior issues can be resolved with professional guidance. Call our helpline before deciding.', color: 'var(--blue-400)', action: 'Call 705-949-3573' },
  { icon: 'home', title: 'Temporary Foster', desc: 'Going through a life change? We can temporarily foster your pet while you get settled.', color: 'var(--green-500)', action: 'Learn More' },
  { icon: 'people', title: 'Rehoming Assistance', desc: 'We can help you find a new home for your pet through our community network and social media.', color: '#8B5CF6', action: 'Get Help' },
  { icon: 'medical', title: 'Low-Cost Vet Care', desc: 'Financial burden? We can connect you with subsidized vet care and pet food banks.', color: 'var(--rose-400)', action: 'Contact Us' },
];

const REASONS = [
  'Moving / Housing issues',
  'Allergies in household',
  'Financial hardship',
  'Behavioral issues',
  'Health reasons (owner)',
  'New baby / family changes',
  'Divorce / separation',
  'Pet health issues',
  'Time constraints',
  'Other',
];

export default function SurrenderPage() {
  useScrollReveal();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0); // 0 = info, 1-3 = form steps
  const [form, setForm] = useState({
    petType: 'dog', petName: '', breed: '', age: '', sex: 'male', weight: '', color: '',
    spayedNeutered: false, vaccinated: false, microchipped: false,
    medicalNotes: '', behaviorNotes: '', reason: '', reasonDetail: '',
    goodWithKids: 'unknown', goodWithDogs: 'unknown', goodWithCats: 'unknown',
    houseTrained: false, crateTrainer: false, leashTrained: false,
    ownerName: '', ownerEmail: '', ownerPhone: '', ownerAddress: '',
    timeOwned: '', previousShelter: false,
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
            Thank you for reaching out. Our team will review your surrender request and contact you within 2–3 business days to schedule a drop-off appointment.
          </p>
          <div className="card" style={{ padding: '24px', textAlign: 'left', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="info" size={16} color="var(--blue-500)" /> What Happens Next
            </h3>
            <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '20px', fontSize: '0.88rem' }}>
              <li>We review your pet&apos;s information and medical history</li>
              <li>Our team contacts you to discuss the surrender</li>
              <li>We schedule a drop-off appointment</li>
              <li>Your pet receives a full veterinary assessment</li>
              <li>We find the best possible new home for your pet</li>
            </ol>
          </div>
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
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: '80px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>

          {/* Before You Surrender - Alternatives */}
          {step === 0 && (
            <>
              <div className="card reveal" style={{ padding: '28px', marginBottom: '24px', borderLeft: '4px solid var(--blue-500)' }}>
                <h3 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="heart" size={18} color="var(--blue-500)" /> Before You Surrender
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem', marginBottom: '16px' }}>
                  We want to help you explore every option. Many common reasons for surrender can be addressed with the right support. Please consider these alternatives first:
                </p>
              </div>

              <div className="grid-2 stagger reveal" style={{ gap: '14px', marginBottom: '32px' }}>
                {ALTERNATIVES.map((alt, i) => (
                  <div key={i} className="card card-3d" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <IconCircle name={alt.icon} size={44} color={alt.color} bgOpacity={0.15} style={{ flexShrink: 0 }} />
                    <div>
                      <h4 style={{ marginBottom: '6px', fontSize: '0.95rem' }}>{alt.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '10px' }}>{alt.desc}</p>
                      <span style={{ color: alt.color, fontWeight: 600, fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {alt.action} <Icon name="arrow" size={12} color={alt.color} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card reveal" style={{ padding: '28px', background: 'var(--bg-secondary)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  If you&apos;ve explored these options and still need to surrender your pet, we&apos;re here to help.
                </p>
                <button onClick={() => setStep(1)} className="btn btn-primary" style={{ borderRadius: 'var(--radius-lg)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="edit" size={16} color="#fff" /> Continue to Surrender Form
                </button>
              </div>
            </>
          )}

          {/* Multi-Step Form */}
          {step > 0 && (
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
                    <div className="grid-3" style={{ marginBottom: '16px' }}>
                      <div className="form-group"><label className="form-label">Age</label><input className="form-input" value={form.age} onChange={e => update('age', e.target.value)} placeholder="e.g. 3 years" /></div>
                      <div className="form-group"><label className="form-label">Sex</label>
                        <select className="form-input form-select" value={form.sex} onChange={e => update('sex', e.target.value)}>
                          <option value="male">Male</option><option value="female">Female</option><option value="unknown">Unknown</option>
                        </select>
                      </div>
                      <div className="form-group"><label className="form-label">Weight (lbs)</label><input className="form-input" type="number" value={form.weight} onChange={e => update('weight', e.target.value)} /></div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">How long have you owned this pet?</label>
                      <input className="form-input" value={form.timeOwned} onChange={e => update('timeOwned', e.target.value)} placeholder="e.g. 2 years, since a puppy" />
                    </div>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      {[['spayedNeutered', 'Spayed/Neutered'], ['vaccinated', 'Up to date on vaccines'], ['microchipped', 'Microchipped']].map(([key, label]) => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                          <input type="checkbox" checked={form[key]} onChange={e => update(key, e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--blue-500)' }} />
                          {label}
                        </label>
                      ))}
                    </div>
                    <button type="button" onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}>Next: Behavior & Medical →</button>
                  </>
                )}

                {/* Step 2: Behavior / Medical */}
                {step === 2 && (
                  <>
                    <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Behavior & Medical</h2>
                    <div style={{ marginBottom: '20px' }}>
                      <label className="form-label">Compatibility</label>
                      <div className="grid-3" style={{ gap: '12px' }}>
                        {[['goodWithKids', 'Good with children?'], ['goodWithDogs', 'Good with dogs?'], ['goodWithCats', 'Good with cats?']].map(([key, label]) => (
                          <div key={key}>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</div>
                            <select className="form-input form-select" value={form[key]} onChange={e => update(key, e.target.value)} style={{ fontSize: '0.85rem' }}>
                              <option value="unknown">Unknown</option><option value="yes">Yes</option><option value="no">No</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      {[['houseTrained', 'House trained'], ['crateTrainer', 'Crate trained'], ['leashTrained', 'Leash trained']].map(([key, label]) => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                          <input type="checkbox" checked={form[key]} onChange={e => update(key, e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--blue-500)' }} />
                          {label}
                        </label>
                      ))}
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px' }}><label className="form-label">Medical Notes</label><textarea className="form-input form-textarea" value={form.medicalNotes} onChange={e => update('medicalNotes', e.target.value)} placeholder="Any medical conditions, medications, allergies, recent vet visits..." /></div>
                    <div className="form-group" style={{ marginBottom: '16px' }}><label className="form-label">Behavior Notes</label><textarea className="form-input form-textarea" value={form.behaviorNotes} onChange={e => update('behaviorNotes', e.target.value)} placeholder="How does the pet behave with children, other animals, strangers? Any triggers or concerns?" /></div>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">Reason for Surrender *</label>
                      <select className="form-input form-select" value={form.reason} onChange={e => update('reason', e.target.value)} required>
                        <option value="">Select a reason...</option>
                        {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    {form.reason && (
                      <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label className="form-label">Please provide more detail</label>
                        <textarea className="form-input form-textarea" value={form.reasonDetail} onChange={e => update('reasonDetail', e.target.value)} placeholder="Help us understand your situation so we can best care for your pet..." />
                      </div>
                    )}
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                      <input type="checkbox" checked={form.previousShelter} onChange={e => update('previousShelter', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--blue-500)' }} />
                      Has this pet been surrendered to a shelter before?
                    </label>

                    {/* Summary Card */}
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '24px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Summary</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                        <div><span style={{ color: 'var(--text-muted)' }}>Pet:</span> {form.petName || '—'}</div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Type:</span> {form.petType}</div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Breed:</span> {form.breed || '—'}</div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Age:</span> {form.age || '—'}</div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Reason:</span> {form.reason || '—'}</div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Owner:</span> {form.ownerName || '—'}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="button" onClick={() => setStep(2)} className="btn" style={{ flex: 1, background: 'var(--bg-secondary)', border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-lg)' }}>← Back</button>
                      <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Icon name="check" size={16} color="#fff" /> {submitting ? 'Submitting...' : 'Submit Surrender Request'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          )}

          {/* Important Notice */}
          {step > 0 && (
            <div className="card reveal" style={{ padding: '20px', marginTop: '20px', borderLeft: '4px solid var(--rose-400)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Icon name="info" size={18} color="var(--rose-400)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  <strong>Important:</strong> Surrender is by appointment only. A surrender fee of $50 may apply. Please do NOT leave animals unattended at the shelter. All surrendered animals will receive veterinary care and we will find them the best possible placement.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
