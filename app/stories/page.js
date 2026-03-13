'use client';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const STORIES = [
  {
    family: 'The Mitchell Family',
    pet: 'Tucker', type: 'dog', breed: 'Golden Retriever Mix',
    quote: 'Tucker was at the shelter for 3 months before we found him. Now he\'s the center of our family — hiking buddy, couch companion, and best friend to our kids. We can\'t imagine life without him.',
    year: '2025', color: 'var(--blue-400)', tag: 'Adoption',
  },
  {
    family: 'Sarah & David',
    pet: 'Luna', type: 'cat', breed: 'Domestic Shorthair',
    quote: 'I wasn\'t sure about adopting a senior cat, but Luna changed everything. She\'s the calmest, most affectionate soul. She curls up next to me every evening. Seniors have so much love to give.',
    year: '2024', color: 'var(--rose-400)', tag: 'Senior Adoption',
  },
  {
    family: 'The Patel Family',
    pet: 'Biscuit', type: 'dog', breed: 'Beagle Mix',
    quote: 'We fostered Biscuit and fell in love within a week. The shelter team made the foster-to-adopt transition seamless. He\'s home forever now and our daughter\'s best friend.',
    year: '2025', color: 'var(--green-500)', tag: 'Foster-to-Adopt',
  },
  {
    family: 'Marie C.',
    pet: 'Whiskers & Mittens', type: 'cat', breed: 'Bonded Pair',
    quote: 'Adopting a bonded pair was the best decision. Whiskers and Mittens are inseparable and have brought double the joy into my home. They play, nap, and groom each other constantly.',
    year: '2025', color: 'var(--violet-400)', tag: 'Bonded Pair',
  },
  {
    family: 'The Thompson Family',
    pet: 'Bear', type: 'dog', breed: 'German Shepherd',
    quote: 'Bear was returned twice before we adopted him. He needed patience and training, but now he\'s the most loyal, gentle dog. It was worth every moment. Don\'t give up on the "hard" ones.',
    year: '2024', color: 'var(--blue-500)', tag: 'Second Chance',
  },
  {
    family: 'Emily R.',
    pet: 'Clover', type: 'cat', breed: 'Tabby',
    quote: 'As a first-time pet owner, the shelter team gave me so much guidance. Clover has helped with my anxiety more than I can express. She\'s my little therapy cat.',
    year: '2025', color: 'var(--teal-400)', tag: 'First-Time Adopter',
  },
];

export default function StoriesPage() {
  useScrollReveal();
  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-rose" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="heart" size={14} color="var(--rose-600)" /> Happy Tails
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>
            Success <span className="text-gradient-warm">Stories</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.8 }}>
            Real families, real love, real happy endings. Every adoption changes two lives — the animal&apos;s and yours.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div className="container glass" style={{
          display: 'flex', justifyContent: 'space-around', padding: '28px 32px',
          flexWrap: 'wrap', gap: '20px', borderRadius: 'var(--radius-xl)',
          maxWidth: '700px', margin: '0 auto', position: 'relative', top: '-28px',
        }}>
          {[
            { target: 1847, label: 'Happy Adoptions', icon: 'home', color: 'var(--blue-500)' },
            { target: 98, label: '% Success Rate', suffix: '', icon: 'check', color: 'var(--green-500)' },
            { target: 45, label: 'Years of Love', suffix: '+', icon: 'heart', color: 'var(--rose-400)' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: stat.color }}>
                <AnimatedCounter target={stat.target} suffix={stat.suffix || ''} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stories Grid */}
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="grid-2 stagger" style={{ gap: '24px' }}>
            {STORIES.map((story, i) => (
              <div key={i} className="card card-3d" style={{ overflow: 'hidden' }}>
                <div style={{ height: '4px', background: story.color }} />
                <div style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: `linear-gradient(135deg, ${story.color}22, ${story.color}11)`,
                      border: `2px solid ${story.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}>
                      {story.type === 'dog' ? '🐕' : '🐈'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{story.pet}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{story.breed}</span>
                        <span style={{
                          padding: '2px 10px', borderRadius: '100px', fontSize: '0.7rem',
                          fontWeight: 700, background: `${story.color}15`, color: story.color,
                        }}>{story.tag}</span>
                      </div>
                    </div>
                  </div>

                  <blockquote style={{
                    fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.8,
                    fontSize: '0.92rem', paddingLeft: '16px',
                    borderLeft: `3px solid ${story.color}44`, marginBottom: '20px',
                  }}>
                    &ldquo;{story.quote}&rdquo;
                  </blockquote>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{story.family}</div>
                      <div style={{ fontSize: '0.78rem', color: story.color, fontWeight: 600 }}>
                        {story.tag === 'Foster-to-Adopt' ? 'Foster-to-Adopt' : 'Adopted'} {story.year}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', gap: '4px',
                    }}>
                      {[1,2,3,4,5].map(n => (
                        <span key={n} style={{ color: '#F59E0B', fontSize: '0.9rem' }}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Your Story CTA */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container text-center" style={{ maxWidth: '600px' }}>
          <div className="reveal">
            <IconCircle name="camera" size={56} color="var(--blue-400)" bgOpacity={0.15} style={{ margin: '0 auto 20px' }} />
            <h2 style={{ marginBottom: '12px' }}>Share Your <span className="text-gradient">Happy Tail</span></h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '28px' }}>
              Adopted from us? We&apos;d love to hear your story and see how your furry friend is doing!
            </p>
            <Link href="/contact" className="btn btn-primary" style={{
              borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}>
              <Icon name="mail" size={16} color="#fff" /> Share Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section section-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(244,63,94,0.08) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ maxWidth: '600px', position: 'relative' }}>
          <h2 className="reveal" style={{ marginBottom: '12px' }}>Ready to Write Your Own <span style={{ color: 'var(--rose-400)' }}>Happy Tail</span>?</h2>
          <p className="reveal" style={{ color: '#94A3B8', marginBottom: '32px', lineHeight: 1.7 }}>
            There are animals waiting right now who would love to be part of your story.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/adopt" className="btn btn-primary btn-lg reveal" style={{ borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="paw" size={18} color="#fff" /> Browse Pets
            </Link>
            <Link href="/foster" className="btn btn-lg reveal" style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}>
              <Icon name="home" size={18} color="#fff" /> Become a Foster
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
