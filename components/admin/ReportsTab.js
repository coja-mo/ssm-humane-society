'use client';
import { useState } from 'react';

/* ── Visual Bar Chart ── */
function BarChart({ data, labelKey, valueKey, color = 'var(--blue-500)', height = 160 }) {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height, padding: '0 4px' }}>
      {data.map((d, i) => {
        const pct = ((d[valueKey] || 0) / max) * 100;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {d[valueKey] || 0}
            </span>
            <div style={{
              width: '100%', maxWidth: '40px', height: `${Math.max(pct, 4)}%`,
              background: `linear-gradient(180deg, ${color}, ${color}88)`,
              borderRadius: '4px 4px 0 0', transition: 'height 0.8s cubic-bezier(0.16,1,0.3,1)',
              minHeight: '3px',
            }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>
              {d[labelKey]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Donut Chart ── */
function DonutChart({ segments, size = 140, strokeWidth = 14, centerLabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  let offset = 0;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
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
              strokeDashoffset={dashOffset} strokeLinecap="round"
              style={{ transition: 'all 1s ease' }} />
          );
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>{total}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{centerLabel || 'Total'}</div>
      </div>
    </div>
  );
}

/* ── Horizontal Stacked Bar ── */
function StackedBar({ segments, height = 24 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  return (
    <div style={{ display: 'flex', borderRadius: '100px', overflow: 'hidden', height, background: 'var(--bg-secondary)' }}>
      {segments.filter(s => s.value > 0).map((seg, i) => (
        <div key={i} title={`${seg.label}: ${seg.value}`} style={{
          width: `${(seg.value / total) * 100}%`, background: seg.color,
          transition: 'width 0.8s ease', minWidth: seg.value > 0 ? '4px' : 0,
        }} />
      ))}
    </div>
  );
}

/* ── Metric Card ── */
function MetricCard({ label, value, sublabel, icon, color, trend }) {
  return (
    <div className="admin-stat-card" style={{ '--stat-accent': color }}>
      <div className="admin-stat-top">
        <div className="admin-stat-icon" style={{ background: `${color}15`, color }}>{icon}</div>
        {trend && (
          <span className={`admin-stat-trend ${trend > 0 ? 'up' : 'down'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="admin-stat-value admin-counter">{value}</div>
      <div className="admin-stat-label">{label}</div>
      {sublabel && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{sublabel}</div>}
    </div>
  );
}

const DownloadIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

export default function ReportsTab({ reports, pets = [], apps = [], donations = [], volunteers = [], fosters = [], events = [], intakes = [] }) {
  const [dateRange, setDateRange] = useState('all');

  // Compute metrics from actual data
  const totalPets = pets.length;
  const availablePets = pets.filter(p => p.status === 'available').length;
  const adoptedPets = pets.filter(p => p.status === 'adopted').length;
  const totalApps = apps.filter(a => a.status !== 'draft').length;
  const pendingApps = apps.filter(a => a.status === 'submitted').length;
  const approvedApps = apps.filter(a => a.status === 'approved' || a.status === 'adopted').length;
  const totalDonations = donations.reduce((s, d) => s + (d.amount || 0), 0);
  const avgDonation = donations.length ? Math.round(totalDonations / donations.length) : 0;
  const monthlyDonations = donations.filter(d => d.type === 'monthly').reduce((s, d) => s + (d.amount || 0), 0);
  const activeVolunteers = volunteers.filter(v => v.status === 'active').length;
  const totalHours = volunteers.reduce((s, v) => s + (v.hoursLogged || 0), 0);
  const activeFosters = fosters.filter(f => f.status === 'active').length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;

  // Pet type breakdown
  const petTypes = [
    { label: 'Dogs', value: pets.filter(p => p.type === 'dog').length, color: '#3B82F6' },
    { label: 'Cats', value: pets.filter(p => p.type === 'cat').length, color: '#F59E0B' },
    { label: 'Other', value: pets.filter(p => p.type !== 'dog' && p.type !== 'cat').length, color: '#10B981' },
  ];

  // Pet status breakdown
  const petStatuses = [
    { label: 'Available', value: availablePets, color: '#10B981' },
    { label: 'Adopted', value: adoptedPets, color: '#8B5CF6' },
    { label: 'Fostered', value: pets.filter(p => p.status === 'fostered').length, color: '#F59E0B' },
    { label: 'Hold', value: pets.filter(p => p.status === 'hold' || p.status === 'medical-hold').length, color: '#EF4444' },
  ];

  // Application pipeline
  const appPipeline = [
    { label: 'Submitted', value: pendingApps, color: '#F59E0B' },
    { label: 'Reviewing', value: apps.filter(a => a.status === 'reviewing').length, color: '#3B82F6' },
    { label: 'Approved', value: apps.filter(a => a.status === 'approved').length, color: '#10B981' },
    { label: 'Visit', value: apps.filter(a => a.status === 'visit-scheduled').length, color: '#8B5CF6' },
    { label: 'Adopted', value: apps.filter(a => a.status === 'adopted').length, color: '#EC4899' },
    { label: 'Rejected', value: apps.filter(a => a.status === 'rejected').length, color: '#EF4444' },
  ];

  // Donation categories
  const donationCats = [
    { label: 'General', value: donations.filter(d => d.category === 'general').reduce((s, d) => s + (d.amount || 0), 0), color: '#3B82F6' },
    { label: 'Medical', value: donations.filter(d => d.category === 'medical').reduce((s, d) => s + (d.amount || 0), 0), color: '#EF4444' },
    { label: 'Food', value: donations.filter(d => d.category === 'food').reduce((s, d) => s + (d.amount || 0), 0), color: '#F59E0B' },
    { label: 'Shelter', value: donations.filter(d => d.category === 'shelter').reduce((s, d) => s + (d.amount || 0), 0), color: '#10B981' },
    { label: 'Event', value: donations.filter(d => d.category === 'event').reduce((s, d) => s + (d.amount || 0), 0), color: '#8B5CF6' },
  ];

  // Intake type breakdown
  const intakeTypes = [
    { label: 'Stray', value: intakes.filter(i => i.type === 'stray').length, color: '#3B82F6' },
    { label: 'Surrender', value: intakes.filter(i => i.type === 'surrender').length, color: '#F59E0B' },
    { label: 'Transfer', value: intakes.filter(i => i.type === 'transfer').length, color: '#10B981' },
    { label: 'Other', value: intakes.filter(i => !['stray', 'surrender', 'transfer'].includes(i.type)).length, color: '#8B5CF6' },
  ];

  // Volunteer hours by task (from shift logs)
  const volunteerTasks = ['dog-walking', 'cat-care', 'cleaning', 'event', 'admin', 'general'];
  const taskHours = volunteerTasks.map(task => ({
    label: task.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: volunteers.reduce((sum, v) => {
      return sum + ((v.shiftLog || []).filter(s => s.task === task).reduce((s2, s) => s2 + (s.hours || 0), 0));
    }, 0),
  }));

  // Monthly trends from reports API
  const trends = reports?.trends || [];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reports & Analytics</h1>
          <p className="admin-page-subtitle">
            Organization-wide insights — {totalPets} animals, ${totalDonations.toLocaleString()} raised, {activeVolunteers} active volunteers
          </p>
        </div>
        <div className="admin-page-actions">
          <select className="form-input form-select" value={dateRange} onChange={e => setDateRange(e.target.value)}
            style={{ padding: '8px 32px 8px 14px', fontSize: '0.82rem', borderRadius: '10px', width: 'auto' }}>
            <option value="all">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">This Year</option>
          </select>
          <button onClick={() => window.open('/api/export?entity=pets&format=csv')}
            style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-light)', borderRadius: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit' }}>
            {DownloadIcon} Export
          </button>
        </div>
      </div>

      {/* ═══ KEY METRICS ═══ */}
      <div className="admin-stats">
        <MetricCard label="Available Pets" value={availablePets} icon="🐾" color="#29ABE2" sublabel={`${totalPets} total in system`} />
        <MetricCard label="Adoptions" value={adoptedPets} icon="🏠" color="#10B981" sublabel={`${approvedApps} approved`} />
        <MetricCard label="Pending Apps" value={pendingApps} icon="📋" color="#F59E0B" sublabel={`${totalApps} total applications`} />
        <MetricCard label="Total Raised" value={`$${totalDonations.toLocaleString()}`} icon="💰" color="#8B5CF6" sublabel={`$${avgDonation} average`} />
        <MetricCard label="Monthly Recurring" value={`$${monthlyDonations.toLocaleString()}`} icon="🔄" color="#EC4899" />
        <MetricCard label="Active Volunteers" value={activeVolunteers} icon="🤝" color="#06B6D4" sublabel={`${totalHours}h total`} />
        <MetricCard label="Active Fosters" value={activeFosters} icon="🏡" color="#F97316" sublabel={`${fosters.length} total`} />
        <MetricCard label="Upcoming Events" value={upcomingEvents} icon="📅" color="#3B82F6" sublabel={`${events.length} total`} />
      </div>

      {/* ═══ VISUAL CHARTS ROW ═══ */}
      <div className="admin-grid-3" style={{ marginBottom: '24px' }}>
        {/* Pet Type Distribution */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title"><span style={{ fontSize: '1.1rem' }}>🐾</span> Animals by Type</div>
          </div>
          <div className="admin-panel-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '20px' }}>
            <DonutChart segments={petTypes} centerLabel="Animals" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {petTypes.map(seg => (
                <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: seg.color }} />
                  <span style={{ fontWeight: 500, flex: 1 }}>{seg.label}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: seg.color }}>{seg.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pet Status Distribution */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title"><span style={{ fontSize: '1.1rem' }}>📊</span> Pet Status</div>
          </div>
          <div className="admin-panel-body" style={{ padding: '20px 24px' }}>
            <StackedBar segments={petStatuses} height={28} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', gap: '8px', flexWrap: 'wrap' }}>
              {petStatuses.map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Pipeline */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title"><span style={{ fontSize: '1.1rem' }}>📋</span> Application Pipeline</div>
          </div>
          <div className="admin-panel-body" style={{ padding: '12px 24px 20px' }}>
            {appPipeline.map(step => (
              <div key={step.label} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '8px 0', borderBottom: '1px solid var(--border-light)',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step.color, boxShadow: `0 0 6px ${step.color}40`, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>{step.label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: step.color }}>{step.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ DONATION & INTAKE ANALYTICS ═══ */}
      <div className="admin-grid-2" style={{ marginBottom: '24px' }}>
        {/* Donation by Category */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title"><span style={{ fontSize: '1.1rem' }}>💰</span> Donations by Category</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>${totalDonations.toLocaleString()} total</span>
          </div>
          <div className="admin-panel-body" style={{ padding: '20px 24px' }}>
            <DonutChart segments={donationCats.filter(c => c.value > 0)} size={130} strokeWidth={12} centerLabel="Revenue" />
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {donationCats.filter(c => c.value > 0).map(cat => (
                <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: cat.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontWeight: 500 }}>{cat.label}</span>
                  <span style={{ fontWeight: 700, color: cat.color }}>${cat.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intake Sources */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title"><span style={{ fontSize: '1.1rem' }}>📦</span> Intake Sources</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{intakes.length} total intakes</span>
          </div>
          <div className="admin-panel-body" style={{ padding: '20px 24px' }}>
            <StackedBar segments={intakeTypes} height={28} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
              {intakeTypes.map(t => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', color: t.color }}>{t.value}</div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{intakes.length ? Math.round((t.value / intakes.length) * 100) : 0}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MONTHLY TRENDS ═══ */}
      {trends.length > 0 && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header">
            <div className="admin-panel-title"><span style={{ fontSize: '1.1rem' }}>📈</span> Monthly Trends</div>
          </div>
          <div className="admin-panel-body" style={{ overflowX: 'auto' }}>
            {/* Visual Bar Chart for adoptions */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-muted)' }}>Adoptions Over Time</div>
              <BarChart data={trends} labelKey="month" valueKey="adoptions" color="#10B981" height={120} />
            </div>
            {/* Data Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700 }}>Month</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Apps</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Adoptions</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Donations ($)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Intakes</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Volunteers</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Fosters</th>
                </tr>
              </thead>
              <tbody>
                {trends.map(t => (
                  <tr key={t.month} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{t.month}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>{t.applications}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--green-600)', fontWeight: 600 }}>{t.adoptions}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>${t.donationAmount?.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>{t.intakes}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>{t.volunteers}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>{t.fosters}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ BREAKDOWNS ═══ */}
      {reports?.breakdowns && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {[
            { title: '🐾 Pet Types', data: reports.breakdowns.petTypes },
            { title: '📋 Pet Status', data: reports.breakdowns.petStatus },
            { title: '📝 Application Status', data: reports.breakdowns.applicationStatus },
            { title: '🎂 Age Distribution', data: reports.breakdowns.ageDistribution },
          ].map(b => (
            <div key={b.title} className="admin-panel">
              <div className="admin-panel-header"><div className="admin-panel-title">{b.title}</div></div>
              <div className="admin-panel-body">
                {b.data && Object.entries(b.data).map(([key, val]) => {
                  const total = Object.values(b.data).reduce((s, v) => s + v, 0) || 1;
                  return (
                    <div key={key} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span style={{ textTransform: 'capitalize' }}>{key.replace(/-/g, ' ')}</span>
                        <span style={{ fontWeight: 700 }}>{val}</span>
                      </div>
                      <div className="admin-progress">
                        <div className="admin-progress-fill" style={{ width: `${(val / total) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ EXPORT OPTIONS ═══ */}
      <div className="admin-panel">
        <div className="admin-panel-header"><div className="admin-panel-title"><span style={{ fontSize: '1.1rem' }}>📥</span> Export Data</div></div>
        <div className="admin-panel-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['pets', 'applications', 'donations', 'volunteers', 'fosters', 'events', 'messages', 'lost-found', 'intakes', 'supplies', 'kennels'].map(entity => (
              <button key={entity} onClick={() => window.open(`/api/export?entity=${entity}&format=csv`)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid var(--border-light)', background: 'var(--bg-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                {DownloadIcon} {entity.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
