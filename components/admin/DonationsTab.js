'use client';
import { useState } from 'react';

export default function DonationsTab({ donations, loading, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    donorName: '', donorEmail: '', donorPhone: '', amount: '', type: 'one-time',
    category: 'general', paymentMethod: 'online', isAnonymous: false, dedicatedTo: '', notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ donorName: '', donorEmail: '', donorPhone: '', amount: '', type: 'one-time',
      category: 'general', paymentMethod: 'online', isAnonymous: false, dedicatedTo: '', notes: '' });
    setShowAdd(false);
  };

  const totalAll = donations.reduce((s, d) => s + (d.amount || 0), 0);
  const monthlyRecurring = donations.filter(d => d.type === 'monthly').reduce((s, d) => s + (d.amount || 0), 0);
  const categories = ['all', 'general', 'medical', 'food', 'shelter', 'event'];
  const types = ['all', 'one-time', 'monthly', 'in-kind'];

  const filtered = donations.filter(d => {
    if (filter !== 'all' && d.category !== filter && d.type !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (d.donorName || '').toLowerCase().includes(s) || (d.donorEmail || '').toLowerCase().includes(s);
    }
    return true;
  });

  const categoryIcon = (c) => {
    const icons = { general: '💝', medical: '🏥', food: '🍖', shelter: '🏠', event: '🎉' };
    return icons[c] || '💝';
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Donations</h1>
          <p className="admin-page-subtitle">{donations.length} donations tracked · ${totalAll.toLocaleString()} total raised</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }}
            onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? '✕ Cancel' : '+ Record Donation'}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Total Raised', value: `$${totalAll.toLocaleString()}`, icon: '💰', accent: '#10B981', bg: '#ECFDF5' },
          { label: 'Total Donations', value: donations.length, icon: '📊', accent: '#3B82F6', bg: '#EFF6FF' },
          { label: 'Monthly Recurring', value: `$${monthlyRecurring.toLocaleString()}`, icon: '🔄', accent: '#8B5CF6', bg: '#F5F3FF' },
          { label: 'Avg Donation', value: donations.length ? `$${Math.round(totalAll / donations.length)}` : '$0', icon: '📈', accent: '#F59E0B', bg: '#FFFBEB' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}>
            <div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div>
            <div className="admin-stat-value admin-counter">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="admin-filters">
        {categories.map(c => (
          <button key={c} className={`admin-filter-pill ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
        <div className="admin-filter-divider" />
        {types.map(t => (
          <button key={t} className={`admin-filter-pill ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
            {t === 'all' ? 'All Types' : t.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
        <input className="admin-filter-search" placeholder="🔍 Search donors..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header">
            <div className="admin-panel-title"><span>➕</span> Record Donation</div>
          </div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Donor Name</label>
                <input className="form-input" value={form.donorName} onChange={e => setForm({...form, donorName: e.target.value})} placeholder="Anonymous" /></div>
              <div className="form-group"><label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.donorEmail} onChange={e => setForm({...form, donorEmail: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Phone</label>
                <input className="form-input" value={form.donorPhone} onChange={e => setForm({...form, donorPhone: e.target.value})} /></div>
            </div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Amount ($) *</label>
                <input className="form-input" type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Type</label>
                <select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="one-time">One-time</option><option value="monthly">Monthly</option><option value="in-kind">In-kind</option>
                </select></div>
              <div className="form-group"><label className="form-label">Category</label>
                <select className="form-input form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="general">General</option><option value="medical">Medical</option>
                  <option value="food">Food</option><option value="shelter">Shelter</option><option value="event">Event</option>
                </select></div>
            </div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Payment Method</label>
                <select className="form-input form-select" value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}>
                  <option value="online">Online</option><option value="cash">Cash</option>
                  <option value="cheque">Cheque</option><option value="e-transfer">E-Transfer</option><option value="in-kind">In-Kind</option>
                </select></div>
              <div className="form-group"><label className="form-label">Dedicated To</label>
                <input className="form-input" value={form.dedicatedTo} onChange={e => setForm({...form, dedicatedTo: e.target.value})} placeholder="In memory/honour of..." /></div>
            </div>
            <div className="form-group"><label className="form-label">Notes</label>
              <textarea className="form-input" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{ minHeight: '60px' }} /></div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>Save Donation</button>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.88rem' }}>
                <input type="checkbox" checked={form.isAnonymous} onChange={e => setForm({...form, isAnonymous: e.target.checked})} /> Anonymous
              </label>
            </div>
          </form>
        </div>
      )}

      {/* Donation List */}
      <div className="admin-list">
        {filtered.map(d => (
          <div key={d.id} className="admin-list-item">
            <div className="admin-list-avatar" style={{
              background: 'var(--green-50)', color: 'var(--green-700)',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.8rem', borderRadius: '12px',
            }}>
              ${d.amount}
            </div>
            <div className="admin-list-info">
              <div className="admin-list-name">{d.isAnonymous ? 'Anonymous Donor' : d.donorName || 'Unknown'}</div>
              <div className="admin-list-meta">
                <span>{categoryIcon(d.category)} {d.category}</span>
                <span>{d.paymentMethod}</span>
                <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                {d.dedicatedTo && <span>🕊️ {d.dedicatedTo}</span>}
              </div>
            </div>
            <div className="admin-list-actions">
              {d.taxReceiptNumber && <span className="admin-status admin-status-approved" style={{ fontSize: '0.7rem' }}>🧾 Receipt</span>}
              <span className={`admin-status ${d.type === 'monthly' ? 'admin-status-reviewing' : 'admin-status-approved'}`}>{d.type}</span>
              {!d.receiptSent && d.taxReceiptNumber && (
                <button className="btn btn-sm btn-ghost" onClick={() => onUpdate(d.id, { receiptSent: true })}
                  style={{ borderRadius: '10px', padding: '5px 12px', fontSize: '0.78rem' }}>Send Receipt</button>
              )}
              <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete?')) onDelete(d.id); }}
                style={{ borderRadius: '10px', padding: '5px 12px', fontSize: '0.78rem' }}>✕</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="admin-panel"><div className="admin-empty">
            <div className="admin-empty-icon">💰</div>
            <div className="admin-empty-title">No donations recorded</div>
            <div className="admin-empty-text">Click &ldquo;+ Record Donation&rdquo; to start tracking contributions.</div>
          </div></div>
        )}
      </div>
    </>
  );
}
