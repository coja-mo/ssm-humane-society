'use client';
import { use } from 'react';
import Link from 'next/link';
import pets from '@/lib/data/pets.json';
import PetImage from '@/components/pets/PetImage';
import useScrollReveal from '@/components/effects/useScrollReveal';

export default function PetProfile({ params }) {
  const { id } = use(params);
  const pet = pets.find(p => p.id === id);
  useScrollReveal();

  if (!pet) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '100px' }}>
        <div style={{ fontSize: '5rem', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>😿</div>
        <h1>Pet Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>This pet may have already been adopted!</p>
        <Link href="/adopt" className="btn btn-primary" style={{ borderRadius: 'var(--radius-xl)' }}>← Back to All Pets</Link>
      </div>
    );
  }

  const related = pets.filter(p => p.type === pet.type && p.id !== pet.id).slice(0, 3);
  const daysInShelter = Math.floor((new Date() - new Date(pet.dateAdded)) / 86400000);

  return (
    <>
      <section className="section" style={{ paddingTop: '100px' }}>
        <div className="container">
          <Link href="/adopt" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-accent)', fontWeight: '600', marginBottom: '32px', fontSize: '0.9rem', transition: 'gap 0.3s' }}>
            ← Back to All Pets
          </Link>
          <div className="pet-profile-hero">
            <div className="pet-profile-img-wrap reveal-left" style={{ boxShadow: 'var(--shadow-lg), 0 20px 60px rgba(41,171,226,0.1)' }}>
              <PetImage pet={pet} size="profile" />
              {/* Days badge */}
              <div style={{
                position: 'absolute', bottom: '16px', left: '16px',
                padding: '8px 16px', borderRadius: '100px',
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                color: '#fff', fontSize: '0.8rem', fontWeight: 600
              }}>
                📅 {daysInShelter} days at shelter
              </div>
            </div>
            <div className="reveal-right">
              <span className="badge badge-green" style={{ marginBottom: '16px', display: 'inline-flex', animation: 'glowPulse 3s ease-in-out infinite' }}>
                ✅ Available for Adoption
              </span>
              <h1 className="pet-profile-name" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{pet.name}</h1>
              <p className="pet-profile-meta">{pet.breed} · {pet.age} · {pet.gender}</p>
              <p className="pet-profile-desc">{pet.description}</p>
              
              <div className="pet-profile-traits" style={{ marginBottom: '24px' }}>
                {pet.traits.map(t => (
                  <span key={t} className="badge badge-blue" style={{ padding: '6px 14px' }}>{t.replace(/-/g, ' ')}</span>
                ))}
                {pet.restrictions.map(r => (
                  <span key={r} className="badge badge-rose" style={{ padding: '6px 14px' }}>⚠️ {r.replace(/-/g, ' ')}</span>
                ))}
              </div>

              {/* Quick facts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {[
                  { label: 'Type', value: pet.type === 'dog' ? '🐕 Dog' : pet.type === 'cat' ? '🐈 Cat' : '🐦 Critter' },
                  { label: 'Age', value: pet.age },
                  { label: 'Gender', value: pet.gender },
                ].map((f, i) => (
                  <div key={i} style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>{f.label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{f.value}</div>
                  </div>
                ))}
              </div>

              <div className="pet-profile-actions">
                <Link href={`/apply/${pet.type}?pet=${pet.id}`} className="btn btn-primary btn-lg glow-border-hover" style={{ borderRadius: 'var(--radius-xl)' }}>
                  📝 Apply to Adopt {pet.name.split(' ')[0]}
                </Link>
                <button className="btn btn-secondary btn-lg" style={{ borderRadius: 'var(--radius-xl)' }}>
                  ❤️ Save to Favorites
                </button>
              </div>

              {/* Share buttons */}
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Share:</span>
                {['Facebook', 'Twitter', 'Email'].map(platform => (
                  <button key={platform} className="btn btn-sm btn-ghost" style={{ borderRadius: '100px', fontSize: '0.8rem' }}>
                    {platform === 'Facebook' ? '📘' : platform === 'Twitter' ? '🐦' : '📧'} {platform}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '24px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong>📞 Questions?</strong> Call us at <a href="tel:7059493573" style={{ color: 'var(--text-accent)', fontWeight: '600' }}>705-949-3573</a> between 12-5 PM or email{' '}
                  <a href="mailto:adoptions@ssmhumanesociety.ca" style={{ color: 'var(--text-accent)', fontWeight: '600' }}>adoptions@ssmhumanesociety.ca</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pets */}
      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-secondary)', paddingTop: '60px' }}>
          <div className="container">
            <h2 className="reveal" style={{ marginBottom: '32px' }}>
              More {pet.type === 'dog' ? '🐕 Dogs' : pet.type === 'cat' ? '🐈 Cats' : '🐦 Critters'} Looking for Homes
            </h2>
            <div className="grid-3 stagger">
              {related.map(rp => (
                <Link href={`/adopt/${rp.id}`} key={rp.id} className="pet-card card-3d">
                  <div className="pet-card-img-wrap">
                    <PetImage pet={rp} />
                  </div>
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
