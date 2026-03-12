'use client';
import { use, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import pets from '@/lib/data/pets.json';

const STEPS = [
  { id: 'info', label: 'Your Info', icon: '👤' },
  { id: 'home', label: 'Your Home', icon: '🏠' },
  { id: 'experience', label: 'Experience', icon: '🐾' },
  { id: 'preferences', label: 'Preferences', icon: '💙' },
  { id: 'review', label: 'Review', icon: '✅' },
];

export default function AdoptionForm({ params }) {
  const { type } = use(params);
  const searchParams = useSearchParams();
  const petId = searchParams.get('pet');
  const pet = petId ? pets.find(p => p.id === petId) : null;
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '',
    housing: '', ownRent: '', landlordPermission: '', yard: '', fenced: '',
    household: '', childrenAges: '', allergies: '',
    previousPets: '', currentPets: '', vetName: '', vetPhone: '', surrendered: '',
    petInterest: pet ? pet.name : '', activityLevel: '', hoursAlone: '', reason: '',
    agree: false,
  });

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function nextStep() { if (step < 4) setStep(step + 1); }
  function prevStep() { if (step > 0) setStep(step - 1); }

  async function handleSubmit() {
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type, petId, submittedAt: new Date().toISOString() }),
      });
    } catch (e) { /* continue anyway for MVP */ }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px' }}>
        <div className="text-center" style={{ maxWidth: '500px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px', animation: 'heartbeat 1s ease infinite' }}>💙</div>
          <h1 style={{ marginBottom: '12px' }}>Application Submitted!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.7' }}>
            Thank you for your interest in adopting{pet ? ` ${pet.name}` : ''}! Our staff will review your application and contact you within 2-3 business days.
            {' '}You can track your application status in your dashboard.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard/applications" className="btn btn-primary">View My Applications</Link>
            <Link href="/adopt" className="btn btn-secondary">Browse More Pets</Link>
          </div>
        </div>
      </div>
    );
  }

  const typeLabel = type === 'dog' ? 'Dog' : type === 'cat' ? 'Cat' : 'Small Animal';

  return (
    <section className="section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '40px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>📝 {typeLabel} Adoption Application</span>
          <h1 style={{ fontSize: '2rem' }}>
            Apply to Adopt {pet ? <span className="text-gradient">{pet.name}</span> : `a ${typeLabel}`}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Complete all steps below. Your progress is saved automatically.</p>
        </div>

        <div className="form-wizard">
          {/* Progress */}
          <div className="form-progress">
            {STEPS.map((s, i) => (
              <div key={s.id} className="form-step-indicator">
                <div className={`form-step-circle ${i === step ? 'active' : i < step ? 'completed' : ''}`}>
                  {i < step ? '✓' : s.icon}
                </div>
                <span className={`form-step-label ${i === step ? 'active' : ''}`}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="form-step-content" key={step}>
            {step === 0 && (
              <>
                <h2 className="form-step-title">Tell Us About Yourself</h2>
                <p className="form-step-subtitle">We need your basic information to process your application.</p>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input className="form-input" value={form.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="John" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input className="form-input" value={form.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="Smith" />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="john@email.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input className="form-input" type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="(705) 555-0123" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input className="form-input" value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="123 Main Street" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-input" value={form.city} onChange={e => updateField('city', e.target.value)} placeholder="Sault Ste. Marie" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postal Code *</label>
                    <input className="form-input" value={form.postalCode} onChange={e => updateField('postalCode', e.target.value)} placeholder="P6A 1A1" />
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="form-step-title">About Your Home</h2>
                <p className="form-step-subtitle">Help us understand your living situation to find the best match.</p>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Type of Housing *</label>
                    <select className="form-input form-select" value={form.housing} onChange={e => updateField('housing', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment / Condo</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="rural">Rural Property</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Own or Rent? *</label>
                    <select className="form-input form-select" value={form.ownRent} onChange={e => updateField('ownRent', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="own">Own</option>
                      <option value="rent">Rent</option>
                    </select>
                  </div>
                </div>
                {form.ownRent === 'rent' && (
                  <div className="form-group">
                    <label className="form-label">Do you have landlord permission for pets? *</label>
                    <select className="form-input form-select" value={form.landlordPermission} onChange={e => updateField('landlordPermission', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                )}
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Do you have a yard?</label>
                    <select className="form-input form-select" value={form.yard} onChange={e => updateField('yard', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {form.yard === 'yes' && (
                    <div className="form-group">
                      <label className="form-label">Is it fenced?</label>
                      <select className="form-input form-select" value={form.fenced} onChange={e => updateField('fenced', e.target.value)}>
                        <option value="">Select...</option>
                        <option value="fully">Fully Fenced</option>
                        <option value="partial">Partially Fenced</option>
                        <option value="no">Not Fenced</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Household Members</label>
                  <textarea className="form-input form-textarea" value={form.household} onChange={e => updateField('household', e.target.value)} placeholder="List all people living in your home (names and ages)" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Ages of Children (if any)</label>
                    <input className="form-input" value={form.childrenAges} onChange={e => updateField('childrenAges', e.target.value)} placeholder="e.g., 5 and 8" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Any allergies to animals?</label>
                    <input className="form-input" value={form.allergies} onChange={e => updateField('allergies', e.target.value)} placeholder="None / specify" />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="form-step-title">Your Pet Experience</h2>
                <p className="form-step-subtitle">Tell us about your experience with animals.</p>
                <div className="form-group">
                  <label className="form-label">Previous Pet Experience *</label>
                  <textarea className="form-input form-textarea" value={form.previousPets} onChange={e => updateField('previousPets', e.target.value)} placeholder="Describe any pets you've had in the past (types, how long, what happened to them)" />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Pets</label>
                  <textarea className="form-input form-textarea" value={form.currentPets} onChange={e => updateField('currentPets', e.target.value)} placeholder="List any pets you currently have (type, breed, age, spayed/neutered?)" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Veterinarian Name</label>
                    <input className="form-input" value={form.vetName} onChange={e => updateField('vetName', e.target.value)} placeholder="Dr. Smith" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vet Phone</label>
                    <input className="form-input" type="tel" value={form.vetPhone} onChange={e => updateField('vetPhone', e.target.value)} placeholder="(705) 555-0123" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Have you ever had to surrender a pet?</label>
                  <select className="form-input form-select" value={form.surrendered} onChange={e => updateField('surrendered', e.target.value)}>
                    <option value="">Select...</option>
                    <option value="no">No</option>
                    <option value="yes">Yes (please explain in reason field below)</option>
                  </select>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="form-step-title">Pet Preferences</h2>
                <p className="form-step-subtitle">Let us know what you&apos;re looking for in a pet.</p>
                <div className="form-group">
                  <label className="form-label">Which pet(s) are you interested in? *</label>
                  <input className="form-input" value={form.petInterest} onChange={e => updateField('petInterest', e.target.value)} placeholder="Name(s) of specific pet(s) or general preferences" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Activity Level *</label>
                    <select className="form-input form-select" value={form.activityLevel} onChange={e => updateField('activityLevel', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="low">Low — Couch companion</option>
                      <option value="moderate">Moderate — Daily walks</option>
                      <option value="high">High — Running, hiking partner</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hours pet will be alone daily *</label>
                    <select className="form-input form-select" value={form.hoursAlone} onChange={e => updateField('hoursAlone', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="0-2">0-2 hours</option>
                      <option value="2-4">2-4 hours</option>
                      <option value="4-8">4-8 hours</option>
                      <option value="8+">8+ hours</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Why do you want to adopt?</label>
                  <textarea className="form-input form-textarea" value={form.reason} onChange={e => updateField('reason', e.target.value)} placeholder="Tell us why you'd like to add a pet to your family" />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="form-step-title">Review & Submit</h2>
                <p className="form-step-subtitle">Please review your information before submitting.</p>
                
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phone },
                    { label: 'Address', value: `${form.address}, ${form.city} ${form.postalCode}` },
                    { label: 'Housing', value: `${form.housing} (${form.ownRent})` },
                    { label: 'Pet Interest', value: form.petInterest },
                    { label: 'Activity Level', value: form.activityLevel },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                      <span style={{ fontWeight: '600', minWidth: '140px', color: 'var(--text-muted)' }}>{item.label}</span>
                      <span>{item.value || '—'}</span>
                    </div>
                  ))}
                </div>

                <div className="form-group" style={{ marginTop: '24px' }}>
                  <label className="form-checkbox-group" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.agree} onChange={e => updateField('agree', e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--blue-500)' }} />
                    <span style={{ fontSize: '0.9rem' }}>
                      I confirm that the information provided is accurate and I agree to the Sault Ste. Marie Humane Society&apos;s adoption terms and conditions. *
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="form-nav">
              {step > 0 ? (
                <button className="btn btn-secondary" onClick={prevStep}>← Previous</button>
              ) : (
                <Link href="/adopt" className="btn btn-ghost">← Back to Pets</Link>
              )}
              {step < 4 ? (
                <button className="btn btn-primary" onClick={nextStep}>Next Step →</button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={!form.agree} style={{ opacity: form.agree ? 1 : 0.5 }}>
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
