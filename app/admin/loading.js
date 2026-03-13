export default function AdminLoading() {
  return (
    <div style={{ padding: '120px 24px 60px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <div className="skeleton skeleton-text" style={{ width: '280px', height: '32px', marginBottom: '8px' }} />
            <div className="skeleton skeleton-text short" style={{ width: '160px', height: '16px' }} />
          </div>
        </div>

        {/* Tab bar skeleton */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '100px', flexShrink: 0 }} />
          ))}
        </div>

        {/* Stats skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }} />
      </div>
    </div>
  );
}
