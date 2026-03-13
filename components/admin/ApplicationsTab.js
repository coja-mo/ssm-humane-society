'use client';
import { useState } from 'react';

// ──── Star Rating Component ────
function StarRating({ value, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '120px' }}>{label}</span>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} type="button" onClick={() => onChange(n)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '2px', color: n <= (value || 0) ? '#F59E0B' : '#D1D5DB', transition: 'color 0.15s' }}>
            ★
          </button>
        ))}
      </div>
      {value && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{value}/5</span>}
    </div>
  );
}

// ──── Detail Section Component ────
function DetailSection({ title, icon, items, columns = 2 }) {
  const filtered = items.filter(i => i.value && i.value !== '—' && i.value !== 'undefined' && i.value !== '' && i.value !== 'N/A');
  if (filtered.length === 0) return null;
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-accent)' }}>
        <span>{icon}</span> {title}
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '6px 16px' }}>
        {filtered.map(item => (
          <div key={item.label} style={{ display: 'flex', gap: '6px', fontSize: '0.84rem', padding: '4px 0' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500, minWidth: '100px', flexShrink: 0 }}>{item.label}:</span>
            <span style={{ fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──── Toggle Checkbox ────
function ToggleCheck({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', background: checked ? 'rgba(16, 185, 129, 0.08)' : 'transparent', transition: 'all 0.2s', fontSize: '0.84rem' }}>
      <input type="checkbox" checked={checked || false} onChange={e => onChange(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--green-500)' }} />
      <span style={{ color: checked ? 'var(--green-600)' : 'var(--text-secondary)', fontWeight: checked ? 600 : 400 }}>{label}</span>
    </label>
  );
}

// ──── Full Application Detail ────
function ApplicationDetail({ app, onUpdateChecklist, onUpdateScoring, onUpdateHomeCheck, onUpdateVetRef }) {
  const formatList = (arr) => Array.isArray(arr) ? arr.join(', ') : arr || '—';
  const formatPets = (pets) => {
    if (!pets || !Array.isArray(pets) || pets.length === 0) return 'None listed';
    return pets.map(p => `${p.name || '?'} (${p.breed || '?'}, ${p.age || '?'}, ${p.sex || '?'}, fixed: ${p.fixed || '?'})`).join('; ');
  };
  const checklist = app.reviewChecklist || {};
  const scoring = app.scoring || {};

  return (
    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--bg-secondary)' }}>
      {/* ─── All 7 Form Sections ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <DetailSection title="Personal Information" icon="👤" items={[
            { label: 'Name', value: `${app.firstName || ''} ${app.lastName || ''}`.trim() },
            { label: 'Email', value: app.email },
            { label: 'Phone', value: app.phone },
            { label: 'DOB', value: app.dateOfBirth },
            { label: 'Address', value: [app.address, app.city, app.province, app.postalCode].filter(Boolean).join(', ') },
            { label: 'ID Type', value: app.idType },
          ]} columns={1} />

          <DetailSection title="Household & Living" icon="🏠" items={[
            { label: 'Housing', value: app.housing },
            { label: 'Own/Rent', value: app.ownRent },
            { label: 'Landlord', value: app.ownRent === 'rent' ? `${app.landlordName || '—'} (${app.landlordPhone || '—'})` : null },
            { label: 'LL Permission', value: app.ownRent === 'rent' ? app.landlordPermission : null },
            { label: 'Yard', value: app.yard },
            { label: 'Fenced', value: app.fenced },
            { label: 'Adults', value: app.numAdults },
            { label: 'Children', value: app.numChildren },
            { label: 'Children Ages', value: app.childrenAges },
            { label: 'Activity Level', value: app.activityLevel },
            { label: 'Allergies', value: app.allergies },
            { label: 'Caregiver', value: app.primaryCaregiver },
            { label: 'All Met Animal', value: app.allMembersMetAnimal },
          ]} columns={1} />

          <DetailSection title="Lifestyle & Plans" icon="🌅" items={[
            { label: 'Hours Alone', value: app.hoursAlone },
            { label: 'Day Location', value: app.petLocationDay },
            { label: 'Night Location', value: app.petLocationNight },
            { label: 'Plan Moving', value: app.planMoving ? 'Yes' : null },
            { label: 'Plan Vacation', value: app.planVacation ? 'Yes' : null },
            { label: 'Schedule Change', value: app.planScheduleChange ? 'Yes' : null },
            { label: 'Return Reasons', value: formatList(app.returnCircumstances) },
          ]} columns={1} />
        </div>

        <div>
          <DetailSection title="Pet History" icon="🐾" items={[
            { label: 'Current Pets', value: formatPets(app.currentPets) },
            { label: 'Previous Pets', value: app.hasPreviousPets },
            { label: 'Previous Details', value: app.previousPetsDetails },
            { label: 'Ever Surrendered', value: app.everSurrendered },
            { label: 'Surrender Details', value: app.surrenderDetails },
            { label: 'Adopted from SSM', value: app.adoptedFromSSM },
          ]} columns={1} />

          <DetailSection title="Vet & Care" icon="🩺" items={[
            { label: 'Vet Clinic', value: app.vetClinic },
            { label: 'Vet Phone', value: app.vetPhone },
            { label: 'Account Holder', value: app.vetAccountHolder },
            { label: 'Contacted Vet', value: app.contactedVet },
            { label: 'Spay/Neuter', value: app.believeSpayNeuter },
            { label: 'Regular Vet Care', value: app.believeRegularVetCare },
            { label: 'Researched Costs', value: app.researchedCosts },
          ]} columns={1} />

          <DetailSection title="Preferences" icon="💙" items={[
            { label: 'Type', value: app.type },
            { label: 'Pet Interest', value: app.petInterest },
            { label: 'Size Pref', value: app.sizePreference },
            { label: 'Activity Pref', value: app.activityPreferenceDog },
            { label: 'Training', value: app.trainingWillingness },
            { label: 'Cat Sex', value: app.catSexPref },
            { label: 'Cat Age', value: app.catAgePref },
            { label: 'Cat Coat', value: app.catCoatPref },
            { label: 'Cat Traits', value: formatList(app.catPersonality) },
            { label: 'Small Animal', value: app.smallAnimalType },
            { label: 'Habitat', value: app.smallAnimalHabitat },
            { label: 'Reason', value: app.reason },
          ]} columns={1} />

          <DetailSection title="Declarations" icon="✅" items={[
            { label: 'No Cruelty', value: app.noCrueltyConviction ? '✓ Confirmed' : '✗ Not confirmed' },
            { label: 'Info Accurate', value: app.infoAccurate ? '✓ Confirmed' : '✗ Not confirmed' },
            { label: 'Understands', value: app.understandProcess ? '✓ Confirmed' : '✗ Not confirmed' },
          ]} columns={1} />
        </div>
      </div>

      {/* ─── Staff Review Tools ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
        {/* Review Checklist */}
        <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-display)' }}>✅ Review Checklist</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <ToggleCheck label="Vet reference contacted" checked={checklist.vetReferenceContacted} onChange={v => onUpdateChecklist(app.id, 'vetReferenceContacted', v)} />
            <ToggleCheck label="Vet reference verified" checked={checklist.vetReferenceVerified} onChange={v => onUpdateChecklist(app.id, 'vetReferenceVerified', v)} />
            <ToggleCheck label="Landlord contacted" checked={checklist.landlordContacted} onChange={v => onUpdateChecklist(app.id, 'landlordContacted', v)} />
            <ToggleCheck label="Home check scheduled" checked={checklist.homeCheckScheduled} onChange={v => onUpdateChecklist(app.id, 'homeCheckScheduled', v)} />
            <ToggleCheck label="Home check passed" checked={checklist.homeCheckPassed} onChange={v => onUpdateChecklist(app.id, 'homeCheckPassed', v)} />
            <ToggleCheck label="All household members met animal" checked={checklist.allMembersMet} onChange={v => onUpdateChecklist(app.id, 'allMembersMet', v)} />
          </div>
        </div>

        {/* Scoring */}
        <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-display)' }}>⭐ Application Scoring</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <StarRating label="Housing" value={scoring.housingSuitability} onChange={v => onUpdateScoring(app.id, 'housingSuitability', v)} />
            <StarRating label="Pet Experience" value={scoring.petExperience} onChange={v => onUpdateScoring(app.id, 'petExperience', v)} />
            <StarRating label="Care Commitment" value={scoring.careCommitment} onChange={v => onUpdateScoring(app.id, 'careCommitment', v)} />
            <StarRating label="Overall Match" value={scoring.overallMatch} onChange={v => onUpdateScoring(app.id, 'overallMatch', v)} />
          </div>
          {(scoring.housingSuitability || scoring.petExperience || scoring.careCommitment || scoring.overallMatch) && (
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Average Score</span>
              <span style={{ fontWeight: 700, color: 'var(--text-accent)', fontSize: '0.88rem' }}>
                {(([scoring.housingSuitability, scoring.petExperience, scoring.careCommitment, scoring.overallMatch].filter(Boolean).reduce((a,b) => a+b, 0) / [scoring.housingSuitability, scoring.petExperience, scoring.careCommitment, scoring.overallMatch].filter(Boolean).length) || 0).toFixed(1)}/5
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Home Check & Vet Reference Tracking */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
        {/* Home Check */}
        <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-display)' }}>🏠 Home Check</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '80px' }}>Date:</label>
              <input type="date" className="form-input" style={{ flex: 1, padding: '6px 10px', fontSize: '0.82rem', borderRadius: '8px' }}
                value={app.homeCheckDate || ''} onChange={e => onUpdateHomeCheck(app.id, 'homeCheckDate', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '80px' }}>Result:</label>
              <select className="form-input form-select" style={{ flex: 1, padding: '6px 10px', fontSize: '0.82rem', borderRadius: '8px' }}
                value={app.homeCheckResult || ''} onChange={e => onUpdateHomeCheck(app.id, 'homeCheckResult', e.target.value)}>
                <option value="">Not completed</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
                <option value="conditional">Conditional</option>
              </select>
            </div>
            <textarea className="form-input form-textarea" placeholder="Home check notes..." rows={2}
              value={app.homeCheckNotes || ''} onChange={e => onUpdateHomeCheck(app.id, 'homeCheckNotes', e.target.value)}
              style={{ fontSize: '0.82rem', borderRadius: '8px', padding: '8px 10px', resize: 'vertical' }} />
          </div>
        </div>

        {/* Vet Reference */}
        <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-display)' }}>🩺 Vet Reference</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.84rem', padding: '8px 10px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <strong>{app.vetClinic || 'No clinic listed'}</strong>
              {app.vetPhone && <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>📞 {app.vetPhone}</span>}
            </div>
            <ToggleCheck label="Contacted" checked={checklist.vetReferenceContacted} onChange={v => onUpdateChecklist(app.id, 'vetReferenceContacted', v)} />
            <ToggleCheck label="Verified" checked={checklist.vetReferenceVerified} onChange={v => onUpdateChecklist(app.id, 'vetReferenceVerified', v)} />
            <textarea className="form-input form-textarea" placeholder="Vet reference notes..." rows={2}
              value={app.vetRefNotes || ''} onChange={e => onUpdateVetRef(app.id, e.target.value)}
              style={{ fontSize: '0.82rem', borderRadius: '8px', padding: '8px 10px', resize: 'vertical' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ──── Main Component ────
export default function ApplicationsTab({ apps, onUpdateStatus, onAddNote, onDeleteApp, onUpdateApp }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [noteText, setNoteText] = useState('');

  const statuses = ['all', 'submitted', 'reviewing', 'approved', 'visit-scheduled', 'adopted', 'rejected'];
  const statusColors = {
    draft: '#9CA3AF',
    submitted: '#F59E0B', reviewing: '#3B82F6', approved: '#10B981',
    'visit-scheduled': '#8B5CF6', adopted: '#EC4899', rejected: '#EF4444',
  };

  // Exclude drafts from default 'all' view
  const filtered = apps.filter(a => {
    if (filter === 'all' && a.status === 'draft') return false;
    if (filter === 'drafts') return a.status === 'draft';
    if (filter !== 'all' && filter !== 'drafts' && a.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (a.firstName || '').toLowerCase().includes(s) ||
        (a.lastName || '').toLowerCase().includes(s) ||
        (a.email || '').toLowerCase().includes(s) ||
        (a.petInterest || '').toLowerCase().includes(s);
    }
    return true;
  });

  const handleAddNote = (appId) => {
    if (!noteText.trim()) return;
    onAddNote(appId, { text: noteText });
    setNoteText('');
  };

  const handleUpdateChecklist = (appId, field, value) => {
    const app = apps.find(a => a.id === appId);
    if (!app || !onUpdateApp) return;
    const checklist = { ...(app.reviewChecklist || {}), [field]: value };
    onUpdateApp(appId, { reviewChecklist: checklist });
  };

  const handleUpdateScoring = (appId, field, value) => {
    const app = apps.find(a => a.id === appId);
    if (!app || !onUpdateApp) return;
    const scoring = { ...(app.scoring || {}), [field]: value };
    onUpdateApp(appId, { scoring });
  };

  const handleUpdateHomeCheck = (appId, field, value) => {
    if (!onUpdateApp) return;
    onUpdateApp(appId, { [field]: value });
  };

  const handleUpdateVetRef = (appId, value) => {
    if (!onUpdateApp) return;
    onUpdateApp(appId, { vetRefNotes: value });
  };

  const handlePrint = (app) => {
    const w = window.open('', '_blank');
    const name = `${app.firstName || ''} ${app.lastName || ''}`.trim();
    const sections = [
      { t: 'Personal Info', d: { Name: name, Email: app.email, Phone: app.phone, Address: [app.address, app.city, app.province, app.postalCode].filter(Boolean).join(', ') } },
      { t: 'Household', d: { Housing: app.housing, 'Own/Rent': app.ownRent, Yard: app.yard, Fenced: app.fenced, Adults: app.numAdults, Children: app.numChildren, Caregiver: app.primaryCaregiver } },
      { t: 'Vet & Care', d: { Clinic: app.vetClinic, Phone: app.vetPhone, 'Spay/Neuter': app.believeSpayNeuter, 'Regular Care': app.believeRegularVetCare } },
      { t: 'Lifestyle', d: { 'Hours Alone': app.hoursAlone, 'Day Location': app.petLocationDay, 'Night Location': app.petLocationNight } },
      { t: 'Preferences', d: { Type: app.type, Interest: app.petInterest, Reason: app.reason } },
    ];
    const html = `<html><head><title>${name} — Application</title><style>body{font-family:system-ui;max-width:700px;margin:40px auto;color:#222;}h1{font-size:1.4rem;border-bottom:2px solid #333;padding-bottom:8px;}h2{font-size:1rem;margin-top:24px;color:#555;border-bottom:1px solid #ddd;padding-bottom:4px;}table{width:100%;border-collapse:collapse;margin:8px 0;}td{padding:4px 8px;font-size:0.9rem;border-bottom:1px solid #eee;}td:first-child{font-weight:600;width:40%;color:#666;}</style></head><body>` +
      `<h1>SSM Humane Society — Adoption Application</h1><p>Applicant: <strong>${name}</strong> · Submitted: ${new Date(app.createdAt).toLocaleDateString()}</p>` +
      sections.map(s => `<h2>${s.t}</h2><table>${Object.entries(s.d).filter(([,v]) => v).map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>`).join('') +
      `</body></html>`;
    w.document.write(html);
    w.document.close();
    w.print();
  };

  const draftCount = apps.filter(a => a.status === 'draft').length;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Applications</h1>
          <p className="admin-page-subtitle">{apps.filter(a => a.status !== 'draft').length} applications · {apps.filter(a => a.status === 'submitted').length} awaiting review{draftCount > 0 ? ` · ${draftCount} drafts` : ''}</p>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="admin-pipeline" style={{ marginBottom: '20px' }}>
        {['submitted', 'reviewing', 'approved', 'visit-scheduled', 'adopted'].map(s => (
          <button key={s} className={`admin-pipeline-step ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(filter === s ? 'all' : s)}>
            <span className="admin-pipeline-count">{apps.filter(a => a.status === s).length}</span>
            <span className="admin-pipeline-label">{s.replace(/-/g, ' ')}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="admin-filters">
        {[...statuses, ...(draftCount > 0 ? ['drafts'] : [])].map(s => (
          <button key={s} className={`admin-filter-pill ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s === 'drafts' ? `Drafts (${draftCount})` : s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            {s !== 'all' && s !== 'drafts' && ` (${apps.filter(a => a.status === s).length})`}
          </button>
        ))}
        <input className="admin-filter-search" placeholder="🔍 Search applicants..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Application List */}
      <div className="admin-list">
        {filtered.length === 0 ? (
          <div className="admin-panel">
            <div className="admin-empty">
              <div className="admin-empty-icon">📝</div>
              <div className="admin-empty-title">No applications match</div>
              <div className="admin-empty-text">Try adjusting your filters or search criteria.</div>
            </div>
          </div>
        ) : filtered.map(app => {
          const isExpanded = expandedId === app.id;
          const scoring = app.scoring || {};
          const avgScore = [scoring.housingSuitability, scoring.petExperience, scoring.careCommitment, scoring.overallMatch]
            .filter(Boolean);
          const avg = avgScore.length ? (avgScore.reduce((a,b) => a+b, 0) / avgScore.length).toFixed(1) : null;
          const checklist = app.reviewChecklist || {};
          const checkCount = Object.values(checklist).filter(Boolean).length;

          return (
            <div key={app.id} className="admin-panel" style={{ marginBottom: '8px' }}>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '12px',
                        background: `${statusColors[app.status] || '#9CA3AF'}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', flexShrink: 0,
                      }}>📋</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{app.firstName} {app.lastName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                          <span>📧 {app.email}</span>
                          {app.phone && <span>📞 {app.phone}</span>}
                          <span>📅 {new Date(app.createdAt).toLocaleDateString()}</span>
                          {avg && <span>⭐ {avg}/5</span>}
                          {checkCount > 0 && <span>✅ {checkCount}/6</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '54px' }}>
                      Pet Interest: <strong>{app.petInterest || app.type || 'Any'}</strong>
                      {app.housing && <> · Housing: {app.housing} ({app.ownRent})</>}
                      {app.hoursAlone && <> · Alone: {app.hoursAlone}hrs</>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className={`admin-status admin-status-${app.status}`}>
                      {app.status?.replace(/-/g, ' ')}
                    </span>
                    {app.status !== 'draft' && ['reviewing', 'approved', 'visit-scheduled', 'adopted'].map(s => (
                      <button key={s} className={`btn btn-sm ${app.status === s ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => onUpdateStatus(app.id, s)}
                        style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '8px' }}>
                        {s.replace(/-/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expand Toggle */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginLeft: '54px' }}>
                  <button style={{
                    fontSize: '0.82rem', color: 'var(--text-accent)',
                    background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }} onClick={() => setExpandedId(isExpanded ? null : app.id)}>
                    <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: '0.2s', display: 'inline-block' }}>▶</span>
                    {isExpanded ? 'Hide Details' : 'Full Review'}
                  </button>
                  <button style={{
                    fontSize: '0.82rem', color: 'var(--text-muted)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }} onClick={() => handlePrint(app)}>
                    🖨️ Print
                  </button>
                </div>
              </div>

              {/* Expanded: Full Detail + Staff Tools */}
              {isExpanded && (
                <>
                  <ApplicationDetail
                    app={app}
                    onUpdateChecklist={handleUpdateChecklist}
                    onUpdateScoring={handleUpdateScoring}
                    onUpdateHomeCheck={handleUpdateHomeCheck}
                    onUpdateVetRef={handleUpdateVetRef}
                  />

                  {/* Notes Section */}
                  <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-light)' }}>
                    <h4 style={{ fontSize: '0.88rem', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>📝 Staff Notes ({(app.notes || []).length})</h4>
                    {(app.notes || []).map(note => (
                      <div key={note.id} style={{
                        padding: '12px 14px', background: 'var(--bg-secondary)',
                        borderRadius: '10px', marginBottom: '8px', fontSize: '0.85rem',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '0.82rem' }}>{note.author}</strong>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        {note.text}
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <input className="form-input" placeholder="Add a note..." value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAddNote(app.id); }}
                        style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem', borderRadius: '10px' }} />
                      <button className="btn btn-sm btn-primary" onClick={() => handleAddNote(app.id)}
                        style={{ borderRadius: '10px', padding: '8px 18px' }}>Add</button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', borderTop: '1px solid var(--border-light)' }}>
                    <button className="btn btn-sm btn-danger" onClick={() => { if (confirm('Delete application?')) onDeleteApp(app.id); }}
                      style={{ borderRadius: '10px', padding: '6px 16px', fontSize: '0.82rem' }}>
                      Delete Application
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
