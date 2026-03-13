'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import pets from '@/lib/data/pets.json';
import PetImage from '@/components/pets/PetImage';
import useScrollReveal from '@/components/effects/useScrollReveal';
import Icon, { IconCircle } from '@/components/ui/Icon';

// Trait scoring for radar chart
const ENERGY_TRAITS = ['energetic', 'playful', 'fetch-lover', 'snow-lover'];
const FRIENDLY_TRAITS = ['friendly', 'people-lover', 'social', 'attention-lover', 'sweet'];
const TRAIN_TRAITS = ['smart', 'trainable', 'treat-motivated'];
const INDEPENDENT_TRAITS = ['calm', 'laid-back', 'chill', 'napper', 'shy-at-first'];
const CUDDLY_TRAITS = ['cuddly', 'lap-cat', 'snuggly', 'cuddle-buddy', 'affectionate', 'loving', 'lovebug', 'belly-rub-lover', 'cozy'];

function getRadarScores(pet) {
  const traits = pet.traits.map(t => t.toLowerCase());
  const score = (arr) => Math.min(5, Math.max(1, 1 + arr.filter(t => traits.includes(t)).length * 1.5));
  return {
    Energy: score(ENERGY_TRAITS),
    Friendliness: score(FRIENDLY_TRAITS),
    Trainability: score(TRAIN_TRAITS),
    Independence: score(INDEPENDENT_TRAITS),
    Cuddliness: score(CUDDLY_TRAITS),
  };
}

function RadarChart({ scores }) {
  const labels = Object.keys(scores);
  const values = Object.values(scores);
  const cx = 100, cy = 100, r = 70;
  const angleStep = (2 * Math.PI) / labels.length;
  const startAngle = -Math.PI / 2;
  
  const getPoint = (value, index) => {
    const angle = startAngle + angleStep * index;
    const dist = (value / 5) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const gridLevels = [1, 2, 3, 4, 5];
  
  return (
    <div className="radar-chart">
      <svg viewBox="0 0 200 200">
        {/* Grid lines */}
        {gridLevels.map(level => {
          const points = labels.map((_, i) => getPoint(level, i));
          return (
            <polygon
              key={level}
              className="radar-grid-line"
              points={points.map(p => `${p.x},${p.y}`).join(' ')}
            />
          );
        })}
        {/* Axis lines */}
        {labels.map((_, i) => {
          const p = getPoint(5, i);
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} className="radar-grid-line" />;
        })}
        {/* Data polygon */}
        <polygon
          className="radar-data"
          points={values.map((v, i) => { const p = getPoint(v, i); return `${p.x},${p.y}`; }).join(' ')}
        />
        {/* Data points */}
        {values.map((v, i) => {
          const p = getPoint(v, i);
          return <circle key={i} cx={p.x} cy={p.y} className="radar-dot" />;
        })}
        {/* Labels */}
        {labels.map((label, i) => {
          const p = getPoint(6, i);
          return (
            <text key={label} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="radar-label">
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
          <button className="faq-trigger" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            {item.q}
            <svg className="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div className="faq-content">
            <div className="faq-content-inner">{item.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const ADOPTION_FAQ = [
  { q: 'What is the adoption fee?', a: 'Dog adoption fees are $350, cat fees are $175, and critter fees start at $25. All fees include spay/neuter, vaccinations, microchip, deworming, and a vet health check.' },
  { q: 'Can I visit and meet the pet before adopting?', a: 'Absolutely! After your application is reviewed, we\'ll schedule a meet & greet so you and the pet can spend quality time together. We want to make sure it\'s the perfect match.' },
  { q: 'How long does the adoption process take?', a: 'Application review typically takes 1-3 business days. After approval, you can schedule a meet & greet and potentially take your new friend home the same day!' },
  { q: 'What if it doesn\'t work out?', a: 'We want every adoption to be a success. If things don\'t work out within the first 30 days, you can return the pet and we\'ll work with you to find a better match. No pet will be left without a plan.' },
  { q: 'Do you offer a trial foster period?', a: 'Yes! We offer foster-to-adopt programs for pets who may benefit from a transition period. This lets both pet and family adjust before making it official.' },
];

export default function PetProfile({ params }) {
  const { id } = use(params);
  const pet = pets.find(p => p.id === id);
  useScrollReveal();
  const [isFaved, setIsFaved] = useState(false);
  const [showShare, setShowShare] = useState(false);

  if (!pet) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '100px' }}>
        <IconCircle name="search" size={80} color="var(--text-muted)" bgOpacity={0.1} style={{ marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }} />
        <h1>Pet Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>This pet may have already been adopted!</p>
        <Link href="/adopt" className="btn btn-primary" style={{ borderRadius: 'var(--radius-xl)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="arrow" size={16} color="#fff" style={{ transform: 'rotate(180deg)' }} /> Back to All Pets
        </Link>
      </div>
    );
  }

  const related = pets.filter(p => p.type === pet.type && p.id !== pet.id).slice(0, 4);
  const daysInShelter = Math.floor((new Date() - new Date(pet.dateAdded)) / 86400000);
  const typeIcon = pet.type === 'dog' ? 'dog' : pet.type === 'cat' ? 'cat' : 'bird';
  const typeLabel = pet.type === 'dog' ? 'Dog' : pet.type === 'cat' ? 'Cat' : 'Critter';
  const typeEmoji = pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐈' : '🐦';
  const radarScores = getRadarScores(pet);

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ 
        paddingTop: '100px', paddingBottom: '0',
        background: 'linear-gradient(180deg, var(--blue-50), var(--bg-primary))',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>Home</Link>
            <span>/</span>
            <Link href="/adopt" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>Adopt</Link>
            <span>/</span>
            <Link href={`/adopt?type=${pet.type}`} style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}>{typeLabel}s</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{pet.name}</span>
          </div>
        </div>
      </div>

      {/* Profile Hero */}
      <section className="section" style={{ paddingTop: '24px' }}>
        <div className="container">
          <div className="pet-profile-hero">
            {/* Image Column */}
            <div className="reveal-left" style={{ position: 'relative' }}>
              <div className="pet-profile-img-wrap" style={{ 
                boxShadow: 'var(--shadow-lg), 0 20px 60px rgba(41,171,226,0.1)',
                borderRadius: 'var(--radius-xl)',
              }}>
                <PetImage pet={pet} size="profile" />
                {/* Days badge */}
                <div style={{
                  position: 'absolute', bottom: '16px', left: '16px',
                  padding: '8px 16px', borderRadius: '100px',
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                  color: '#fff', fontSize: '0.8rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <Icon name="calendar" size={12} color="#fff" /> {daysInShelter} days at shelter
                </div>
                {/* Type badge */}
                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  padding: '6px 14px', borderRadius: '100px',
                  background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
                  fontSize: '0.8rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  color: 'var(--text-primary)',
                }}>
                  {typeEmoji} {typeLabel}
                </div>
              </div>

              {/* Action bar under image */}
              <div style={{
                display: 'flex', gap: '8px', marginTop: '16px',
              }}>
                <button 
                  className={`btn btn-sm ${isFaved ? 'btn-danger' : 'btn-ghost'}`}
                  onClick={() => setIsFaved(!isFaved)}
                  style={{ flex: 1, borderRadius: 'var(--radius-md)', border: isFaved ? 'none' : '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Icon name="heart" size={16} color={isFaved ? '#fff' : 'var(--rose-500)'} />
                  {isFaved ? 'Saved!' : 'Save'}
                </button>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => setShowShare(!showShare)}
                  style={{ flex: 1, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Icon name="link" size={16} /> Share
                </button>
              </div>
              {showShare && (
                <div style={{
                  marginTop: '8px', padding: '12px', background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex', gap: '8px', animation: 'fadeInUp 0.3s ease',
                }}>
                  {['Facebook', 'Twitter', 'Email'].map(p => (
                    <button key={p} className="btn btn-sm btn-ghost" style={{ flex: 1, borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Personality Radar Chart */}
              <div className="reveal" style={{
                marginTop: '20px', padding: '20px',
                background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
              }}>
                <h4 style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Icon name="paw" size={14} color="var(--blue-500)" /> Personality Profile
                </h4>
                <RadarChart scores={radarScores} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '8px' }}>
                  {Object.entries(radarScores).map(([key, val]) => (
                    <span key={key} style={{
                      fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)',
                      padding: '2px 8px', background: 'var(--bg-secondary)', borderRadius: '100px',
                    }}>
                      {key}: {Math.round(val)}/5
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="reveal-right">
              <span className="badge badge-green" style={{ 
                marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px',
                animation: 'glowPulse 3s ease-in-out infinite', padding: '6px 14px',
              }}>
                <Icon name="check" size={14} color="var(--green-800)" /> Available for Adoption
              </span>
              <h1 className="pet-profile-name" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{pet.name}</h1>
              <p className="pet-profile-meta">{pet.breed} · {pet.age} · {pet.gender}</p>
              <p className="pet-profile-desc">{pet.description}</p>
              
              {/* Traits & Restrictions */}
              <div className="pet-profile-traits" style={{ marginBottom: '24px' }}>
                {pet.traits.map(t => (
                  <span key={t} className="badge badge-blue" style={{ padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {t.replace(/-/g, ' ')}
                  </span>
                ))}
                {pet.restrictions.map(r => (
                  <span key={r} className="badge badge-rose" style={{ padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Icon name="shield" size={12} color="var(--rose-600)" /> {r.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>

              {/* Quick Facts Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
                {[
                  { label: 'Type', value: typeLabel, icon: typeIcon, color: 'var(--blue-500)' },
                  { label: 'Age', value: pet.age, icon: 'clock', color: 'var(--green-500)' },
                  { label: 'Gender', value: pet.gender, icon: 'people', color: 'var(--rose-400)' },
                  { label: 'Waiting', value: `${daysInShelter}d`, icon: 'calendar', color: '#F59E0B' },
                ].map((f, i) => (
                  <div key={i} style={{ 
                    padding: '14px 10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', 
                    textAlign: 'center', border: '1px solid var(--border-light)',
                    transition: 'all 0.3s',
                  }}>
                    <Icon name={f.icon} size={18} color={f.color} style={{ marginBottom: '6px' }} />
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{f.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Adoption CTA with social proof */}
              <div style={{
                padding: '24px', borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--blue-50), var(--green-50))',
                border: '1px solid var(--border-light)', marginBottom: '20px',
              }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>💛</span> Interested in {pet.name.split(' ')[0]}?
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.6' }}>
                  Submit an adoption application and our team will be in touch to schedule a meet & greet!
                </p>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', background: 'rgba(245,158,11,0.08)', borderRadius: 'var(--radius-md)',
                  marginBottom: '16px', fontSize: '0.78rem', color: '#B45309', fontWeight: 600,
                }}>
                  <Icon name="people" size={14} color="#B45309" />
                  Other families are also interested in {pet.name.split(' ')[0]}
                </div>
                <div className="pet-profile-actions" style={{ gap: '10px' }}>
                  <Link href={`/apply/${pet.type}?pet=${pet.id}`} className="btn btn-primary btn-lg glow-border-hover" style={{ borderRadius: 'var(--radius-xl)', display: 'inline-flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <Icon name="edit" size={18} color="#fff" /> Apply to Adopt
                  </Link>
                </div>
              </div>

              {/* Contact Info */}
              <div style={{ 
                padding: '16px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' 
              }}>
                <Icon name="phone" size={18} color="var(--text-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  <strong>Questions?</strong> Call <a href="tel:7059493573" style={{ color: 'var(--text-accent)', fontWeight: '600' }}>705-949-3573</a> (12-5 PM) or email{' '}
                  <a href="mailto:adoptions@ssmhumanesociety.ca" style={{ color: 'var(--text-accent)', fontWeight: '600' }}>adoptions@ssmhumanesociety.ca</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adoption Info Section */}
      <section style={{
        padding: '48px 0',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-light)',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="reveal" style={{
              padding: '24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <IconCircle name="check" size={36} color="var(--green-500)" bgOpacity={0.1} />
                <h4 style={{ fontSize: '1rem' }}>What&apos;s Included</h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Spay/Neuter surgery', 'Up-to-date vaccinations', 'Microchip', 'Deworming treatment', 'Veterinary health check'].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Icon name="check" size={14} color="var(--green-500)" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal" style={{
              padding: '24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <IconCircle name="clock" size={36} color="var(--blue-500)" bgOpacity={0.1} />
                <h4 style={{ fontSize: '1rem' }}>Adoption Process</h4>
              </div>
              <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', counter: 'none' }}>
                {[
                  'Submit an online application',
                  'Application review (1-3 business days)',
                  'Meet & greet with the pet',
                  'Finalize adoption & take home!',
                ].map((step, i) => (
                  <li key={step} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      background: 'var(--blue-100)', color: 'var(--blue-700)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700,
                    }}>{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="reveal" style={{
              padding: '24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <IconCircle name="home" size={36} color="var(--rose-500)" bgOpacity={0.1} />
                <h4 style={{ fontSize: '1rem' }}>Shelter Info</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { icon: 'pin', label: '520 Fifth Line East, SSM, ON' },
                  { icon: 'phone', label: '705-949-3573' },
                  { icon: 'clock', label: 'Mon-Fri: 12-5 PM' },
                  { icon: 'mail', label: 'adoptions@ssmhumanesociety.ca' },
                ].map((info, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Icon name={info.icon} size={14} color="var(--text-accent)" /> {info.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adoption FAQ */}
      <section className="section" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="text-center reveal" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', marginBottom: '8px' }}>
              Adoption <span className="text-gradient">FAQ</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Common questions about bringing {pet.name.split(' ')[0]} home
            </p>
          </div>
          <div className="reveal">
            <FaqAccordion items={ADOPTION_FAQ} />
          </div>
        </div>
      </section>

      {/* Related Pets */}
      {related.length > 0 && (
        <section className="section" style={{ paddingTop: '60px' }}>
          <div className="container">
            <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon name={typeIcon} size={24} color="var(--text-accent)" /> More {typeLabel}s Looking for Homes
              </h2>
              <Link href={`/adopt?type=${pet.type}`} className="btn btn-sm btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                View All <Icon name="arrow" size={14} />
              </Link>
            </div>
            <div className="grid-4 stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
              {related.map(rp => (
                <Link href={`/adopt/${rp.id}`} key={rp.id} className="pet-card card-3d">
                  <div className="pet-card-img-wrap" style={{ aspectRatio: '1/1' }}>
                    <PetImage pet={rp} />
                    <div className="quick-view-overlay">
                      <span className="btn btn-sm btn-primary" style={{ borderRadius: '100px' }}>
                        Meet {rp.name.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                  <div className="pet-card-body" style={{ padding: '16px' }}>
                    <h3 className="pet-card-name" style={{ fontSize: '1.1rem' }}>{rp.name}</h3>
                    <p className="pet-card-meta">{rp.breed} · {rp.age} · {rp.gender}</p>
                    <div className="pet-card-traits">
                      {rp.traits.slice(0, 2).map(t => <span key={t} className="badge badge-outline" style={{ fontSize: '0.7rem' }}>{t.replace(/-/g, ' ')}</span>)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section style={{
        padding: '48px 0',
        background: 'linear-gradient(135deg, var(--bg-dark-section), #162338)',
        color: 'var(--text-on-dark)', textAlign: 'center',
      }}>
        <div className="container">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>
            Can&apos;t adopt right now? You can still help!
          </h3>
          <p style={{ color: '#94A3B8', maxWidth: '500px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
            Consider fostering, volunteering, or making a donation to support animals like {pet.name.split(' ')[0]}.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/foster" className="btn btn-primary" style={{ borderRadius: 'var(--radius-xl)' }}>
              <Icon name="home" size={16} color="#fff" /> Foster
            </Link>
            <Link href="/volunteer" className="btn btn-secondary" style={{ borderRadius: 'var(--radius-xl)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              <Icon name="heart" size={16} color="#fff" /> Volunteer
            </Link>
            <Link href="/donate" className="btn btn-ghost" style={{ borderRadius: 'var(--radius-xl)', color: '#fff' }}>
              <Icon name="paw" size={16} color="var(--blue-400)" /> Donate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
