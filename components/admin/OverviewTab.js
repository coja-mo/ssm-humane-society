'use client';

export default function OverviewTab({ stats, loading, recentApps, onReviewApp }) {
  const statCards = [
    { label: 'Available Pets', value: stats?.pets?.available ?? '—', icon: '🐾', accent: '#29ABE2', bg: '#EBF8FF' },
    { label: 'Pending Apps', value: stats?.applications?.pending ?? '—', icon: '📋', accent: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Adoptions', value: stats?.applications?.adopted ?? '—', icon: '🏠', accent: '#10B981', bg: '#ECFDF5' },
    { label: 'Monthly Donations', value: stats?.donations?.thisMonth ? `$${stats.donations.thisMonth.toLocaleString()}` : '$0', icon: '💰', accent: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Active Fosters', value: stats?.fosters?.active ?? '—', icon: '🏡', accent: '#EC4899', bg: '#FDF2F8' },
    { label: 'Active Volunteers', value: stats?.volunteers?.active ?? '—', icon: '🤝', accent: '#06B6D4', bg: '#ECFEFF' },
    { label: 'Upcoming Events', value: stats?.events?.upcoming ?? '—', icon: '📅', accent: '#F97316', bg: '#FFF7ED' },
    { label: 'Total Donations', value: stats?.donations?.totalAmount ? `$${stats.donations.totalAmount.toLocaleString()}` : '$0', icon: '❤️', accent: '#EF4444', bg: '#FEF2F2' },
  ];

  const pipelineSteps = [
    { status: 'submitted', label: 'Submitted', color: '#F59E0B' },
    { status: 'reviewing', label: 'Reviewing', color: '#3B82F6' },
    { status: 'approved', label: 'Approved', color: '#10B981' },
    { status: 'visit-scheduled', label: 'Visit', color: '#8B5CF6' },
    { status: 'adopted', label: 'Adopted', color: '#EC4899' },
  ];

  const animalTypes = [
    { label: 'Dogs', value: stats?.pets?.dogs, icon: '🐕', accent: '#3B82F6' },
    { label: 'Cats', value: stats?.pets?.cats, icon: '🐈', accent: '#F59E0B' },
    { label: 'Small Animals', value: stats?.pets?.critters, icon: '🐹', accent: '#10B981' },
  ];

  const getPipelineCount = (status) => {
    if (status === 'submitted') return stats?.applications?.pending ?? 0;
    if (status === 'reviewing') return stats?.applications?.reviewing ?? 0;
    if (status === 'approved') return stats?.applications?.approved ?? 0;
    if (status === 'adopted') return stats?.applications?.adopted ?? 0;
    return 0;
  };

  return (
    <>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">Your shelter at a glance — real-time operational insights</p>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="admin-stats">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="admin-skeleton admin-skeleton-stat" />
          ))}
        </div>
      ) : (
        <div className="admin-stats">
          {statCards.map((s, i) => (
            <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg, animationDelay: `${i * 0.05}s` }}>
              <div className="admin-stat-top">
                <div className="admin-stat-icon">{s.icon}</div>
              </div>
              <div className="admin-stat-value admin-counter">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="admin-panel" style={{ marginBottom: '24px' }}>
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <span style={{ fontSize: '1.1rem' }}>⚡</span> Quick Actions
          </div>
        </div>
        <div className="admin-panel-body">
          <div className="admin-quick-actions">
            {[
              { label: 'Add Pet', icon: '🐾', bg: '#EBF8FF', accent: '#29ABE2' },
              { label: 'Record Donation', icon: '💰', bg: '#ECFDF5', accent: '#10B981' },
              { label: 'Create Event', icon: '📅', bg: '#FFF7ED', accent: '#F97316' },
              { label: 'Post News', icon: '📢', bg: '#F5F3FF', accent: '#8B5CF6' },
              { label: 'Add Volunteer', icon: '🤝', bg: '#ECFEFF', accent: '#06B6D4' },
            ].map(action => (
              <button key={action.label} className="admin-quick-action">
                <div className="admin-quick-action-icon" style={{ background: action.bg, color: action.accent }}>
                  {action.icon}
                </div>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline + Animals Grid */}
      <div className="admin-grid-2" style={{ marginBottom: '24px' }}>
        {/* Application Pipeline */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <span style={{ fontSize: '1.1rem' }}>📋</span> Application Pipeline
            </div>
          </div>
          <div className="admin-panel-body" style={{ padding: '16px 24px 24px' }}>
            {pipelineSteps.map(step => {
              const count = loading ? '—' : getPipelineCount(step.status);
              return (
                <div key={step.status} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 0', borderBottom: '1px solid var(--border-light)',
                }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: step.color, boxShadow: `0 0 8px ${step.color}40`,
                    flexShrink: 0,
                  }} />
                  <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize' }}>
                    {step.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: step.color }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Animals by Type */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <span style={{ fontSize: '1.1rem' }}>🐾</span> Animals by Type
            </div>
          </div>
          <div className="admin-panel-body" style={{ padding: '16px 24px 24px' }}>
            {animalTypes.map(item => {
              const total = (stats?.pets?.available ?? 0) || 1;
              const val = loading ? 0 : (item.value ?? 0);
              const pct = Math.round((val / total) * 100);
              return (
                <div key={item.label} style={{ padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                    <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: item.accent }}>
                      {loading ? '—' : val}
                    </span>
                  </div>
                  <div className="admin-progress">
                    <div className="admin-progress-fill" style={{
                      width: loading ? '0%' : `${pct}%`,
                      background: `linear-gradient(90deg, ${item.accent}, ${item.accent}CC)`,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Needs Attention */}
      {recentApps && recentApps.length > 0 && (
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title" style={{ color: '#F59E0B' }}>
              <span style={{ fontSize: '1.1rem' }}>⚠️</span> Needs Attention ({recentApps.length})
            </div>
          </div>
          <div className="admin-panel-body" style={{ padding: '8px 24px 16px' }}>
            {recentApps.slice(0, 5).map(app => (
              <div key={app.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', borderBottom: '1px solid var(--border-light)',
                gap: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: '#FEF3C7', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1rem', flexShrink: 0,
                  }}>📝</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{app.firstName} {app.lastName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {app.petInterest || app.type} · {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-sm" style={{
                    background: 'linear-gradient(135deg, var(--blue-500), var(--blue-600))',
                    color: '#fff', borderRadius: '10px', padding: '6px 16px', fontSize: '0.82rem',
                  }} onClick={() => onReviewApp(app.id, 'reviewing')}>Review</button>
                  <button className="btn btn-sm" style={{
                    background: 'var(--green-50)', color: 'var(--green-800)',
                    borderRadius: '10px', padding: '6px 16px', fontSize: '0.82rem',
                    border: '1px solid var(--green-200)',
                  }} onClick={() => onReviewApp(app.id, 'approved')}>Approve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
