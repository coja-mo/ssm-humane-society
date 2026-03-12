'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    const stored = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(stored);
    document.documentElement.setAttribute('data-theme', stored);

    // Check for logged-in user
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));

    // Listen for storage changes (login/logout from other tabs)
    const onStorage = (e) => {
      if (e.key === 'user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', onStorage);

    // Close dropdown on outside click
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  // Re-check user on every navigation
  useEffect(() => {
    const checkUser = () => {
      const u = localStorage.getItem('user');
      setUser(u ? JSON.parse(u) : null);
    };
    // Poll for changes (handles same-tab login/logout)
    const interval = setInterval(checkUser, 1000);
    return () => clearInterval(interval);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }

  function handleLogout() {
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/');
  }

  const initials = user ? (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '';

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

            {user ? (
              /* Logged-in User Menu */
              <div className="user-menu-wrap" ref={dropdownRef}>
                <button
                  className="user-avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User menu"
                  id="user-menu-btn"
                >
                  {initials}
                </button>
                <div className={`user-dropdown ${dropdownOpen ? 'open' : ''}`}>
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-avatar">{initials}</div>
                    <div className="user-dropdown-info">
                      <div className="user-dropdown-name">{user.name || 'User'}</div>
                      <div className="user-dropdown-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="user-dropdown-body">
                    <Link href="/dashboard" className="user-dropdown-link" onClick={() => setDropdownOpen(false)}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                      Dashboard
                    </Link>
                    <Link href="/dashboard/profile" className="user-dropdown-link" onClick={() => setDropdownOpen(false)}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      Profile & Settings
                    </Link>
                    <Link href="/adopt" className="user-dropdown-link" onClick={() => setDropdownOpen(false)}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                      My Favorites
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="user-dropdown-link" onClick={() => setDropdownOpen(false)}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Admin Panel
                      </Link>
                    )}
                    <div className="user-dropdown-divider" />
                    <button className="user-dropdown-link danger" onClick={handleLogout}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Guest Sign In */
              <Link href="/auth/login" className="navbar-cta" style={{ borderRadius: '100px' }}>
                Sign In
              </Link>
            )}

            <button className="mobile-toggle" onClick={() => setDrawerOpen(!drawerOpen)} aria-label="Toggle menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
        <button onClick={() => setDrawerOpen(false)} style={{ position: 'absolute', top: 24, right: 24, fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }} aria-label="Close menu">✕</button>

        {/* User Info in Mobile */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '20px', marginBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue-500), var(--green-500))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1rem' }}>
              {initials}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>{user.name || 'User'}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          </div>
        )}

        {NAV_LINKS.map(l => (
          <Link key={l.href} href={l.href} onClick={() => setDrawerOpen(false)}>{l.label}</Link>
        ))}
        <Link href="/donate" onClick={() => setDrawerOpen(false)}>❤️ Donate</Link>

        {user ? (
          <>
            <Link href="/dashboard" onClick={() => setDrawerOpen(false)}>📊 Dashboard</Link>
            <Link href="/dashboard/profile" onClick={() => setDrawerOpen(false)}>👤 Profile & Settings</Link>
            <button
              onClick={() => { handleLogout(); setDrawerOpen(false); }}
              style={{ textAlign: 'left', padding: '16px 0', fontSize: '1.2rem', fontWeight: '600', borderBottom: '1px solid var(--border-light)', color: 'var(--rose-500)', width: '100%' }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/auth/login" onClick={() => setDrawerOpen(false)}>Sign In</Link>
        )}
      </div>
    </>
  );
}
