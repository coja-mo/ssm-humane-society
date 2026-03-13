'use client';
import { useState, useMemo } from 'react';

const ACTION_CONFIG = {
  create: { icon: '➕', color: '#10B981', label: 'Created' },
  update: { icon: '✏️', color: '#3B82F6', label: 'Updated' },
  delete: { icon: '🗑️', color: '#EF4444', label: 'Deleted' },
  login: { icon: '🔑', color: '#8B5CF6', label: 'Login' },
  status_change: { icon: '🔄', color: '#F59E0B', label: 'Status Change' },
  approve: { icon: '✅', color: '#10B981', label: 'Approved' },
  reject: { icon: '❌', color: '#EF4444', label: 'Rejected' },
  seed: { icon: '🌱', color: '#06B6D4', label: 'Seed' },
};

const ENTITY_ICONS = {
  pet: '🐾', application: '📋', donation: '💰', event: '📅',
  volunteer: '🤝', foster: '🏡', announcement: '📢', message: '💬',
  user: '👤', intake: '📦', supply: '📦', kennel: '🏠',
  settings: '⚙️', 'lost-found': '🔍',
};

function getTimeGroup(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffHours < 1) return 'Just Now';
  if (diffHours < 24) return 'Today';
  if (diffDays < 2) return 'Yesterday';
  if (diffDays < 7) return 'This Week';
  if (diffDays < 30) return 'This Month';
  return 'Older';
}

export default function ActivityTab({ activity = [], onSeedData }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');
  const [limit, setLimit] = useState(50);

  // Get unique entities and actions from data
  const entities = useMemo(() => {
    const set = new Set(activity.map(a => a.entity).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [activity]);

  const actions = useMemo(() => {
    const set = new Set(activity.map(a => a.action).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [activity]);

  // Filter
  const filtered = useMemo(() => {
    return activity.filter(item => {
      if (filter !== 'all' && item.action !== filter) return false;
      if (entityFilter !== 'all' && item.entity !== entityFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (item.action || '').toLowerCase().includes(s) ||
          (item.entity || '').toLowerCase().includes(s) ||
          (item.actor || '').toLowerCase().includes(s) ||
          (typeof item.details === 'string' ? item.details : JSON.stringify(item.details || '')).toLowerCase().includes(s);
      }
      return true;
    }).slice(0, limit);
  }, [activity, filter, entityFilter, search, limit]);

  // Group by time
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(item => {
      const group = getTimeGroup(item.timestamp || item.createdAt);
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  }, [filtered]);

  // Stats
  const todayCount = activity.filter(a => {
    const diff = Date.now() - new Date(a.timestamp || a.createdAt).getTime();
    return diff < 24 * 60 * 60 * 1000;
  }).length;

  const weekCount = activity.filter(a => {
    const diff = Date.now() - new Date(a.timestamp || a.createdAt).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  // Most active entity
  const entityCounts = {};
  activity.forEach(a => {
    const e = a.entity || 'unknown';
    entityCounts[e] = (entityCounts[e] || 0) + 1;
  });
  const topEntity = Object.entries(entityCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Activity Log</h1>
          <p className="admin-page-subtitle">System-wide audit trail — {activity.length} entries recorded</p>
        </div>
        <div className="admin-page-actions">
          <button onClick={() => setLimit(l => l + 50)} disabled={limit >= activity.length}
            style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-light)', borderRadius: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: limit >= activity.length ? 'default' : 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit', opacity: limit >= activity.length ? 0.5 : 1 }}>
            Load More
          </button>
          <button onClick={onSeedData}
            style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-light)', borderRadius: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit' }}>
            🌱 Seed Demo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Today', val: todayCount, icon: '📊', accent: '#3B82F6', bg: '#EFF6FF' },
          { label: 'This Week', val: weekCount, icon: '📅', accent: '#10B981', bg: '#ECFDF5' },
          { label: 'Total Events', val: activity.length, icon: '📋', accent: '#8B5CF6', bg: '#F5F3FF' },
          { label: 'Top Entity', val: topEntity ? topEntity[0] : '—', icon: ENTITY_ICONS[topEntity?.[0]] || '📊', accent: '#F59E0B', bg: '#FFFBEB' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}>
            <div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div>
            <div className="admin-stat-value admin-counter" style={{ fontSize: typeof s.val === 'string' ? '1.2rem' : undefined, textTransform: 'capitalize' }}>{s.val}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="admin-filters" style={{ marginBottom: '16px' }}>
        {['all', 'create', 'update', 'delete', 'status_change'].map(a => (
          <button key={a} className={`admin-filter-pill ${filter === a ? 'active' : ''}`} onClick={() => setFilter(a)}>
            {a === 'all' ? 'All Actions' : (ACTION_CONFIG[a]?.icon || '') + ' ' + (ACTION_CONFIG[a]?.label || a)}
          </button>
        ))}
        <div className="admin-filter-divider" />
        <select className="form-input form-select" value={entityFilter} onChange={e => setEntityFilter(e.target.value)}
          style={{ padding: '8px 28px 8px 12px', fontSize: '0.82rem', borderRadius: '100px', width: 'auto', minWidth: '120px', border: '1.5px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
          {entities.map(e => (
            <option key={e} value={e}>{e === 'all' ? 'All Entities' : (ENTITY_ICONS[e] || '') + ' ' + e.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
          ))}
        </select>
        <input className="admin-filter-search" placeholder="🔍 Search activity..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Grouped Activity Feed */}
      {Object.keys(grouped).length === 0 ? (
        <div className="admin-panel">
          <div className="admin-empty">
            <div className="admin-empty-icon">📊</div>
            <div className="admin-empty-title">No activity yet</div>
            <div className="admin-empty-text">Activity will be logged as you use the system. Hit &quot;Seed Demo&quot; to generate sample entries.</div>
          </div>
        </div>
      ) : (
        Object.entries(grouped).map(([group, items]) => (
          <div key={group} style={{ marginBottom: '24px' }}>
            <div style={{
              fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '12px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span>{group}</span>
              <span style={{ background: 'var(--bg-secondary)', padding: '2px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{items.length}</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
            </div>
            <div className="admin-panel">
              <div className="admin-panel-body" style={{ padding: '4px 0' }}>
                <div className="admin-activity-feed">
                  {items.map((item, i) => {
                    const actionCfg = ACTION_CONFIG[item.action] || { icon: '🔵', color: '#6B7280', label: item.action };
                    const entityIcon = ENTITY_ICONS[item.entity] || '📄';
                    return (
                      <div key={item.id || i} className="admin-activity-item">
                        <div className="admin-activity-content">
                          <div className="admin-activity-text">
                            <span style={{ marginRight: '6px' }}>{actionCfg.icon}</span>
                            <strong style={{ color: actionCfg.color }}>{actionCfg.label}</strong>
                            <span style={{ margin: '0 6px' }}>—</span>
                            <span>{entityIcon}</span>{' '}
                            <span style={{ textTransform: 'capitalize' }}>{item.entity?.replace(/-/g, ' ')}</span>
                            {item.details && (
                              <span style={{ color: 'var(--text-muted)' }}>
                                : {typeof item.details === 'string' ? item.details.slice(0, 100) : JSON.stringify(item.details).slice(0, 100)}
                              </span>
                            )}
                          </div>
                          <div className="admin-activity-time">
                            {new Date(item.timestamp || item.createdAt).toLocaleString()}
                            {item.actor && <span style={{ marginLeft: '8px', padding: '1px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', fontSize: '0.7rem', fontWeight: 600 }}>👤 {item.actor}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Load More */}
      {limit < activity.length && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <button onClick={() => setLimit(l => l + 50)} className="btn btn-ghost"
            style={{ borderRadius: '12px', padding: '10px 32px', fontSize: '0.88rem' }}>
            Load More ({activity.length - limit} remaining)
          </button>
        </div>
      )}
    </>
  );
}
