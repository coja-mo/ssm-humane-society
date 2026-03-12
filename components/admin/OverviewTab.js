'use client';

export default function OverviewTab({ stats, loading, recentApps, onReviewApp }) {
  const cards = [
    { label: 'Available Pets', value: stats?.pets?.available ?? '—', icon: '🐾', color: 'var(--blue-500)' },
    { label: 'Pending Apps', value: stats?.applications?.pending ?? '—', icon: '📝', color: '#F59E0B' },
    { label: 'Adoptions', value: stats?.applications?.adopted ?? '—', icon: '🏠', color: 'var(--green-500)' },
    { label: 'Monthly Donations', value: stats?.donations?.thisMonth ? `$${stats.donations.thisMonth.toLocaleString()}` : '$0', icon: '💰', color: '#8B5CF6' },
    { label: 'Active Fosters', value: stats?.fosters?.active ?? '—', icon: '🏡', color: '#EC4899' },
    { label: 'Active Volunteers', value: stats?.volunteers?.active ?? '—', icon: '🤝', color: '#06B6D4' },
    { label: 'Upcoming Events', value: stats?.events?.upcoming ?? '—', icon: '📅', color: '#F97316' },
    { label: 'Total Donations', value: stats?.donations?.totalAmount ? `$${stats.donations.totalAmount.toLocaleString()}` : '$0', icon: '❤️', color: 'var(--rose-500)' },
  ];

  return (
    <>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Dashboard Overview</h1>
      <div className="stats-grid">
        {cards.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="stat-card-value" style={{ color: s.color }}>{loading ? '—' : s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
              <div style={{ fontSize: '2rem' }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { label: '+ Add Pet', icon: '🐾', color: 'var(--blue-500)' },
            { label: '+ Record Donation', icon: '💰', color: 'var(--green-500)' },
            { label: '+ Create Event', icon: '📅', color: '#F97316' },
            { label: '+ Add Announcement', icon: '📢', color: '#8B5CF6' },
          ].map(action => (
            <button key={action.label} className="btn btn-sm" style={{
              background: `${action.color}15`, color: action.color,
              border: `1.5px solid ${action.color}30`, fontWeight: 600,
            }}>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>📋 Application Pipeline</h3>
          {['submitted', 'reviewing', 'approved', 'visit-scheduled', 'adopted'].map(status => {
            const count = status === 'submitted' ? stats?.applications?.pending :
              status === 'reviewing' ? stats?.applications?.reviewing :
              status === 'approved' ? stats?.applications?.approved :
              status === 'adopted' ? stats?.applications?.adopted : 0;
            const colors = {
              submitted: '#F59E0B', reviewing: 'var(--blue-500)',
              approved: 'var(--green-500)', 'visit-scheduled': '#8B5CF6', adopted: '#EC4899'
            };
            return (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors[status] }} />
                <span style={{ flex: 1, fontSize: '0.9rem', textTransform: 'capitalize' }}>{status.replace(/-/g, ' ')}</span>
                <span style={{ fontWeight: 700, color: colors[status] }}>{loading ? '—' : (count ?? 0)}</span>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>🐾 Animals by Type</h3>
          {[
            { label: 'Dogs', value: stats?.pets?.dogs, icon: '🐕', color: 'var(--blue-500)' },
            { label: 'Cats', value: stats?.pets?.cats, icon: '🐈', color: '#F59E0B' },
            { label: 'Critters', value: stats?.pets?.critters, icon: '🐦', color: 'var(--green-500)' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: '0.9rem' }}>{item.label}</span>
              <span style={{ fontWeight: 700, color: item.color }}>{loading ? '—' : (item.value ?? 0)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Pending */}
      {recentApps && recentApps.length > 0 && (
        <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>⚠️ Needs Attention ({recentApps.length})</h3>
          {recentApps.slice(0, 5).map(app => (
            <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{app.firstName} {app.lastName}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {app.petInterest || app.type} · {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-sm btn-primary" onClick={() => onReviewApp(app.id, 'reviewing')}>Review</button>
                <button className="btn btn-sm" style={{ background: 'var(--green-100)', color: 'var(--green-800)' }} onClick={() => onReviewApp(app.id, 'approved')}>Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
