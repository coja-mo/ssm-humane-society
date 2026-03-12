'use client';
import { useState } from 'react';

export default function ApplicationsTab({ apps, onUpdateStatus, onAddNote, onDeleteApp }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [noteText, setNoteText] = useState('');

  const statuses = ['all', 'submitted', 'reviewing', 'approved', 'visit-scheduled', 'adopted', 'rejected'];
  const statusColors = {
    submitted: '#F59E0B', reviewing: 'var(--blue-500)', approved: 'var(--green-500)',
    'visit-scheduled': '#8B5CF6', adopted: '#EC4899', rejected: 'var(--rose-500)',
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
      <h1 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Applications ({apps.length})</h1>

      {/* Status filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        {statuses.map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>
            {s.replace(/-/g, ' ')} {s !== 'all' && `(${apps.filter(a => a.status === s).length})`}
          </button>
        ))}
        <input className="form-input" placeholder="Search applicants..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px', padding: '8px 16px', fontSize: '0.9rem' }} />
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
            <p style={{ color: 'var(--text-muted)' }}>No applications match your filters.</p>
          </div>
        ) : filtered.map(app => (
          <div key={app.id} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{app.firstName} {app.lastName}</div>
                  <span className="badge" style={{
                    background: `${statusColors[app.status]}20`,
                    color: statusColors[app.status], textTransform: 'capitalize'
                  }}>{app.status?.replace(/-/g, ' ')}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span>📧 {app.email}</span>
                  {app.phone && <span>📞 {app.phone}</span>}
                  <span>📅 {new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Pet Interest: <strong>{app.petInterest || app.type || 'Any'}</strong>
                  {app.housing && <> · Housing: {app.housing} ({app.ownRent})</>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['submitted', 'reviewing', 'approved', 'visit-scheduled', 'adopted', 'rejected'].map(s => (
                  <button key={s} className={`btn btn-sm ${app.status === s ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => onUpdateStatus(app.id, s)} style={{ fontSize: '0.78rem', padding: '5px 10px' }}>
                    {s.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Expand/Collapse */}
            <button style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-accent)', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
              {expandedId === app.id ? '▼ Hide Details' : '▶ Show Details & Notes'}
            </button>

            {expandedId === app.id && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                {/* Full details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
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
                  <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                    <strong>Message:</strong> {app.message}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>📝 Staff Notes ({(app.notes || []).length})</h4>
                  {(app.notes || []).map(note => (
                    <div key={note.id} style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '8px', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong>{note.author}</strong>
                        <span style={{ color: 'var(--text-muted)' }}>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      {note.text}
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input className="form-input" placeholder="Add a note..." value={noteText}
                      onChange={e => setNoteText(e.target.value)} style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }} />
                    <button className="btn btn-sm btn-primary" onClick={() => handleAddNote(app.id)}>Add Note</button>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                  <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete application?')) onDeleteApp(app.id); }}>Delete Application</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
