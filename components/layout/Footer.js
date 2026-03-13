'use client';
import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (email) {
      fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => {});
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  }

  return (
    <footer className="footer" id="site-footer" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Subtle accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(41,171,226,0.3), transparent)',
      }} />

      <div className="container">
        {/* Newsletter section */}
        <div style={{ textAlign: 'center', marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
            <Icon name="mail" size={24} color="var(--blue-400)" />
            <h3 style={{ fontSize: '1.5rem' }}>Stay in the Loop</h3>
          </div>
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
                {subscribed ? '✓ Done!' : 'Subscribe'}
              </button>
            </div>
          </form>
          {subscribed && (
            <p style={{ color: 'var(--green-500)', marginTop: '12px', fontSize: '0.85rem', animation: 'fadeInUp 0.4s ease' }}>
              <Icon name="check" size={14} color="var(--green-500)" style={{ marginRight: '6px' }} />
              Thanks for subscribing! You&apos;ll hear from us soon.
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
          {[
            { value: '1,847', label: 'Adoptions' },
            { value: '250+', label: 'Volunteers' },
            { value: '45+', label: 'Years of Service' },
            { value: '100+', label: 'Animals in Care' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: '80px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{stat.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#6B7280', marginTop: '2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span style={{ fontWeight: 800 }}>SSM</span>{' '}
              <span style={{ color: '#8896A7', fontWeight: 500, fontFamily: 'var(--font-body)' }}>Humane Society</span>
            </div>
            <p className="footer-desc">
              The Sault Ste. Marie Humane Society is committed to improving the lives of animals through rescue, adoption, and education. Together, we can make a difference.
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              {[
                { href: 'https://www.facebook.com/ssmhumanesociety/', label: 'Facebook', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg> },
                { href: 'https://www.instagram.com/ssmhumanesociety/', label: 'Instagram', icon: <Icon name="camera" size={16} color="currentColor" /> },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ 
                    background: 'rgba(255,255,255,0.08)', color: '#fff', width: '40px', height: '40px', 
                    borderRadius: '50%', transition: 'all 0.3s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-500)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; }}
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
              <li><Link href="/stories">Success Stories</Link></li>
              <li><Link href="/lost-found">Lost & Found</Link></li>
              <li><Link href="/surrender">Surrender a Pet</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-title">Contact</div>
            <ul className="footer-links">
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Icon name="location" size={14} color="#9CA3AF" /> 962 Second Line East</li>
              <li style={{ paddingLeft: '22px' }}>Sault Ste. Marie, ON P6B 4K4</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Icon name="phone" size={14} color="#9CA3AF" /> 705-949-3573</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Icon name="mail" size={14} color="#9CA3AF" /> info@ssmhumanesociety.ca</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}><Icon name="clock" size={14} color="#9CA3AF" /> Mon–Sat: 12–5 PM</li>
              <li style={{ paddingLeft: '22px' }}>Sunday: Closed</li>
              <li><Link href="/contact" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Contact Us <Icon name="arrow" size={14} /></Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sault Ste. Marie Humane Society. All rights reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/about" style={{ fontSize: '0.78rem', color: '#6B7280' }}>About</Link>
            <Link href="/services" style={{ fontSize: '0.78rem', color: '#6B7280' }}>Services</Link>
            <Link href="/faq" style={{ fontSize: '0.78rem', color: '#6B7280' }}>FAQ</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Made with</span>
              <Icon name="heart" size={14} color="var(--blue-400)" style={{ animation: 'heartbeat 2s ease-in-out infinite' }} />
              <span>in SSM</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
