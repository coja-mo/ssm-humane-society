'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const STEPS = [
  { id: 'personal', label: 'Personal Info', icon: '👤' },
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'experience', label: 'Experience', icon: '🐾' },
  { id: 'references', label: 'References', icon: '📋' },
  { id: 'review', label: 'Review', icon: '✅' },
];

const INITIAL_FORM = {
  firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', address: '', city: '', province: 'ON', postalCode: '',
  housing: '', ownRent: '', landlordPermission: '', yard: '', fenced: '',
  numAdults: '', numChildren: '', childrenAges: '',
  hasPets: '', currentPetsDescription: '',
  previousFosterExperience: '', previousPetExperience: '',
  availability: '', preferredPetTypes: [], preferredDuration: '', willingSpecialNeeds: '',
  vetClinic: '', vetPhone: '', personalRefName: '', personalRefPhone: '', personalRefRelation: '',
  emergencyName: '', emergencyPhone: '', emergencyRelation: '',
  agreeTerms: false, infoAccurate: false,
};

const LS_KEY = 'ssm-foster-draft';

function FormGroup({ label, required, children, hint }) {
  return (
    <div className="form-group">
      <label className="form-label">{label} {required && <span style={{ color: 'var(--rose-500)' }}>*</span>}</label>
      {hint && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', marginTop: '-2px' }}>{hint}</div>}
      {children}
    </div>
  );
}

function RadioGroup({ name, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {options.map(opt => (
        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '8px 14px', borderRadius: '10px', border: value === opt.value ? '2px solid var(--blue-500)' : '2px solid var(--border-light)', background: value === opt.value ? 'var(--blue-50)' : 'var(--bg-secondary)', fontSize: '0.88rem', transition: 'all 0.2s' }}>
          <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} style={{ display: 'none' }} />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function CheckboxGroup({ options, selected, onChange }) {
  const toggle = (val) => onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(opt => (
        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '8px 14px', borderRadius: '10px', border: selected.includes(opt.value) ? '2px solid var(--blue-500)' : '2px solid var(--border-light)', background: selected.includes(opt.value) ? 'var(--blue-50)' : 'var(--bg-secondary)', fontSize: '0.85rem', transition: 'all 0.2s' }}>
          <input type="checkbox" checked={selected.includes(opt.value)} onChange={() => toggle(opt.value)} style={{ display: 'none' }} />
          {selected.includes(opt.value) ? '✓ ' : ''}{opt.label}
        </label>
      ))}
    </div>
  );
}

export default function FosterPage() {
  useScrollReveal();
  const [step, setStep] = useState(-1); // -1 = info page, 0+ = form steps
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(() => {
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem(LS_KEY);
      if (draft) { try { return { ...INITIAL_FORM, ...JSON.parse(draft) }; } catch {} }
    }
    return { ...INITIAL_FORM };
  });

  useEffect(() => { if (step >= 0) localStorage.setItem(LS_KEY, JSON.stringify(form)); }, [form, step]);

  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  }, []);

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.firstName.trim()) e.firstName = 'Required';
      if (!form.lastName.trim()) e.lastName = 'Required';
      if (!form.email.trim()) e.email = 'Required';
      if (!form.phone.trim()) e.phone = 'Required';
    } else if (s === 4) {
      if (!form.agreeTerms) e.agreeTerms = 'Required';
      if (!form.infoAccurate) e.infoAccurate = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  function nextStep() { if (step < 0) { setStep(0); return; } if (validateStep(step) && step < 4) setStep(step + 1); }
  function prevStep() { if (step > 0) setStep(step - 1); else if (step === 0) setStep(-1); }

  async function saveToProfile() {
    setSaving(true);
    try {
      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      await fetch('/api/foster', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId: user.id || null, status: 'draft', lastSavedAt: new Date().toISOString() }),
      });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error(err); }
    setSaving(false);
  }

  async function handleSubmit() {
    if (!validateStep(4)) return;
    try {
      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      await fetch('/api/foster', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId: user.id || null, status: 'applied', submittedAt: new Date().toISOString() }),
      });
    } catch (err) { console.error(err); }
    localStorage.removeItem(LS_KEY);
    setSubmitted(true);
  }

  const errorStyle = { border: '2px solid var(--rose-400)' };

  if (submitted) {
    return (
      <section style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="container text-center" style={{ maxWidth: '600px' }}>
          <IconCircle name="home" size={80} color="var(--green-500)" bgOpacity={0.15} style={{ margin: '0 auto 24px' }} />
          <h1 style={{ marginBottom: '16px' }}>Application <span className="text-gradient">Received!</span></h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>
            Thank you for your interest in fostering! Our team will review your application and contact you within 3–5 business days.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn btn-primary">My Dashboard</Link>
            <Link href="/" className="btn btn-secondary">Return Home</Link>
          </div>
        </div>
      </section>
    );
  }

  // Info / Landing section (step === -1)
  if (step < 0) {
    return (
      <>
        <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
          <div className="container text-center">
            <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="home" size={14} color="var(--blue-700)" /> Make a Difference
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Become a <span className="text-gradient">Foster Parent</span></h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Every year dozens of shelter animals are given a second chance, thanks to the caring hearts of our volunteer foster homes.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
          <div className="container">
            <div className="grid-4 stagger" style={{ maxWidth: '800px', margin: '0 auto' }}>
              {[
                { n: 62, label: 'Animals Fostered', icon: 'paw', color: 'var(--blue-500)' },
                { n: 48, label: 'Foster Families', icon: 'home', color: 'var(--green-500)' },
                { n: 95, label: '% Adoption Rate', suffix: '', icon: 'check', color: 'var(--blue-400)' },
                { n: 100, label: '% Care Covered', suffix: '', icon: 'heart', color: 'var(--rose-400)' },
              ].map(s => (
                <div key={s.label} className="card card-3d" style={{ textAlign: 'center', padding: '24px' }}>
                  <IconCircle name={s.icon} size={44} color={s.color} bgOpacity={0.15} style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-accent)' }}>
                    <AnimatedCounter target={s.n} suffix={s.suffix ?? '+'} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: '0' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="reveal">
              <div className="card" style={{ padding: '40px', marginBottom: '32px' }}>
                <h2 style={{ marginBottom: '16px' }}>Why <span className="text-gradient">Foster</span>?</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '20px' }}>
                  The shelter environment can be stressful for certain animals. Being able to place these pets into foster homes is incredibly important! Fostering is truly a hands-on, life-saving volunteer experience.
                </p>
                <div className="grid-2" style={{ gap: '12px' }}>
                  {['We provide all food & supplies', 'Veterinary care is covered', 'Ongoing support from staff', 'Flexible commitment times', 'Save a life directly', 'Best volunteer experience'].map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <Icon name="check" size={16} color="var(--green-500)" />
                      <span style={{ fontSize: '0.9rem' }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="story-card" style={{ padding: '32px', marginBottom: '32px', textAlign: 'center' }}>
                <IconCircle name="heart" size={56} color="var(--rose-400)" bgOpacity={0.15} style={{ margin: '0 auto 16px' }} />
                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.8', maxWidth: '500px', margin: '0 auto 16px', fontSize: '1rem' }}>
                  &ldquo;We fostered a litter of kittens and ended up adopting two! The support from the shelter team was amazing. Fostering is the most rewarding thing we&apos;ve ever done.&rdquo;
                </p>
                <p style={{ fontWeight: 700 }}>— The Patel Family</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Foster family since 2023</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button onClick={() => setStep(0)} className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-lg)', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 40px', fontSize: '1.05rem' }}>
                  <Icon name="home" size={18} color="#fff" /> Start Foster Application →
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Multi-step form
  return (
    <section className="section" style={{ paddingTop: '120px' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div className="text-center" style={{ marginBottom: '40px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>🏠 Foster Application</span>
          <h1 style={{ fontSize: '2rem' }}>Apply to <span className="text-gradient">Foster</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Complete all steps below. Your progress is saved automatically.</p>
        </div>

        <div className="form-wizard">
          <div className="form-progress" style={{ marginBottom: '32px' }}>
            {STEPS.map((s, i) => (
              <div key={s.id} className="form-step-indicator" onClick={() => { if (i <= step) setStep(i); }} style={{ cursor: i <= step ? 'pointer' : 'default' }}>
                <div className={`form-step-circle ${i === step ? 'active' : i < step ? 'completed' : ''}`}>
                  {i < step ? '✓' : s.icon}
                </div>
                <span className={`form-step-label ${i === step ? 'active' : ''}`}>{s.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
            {saved && <span style={{ color: 'var(--green-600)', fontSize: '0.85rem', fontWeight: 600 }}>✓ Saved</span>}
            <button type="button" className="btn btn-secondary btn-sm" onClick={saveToProfile} disabled={saving} style={{ borderRadius: '100px' }}>
              {saving ? '⏳ Saving...' : '💾 Save to Profile'}
            </button>
          </div>

          <div className="form-step-content" key={step}>
            {/* Step 0: Personal */}
            {step === 0 && (<>
              <h2 className="form-step-title">Personal Information</h2>
              <p className="form-step-subtitle">Your contact details for the foster program.</p>
              <div className="grid-2">
                <FormGroup label="First Name" required><input className="form-input" value={form.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="Jane" style={errors.firstName ? errorStyle : {}} /></FormGroup>
                <FormGroup label="Last Name" required><input className="form-input" value={form.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="Doe" style={errors.lastName ? errorStyle : {}} /></FormGroup>
              </div>
              <div className="grid-2">
                <FormGroup label="Email" required><input className="form-input" type="email" value={form.email} onChange={e => updateField('email', e.target.value)} style={errors.email ? errorStyle : {}} /></FormGroup>
                <FormGroup label="Phone" required><input className="form-input" type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="(705) 555-0123" style={errors.phone ? errorStyle : {}} /></FormGroup>
              </div>
              <FormGroup label="Date of Birth"><input className="form-input" type="date" value={form.dateOfBirth} onChange={e => updateField('dateOfBirth', e.target.value)} /></FormGroup>
              <FormGroup label="Street Address"><input className="form-input" value={form.address} onChange={e => updateField('address', e.target.value)} /></FormGroup>
              <div className="grid-2">
                <FormGroup label="City"><input className="form-input" value={form.city} onChange={e => updateField('city', e.target.value)} placeholder="Sault Ste. Marie" /></FormGroup>
                <FormGroup label="Postal Code"><input className="form-input" value={form.postalCode} onChange={e => updateField('postalCode', e.target.value)} placeholder="P6A 1A1" /></FormGroup>
              </div>
              {Object.keys(errors).length > 0 && <div style={{ color: 'var(--rose-500)', fontSize: '0.85rem', marginTop: '8px' }}>Please fill in all required fields.</div>}
            </>)}

            {/* Step 1: Home Environment */}
            {step === 1 && (<>
              <h2 className="form-step-title">Home Environment</h2>
              <p className="form-step-subtitle">Help us understand where the foster pet will be staying.</p>
              <div className="grid-2">
                <FormGroup label="Housing Type">
                  <select className="form-input form-select" value={form.housing} onChange={e => updateField('housing', e.target.value)}>
                    <option value="">Select...</option><option value="house">House</option><option value="townhouse">Townhouse/Condo</option>
                    <option value="apartment">Apartment</option><option value="rural">Rural</option><option value="other">Other</option>
                  </select>
                </FormGroup>
                <FormGroup label="Own or Rent?">
                  <RadioGroup name="ownRent" value={form.ownRent} onChange={v => updateField('ownRent', v)} options={[{ value: 'own', label: 'Own' }, { value: 'rent', label: 'Rent' }]} />
                </FormGroup>
              </div>
              {form.ownRent === 'rent' && (
                <FormGroup label="Landlord permission for foster pets?">
                  <RadioGroup name="llPerm" value={form.landlordPermission} onChange={v => updateField('landlordPermission', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'pending', label: 'Pending' }]} />
                </FormGroup>
              )}
              <div className="grid-2">
                <FormGroup label="Yard?"><RadioGroup name="yard" value={form.yard} onChange={v => updateField('yard', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} /></FormGroup>
                {form.yard === 'yes' && <FormGroup label="Fenced?">
                  <select className="form-input form-select" value={form.fenced} onChange={e => updateField('fenced', e.target.value)}>
                    <option value="">Select...</option><option value="fully">Fully</option><option value="partial">Partially</option><option value="no">No</option>
                  </select>
                </FormGroup>}
              </div>
              <div className="grid-2">
                <FormGroup label="Adults in home"><input className="form-input" type="number" min="1" value={form.numAdults} onChange={e => updateField('numAdults', e.target.value)} /></FormGroup>
                <FormGroup label="Children"><input className="form-input" type="number" min="0" value={form.numChildren} onChange={e => updateField('numChildren', e.target.value)} /></FormGroup>
              </div>
              {parseInt(form.numChildren) > 0 && <FormGroup label="Children's Ages"><input className="form-input" value={form.childrenAges} onChange={e => updateField('childrenAges', e.target.value)} placeholder="e.g., 4 and 7" /></FormGroup>}
              <FormGroup label="Do you have other pets?">
                <RadioGroup name="hasPets" value={form.hasPets} onChange={v => updateField('hasPets', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
              </FormGroup>
              {form.hasPets === 'yes' && <FormGroup label="Describe current pets" hint="Type, breed, age, temperament">
                <textarea className="form-input form-textarea" value={form.currentPetsDescription} onChange={e => updateField('currentPetsDescription', e.target.value)} rows={3} />
              </FormGroup>}
            </>)}

            {/* Step 2: Experience & Availability */}
            {step === 2 && (<>
              <h2 className="form-step-title">Experience & Availability</h2>
              <p className="form-step-subtitle">Tell us about your pet care experience and availability.</p>
              <FormGroup label="Previous fostering experience" hint="Have you fostered animals before? If so, describe.">
                <textarea className="form-input form-textarea" value={form.previousFosterExperience} onChange={e => updateField('previousFosterExperience', e.target.value)} placeholder="First time foster, or describe previous experience..." rows={3} />
              </FormGroup>
              <FormGroup label="General pet experience">
                <textarea className="form-input form-textarea" value={form.previousPetExperience} onChange={e => updateField('previousPetExperience', e.target.value)} placeholder="Types of pets, how long, any training experience..." rows={3} />
              </FormGroup>
              <FormGroup label="Availability">
                <RadioGroup name="avail" value={form.availability} onChange={v => updateField('availability', v)} options={[
                  { value: 'weekdays', label: 'Weekdays' }, { value: 'weekends', label: 'Weekends' },
                  { value: 'flexible', label: 'Flexible' }, { value: 'limited', label: 'Limited' },
                ]} />
              </FormGroup>
              <FormGroup label="What type of animals would you like to foster?" hint="Select all that apply">
                <CheckboxGroup selected={form.preferredPetTypes} onChange={v => updateField('preferredPetTypes', v)} options={[
                  { value: 'dogs', label: '🐕 Dogs' }, { value: 'cats', label: '🐈 Cats' },
                  { value: 'puppies', label: '🐶 Puppies' }, { value: 'kittens', label: '🐱 Kittens' },
                  { value: 'small-animals', label: '🐹 Small Animals' }, { value: 'any', label: '💙 Any' },
                ]} />
              </FormGroup>
              <FormGroup label="How long are you willing to foster?">
                <RadioGroup name="duration" value={form.preferredDuration} onChange={v => updateField('preferredDuration', v)} options={[
                  { value: 'short', label: '1–2 weeks' }, { value: 'medium', label: '2–6 weeks' },
                  { value: 'long', label: '6+ weeks' }, { value: 'flexible', label: 'Flexible' },
                ]} />
              </FormGroup>
              <FormGroup label="Would you consider fostering a pet with special medical or behavioral needs?">
                <RadioGroup name="specialNeeds" value={form.willingSpecialNeeds} onChange={v => updateField('willingSpecialNeeds', v)} options={[
                  { value: 'yes', label: 'Yes' }, { value: 'maybe', label: 'Maybe — case by case' }, { value: 'no', label: 'No' },
                ]} />
              </FormGroup>
            </>)}

            {/* Step 3: References */}
            {step === 3 && (<>
              <h2 className="form-step-title">References & Emergency Contact</h2>
              <p className="form-step-subtitle">Please provide veterinary and personal references.</p>
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '14px' }}>🩺 Veterinary Reference</h3>
                <div className="grid-2">
                  <FormGroup label="Vet Clinic Name"><input className="form-input" value={form.vetClinic} onChange={e => updateField('vetClinic', e.target.value)} /></FormGroup>
                  <FormGroup label="Vet Phone"><input className="form-input" type="tel" value={form.vetPhone} onChange={e => updateField('vetPhone', e.target.value)} /></FormGroup>
                </div>
              </div>
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '14px' }}>👤 Personal Reference</h3>
                <div className="grid-2">
                  <FormGroup label="Name"><input className="form-input" value={form.personalRefName} onChange={e => updateField('personalRefName', e.target.value)} /></FormGroup>
                  <FormGroup label="Phone"><input className="form-input" type="tel" value={form.personalRefPhone} onChange={e => updateField('personalRefPhone', e.target.value)} /></FormGroup>
                </div>
                <FormGroup label="Relationship"><input className="form-input" value={form.personalRefRelation} onChange={e => updateField('personalRefRelation', e.target.value)} placeholder="e.g., Friend, Coworker" /></FormGroup>
              </div>
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '14px' }}>🚨 Emergency Contact</h3>
                <div className="grid-2">
                  <FormGroup label="Name"><input className="form-input" value={form.emergencyName} onChange={e => updateField('emergencyName', e.target.value)} /></FormGroup>
                  <FormGroup label="Phone"><input className="form-input" type="tel" value={form.emergencyPhone} onChange={e => updateField('emergencyPhone', e.target.value)} /></FormGroup>
                </div>
                <FormGroup label="Relationship"><input className="form-input" value={form.emergencyRelation} onChange={e => updateField('emergencyRelation', e.target.value)} /></FormGroup>
              </div>
            </>)}

            {/* Step 4: Review */}
            {step === 4 && (<>
              <h2 className="form-step-title">Review & Submit</h2>
              <p className="form-step-subtitle">Please review your information and confirm below.</p>
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '24px' }}>
                {[
                  { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                  { label: 'Email', value: form.email },
                  { label: 'Phone', value: form.phone },
                  { label: 'Address', value: `${form.address}, ${form.city} ${form.postalCode}` },
                  { label: 'Housing', value: `${form.housing || '—'} (${form.ownRent || '—'})` },
                  { label: 'Other Pets', value: form.hasPets || '—' },
                  { label: 'Preferred Types', value: (form.preferredPetTypes || []).join(', ') || '—' },
                  { label: 'Duration', value: form.preferredDuration || '—' },
                  { label: 'Availability', value: form.availability || '—' },
                  { label: 'Vet Clinic', value: form.vetClinic || '—' },
                  { label: 'Emergency Contact', value: form.emergencyName || '—' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid var(--border-light)', gap: '12px' }}>
                    <span style={{ fontWeight: 600, minWidth: '160px', color: 'var(--text-muted)', fontSize: '0.85rem', flexShrink: 0 }}>{item.label}</span>
                    <span style={{ fontSize: '0.88rem' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                {[
                  ['agreeTerms', 'I agree to the SSM Humane Society foster program terms and conditions, including providing proper care and returning the animal when requested.'],
                  ['infoAccurate', 'I confirm that all information provided is accurate and truthful.'],
                ].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', marginBottom: '14px', padding: '12px', borderRadius: '10px', border: errors[key] ? '2px solid var(--rose-400)' : '2px solid transparent', background: form[key] ? 'var(--blue-50)' : 'transparent', transition: 'all 0.2s' }}>
                    <input type="checkbox" checked={form[key]} onChange={e => updateField(key, e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--blue-500)', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>{label}</span>
                  </label>
                ))}
              </div>
              {Object.keys(errors).length > 0 && <div style={{ color: 'var(--rose-500)', fontSize: '0.85rem', marginTop: '12px' }}>Please accept all declarations to submit.</div>}
            </>)}

            {/* Navigation */}
            <div className="form-nav" style={{ marginTop: '32px' }}>
              <button className="btn btn-secondary" onClick={prevStep}>← {step === 0 ? 'Back to Info' : 'Previous'}</button>
              {step < 4 ? (
                <button className="btn btn-primary" onClick={nextStep}>Next Step →</button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={!form.agreeTerms || !form.infoAccurate} style={{ opacity: form.agreeTerms && form.infoAccurate ? 1 : 0.5 }}>
                  🏠 Submit Foster Application
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
