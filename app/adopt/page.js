'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import PetImage from '@/components/pets/PetImage';
import Icon, { IconCircle } from '@/components/ui/Icon';
import pets from '@/lib/data/pets.json';

const TYPES = ['all', 'dog', 'cat', 'critter'];
const AGES = ['all', 'Puppy', 'Young', 'Adult', 'Senior'];
const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Longest Waiting' },
];

const TYPE_ICONS = { all: 'paw', dog: 'dog', cat: 'cat', critter: 'bird' };
const TYPE_LABELS = { all: 'All', dog: 'Dogs', cat: 'Cats', critter: 'Critters' };

export default function AdoptPage() {
  useScrollReveal();
  const [typeFilter, setTypeFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sort, setSort] = useState('name');

  const filtered = useMemo(() => {
    let result = pets.filter(p => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (ageFilter !== 'all' && p.age !== ageFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      }
      return true;
    });
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'newest') result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    else if (sort === 'oldest') result.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    return result;
  }, [typeFilter, ageFilter, search, sort]);

  function toggleFav(id) {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="paw" size={14} color="var(--blue-700)" /> {pets.length} Pets Available
          </span>
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
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', padding: '20px 0', marginBottom: '16px' }}>
            {TYPES.map(t => (
              <button key={t} className={`pet-filter-btn ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Icon name={TYPE_ICONS[t]} size={14} /> {TYPE_LABELS[t]}
              </button>
            ))}
            <div style={{ width: '1px', height: '32px', background: 'var(--border-light)', margin: '0 4px' }} />
            {AGES.map(a => (
              <button key={a} className={`pet-filter-btn ${ageFilter === a ? 'active' : ''}`} onClick={() => setAgeFilter(a)} style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                {a === 'all' ? 'All Ages' : a}
              </button>
            ))}
            <div style={{ position: 'relative', flex: '1 0 200px' }}>
              <Icon name="search" size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" className="pet-search" placeholder="Search by name, breed..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '38px', width: '100%' }} />
            </div>
          </div>

          {/* Toolbar */}
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of {pets.length} pets
              {favorites.length > 0 && <span style={{ marginLeft: '16px', color: 'var(--rose-500)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Icon name="heart" size={14} color="var(--rose-500)" /> {favorites.length} saved</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.85rem', cursor: 'pointer' }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="view-toggle">
                {['grid', 'list'].map(v => (
                  <button key={v} className={`view-toggle-btn ${viewMode === v ? 'active' : ''}`} onClick={() => setViewMode(v)}>
                    {v === 'grid' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm10 0h8v8h-8zm-10 10h8v8H3zm10 0h8v8h-8z"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pet Display */}
          {filtered.length === 0 ? (
            <div className="text-center" style={{ padding: '80px 0', color: 'var(--text-muted)' }}>
              <IconCircle name="search" size={80} color="var(--text-muted)" bgOpacity={0.08} style={{ margin: '0 auto 16px' }} />
              <h3>No pets found matching your criteria</h3>
              <p>Try adjusting your filters or search.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="pet-grid">
              {filtered.map((pet, i) => (
                <div key={pet.id} className="pet-card card-3d" style={{ animationDelay: `${i * 0.05}s` }}>
                  <Link href={`/adopt/${pet.id}`}>
                    <div className="pet-card-img-wrap">
                      <PetImage pet={pet} />
                      <span className="pet-card-badge">
                        <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Icon name="check" size={12} color="var(--green-800)" /> Available
                        </span>
                      </span>
                    </div>
                  </Link>
                  <button className={`pet-card-fav ${favorites.includes(pet.id) ? 'active' : ''}`} onClick={() => toggleFav(pet.id)}>
                    <Icon name="heart" size={18} color={favorites.includes(pet.id) ? 'var(--rose-500)' : 'var(--text-muted)'} />
                  </button>
                  <div className="pet-card-body">
                    <Link href={`/adopt/${pet.id}`}><h3 className="pet-card-name">{pet.name}</h3></Link>
                    <p className="pet-card-meta">{pet.breed} · {pet.age} · {pet.gender}</p>
                    <div className="pet-card-traits">
                      {pet.traits.slice(0, 3).map(t => <span key={t} className="badge badge-outline">{t.replace(/-/g, ' ')}</span>)}
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                      <Link href={`/adopt/${pet.id}`} className="btn btn-sm btn-primary" style={{ flex: 1, borderRadius: 'var(--radius-md)' }}>
                        Meet {pet.name.split(' ')[0]}
                      </Link>
                      <Link href={`/apply/${pet.type}`} className="btn btn-sm btn-secondary" style={{ flex: 1, borderRadius: 'var(--radius-md)' }}>
                        Apply
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {filtered.map((pet) => (
                <Link href={`/adopt/${pet.id}`} key={pet.id} className="pet-list-card">
                  <div style={{ width: '160px', minHeight: '120px', flexShrink: 0, overflow: 'hidden' }}><PetImage pet={pet} /></div>
                  <div className="pet-list-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>{pet.name}</h3>
                      <span className="badge badge-green" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Icon name="check" size={10} color="var(--green-800)" /> Available</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>{pet.breed} · {pet.age} · {pet.gender}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>{pet.description.slice(0, 120)}...</p>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      {pet.traits.slice(0, 4).map(t => <span key={t} className="badge badge-outline" style={{ fontSize: '0.7rem' }}>{t.replace(/-/g, ' ')}</span>)}
                    </div>
                  </div>
                  <button className="btn btn-icon" onClick={e => { e.preventDefault(); toggleFav(pet.id); }} style={{ alignSelf: 'center', marginRight: '16px', flexShrink: 0 }}>
                    <Icon name="heart" size={20} color={favorites.includes(pet.id) ? 'var(--rose-500)' : 'var(--text-muted)'} />
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
