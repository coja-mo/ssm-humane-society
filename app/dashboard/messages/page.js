'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MOCK_MESSAGES = [
  {
    id: '1', from: 'SSM Humane Society', fromRole: 'staff', subject: 'Welcome to SSM Humane Society! 🐾',
    body: 'Hi Cody,\n\nWelcome to the Sault Ste. Marie Humane Society family! We\'re so glad you\'ve joined us.\n\nHere are a few things you can do to get started:\n• Browse our available pets\n• Take the Pet Match Quiz\n• Save your favorites\n• Submit an adoption application\n\nIf you have any questions, don\'t hesitate to reach out. We\'re here to help you find your perfect companion!\n\nWarm regards,\nThe SSM HS Team',
    time: '2 min ago', read: false, starred: false,
  },
  {
    id: '2', from: 'Adoption Team', fromRole: 'staff', subject: 'Your Application Update — Luna',
    body: 'Hi Cody,\n\nGreat news! Your adoption application for Luna (Domestic Shorthair, Female, 2 years) has been received and is currently under review.\n\nWhat happens next:\n1. Our team will review your application within 2-3 business days\n2. We may contact you for additional information\n3. If approved, we\'ll schedule a meet & greet visit\n\nWe\'ll keep you updated every step of the way. Thank you for choosing adoption!\n\nBest,\nAdoption Team',
    time: '1 hour ago', read: false, starred: true,
  },
  {
    id: '3', from: 'Events Team', fromRole: 'staff', subject: 'Adoption Open House this Saturday!',
    body: 'Hi there!\n\nYou\'re invited to our monthly Adoption Open House this Saturday from 10 AM - 4 PM.\n\n🐕 Meet our available dogs\n🐈 Visit the cat lounge\n🎉 Fun activities for the whole family\n🍕 Free refreshments\n\nNo appointment needed — just drop by!\n\nHope to see you there,\nSSM HS Events Team',
    time: '3 hours ago', read: true, starred: false,
  },
  {
    id: '4', from: 'Dr. Sarah Chen', fromRole: 'vet', subject: 'Vaccination Records — Luna',
    body: 'Hello,\n\nI wanted to let you know that Luna\'s vaccination records are up to date. She has received:\n• FVRCP (core vaccine)\n• Rabies vaccination\n• FeLV test (negative)\n\nShe is also spayed and microchipped. All records will be provided upon adoption.\n\nPlease let me know if you have any health-related questions.\n\nDr. Sarah Chen\nVeterinary Staff',
    time: '1 day ago', read: true, starred: false,
  },
  {
    id: '5', from: 'Volunteer Coordinator', fromRole: 'staff', subject: 'Volunteer Orientation This Saturday!',
    body: 'Hi there!\n\nThank you for your interest in volunteering at the shelter. We\'d love to have you join our team!\n\nOur next volunteer orientation session is this Saturday from 10 AM - 12 PM. Here\'s what to expect:\n\n1. Welcome and introductions\n2. Shelter tour and safety guidelines\n3. Overview of volunteer roles\n4. Hands-on training with animals\n\nPlease wear closed-toe shoes and comfortable clothing. Light refreshments will be provided.\n\nLooking forward to meeting you!\n\nSarah Thompson\nVolunteer Coordinator',
    time: '2 days ago', read: true, starred: false,
  },
  {
    id: '6', from: 'Foster Program', fromRole: 'staff', subject: 'Foster a Kitten This Spring 🐱',
    body: 'Hello!\n\nKitten season is approaching and we need foster families more than ever. Here\'s what you should know:\n\n🏠 We provide all supplies (food, litter, crate)\n🏥 All veterinary care is covered\n📋 Typical foster period: 2-8 weeks\n❤️ You help save lives!\n\nWe have kittens of all ages who need temporary loving homes. Even if you can only foster for a few weeks, it makes a huge difference.\n\nInterested? Reply to this message or visit our foster page for more details.\n\nThank you for making a difference!\nFoster Team',
    time: '3 days ago', read: true, starred: true,
  },
  {
    id: '7', from: 'SSM Humane Society', fromRole: 'system', subject: 'Pet Status Update — Buddy',
    body: 'This is an automated notification.\n\nA pet you\'ve shown interest in has been updated:\n\n🐕 Buddy (Labrador Mix, Male, 3 years)\nStatus: Still Available\n\nBuddy has been at the shelter for 45 days and is eagerly waiting for his forever home. He\'s great with kids and other dogs.\n\nDon\'t miss your chance — schedule a visit today!\n\nView Buddy\'s profile: /adopt/buddy',
    time: '4 days ago', read: true, starred: false,
  },
];

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [selectedId, setSelectedId] = useState(null);
  const [composing, setComposing] = useState(false);
  const [composeData, setComposeData] = useState({ subject: '', body: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) { router.push('/auth/login'); return; }
    setUser(JSON.parse(u));
  }, [router]);

  if (!user) return null;

  const selected = messages.find(m => m.id === selectedId);
  const unread = messages.filter(m => !m.read).length;
  const filtered = filter === 'all' ? messages :
    filter === 'unread' ? messages.filter(m => !m.read) :
    filter === 'starred' ? messages.filter(m => m.starred) : messages;

  function openMessage(id) {
    setSelectedId(id);
    setComposing(false);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  }

  function toggleStar(id, e) {
    e.stopPropagation();
    setMessages(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
  }

  async function handleSend(e) {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setComposeData({ subject: '', body: '' });
    setTimeout(() => { setSent(false); setComposing(false); }, 2000);
  }

  const roleColors = {
    staff: 'var(--blue-500)',
    vet: 'var(--green-500)',
    system: 'var(--text-muted)',
  };

  return (
    <section style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontWeight: '600' }}>Messages</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>
              Messages {unread > 0 && <span className="badge badge-blue" style={{ fontSize: '0.72rem', verticalAlign: 'middle' }}>{unread} new</span>}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Communications from the shelter team
            </p>
          </div>
          <button className="btn btn-primary btn-sm" style={{ borderRadius: '100px' }} onClick={() => { setComposing(true); setSelectedId(null); }}>
            ✉️ Compose
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
          {[
            { id: 'all', label: `All (${messages.length})` },
            { id: 'unread', label: `Unread (${unread})` },
            { id: 'starred', label: `Starred (${messages.filter(m => m.starred).length})` },
          ].map(f => (
            <button key={f.id} className={filter === f.id ? 'pet-filter-btn active' : 'pet-filter-btn'} onClick={() => setFilter(f.id)} style={{ fontSize: '0.82rem' }}>
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedId || composing ? '360px 1fr' : '1fr', gap: '20px' }}>
          {/* Message List */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>No messages</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {filter === 'unread' ? 'All caught up!' : 'No messages in this category.'}
                </div>
              </div>
            ) : (
              filtered.map(m => (
                <div
                  key={m.id}
                  onClick={() => openMessage(m.id)}
                  style={{
                    display: 'flex', alignItems: 'start', gap: '12px',
                    padding: '16px 20px', cursor: 'pointer',
                    background: selectedId === m.id ? 'var(--blue-50)' : !m.read ? 'rgba(41,171,226,0.03)' : 'transparent',
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Unread indicator */}
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: !m.read ? 'var(--blue-500)' : 'transparent',
                    marginTop: '8px', flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px', gap: '8px' }}>
                      <div style={{ fontWeight: !m.read ? '700' : '600', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.from}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {m.time}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: !m.read ? '600' : '400', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>
                      {m.subject}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.body.split('\n')[0].slice(0, 80)}...
                    </div>
                  </div>
                  <button onClick={e => toggleStar(m.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: m.starred ? '#F59E0B' : 'var(--border-light)', transition: 'color 0.2s', flexShrink: 0, marginTop: '4px' }}>
                    {m.starred ? '★' : '☆'}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Message Detail / Compose Panel */}
          {(selectedId || composing) && (
            <div className="card" style={{ padding: '32px', animation: 'fadeInUp 0.3s ease both' }}>
              {composing ? (
                /* Compose Form */
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>✉️ New Message</h2>
                    <button onClick={() => setComposing(false)} style={{ fontSize: '1.2rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                  </div>
                  {sent ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '16px', animation: 'authSuccessPop 0.4s ease' }}>✅</div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>Message Sent!</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Our team will get back to you soon.</div>
                    </div>
                  ) : (
                    <form onSubmit={handleSend}>
                      <div className="auth-field">
                        <label className="auth-label">To</label>
                        <div className="auth-input-wrap">
                          <input className="auth-input" value="SSM Humane Society Team" disabled style={{ opacity: 0.6 }} />
                        </div>
                      </div>
                      <div className="auth-field">
                        <label className="auth-label">Subject</label>
                        <div className="auth-input-wrap">
                          <input className="auth-input" value={composeData.subject} onChange={e => setComposeData({ ...composeData, subject: e.target.value })} placeholder="What's this about?" required />
                        </div>
                      </div>
                      <div className="auth-field">
                        <label className="auth-label">Message</label>
                        <div className="auth-input-wrap">
                          <textarea className="auth-input" style={{ minHeight: '200px', resize: 'vertical' }} value={composeData.body} onChange={e => setComposeData({ ...composeData, body: e.target.value })} placeholder="Type your message..." required />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setComposing(false)}>Cancel</button>
                        <button type="submit" className="auth-submit-btn" style={{ width: 'auto', padding: '12px 32px' }} disabled={sending}>
                          {sending ? <><span className="auth-spinner" /> Sending...</> : '📤 Send Message'}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : selected ? (
                /* Message Detail */
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '12px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>{selected.subject}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: `${roleColors[selected.fromRole]}15`,
                          color: roleColors[selected.fromRole],
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '700', fontSize: '0.82rem',
                        }}>
                          {selected.from.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{selected.from}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selected.time}</div>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setSelectedId(null)} style={{ fontSize: '1.2rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                  </div>
                  <div style={{
                    whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '0.92rem',
                    color: 'var(--text-secondary)', padding: '20px', background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    {selected.body}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button className="btn btn-primary btn-sm" style={{ borderRadius: '100px' }} onClick={() => { setComposing(true); setSelectedId(null); setComposeData({ subject: `Re: ${selected.subject}`, body: '' }); }}>
                      ↩️ Reply
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={e => toggleStar(selected.id, e)}>
                      {selected.starred ? '★ Starred' : '☆ Star'}
                    </button>
                  </div>
                  {/* Quick Reply Suggestions */}
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 600 }}>Quick Replies</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['Thank you for the update!', 'I have a question about this.', 'I\'d like to schedule a visit.'].map(reply => (
                        <button key={reply} onClick={() => { setComposing(true); setSelectedId(null); setComposeData({ subject: `Re: ${selected.subject}`, body: reply }); }}
                          style={{
                            padding: '8px 14px', borderRadius: '100px', border: '1px solid var(--border-light)',
                            background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.8rem',
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                          }}>
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px' }}>
          <Link href="/dashboard" className="btn btn-ghost btn-sm">← Back to Dashboard</Link>
        </div>
      </div>
    </section>
  );
}
