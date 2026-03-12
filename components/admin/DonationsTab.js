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

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>💰 Donations ({donations.length})</h1>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancel' : '+ Record Donation'}
        </button>
      </div>

      {/* Summary cards */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Total Raised', value: `$${totalAll.toLocaleString()}`, color: 'var(--green-500)', icon: '💰' },
          { label: 'Total Donations', value: donations.length, color: 'var(--blue-500)', icon: '📊' },
          { label: 'Monthly Recurring', value: `$${donations.filter(d => d.type === 'monthly').reduce((s, d) => s + (d.amount || 0), 0).toLocaleString()}`, color: '#8B5CF6', icon: '🔄' },
          { label: 'Avg Donation', value: donations.length ? `$${Math.round(totalAll / donations.length)}` : '$0', color: '#F59E0B', icon: '📈' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="stat-card-value" style={{ color: s.color, fontSize: '1.5rem' }}>{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
              <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        {categories.map(c => (
          <button key={c} className={`btn btn-sm ${filter === c ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(c)} style={{ textTransform: 'capitalize' }}>{c}</button>
        ))}
        <span style={{ color: 'var(--text-muted)' }}>|</span>
        {types.map(t => (
          <button key={t} className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(t)} style={{ textTransform: 'capitalize' }}>{t.replace(/-/g, ' ')}</button>
        ))}
        <input className="form-input" placeholder="Search donors..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '180px', padding: '8px 16px', fontSize: '0.9rem' }} />
      </div>

      {/* Add Form */}
      {showAdd && (
        <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>➕ Record Donation</h3>
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Donor Name</label>
              <input className="form-input" value={form.donorName} onChange={e => setForm({...form, donorName: e.target.value})} placeholder="Anonymous" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.donorEmail} onChange={e => setForm({...form, donorEmail: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.donorPhone} onChange={e => setForm({...form, donorPhone: e.target.value})} />
            </div>
          </div>
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Amount ($) *</label>
              <input className="form-input" type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="one-time">One-time</option><option value="monthly">Monthly</option><option value="in-kind">In-kind</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="general">General</option><option value="medical">Medical</option>
                <option value="food">Food</option><option value="shelter">Shelter</option><option value="event">Event</option>
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select className="form-input form-select" value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}>
                <option value="online">Online</option><option value="cash">Cash</option>
                <option value="cheque">Cheque</option><option value="e-transfer">E-Transfer</option><option value="in-kind">In-Kind</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dedicated To</label>
              <input className="form-input" value={form.dedicatedTo} onChange={e => setForm({...form, dedicatedTo: e.target.value})} placeholder="In memory/honour of..." />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-input" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{ minHeight: '60px' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary">Save Donation</button>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={form.isAnonymous} onChange={e => setForm({...form, isAnonymous: e.target.checked})} />
              Anonymous
            </label>
          </div>
        </form>
      )}

      {/* Donation List */}
      <div style={{ display: 'grid', gap: '8px' }}>
        {filtered.map(d => (
          <div key={d.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--green-700)', fontSize: '0.85rem' }}>
                ${d.amount}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{d.isAnonymous ? 'Anonymous' : d.donorName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {d.category} · {d.type} · {d.paymentMethod} · {new Date(d.createdAt).toLocaleDateString()}
                  {d.dedicatedTo && ` · 🕊️ ${d.dedicatedTo}`}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {d.taxReceiptNumber && <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>🧾 Receipt</span>}
              <span className={`badge ${d.type === 'monthly' ? 'badge-blue' : 'badge-green'}`}>{d.type}</span>
              {!d.receiptSent && d.taxReceiptNumber && (
                <button className="btn btn-sm btn-ghost" onClick={() => onUpdate(d.id, { receiptSent: true })}>
                  Send Receipt
                </button>
              )}
              <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete?')) onDelete(d.id); }} style={{ padding: '4px 8px' }}>✕</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💰</div>
            <p style={{ color: 'var(--text-muted)' }}>No donations recorded yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
