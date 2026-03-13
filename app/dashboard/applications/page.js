'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import Icon, { IconCircle } from '@/components/ui/Icon';
import pets from '@/lib/data/pets.json';

// Mock applications data - in production this would come from the API
const MOCK_APPLICATIONS = [
  {
    id: 'app-001',
    petId: null,
    petName: 'General Dog Application',
    type: 'dog',
    status: 'pending',
    submittedAt: '2026-03-10T14:30:00Z',
    statusHistory: [
      { status: 'submitted', date: '2026-03-10T14:30:00Z', note: 'Application received' },
    ],
  },
];

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', icon: 'clock' },
  'in-review': { label: 'In Review', color: 'var(--blue-500)', bg: 'rgba(41,171,226,0.1)', icon: 'search' },
  approved: { label: 'Approved', color: 'var(--green-500)', bg: 'rgba(16,185,129,0.1)', icon: 'check' },
  denied: { label: 'Not Approved', color: 'var(--rose-500)', bg: 'rgba(244,63,94,0.1)', icon: 'shield' },
  completed: { label: 'Adoption Complete', color: 'var(--green-600)', bg: 'rgba(16,185,129,0.15)', icon: 'home' },
};

export default function ApplicationsPage() {
  useScrollReveal();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await fetch('/api/applications');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Map real API data to our display format
          const mapped = data.map((app, i) => {
            const pet = app.petId ? pets.find(p => p.id === app.petId) : null;
            return {
              id: app.id || `app-${i}`,
              petId: app.petId,
              petName: pet ? pet.name : app.petInterest || `${app.type || 'Pet'} Application`,
              type: app.type || 'dog',
              status: app.status || 'pending',
              submittedAt: app.submittedAt || new Date().toISOString(),
              applicant: `${app.firstName || ''} ${app.lastName || ''}`.trim(),
              statusHistory: [
                { status: 'submitted', date: app.submittedAt || new Date().toISOString(), note: 'Application received' },
              ],
            };
          });
          setApplications(mapped);
        } else {
          setApplications(MOCK_APPLICATIONS);
        }
      } catch {
        setApplications(MOCK_APPLICATIONS);
      }
      setLoading(false);
    }
    fetchApps();
  }, []);

  const pet = (app) => app.petId ? pets.find(p => p.id === app.petId) : null;

  if (loading) {
    return (
      <section style={{ paddingTop: '140px', paddingBottom: '100px', minHeight: '80vh' }}>
        <div className="container text-center">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px', height: '48px', border: '3px solid var(--border-light)',
              borderTopColor: 'var(--blue-500)', borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading your applications...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section style={{
        paddingTop: '120px', paddingBottom: '40px',
        background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            <Link href="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Applications</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '8px' }}>
                My <span className="text-gradient">Applications</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Track the status of your adoption applications.
              </p>
            </div>
            <Link href="/adopt" className="btn btn-primary" style={{
              borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}>
              <Icon name="paw" size={16} color="#fff" /> Browse Pets
            </Link>
          </div>
        </div>
      </section>

      {/* Applications List */}
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {applications.length === 0 ? (
            <div className="card text-center reveal" style={{ padding: '60px 32px' }}>
              <IconCircle name="edit" size={72} color="var(--text-muted)" bgOpacity={0.08} style={{ margin: '0 auto 20px' }} />
              <h2 style={{ marginBottom: '12px' }}>No Applications Yet</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                You haven&apos;t submitted any adoption applications yet. Find your perfect pet and apply today!
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/adopt" className="btn btn-primary" style={{ borderRadius: 'var(--radius-xl)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="search" size={16} color="#fff" /> Browse Available Pets
                </Link>
                <Link href="/adopt/adoption-information" className="btn btn-secondary" style={{ borderRadius: 'var(--radius-xl)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="book" size={16} /> Adoption Guide
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {applications.map((app) => {
                const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                const matchedPet = pet(app);
                const daysAgo = Math.floor((new Date() - new Date(app.submittedAt)) / 86400000);
                return (
                  <div key={app.id} className="card card-3d reveal" style={{ overflow: 'hidden' }}>
                    <div style={{ height: '4px', background: statusCfg.color }} />
                    <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: matchedPet ? '80px 1fr auto' : '1fr auto', gap: '24px', alignItems: 'center' }}>
                      {/* Pet Image */}
                      {matchedPet && (
                        <Link href={`/adopt/${matchedPet.id}`} style={{
                          width: '80px', height: '80px', borderRadius: 'var(--radius-lg)',
                          overflow: 'hidden', flexShrink: 0,
                          background: 'var(--bg-secondary)',
                        }}>
                          <div style={{
                            width: '100%', height: '100%',
                            background: `url(/pets/${matchedPet.image || 'placeholder.jpg'}) center/cover`,
                            borderRadius: 'var(--radius-lg)',
                          }} />
                        </Link>
                      )}

                      {/* Info */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.1rem' }}>{app.petName}</h3>
                          <span style={{
                            padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem',
                            fontWeight: 700, background: statusCfg.bg, color: statusCfg.color,
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                          }}>
                            <Icon name={statusCfg.icon} size={12} color={statusCfg.color} />
                            {statusCfg.label}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Icon name="calendar" size={12} color="var(--text-muted)" />
                            Submitted {daysAgo === 0 ? 'today' : daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Icon name="paw" size={12} color="var(--text-muted)" />
                            {app.type.charAt(0).toUpperCase() + app.type.slice(1)} adoption
                          </span>
                        </p>

                        {/* Status Timeline */}
                        <div style={{ marginTop: '16px', display: 'flex', gap: '0', alignItems: 'stretch' }}>
                          {['submitted', 'in-review', 'approved', 'completed'].map((step, i) => {
                            const isComplete = app.statusHistory?.some(h => h.status === step) || 
                              (step === 'submitted') ||
                              (step === 'in-review' && ['in-review', 'approved', 'completed'].includes(app.status)) ||
                              (step === 'approved' && ['approved', 'completed'].includes(app.status)) ||
                              (step === 'completed' && app.status === 'completed');
                            const isCurrent = (step === 'submitted' && app.status === 'pending') ||
                              (step === 'in-review' && app.status === 'in-review') ||
                              (step === 'approved' && app.status === 'approved') ||
                              (step === 'completed' && app.status === 'completed');
                            return (
                              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <div style={{
                                  width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                                  background: isComplete ? 'var(--green-500)' : isCurrent ? 'var(--blue-500)' : 'var(--bg-secondary)',
                                  border: `2px solid ${isComplete ? 'var(--green-500)' : isCurrent ? 'var(--blue-500)' : 'var(--border-light)'}`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: '#fff', fontSize: '0.6rem', fontWeight: 700,
                                  transition: 'all 0.3s',
                                }}>
                                  {isComplete ? '✓' : i + 1}
                                </div>
                                {i < 3 && (
                                  <div style={{
                                    flex: 1, height: '2px',
                                    background: isComplete ? 'var(--green-500)' : 'var(--border-light)',
                                    transition: 'background 0.3s',
                                  }} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                          {['Submitted', 'Review', 'Approved', 'Complete'].map(label => (
                            <span key={label} style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', flex: 1 }}>{label}</span>
                          ))}
                        </div>
                      </div>

                      {/* Action */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                        {matchedPet && (
                          <Link href={`/adopt/${matchedPet.id}`} className="btn btn-sm btn-secondary" style={{
                            borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
                          }}>
                            <Icon name="eye" size={14} /> View Pet
                          </Link>
                        )}
                        <Link href="/contact" className="btn btn-sm btn-ghost" style={{
                          borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
                          fontSize: '0.8rem',
                        }}>
                          <Icon name="phone" size={12} /> Contact Shelter
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Info Card */}
          <div className="card reveal" style={{ marginTop: '32px', padding: '24px', borderLeft: '4px solid var(--blue-500)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Icon name="info" size={18} color="var(--blue-500)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <h4 style={{ marginBottom: '6px', fontSize: '0.95rem' }}>Application Timeline</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.7' }}>
                  Applications are typically reviewed within 1–3 business days. If approved, we&apos;ll contact you
                  to schedule a meet-and-greet. The entire process from application to adoption usually takes 2–5 business days.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>
                  Questions? Call us at <a href="tel:7059493573" style={{ color: 'var(--text-accent)', fontWeight: 600 }}>705-949-3573</a> (Mon–Sat, 12–5 PM)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
