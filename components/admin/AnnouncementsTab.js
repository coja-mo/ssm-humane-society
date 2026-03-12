'use client';
import { useState } from 'react';

export default function AnnouncementsTab({ announcements, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: '', content: '', category: 'general', priority: 'normal',
    isPublished: true, isPinned: false, expiryDate: '',
  });

  const resetForm = () => {
    setForm({ title: '', content: '', category: 'general', priority: 'normal', isPublished: true, isPinned: false, expiryDate: '' });
    setEditId(null); setShowAdd(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) { onUpdate(editId, form); } else { onAdd(form); }
    resetForm();
  };

  const startEdit = (a) => {
    setForm({ title: a.title, content: a.content || '', category: a.category || 'general',
      priority: a.priority || 'normal', isPublished: a.isPublished !== false,
      isPinned: a.isPinned || false, expiryDate: a.expiryDate || '' });
    setEditId(a.id); setShowAdd(true);
  };

  const priorityConfig = {
    low: { color: 'var(--text-muted)', label: 'Low' },
    normal: { color: '#3B82F6', label: 'Normal' },
    high: { color: '#F59E0B', label: 'High' },
    urgent: { color: '#EF4444', label: 'Urgent' },
  };
  const categoryIcons = { general: '📢', urgent: '🚨', event: '📅', adoption: '🐾', fundraiser: '💰' };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Announcements</h1>
          <p className="admin-page-subtitle">{announcements.length} announcements · {announcements.filter(a => a.isPublished).length} published</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }}
            onClick={() => { resetForm(); setShowAdd(!showAdd); }}>
            {showAdd ? '✕ Cancel' : '+ New Announcement'}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header">
            <div className="admin-panel-title"><span>{editId ? '✏️' : '➕'}</span> {editId ? 'Edit' : 'New'} Announcement</div>
          </div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="form-group"><label className="form-label">Title *</label>
              <input className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Content *</label>
              <textarea className="form-input form-textarea" required value={form.content} onChange={e => setForm({...form, content: e.target.value})} /></div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Category</label>
                <select className="form-input form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="general">General</option><option value="urgent">Urgent</option>
                  <option value="event">Event</option><option value="adoption">Adoption</option><option value="fundraiser">Fundraiser</option>
                </select></div>
              <div className="form-group"><label className="form-label">Priority</label>
                <select className="form-input form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option value="low">Low</option><option value="normal">Normal</option>
                  <option value="high">High</option><option value="urgent">Urgent</option>
                </select></div>
              <div className="form-group"><label className="form-label">Expiry Date</label>
                <input className="form-input" type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} /></div>
            </div>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
              <label style={{ display: 'flex', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} /> Published</label>
              <label style={{ display: 'flex', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={form.isPinned} onChange={e => setForm({...form, isPinned: e.target.checked})} /> Pinned</label>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>{editId ? 'Update' : 'Publish'}</button>
              <button type="button" className="btn btn-ghost" onClick={resetForm} style={{ borderRadius: '12px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-list">
        {announcements.map(a => {
          const pc = priorityConfig[a.priority] || priorityConfig.normal;
          return (
            <div key={a.id} className={`admin-panel admin-announcement-card priority-${a.priority || 'normal'}`} style={{ marginBottom: '8px' }}>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.1rem' }}>{categoryIcons[a.category] || '📢'}</span>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'var(--font-display)' }}>{a.title}</span>
                      {a.isPinned && <span className="admin-status admin-status-reviewing" style={{ fontSize: '0.7rem' }}>📌 Pinned</span>}
                      {!a.isPublished && <span className="admin-status" style={{ background: '#FFE4E6', color: 'var(--rose-600)', fontSize: '0.7rem' }}>Draft</span>}
                      <span className="admin-status" style={{ background: `${pc.color}12`, color: pc.color, fontSize: '0.7rem' }}>
                        {pc.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '10px' }}>{a.content}</p>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                      <span>By {a.author}</span>
                      <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                      {a.expiryDate && <span>Expires: {a.expiryDate}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => onUpdate(a.id, { isPublished: !a.isPublished })}
                      style={{ borderRadius: '10px', padding: '5px 14px', fontSize: '0.78rem' }}>
                      {a.isPublished ? '📴 Unpublish' : '📲 Publish'}
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={() => startEdit(a)}
                      style={{ borderRadius: '10px', padding: '5px 12px', fontSize: '0.78rem' }}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete?')) onDelete(a.id); }}
                      style={{ borderRadius: '10px', padding: '5px 12px', fontSize: '0.78rem' }}>✕</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {announcements.length === 0 && (
          <div className="admin-panel"><div className="admin-empty">
            <div className="admin-empty-icon">📢</div>
            <div className="admin-empty-title">No announcements yet</div>
            <div className="admin-empty-text">Create your first announcement to keep your team informed.</div>
          </div></div>
        )}
      </div>
    </>
  );
}
