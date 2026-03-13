'use client';

function DonutChart({ segments, size = 120, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let offset = 0;

  return (
    <div className="admin-donut" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--bg-secondary)" strokeWidth={strokeWidth} />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dashLength = pct * circumference;
          const dashOffset = -offset * circumference;
          offset += pct;
          return (
            <circle key={i} cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke={seg.color} strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 1s ease, stroke-dashoffset 1s ease' }} />
          );
        })}
      </svg>
      <div className="admin-donut-center">
        <div className="admin-donut-value">{total}</div>
        <div className="admin-donut-label">Total</div>
      </div>
    </div>
  );
}

function Sparkline({ data, color = 'var(--blue-400)' }) {
  const max = Math.max(...data, 1);
  return (
    <div className="admin-sparkline">
      {data.map((v, i) => (
        <div key={i} className="admin-sparkline-bar"
          style={{ height: `${Math.max((v / max) * 100, 8)}%`, background: color }} />
      ))}
    </div>
  );
}

export default function OverviewTab({ stats, loading, recentApps, onReviewApp, onSwitchTab, pets, donations, volunteers, events, fosters }) {
  const statCards = [
    { label: 'Available Pets', value: stats?.pets?.available ?? '—', icon: '🐾', accent: '#29ABE2', bg: '#EBF8FF' },
    { label: 'Pending Apps', value: stats?.applications?.pending ?? '—', icon: '📋', accent: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Adoptions', value: stats?.applications?.adopted ?? '—', icon: '🏠', accent: '#10B981', bg: '#ECFDF5' },
    { label: 'Monthly Donations', value: stats?.donations?.thisMonth ? `$${stats.donations.thisMonth.toLocaleString()}` : '$0', icon: '💰', accent: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Active Fosters', value: stats?.fosters?.active ?? '—', icon: '🏡', accent: '#EC4899', bg: '#FDF2F8' },
    { label: 'Active Volunteers', value: stats?.volunteers?.active ?? '—', icon: '🤝', accent: '#06B6D4', bg: '#ECFEFF' },
    { label: 'Upcoming Events', value: stats?.events?.upcoming ?? '—', icon: '📅', accent: '#F97316', bg: '#FFF7ED' },
    { label: 'Total Raised', value: stats?.donations?.totalAmount ? `$${stats.donations.totalAmount.toLocaleString()}` : '$0', icon: '❤️', accent: '#EF4444', bg: '#FEF2F2' },
  ];

  const pipelineSteps = [
    { status: 'submitted', label: 'Submitted', color: '#F59E0B' },
    { status: 'reviewing', label: 'Reviewing', color: '#3B82F6' },
    { status: 'approved', label: 'Approved', color: '#10B981' },
    { status: 'visit-scheduled', label: 'Visit', color: '#8B5CF6' },
    { status: 'adopted', label: 'Adopted', color: '#EC4899' },
  ];

  const getPipelineCount = (status) => {
    if (status === 'submitted') return stats?.applications?.pending ?? 0;
    if (status === 'reviewing') return stats?.applications?.reviewing ?? 0;
    if (status === 'approved') return stats?.applications?.approved ?? 0;
    if (status === 'adopted') return stats?.applications?.adopted ?? 0;
    return 0;
  };

  // Generate sparkline data from actual data (simulated weekly breakdown)
  const donationAmounts = (donations || []).slice(0, 7).map(d => d.amount || 0);
  while (donationAmounts.length < 7) donationAmounts.push(0);

  const petDonut = [
    { value: (pets || []).filter(p => p.type === 'dog').length, color: '#3B82F6', label: 'Dogs' },
    { value: (pets || []).filter(p => p.type === 'cat').length, color: '#F59E0B', label: 'Cats' },
    { value: (pets || []).filter(p => p.type === 'critter').length, color: '#10B981', label: 'Other' },
  ];

  // Build recent activity from all data sources
  const recentActivity = [
    ...(donations || []).slice(0, 3).map(d => ({
      text: `${d.isAnonymous ? 'Anonymous' : (d.donorName || 'Someone')} donated $${d.amount}`,
      time: d.createdAt, icon: '💰', color: '#10B981',
    })),
    ...(recentApps || []).slice(0, 3).map(a => ({
      text: `${a.firstName} ${a.lastName} submitted an adoption application`,
      time: a.createdAt, icon: '📋', color: '#F59E0B',
    })),
    ...(events || []).slice(0, 2).map(e => ({
      text: `Event "${e.title}" is ${e.status}`,
      time: e.createdAt, icon: '📅', color: '#F97316',
    })),
    ...(volunteers || []).slice(0, 2).map(v => ({
      text: `${v.firstName} ${v.lastName} — volunteer ${v.status}`,
      time: v.createdAt, icon: '🤝', color: '#06B6D4',
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

  const quickActions = [
    { label: 'Add Pet', icon: '🐾', bg: '#EBF8FF', accent: '#29ABE2', tab: 'pets' },
    { label: 'Review Applications', icon: '📋', bg: '#FFFBEB', accent: '#F59E0B', tab: 'applications' },
    { label: 'Record Donation', icon: '💰', bg: '#ECFDF5', accent: '#10B981', tab: 'donations' },
    { label: 'Create Event', icon: '📅', bg: '#FFF7ED', accent: '#F97316', tab: 'events' },
    { label: 'Manage Fosters', icon: '🏡', bg: '#FDF2F8', accent: '#EC4899', tab: 'fosters' },
    { label: 'Add Volunteer', icon: '🤝', bg: '#ECFEFF', accent: '#06B6D4', tab: 'volunteers' },
    { label: 'Post News', icon: '📢', bg: '#F5F3FF', accent: '#8B5CF6', tab: 'announcements' },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="admin-breadcrumb">
        <span>Dashboard</span>
        <span className="admin-breadcrumb-sep">›</span>
        <span className="admin-breadcrumb-current">Overview</span>
      </div>

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
            <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}>
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
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Navigate to any section</span>
        </div>
        <div className="admin-panel-body">
          <div className="admin-quick-actions">
            {quickActions.map(action => (
              <button key={action.label} className="admin-quick-action"
                onClick={() => onSwitchTab?.(action.tab)}>
                <div className="admin-quick-action-icon" style={{ background: action.bg, color: action.accent }}>
                  {action.icon}
                </div>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Three-Column: Pipeline + Animals Donut + Donation Sparkline */}
      <div className="admin-grid-3" style={{ marginBottom: '24px' }}>
        {/* Application Pipeline */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <span style={{ fontSize: '1.1rem' }}>📋</span> Pipeline
            </div>
          </div>
          <div className="admin-panel-body" style={{ padding: '12px 24px 20px' }}>
            {pipelineSteps.map(step => {
              const count = loading ? '—' : getPipelineCount(step.status);
              return (
                <div key={step.status} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 0', borderBottom: '1px solid var(--border-light)',
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: step.color, boxShadow: `0 0 6px ${step.color}40`,
                    flexShrink: 0,
                  }} />
                  <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>
                    {step.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: step.color }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Animals Donut */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <span style={{ fontSize: '1.1rem' }}>🐾</span> Animals
            </div>
          </div>
          <div className="admin-panel-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '20px 24px' }}>
            <DonutChart segments={petDonut} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {petDonut.map(seg => (
                <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: seg.color }} />
                  <span style={{ fontWeight: 500 }}>{seg.label}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: seg.color, marginLeft: 'auto' }}>{seg.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donation Sparkline */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <span style={{ fontSize: '1.1rem' }}>💰</span> Donations
            </div>
          </div>
          <div className="admin-panel-body" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>
                ${(stats?.donations?.totalAmount || 0).toLocaleString()}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Raised</span>
            </div>
            <Sparkline data={donationAmounts} color="#8B5CF6" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Recent donations</span>
              <span>{donations?.length || 0} total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column: Needs Attention + Activity Feed */}
      <div className="admin-grid-2">
        {/* Needs Attention */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title" style={{ color: recentApps?.length > 0 ? '#F59E0B' : 'var(--text-primary)' }}>
              <span style={{ fontSize: '1.1rem' }}>{recentApps?.length > 0 ? '⚠️' : '✅'}</span>
              {recentApps?.length > 0 ? `Needs Attention (${recentApps.length})` : 'All Caught Up'}
            </div>
            {recentApps?.length > 0 && (
              <button className="btn btn-sm btn-ghost" onClick={() => onSwitchTab?.('applications')}
                style={{ borderRadius: '10px', padding: '5px 14px', fontSize: '0.78rem' }}>View All</button>
            )}
          </div>
          <div className="admin-panel-body" style={{ padding: recentApps?.length > 0 ? '8px 24px 16px' : '24px' }}>
            {(!recentApps || recentApps.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.5 }}>🎉</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No pending applications to review!</div>
              </div>
            ) : recentApps.slice(0, 4).map(app => (
              <div key={app.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid var(--border-light)',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: '#FEF3C7', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0,
                  }}>📝</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{app.firstName} {app.lastName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {app.petInterest || app.type} · {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button className="btn btn-sm btn-ghost" onClick={() => onReviewApp(app.id, 'reviewing')}
                    style={{ padding: '5px 12px', fontSize: '0.78rem' }}>Review</button>
                  <button className="btn btn-sm" onClick={() => onReviewApp(app.id, 'approved')}
                    style={{ background: 'var(--green-50)', color: 'var(--green-700)', border: '1px solid var(--green-200)', padding: '5px 12px', fontSize: '0.78rem', borderRadius: '10px' }}>Approve</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <span style={{ fontSize: '1.1rem' }}>📊</span> Recent Activity
            </div>
          </div>
          <div className="admin-panel-body" style={{ padding: '12px 24px 20px' }}>
            {recentActivity.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.5 }}>📊</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No recent activity to show</div>
              </div>
            ) : (
              <div className="admin-activity-feed">
                {recentActivity.map((item, i) => (
                  <div key={i} className="admin-activity-item">
                    <div className="admin-activity-content">
                      <div className="admin-activity-text">
                        <span style={{ marginRight: '6px' }}>{item.icon}</span>
                        {item.text}
                      </div>
                      <div className="admin-activity-time">
                        {item.time ? new Date(item.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-panel" style={{ gridColumn: '1 / -1' }}>
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <span style={{ fontSize: '1.1rem' }}>⚡</span> Quick Actions
            </div>
          </div>
          <div className="admin-panel-body" style={{ padding: '16px 24px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              {[
                { label: 'New Pet', icon: '🐾', action: () => onSwitchTab?.('pets'), color: '#EFF6FF' },
                { label: 'Process App', icon: '📝', action: () => onSwitchTab?.('applications'), color: '#FEF3C7' },
                { label: 'Log Donation', icon: '💰', action: () => onSwitchTab?.('donations'), color: '#F0FDF4' },
                { label: 'Create Event', icon: '📅', action: () => onSwitchTab?.('events'), color: '#FFF7ED' },
                { label: 'Send News', icon: '📢', action: () => onSwitchTab?.('announcements'), color: '#FDF2F8' },
                { label: 'View Reports', icon: '📊', action: () => onSwitchTab?.('reports'), color: '#F5F3FF' },
              ].map((item, i) => (
                <button key={i} onClick={item.action}
                  className="btn" style={{
                    background: item.color, border: '1px solid var(--border-light)',
                    padding: '14px 12px', borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.2s',
                  }}>
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="admin-panel" style={{ gridColumn: '1 / -1' }}>
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <span style={{ fontSize: '1.1rem' }}>✅</span> Today&apos;s Tasks
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="admin-panel-body" style={{ padding: '12px 24px 20px' }}>
            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                { task: 'Morning health checks — all kennels', time: '6:30 AM', priority: 'high' },
                { task: 'Review new applications (3 pending)', time: '9:00 AM', priority: 'high' },
                { task: 'Kennel deep cleaning — Dog Wing B', time: '10:00 AM', priority: 'medium' },
                { task: 'Volunteer orientation prep', time: '1:00 PM', priority: 'low' },
                { task: 'Update pet profiles with new photos', time: '3:00 PM', priority: 'low' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
                  background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
                  borderLeft: `3px solid ${item.priority === 'high' ? '#EF4444' : item.priority === 'medium' ? '#F59E0B' : '#10B981'}`,
                }}>
                  <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--blue-500)' }} />
                  <div style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500 }}>{item.task}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
