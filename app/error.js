'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(244,63,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '2rem',
        }}>
          ⚠️
        </div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Something Went Wrong</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px' }}>
          We hit an unexpected error. Don&apos;t worry — this has been logged and we&apos;re on it.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} className="btn btn-primary" style={{ borderRadius: '100px' }}>
            <Icon name="refresh" size={16} color="#fff" /> Try Again
          </button>
          <Link href="/" className="btn btn-secondary" style={{ borderRadius: '100px' }}>
            <Icon name="home" size={16} /> Go Home
          </Link>
        </div>
      </div>
    </section>
  );
}
