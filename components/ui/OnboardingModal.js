'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const ONBOARD_STEPS = [
  {
    icon: '👋',
    title: 'Welcome to SSM Humane Society!',
    body: 'We\'re so glad you\'re here. Let us show you around and help you get started on your adoption journey.',
    image: '🏠',
  },
  {
    icon: '🐾',
    title: 'Browse Available Pets',
    body: 'Head to our Adopt page to see all the adorable cats, dogs, and other animals looking for a loving home.',
    action: { href: '/adopt', label: 'Browse Pets →' },
    image: '🐕',
  },
  {
    icon: '❤️',
    title: 'Save Your Favorites',
    body: 'Tap the heart icon on any pet card to save them to your favorites list. Come back anytime to review your saved pets.',
    image: '💕',
  },
  {
    icon: '🎯',
    title: 'Take the Pet Match Quiz',
    body: 'Not sure which pet is right for you? Take our quick quiz and we\'ll match you with pets that fit your lifestyle perfectly.',
    action: { href: '/dashboard/match', label: 'Take the Quiz →' },
    image: '🎯',
  },
  {
    icon: '📝',
    title: 'Apply to Adopt',
    body: 'Found your furever friend? Submit an adoption application and we\'ll guide you through each step of the process.',
    image: '📋',
  },
  {
    icon: '🎉',
    title: 'You\'re All Set!',
    body: 'Your account is ready. Start exploring and find your perfect companion. Our team is here to help every step of the way!',
    image: '🐾',
  },
];

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function handleClose() {
    setVisible(false);
    localStorage.setItem('onboarding-complete', 'true');
    setTimeout(() => onClose(), 300);
  }

  function next() {
    if (step < ONBOARD_STEPS.length - 1) setStep(step + 1);
    else handleClose();
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function skip() {
    handleClose();
  }

  const current = ONBOARD_STEPS[step];
  const isLast = step === ONBOARD_STEPS.length - 1;

  return (
    <div
      className="modal-overlay"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      onClick={skip}
    >
      <div
        className="modal"
        style={{
          maxWidth: '520px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '20px 24px 0' }}>
          {ONBOARD_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: step === i ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i <= step ? 'var(--blue-500)' : 'var(--border-light)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '32px 40px', textAlign: 'center' }} key={step}>
          <div style={{
            fontSize: '4rem', marginBottom: '20px',
            animation: 'authSuccessPop 0.4s ease',
          }}>
            {current.image}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.5rem',
            fontWeight: '800', marginBottom: '12px',
            animation: 'fadeInUp 0.4s ease 0.1s both',
          }}>
            {current.title}
          </h2>
          <p style={{
            color: 'var(--text-muted)', fontSize: '0.95rem',
            lineHeight: '1.6', maxWidth: '400px', margin: '0 auto',
            animation: 'fadeInUp 0.4s ease 0.2s both',
          }}>
            {current.body}
          </p>

          {current.action && (
            <Link
              href={current.action.href}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: '100px', marginTop: '16px',
                animation: 'fadeInUp 0.4s ease 0.3s both',
              }}
              onClick={handleClose}
            >
              {current.action.label}
            </Link>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0 24px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            {step > 0 ? (
              <button className="btn btn-ghost btn-sm" onClick={back}>
                ← Back
              </button>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={skip} style={{ color: 'var(--text-muted)' }}>
                Skip
              </button>
            )}
          </div>
          <button className="auth-submit-btn" onClick={next} style={{ width: 'auto', padding: '10px 28px', fontSize: '0.9rem' }}>
            {isLast ? 'Get Started 🚀' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
