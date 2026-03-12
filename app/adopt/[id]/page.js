'use client';
import { use } from 'react';
import Link from 'next/link';
import pets from '@/lib/data/pets.json';
import PetImage from '@/components/pets/PetImage';
import useScrollReveal from '@/components/effects/useScrollReveal';
import Icon, { IconCircle } from '@/components/ui/Icon';

export default function PetProfile({ params }) {
  const { id } = use(params);
  const pet = pets.find(p => p.id === id);
  useScrollReveal();

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

  const related = pets.filter(p => p.type === pet.type && p.id !== pet.id).slice(0, 3);
  const daysInShelter = Math.floor((new Date() - new Date(pet.dateAdded)) / 86400000);
  const typeIcon = pet.type === 'dog' ? 'dog' : pet.type === 'cat' ? 'cat' : 'bird';
  const typeLabel = pet.type === 'dog' ? 'Dog' : pet.type === 'cat' ? 'Cat' : 'Critter';

  return (
    <>
      <section className="section" style={{ paddingTop: '100px' }}>
        <div className="container">
          <Link href="/adopt" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-accent)', fontWeight: '600', marginBottom: '32px', fontSize: '0.9rem' }}>
            <Icon name="arrow" size={14} color="var(--text-accent)" style={{ transform: 'rotate(180deg)' }} /> Back to All Pets
          </Link>
          <div className="pet-profile-hero">
            <div className="pet-profile-img-wrap reveal-left" style={{ boxShadow: 'var(--shadow-lg), 0 20px 60px rgba(41,171,226,0.1)' }}>
              <PetImage pet={pet} size="profile" />
              <div style={{
                position: 'absolute', bottom: '16px', left: '16px',
                padding: '8px 16px', borderRadius: '100px',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                color: '#fff', fontSize: '0.8rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <Icon name="calendar" size={12} color="#fff" /> {daysInShelter} days at shelter
              </div>
            </div>
            <div className="reveal-right">
              <span className="badge badge-green" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', animation: 'glowPulse 3s ease-in-out infinite' }}>
                <Icon name="check" size={14} color="var(--green-800)" /> Available for Adoption
              </span>
              <h1 className="pet-profile-name" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{pet.name}</h1>
              <p className="pet-profile-meta">{pet.breed} · {pet.age} · {pet.gender}</p>
              <p className="pet-profile-desc">{pet.description}</p>
              
              <div className="pet-profile-traits" style={{ marginBottom: '24px' }}>
                {pet.traits.map(t => (
                  <span key={t} className="badge badge-blue" style={{ padding: '6px 14px' }}>{t.replace(/-/g, ' ')}</span>
                ))}
                {pet.restrictions.map(r => (
                  <span key={r} className="badge badge-rose" style={{ padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Icon name="shield" size={12} color="var(--rose-600)" /> {r.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {[
                  { label: 'Type', value: typeLabel, icon: typeIcon },
                  { label: 'Age', value: pet.age, icon: 'clock' },
                  { label: 'Gender', value: pet.gender, icon: 'people' },
                ].map((f, i) => (
                  <div key={i} style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <Icon name={f.icon} size={16} color="var(--text-muted)" style={{ marginBottom: '4px' }} />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>{f.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{f.value}</div>
                  </div>
                ))}
              </div>

              <div className="pet-profile-actions">
                <Link href={`/apply/${pet.type}?pet=${pet.id}`} className="btn btn-primary btn-lg glow-border-hover" style={{ borderRadius: 'var(--radius-xl)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="edit" size={18} color="#fff" /> Apply to Adopt {pet.name.split(' ')[0]}
                </Link>
                <button className="btn btn-secondary btn-lg" style={{ borderRadius: 'var(--radius-xl)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="heart" size={18} /> Save to Favorites
                </button>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Share:</span>
                {[{ name: 'Facebook', svgPath: 'M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z' }, { name: 'Twitter', svgPath: 'M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' }, { name: 'Email', icon: 'mail' }].map(platform => (
                  <button key={platform.name} className="btn btn-sm btn-ghost" style={{ borderRadius: '100px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {platform.icon ? <Icon name={platform.icon} size={14} /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={platform.svgPath} /></svg>}
                    {platform.name}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '24px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Icon name="phone" size={18} color="var(--text-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong>Questions?</strong> Call us at <a href="tel:7059493573" style={{ color: 'var(--text-accent)', fontWeight: '600' }}>705-949-3573</a> between 12-5 PM or email{' '}
                  <a href="mailto:adoptions@ssmhumanesociety.ca" style={{ color: 'var(--text-accent)', fontWeight: '600' }}>adoptions@ssmhumanesociety.ca</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-secondary)', paddingTop: '60px' }}>
          <div className="container">
            <h2 className="reveal" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon name={typeIcon} size={24} color="var(--text-accent)" /> More {typeLabel}s Looking for Homes
            </h2>
            <div className="grid-3 stagger">
              {related.map(rp => (
                <Link href={`/adopt/${rp.id}`} key={rp.id} className="pet-card card-3d">
                  <div className="pet-card-img-wrap"><PetImage pet={rp} /></div>
                  <div className="pet-card-body">
                    <h3 className="pet-card-name">{rp.name}</h3>
                    <p className="pet-card-meta">{rp.breed} · {rp.age}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
