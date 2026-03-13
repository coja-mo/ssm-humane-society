'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import allPets from '@/lib/data/pets.json';

const MOCK_PETS = [
  { id: 'luna', name: 'Luna', breed: 'Domestic Shorthair', age: '2 years', sex: 'Female', emoji: '🐱', color: 'var(--blue-500)', traits: ['Friendly', 'Playful', 'Good with kids'], status: 'Available' },
  { id: 'buddy', name: 'Buddy', breed: 'Labrador Mix', age: '3 years', sex: 'Male', emoji: '🐕', color: 'var(--green-500)', traits: ['Loyal', 'Active', 'Trained'], status: 'Available' },
  { id: 'whiskers', name: 'Whiskers', breed: 'Tabby', age: '7 years', sex: 'Male', emoji: '🐱', color: '#F59E0B', traits: ['Gentle', 'Calm', 'Senior'], status: 'Available' },
  { id: 'max', name: 'Max', breed: 'Beagle Mix', age: '1 year', sex: 'Male', emoji: '🐶', color: '#8B5CF6', traits: ['Energetic', 'Social', 'Puppy'], status: 'Adopted' },
  { id: 'cleo', name: 'Cleo', breed: 'Domestic Longhair', age: '4 months', sex: 'Female', emoji: '🐱', color: 'var(--rose-500)', traits: ['Curious', 'Fluffy', 'Kitten'], status: 'Available' },
];

export default function FavoritesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/auth/login'); return; }
    setUser(JSON.parse(u));

    // Load favorites — try real pets.json data first, then mock
    const saved = localStorage.getItem('favorites');
    if (saved) {
      const ids = JSON.parse(saved);
      const matched = ids.map(id => {
        const realPet = allPets.find(p => p.id === id);
        if (realPet) {
          return {
            id: realPet.id, name: realPet.name, breed: realPet.breed,
            age: realPet.age, sex: realPet.sex,
            emoji: realPet.type === 'dog' ? '🐕' : realPet.type === 'cat' ? '🐈' : '🐾',
            color: realPet.type === 'dog' ? 'var(--blue-500)' : realPet.type === 'cat' ? 'var(--green-500)' : '#F59E0B',
            traits: [realPet.breed, realPet.size || '', realPet.type].filter(Boolean),
            status: realPet.status || 'Available',
          };
        }
        return MOCK_PETS.find(p => p.id === id);
      }).filter(Boolean);
      setFavorites(matched.length > 0 ? matched : MOCK_PETS.slice(0, 3));
    } else {
      // Seed demo favorites
      setFavorites(MOCK_PETS.slice(0, 3));
      localStorage.setItem('favorites', JSON.stringify(MOCK_PETS.slice(0, 3).map(p => p.id)));
    }
  }, [router]);

  function removeFavorite(petId) {
    setRemovingId(petId);
    setTimeout(() => {
      setFavorites(prev => prev.filter(p => p.id !== petId));
      const updated = favorites.filter(p => p.id !== petId).map(p => p.id);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setRemovingId(null);
    }, 300);
  }

  if (!user) return null;

  const filtered = filter === 'all' ? favorites :
    filter === 'available' ? favorites.filter(p => p.status === 'Available') :
    filter === 'adopted' ? favorites.filter(p => p.status === 'Adopted') : favorites;

  return (
    <section style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontWeight: '600' }}>My Favorites</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>
              ❤️ My Favorites <span className="badge badge-blue" style={{ verticalAlign: 'middle', fontSize: '0.72rem' }}>{favorites.length}</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Pets you&apos;ve saved for later
            </p>
          </div>
          <Link href="/adopt" className="btn btn-primary btn-sm" style={{ borderRadius: '100px' }}>
            🐾 Browse More Pets
          </Link>
        </div>

        {/* Filters & Sort */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'all', label: `All (${favorites.length})` },
              { id: 'available', label: `Available (${favorites.filter(p => p.status === 'Available').length})` },
              { id: 'adopted', label: `Adopted (${favorites.filter(p => p.status === 'Adopted').length})` },
            ].map(f => (
              <button key={f.id} className={filter === f.id ? 'pet-filter-btn active' : 'pet-filter-btn'} onClick={() => setFilter(f.id)} style={{ fontSize: '0.82rem' }}>
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="auth-input"
            style={{ width: 'auto', padding: '8px 16px', fontSize: '0.82rem', appearance: 'auto' }}
          >
            <option value="recent">Recently Added</option>
            <option value="name">By Name</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {(sortBy === 'name' ? [...filtered].sort((a, b) => a.name.localeCompare(b.name)) : filtered).map(pet => (
              <div
                key={pet.id}
                className="card"
                style={{
                  padding: 0, overflow: 'hidden',
                  opacity: removingId === pet.id ? 0 : 1,
                  transform: removingId === pet.id ? 'scale(0.9)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Pet Header */}
                <div style={{
                  background: `linear-gradient(135deg, ${pet.color}15, ${pet.color}08)`,
                  padding: '28px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                  borderBottom: `3px solid ${pet.color}20`,
                }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '16px',
                    background: `${pet.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem',
                  }}>
                    {pet.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '2px' }}>{pet.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{pet.breed}</div>
                  </div>
                  <button
                    onClick={() => removeFavorite(pet.id)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'rgba(239,68,68,0.08)', color: 'var(--rose-500)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem', cursor: 'pointer', border: 'none',
                      transition: 'all 0.2s',
                    }}
                    title="Remove from favorites"
                  >
                    ❤️
                  </button>
                </div>

                {/* Pet Details */}
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', fontSize: '0.85rem' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Age:</span> <strong>{pet.age}</strong></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Sex:</span> <strong>{pet.sex}</strong></div>
                    <div>
                      <span className="badge" style={{
                        background: pet.status === 'Available' ? 'rgba(16,185,129,0.1)' : 'rgba(156,163,175,0.1)',
                        color: pet.status === 'Available' ? '#10B981' : '#9CA3AF',
                        fontSize: '0.72rem',
                      }}>
                        {pet.status === 'Available' ? '🟢' : '⚪'} {pet.status}
                      </span>
                    </div>
                  </div>

                  {/* Traits */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {pet.traits.map(t => (
                      <span key={t} className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{t}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/adopt`} className="btn btn-primary btn-sm" style={{ borderRadius: '100px', flex: 1, textAlign: 'center' }}>
                      View Profile
                    </Link>
                    {pet.status === 'Available' && (
                      <Link href="/apply/adopt" className="btn btn-secondary btn-sm" style={{ borderRadius: '100px' }}>
                        Apply
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'float 4s ease-in-out infinite' }}>💕</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
              {filter !== 'all' ? 'No pets in this category' : 'No favorites yet'}
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 28px' }}>
              Tap the heart icon on any pet&apos;s card to save them here. We&apos;ll keep them safe until you&apos;re ready!
            </p>
            <Link href="/adopt" className="btn btn-primary" style={{ borderRadius: '100px' }}>
              ❤️ Browse & Save Pets
            </Link>
          </div>
        )}

        {/* Comparison Banner */}
        {favorites.filter(p => p.status === 'Available').length >= 2 && (
          <div style={{
            marginTop: '32px', padding: '24px 28px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(16,185,129,0.06))',
            borderRadius: 'var(--radius-lg)', border: '1px solid rgba(59,130,246,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '16px',
          }}>
          <div>
            <div style={{ fontWeight: '700', marginBottom: '4px' }}>📊 Compare Pets</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Can&apos;t decide? Compare your favorites side by side.
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ borderRadius: '100px' }}>
            Compare {favorites.filter(p => p.status === 'Available').length} Pets →
          </button>
        </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm">← Back to Dashboard</Link>
        </div>
      </div>
    </section>
  );
}
