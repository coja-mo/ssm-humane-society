'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/Icon';

const NAV_LINKS = [
  { href: '/adopt', label: 'Adopt' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/foster', label: 'Foster' },
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
];

const MOBILE_ICONS = {
  '/adopt': 'paw',
  '/about': 'heart',
  '/services': 'medical',
  '/foster': 'home',
  '/volunteer': 'people',
  '/events': 'calendar',
  '/contact': 'mail',
};

export default function Navbar() {
  const pathname = usePathname();
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

  const isActive = (href) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-nav">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo" style={{ gap: '12px' }}>
            <span style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--blue-400), var(--blue-600))',
              boxShadow: '0 4px 12px rgba(41,171,226,0.3)',
              animation: 'float 4s ease-in-out infinite'
            }}>
              <Icon name="paw" size={20} color="#fff" />
            </span>
            <span>
              <span style={{ fontWeight: 800 }}>SSM</span>{' '}
              <span className="text-gradient" style={{ fontWeight: 700 }}>Humane Society</span>
            </span>
          </Link>

          <ul className="navbar-links">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <Link 
                  href={l.href} 
                  className={`navbar-link ${isActive(l.href) ? 'active' : ''}`}
                  style={isActive(l.href) ? { 
                    background: 'rgba(41,171,226,0.12)', 
                    color: 'var(--text-accent)',
                    fontWeight: 600 
                  } : {}}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <button onClick={toggleTheme} className="btn btn-icon btn-ghost" title="Toggle theme" aria-label="Toggle dark mode" style={{
              transition: 'all 0.3s ease', fontSize: '1.1rem'
            }}>
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9.37 5.51A7.35 7.35 0 009.1 7.5c0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27A7.014 7.014 0 0112 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3a9.012 9.012 0 00-9 9 9 9 0 009 9 9.01 9.01 0 008.13-5.13 .75.75 0 00-.85-1.04c-.64.16-1.31.24-2 .24-4.69 0-8.5-3.81-8.5-8.5 0-.69.08-1.36.24-2A.75.75 0 008.13 3.87 9 9 0 0012 3z"/></svg>
              )}
            </button>
            <Link href="/donate" className="btn btn-sm" style={{ 
              borderRadius: '100px', 
              background: 'linear-gradient(135deg, #F43F5E, #E11D48)', 
              color: '#fff',
              boxShadow: '0 4px 15px rgba(244,63,94,0.3)',
              fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px'
            }}>
              <Icon name="heart" size={14} color="#fff" /> Donate
            </Link>
            <Link href="/auth/login" className="navbar-cta" style={{ borderRadius: '100px' }}>
              Sign In
            </Link>
            <button className="mobile-toggle" onClick={() => setDrawerOpen(!drawerOpen)} aria-label="Toggle menu">
              <span style={{ transform: drawerOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', transition: 'all 0.3s' }} />
              <span style={{ opacity: drawerOpen ? 0 : 1, transition: 'all 0.3s' }} />
              <span style={{ transform: drawerOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none', transition: 'all 0.3s' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
        <button onClick={() => setDrawerOpen(false)} style={{ position: 'absolute', top: 24, right: 24, fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }} aria-label="Close menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
        {NAV_LINKS.map(l => (
          <Link 
            key={l.href} 
            href={l.href} 
            onClick={() => setDrawerOpen(false)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px',
              ...(isActive(l.href) ? { color: 'var(--text-accent)', borderBottomColor: 'var(--blue-400)' } : {})
            }}
          >
            <Icon name={MOBILE_ICONS[l.href]} size={18} color={isActive(l.href) ? 'var(--blue-500)' : 'var(--text-muted)'} />
            {l.label}
          </Link>
        ))}
        <Link href="/donate" onClick={() => setDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icon name="heart" size={18} color="var(--rose-500)" /> Donate
        </Link>
        <Link href="/auth/login" onClick={() => setDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icon name="lock" size={18} color="var(--text-muted)" /> Sign In
        </Link>
      </div>
    </>
  );
}
