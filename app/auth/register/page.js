'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'register', email: form.email, password: form.password, name: form.name }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch { setError('Something went wrong. Please try again.'); setLoading(false); }
  }

  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
        <div className="text-center" style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🐾</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join us to start your adoption journey</p>
        </div>
        <form onSubmit={handleSubmit} className="card" style={{ padding: '32px' }}>
          {error && <div style={{ padding: '12px', background: '#FEE2E2', color: '#B91C1C', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Smith" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Already have an account?{' '}<Link href="/auth/login" style={{ color: 'var(--text-accent)', fontWeight: '600' }}>Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
