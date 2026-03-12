'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FLOATING_PAWS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: 16 + Math.random() * 28,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 4,
  rotation: Math.random() * 360,
}));

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('remembered-email');
    if (saved) { setEmail(saved); setRemember(true); }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      if (remember) localStorage.setItem('remembered-email', email);
      else localStorage.removeItem('remembered-email');
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Animated Background */}
      <div className="auth-bg">
        <div className="auth-bg-gradient" />
        <div className="auth-bg-pattern" />
        {FLOATING_PAWS.map(p => (
          <div
            key={p.id}
            className="auth-floating-paw"
            style={{
              left: p.left, top: p.top,
              fontSize: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--rotation': `${p.rotation}deg`,
            }}
          >
            🐾
          </div>
        ))}
      </div>

      {/* Back to Home */}
      <Link href="/" className="auth-back-link" style={{ animationDelay: '0s' }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Home
      </Link>

      {/* Login Card */}
      <div className={`auth-container ${mounted ? 'auth-mounted' : ''}`}>
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo-ring">
              <div className="auth-logo-inner">🐾</div>
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to manage your adoption journey</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="auth-alert auth-alert-error">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                Email Address
              </label>
              <div className="auth-input-wrap">
                <input
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  autoComplete="email"
                  id="login-email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Password
              </label>
              <div className="auth-input-wrap auth-input-with-action">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  id="login-password"
                />
                <button
                  type="button"
                  className="auth-input-action"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-checkbox-label" id="remember-me">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span className="auth-checkbox-custom" />
                Remember me
              </label>
              <Link href="/auth/forgot-password" className="auth-forgot-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          {/* Social Login */}
          <div className="auth-socials">
            <button type="button" className="auth-social-btn" id="login-google">
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button type="button" className="auth-social-btn" id="login-facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
            <button type="button" className="auth-social-btn" id="login-apple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Apple
            </button>
          </div>

          {/* Footer Link */}
          <div className="auth-footer-link">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register">Create one free →</Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="auth-trust">
          <div className="auth-trust-item">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            256-bit encryption
          </div>
          <div className="auth-trust-item">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Privacy protected
          </div>
          <div className="auth-trust-item">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Quick sign-in
          </div>
        </div>
      </div>
    </div>
  );
}
