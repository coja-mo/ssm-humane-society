export default function DashboardLoading() {
  return (
    <section style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container">
        {/* Header skeleton */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <div className="skeleton skeleton-text" style={{ width: '200px', height: '28px', marginBottom: '8px' }} />
            <div className="skeleton skeleton-text short" style={{ width: '140px', height: '16px' }} />
          </div>
          <div className="skeleton" style={{ width: '120px', height: '40px', borderRadius: '100px' }} />
        </div>

        {/* Stats skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card" style={{ padding: '24px' }}>
              <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '12px', marginBottom: '12px' }} />
              <div className="skeleton skeleton-text" style={{ width: '60px', height: '24px', marginBottom: '6px' }} />
              <div className="skeleton skeleton-text short" style={{ width: '80px', height: '14px' }} />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="card" style={{ padding: '32px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: i < 5 ? '1px solid var(--border-light)' : 'none' }}>
              <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-text" style={{ width: '60%', height: '16px', marginBottom: '8px' }} />
                <div className="skeleton skeleton-text short" style={{ width: '40%', height: '14px' }} />
              </div>
              <div className="skeleton" style={{ width: '80px', height: '28px', borderRadius: '100px' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
