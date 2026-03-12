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
        <div style={{ fontSize: '5rem', marginBottom: '24px' }}>😿</div>
        <h1>Pet Not Found</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>This pet may have already been adopted!</p>
        <Link href="/adopt" className="btn btn-primary">← Back to All Pets</Link>
      </div>
    );
  }

  const related = pets.filter(p => p.type === pet.type && p.id !== pet.id).slice(0, 3);

  return (
    <>
      <section className="section" style={{ paddingTop: '100px' }}>
        <div className="container">
          <Link href="/adopt" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-accent)', fontWeight: '600', marginBottom: '32px', fontSize: '0.9rem' }}>
            ← Back to All Pets
          </Link>
          <div className="pet-profile-hero">
            <div className="pet-profile-img-wrap reveal-left">
              <PetImage pet={pet} size="profile" />
            </div>
            <div className="reveal-right">
              <span className="badge badge-green" style={{ marginBottom: '16px', display: 'inline-block' }}>
                ✅ Available for Adoption
              </span>
              <h1 className="pet-profile-name">{pet.name}</h1>
              <p className="pet-profile-meta">{pet.breed} · {pet.age} · {pet.gender}</p>
              <p className="pet-profile-desc">{pet.description}</p>
              
              <div className="pet-profile-traits">
                {pet.traits.map(t => (
                  <span key={t} className="badge badge-blue">{t.replace(/-/g, ' ')}</span>
                ))}
                {pet.restrictions.map(r => (
                  <span key={r} className="badge badge-rose">⚠️ {r.replace(/-/g, ' ')}</span>
                ))}
              </div>

              <div className="pet-profile-actions">
                <Link href={`/apply/${pet.type}?pet=${pet.id}`} className="btn btn-primary btn-lg">
                  📝 Apply to Adopt {pet.name.split(' ')[0]}
                </Link>
                <button className="btn btn-secondary btn-lg">
                  ❤️ Save to Favorites
                </button>
              </div>

              <div style={{ marginTop: '32px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
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
              More {pet.type === 'dog' ? 'Dogs' : pet.type === 'cat' ? 'Cats' : 'Critters'} Looking for Homes
            </h2>
            <div className="grid-3 stagger">
              {related.map(rp => (
                <Link href={`/adopt/${rp.id}`} key={rp.id} className="pet-card">
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
