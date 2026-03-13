'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════════
   ANTIGRAVITY SOLUTIONS NORTH — DEVELOPER PORTAL
   SSM Humane Society Project Build Dashboard
   ═══════════════════════════════════════════════════════════ */

const PAGES = [
  { path: '/', name: 'Homepage', icon: '🏠', desc: 'Hero, stats, featured pets, testimonials, news', section: 'Public' },
  { path: '/adopt', name: 'Adopt', icon: '🐾', desc: 'Pet gallery with filters, search, featured carousel', section: 'Public' },
  { path: '/adopt/[id]', name: 'Pet Detail', icon: '🐕', desc: 'Individual pet profile, medical records, apply CTA', section: 'Public' },
  { path: '/about', name: 'About Us', icon: '💙', desc: 'Mission, history, impact counters, happy tails', section: 'Public' },
  { path: '/services', name: 'Services', icon: '🏥', desc: 'Pet & community services, animated counters', section: 'Public' },
  { path: '/contact', name: 'Contact', icon: '📧', desc: 'Contact form → API, social proof, location', section: 'Public' },
  { path: '/donate', name: 'Donate', icon: '💝', desc: 'Donation form → API, receipt success screen', section: 'Public' },
  { path: '/events', name: 'Events', icon: '📅', desc: 'Featured event, RSVP with toast, countdown, notify', section: 'Public' },
  { path: '/foster', name: 'Foster', icon: '🏡', desc: '5-step multi-form application, auto-save draft', section: 'Public' },
  { path: '/volunteer', name: 'Volunteer', icon: '🤝', desc: 'Role picker, form → API, success confirmation', section: 'Public' },
  { path: '/stories', name: 'Success Stories', icon: '📖', desc: '6 adoption stories, stats, share CTA', section: 'Public' },
  { path: '/faq', name: 'FAQ', icon: '❓', desc: 'Accordion Q&A, search, bottom CTA', section: 'Public' },
  { path: '/surrender', name: 'Surrender', icon: '🐶', desc: '2-step surrender form → API', section: 'Public' },
  { path: '/lost-found', name: 'Lost & Found', icon: '🔍', desc: 'Report form → API, live listings, filters', section: 'Public' },
  { path: '/apply/dog', name: 'Apply (Dog)', icon: '📋', desc: 'Multi-step dog adoption application', section: 'Public' },
  { path: '/apply/cat', name: 'Apply (Cat)', icon: '📋', desc: 'Multi-step cat adoption application', section: 'Public' },
  { path: '/auth/login', name: 'Login', icon: '🔐', desc: 'Email/password auth, remember me', section: 'Auth' },
  { path: '/auth/register', name: 'Register', icon: '📝', desc: 'Account creation with validation', section: 'Auth' },
  { path: '/auth/forgot-password', name: 'Forgot Password', icon: '🔑', desc: 'Password reset flow', section: 'Auth' },
  { path: '/auth/reset-password', name: 'Reset Password', icon: '🔄', desc: 'New password entry', section: 'Auth' },
  { path: '/auth/verify-email', name: 'Verify Email', icon: '✉️', desc: 'Email verification confirmation', section: 'Auth' },
  { path: '/dashboard', name: 'User Dashboard', icon: '📊', desc: 'Overview, apps, favorites, visits, messages, certs', section: 'Dashboard' },
  { path: '/dashboard/applications', name: 'My Applications', icon: '📋', desc: 'Track application status with timeline', section: 'Dashboard' },
  { path: '/dashboard/favorites', name: 'Favorites', icon: '❤️', desc: 'Saved pets from pets.json, filters, sort', section: 'Dashboard' },
  { path: '/dashboard/messages', name: 'Messages', icon: '💬', desc: 'Inbox with compose, star, read states', section: 'Dashboard' },
  { path: '/dashboard/activity', name: 'Activity Log', icon: '📊', desc: 'Timeline of all user actions', section: 'Dashboard' },
  { path: '/dashboard/visits', name: 'Schedule Visit', icon: '📅', desc: 'Book shelter visit → API, upcoming list', section: 'Dashboard' },
  { path: '/dashboard/certificates', name: 'Certificates', icon: '🏆', desc: 'Adoption certificates viewer + download', section: 'Dashboard' },
  { path: '/dashboard/profile', name: 'Profile', icon: '👤', desc: 'Edit profile, live stats from API', section: 'Dashboard' },
  { path: '/dashboard/match', name: 'Pet Match Quiz', icon: '🎯', desc: '6-question quiz, compatibility scores', section: 'Dashboard' },
  { path: '/admin', name: 'Admin Dashboard', icon: '⚙️', desc: '14-tab admin panel, all CRUD operations', section: 'Admin' },
];

const API_ROUTES = [
  { path: '/api/pets', methods: 'GET POST', desc: 'List & create pets' },
  { path: '/api/pets/[id]', methods: 'GET PUT DELETE', desc: 'Individual pet CRUD' },
  { path: '/api/pets/[id]/medical', methods: 'GET POST', desc: 'Pet medical records' },
  { path: '/api/pets/[id]/waitlist', methods: 'GET POST', desc: 'Pet adoption waitlist' },
  { path: '/api/applications', methods: 'GET POST', desc: 'Adoption applications' },
  { path: '/api/applications/[id]', methods: 'GET PUT DELETE', desc: 'Individual application' },
  { path: '/api/applications/[id]/notes', methods: 'GET POST', desc: 'Application staff notes' },
  { path: '/api/auth', methods: 'POST', desc: 'Login/register authentication' },
  { path: '/api/auth/me', methods: 'GET', desc: 'Current session verification' },
  { path: '/api/donations', methods: 'GET POST', desc: 'Donation processing & history' },
  { path: '/api/donations/[id]', methods: 'PUT DELETE', desc: 'Individual donation' },
  { path: '/api/events', methods: 'GET POST', desc: 'Event management' },
  { path: '/api/events/[id]', methods: 'PUT DELETE', desc: 'Individual event' },
  { path: '/api/foster', methods: 'GET POST', desc: 'Foster applications' },
  { path: '/api/foster/[id]', methods: 'PUT DELETE', desc: 'Individual foster' },
  { path: '/api/volunteers', methods: 'GET POST', desc: 'Volunteer management' },
  { path: '/api/volunteers/[id]', methods: 'PUT DELETE', desc: 'Individual volunteer' },
  { path: '/api/contact', methods: 'GET POST', desc: 'Contact form messages' },
  { path: '/api/newsletter', methods: 'GET POST', desc: 'Newsletter subscribers' },
  { path: '/api/messages', methods: 'GET POST', desc: 'Internal messaging' },
  { path: '/api/messages/[id]', methods: 'PUT DELETE', desc: 'Individual message' },
  { path: '/api/announcements', methods: 'GET POST', desc: 'Public announcements' },
  { path: '/api/announcements/[id]', methods: 'PUT DELETE', desc: 'Individual announcement' },
  { path: '/api/lost-found', methods: 'GET POST', desc: 'Lost & found reports' },
  { path: '/api/lost-found/[id]', methods: 'PUT DELETE', desc: 'Individual report' },
  { path: '/api/intake', methods: 'GET POST', desc: 'Animal intake/surrender' },
  { path: '/api/intake/[id]', methods: 'PUT DELETE', desc: 'Individual intake' },
  { path: '/api/kennels', methods: 'GET POST', desc: 'Kennel management' },
  { path: '/api/kennels/[id]', methods: 'PUT DELETE', desc: 'Individual kennel' },
  { path: '/api/supplies', methods: 'GET POST', desc: 'Supply inventory' },
  { path: '/api/supplies/[id]', methods: 'PUT DELETE', desc: 'Individual supply' },
  { path: '/api/users', methods: 'GET POST', desc: 'User management' },
  { path: '/api/users/[id]', methods: 'PUT DELETE', desc: 'Individual user' },
  { path: '/api/visits', methods: 'GET POST', desc: 'Shelter visit scheduling' },
  { path: '/api/stats', methods: 'GET', desc: 'Aggregate statistics' },
  { path: '/api/reports', methods: 'GET', desc: 'Data reports & analytics' },
  { path: '/api/export', methods: 'GET', desc: 'CSV/JSON data export' },
  { path: '/api/settings', methods: 'GET PUT', desc: 'Shelter settings config' },
  { path: '/api/activity', methods: 'GET', desc: 'Activity audit log' },
  { path: '/api/seed', methods: 'POST', desc: 'Demo data seeding' },
];

const COMPONENTS = [
  { name: 'OverviewTab', path: 'admin/', desc: 'Dashboard overview with donut chart, sparklines, pipeline, activity feed', type: 'admin' },
  { name: 'PetsTab', path: 'admin/', desc: 'Pets CRUD with image upload, filters, bulk actions', type: 'admin' },
  { name: 'ApplicationsTab', path: 'admin/', desc: 'Application review with expandable detail, scoring, notes', type: 'admin' },
  { name: 'DonationsTab', path: 'admin/', desc: 'Donation recording, filtering, search', type: 'admin' },
  { name: 'EventsTab', path: 'admin/', desc: 'Events CRUD with type filters, registration, status', type: 'admin' },
  { name: 'FostersTab', path: 'admin/', desc: 'Foster management with review checklist, star scoring, notes', type: 'admin' },
  { name: 'VolunteersTab', path: 'admin/', desc: 'Volunteer CRUD, hours logging, status management', type: 'admin' },
  { name: 'MessagesTab', path: 'admin/', desc: 'Contact messages: split view, detail panel, reply, read/unread', type: 'admin' },
  { name: 'AnnouncementsTab', path: 'admin/', desc: 'Announcements CRUD with categories, pinning, publish', type: 'admin' },
  { name: 'LostFoundTab', path: 'admin/', desc: 'Lost & found reports, resolve/delete, filters', type: 'admin' },
  { name: 'IntakeTab', path: 'admin/', desc: 'Animal intake processing for surrenders and strays', type: 'admin' },
  { name: 'SuppliesTab', path: 'admin/', desc: 'Inventory tracking, low-stock alerts, categories', type: 'admin' },
  { name: 'KennelsTab', path: 'admin/', desc: 'Kennel assignment, occupancy grid, maintenance', type: 'admin' },
  { name: 'SettingsTab', path: 'admin/', desc: 'Shelter info, hours, fees, social, maintenance mode', type: 'admin' },
  { name: 'Navbar', path: 'layout/', desc: 'Responsive nav, mobile drawer, dark mode toggle, active states', type: 'layout' },
  { name: 'Footer', path: 'layout/', desc: 'Newsletter → API, stats, social links, site links', type: 'layout' },
  { name: 'FeaturedCarousel', path: 'pets/', desc: 'Horizontal scroll carousel for featured pets', type: 'pets' },
  { name: 'PetImage', path: 'pets/', desc: 'Optimized pet image component with fallback', type: 'pets' },
  { name: 'PetMatchQuiz', path: 'pets/', desc: 'Interactive quiz component for pet matching', type: 'pets' },
  { name: 'Icon / IconCircle', path: 'ui/', desc: 'SVG icon system with optional circle wrapper', type: 'ui' },
  { name: 'NotificationBell', path: 'ui/', desc: 'Navbar notification bell with badge count', type: 'ui' },
  { name: 'OnboardingModal', path: 'ui/', desc: 'Welcome modal for new users', type: 'ui' },
  { name: 'AnimatedCounter', path: 'effects/', desc: 'Count-up animation for statistics', type: 'effects' },
  { name: 'ScrollProgress', path: 'effects/', desc: 'Page scroll progress indicator bar', type: 'effects' },
  { name: 'CursorGlow', path: 'effects/', desc: 'Mouse-following glow effect', type: 'effects' },
  { name: 'PawBackground', path: 'effects/', desc: 'Floating paw print background decorations', type: 'effects' },
  { name: 'BackToTop', path: 'effects/', desc: 'Scroll-to-top floating button', type: 'effects' },
  { name: 'useScrollReveal', path: 'effects/', desc: 'Intersection Observer scroll reveal hook', type: 'effects' },
];

const DATA_STORES = [
  { file: 'pets.json', desc: 'All adoptable pets — names, breeds, ages, photos, status', icon: '🐾' },
  { file: 'applications.json', desc: 'Adoption applications with status tracking', icon: '📋' },
  { file: 'donations.json', desc: 'Donation records with amounts, donors, receipts', icon: '💰' },
  { file: 'events.json', desc: 'Shelter events — dates, types, registration', icon: '📅' },
  { file: 'fosters.json', desc: 'Foster applications and assignments', icon: '🏡' },
  { file: 'volunteers.json', desc: 'Volunteer records, hours, interests', icon: '🤝' },
  { file: 'contact-messages.json', desc: 'Contact form submissions', icon: '📧' },
  { file: 'newsletter.json', desc: 'Newsletter email subscribers', icon: '📬' },
  { file: 'messages.json', desc: 'Internal system messages', icon: '💬' },
  { file: 'announcements.json', desc: 'Public announcements', icon: '📢' },
  { file: 'lost-found.json', desc: 'Lost & found pet reports', icon: '🔍' },
  { file: 'intakes.json', desc: 'Animal intake/surrender records', icon: '🐶' },
  { file: 'kennels.json', desc: 'Kennel assignments and status', icon: '🏠' },
  { file: 'supplies.json', desc: 'Inventory items and stock levels', icon: '📦' },
  { file: 'users.json', desc: 'User accounts and profiles', icon: '👤' },
  { file: 'visits.json', desc: 'Scheduled shelter visits', icon: '📅' },
  { file: 'activity.json', desc: 'System activity audit log', icon: '📊' },
  { file: 'settings.json', desc: 'Shelter configuration & preferences', icon: '⚙️' },
];

// ─── STYLES ───
const S = {
  portal: {
    minHeight: '100vh', background: '#0A0A0F', color: '#E2E8F0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
  },
  topBar: {
    background: 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 100%)',
    borderBottom: '1px solid rgba(139,92,246,0.15)',
    padding: '0 32px', height: '64px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    position: 'sticky', top: 0, zIndex: 100,
    backdropFilter: 'blur(20px)',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  logoIcon: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem', fontWeight: 800, color: '#fff',
    boxShadow: '0 4px 15px rgba(139,92,246,0.3)',
  },
  logoText: {
    fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #A78BFA, #8B5CF6)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  logoSub: { fontSize: '0.68rem', color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '-2px' },
  container: { maxWidth: '1400px', margin: '0 auto', padding: '32px' },
  hero: {
    textAlign: 'center', padding: '48px 24px 32px', position: 'relative',
  },
  heroGlow: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '600px', height: '400px',
    background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em',
    marginBottom: '8px', position: 'relative',
  },
  heroSub: { color: '#64748B', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto', position: 'relative' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '16px', marginBottom: '40px',
  },
  statCard: (color) => ({
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px', padding: '20px', textAlign: 'center',
    transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
  }),
  statVal: (color) => ({
    fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em',
    background: `linear-gradient(135deg, ${color}, ${color}CC)`,
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  }),
  statLabel: { fontSize: '0.72rem', color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' },
  section: { marginBottom: '40px' },
  sectionHeader: {
    display: 'flex', alignItems: 'center', gap: '12px',
    marginBottom: '16px', paddingBottom: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  sectionIcon: {
    width: '32px', height: '32px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1rem',
  },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em' },
  sectionCount: { fontSize: '0.72rem', color: '#64748B', background: 'rgba(255,255,255,0.05)', padding: '2px 10px', borderRadius: '100px', fontWeight: 600 },
  badge: (color) => ({
    display: 'inline-block', padding: '2px 8px', borderRadius: '6px',
    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.04em',
    background: `${color}18`, color: color, textTransform: 'uppercase',
  }),
  methodBadge: (method) => {
    const colors = { GET: '#10B981', POST: '#3B82F6', PUT: '#F59E0B', DELETE: '#EF4444' };
    return {
      display: 'inline-block', padding: '1px 6px', borderRadius: '4px',
      fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em',
      background: `${colors[method] || '#64748B'}20`, color: colors[method] || '#64748B',
      marginRight: '4px',
    };
  },
};

function StatCard({ value, label, color, icon }) {
  return (
    <div style={S.statCard(color)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}33`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}>
      <div style={{ fontSize: '1.4rem', marginBottom: '8px', opacity: 0.7 }}>{icon}</div>
      <div style={S.statVal(color)}>{value}</div>
      <div style={S.statLabel}>{label}</div>
    </div>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto 32px' }}>
      <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', opacity: 0.4 }}>🔍</span>
      <input
        type="text" placeholder="Search pages, APIs, components..."
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '12px 16px 12px 44px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', color: '#E2E8F0', fontSize: '0.9rem',
          outline: 'none', transition: 'all 0.3s',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.4)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
      />
    </div>
  );
}

export default function DevPortal() {
  const [search, setSearch] = useState('');
  const [liveData, setLiveData] = useState({});
  const [activeSection, setActiveSection] = useState('all');
  const [now, setNow] = useState('');

  useEffect(() => {
    setNow(new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }));

    // Fetch live counts
    Promise.allSettled([
      fetch('/api/pets').then(r => r.json()),
      fetch('/api/applications').then(r => r.json()),
      fetch('/api/donations').then(r => r.json()),
      fetch('/api/volunteers').then(r => r.json()),
      fetch('/api/events').then(r => r.json()),
      fetch('/api/contact').then(r => r.json()),
      fetch('/api/newsletter').then(r => r.json()),
      fetch('/api/users').then(r => r.json()),
    ]).then(results => {
      setLiveData({
        pets: Array.isArray(results[0]?.value) ? results[0].value.length : 0,
        apps: Array.isArray(results[1]?.value) ? results[1].value.length : 0,
        donations: Array.isArray(results[2]?.value) ? results[2].value.length : 0,
        volunteers: Array.isArray(results[3]?.value) ? results[3].value.length : 0,
        events: Array.isArray(results[4]?.value) ? results[4].value.length : 0,
        messages: Array.isArray(results[5]?.value) ? results[5].value.length : 0,
        subscribers: results[6]?.value?.count || 0,
        users: Array.isArray(results[7]?.value) ? results[7].value.length : 0,
      });
    });
  }, []);

  const lower = search.toLowerCase();
  const filteredPages = PAGES.filter(p =>
    (activeSection === 'all' || p.section === activeSection) &&
    (!search || p.name.toLowerCase().includes(lower) || p.path.toLowerCase().includes(lower) || p.desc.toLowerCase().includes(lower))
  );
  const filteredAPIs = API_ROUTES.filter(a => !search || a.path.includes(lower) || a.desc.toLowerCase().includes(lower));
  const filteredComponents = COMPONENTS.filter(c => !search || c.name.toLowerCase().includes(lower) || c.desc.toLowerCase().includes(lower));
  const filteredStores = DATA_STORES.filter(d => !search || d.file.includes(lower) || d.desc.toLowerCase().includes(lower));

  const sectionFilters = ['all', 'Public', 'Auth', 'Dashboard', 'Admin'];
  const sectionColors = { Public: '#10B981', Auth: '#F59E0B', Dashboard: '#3B82F6', Admin: '#8B5CF6' };

  return (
    <div style={S.portal}>
      {/* ─── Top Bar ─── */}
      <div style={S.topBar}>
        <div style={S.logo}>
          <div style={S.logoIcon}>A</div>
          <div>
            <div style={S.logoText}>Antigravity Solutions North</div>
            <div style={S.logoSub}>Developer Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{now}</span>
          <Link href="/" style={{
            padding: '6px 16px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
            background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.25)',
            textDecoration: 'none', transition: 'all 0.2s',
          }}>← Back to Site</Link>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <div style={S.hero}>
        <div style={S.heroGlow} />
        <div style={{ ...S.heroTitle, color: '#F8FAFC' }}>
          SSM Humane Society
        </div>
        <div style={{ fontSize: '0.82rem', color: '#A78BFA', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '6px', position: 'relative' }}>
          PROJECT BUILD DASHBOARD
        </div>
        <div style={S.heroSub}>
          Complete inventory of every page, API route, component, and data store in the build.
        </div>
      </div>

      <div style={S.container}>
        {/* ─── Live Stats ─── */}
        <div style={S.statsGrid}>
          <StatCard value={PAGES.length} label="Pages" color="#8B5CF6" icon="📄" />
          <StatCard value={API_ROUTES.length} label="API Routes" color="#3B82F6" icon="⚡" />
          <StatCard value={COMPONENTS.length} label="Components" color="#10B981" icon="🧩" />
          <StatCard value={DATA_STORES.length} label="Data Stores" color="#F59E0B" icon="💾" />
          <StatCard value={liveData.pets || '—'} label="Live Pets" color="#EC4899" icon="🐾" />
          <StatCard value={liveData.users || '—'} label="Users" color="#06B6D4" icon="👤" />
          <StatCard value={liveData.donations || '—'} label="Donations" color="#10B981" icon="💝" />
          <StatCard value={liveData.messages || '—'} label="Messages" color="#F97316" icon="📧" />
        </div>

        {/* ─── Search ─── */}
        <SearchBar value={search} onChange={setSearch} />

        {/* ═══ PAGES ═══ */}
        <div style={S.section}>
          <div style={S.sectionHeader}>
            <div style={{ ...S.sectionIcon, background: 'rgba(139,92,246,0.15)' }}>📄</div>
            <div style={S.sectionTitle}>Sitemap — All Pages</div>
            <div style={S.sectionCount}>{filteredPages.length} pages</div>
          </div>

          {/* Section filter pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {sectionFilters.map(f => (
              <button key={f} onClick={() => setActiveSection(f)} style={{
                padding: '6px 16px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: activeSection === f ? (sectionColors[f] || '#8B5CF6') + '22' : 'rgba(255,255,255,0.04)',
                color: activeSection === f ? (sectionColors[f] || '#A78BFA') : '#64748B',
                outline: activeSection === f ? `1px solid ${sectionColors[f] || '#8B5CF6'}44` : '1px solid transparent',
              }}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '10px' }}>
            {filteredPages.map(p => (
              <Link key={p.path} href={p.path.includes('[') ? '#' : p.path} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 18px', borderRadius: '12px', textDecoration: 'none',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                color: '#E2E8F0', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.06)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{p.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.name}</span>
                    <span style={S.badge(sectionColors[p.section] || '#8B5CF6')}>{p.section}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ color: '#4B5563', fontFamily: 'monospace', fontSize: '0.7rem' }}>{p.path}</span>
                    {' · '}{p.desc}
                  </div>
                </div>
                <span style={{ fontSize: '0.9rem', opacity: 0.3 }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ═══ API ROUTES ═══ */}
        <div style={S.section}>
          <div style={S.sectionHeader}>
            <div style={{ ...S.sectionIcon, background: 'rgba(59,130,246,0.15)' }}>⚡</div>
            <div style={S.sectionTitle}>API Routes</div>
            <div style={S.sectionCount}>{filteredAPIs.length} endpoints</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px', overflow: 'hidden',
          }}>
            {filteredAPIs.map((api, i) => (
              <div key={api.path} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '10px 20px',
                borderBottom: i < filteredAPIs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <code style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#A78BFA', minWidth: '240px', fontWeight: 600 }}>
                  {api.path}
                </code>
                <div style={{ display: 'flex', gap: '3px', minWidth: '120px' }}>
                  {api.methods.split(' ').map(m => (
                    <span key={m} style={S.methodBadge(m)}>{m}</span>
                  ))}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{api.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ COMPONENTS ═══ */}
        <div style={S.section}>
          <div style={S.sectionHeader}>
            <div style={{ ...S.sectionIcon, background: 'rgba(16,185,129,0.15)' }}>🧩</div>
            <div style={S.sectionTitle}>Component Registry</div>
            <div style={S.sectionCount}>{filteredComponents.length} components</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '10px' }}>
            {filteredComponents.map(c => {
              const typeColors = { admin: '#8B5CF6', layout: '#3B82F6', pets: '#EC4899', ui: '#F59E0B', effects: '#06B6D4' };
              return (
                <div key={c.name} style={{
                  padding: '14px 18px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <code style={{ fontWeight: 700, fontSize: '0.88rem', color: '#E2E8F0' }}>{c.name}</code>
                    <span style={S.badge(typeColors[c.type] || '#64748B')}>{c.type}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    <span style={{ fontFamily: 'monospace', color: '#4B5563', fontSize: '0.7rem' }}>components/{c.path}</span>
                    {' · '}{c.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ DATA STORES ═══ */}
        <div style={S.section}>
          <div style={S.sectionHeader}>
            <div style={{ ...S.sectionIcon, background: 'rgba(245,158,11,0.15)' }}>💾</div>
            <div style={S.sectionTitle}>Data Stores</div>
            <div style={S.sectionCount}>{filteredStores.length} files</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
            {filteredStores.map(d => (
              <div key={d.file} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 18px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ fontSize: '1.3rem' }}>{d.icon}</span>
                <div>
                  <code style={{ fontWeight: 700, fontSize: '0.85rem', color: '#FCD34D' }}>{d.file}</code>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>{d.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ QUICK LINKS ═══ */}
        <div style={S.section}>
          <div style={S.sectionHeader}>
            <div style={{ ...S.sectionIcon, background: 'rgba(236,72,153,0.15)' }}>🚀</div>
            <div style={S.sectionTitle}>Quick Links</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {[
              { label: 'Homepage', href: '/', icon: '🏠', color: '#10B981' },
              { label: 'Adopt a Pet', href: '/adopt', icon: '🐾', color: '#3B82F6' },
              { label: 'Admin Panel', href: '/admin', icon: '⚙️', color: '#8B5CF6' },
              { label: 'User Dashboard', href: '/dashboard', icon: '📊', color: '#06B6D4' },
              { label: 'Donate', href: '/donate', icon: '💝', color: '#EC4899' },
              { label: 'Events', href: '/events', icon: '📅', color: '#F97316' },
              { label: 'Foster', href: '/foster', icon: '🏡', color: '#10B981' },
              { label: 'Volunteer', href: '/volunteer', icon: '🤝', color: '#3B82F6' },
              { label: 'Success Stories', href: '/stories', icon: '📖', color: '#F59E0B' },
              { label: 'Lost & Found', href: '/lost-found', icon: '🔍', color: '#EF4444' },
              { label: 'Contact', href: '/contact', icon: '📧', color: '#8B5CF6' },
              { label: 'FAQ', href: '/faq', icon: '❓', color: '#06B6D4' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 18px', borderRadius: '12px', textDecoration: 'none',
                background: `${link.color}08`, border: `1px solid ${link.color}18`,
                color: '#E2E8F0', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${link.color}15`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${link.color}08`; e.currentTarget.style.transform = 'none'; }}>
                <span style={{ fontSize: '1.3rem' }}>{link.icon}</span>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div style={{
          textAlign: 'center', padding: '40px 0 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px',
            background: 'linear-gradient(135deg, #A78BFA, #8B5CF6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Antigravity Solutions North
          </div>
          <div style={{ fontSize: '0.72rem', color: '#4B5563' }}>
            SSM Humane Society Build · {PAGES.length} Pages · {API_ROUTES.length} APIs · {COMPONENTS.length} Components · {DATA_STORES.length} Data Stores
          </div>
          <div style={{ fontSize: '0.68rem', color: '#374151', marginTop: '8px' }}>
            © {new Date().getFullYear()} Antigravity Solutions North. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
