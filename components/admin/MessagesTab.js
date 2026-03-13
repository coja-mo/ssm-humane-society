'use client';
import { useState, useEffect } from 'react';

const cannedReplies = [
  { label: 'Thank You', text: 'Thank you for reaching out to the Sault Ste. Marie Humane Society. We appreciate your message and will follow up shortly.' },
  { label: 'Adoption Info', text: 'Thank you for your interest in adoption! Please visit our Adopt page to see all available animals and submit an application. Our adoption team typically responds within 2-3 business days.' },
  { label: 'Volunteer Info', text: 'We\'d love to have you volunteer with us! Please visit our Volunteer page to learn about available opportunities and fill out an application.' },
  { label: 'Donation Thanks', text: 'Thank you so much for your generous support! Your contribution makes a real difference in the lives of animals in our care.' },
  { label: 'Hours & Location', text: 'We are located at 175 Old Garden River Rd, Sault Ste. Marie, ON. Our hours are Monday - Saturday 11am-4pm. Please call (705) 949-7007 for more information.' },
];

const tagColors = { urgent: '#EF4444', 'follow-up': '#F59E0B', adoption: '#10B981', volunteer: '#3B82F6', donation: '#8B5CF6', general: '#6B7280' };

export default function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);
  const [showCanned, setShowCanned] = useState(false);

  useEffect(() => {
    fetch('/api/contact').then(r => r.json())
      .then(data => { setMessages(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const unread = messages.filter(m => m.status === 'unread').length;
  const archived = messages.filter(m => m.status === 'archived').length;
  const starred = messages.filter(m => m.starred).length;
  const total = messages.length;

  const filtered = messages.filter(m => {
    if (filter === 'unread' && m.status !== 'unread') return false;
    if (filter === 'read' && m.status !== 'read') return false;
    if (filter === 'archived' && m.status !== 'archived') return false;
    if (filter === 'starred' && !m.starred) return false;
    if (filter !== 'all' && filter !== 'unread' && filter !== 'read' && filter !== 'archived' && filter !== 'starred' && m.tag !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (m.name || '').toLowerCase().includes(s) || (m.email || '').toLowerCase().includes(s) || (m.subject || '').toLowerCase().includes(s) || (m.message || '').toLowerCase().includes(s);
    }
    return true;
  });

  const selected = messages.find(m => m.id === selectedId);

  const updateMsg = (id, updates) => { setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m)); };
  const deleteMsg = (id) => { setMessages(prev => prev.filter(m => m.id !== id)); if (selectedId === id) setSelectedId(null); };

  function openMessage(msg) {
    setSelectedId(msg.id);
    if (msg.status === 'unread') updateMsg(msg.id, { status: 'read' });
    setReplyText(''); setReplySent(false); setShowCanned(false);
  }

  function handleReply() {
    if (!replyText.trim()) return;
    const replies = [...(selected.replies || []), { text: replyText, author: 'Staff', createdAt: new Date().toISOString() }];
    updateMsg(selected.id, { replies, status: 'read' });
    setReplySent(true);
    setTimeout(() => setReplySent(false), 3000);
    setReplyText('');
  }

  const timeAgo = (dateStr) => {
    if (!dateStr) return '—';
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
          <h1 className="admin-page-title">Messages</h1>
          <p className="admin-page-subtitle">{total} messages · {unread} unread</p>
        </div>
      </div>

      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Unread', val: unread, icon: '✉️', accent: '#F59E0B', bg: '#FFFBEB' },
          { label: 'Read', val: messages.filter(m => m.status === 'read').length, icon: '📖', accent: '#10B981', bg: '#ECFDF5' },
          { label: 'Starred', val: starred, icon: '⭐', accent: '#3B82F6', bg: '#EFF6FF' },
          { label: 'Archived', val: archived, icon: '📦', accent: '#8B5CF6', bg: '#F5F3FF' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}>
            <div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div>
            <div className="admin-stat-value admin-counter">{s.val}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-filters">
        {['all', 'unread', 'read', 'starred', 'archived'].map(f => (
          <button key={f} className={`admin-filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'starred' ? '⭐ Starred' : f === 'archived' ? '📦 Archived' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="admin-filter-divider" />
        {Object.keys(tagColors).map(t => (
          <button key={t} className={`admin-filter-pill ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}
            style={{ fontSize: '0.78rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: tagColors[t], display: 'inline-block', marginRight: '4px' }} />
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <input className="admin-filter-search" placeholder="🔍 Search messages..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.2fr' : '1fr', gap: '20px' }}>
        {/* Message List */}
        <div className="admin-list">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (<div key={i} className="admin-skeleton" style={{ height: '80px', borderRadius: '14px', marginBottom: '8px' }} />))
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
                borderLeft: msg.status === 'unread' ? '3px solid #F59E0B' : msg.starred ? '3px solid #3B82F6' : '3px solid transparent',
                background: selectedId === msg.id ? 'var(--blue-50)' : msg.status === 'unread' ? 'var(--bg-secondary)' : 'transparent',
              }}>
              <div className="admin-list-avatar" style={{
                background: msg.status === 'unread' ? '#FFFBEB' : msg.starred ? '#EFF6FF' : '#F1F5F9',
                color: msg.status === 'unread' ? '#F59E0B' : msg.starred ? '#3B82F6' : '#94A3B8',
                fontSize: '1.1rem', borderRadius: '14px',
              }}>
                {msg.status === 'unread' ? '✉️' : msg.starred ? '⭐' : '📖'}
              </div>
              <div className="admin-list-info">
                <div className="admin-list-name" style={{ fontWeight: msg.status === 'unread' ? 700 : 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {msg.name || 'Anonymous'}
                  {msg.tag && <span style={{ padding: '1px 8px', borderRadius: '6px', background: `${tagColors[msg.tag] || '#6B7280'}15`, color: tagColors[msg.tag] || '#6B7280', fontSize: '0.68rem', fontWeight: 700 }}>{msg.tag}</span>}
                  {(msg.replies || []).length > 0 && <span style={{ fontSize: '0.72rem', color: 'var(--green-600)', fontWeight: 600 }}>↩ replied</span>}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                  {msg.subject || 'No subject'}
                </div>
                <div className="admin-list-meta">
                  <span>📧 {msg.email}</span>
                  <span>{msg.createdAt ? timeAgo(msg.createdAt) : '—'}</span>
                </div>
              </div>
              <div className="admin-list-actions" style={{ flexDirection: 'column', gap: '4px' }}>
                <span className={`admin-status admin-status-${msg.status === 'unread' ? 'pending' : msg.status === 'archived' ? 'adopted' : 'completed'}`} style={{ fontSize: '0.72rem' }}>
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
              <div className="admin-panel-title"><span style={{ fontSize: '1.1rem' }}>✉️</span> Message Detail</div>
              <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)', padding: '4px' }}>✕</button>
            </div>
            <div className="admin-panel-body" style={{ padding: '20px 24px' }}>
              {/* Sender Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                  {(selected.name || '?')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selected.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selected.email}</div>
                  {selected.phone && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📞 {selected.phone}</div>}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                </div>
              </div>

              {/* Message Content */}
              <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px', color: 'var(--text-accent)' }}>{selected.subject}</div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{selected.message}</p>
              </div>

              {/* Previous Replies */}
              {(selected.replies || []).length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Replies</div>
                  {selected.replies.map((r, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: '#EFF6FF', borderRadius: '10px', marginBottom: '8px', borderLeft: '3px solid #3B82F6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.82rem', color: '#1D4ED8' }}>{r.author}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(r.createdAt).toLocaleString()}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{r.text}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button className="btn btn-sm btn-ghost" onClick={() => updateMsg(selected.id, { starred: !selected.starred })} style={{ borderRadius: '10px', padding: '6px 14px', fontSize: '0.78rem' }}>
                  {selected.starred ? '⭐ Unstar' : '☆ Star'}
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => updateMsg(selected.id, { status: selected.status === 'unread' ? 'read' : 'unread' })} style={{ borderRadius: '10px', padding: '6px 14px', fontSize: '0.78rem' }}>
                  {selected.status === 'unread' ? '📖 Mark Read' : '📩 Mark Unread'}
                </button>
                <button className="btn btn-sm btn-ghost" onClick={() => updateMsg(selected.id, { status: 'archived' })} style={{ borderRadius: '10px', padding: '6px 14px', fontSize: '0.78rem' }}>📦 Archive</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteMsg(selected.id)} style={{ borderRadius: '10px', padding: '6px 14px', fontSize: '0.78rem' }}>🗑 Delete</button>
              </div>

              {/* Tag selection */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Tag</div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {Object.entries(tagColors).map(([tag, color]) => (
                    <button key={tag} onClick={() => updateMsg(selected.id, { tag: selected.tag === tag ? null : tag })}
                      style={{ padding: '4px 12px', borderRadius: '8px', border: `1.5px solid ${selected.tag === tag ? color : 'var(--border-light)'}`, background: selected.tag === tag ? `${color}12` : 'transparent', color: selected.tag === tag ? color : 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Reply</div>
                  <button onClick={() => setShowCanned(!showCanned)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text-accent)', fontWeight: 600, fontFamily: 'inherit' }}>
                    {showCanned ? '✕ Close' : '⚡ Canned Replies'}
                  </button>
                </div>
                {showCanned && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {cannedReplies.map(cr => (
                      <button key={cr.label} onClick={() => { setReplyText(cr.text); setShowCanned(false); }}
                        style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {cr.label}
                      </button>
                    ))}
                  </div>
                )}
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
