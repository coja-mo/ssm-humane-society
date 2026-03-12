'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import PetImage from '@/components/pets/PetImage';
import Icon, { IconCircle } from '@/components/ui/Icon';
import pets from '@/lib/data/pets.json';

const TYPES = ['all', 'dog', 'cat', 'critter'];
const AGES = ['all', 'Puppy', 'Young', 'Adult', 'Senior'];
const SORT_OPTIONS = [
  { value: 'name', label: 'Name A-Z' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Longest Waiting' },
];

const TYPE_ICONS = { all: 'paw', dog: 'dog', cat: 'cat', critter: 'bird' };
const TYPE_LABELS = { all: 'All Pets', dog: 'Dogs', cat: 'Cats', critter: 'Critters' };
const TYPE_EMOJI = { dog: '🐕', cat: '🐈', critter: '🐦' };

const dogCount = pets.filter(p => p.type === 'dog').length;
const catCount = pets.filter(p => p.type === 'cat').length;
const critterCount = pets.filter(p => p.type === 'critter').length;

// Featured pets - longest waiting
const featured = [...pets].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)).slice(0, 6);

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>{display}</span>;
}

function FeaturedCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % featured.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setActive(i);
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % featured.length);
    }, 4000);
  };

  return (
    <div style={{ position: 'relative', marginTop: '48px' }}>
      <h3 style={{ 
        fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600,
        color: 'var(--text-muted)', textAlign: 'center', marginBottom: '20px',
        letterSpacing: '0.03em', textTransform: 'uppercase'
      }}>
        ✨ Waiting the Longest — Can You Give Them a Home?
      </h3>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px',
        maxWidth: '900px', margin: '0 auto',
      }}>
        {featured.map((pet, i) => {
          const isActive = i === active;
          const days = Math.floor((new Date() - new Date(pet.dateAdded)) / 86400000);
          return (
            <Link href={`/adopt/${pet.id}`} key={pet.id}
              onMouseEnter={() => goTo(i)}
              style={{
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                position: 'relative', cursor: 'pointer',
                aspectRatio: '3/4',
                transform: isActive ? 'scale(1.08)' : 'scale(0.95)',
                opacity: isActive ? 1 : 0.6,
                transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: isActive ? '0 12px 40px rgba(41,171,226,0.25)' : 'var(--shadow-sm)',
                border: isActive ? '2px solid var(--blue-400)' : '2px solid transparent',
              }}
            >
              <PetImage pet={pet} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                padding: '24px 8px 8px', color: '#fff', textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem' }}>{pet.name}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>{days} days waiting</div>
              </div>
            </Link>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '16px' }}>
        {featured.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === active ? '24px' : '8px', height: '8px', borderRadius: '100px',
            background: i === active ? 'var(--blue-500)' : 'var(--border-light)',
            transition: 'all 0.3s ease', border: 'none', cursor: 'pointer',
          }} />
        ))}
      </div>
    </div>
  );
}

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
      {/* Hero Section */}
      <section style={{ 
        paddingTop: '120px', paddingBottom: '48px', 
        background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', 
        position: 'relative', overflow: 'hidden' 
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(41,171,226,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        
        {/* Floating paw prints */}
        {[
          { top: '15%', left: '5%', size: '28px', rotate: '-20deg', delay: '0s', duration: '6s' },
          { top: '25%', right: '8%', size: '22px', rotate: '30deg', delay: '1s', duration: '7s' },
          { top: '60%', left: '12%', size: '18px', rotate: '10deg', delay: '2s', duration: '5s' },
          { top: '70%', right: '15%', size: '24px', rotate: '-15deg', delay: '0.5s', duration: '8s' },
        ].map((paw, i) => (
          <div key={i} style={{
            position: 'absolute', ...paw, fontSize: paw.size,
            opacity: 0.08, pointerEvents: 'none',
            animation: `pawFloat ${paw.duration} ease-in-out infinite`,
            animationDelay: paw.delay,
            transform: `rotate(${paw.rotate})`,
          }}>🐾</div>
        ))}

        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-blue" style={{ 
            marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px',
            animation: 'fadeInDown 0.6s ease both',
          }}>
            <Icon name="paw" size={14} color="var(--blue-700)" /> Now Accepting Applications
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', marginBottom: '16px',
            animation: 'fadeInUp 0.8s ease 0.2s both',
          }}>
            Find Your <span className="text-gradient">Furever Friend</span>
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 32px', 
            fontSize: '1.05rem', lineHeight: '1.7',
            animation: 'fadeInUp 0.8s ease 0.4s both',
          }}>
            Every pet deserves a loving home. Browse {pets.length} adorable dogs, cats, and critters 
            currently in our care, each waiting for someone just like you.
          </p>

          {/* Animated Stats */}
          <div style={{ 
            display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeInUp 0.8s ease 0.6s both',
          }}>
            {[
              { icon: 'dog', label: 'Dogs', count: dogCount, color: 'var(--blue-500)' },
              { icon: 'cat', label: 'Cats', count: catCount, color: 'var(--green-500)' },
              { icon: 'bird', label: 'Critters', count: critterCount, color: 'var(--rose-500)' },
            ].map(stat => (
              <div key={stat.label} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 24px', borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
              }}>
                <Icon name={stat.icon} size={20} color={stat.color} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                    <AnimatedNumber value={stat.count} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Carousel */}
          <FeaturedCarousel />
        </div>
      </section>

      {/* Main Content */}
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          {/* Filters Bar */}
          <div className="reveal" style={{
            display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
            padding: '16px 20px', marginBottom: '20px',
            background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)',
          }}>
            {TYPES.map(t => (
              <button key={t} className={`pet-filter-btn ${typeFilter === t ? 'active' : ''}`} 
                onClick={() => setTypeFilter(t)} 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Icon name={TYPE_ICONS[t]} size={14} /> {TYPE_LABELS[t]}
                {t !== 'all' && <span style={{ 
                  fontSize: '0.7rem', background: typeFilter === t ? 'var(--blue-200)' : 'var(--bg-secondary)', 
                  padding: '1px 6px', borderRadius: '100px', fontWeight: 700, marginLeft: '2px',
                }}>
                  {t === 'dog' ? dogCount : t === 'cat' ? catCount : critterCount}
                </span>}
              </button>
            ))}
            <div style={{ width: '1px', height: '32px', background: 'var(--border-light)', margin: '0 4px' }} />
            {AGES.map(a => (
              <button key={a} className={`pet-filter-btn ${ageFilter === a ? 'active' : ''}`} 
                onClick={() => setAgeFilter(a)} 
                style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                {a === 'all' ? 'All Ages' : a}
              </button>
            ))}
            <div style={{ position: 'relative', flex: '1 0 200px' }}>
              <Icon name="search" size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" className="pet-search" placeholder="Search by name, breed, or keyword..." 
                value={search} onChange={e => setSearch(e.target.value)} 
                style={{ paddingLeft: '38px', width: '100%' }} />
            </div>
          </div>

          {/* Toolbar */}
          <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of {pets.length} pets
              {favorites.length > 0 && <span style={{ marginLeft: '16px', color: 'var(--rose-500)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Icon name="heart" size={14} color="var(--rose-500)" /> {favorites.length} saved
              </span>}
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
              <p style={{ marginBottom: '16px' }}>Try adjusting your filters or search.</p>
              <button className="btn btn-sm btn-secondary" onClick={() => { setTypeFilter('all'); setAgeFilter('all'); setSearch(''); }}>
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="pet-grid">
              {filtered.map((pet, i) => {
                const days = Math.floor((new Date() - new Date(pet.dateAdded)) / 86400000);
                return (
                  <div key={pet.id} className="pet-card card-3d" style={{ animationDelay: `${i * 0.05}s` }}>
                    <Link href={`/adopt/${pet.id}`}>
                      <div className="pet-card-img-wrap">
                        <PetImage pet={pet} />
                        <span className="pet-card-badge">
                          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Icon name="check" size={12} color="var(--green-800)" /> Available
                          </span>
                        </span>
                        {/* Days waiting badge */}
                        {days > 20 && (
                          <div style={{
                            position: 'absolute', bottom: '10px', left: '10px', zIndex: 2,
                            padding: '4px 10px', borderRadius: '100px',
                            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
                            color: '#fff', fontSize: '0.7rem', fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: '4px',
                          }}>
                            <Icon name="clock" size={10} color="#fff" /> {days} days waiting
                          </div>
                        )}
                        {/* Quick View Overlay */}
                        <div className="quick-view-overlay">
                          <span className="btn btn-sm btn-primary" style={{ 
                            borderRadius: '100px', padding: '10px 24px',
                            boxShadow: '0 4px 15px rgba(41,171,226,0.4)',
                          }}>
                            <Icon name="eye" size={14} color="#fff" /> Meet {pet.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <button className={`pet-card-fav ${favorites.includes(pet.id) ? 'active' : ''}`} onClick={() => toggleFav(pet.id)}>
                      <Icon name="heart" size={18} color={favorites.includes(pet.id) ? 'var(--rose-500)' : 'var(--text-muted)'} />
                    </button>
                    <div className="pet-card-body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Link href={`/adopt/${pet.id}`}><h3 className="pet-card-name">{pet.name}</h3></Link>
                        <span style={{ fontSize: '1rem' }}>{TYPE_EMOJI[pet.type]}</span>
                      </div>
                      <p className="pet-card-meta">{pet.breed} · {pet.age} · {pet.gender}</p>
                      <p style={{ 
                        fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5',
                        marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {pet.description.split('.')[0]}.
                      </p>
                      <div className="pet-card-traits" style={{ marginBottom: '12px' }}>
                        {pet.traits.slice(0, 3).map(t => <span key={t} className="badge badge-outline">{t.replace(/-/g, ' ')}</span>)}
                      </div>
                      {pet.restrictions.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          {pet.restrictions.map(r => (
                            <span key={r} className="badge badge-rose" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <Icon name="shield" size={10} color="var(--rose-600)" /> {r.replace(/-/g, ' ')}
                            </span>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href={`/adopt/${pet.id}`} className="btn btn-sm btn-primary" style={{ flex: 1, borderRadius: 'var(--radius-md)' }}>
                          Meet {pet.name.split(' ')[0]}
                        </Link>
                        <Link href={`/apply/${pet.type}`} className="btn btn-sm btn-secondary" style={{ flex: 1, borderRadius: 'var(--radius-md)' }}>
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {filtered.map((pet) => {
                const days = Math.floor((new Date() - new Date(pet.dateAdded)) / 86400000);
                return (
                  <Link href={`/adopt/${pet.id}`} key={pet.id} className="pet-list-card">
                    <div style={{ width: '160px', minHeight: '120px', flexShrink: 0, overflow: 'hidden' }}><PetImage pet={pet} /></div>
                    <div className="pet-list-card-body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>{pet.name}</h3>
                        <span style={{ fontSize: '0.9rem' }}>{TYPE_EMOJI[pet.type]}</span>
                        <span className="badge badge-green" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Icon name="check" size={10} color="var(--green-800)" /> Available
                        </span>
                        {days > 20 && <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{days}d waiting</span>}
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>{pet.breed} · {pet.age} · {pet.gender}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>{pet.description.slice(0, 150)}...</p>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                        {pet.traits.slice(0, 4).map(t => <span key={t} className="badge badge-outline" style={{ fontSize: '0.7rem' }}>{t.replace(/-/g, ' ')}</span>)}
                        {pet.restrictions.map(r => (
                          <span key={r} className="badge badge-rose" style={{ fontSize: '0.7rem' }}>{r.replace(/-/g, ' ')}</span>
                        ))}
                      </div>
                    </div>
                    <button className="btn btn-icon" onClick={e => { e.preventDefault(); toggleFav(pet.id); }} style={{ alignSelf: 'center', marginRight: '16px', flexShrink: 0 }}>
                      <Icon name="heart" size={20} color={favorites.includes(pet.id) ? 'var(--rose-500)' : 'var(--text-muted)'} />
                    </button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Adoption Process CTA */}
      <section style={{ 
        padding: '60px 0', 
        background: 'linear-gradient(135deg, var(--bg-dark-section) 0%, #162338 100%)',
        color: 'var(--text-on-dark)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div className="text-center reveal" style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '12px' }}>
              How to <span style={{ color: 'var(--blue-400)' }}>Adopt</span>
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: '500px', margin: '0 auto' }}>
              Our adoption process is simple and designed to find the perfect match for both pet and family.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
            {[
              { step: '01', title: 'Browse & Choose', desc: 'Find a pet that catches your heart', icon: 'search', color: 'var(--blue-400)' },
              { step: '02', title: 'Submit Application', desc: 'Fill out our adoption application', icon: 'edit', color: 'var(--green-500)' },
              { step: '03', title: 'Meet & Greet', desc: 'Visit and spend time with your match', icon: 'heart', color: 'var(--rose-400)' },
              { step: '04', title: 'Welcome Home!', desc: 'Finalize and bring your new friend home', icon: 'home', color: '#F59E0B' },
            ].map((s, i) => (
              <div key={i} className="reveal" style={{
                textAlign: 'center', padding: '28px 20px', borderRadius: 'var(--radius-lg)',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.4s ease', animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%', margin: '0 auto 14px',
                  background: `linear-gradient(135deg, ${s.color}22, ${s.color}11)`,
                  border: `2px solid ${s.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={s.icon} size={22} color={s.color} />
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: s.color, letterSpacing: '0.1em', marginBottom: '4px' }}>
                  STEP {s.step}
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', color: '#F1F5F9' }}>{s.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: '1.5' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center reveal" style={{ marginTop: '36px' }}>
            <Link href="/adopt/adoption-information" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-xl)' }}>
              <Icon name="edit" size={18} color="#fff" /> Learn More About Adopting
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
