'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import PetImage from '@/components/pets/PetImage';
import pets from '@/lib/data/pets.json';

const TYPES = ['all', 'dog', 'cat', 'critter'];
const AGES = ['all', 'Puppy', 'Young', 'Adult', 'Senior'];

export default function AdoptPage() {
  useScrollReveal();
  const [typeFilter, setTypeFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);

  const filtered = useMemo(() => {
    return pets.filter(p => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (ageFilter !== 'all' && p.age !== ageFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [typeFilter, ageFilter, search]);

  function toggleFav(id) {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>🐾 {pets.length} Pets Available</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '12px' }}>
            Find Your <span className="text-gradient">Furever Friend</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Browse our adoptable dogs, cats, and critters. Each one is waiting for a loving home just like yours.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          {/* Filters */}
          <div className="pet-filters reveal">
            {TYPES.map(t => (
              <button key={t} className={`pet-filter-btn ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>
                {t === 'all' ? '🐾 All' : t === 'dog' ? '🐕 Dogs' : t === 'cat' ? '🐈 Cats' : '🐦 Critters'}
              </button>
            ))}
            <div style={{ width: '1px', height: '32px', background: 'var(--border-light)', margin: '0 8px' }} />
            {AGES.map(a => (
              <button key={a} className={`pet-filter-btn ${ageFilter === a ? 'active' : ''}`} onClick={() => setAgeFilter(a)} style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                {a === 'all' ? 'All Ages' : a}
              </button>
            ))}
            <input
              type="text" className="pet-search" placeholder="🔍 Search by name, breed..." value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Results count */}
          <div className="reveal" style={{ marginBottom: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of {pets.length} pets
          </div>

          {/* Pet Grid */}
          {filtered.length === 0 ? (
            <div className="text-center" style={{ padding: '80px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😿</div>
              <h3>No pets found matching your criteria</h3>
              <p>Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="pet-grid">
              {filtered.map((pet, i) => (
                <div key={pet.id} className="pet-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  <Link href={`/adopt/${pet.id}`}>
                    <div className="pet-card-img-wrap">
                      <PetImage pet={pet} />
                      <span className="pet-card-badge">
                        <span className="badge badge-green">Available</span>
                      </span>
                    </div>
                  </Link>
                  <button className={`pet-card-fav ${favorites.includes(pet.id) ? 'active' : ''}`} onClick={() => toggleFav(pet.id)}>
                    {favorites.includes(pet.id) ? '❤️' : '🤍'}
                  </button>
                  <div className="pet-card-body">
                    <Link href={`/adopt/${pet.id}`}>
                      <h3 className="pet-card-name">{pet.name}</h3>
                    </Link>
                    <p className="pet-card-meta">{pet.breed} · {pet.age} · {pet.gender}</p>
                    <div className="pet-card-traits">
                      {pet.traits.slice(0, 3).map(t => (
                        <span key={t} className="badge badge-outline">{t.replace(/-/g, ' ')}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                      <Link href={`/adopt/${pet.id}`} className="btn btn-sm btn-primary" style={{ flex: 1 }}>
                        Meet {pet.name.split(' ')[0]}
                      </Link>
                      <Link href={`/apply/${pet.type}`} className="btn btn-sm btn-secondary" style={{ flex: 1 }}>
                        Apply
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
