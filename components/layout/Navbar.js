'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/adopt', label: 'Adopt' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/foster', label: 'Foster' },
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    const stored = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(stored);
    document.documentElement.setAttribute('data-theme', stored);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-nav">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <span className="navbar-logo-icon">🐾</span>
            <span>SSM <span className="text-accent">Humane Society</span></span>
          </Link>

          <ul className="navbar-links">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="navbar-link">{l.label}</Link>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <button onClick={toggleTheme} className="btn btn-icon btn-ghost" title="Toggle theme" aria-label="Toggle dark mode">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link href="/donate" className="btn btn-sm btn-primary" style={{ borderRadius: '100px' }}>
              ❤️ Donate
            </Link>
            <Link href="/auth/login" className="navbar-cta" style={{ borderRadius: '100px' }}>
              Sign In
            </Link>
            <button className="mobile-toggle" onClick={() => setDrawerOpen(!drawerOpen)} aria-label="Toggle menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
        <button onClick={() => setDrawerOpen(false)} style={{ position: 'absolute', top: 24, right: 24, fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }} aria-label="Close menu">✕</button>
        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href} onClick={() => setDrawerOpen(false)}>{l.label}</Link>
        ))}
        <Link href="/donate" onClick={() => setDrawerOpen(false)}>❤️ Donate</Link>
        <Link href="/auth/login" onClick={() => setDrawerOpen(false)}>Sign In</Link>
      </div>
    </>
  );
}
