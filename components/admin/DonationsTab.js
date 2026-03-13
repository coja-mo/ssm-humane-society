'use client';
import { useState } from 'react';

function DonationDetail({ donation, onUpdate }) {
  const [noteText, setNoteText] = useState('');
  const addNote = () => {
    if (!noteText.trim()) return;
    const staffNotes = [...(donation.staffNotes || []), { id: `n-${Date.now()}`, text: noteText, author: 'Staff', createdAt: new Date().toISOString() }];
    onUpdate(donation.id, { staffNotes }); setNoteText('');
  };
  return (
    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>👤 Donor Information</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
            {[{ l: 'Name', v: donation.isAnonymous ? 'Anonymous' : donation.donorName }, { l: 'Email', v: !donation.isAnonymous && donation.donorEmail }, { l: 'Phone', v: !donation.isAnonymous && donation.donorPhone }, { l: 'Amount', v: `$${donation.amount}` }, { l: 'Type', v: donation.type }, { l: 'Category', v: donation.category }, { l: 'Payment', v: donation.paymentMethod }, { l: 'Date', v: donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : '—' }, { l: 'Dedicated To', v: donation.dedicatedTo }].filter(i => i.v).map(i => (
              <div key={i.l} style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--text-muted)', fontWeight: 500, minWidth: '80px' }}>{i.l}:</span><span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{i.v}</span></div>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>🧾 Tax Receipt</h4>
          <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
            {donation.taxReceiptNumber ? (<>
              <div style={{ fontSize: '0.85rem', marginBottom: '8px' }}><span style={{ color: 'var(--text-muted)' }}>Receipt #:</span> <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{donation.taxReceiptNumber}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: donation.receiptSent ? 'var(--green-500)' : 'var(--amber-500)' }} /><span style={{ fontSize: '0.82rem', fontWeight: 600, color: donation.receiptSent ? 'var(--green-600)' : '#B45309' }}>{donation.receiptSent ? 'Sent' : 'Pending'}</span></div>
              {!donation.receiptSent && <button onClick={() => onUpdate(donation.id, { receiptSent: true })} className="btn btn-sm btn-primary" style={{ borderRadius: '10px', padding: '6px 16px', fontSize: '0.78rem', marginTop: '10px' }}>📤 Send</button>}
            </>) : (<>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>No receipt generated</div>
              <button onClick={() => onUpdate(donation.id, { taxReceiptNumber: `TR-${Date.now().toString(36).toUpperCase()}` })} className="btn btn-sm btn-ghost" style={{ borderRadius: '10px', padding: '6px 16px', fontSize: '0.78rem' }}>🧾 Generate</button>
            </>)}
          </div>
          {donation.type === 'monthly' && <div style={{ padding: '12px 16px', background: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE', marginBottom: '12px' }}><div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1D4ED8' }}>🔄 Monthly Recurring</div></div>}
          {donation.dedicatedTo && <div style={{ padding: '12px 16px', background: '#F5F3FF', borderRadius: '10px', border: '1px solid #DDD6FE' }}><div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6D28D9' }}>🕊️ {donation.dedicatedTo}</div></div>}
        </div>
      </div>
      <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px' }}>📝 Notes</h4>
        {donation.notes && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>{donation.notes}</p>}
        {(donation.staffNotes || []).map(n => (
          <div key={n.id} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '8px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><strong style={{ fontSize: '0.82rem' }}>{n.author}</strong><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(n.createdAt).toLocaleString()}</span></div>{n.text}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input className="form-input" placeholder="Add a note..." value={noteText} onChange={e => setNoteText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem', borderRadius: '10px' }} />
          <button className="btn btn-sm btn-primary" onClick={addNote} style={{ borderRadius: '10px', padding: '8px 18px' }}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default function DonationsTab({ donations, loading, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({ donorName: '', donorEmail: '', donorPhone: '', amount: '', type: 'one-time', category: 'general', paymentMethod: 'online', isAnonymous: false, dedicatedTo: '', notes: '' });
  const handleSubmit = (e) => { e.preventDefault(); onAdd(form); setForm({ donorName: '', donorEmail: '', donorPhone: '', amount: '', type: 'one-time', category: 'general', paymentMethod: 'online', isAnonymous: false, dedicatedTo: '', notes: '' }); setShowAdd(false); };
  const totalAll = donations.reduce((s, d) => s + (d.amount || 0), 0);
  const monthlyRecurring = donations.filter(d => d.type === 'monthly').reduce((s, d) => s + (d.amount || 0), 0);
  const catIcon = (c) => ({ general: '💝', medical: '🏥', food: '🍖', shelter: '🏠', event: '🎉' }[c] || '💝');
  const filtered = donations.filter(d => { if (filter !== 'all' && d.category !== filter && d.type !== filter) return false; if (search) { const s = search.toLowerCase(); return (d.donorName || '').toLowerCase().includes(s) || (d.donorEmail || '').toLowerCase().includes(s); } return true; });
  const donorTotals = {}; donations.filter(d => !d.isAnonymous && d.donorName).forEach(d => { donorTotals[d.donorName] = (donorTotals[d.donorName] || 0) + (d.amount || 0); });
  const topDonors = Object.entries(donorTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Donations</h1><p className="admin-page-subtitle">{donations.length} donations · ${totalAll.toLocaleString()} raised</p></div>
        <div className="admin-page-actions"><button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }} onClick={() => setShowAdd(!showAdd)}>{showAdd ? '✕ Cancel' : '+ Record Donation'}</button></div>
      </div>
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[{ label: 'Total Raised', value: `$${totalAll.toLocaleString()}`, icon: '💰', accent: '#10B981', bg: '#ECFDF5' }, { label: 'Donations', value: donations.length, icon: '📊', accent: '#3B82F6', bg: '#EFF6FF' }, { label: 'Monthly', value: `$${monthlyRecurring.toLocaleString()}`, icon: '🔄', accent: '#8B5CF6', bg: '#F5F3FF' }, { label: 'Average', value: donations.length ? `$${Math.round(totalAll / donations.length)}` : '$0', icon: '📈', accent: '#F59E0B', bg: '#FFFBEB' }].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}><div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div><div className="admin-stat-value admin-counter">{s.value}</div><div className="admin-stat-label">{s.label}</div></div>
        ))}
      </div>
      {topDonors.length > 0 && (
        <div className="admin-panel" style={{ marginBottom: '20px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title"><span style={{ fontSize: '1.1rem' }}>🏆</span> Top Donors</div></div>
          <div className="admin-panel-body" style={{ padding: '12px 24px' }}>
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
              {topDonors.map(([name, total], i) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 18px', background: i === 0 ? '#FFFBEB' : 'var(--bg-secondary)', borderRadius: '12px', minWidth: '180px', border: i === 0 ? '1px solid #FDE68A' : '1px solid var(--border-light)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: i === 0 ? '#F59E0B' : i === 1 ? '#94A3B8' : '#CD7F32', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>#{i + 1}</div>
                  <div><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{name}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>${total.toLocaleString()}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="admin-filters">
        {['all', 'general', 'medical', 'food', 'shelter', 'event'].map(c => (<button key={c} className={`admin-filter-pill ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c.charAt(0).toUpperCase() + c.slice(1)}</button>))}
        <div className="admin-filter-divider" />
        {['all', 'one-time', 'monthly', 'in-kind'].map(t => (<button key={t} className={`admin-filter-pill ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t === 'all' ? 'All Types' : t.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</button>))}
        <input className="admin-filter-search" placeholder="🔍 Search donors..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title"><span>➕</span> Record Donation</div></div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Donor Name</label><input className="form-input" value={form.donorName} onChange={e => setForm({...form, donorName: e.target.value})} placeholder="Anonymous" /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.donorEmail} onChange={e => setForm({...form, donorEmail: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.donorPhone} onChange={e => setForm({...form, donorPhone: e.target.value})} /></div>
            </div>
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Amount ($) *</label><input className="form-input" type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Type</label><select className="form-input form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="one-time">One-time</option><option value="monthly">Monthly</option><option value="in-kind">In-kind</option></select></div>
              <div className="form-group"><label className="form-label">Category</label><select className="form-input form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option value="general">General</option><option value="medical">Medical</option><option value="food">Food</option><option value="shelter">Shelter</option><option value="event">Event</option></select></div>
            </div>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="form-group"><label className="form-label">Payment Method</label><select className="form-input form-select" value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})}><option value="online">Online</option><option value="cash">Cash</option><option value="cheque">Cheque</option><option value="e-transfer">E-Transfer</option><option value="in-kind">In-Kind</option></select></div>
              <div className="form-group"><label className="form-label">Dedicated To</label><input className="form-input" value={form.dedicatedTo} onChange={e => setForm({...form, dedicatedTo: e.target.value})} placeholder="In memory/honour of..." /></div>
            </div>
            <div className="form-group"><label className="form-label">Notes</label><textarea className="form-input" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{ minHeight: '60px' }} /></div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>Save Donation</button>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.88rem' }}><input type="checkbox" checked={form.isAnonymous} onChange={e => setForm({...form, isAnonymous: e.target.checked})} /> Anonymous</label>
            </div>
          </form>
        </div>
      )}
      <div className="admin-list">
        {filtered.map(d => (
          <div key={d.id} className="admin-panel" style={{ marginBottom: '8px' }}>
            <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--green-50)', color: 'var(--green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem' }}>${d.amount}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{d.isAnonymous ? 'Anonymous Donor' : d.donorName || 'Unknown'}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                  <span>{catIcon(d.category)} {d.category}</span><span>{d.paymentMethod}</span><span>{new Date(d.createdAt).toLocaleDateString()}</span>{d.dedicatedTo && <span>🕊️ {d.dedicatedTo}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                {d.taxReceiptNumber && <span className="admin-status admin-status-approved" style={{ fontSize: '0.7rem' }}>🧾 Receipt</span>}
                <span className={`admin-status ${d.type === 'monthly' ? 'admin-status-reviewing' : 'admin-status-approved'}`}>{d.type}</span>
                <button className="btn btn-sm btn-danger" onClick={e => { e.stopPropagation(); if (confirm('Delete?')) onDelete(d.id); }} style={{ borderRadius: '10px', padding: '5px 12px', fontSize: '0.78rem' }}>✕</button>
              </div>
            </div>
            {expandedId === d.id && <DonationDetail donation={d} onUpdate={onUpdate} />}
          </div>
        ))}
        {filtered.length === 0 && (<div className="admin-panel"><div className="admin-empty"><div className="admin-empty-icon">💰</div><div className="admin-empty-title">No donations recorded</div><div className="admin-empty-text">Click &ldquo;+ Record Donation&rdquo; to start tracking contributions.</div></div></div>)}
      </div>
    </>
  );
}
