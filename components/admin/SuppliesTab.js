'use client';
import { useState } from 'react';

const CATEGORIES = ['food', 'medical', 'cleaning', 'toys', 'bedding', 'equipment', 'other'];
const UNITS = ['units', 'lbs', 'oz', 'bags', 'boxes', 'cases', 'bottles', 'rolls'];
const CAT_EMOJI = { food: '🍖', medical: '💊', cleaning: '🧹', toys: '🧸', bedding: '🛏️', equipment: '🔧', other: '📦' };

export default function SuppliesTab({ supplies = [], onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    name: '', category: 'food', quantity: '', unit: 'units',
    minQuantity: 5, cost: '', supplier: '', location: 'Main Storage', notes: '',
  });

  const filtered = filter === 'all' ? supplies : filter === 'low' ? supplies.filter(s => s.status === 'low') : supplies.filter(s => s.category === filter);
  const lowStock = supplies.filter(s => s.status === 'low').length;
  const totalValue = supplies.reduce((sum, s) => sum + (s.cost || 0) * (s.quantity || 0), 0);
  const totalItems = supplies.reduce((sum, s) => sum + (s.quantity || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd({ ...form, quantity: parseInt(form.quantity) || 0, cost: parseFloat(form.cost) || 0, minQuantity: parseInt(form.minQuantity) || 5 });
    setForm({ name: '', category: 'food', quantity: '', unit: 'units', minQuantity: 5, cost: '', supplier: '', location: 'Main Storage', notes: '' });
    setShowForm(false);
  };

  const adjustQty = async (item, delta) => {
    const newQty = Math.max(0, (item.quantity || 0) + delta);
    await onUpdate(item.id, { quantity: newQty });
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Supply Inventory</h1>
          <p className="admin-page-subtitle">{supplies.length} items — {lowStock > 0 ? `⚠️ ${lowStock} low stock` : 'All stocked'}</p>
        </div>
        <div className="admin-page-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 600 }}>
            {showForm ? '✕ Cancel' : '+ Add Supply'}
          </button>
        </div>
      </div>

      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Total Items', val: totalItems, color: 'var(--blue-500)' },
          { label: 'Low Stock', val: lowStock, color: lowStock > 0 ? 'var(--rose-500)' : 'var(--green-500)' },
          { label: 'Categories', val: [...new Set(supplies.map(s => s.category))].length, color: 'var(--blue-600)' },
          { label: 'Total Value', val: `$${totalValue.toFixed(0)}`, color: 'var(--green-500)' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card" style={{ '--stat-accent': s.color }}><div className="admin-stat-value">{s.val}</div><div className="admin-stat-label">{s.label}</div></div>
        ))}
      </div>

      {showForm && (
        <div className="admin-panel" style={{ marginBottom: '20px' }}>
          <div className="admin-panel-header"><div className="admin-panel-title">📦 Add Supply Item</div></div>
          <div className="admin-panel-body">
            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid admin-form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-group"><label className="form-label">Item Name *</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Dog Kibble" /></div>
                <div className="form-group"><label className="form-label">Category *</label>
                  <select className="form-input form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Supplier</label><input className="form-input" value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} /></div>
              </div>
              <div className="admin-form-grid admin-form-grid-3" style={{ marginBottom: '16px' }}>
                <div className="form-group"><label className="form-label">Quantity *</label><input className="form-input" type="number" required min="0" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Unit</label>
                  <select className="form-input form-select" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Min Threshold</label><input className="form-input" type="number" min="0" value={form.minQuantity} onChange={e => setForm({...form, minQuantity: e.target.value})} /></div>
              </div>
              <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '16px' }}>
                <div className="form-group"><label className="form-label">Unit Cost ($)</label><input className="form-input" type="number" step="0.01" min="0" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Storage Location</label><input className="form-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}><label className="form-label">Notes</label><textarea className="form-input form-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px', padding: '10px 24px' }}>Add Item</button>
            </form>
          </div>
        </div>
      )}

      <div className="admin-filters">
        {['all', 'low', ...CATEGORIES].map(f => (
          <button key={f} className={`admin-filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'low' ? `⚠️ Low Stock (${lowStock})` : f === 'all' ? `All (${supplies.length})` : `${CAT_EMOJI[f] || ''} ${f.charAt(0).toUpperCase() + f.slice(1)}`}
          </button>
        ))}
      </div>

      <div className="admin-list">
        {filtered.sort((a, b) => (a.status === 'low' ? -1 : 1) - (b.status === 'low' ? -1 : 1)).map(item => (
          <div key={item.id} className="admin-list-item" style={{ borderLeft: `3px solid ${item.status === 'low' ? 'var(--rose-500)' : 'var(--green-500)'}` }}>
            <div className="admin-list-avatar" style={{ background: item.status === 'low' ? '#FFE4E6' : 'var(--green-50)', fontSize: '1.2rem' }}>
              {CAT_EMOJI[item.category] || '📦'}
            </div>
            <div className="admin-list-info">
              <div className="admin-list-name">
                {item.name}
                {item.status === 'low' && <span style={{ background: '#FFE4E6', color: '#E11D48', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, marginLeft: '8px' }}>LOW STOCK</span>}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {item.category} • {item.quantity} {item.unit} (min: {item.minQuantity}){item.supplier ? ` • Supplier: ${item.supplier}` : ''}{item.location ? ` • ${item.location}` : ''}
              </div>
              {item.cost > 0 && <div className="admin-list-meta"><span>💰 ${item.cost}/{item.unit} — Total: ${(item.cost * item.quantity).toFixed(2)}</span></div>}
            </div>
            <div className="admin-list-actions" style={{ flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button onClick={() => adjustQty(item, -1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1.5px solid var(--border-light)', background: 'var(--bg-secondary)', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontWeight: 700, minWidth: '32px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                <button onClick={() => adjustQty(item, 1)} style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1.5px solid var(--border-light)', background: 'var(--bg-secondary)', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <button onClick={() => onDelete(item.id)} style={{ background: '#FFE4E6', color: 'var(--rose-600)', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="admin-panel"><div className="admin-empty"><div className="admin-empty-icon">📦</div><div className="admin-empty-title">No supplies found</div><div className="admin-empty-text">Add supply items to track your shelter inventory.</div></div></div>
        )}
      </div>
    </>
  );
}
