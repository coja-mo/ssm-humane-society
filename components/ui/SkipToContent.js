'use client';

/**
 * Skip-to-content accessibility link.
 * Visible only on keyboard focus — allows screen reader and keyboard users
 * to skip past the navigation directly to the main content.
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'fixed',
        top: '-100%',
        left: '16px',
        zIndex: 100000,
        padding: '12px 24px',
        background: 'var(--blue-500)',
        color: '#fff',
        borderRadius: '0 0 8px 8px',
        fontWeight: 700,
        fontSize: '0.9rem',
        textDecoration: 'none',
        transition: 'top 0.2s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}
      onFocus={(e) => { e.currentTarget.style.top = '0'; }}
      onBlur={(e) => { e.currentTarget.style.top = '-100%'; }}
    >
      Skip to main content
    </a>
  );
}
