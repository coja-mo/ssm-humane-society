'use client';
import { useState, useMemo } from 'react';

const ROLE_CONFIG = {
  admin:     { bg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', text: '#fff', label: 'Admin', icon: '🛡️', lightBg: '#EFF6FF', accent: '#3B82F6' },
  staff:     { bg: 'linear-gradient(135deg, #10B981, #059669)', text: '#fff', label: 'Staff', icon: '👔', lightBg: '#ECFDF5', accent: '#10B981' },
  volunteer: { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', text: '#fff', label: 'Volunteer', icon: '🤝', lightBg: '#FFFBEB', accent: '#F59E0B' },
  foster:    { bg: 'linear-gradient(135deg, #EC4899, #DB2777)', text: '#fff', label: 'Foster', icon: '🏡', lightBg: '#FDF2F8', accent: '#EC4899' },
  adopter:   { bg: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', text: '#fff', label: 'Adopter', icon: '🏠', lightBg: '#F5F3FF', accent: '#8B5CF6' },
};

function UserCard({ user, onUpdateRole }) {
  const [editing, setEditing] = useState(false);
  const role = user.role || 'adopter';
  const rc = ROLE_CONFIG[role] || ROLE_CONFIG.adopter;
  const initial = (user.name || user.email || '?')[0].toUpperCase();
  const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const lastActive = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;

  return (
    <div className="admin-panel" style={{ marginBottom: '8px', transition: 'all 0.25s' }}>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Avatar */}
          <div style={{
            width: '50px', height: '50px', borderRadius: '14px',
            background: rc.bg, color: rc.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1rem', flexShrink: 0,
            boxShadow: `0 4px 12px ${rc.accent}30`,
          }}>
            {initial}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {user.name || 'Unnamed User'}
              <span style={{
                padding: '2px 10px', borderRadius: '100px', fontSize: '0.7rem',
                fontWeight: 700, background: rc.lightBg, color: rc.accent,
                display: 'inline-flex', alignItems: 'center', gap: '4px',
              }}>
                {rc.icon} {rc.label}
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span>📧 {user.email}</span>
              {user.phone && <span>📞 {user.phone}</span>}
              <span>📅 Joined {joinedDate}</span>
              {lastActive && <span>🟢 Active {lastActive}</span>}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            {editing ? (
              <select className="form-input form-select" value={role}
                onChange={async (e) => { await onUpdateRole(user.id, e.target.value); setEditing(false); }}
                onBlur={() => setEditing(false)}
                autoFocus
                style={{ padding: '8px 32px 8px 12px', fontSize: '0.82rem', width: 'auto', borderRadius: '10px' }}>
                <option value="adopter">Adopter</option>
                <option value="volunteer">Volunteer</option>
                <option value="foster">Foster</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            ) : (
              <button onClick={() => setEditing(true)}
                style={{
                  padding: '6px 14px', borderRadius: '10px', fontSize: '0.78rem',
                  fontWeight: 600, border: '1.5px solid var(--border-light)',
                  background: 'var(--bg-secondary)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  color: 'var(--text-secondary)', fontFamily: 'inherit',
                }}>
                ✏️ Change Role
              </button>
            )}
          </div>
        </div>

        {/* User Stats Row */}
        {(user.applicationsCount > 0 || user.favoritesCount > 0 || user.visitCount > 0) && (
          <div style={{
            display: 'flex', gap: '20px', marginTop: '12px', paddingTop: '12px',
            borderTop: '1px solid var(--border-light)', marginLeft: '66px',
          }}>
            {user.applicationsCount > 0 && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{user.applicationsCount}</strong> applications
              </div>
            )}
            {user.favoritesCount > 0 && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{user.favoritesCount}</strong> favorites
              </div>
            )}
            {user.visitCount > 0 && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{user.visitCount}</strong> visits
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function UsersTab({ users = [], onUpdateUser }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const handleUpdateRole = async (userId, newRole) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok && onUpdateUser) {
      const updated = await res.json();
      onUpdateUser(userId, updated);
    }
  };

  const roleCounts = useMemo(() => ({
    admin: users.filter(u => u.role === 'admin').length,
    staff: users.filter(u => u.role === 'staff').length,
    volunteer: users.filter(u => u.role === 'volunteer').length,
    foster: users.filter(u => u.role === 'foster').length,
    adopter: users.filter(u => !u.role || u.role === 'adopter').length,
  }), [users]);

  const filtered = useMemo(() => {
    let result = users.filter(u => {
      if (filter !== 'all') {
        const role = u.role || 'adopter';
        if (role !== filter) return false;
      }
      if (search) {
        const s = search.toLowerCase();
        return (u.name || '').toLowerCase().includes(s) ||
          (u.email || '').toLowerCase().includes(s) ||
          (u.phone || '').toLowerCase().includes(s);
      }
      return true;
    });

    // Sort
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === 'name') result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (sortBy === 'role') result.sort((a, b) => (a.role || 'adopter').localeCompare(b.role || 'adopter'));

    return result;
  }, [users, filter, search, sortBy]);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">User Management</h1>
          <p className="admin-page-subtitle">{users.length} registered {users.length === 1 ? 'user' : 'users'} across all roles</p>
        </div>
      </div>

      {/* Role Summary Cards */}
      <div className="admin-stats" style={{ marginBottom: '24px' }}>
        {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
          <div key={role} className="admin-stat-card" style={{ '--stat-accent': cfg.accent, '--stat-bg': cfg.lightBg, cursor: 'pointer' }}
            onClick={() => setFilter(filter === role ? 'all' : role)}>
            <div className="admin-stat-top">
              <div className="admin-stat-icon">{cfg.icon}</div>
            </div>
            <div className="admin-stat-value admin-counter">{roleCounts[role]}</div>
            <div className="admin-stat-label">{cfg.label}s</div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="admin-filters">
        {['all', 'admin', 'staff', 'volunteer', 'foster', 'adopter'].map(r => (
          <button key={r} className={`admin-filter-pill ${filter === r ? 'active' : ''}`} onClick={() => setFilter(r)}>
            {r === 'all' ? 'All Users' : `${ROLE_CONFIG[r]?.icon || ''} ${ROLE_CONFIG[r]?.label || r} (${roleCounts[r]})`}
          </button>
        ))}
        <div className="admin-filter-divider" />
        <select className="form-input form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ padding: '8px 28px 8px 12px', fontSize: '0.82rem', borderRadius: '100px', width: 'auto', minWidth: '100px', border: '1.5px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">By Name</option>
          <option value="role">By Role</option>
        </select>
        <input className="admin-filter-search" placeholder="🔍 Search users..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* User List */}
      <div>
        {filtered.map(user => (
          <UserCard key={user.id} user={user} onUpdateRole={handleUpdateRole} />
        ))}
        {filtered.length === 0 && (
          <div className="admin-panel">
            <div className="admin-empty">
              <div className="admin-empty-icon">👥</div>
              <div className="admin-empty-title">No users match</div>
              <div className="admin-empty-text">
                {users.length === 0
                  ? 'Users will appear here once they create accounts on the public site.'
                  : 'Try adjusting your filters or search criteria.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
