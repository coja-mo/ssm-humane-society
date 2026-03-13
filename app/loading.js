export default function Loading() {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '3px solid var(--border-light)',
          borderTopColor: 'var(--blue-500)',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 20px',
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</p>
      </div>
    </section>
  );
}
