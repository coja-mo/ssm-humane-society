'use client';
import { useState } from 'react';

const priorityConfig = { low: { color: '#6B7280', bg: '#F9FAFB', label: 'Low' }, normal: { color: '#3B82F6', bg: '#EFF6FF', label: 'Normal' }, high: { color: '#F59E0B', bg: '#FFFBEB', label: 'High' }, urgent: { color: '#EF4444', bg: '#FEF2F2', label: 'Urgent' } };
const catIcons = { general: '📢', event: '📅', adoption: '🐾', closure: '🚪', maintenance: '🔧', policy: '📋', fundraising: '💰' };

export default function AnnouncementsTab({ announcements, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', content: '', category: 'general', priority: 'normal', scheduledDate: '', expiresAt: '', targetAudience: 'all', showOnSite: false, pinned: false });
  const resetForm = () => { setForm({ title: '', content: '', category: 'general', priority: 'normal', scheduledDate: '', expiresAt: '', targetAudience: 'all', showOnSite: false, pinned: false }); setEditId(null); setShowAdd(false); };
  const handleSubmit = (e) => { e.preventDefault(); if (editId) { onUpdate(editId, form); } else { onAdd(form); } resetForm(); };
  const startEdit = (a) => { setForm({ title: a.title, content: a.content || '', category: a.category || 'general', priority: a.priority || 'normal', scheduledDate: a.scheduledDate || '', expiresAt: a.expiresAt || '', targetAudience: a.targetAudience || 'all', showOnSite: a.showOnSite || false, pinned: a.pinned || false }); setEditId(a.id); setShowAdd(true); };
  const filtered = announcements.filter(a => { if (filter === 'published' && !a.published) return false; if (filter === 'draft' && a.published) return false; if (filter === 'pinned' && !a.pinned) return false; if (['general', 'event', 'adoption', 'closure'].includes(filter) && a.category !== filter) return false; if (search) { const s = search.toLowerCase(); return (a.title || '').toLowerCase().includes(s) || (a.content || '').toLowerCase().includes(s); } return true; });
  const published = announcements.filter(a => a.published).length;
  const pinned = announcements.filter(a => a.pinned).length;
  const scheduled = announcements.filter(a => a.scheduledDate && !a.published).length;

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Announcements</h1><p className="admin-page-subtitle">{announcements.length} announcements · {published} published</p></div>
        <div className="admin-page-actions"><button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }} onClick={() => { resetForm(); setShowAdd(!showAdd); }}>{showAdd ? '✕ Cancel' : '+ New Announcement'}</button></div>
      </div>
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[{ label: 'Published', val: published, icon: '📢', accent: '#10B981', bg: '#ECFDF5' }, { label: 'Drafts', val: announcements.length - published, icon: '📝', accent: '#F59E0B', bg: '#FFFBEB' }, { label: 'Pinned', val: pinned, icon: '📌', accent: '#3B82F6', bg: '#EFF6FF' }, { label: 'Scheduled', val: scheduled, icon: '⏱️', accent: '#8B5CF6', bg: '#F5F3FF' }].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}><div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div><div className="admin-stat-value admin-counter">{s.val}</div><div className="admin-stat-label">{s.label}</div></div>
        ))}
      </div>
      <div className="admin-filters">
        {['all', 'published', 'draft', 'pinned'].map(f => (<button key={f} className={`admin-filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>))}
        <div className="admin-filter-divider" />
        {['general', 'event', 'adoption', 'closure'].map(c => (<button key={c} className={`admin-filter-pill ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{(catIcons[c] || '') + ' ' + c.charAt(0).toUpperCase() + c.slice(1)}</button>))}
        <input className="admin-filter-search" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title"><span>{editId ? '✏️' : '➕'}</span> {editId ? 'Edit' : 'Create'} Announcement</div></div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Title *</label><input className="form-input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Category</label><select className="form-input form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>{Object.keys(catIcons).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div className="form-group"><label className="form-label">Content *</label><textarea className="form-input" required value={form.content} onChange={e => setForm({...form, content: e.target.value})} style={{ minHeight: '100px' }} /></div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Priority</label><select className="form-input form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
              <div className="form-group"><label className="form-label">Schedule Date</label><input className="form-input" type="date" value={form.scheduledDate} onChange={e => setForm({...form, scheduledDate: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Expires At</label><input className="form-input" type="date" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} /></div>
            </div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Target Audience</label><select className="form-input form-select" value={form.targetAudience} onChange={e => setForm({...form, targetAudience: e.target.value})}><option value="all">Everyone</option><option value="staff">Staff Only</option><option value="volunteers">Volunteers</option><option value="fosters">Foster Families</option></select></div>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', paddingTop: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}><input type="checkbox" checked={form.showOnSite} onChange={e => setForm({...form, showOnSite: e.target.checked})} /> Show on Website</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}><input type="checkbox" checked={form.pinned} onChange={e => setForm({...form, pinned: e.target.checked})} /> 📌 Pin</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>{editId ? 'Update' : 'Create'}</button>
              <button type="button" className="btn btn-ghost" onClick={resetForm} style={{ borderRadius: '12px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Preview panel for expanded announcement */}
      <div className="admin-list">
        {filtered.map(a => {
          const pc = priorityConfig[a.priority] || priorityConfig.normal;
          const isExpanded = expandedId === a.id;
          return (
            <div key={a.id} className={`admin-panel admin-announcement-card priority-${a.priority || 'normal'}`} style={{ marginBottom: '8px' }}>
              <div style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: pc.bg, color: pc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{catIcons[a.category] || '📢'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {a.pinned && <span>📌</span>}{a.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                      <span>{catIcons[a.category]} {a.category}</span>
                      <span style={{ color: pc.color, fontWeight: 600 }}>● {pc.label}</span>
                      {a.targetAudience && a.targetAudience !== 'all' && <span>👥 {a.targetAudience}</span>}
                      <span>📅 {new Date(a.createdAt).toLocaleDateString()}</span>
                      {a.scheduledDate && <span>⏱️ Scheduled: {a.scheduledDate}</span>}
                      {a.expiresAt && <span>⏳ Expires: {a.expiresAt}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                    <span className={`admin-status ${a.published ? 'admin-status-approved' : 'admin-status-submitted'}`}>{a.published ? 'Published' : 'Draft'}</span>
                    {!a.published && <button onClick={() => onUpdate(a.id, { published: true, publishedAt: new Date().toISOString() })} className="btn btn-sm btn-primary" style={{ borderRadius: '10px', padding: '5px 14px', fontSize: '0.78rem' }}>Publish</button>}
                    {a.published && <button onClick={() => onUpdate(a.id, { published: false })} className="btn btn-sm btn-ghost" style={{ borderRadius: '10px', padding: '5px 14px', fontSize: '0.78rem' }}>Unpublish</button>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginLeft: '56px' }}>
                  <button style={{ fontSize: '0.82rem', color: 'var(--text-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setExpandedId(isExpanded ? null : a.id)}>
                    <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: '0.2s', display: 'inline-block' }}>▶</span> {isExpanded ? 'Hide' : 'Preview'}
                  </button>
                  <button style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => startEdit(a)}>✏️ Edit</button>
                  <button style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => onUpdate(a.id, { pinned: !a.pinned })}>{a.pinned ? '📌 Unpin' : '📌 Pin'}</button>
                  <button style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { if (confirm('Delete?')) onDelete(a.id); }}>🗑️</button>
                </div>
              </div>
              {isExpanded && (
                <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-accent)' }}>📋 Content Preview</h4>
                  <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{a.content || 'No content'}</div>
                  {a.showOnSite && (
                    <div style={{ marginTop: '12px', padding: '12px 16px', background: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🌐</span><span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1D4ED8' }}>This announcement is displayed on the public website</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (<div className="admin-panel"><div className="admin-empty"><div className="admin-empty-icon">📢</div><div className="admin-empty-title">No announcements</div><div className="admin-empty-text">Create announcements to communicate with staff, volunteers, and the public.</div></div></div>)}
      </div>

      {/* Quick Templates */}
      <div className="admin-panel" style={{ marginTop: '20px' }}>
        <div className="admin-panel-header">
          <div className="admin-panel-title"><span style={{ fontSize: '1.1rem' }}>📋</span> Quick Templates</div>
        </div>
        <div className="admin-panel-body" style={{ padding: '16px 24px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {[
              { icon: '🚪', title: 'Holiday Closure', tpl: { title: 'Holiday Closure Notice', content: 'The shelter will be closed on [DATE] for [HOLIDAY]. We will reopen on [DATE] at 12:00 PM. For emergencies, please call [PHONE].', category: 'closure', priority: 'high' } },
              { icon: '🎉', title: 'Adoption Event', tpl: { title: 'Adoption Event: [EVENT NAME]', content: 'Join us on [DATE] for our [EVENT NAME]! Reduced adoption fees, meet adorable pets, and enjoy family-friendly activities.', category: 'event', priority: 'normal' } },
              { icon: '🐾', title: 'New Pet Alert', tpl: { title: 'New Arrivals Available!', content: 'We have [NUMBER] new [TYPE] available for adoption! Visit our gallery to meet them or schedule a visit.', category: 'adoption', priority: 'normal' } },
              { icon: '📋', title: 'Policy Update', tpl: { title: 'Updated Adoption Policy', content: 'Please note the following changes to our adoption policy effective [DATE]:\n\n1. [CHANGE 1]\n2. [CHANGE 2]\n\nContact us with any questions.', category: 'policy', priority: 'normal' } },
            ].map((t, i) => (
              <button key={i}
                className="btn"
                onClick={() => { setForm({ ...form, ...t.tpl, scheduledDate: '', expiresAt: '', targetAudience: 'all', showOnSite: false, pinned: false }); setShowAdd(true); }}
                style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                  padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'left',
                  fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
                }}>
                <span style={{ fontSize: '1.3rem', display: 'block', marginBottom: '6px' }}>{t.icon}</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
