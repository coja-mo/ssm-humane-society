'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: 1, label: 'Weak', color: '#EF4444' };
  if (s <= 2) return { score: 2, label: 'Fair', color: '#F59E0B' };
  if (s <= 3) return { score: 3, label: 'Good', color: '#3B82F6' };
  if (s <= 4) return { score: 4, label: 'Strong', color: '#10B981' };
  return { score: 5, label: 'Excellent', color: '#059669' };
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => { setMounted(true); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) return;
    if (password.length < 6) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push('/auth/login'), 4000);
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-gradient" />
        <div className="auth-bg-pattern" />
      </div>

      <Link href="/auth/login" className="auth-back-link">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Sign In
      </Link>

      <div className={`auth-container ${mounted ? 'auth-mounted' : ''}`}>
        <div className="auth-card">
          {!success ? (
            <>
              <div className="auth-header">
                <div className="auth-logo-ring">
                  <div className="auth-logo-inner">
                    <svg width="32" height="32" fill="none" stroke="var(--blue-500)" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                </div>
                <h1 className="auth-title">Create New Password</h1>
                <p className="auth-subtitle">
                  Your new password must be different from previous passwords.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-field">
                  <label className="auth-label">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    New Password
                  </label>
                  <div className="auth-input-wrap auth-input-with-action">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="auth-input"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      autoComplete="new-password"
                      id="reset-password"
                    />
                    <button type="button" className="auth-input-action" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                      {showPassword ? (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  {password && (
                    <div className="auth-strength">
                      <div className="auth-strength-bar">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="auth-strength-seg" style={{ background: i <= strength.score ? strength.color : 'var(--border-light)' }} />
                        ))}
                      </div>
                      <span style={{ color: strength.color, fontSize: '0.78rem', fontWeight: 600 }}>{strength.label}</span>
                    </div>
                  )}
                </div>

                <div className="auth-field">
                  <label className="auth-label">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Confirm New Password
                  </label>
                  <div className="auth-input-wrap">
                    <input
                      type="password"
                      className="auth-input"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Re-enter your password"
                      required
                      autoComplete="new-password"
                      id="reset-confirm"
                    />
                  </div>
                  {confirm && password && (
                    <div style={{ fontSize: '0.8rem', marginTop: '6px', fontWeight: 500, color: password === confirm ? '#10B981' : '#EF4444' }}>
                      {password === confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </div>
                  )}
                </div>

                {/* Password requirements */}
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '10px', color: 'var(--text-secondary)' }}>Password requirements:</div>
                  {[
                    { label: 'At least 6 characters', met: password.length >= 6 },
                    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
                    { label: 'Contains a number', met: /[0-9]/.test(password) },
                    { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) },
                  ].map((req, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: !password ? 'var(--text-muted)' : req.met ? '#10B981' : 'var(--text-muted)', marginBottom: '4px', transition: 'color 0.2s' }}>
                      {!password ? '○' : req.met ? '✓' : '○'}
                      {req.label}
                    </div>
                  ))}
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading || password !== confirm || password.length < 6} id="reset-submit">
                  {loading ? (
                    <>
                      <span className="auth-spinner" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
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
              <h2 className="auth-title" style={{ fontSize: '1.6rem' }}>Password Reset! 🔐</h2>
              <p className="auth-subtitle" style={{ marginBottom: '24px' }}>
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <Link href="/auth/login" className="auth-submit-btn" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                Sign In Now →
              </Link>
              <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Redirecting automatically in a few seconds...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
