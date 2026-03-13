'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import PetImage from '@/components/pets/PetImage';
import Icon from '@/components/ui/Icon';
import pets from '@/lib/data/pets.json';

export default function FeaturedCarousel() {
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(true);
  const resumeTimer = useRef(null);
  const rafRef = useRef(null);
  const speedRef = useRef(0.6); // px per frame

  // Use a subset of pets for performance — 12 featured pets tripled for seamless loop
  const featuredPets = pets.slice(0, 12);
  const allPets = [...featuredPets, ...featuredPets, ...featuredPets];

  // Auto-scroll loop via requestAnimationFrame
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Set initial scroll to the middle set so we can scroll both directions
    const singleSetWidth = el.scrollWidth / 3;
    el.scrollLeft = singleSetWidth;

    let lastTime = 0;
    const tick = (time) => {
      if (lastTime) {
        const delta = time - lastTime;
        if (autoScrollRef.current && delta < 100) {
          el.scrollLeft += speedRef.current * (delta / 16);

          // Infinite loop: if we've scrolled past 2 sets, jump back by 1 set
          if (el.scrollLeft >= singleSetWidth * 2) {
            el.scrollLeft -= singleSetWidth;
          }
          // If scrolled before the first set, jump forward by 1 set
          if (el.scrollLeft <= 0) {
            el.scrollLeft += singleSetWidth;
          }
        }
      }
      lastTime = time;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Pause auto-scroll and schedule resume
  const pause = useCallback(() => {
    autoScrollRef.current = false;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => { autoScrollRef.current = true; }, 3000);
  }, []);

  // Handle manual wheel scroll — only capture horizontal swipes, let vertical pass through to page
  const handleWheel = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;
    // Only handle horizontal scroll (trackpad side-swipe)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
      e.preventDefault();
      el.scrollLeft += e.deltaX;
      pause();
      scheduleResume();
    }
    // Vertical scroll (deltaY) is NOT intercepted — it scrolls the page naturally
  }, [pause, scheduleResume]);

  // Attach wheel listener with { passive: false } so we can preventDefault on horizontal swipes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    return () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); };
  }, []);

  return (
    <div className="featured-carousel">
      <div
        ref={scrollRef}
        className="featured-carousel-track"
        onMouseEnter={pause}
        onMouseLeave={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
      >
        {allPets.map((pet, i) => (
          <Link
            href={`/adopt/${pet.id}`}
            key={`${pet.id}-${i}`}
            className="pet-card featured-carousel-card"
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
