'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const FLOATING_PAWS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: 16 + Math.random() * 24,
  delay: Math.random() * 5,
  duration: 4 + Math.random() * 4,
  rotation: Math.random() * 360,
}));

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Simulate send — in production this would hit a real API
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="auth-page">
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

      <Link href="/auth/login" className="auth-back-link">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Sign In
      </Link>

      <div className={`auth-container ${mounted ? 'auth-mounted' : ''}`}>
        <div className="auth-card">
          {!sent ? (
            <>
              <div className="auth-header">
                <div className="auth-logo-ring">
                  <div className="auth-logo-inner">
                    <svg width="32" height="32" fill="none" stroke="var(--blue-500)" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </div>
                </div>
                <h1 className="auth-title">Reset Password</h1>
                <p className="auth-subtitle">Enter your email and we&apos;ll send you a link to reset your password.</p>
              </div>

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
                      id="forgot-email"
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading} id="forgot-submit">
                  {loading ? (
                    <>
                      <span className="auth-spinner" />
                      Sending reset link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="auth-success-state">
              <div className="auth-success-icon">
                <svg width="48" height="48" fill="none" stroke="var(--green-500)" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h2 className="auth-title" style={{ fontSize: '1.6rem' }}>Check Your Email</h2>
              <p className="auth-subtitle" style={{ marginBottom: '24px' }}>
                We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
              </p>
              <div className="auth-info-box">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                <span>Didn&apos;t receive the email? Check your spam folder or <button type="button" className="auth-link-inline" onClick={() => { setSent(false); setEmail(''); }}>try again</button>.</span>
              </div>
            </div>
          )}

          <div className="auth-footer-link" style={{ marginTop: '24px' }}>
            Remember your password?{' '}
            <Link href="/auth/login">Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
