'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const MOCK_NOTIFICATIONS = [
  {
    id: 1, type: 'application', read: false,
    title: '🎉 Application Approved!',
    body: 'Your application for Luna has been approved. Schedule a visit to meet her!',
    time: '2 min ago', action: '/dashboard',
  },
  {
    id: 2, type: 'pet', read: false,
    title: '🐾 New Pets Available',
    body: '3 new dogs and 2 new cats are looking for homes this week.',
    time: '1 hour ago', action: '/adopt',
  },
  {
    id: 3, type: 'event', read: false,
    title: '📅 Adoption Event Saturday',
    body: 'Join us this Saturday for our monthly adoption open house event!',
    time: '3 hours ago', action: '/events',
  },
  {
    id: 4, type: 'system', read: true,
    title: '✅ Email Verified',
    body: 'Your email address has been successfully verified.',
    time: '1 day ago', action: null,
  },
  {
    id: 5, type: 'pet', read: true,
    title: '💕 Pet Match Found',
    body: 'Based on your preferences, we found 5 pets that might be perfect for you!',
    time: '2 days ago', action: '/dashboard/match',
  },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const ref = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function clearAll() {
    setNotifications([]);
  }

  const typeColors = {
    application: 'var(--green-500)',
    pet: 'var(--blue-500)',
    event: '#8B5CF6',
    system: 'var(--text-muted)',
  };

  return (
    <div className="notif-bell-wrap" ref={ref}>
      <button
        className="notif-bell-btn"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        id="notification-bell"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="notif-bell-badge">{unreadCount}</span>
        )}
      </button>

      <div className={`notif-dropdown ${open ? 'open' : ''}`}>
        <div className="notif-dropdown-header">
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Notifications</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {unreadCount > 0 && (
              <button className="notif-header-action" onClick={markAllRead}>
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button className="notif-header-action" onClick={clearAll}>
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="notif-dropdown-body">
          {notifications.length === 0 ? (
            <div className="notif-empty">
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔔</div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>All caught up!</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                No new notifications right now.
              </div>
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => markRead(n.id)}>
                {n.action ? (
                  <Link href={n.action} className="notif-item-inner" onClick={() => setOpen(false)}>
                    <div className="notif-item-dot" style={{ background: !n.read ? typeColors[n.type] : 'transparent' }} />
                    <div className="notif-item-content">
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-body">{n.body}</div>
                      <div className="notif-item-time">{n.time}</div>
                    </div>
                  </Link>
                ) : (
                  <div className="notif-item-inner">
                    <div className="notif-item-dot" style={{ background: !n.read ? typeColors[n.type] : 'transparent' }} />
                    <div className="notif-item-content">
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-body">{n.body}</div>
                      <div className="notif-item-time">{n.time}</div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="notif-dropdown-footer">
          <Link href="/dashboard" className="notif-see-all" onClick={() => setOpen(false)}>
            View All Activity →
          </Link>
        </div>
      </div>
    </div>
  );
}
