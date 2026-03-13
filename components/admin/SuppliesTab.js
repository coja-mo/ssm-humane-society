'use client';
import { useState } from 'react';

const catIcons = { food: '🍖', medical: '💊', cleaning: '🧹', bedding: '🛏️', toys: '🎾', office: '📎', equipment: '🔧', other: '📦' };
const catColors = { food: '#F59E0B', medical: '#EF4444', cleaning: '#06B6D4', bedding: '#8B5CF6', toys: '#EC4899', office: '#6B7280', equipment: '#3B82F6', other: '#10B981' };

function SupplyDetail({ supply, onUpdate }) {
  const [noteText, setNoteText] = useState('');
  const addNote = () => { if (!noteText.trim()) return; const notes = [...(supply.notes || []), { id: `n-${Date.now()}`, text: noteText, author: 'Staff', createdAt: new Date().toISOString() }]; onUpdate(supply.id, { notes }); setNoteText(''); };
  const history = supply.adjustmentHistory || [];
  return (
    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>📦 Supply Details</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
            {[{ l: 'Name', v: supply.name }, { l: 'Category', v: supply.category }, { l: 'Quantity', v: supply.quantity }, { l: 'Unit', v: supply.unit }, { l: 'Low Threshold', v: supply.lowStockThreshold }, { l: 'Unit Cost', v: supply.unitCost ? `$${supply.unitCost}` : null }, { l: 'Total Value', v: supply.unitCost ? `$${(supply.unitCost * supply.quantity).toFixed(2)}` : null }, { l: 'Supplier', v: supply.supplier }, { l: 'SKU', v: supply.sku }, { l: 'Location', v: supply.storageLocation }, { l: 'Last Ordered', v: supply.lastOrderDate ? new Date(supply.lastOrderDate).toLocaleDateString() : null }].filter(i => i.v != null).map(i => (
              <div key={i.l} style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--text-muted)', fontWeight: 500, minWidth: '100px' }}>{i.l}:</span><span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{i.v}</span></div>
            ))}
          </div>
          {/* Stock Level Visual */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}><span style={{ fontWeight: 600 }}>Stock Level</span><span style={{ fontWeight: 700, color: supply.quantity <= (supply.lowStockThreshold || 5) ? '#EF4444' : 'var(--green-600)' }}>{supply.quantity} {supply.unit || 'units'}</span></div>
            <div className="admin-progress" style={{ height: '10px' }}>
              <div className="admin-progress-fill" style={{ width: `${Math.min((supply.quantity / Math.max(supply.lowStockThreshold * 3 || 30, 1)) * 100, 100)}%`, background: supply.quantity <= (supply.lowStockThreshold || 5) ? 'linear-gradient(90deg, #EF4444, #F87171)' : 'linear-gradient(90deg, var(--green-400), var(--green-600))' }} />
            </div>
          </div>
          {/* Quick Adjust */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Quick Adjust:</span>
            {[-10, -5, -1, 1, 5, 10].map(adj => (
              <button key={adj} onClick={() => onUpdate(supply.id, { quantity: Math.max(0, supply.quantity + adj), adjustmentHistory: [...history, { amount: adj, date: new Date().toISOString(), by: 'Staff' }] })}
                style={{ padding: '4px 12px', borderRadius: '8px', border: `1.5px solid ${adj < 0 ? '#FECACA' : '#BBF7D0'}`, background: adj < 0 ? '#FEF2F2' : '#F0FDF4', color: adj < 0 ? '#EF4444' : '#16A34A', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                {adj > 0 ? '+' : ''}{adj}
              </button>
            ))}
          </div>
        </div>
        <div>
          {/* Adjustment History */}
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-accent)' }}>📊 Adjustment History</h4>
          {history.length > 0 ? (
            <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '8px 0' }}>
              {history.slice().reverse().slice(0, 15).map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', borderBottom: '1px solid var(--border-light)', fontSize: '0.82rem' }}>
                  <span style={{ fontWeight: 700, color: h.amount > 0 ? '#16A34A' : '#EF4444' }}>{h.amount > 0 ? '+' : ''}{h.amount}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{h.by || 'Staff'} · {new Date(h.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (<div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '16px', textAlign: 'center' }}>No adjustments recorded</div>)}
          {/* Supplier info */}
          {supply.supplier && (
            <div style={{ marginTop: '16px', padding: '14px', background: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1D4ED8' }}>🏪 {supply.supplier}</div>{supply.supplierContact && <div style={{ fontSize: '0.78rem', color: '#1E40AF' }}>{supply.supplierContact}</div>}</div>
                {supply.quantity <= (supply.lowStockThreshold || 5) && <button onClick={() => onUpdate(supply.id, { lastOrderDate: new Date().toISOString() })} className="btn btn-sm btn-primary" style={{ borderRadius: '10px', padding: '6px 16px', fontSize: '0.78rem' }}>📧 Reorder</button>}
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px' }}>📝 Notes</h4>
        {(supply.notes || []).map(n => (<div key={n.id} style={{ padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '8px', fontSize: '0.84rem' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><strong style={{ fontSize: '0.82rem' }}>{n.author}</strong><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(n.createdAt).toLocaleString()}</span></div>{n.text}</div>))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input className="form-input" placeholder="Add a note..." value={noteText} onChange={e => setNoteText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem', borderRadius: '10px' }} />
          <button className="btn btn-sm btn-primary" onClick={addNote} style={{ borderRadius: '10px', padding: '8px 18px' }}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default function SuppliesTab({ supplies, onAdd, onUpdate, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', category: 'food', quantity: '', unit: 'units', lowStockThreshold: '5', unitCost: '', supplier: '', supplierContact: '', sku: '', storageLocation: '' });
  const handleSubmit = (e) => { e.preventDefault(); onAdd({ ...form, quantity: Number(form.quantity), lowStockThreshold: Number(form.lowStockThreshold), unitCost: form.unitCost ? Number(form.unitCost) : null }); setForm({ name: '', category: 'food', quantity: '', unit: 'units', lowStockThreshold: '5', unitCost: '', supplier: '', supplierContact: '', sku: '', storageLocation: '' }); setShowAdd(false); };
  const lowStock = supplies.filter(s => s.quantity <= (s.lowStockThreshold || 5));
  const totalValue = supplies.reduce((s, i) => s + ((i.unitCost || 0) * (i.quantity || 0)), 0);
  const filtered = supplies.filter(s => { if (filter !== 'all' && filter === 'low-stock') return s.quantity <= (s.lowStockThreshold || 5); if (filter !== 'all' && filter !== 'low-stock' && s.category !== filter) return false; if (search) return (s.name || '').toLowerCase().includes(search.toLowerCase()); return true; });

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Supply Inventory</h1><p className="admin-page-subtitle">{supplies.length} items tracked · ${totalValue.toFixed(2)} total value</p></div>
        <div className="admin-page-actions"><button className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px', fontSize: '0.9rem' }} onClick={() => setShowAdd(!showAdd)}>{showAdd ? '✕ Cancel' : '+ Add Item'}</button></div>
      </div>
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[{ label: 'Total Items', val: supplies.length, icon: '📦', accent: '#3B82F6', bg: '#EFF6FF' }, { label: 'Low Stock', val: lowStock.length, icon: '⚠️', accent: '#EF4444', bg: '#FEF2F2' }, { label: 'Total Value', val: `$${totalValue.toFixed(0)}`, icon: '💰', accent: '#10B981', bg: '#ECFDF5' }, { label: 'Categories', val: new Set(supplies.map(s => s.category)).size, icon: '🏷️', accent: '#8B5CF6', bg: '#F5F3FF' }].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.accent, '--stat-bg': s.bg }}><div className="admin-stat-top"><div className="admin-stat-icon">{s.icon}</div></div><div className="admin-stat-value admin-counter">{s.val}</div><div className="admin-stat-label">{s.label}</div></div>
        ))}
      </div>
      {lowStock.length > 0 && (
        <div style={{ padding: '14px 20px', background: '#FEF2F2', borderRadius: '12px', border: '1px solid #FECACA', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
          <span>⚠️</span><strong style={{ color: '#B91C1C' }}>Low stock alert:</strong><span style={{ color: '#991B1B' }}>{lowStock.map(s => s.name).join(', ')}</span>
        </div>
      )}
      <div className="admin-filters">
        {['all', 'low-stock', 'food', 'medical', 'cleaning', 'bedding', 'toys', 'equipment'].map(c => (<button key={c} className={`admin-filter-pill ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c === 'all' ? 'All' : c === 'low-stock' ? '⚠️ Low Stock' : (catIcons[c] || '') + ' ' + c.charAt(0).toUpperCase() + c.slice(1)}</button>))}
        <input className="admin-filter-search" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {showAdd && (
        <div className="admin-panel" style={{ marginBottom: '24px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title"><span>➕</span> Add Supply Item</div></div>
          <form onSubmit={handleSubmit} className="admin-panel-body">
            <div className="admin-form-grid admin-form-grid-3">
              <div className="form-group"><label className="form-label">Name *</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Category</label><select className="form-input form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>{Object.keys(catIcons).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Supplier</label><input className="form-input" value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} /></div>
            </div>
            <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              <div className="form-group"><label className="form-label">Qty *</label><input className="form-input" type="number" required value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Unit</label><input className="form-input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Low Alert</label><input className="form-input" type="number" value={form.lowStockThreshold} onChange={e => setForm({...form, lowStockThreshold: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Unit Cost</label><input className="form-input" type="number" step="0.01" value={form.unitCost} onChange={e => setForm({...form, unitCost: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">SKU</label><input className="form-input" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} /></div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px' }}>Add Item</button>
          </form>
        </div>
      )}
      <div className="admin-list">
        {filtered.map(s => {
          const isLow = s.quantity <= (s.lowStockThreshold || 5);
          return (
            <div key={s.id} className="admin-panel" style={{ marginBottom: '8px', borderLeft: isLow ? '3px solid #EF4444' : 'none' }}>
              <div style={{ padding: '16px 24px', cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${catColors[s.category] || '#6B7280'}12`, color: catColors[s.category] || '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{catIcons[s.category] || '📦'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>{s.name}{isLow && <span style={{ padding: '2px 8px', borderRadius: '100px', background: '#FEF2F2', color: '#EF4444', fontSize: '0.7rem', fontWeight: 700 }}>LOW</span>}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                      <span>{catIcons[s.category]} {s.category}</span><span>📦 {s.quantity} {s.unit || 'units'}</span>{s.unitCost && <span>💰 ${(s.unitCost * s.quantity).toFixed(2)}</span>}{s.supplier && <span>🏪 {s.supplier}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                    <button className="btn btn-sm btn-danger" onClick={e => { e.stopPropagation(); if (confirm('Delete?')) onDelete(s.id); }} style={{ borderRadius: '10px', padding: '5px 12px', fontSize: '0.78rem' }}>✕</button>
                  </div>
                </div>
              </div>
              {expandedId === s.id && <SupplyDetail supply={s} onUpdate={onUpdate} />}
            </div>
          );
        })}
        {filtered.length === 0 && (<div className="admin-panel"><div className="admin-empty"><div className="admin-empty-icon">📦</div><div className="admin-empty-title">No supplies tracked</div><div className="admin-empty-text">Add supplies to manage your shelter inventory.</div></div></div>)}
      </div>
    </>
  );
}
