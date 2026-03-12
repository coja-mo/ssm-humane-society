'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MOCK_CERTIFICATES = [
  {
    id: '1', petName: 'Bella', petBreed: 'Golden Retriever', petEmoji: '🐕',
    adoptedDate: '2025-12-15', certificateNumber: 'SSM-2025-0847',
    familyName: 'Mount Family', color: '#3B82F6',
  },
  {
    id: '2', petName: 'Whiskers', petBreed: 'Tabby Cat', petEmoji: '🐱',
    adoptedDate: '2026-01-22', certificateNumber: 'SSM-2026-0103',
    familyName: 'Mount Family', color: '#10B981',
  },
];

function CertificateCard({ cert, onView }) {
  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', transition: 'all 0.3s' }}>
      {/* Certificate Header Band */}
      <div style={{
        background: `linear-gradient(135deg, ${cert.color}, ${cert.color}CC)`,
        padding: '24px 28px', color: '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, marginBottom: '4px' }}>
              Certificate of Adoption
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>
              {cert.petEmoji} {cert.petName}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.78rem', opacity: 0.8 }}>
            #{cert.certificateNumber}
          </div>
        </div>
      </div>
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Breed</div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{cert.petBreed}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Adopted</div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{new Date(cert.adoptedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Family</div>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{cert.familyName}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Status</div>
            <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>✅ Official</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary btn-sm" style={{ borderRadius: '100px', flex: 1 }} onClick={() => onView(cert)}>
            🏆 View Certificate
          </button>
          <button className="btn btn-secondary btn-sm" style={{ borderRadius: '100px' }}>
            📥 Download
          </button>
        </div>
      </div>
    </div>
  );
}

function CertificateModal({ cert, onClose }) {
  const certRef = useRef(null);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px', padding: 0, overflow: 'hidden' }}>
        <div ref={certRef} style={{
          background: '#FFFAF5',
          padding: '48px', position: 'relative',
          textAlign: 'center', fontFamily: 'Georgia, serif',
        }}>
          {/* Decorative border */}
          <div style={{
            position: 'absolute', inset: '12px',
            border: '3px double #C9A96280',
            borderRadius: '4px', pointerEvents: 'none',
          }} />

          {/* Header ornament */}
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🐾</div>
          <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#C9A962', marginBottom: '16px' }}>
            Sault Ste. Marie Humane Society
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: '400', color: '#2D3748', marginBottom: '8px', fontStyle: 'italic' }}>
            Certificate of Adoption
          </h1>

          <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #C9A962, transparent)', margin: '16px auto 24px' }} />

          <p style={{ color: '#718096', fontSize: '0.92rem', marginBottom: '8px' }}>This certifies that</p>

          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', color: cert.color, fontWeight: '700', marginBottom: '8px' }}>
            {cert.petEmoji} {cert.petName}
          </h2>

          <p style={{ color: '#718096', fontSize: '0.92rem', marginBottom: '24px' }}>
            {cert.petBreed}
          </p>

          <p style={{ color: '#4A5568', fontSize: '1rem', marginBottom: '4px' }}>
            has been lovingly adopted by
          </p>

          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#2D3748', marginBottom: '24px', fontWeight: '600' }}>
            {cert.familyName}
          </h3>

          <p style={{ color: '#718096', fontSize: '0.88rem', marginBottom: '32px' }}>
            on {new Date(cert.adoptedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          {/* Seal */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(201,169,98,0.3)',
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
              🏆
            </div>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#A0AEC0', letterSpacing: '0.05em' }}>
            Certificate #{cert.certificateNumber}
          </div>
        </div>

        <div style={{ padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)' }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary btn-sm" style={{ borderRadius: '100px' }}>
              🖨️ Print
            </button>
            <button className="btn btn-primary btn-sm" style={{ borderRadius: '100px' }}>
              📤 Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [viewCert, setViewCert] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/auth/login'); return; }
    setUser(JSON.parse(u));
  }, [router]);

  if (!user) return null;

  return (
    <section style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontWeight: '600' }}>Adoption Certificates</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>🏆 Adoption Certificates</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Official certificates for your adopted family members
            </p>
          </div>
        </div>

        {MOCK_CERTIFICATES.length > 0 ? (
          <>
            {/* Success Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08))',
              borderRadius: 'var(--radius-lg)', padding: '28px 32px',
              marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '20px',
              border: '1px solid rgba(16,185,129,0.1)',
            }}>
              <div style={{ fontSize: '3rem' }}>🎉</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>
                  You&apos;ve given {MOCK_CERTIFICATES.length} pets a forever home!
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Thank you for choosing adoption. Each certificate represents a beautiful new chapter.
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {MOCK_CERTIFICATES.map(cert => (
                <CertificateCard key={cert.id} cert={cert} onView={setViewCert} />
              ))}
            </div>
          </>
        ) : (
          <div className="card" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'float 4s ease-in-out infinite' }}>🏆</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No certificates yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 28px' }}>
              When you complete an adoption, your official certificate will appear here. Start your journey by browsing our available pets!
            </p>
            <Link href="/adopt" className="btn btn-primary" style={{ borderRadius: '100px' }}>
              🐾 Browse Available Pets
            </Link>
          </div>
        )}

        {viewCert && <CertificateModal cert={viewCert} onClose={() => setViewCert(null)} />}

        <div style={{ marginTop: '24px' }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm">← Back to Dashboard</Link>
        </div>
      </div>
    </section>
  );
}
