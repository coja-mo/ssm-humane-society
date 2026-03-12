'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  }

  return (
    <footer className="footer" id="site-footer" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Aurora wave accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
        background: 'linear-gradient(90deg, var(--blue-400), var(--green-500), var(--blue-600), var(--rose-400))',
        backgroundSize: '300% 100%',
        animation: 'gradientShift 6s ease infinite'
      }} />

      <div className="container">
        {/* Newsletter section */}
        <div style={{ textAlign: 'center', marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Stay in the Loop 🐾</h3>
          <p style={{ color: '#9CA3AF', marginBottom: '20px', fontSize: '0.9rem' }}>
            Get updates on adoptable pets, events, and feel-good stories.
          </p>
          <form onSubmit={handleSubscribe}>
            <div className="newsletter-input-wrap">
              <input 
                type="email" 
                placeholder="Your email address..." 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit">
                {subscribed ? '✓ Subscribed!' : 'Subscribe'}
              </button>
            </div>
          </form>
          {subscribed && (
            <p style={{ color: 'var(--green-500)', marginTop: '12px', fontSize: '0.85rem', animation: 'fadeInUp 0.4s ease' }}>
              🎉 Thanks for subscribing! You&apos;ll hear from us soon.
            </p>
          )}
        </div>

        <div className="footer-grid">
          <div>
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem' }}>🐾</span>
              <span>SSM <span style={{ color: 'var(--blue-400)' }}>Humane Society</span></span>
            </div>
            <p className="footer-desc">
              The Sault Ste. Marie Humane Society is committed to improving the lives of animals through rescue, adoption, and education. Together, we can make a difference.
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              {[
                { href: 'https://www.facebook.com/ssmhumanesociety/', label: 'Facebook', icon: 'f' },
                { href: 'https://www.instagram.com/ssmhumanesociety/', label: 'Instagram', icon: '📷' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="btn btn-icon" 
                  style={{ 
                    background: 'rgba(255,255,255,0.08)', color: '#fff', width: '40px', height: '40px', 
                    borderRadius: '50%', transition: 'all 0.3s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  onMouseEnter={e => { e.target.style.background = 'var(--blue-500)'; e.target.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.transform = 'none'; }}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-title">Adopt</div>
            <ul className="footer-links">
              <li><Link href="/adopt">All Pets</Link></li>
              <li><Link href="/adopt?type=dog">Dogs</Link></li>
              <li><Link href="/adopt?type=cat">Cats</Link></li>
              <li><Link href="/adopt?type=critter">Critters</Link></li>
              <li><Link href="/apply/dog">Apply to Adopt</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-title">Get Involved</div>
            <ul className="footer-links">
              <li><Link href="/donate">Donate</Link></li>
              <li><Link href="/foster">Foster</Link></li>
              <li><Link href="/volunteer">Volunteer</Link></li>
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-title">Contact</div>
            <ul className="footer-links">
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>📍 962 Second Line East</li>
              <li style={{ paddingLeft: '26px' }}>Sault Ste. Marie, ON P6B 4K4</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>📞 705-949-3573</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>📠 705-949-0169</li>
              <li><Link href="/contact">Contact Us →</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sault Ste. Marie Humane Society. All rights reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Proud members of their community</span>
            <span style={{ animation: 'heartbeat 2s ease-in-out infinite' }}>💙</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
