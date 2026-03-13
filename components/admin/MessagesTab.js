'use client';
import { useState, useEffect } from 'react';

export default function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);

  useEffect(() => {
    fetch('/api/contact').then(r => r.json())
      .then(data => { setMessages(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const unread = messages.filter(m => m.status === 'unread').length;
  const total = messages.length;
  const filtered = filter === 'all' ? messages : messages.filter(m => m.status === filter);
  const selected = messages.find(m => m.id === selectedId);

  function markRead(id) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
  }

  function markUnread(id) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'unread' } : m));
  }

  function deleteMsg(id) {
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function openMessage(msg) {
    setSelectedId(msg.id);
    if (msg.status === 'unread') markRead(msg.id);
    setReplyText('');
    setReplySent(false);
  }

  function handleReply() {
    setReplySent(true);
    setTimeout(() => setReplySent(false), 3000);
    setReplyText('');
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contact Messages</h1>
          <p className="admin-page-subtitle">{total} messages · {unread} unread</p>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Unread', val: unread, icon: '✉️', accent: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Read', val: messages.filter(m => m.status === 'read').length, icon: '📖', accent: '#10B981', bg: '#ECFDF5' },
          { label: 'Total', val: total, icon: '📬', accent: '#3B82F6', bg: '#EFF6FF' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}>
            <div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div>
            <div className="admin-stat-value admin-counter">{s.val}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="admin-filters">
        {['all', 'unread', 'read'].map(f => (
          <button key={f} className={`admin-filter-pill ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Messages' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '20px' }}>
        {/* Message List */}
        <div className="admin-list">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="admin-skeleton" style={{ height: '80px', borderRadius: '14px', marginBottom: '8px' }} />
            ))
          ) : filtered.length === 0 ? (
            <div className="admin-panel"><div className="admin-empty">
              <div className="admin-empty-icon">📭</div>
              <div className="admin-empty-title">No messages</div>
              <div className="admin-empty-text">Contact form submissions will appear here.</div>
            </div></div>
          ) : filtered.map(msg => (
            <div key={msg.id} className="admin-list-item" onClick={() => openMessage(msg)}
              style={{
                cursor: 'pointer', transition: 'all 0.2s',
                borderLeft: msg.status === 'unread' ? '3px solid #F59E0B' : '3px solid transparent',
                background: selectedId === msg.id ? 'var(--blue-50)' : msg.status === 'unread' ? 'var(--bg-secondary)' : 'transparent',
              }}>
              <div className="admin-list-avatar" style={{
                background: msg.status === 'unread' ? '#FFFBEB' : '#F1F5F9',
                color: msg.status === 'unread' ? '#F59E0B' : '#94A3B8',
                fontSize: '1.1rem', borderRadius: '14px',
              }}>
                {msg.status === 'unread' ? '✉️' : '📖'}
              </div>
              <div className="admin-list-info">
                <div className="admin-list-name" style={{ fontWeight: msg.status === 'unread' ? 700 : 500 }}>
                  {msg.name || 'Anonymous'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {msg.subject || 'No subject'}
                </div>
                <div className="admin-list-meta">
                  <span>📧 {msg.email}</span>
                  <span>{msg.createdAt ? timeAgo(msg.createdAt) : '—'}</span>
                </div>
              </div>
              <div className="admin-list-actions" style={{ flexDirection: 'column', gap: '4px' }}>
                <span className={`admin-status admin-status-${msg.status === 'unread' ? 'pending' : 'completed'}`} style={{ fontSize: '0.72rem' }}>
                  {msg.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="admin-panel" style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
            <div className="admin-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="admin-panel-title">
                <span style={{ fontSize: '1.1rem' }}>✉️</span> Message Detail
              </div>
              <button onClick={() => setSelectedId(null)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1.2rem', color: 'var(--text-muted)', padding: '4px',
              }}>✕</button>
            </div>
            <div className="admin-panel-body" style={{ padding: '20px 24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{selected.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{selected.email}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                </div>
              </div>

              <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '8px', color: 'var(--text-accent)' }}>{selected.subject}</div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{selected.message}</p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button className="btn btn-sm btn-ghost" onClick={() => markUnread(selected.id)} style={{ borderRadius: '10px', padding: '6px 14px', fontSize: '0.78rem' }}>
                  📩 Mark Unread
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteMsg(selected.id)} style={{ borderRadius: '10px', padding: '6px 14px', fontSize: '0.78rem' }}>
                  🗑 Delete
                </button>
              </div>

              {/* Reply */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '8px' }}>Quick Reply</div>
                <textarea className="form-input form-textarea" value={replyText} onChange={e => setReplyText(e.target.value)}
                  placeholder={`Reply to ${selected.name}...`} style={{ minHeight: '80px', fontSize: '0.88rem', marginBottom: '10px' }} />
                <button className="btn btn-sm btn-primary" onClick={handleReply} disabled={!replyText.trim() || replySent}
                  style={{ borderRadius: '10px', padding: '6px 16px', fontSize: '0.82rem' }}>
                  {replySent ? '✓ Sent!' : '📤 Send Reply'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
