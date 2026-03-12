'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import pets from '@/lib/data/pets.json';
import PetImage from '@/components/pets/PetImage';
import useScrollReveal from '@/components/effects/useScrollReveal';
import Icon, { IconCircle } from '@/components/ui/Icon';

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

              {/* Adoption CTA */}
              <div style={{
                padding: '24px', borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--blue-50), var(--green-50))',
                border: '1px solid var(--border-light)', marginBottom: '20px',
              }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>💛</span> Interested in {pet.name.split(' ')[0]}?
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
                  Submit an adoption application and our team will be in touch to schedule a meet & greet!
                </p>
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
