'use client';
import { use, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import pets from '@/lib/data/pets.json';

const STEPS = [
  { id: 'personal', label: 'Personal Info', icon: '👤' },
  { id: 'household', label: 'Household', icon: '🏠' },
  { id: 'pets', label: 'Pet History', icon: '🐾' },
  { id: 'vet', label: 'Vet & Care', icon: '🩺' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '🌅' },
  { id: 'preferences', label: 'Preferences', icon: '💙' },
  { id: 'review', label: 'Review', icon: '✅' },
];

const INITIAL_FORM = {
  // Step 1 — Personal
  firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
  address: '', city: '', province: 'ON', postalCode: '', idType: '',
  // Step 2 — Household
  housing: '', ownRent: '', landlordName: '', landlordPhone: '', landlordPermission: '',
  yard: '', fenced: '', numAdults: '', numChildren: '', childrenAges: '',
  activityLevel: '', allergies: '', primaryCaregiver: '', allMembersMetAnimal: '',
  // Step 3 — Pet History
  currentPets: [], hasPreviousPets: '', previousPetsDetails: '',
  everSurrendered: '', surrenderDetails: '', adoptedFromSSM: '',
  // Step 4 — Vet & Care
  vetClinic: '', vetPhone: '', vetAccountHolder: '', contactedVet: '',
  believeSpayNeuter: '', believeRegularVetCare: '', researchedCosts: '',
  // Step 5 — Lifestyle
  hoursAlone: '', petLocationDay: '', petLocationNight: '',
  planMoving: false, planVacation: false, planScheduleChange: false, planGuests: false,
  returnCircumstances: [],
  // Step 6 — Preferences
  petInterest: '', sizePreference: '', activityPreferenceDog: '', trainingWillingness: '',
  catSexPref: '', catCoatPref: '', catAgePref: '', catPersonality: [],
  smallAnimalType: '', smallAnimalHabitat: '',
  reason: '',
  // Step 7 — Declarations
  noCrueltyConviction: false, infoAccurate: false, understandProcess: false,
};

const LS_KEY = 'ssm-adoption-draft';

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
  const toggle = (val) => {
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  };
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

function CurrentPetRow({ pet, index, onUpdate, onRemove }) {
  const up = (field, val) => onUpdate(index, { ...pet, [field]: val });
  return (
    <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <strong style={{ fontSize: '0.88rem' }}>Pet #{index + 1}</strong>
        <button type="button" onClick={() => onRemove(index)} style={{ background: 'none', border: 'none', color: 'var(--rose-500)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>✕ Remove</button>
      </div>
      <div className="grid-2" style={{ gap: '10px' }}>
        <input className="form-input" placeholder="Name" value={pet.name || ''} onChange={e => up('name', e.target.value)} />
        <input className="form-input" placeholder="Breed" value={pet.breed || ''} onChange={e => up('breed', e.target.value)} />
        <input className="form-input" placeholder="Age" value={pet.age || ''} onChange={e => up('age', e.target.value)} />
        <select className="form-input form-select" value={pet.sex || ''} onChange={e => up('sex', e.target.value)}>
          <option value="">Sex...</option><option value="male">Male</option><option value="female">Female</option>
        </select>
        <select className="form-input form-select" value={pet.fixed || ''} onChange={e => up('fixed', e.target.value)}>
          <option value="">Spayed/Neutered?</option><option value="yes">Yes</option><option value="no">No</option>
        </select>
        <input className="form-input" placeholder="How are they with other animals?" value={pet.animalInteraction || ''} onChange={e => up('animalInteraction', e.target.value)} />
      </div>
    </div>
  );
}

export default function AdoptionForm({ params }) {
  const { type } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const petId = searchParams.get('pet');
  const draftId = searchParams.get('draft');
  const pet = petId ? pets.find(p => p.id === petId) : null;
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(() => {
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem(LS_KEY);
      if (draft) { try { return { ...INITIAL_FORM, ...JSON.parse(draft) }; } catch {} }
    }
    return { ...INITIAL_FORM, petInterest: pet ? pet.name : '' };
  });

  // Auto-save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(form));
  }, [form]);

  // Load draft from server if draftId
  useEffect(() => {
    if (draftId) {
      fetch(`/api/applications/${draftId}`).then(r => r.json()).then(data => {
        if (data && !data.error) setForm(prev => ({ ...prev, ...data }));
      }).catch(() => {});
    }
  }, [draftId]);

  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  }, []);

  const updateCurrentPet = (index, pet) => {
    setForm(prev => {
      const cp = [...(prev.currentPets || [])];
      cp[index] = pet;
      return { ...prev, currentPets: cp };
    });
  };
  const addCurrentPet = () => setForm(prev => ({ ...prev, currentPets: [...(prev.currentPets || []), {}] }));
  const removeCurrentPet = (index) => setForm(prev => ({ ...prev, currentPets: (prev.currentPets || []).filter((_, i) => i !== index) }));

  // Validation
  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.firstName.trim()) e.firstName = 'Required';
      if (!form.lastName.trim()) e.lastName = 'Required';
      if (!form.email.trim()) e.email = 'Required';
      if (!form.phone.trim()) e.phone = 'Required';
      if (!form.address.trim()) e.address = 'Required';
      if (!form.city.trim()) e.city = 'Required';
      if (!form.postalCode.trim()) e.postalCode = 'Required';
    } else if (s === 1) {
      if (!form.housing) e.housing = 'Required';
      if (!form.ownRent) e.ownRent = 'Required';
      if (form.ownRent === 'rent' && !form.landlordPermission) e.landlordPermission = 'Required';
      if (!form.primaryCaregiver.trim()) e.primaryCaregiver = 'Required';
    } else if (s === 3) {
      if (!form.vetClinic.trim()) e.vetClinic = 'Required';
      if (!form.vetPhone.trim()) e.vetPhone = 'Required';
    } else if (s === 6) {
      if (!form.noCrueltyConviction) e.noCrueltyConviction = 'Required';
      if (!form.infoAccurate) e.infoAccurate = 'Required';
      if (!form.understandProcess) e.understandProcess = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  function nextStep() {
    if (validateStep(step) && step < 6) setStep(step + 1);
  }
  function prevStep() { if (step > 0) setStep(step - 1); }
  function goToStep(s) { if (s <= step) setStep(s); }

  async function saveToProfile() {
    setSaving(true);
    try {
      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      const endpoint = draftId ? `/api/applications/${draftId}` : '/api/applications';
      const method = draftId ? 'PATCH' : 'POST';
      const res = await fetch(endpoint, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type, petId, userId: user.id || null, status: 'draft', lastSavedAt: new Date().toISOString() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!draftId && data.id) {
          window.history.replaceState(null, '', `/apply/${type}?draft=${data.id}${petId ? `&pet=${petId}` : ''}`);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) { console.error(err); }
    setSaving(false);
  }

  async function handleSubmit() {
    if (!validateStep(6)) return;
    try {
      const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      const endpoint = draftId ? `/api/applications/${draftId}` : '/api/applications';
      const method = draftId ? 'PATCH' : 'POST';
      await fetch(endpoint, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type, petId, userId: user.id || null, status: 'submitted', submittedAt: new Date().toISOString() }),
      });
    } catch (e) { /* continue anyway */ }
    localStorage.removeItem(LS_KEY);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px' }}>
        <div className="text-center" style={{ maxWidth: '540px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px', animation: 'heartbeat 1s ease infinite' }}>💙</div>
          <h1 style={{ marginBottom: '12px' }}>Application Submitted!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.7' }}>
            Thank you for your interest in adopting{pet ? ` ${pet.name}` : ''}! Our staff will review your application and contact you within 2–3 business days.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '32px', lineHeight: '1.7' }}>
            Please note that adoption is <strong>not first-come, first-served</strong>. We review all applications to find the best match for each animal.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn btn-primary">View My Applications</Link>
            <Link href="/adopt" className="btn btn-secondary">Browse More Pets</Link>
          </div>
        </div>
      </div>
    );
  }

  const typeLabel = type === 'dog' ? 'Dog' : type === 'cat' ? 'Cat' : 'Small Animal';
  const errorStyle = { border: '2px solid var(--rose-400)' };

  return (
    <section className="section" style={{ paddingTop: '120px' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div className="text-center" style={{ marginBottom: '40px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>📝 {typeLabel} Adoption Application</span>
          <h1 style={{ fontSize: '2rem' }}>
            Apply to Adopt {pet ? <span className="text-gradient">{pet.name}</span> : `a ${typeLabel}`}
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '8px auto 0' }}>
            Complete all steps below. Your progress is saved automatically to your browser. Use "Save to Profile" to save across devices.
          </p>
        </div>

        <div className="form-wizard">
          {/* Progress */}
          <div className="form-progress" style={{ marginBottom: '32px' }}>
            {STEPS.map((s, i) => (
              <div key={s.id} className="form-step-indicator" onClick={() => goToStep(i)} style={{ cursor: i <= step ? 'pointer' : 'default' }}>
                <div className={`form-step-circle ${i === step ? 'active' : i < step ? 'completed' : ''}`}>
                  {i < step ? '✓' : s.icon}
                </div>
                <span className={`form-step-label ${i === step ? 'active' : ''}`}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Save Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
            {saved && <span style={{ color: 'var(--green-600)', fontSize: '0.85rem', fontWeight: 600 }}>✓ Saved to profile</span>}
            <button type="button" className="btn btn-secondary btn-sm" onClick={saveToProfile} disabled={saving} style={{ borderRadius: '100px' }}>
              {saving ? '⏳ Saving...' : '💾 Save to Profile'}
            </button>
          </div>

          {/* Step Content */}
          <div className="form-step-content" key={step}>

            {/* ═══ STEP 0: Personal Info ═══ */}
            {step === 0 && (<>
              <h2 className="form-step-title">Personal Information</h2>
              <p className="form-step-subtitle">We need your contact details to process your application.</p>
              <div className="grid-2">
                <FormGroup label="First Name" required>
                  <input className="form-input" value={form.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="John" style={errors.firstName ? errorStyle : {}} />
                </FormGroup>
                <FormGroup label="Last Name" required>
                  <input className="form-input" value={form.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="Smith" style={errors.lastName ? errorStyle : {}} />
                </FormGroup>
              </div>
              <div className="grid-2">
                <FormGroup label="Email" required>
                  <input className="form-input" type="email" value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="john@email.com" style={errors.email ? errorStyle : {}} />
                </FormGroup>
                <FormGroup label="Phone" required>
                  <input className="form-input" type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="(705) 555-0123" style={errors.phone ? errorStyle : {}} />
                </FormGroup>
              </div>
              <FormGroup label="Date of Birth">
                <input className="form-input" type="date" value={form.dateOfBirth} onChange={e => updateField('dateOfBirth', e.target.value)} />
              </FormGroup>
              <FormGroup label="Street Address" required>
                <input className="form-input" value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="123 Main Street" style={errors.address ? errorStyle : {}} />
              </FormGroup>
              <div className="grid-2">
                <FormGroup label="City" required>
                  <input className="form-input" value={form.city} onChange={e => updateField('city', e.target.value)} placeholder="Sault Ste. Marie" style={errors.city ? errorStyle : {}} />
                </FormGroup>
                <FormGroup label="Province">
                  <select className="form-input form-select" value={form.province} onChange={e => updateField('province', e.target.value)}>
                    <option value="ON">Ontario</option><option value="QC">Quebec</option><option value="BC">British Columbia</option>
                    <option value="AB">Alberta</option><option value="MB">Manitoba</option><option value="SK">Saskatchewan</option>
                    <option value="NS">Nova Scotia</option><option value="NB">New Brunswick</option><option value="NL">Newfoundland</option>
                    <option value="PE">PEI</option><option value="NT">NWT</option><option value="YT">Yukon</option><option value="NU">Nunavut</option>
                  </select>
                </FormGroup>
              </div>
              <FormGroup label="Postal Code" required>
                <input className="form-input" value={form.postalCode} onChange={e => updateField('postalCode', e.target.value)} placeholder="P6A 1A1" style={{ maxWidth: '200px', ...(errors.postalCode ? errorStyle : {}) }} />
              </FormGroup>
              <FormGroup label="Photo ID Type">
                <select className="form-input form-select" value={form.idType} onChange={e => updateField('idType', e.target.value)}>
                  <option value="">Select...</option><option value="drivers-license">Driver&apos;s License</option>
                  <option value="health-card">Health Card</option><option value="passport">Passport</option><option value="other">Other</option>
                </select>
              </FormGroup>
              {Object.keys(errors).length > 0 && <div style={{ color: 'var(--rose-500)', fontSize: '0.85rem', marginTop: '8px' }}>Please fill in all required fields.</div>}
            </>)}

            {/* ═══ STEP 1: Household ═══ */}
            {step === 1 && (<>
              <h2 className="form-step-title">Household & Living Situation</h2>
              <p className="form-step-subtitle">Help us understand your home environment.</p>
              <div className="grid-2">
                <FormGroup label="Type of Housing" required>
                  <select className="form-input form-select" value={form.housing} onChange={e => updateField('housing', e.target.value)} style={errors.housing ? errorStyle : {}}>
                    <option value="">Select...</option><option value="house">House</option><option value="townhouse">Townhouse / Condo</option>
                    <option value="apartment">Apartment</option><option value="room">Room</option><option value="trailer">Trailer</option>
                    <option value="rural">Rural Property</option><option value="other">Other</option>
                  </select>
                </FormGroup>
                <FormGroup label="Own or Rent?" required>
                  <RadioGroup name="ownRent" value={form.ownRent} onChange={v => updateField('ownRent', v)} options={[{ value: 'own', label: '🏠 Own' }, { value: 'rent', label: '📋 Rent' }]} />
                </FormGroup>
              </div>
              {form.ownRent === 'rent' && (
                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '16px', borderLeft: '3px solid var(--blue-400)' }}>
                  <div className="grid-2" style={{ gap: '12px' }}>
                    <FormGroup label="Landlord Name">
                      <input className="form-input" value={form.landlordName} onChange={e => updateField('landlordName', e.target.value)} />
                    </FormGroup>
                    <FormGroup label="Landlord Phone">
                      <input className="form-input" type="tel" value={form.landlordPhone} onChange={e => updateField('landlordPhone', e.target.value)} />
                    </FormGroup>
                  </div>
                  <FormGroup label="Do you have landlord permission for pets?" required>
                    <RadioGroup name="landlordPerm" value={form.landlordPermission} onChange={v => updateField('landlordPermission', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'pending', label: 'Pending' }]} />
                  </FormGroup>
                </div>
              )}
              <div className="grid-2">
                <FormGroup label="Do you have a yard?">
                  <RadioGroup name="yard" value={form.yard} onChange={v => updateField('yard', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
                </FormGroup>
                {form.yard === 'yes' && (
                  <FormGroup label="Is it fenced?">
                    <select className="form-input form-select" value={form.fenced} onChange={e => updateField('fenced', e.target.value)}>
                      <option value="">Select...</option><option value="fully">Fully Fenced</option><option value="partial">Partially Fenced</option><option value="no">Not Fenced</option>
                    </select>
                  </FormGroup>
                )}
              </div>
              <div className="grid-2">
                <FormGroup label="Number of Adults in Home">
                  <input className="form-input" type="number" min="1" value={form.numAdults} onChange={e => updateField('numAdults', e.target.value)} placeholder="2" />
                </FormGroup>
                <FormGroup label="Number of Children">
                  <input className="form-input" type="number" min="0" value={form.numChildren} onChange={e => updateField('numChildren', e.target.value)} placeholder="0" />
                </FormGroup>
              </div>
              {parseInt(form.numChildren) > 0 && (
                <FormGroup label="Ages of Children" hint="Please list the ages of all children in the home">
                  <input className="form-input" value={form.childrenAges} onChange={e => updateField('childrenAges', e.target.value)} placeholder="e.g., 3 and 8" />
                </FormGroup>
              )}
              <FormGroup label="How active is your home?" hint="Consider noise level, foot traffic, visitors">
                <RadioGroup name="activityLevel" value={form.activityLevel} onChange={v => updateField('activityLevel', v)} options={[{ value: 'very', label: 'Very Active' }, { value: 'moderate', label: 'Moderately Active' }, { value: 'quiet', label: 'Not Very Active' }]} />
              </FormGroup>
              <FormGroup label="Who will be the primary caregiver?" required>
                <input className="form-input" value={form.primaryCaregiver} onChange={e => updateField('primaryCaregiver', e.target.value)} placeholder="Name of person" style={errors.primaryCaregiver ? errorStyle : {}} />
              </FormGroup>
              <FormGroup label="Have all household members met the animal you&apos;re interested in?">
                <RadioGroup name="allMet" value={form.allMembersMetAnimal} onChange={v => updateField('allMembersMetAnimal', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'Not Yet' }, { value: 'na', label: 'N/A' }]} />
              </FormGroup>
              <FormGroup label="Any pet-related allergies in the household?">
                <input className="form-input" value={form.allergies} onChange={e => updateField('allergies', e.target.value)} placeholder="None / specify" />
              </FormGroup>
              {Object.keys(errors).length > 0 && <div style={{ color: 'var(--rose-500)', fontSize: '0.85rem', marginTop: '8px' }}>Please fill in all required fields.</div>}
            </>)}

            {/* ═══ STEP 2: Pet History ═══ */}
            {step === 2 && (<>
              <h2 className="form-step-title">Current & Previous Pets</h2>
              <p className="form-step-subtitle">Tell us about your experience with animals.</p>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1rem' }}>Current Pets in Your Home</h3>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={addCurrentPet} style={{ borderRadius: '100px' }}>+ Add Pet</button>
                </div>
                {(form.currentPets || []).length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No pets listed. Click &quot;+ Add Pet&quot; if you have any.
                  </div>
                )}
                {(form.currentPets || []).map((pet, i) => (
                  <CurrentPetRow key={i} pet={pet} index={i} onUpdate={updateCurrentPet} onRemove={removeCurrentPet} />
                ))}
              </div>

              <FormGroup label="Have you had pets before?">
                <RadioGroup name="prevPets" value={form.hasPreviousPets} onChange={v => updateField('hasPreviousPets', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
              </FormGroup>
              {form.hasPreviousPets === 'yes' && (
                <FormGroup label="Previous pets details" hint="Type, how long, what happened to them">
                  <textarea className="form-input form-textarea" value={form.previousPetsDetails} onChange={e => updateField('previousPetsDetails', e.target.value)} placeholder="e.g., Had a Labrador for 12 years who passed of old age in 2022..." rows={4} />
                </FormGroup>
              )}
              <FormGroup label="Have you ever surrendered or given away a pet?">
                <RadioGroup name="surrendered" value={form.everSurrendered} onChange={v => updateField('everSurrendered', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
              </FormGroup>
              {form.everSurrendered === 'yes' && (
                <FormGroup label="Please explain the circumstances">
                  <textarea className="form-input form-textarea" value={form.surrenderDetails} onChange={e => updateField('surrenderDetails', e.target.value)} rows={3} />
                </FormGroup>
              )}
              <FormGroup label="Have you adopted from the Sault Ste. Marie Humane Society before?">
                <RadioGroup name="adoptedSSM" value={form.adoptedFromSSM} onChange={v => updateField('adoptedFromSSM', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
              </FormGroup>
            </>)}

            {/* ═══ STEP 3: Vet & Care ═══ */}
            {step === 3 && (<>
              <h2 className="form-step-title">Veterinary & Care Commitment</h2>
              <p className="form-step-subtitle">We want to ensure every pet receives proper veterinary care.</p>
              <div className="grid-2">
                <FormGroup label="Veterinary Clinic Name" required>
                  <input className="form-input" value={form.vetClinic} onChange={e => updateField('vetClinic', e.target.value)} placeholder="Sault Animal Hospital" style={errors.vetClinic ? errorStyle : {}} />
                </FormGroup>
                <FormGroup label="Vet Phone Number" required>
                  <input className="form-input" type="tel" value={form.vetPhone} onChange={e => updateField('vetPhone', e.target.value)} placeholder="(705) 555-0123" style={errors.vetPhone ? errorStyle : {}} />
                </FormGroup>
              </div>
              <FormGroup label="Name on the vet account">
                <input className="form-input" value={form.vetAccountHolder} onChange={e => updateField('vetAccountHolder', e.target.value)} />
              </FormGroup>
              <FormGroup label="Have you contacted your vet about adding a new pet?">
                <RadioGroup name="contactedVet" value={form.contactedVet} onChange={v => updateField('contactedVet', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'Not Yet' }]} />
              </FormGroup>
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px', marginTop: '16px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Care Commitment</h3>
                <FormGroup label="Do you believe in spaying/neutering pets?">
                  <RadioGroup name="spayNeuter" value={form.believeSpayNeuter} onChange={v => updateField('believeSpayNeuter', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Unsure' }]} />
                </FormGroup>
                <FormGroup label="Do you believe in regular veterinary care (yearly check-ups)?">
                  <RadioGroup name="regVet" value={form.believeRegularVetCare} onChange={v => updateField('believeRegularVetCare', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
                </FormGroup>
                <FormGroup label="Have you researched the costs of pet ownership?" hint="Including vet/medical, food, grooming, boarding, training, and enrichment">
                  <RadioGroup name="costs" value={form.researchedCosts} onChange={v => updateField('researchedCosts', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'Not Yet' }]} />
                </FormGroup>
              </div>
              {Object.keys(errors).length > 0 && <div style={{ color: 'var(--rose-500)', fontSize: '0.85rem', marginTop: '8px' }}>Please fill in all required fields.</div>}
            </>)}

            {/* ═══ STEP 4: Lifestyle ═══ */}
            {step === 4 && (<>
              <h2 className="form-step-title">Lifestyle & Plans</h2>
              <p className="form-step-subtitle">Help us understand your daily routine and future plans.</p>
              <FormGroup label="On average, how many hours will the pet be left alone daily?" required>
                <RadioGroup name="hoursAlone" value={form.hoursAlone} onChange={v => updateField('hoursAlone', v)} options={[
                  { value: '0-4', label: '0–4 hrs' }, { value: '5-9', label: '5–9 hrs' },
                  { value: '10-12', label: '10–12 hrs' }, { value: '12+', label: '12+ hrs' },
                ]} />
              </FormGroup>
              <div className="grid-2">
                <FormGroup label={`Where will the ${type === 'cat' ? 'cat' : 'pet'} stay during the day?`}>
                  <select className="form-input form-select" value={form.petLocationDay} onChange={e => updateField('petLocationDay', e.target.value)}>
                    <option value="">Select...</option><option value="loose-inside">Loose in the house</option>
                    <option value="crated">Crated inside</option><option value="fenced-yard">Fenced yard</option>
                    <option value="kennel-run">Fenced kennel/run</option><option value="loose-outside">Loose outside</option>
                    <option value="room">Specific room</option>
                  </select>
                </FormGroup>
                <FormGroup label="Where will they stay at night?">
                  <select className="form-input form-select" value={form.petLocationNight} onChange={e => updateField('petLocationNight', e.target.value)}>
                    <option value="">Select...</option><option value="loose-inside">Loose in the house</option>
                    <option value="crated">Crated</option><option value="bedroom">In bedroom</option>
                    <option value="outside">Outside</option><option value="garage">Garage/basement</option>
                  </select>
                </FormGroup>
              </div>
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px', marginTop: '16px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Do you have any of the following plans in the near future?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[['planMoving', 'Moving'], ['planVacation', 'Travelling / Vacation'], ['planScheduleChange', 'Change in schedule'], ['planGuests', 'Guests staying']].map(([key, label]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={form[key]} onChange={e => updateField(key, e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--blue-500)' }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <FormGroup label="Under what circumstances would you return the animal?" hint="Select all that apply">
                <CheckboxGroup selected={form.returnCircumstances} onChange={v => updateField('returnCircumstances', v)} options={[
                  { value: 'new-baby', label: 'New baby' }, { value: 'moving', label: 'Moving' },
                  { value: 'too-costly', label: 'Too costly' }, { value: 'aggression', label: 'Aggression' },
                  { value: 'medical', label: 'Medical reasons' }, { value: 'no-time', label: 'Not enough time' },
                  { value: 'behavior', label: 'Behavior problems' }, { value: 'would-not', label: 'Would not return' },
                ]} />
              </FormGroup>
            </>)}

            {/* ═══ STEP 5: Preferences ═══ */}
            {step === 5 && (<>
              <h2 className="form-step-title">{typeLabel} Preferences</h2>
              <p className="form-step-subtitle">Tell us what you&apos;re looking for in a {type === 'small-animal' ? 'small animal' : type}.</p>
              <FormGroup label={`Which ${type === 'small-animal' ? 'animal' : type}(s) are you interested in?`}>
                <input className="form-input" value={form.petInterest} onChange={e => updateField('petInterest', e.target.value)} placeholder={pet ? pet.name : 'Name(s) or general description'} />
              </FormGroup>

              {type === 'dog' && (<>
                <FormGroup label="Preferred Size">
                  <RadioGroup name="sizePref" value={form.sizePreference} onChange={v => updateField('sizePreference', v)} options={[
                    { value: 'small', label: 'Small (under 25 lbs)' }, { value: 'medium', label: 'Medium (25–50 lbs)' },
                    { value: 'large', label: 'Large (50+ lbs)' }, { value: 'any', label: 'Any size' },
                  ]} />
                </FormGroup>
                <FormGroup label="Desired Activity Level">
                  <RadioGroup name="actPref" value={form.activityPreferenceDog} onChange={v => updateField('activityPreferenceDog', v)} options={[
                    { value: 'low', label: '🛋️ Couch companion' }, { value: 'moderate', label: '🚶 Daily walks' }, { value: 'high', label: '🏃 Running/hiking partner' },
                  ]} />
                </FormGroup>
                <FormGroup label="Are you willing to work with a dog that needs training?">
                  <RadioGroup name="training" value={form.trainingWillingness} onChange={v => updateField('trainingWillingness', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'some', label: 'Some training OK' }, { value: 'no', label: 'Prefer fully trained' }]} />
                </FormGroup>
              </>)}

              {type === 'cat' && (<>
                <div className="grid-2">
                  <FormGroup label="Preferred Sex">
                    <select className="form-input form-select" value={form.catSexPref} onChange={e => updateField('catSexPref', e.target.value)}>
                      <option value="">No preference</option><option value="male">Male</option><option value="female">Female</option>
                    </select>
                  </FormGroup>
                  <FormGroup label="Preferred Age">
                    <select className="form-input form-select" value={form.catAgePref} onChange={e => updateField('catAgePref', e.target.value)}>
                      <option value="">No preference</option><option value="kitten">Kitten</option><option value="young">Young (1–3 yrs)</option>
                      <option value="adult">Adult (3–8 yrs)</option><option value="senior">Senior (8+ yrs)</option>
                    </select>
                  </FormGroup>
                </div>
                <FormGroup label="Preferred Coat Type">
                  <select className="form-input form-select" value={form.catCoatPref} onChange={e => updateField('catCoatPref', e.target.value)}>
                    <option value="">No preference</option><option value="short">Short hair</option><option value="long">Long hair</option>
                  </select>
                </FormGroup>
                <FormGroup label="Desired Personality Traits" hint="Select all that apply">
                  <CheckboxGroup selected={form.catPersonality} onChange={v => updateField('catPersonality', v)} options={[
                    { value: 'child-friendly', label: 'Friendly with children' }, { value: 'cat-friendly', label: 'Friendly with other cats' },
                    { value: 'dog-friendly', label: 'Friendly with dogs' }, { value: 'lap-cat', label: 'Enjoys being held/petted' },
                    { value: 'calm', label: 'Calm' }, { value: 'playful', label: 'Playful' },
                    { value: 'independent', label: 'Independent' }, { value: 'quiet', label: 'Quiet' },
                    { value: 'litter-trained', label: 'Always uses litter box' },
                  ]} />
                </FormGroup>
              </>)}

              {type === 'small-animal' && (<>
                <FormGroup label="What type of small animal?">
                  <select className="form-input form-select" value={form.smallAnimalType} onChange={e => updateField('smallAnimalType', e.target.value)}>
                    <option value="">Select...</option><option value="rabbit">Rabbit</option><option value="guinea-pig">Guinea Pig</option>
                    <option value="hamster">Hamster</option><option value="bird">Bird</option><option value="reptile">Reptile</option><option value="other">Other</option>
                  </select>
                </FormGroup>
                <FormGroup label="Describe your cage/habitat setup" hint="Type, size, accessories">
                  <textarea className="form-input form-textarea" value={form.smallAnimalHabitat} onChange={e => updateField('smallAnimalHabitat', e.target.value)} rows={3} />
                </FormGroup>
              </>)}

              <FormGroup label="Why do you want to adopt?">
                <textarea className="form-input form-textarea" value={form.reason} onChange={e => updateField('reason', e.target.value)} placeholder="Tell us why you'd like to add a pet to your family" rows={4} />
              </FormGroup>
            </>)}

            {/* ═══ STEP 6: Review ═══ */}
            {step === 6 && (<>
              <h2 className="form-step-title">Declarations & Review</h2>
              <p className="form-step-subtitle">Please review your information and confirm the declarations below.</p>

              {/* Declarations */}
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Declarations</h3>
                {[
                  ['noCrueltyConviction', 'I confirm that I have NOT been convicted of neglect or cruelty to animals.'],
                  ['infoAccurate', 'I confirm that all information provided in this application is accurate and truthful. I understand that any misrepresentation may result in withdrawal of my application.'],
                  ['understandProcess', 'I understand that completing this form does not guarantee adoption, and that the SSM Humane Society reviews all applications to find the best home for each animal — adoption is not first-come, first-served.'],
                ].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', marginBottom: '14px', padding: '12px', borderRadius: '10px', border: errors[key] ? '2px solid var(--rose-400)' : '2px solid transparent', background: form[key] ? 'var(--blue-50)' : 'transparent', transition: 'all 0.2s' }}>
                    <input type="checkbox" checked={form[key]} onChange={e => updateField(key, e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--blue-500)', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>{label}</span>
                  </label>
                ))}
              </div>

              {/* Summary */}
              <div style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Application Summary</h3>
                {[
                  { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                  { label: 'Email', value: form.email },
                  { label: 'Phone', value: form.phone },
                  { label: 'Address', value: `${form.address}, ${form.city}, ${form.province} ${form.postalCode}` },
                  { label: 'Housing', value: `${form.housing || '—'} (${form.ownRent || '—'})` },
                  { label: 'Landlord Permission', value: form.ownRent === 'rent' ? form.landlordPermission || '—' : 'N/A (owner)' },
                  { label: 'Yard', value: form.yard === 'yes' ? `Yes (${form.fenced || 'fencing not specified'})` : form.yard || '—' },
                  { label: 'Household', value: `${form.numAdults || '?'} adult(s), ${form.numChildren || '0'} children` },
                  { label: 'Primary Caregiver', value: form.primaryCaregiver || '—' },
                  { label: 'Current Pets', value: (form.currentPets || []).length > 0 ? (form.currentPets || []).map(p => p.name || 'Unnamed').join(', ') : 'None' },
                  { label: 'Ever Surrendered', value: form.everSurrendered || '—' },
                  { label: 'Vet Clinic', value: form.vetClinic || '—' },
                  { label: 'Vet Phone', value: form.vetPhone || '—' },
                  { label: 'Hours Alone', value: form.hoursAlone || '—' },
                  { label: 'Pet Interest', value: form.petInterest || '—' },
                  { label: 'Reason', value: form.reason || '—' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid var(--border-light)', gap: '12px' }}>
                    <span style={{ fontWeight: '600', minWidth: '160px', color: 'var(--text-muted)', fontSize: '0.85rem', flexShrink: 0 }}>{item.label}</span>
                    <span style={{ fontSize: '0.88rem' }}>{item.value || '—'}</span>
                  </div>
                ))}
              </div>
              {Object.keys(errors).length > 0 && <div style={{ color: 'var(--rose-500)', fontSize: '0.85rem', marginTop: '12px' }}>Please accept all declarations above to submit.</div>}
            </>)}

            {/* Navigation */}
            <div className="form-nav" style={{ marginTop: '32px' }}>
              {step > 0 ? (
                <button className="btn btn-secondary" onClick={prevStep}>← Previous</button>
              ) : (
                <Link href="/adopt" className="btn btn-ghost">← Back to Pets</Link>
              )}
              {step < 6 ? (
                <button className="btn btn-primary" onClick={nextStep}>Next Step →</button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={!form.noCrueltyConviction || !form.infoAccurate || !form.understandProcess} style={{ opacity: form.noCrueltyConviction && form.infoAccurate && form.understandProcess ? 1 : 0.5 }}>
                  🐾 Submit Application
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
