'use client';
import Link from 'next/link';
import Icon, { IconCircle } from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative background */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(41,171,226,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', maxWidth: '520px', position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '6rem', fontFamily: 'var(--font-display)', fontWeight: 900,
          background: 'linear-gradient(135deg, var(--blue-400), var(--teal-400))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1, marginBottom: '16px',
        }}>
          404
        </div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '32px', fontSize: '1rem' }}>
          Looks like this page wandered off! Don&apos;t worry — our pets are all safe and accounted for.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary btn-lg" style={{ borderRadius: '100px' }}>
            <Icon name="home" size={18} color="#fff" /> Go Home
          </Link>
          <Link href="/adopt" className="btn btn-secondary btn-lg" style={{ borderRadius: '100px' }}>
            <Icon name="paw" size={18} /> Browse Pets
          </Link>
        </div>

        {/* Quick links */}
        <div style={{
          marginTop: '48px', display: 'flex', gap: '24px', justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {[
            { href: '/about', label: 'About Us', icon: 'heart' },
            { href: '/contact', label: 'Contact', icon: 'mail' },
            { href: '/faq', label: 'FAQ', icon: 'book' },
            { href: '/events', label: 'Events', icon: 'calendar' },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.88rem', color: 'var(--text-muted)',
              transition: 'color 0.2s',
            }}>
              <Icon name={link.icon} size={14} color="var(--text-muted)" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
