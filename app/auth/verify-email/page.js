'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setMounted(true);
    const u = localStorage.getItem('user');
    if (u) {
      const parsed = JSON.parse(u);
      setEmail(parsed.email || '');
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  function handleInput(index, value) {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`verify-code-${index + 1}`);
      if (next) next.focus();
    }

    // Auto-submit when all filled
    if (newCode.every(c => c) && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.getElementById(`verify-code-${index - 1}`);
      if (prev) prev.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split('');
      setCode(newCode);
      handleVerify(pasted);
    }
  }

  async function handleVerify(fullCode) {
    setLoading(true);
    // Simulate verification
    await new Promise(r => setTimeout(r, 1800));
    setVerified(true);
    setLoading(false);
    // Redirect after animation
    setTimeout(() => router.push('/dashboard'), 3000);
  }

  async function handleResend() {
    setResending(true);
    await new Promise(r => setTimeout(r, 1200));
    setResending(false);
    setResent(true);
    setCountdown(60);
    setTimeout(() => setResent(false), 4000);
  }

  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '***@***.com';

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-gradient" />
        <div className="auth-bg-pattern" />
      </div>

      <Link href="/dashboard" className="auth-back-link">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Skip for now
      </Link>

      <div className={`auth-container ${mounted ? 'auth-mounted' : ''}`}>
        <div className="auth-card">
          {!verified ? (
            <>
              <div className="auth-header">
                <div className="auth-logo-ring">
                  <div className="auth-logo-inner">
                    <svg width="32" height="32" fill="none" stroke="var(--blue-500)" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                  </div>
                </div>
                <h1 className="auth-title">Verify Your Email</h1>
                <p className="auth-subtitle">
                  We&apos;ve sent a 6-digit code to <strong>{maskedEmail}</strong>
                </p>
              </div>

              {/* Code Input */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '28px' }}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    id={`verify-code-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleInput(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    className="auth-input"
                    style={{
                      width: '52px', height: '60px', textAlign: 'center',
                      fontSize: '1.5rem', fontWeight: '800', padding: '0',
                      letterSpacing: '0', fontFamily: 'var(--font-display)',
                    }}
                    disabled={loading}
                  />
                ))}
              </div>

              {loading && (
                <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-accent)', fontWeight: '600', fontSize: '0.9rem' }}>
                  <span className="auth-spinner" style={{ borderColor: 'rgba(41,171,226,0.2)', borderTopColor: 'var(--blue-500)' }} />
                  Verifying...
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '12px' }}>
                  Didn&apos;t receive the code?
                </p>
                <button
                  type="button"
                  className="auth-link-inline"
                  onClick={handleResend}
                  disabled={resending || countdown > 0}
                  style={{ opacity: countdown > 0 ? 0.5 : 1, cursor: countdown > 0 ? 'default' : 'pointer' }}
                >
                  {resending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
              </div>

              {resent && (
                <div className="auth-alert" style={{ background: 'var(--green-50)', color: 'var(--green-800)', border: '1px solid var(--green-200)' }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  New code sent! Check your inbox.
                </div>
              )}

              <div className="auth-info-box" style={{ marginTop: '8px' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                <span>Can&apos;t find it? Check your spam folder. The code expires in 10 minutes.</span>
              </div>
            </>
          ) : (
            <div className="auth-success-state">
              <div className="auth-success-icon">
                <svg width="48" height="48" fill="none" stroke="var(--green-500)" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h2 className="auth-title" style={{ fontSize: '1.6rem' }}>Email Verified! 🎉</h2>
              <p className="auth-subtitle">
                Your email has been successfully verified. You&apos;re all set to start your adoption journey!
              </p>
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Redirecting to dashboard...</div>
                <div style={{ width: '120px', height: '3px', background: 'var(--border-light)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'var(--green-500)', animation: 'authProgressShrink 3s linear forwards', transformOrigin: 'left' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
