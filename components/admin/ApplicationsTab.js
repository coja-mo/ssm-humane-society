'use client';
import { useState } from 'react';

export default function ApplicationsTab({ apps, onUpdateStatus, onAddNote, onDeleteApp }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [noteText, setNoteText] = useState('');

  const statuses = ['all', 'submitted', 'reviewing', 'approved', 'visit-scheduled', 'adopted', 'rejected'];
  const statusColors = {
    submitted: '#F59E0B', reviewing: '#3B82F6', approved: '#10B981',
    'visit-scheduled': '#8B5CF6', adopted: '#EC4899', rejected: '#EF4444',
  };

  const filtered = apps.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (a.firstName || '').toLowerCase().includes(s) ||
        (a.lastName || '').toLowerCase().includes(s) ||
        (a.email || '').toLowerCase().includes(s) ||
        (a.petInterest || '').toLowerCase().includes(s);
    }
    return true;
  });

  const handleAddNote = (appId) => {
    if (!noteText.trim()) return;
    onAddNote(appId, { text: noteText });
    setNoteText('');
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Applications</h1>
          <p className="admin-page-subtitle">{apps.length} total applications · {apps.filter(a => a.status === 'submitted').length} awaiting review</p>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="admin-pipeline" style={{ marginBottom: '20px' }}>
        {['submitted', 'reviewing', 'approved', 'visit-scheduled', 'adopted'].map(s => (
          <button key={s} className={`admin-pipeline-step ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(filter === s ? 'all' : s)}>
            <span className="admin-pipeline-count">{apps.filter(a => a.status === s).length}</span>
            <span className="admin-pipeline-label">{s.replace(/-/g, ' ')}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="admin-filters">
        {statuses.map(s => (
          <button key={s} className={`admin-filter-pill ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            {s !== 'all' && ` (${apps.filter(a => a.status === s).length})`}
          </button>
        ))}
        <input className="admin-filter-search" placeholder="🔍 Search applicants..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Application List */}
      <div className="admin-list">
        {filtered.length === 0 ? (
          <div className="admin-panel">
            <div className="admin-empty">
              <div className="admin-empty-icon">📝</div>
              <div className="admin-empty-title">No applications match</div>
              <div className="admin-empty-text">Try adjusting your filters or search criteria.</div>
            </div>
          </div>
        ) : filtered.map(app => (
          <div key={app.id} className="admin-panel" style={{ marginBottom: '8px' }}>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '12px',
                      background: `${statusColors[app.status]}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', flexShrink: 0,
                    }}>📋</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{app.firstName} {app.lastName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                        <span>📧 {app.email}</span>
                        {app.phone && <span>📞 {app.phone}</span>}
                        <span>📅 {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '54px' }}>
                    Pet Interest: <strong>{app.petInterest || app.type || 'Any'}</strong>
                    {app.housing && <> · Housing: {app.housing} ({app.ownRent})</>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className={`admin-status admin-status-${app.status}`}>
                    {app.status?.replace(/-/g, ' ')}
                  </span>
                  {['reviewing', 'approved', 'visit-scheduled', 'adopted'].map(s => (
                    <button key={s} className={`btn btn-sm ${app.status === s ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => onUpdateStatus(app.id, s)}
                      style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '8px' }}>
                      {s.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expand Toggle */}
              <button style={{
                marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-accent)',
                background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '54px',
              }} onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                <span style={{ transform: expandedId === app.id ? 'rotate(90deg)' : 'none', transition: '0.2s', display: 'inline-block' }}>▶</span>
                {expandedId === app.id ? 'Hide Details' : 'Show Details & Notes'}
              </button>
            </div>

            {/* Expanded Details */}
            <div className={`admin-detail-drawer ${expandedId === app.id ? 'open' : ''}`}>
              <div className="admin-form-grid admin-form-grid-2" style={{ gap: '12px', marginBottom: '16px', fontSize: '0.88rem' }}>
                {app.housing && <div><strong>Housing:</strong> {app.housing}</div>}
                {app.ownRent && <div><strong>Own/Rent:</strong> {app.ownRent}</div>}
                {app.yard && <div><strong>Yard:</strong> {app.yard}</div>}
                {app.otherPets && <div><strong>Other Pets:</strong> {app.otherPets}</div>}
                {app.children && <div><strong>Children:</strong> {app.children}</div>}
                {app.experience && <div><strong>Experience:</strong> {app.experience}</div>}
                {app.vetInfo && <div><strong>Vet Info:</strong> {app.vetInfo}</div>}
                {app.workSchedule && <div><strong>Work Schedule:</strong> {app.workSchedule}</div>}
              </div>
              {app.message && (
                <div style={{
                  background: 'var(--bg-secondary)', padding: '14px 16px',
                  borderRadius: '12px', marginBottom: '16px', fontSize: '0.88rem',
                  lineHeight: 1.6, borderLeft: '3px solid var(--blue-400)',
                }}>
                  <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Message from applicant:</strong>
                  {app.message}
                </div>
              )}

              {/* Notes Section */}
              <div>
                <h4 style={{ fontSize: '0.88rem', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>📝 Staff Notes ({(app.notes || []).length})</h4>
                {(app.notes || []).map(note => (
                  <div key={note.id} style={{
                    padding: '12px 14px', background: 'var(--bg-secondary)',
                    borderRadius: '10px', marginBottom: '8px', fontSize: '0.85rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.82rem' }}>{note.author}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    {note.text}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input className="form-input" placeholder="Add a note..." value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem', borderRadius: '10px' }} />
                  <button className="btn btn-sm btn-primary" onClick={() => handleAddNote(app.id)}
                    style={{ borderRadius: '10px', padding: '8px 18px' }}>Add</button>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete application?')) onDeleteApp(app.id); }}
                  style={{ borderRadius: '10px', padding: '6px 16px', fontSize: '0.82rem' }}>
                  Delete Application
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
