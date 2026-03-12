'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import PetImage from '@/components/pets/PetImage';
import Icon from '@/components/ui/Icon';
import pets from '@/lib/data/pets.json';

export default function FeaturedCarousel() {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef(null);

  // Pause auto-scroll on interaction, resume after 3s
  const pause = useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 3000);
  }, []);

  useEffect(() => {
    return () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); };
  }, []);

  // Duplicate pets array for seamless loop
  const allPets = [...pets, ...pets];

  return (
    <div
      ref={containerRef}
      className={`featured-carousel${paused ? ' paused' : ''}`}
      onMouseEnter={pause}
      onMouseLeave={scheduleResume}
      onTouchStart={pause}
      onTouchEnd={scheduleResume}
    >
      <div ref={trackRef} className="featured-carousel-track">
        {allPets.map((pet, i) => (
          <Link
            href={`/adopt/${pet.id}`}
            key={`${pet.id}-${i}`}
            className="pet-card featured-carousel-card"
            onClick={(e) => {
              // Don't prevent navigation — just let it go
            }}
          >
            <div className="pet-card-img-wrap">
              <PetImage pet={pet} />
              <span className="pet-card-badge">
                <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name="check" size={11} color="var(--green-700)" /> Available
                </span>
              </span>
            </div>
            <div className="pet-card-body">
              <h3 className="pet-card-name">{pet.name}</h3>
              <p className="pet-card-meta">{pet.breed} · {pet.age} · {pet.gender}</p>
              <div className="pet-card-traits">
                {pet.traits.slice(0, 2).map(t => (
                  <span key={t} className="badge badge-outline">{t.replace(/-/g, ' ')}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
