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

  const priorityColors = { low: 'var(--text-muted)', normal: 'var(--blue-500)', high: '#F59E0B', urgent: 'var(--rose-500)' };
  const categoryIcons = { general: '📢', urgent: '🚨', event: '📅', adoption: '🐾', fundraiser: '💰' };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>📢 Announcements ({announcements.length})</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowAdd(!showAdd); }}>
          {showAdd ? '✕ Cancel' : '+ New Announcement'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>{editId ? '✏️ Edit' : '➕ New'} Announcement</h3>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Content *</label>
            <textarea className="form-input form-textarea" required value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          </div>
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="general">General</option><option value="urgent">Urgent</option>
                <option value="event">Event</option><option value="adoption">Adoption</option><option value="fundraiser">Fundraiser</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-input form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option value="low">Low</option><option value="normal">Normal</option>
                <option value="high">High</option><option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input className="form-input" type="date" value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
            <label style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} /> Published
            </label>
            <label style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isPinned} onChange={e => setForm({...form, isPinned: e.target.checked})} /> Pinned
            </label>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Publish'}</button>
            <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {announcements.map(a => (
          <div key={a.id} className="card" style={{ padding: '20px', borderLeft: `4px solid ${priorityColors[a.priority] || priorityColors.normal}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span>{categoryIcons[a.category] || '📢'}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{a.title}</span>
                  {a.isPinned && <span className="badge badge-blue">📌 Pinned</span>}
                  {!a.isPublished && <span className="badge badge-rose">Draft</span>}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.6 }}>{a.content}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  By {a.author} · {new Date(a.createdAt).toLocaleDateString()}
                  {a.expiryDate && ` · Expires: ${a.expiryDate}`}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button className="btn btn-sm btn-ghost" onClick={() => onUpdate(a.id, { isPublished: !a.isPublished })}>
                  {a.isPublished ? '📴 Unpublish' : '📲 Publish'}
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => startEdit(a)}>✏️</button>
                <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete?')) onDelete(a.id); }} style={{ padding: '4px 8px' }}>✕</button>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📢</div>
            <p style={{ color: 'var(--text-muted)' }}>No announcements yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
