'use client';
import { useState } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const QUICK_LINKS = [
  { q: 'How do I adopt?', href: '/adopt' },
  { q: 'Visiting hours?', href: '#hours' },
  { q: 'Volunteer opportunities', href: '/volunteer' },
  { q: 'Lost a pet?', href: '/lost-found' },
  { q: 'Surrender a pet', href: '/surrender' },
  { q: 'Donation info', href: '/donate' },
];

const DEPARTMENTS = [
  { icon: 'paw', title: 'Adoptions', email: 'adoptions@ssmhumanesociety.ca', desc: 'Questions about an animal or application', color: 'var(--blue-400)' },
  { icon: 'heart', title: 'Fostering', email: 'foster@ssmhumanesociety.ca', desc: 'Foster program inquiries', color: 'var(--rose-400)' },
  { icon: 'people', title: 'Volunteering', email: 'volunteer@ssmhumanesociety.ca', desc: 'Volunteer applications & shifts', color: 'var(--green-500)' },
  { icon: 'heart', title: 'Donations', email: 'donations@ssmhumanesociety.ca', desc: 'Tax receipts, corporate giving, bequests', color: '#F59E0B' },
];

export default function ContactPage() {
  useScrollReveal();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', department: 'general', message: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSent(true);
      setFormData({ name: '', email: '', phone: '', subject: '', department: 'general', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (err) { console.error(err); }
    setSending(false);
  }

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(41,171,226,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="mail" size={14} color="var(--blue-700)" /> Reach Out
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Get In <span className="text-gradient">Touch</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', marginBottom: '24px' }}>
            Have questions? We&apos;d love to hear from you. Reach out anytime!
          </p>

          {/* Quick-Link FAQ Chips */}
          <div className="reveal" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
            {QUICK_LINKS.map((link, i) => (
              <Link key={i} href={link.href} style={{
                padding: '8px 18px', borderRadius: '100px',
                background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.2s ease',
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <Icon name="arrow" size={12} color="var(--text-accent)" /> {link.q}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div className="container glass" style={{
          display: 'flex', justifyContent: 'space-around', padding: '24px 32px',
          flexWrap: 'wrap', gap: '20px', borderRadius: 'var(--radius-xl)',
          maxWidth: '600px', margin: '0 auto', position: 'relative', top: '-24px',
        }}>
          {[
            { target: 847, label: 'Inquiries This Year', icon: 'mail', color: 'var(--blue-500)' },
            { target: 24, label: 'Hr Avg Response', suffix: '', icon: 'clock', color: 'var(--green-500)' },
            { target: 4.9, label: 'Community Rating', suffix: '★', icon: 'star', color: '#F59E0B' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>
                {i === 2 ? '4.9★' : <AnimatedCounter target={stat.target} suffix={stat.suffix || ''} />}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Department Quick Contact */}
      <section style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="container">
          <h3 className="text-center reveal" style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Contact a <span className="text-gradient">Department</span></h3>
          <div className="grid-4 stagger" style={{ maxWidth: '900px', margin: '0 auto', gap: '12px' }}>
            {DEPARTMENTS.map((d, i) => (
              <a key={i} href={`mailto:${d.email}`} className="card card-3d" style={{ textDecoration: 'none', padding: '20px', textAlign: 'center' }}>
                <IconCircle name={d.icon} size={40} color={d.color} bgOpacity={0.15} style={{ margin: '0 auto 10px' }} />
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{d.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-accent)', fontWeight: 500 }}>{d.email}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{d.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '48px', alignItems: 'start' }}>
            <div className="reveal-left">
              <div className="card" style={{ padding: '36px' }}>
                <h2 style={{ marginBottom: '8px' }}>Send Us a Message</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>We typically respond within 1-2 business days</p>
                <form onSubmit={handleSubmit}>
                  <div className="grid-2">
                    <div className="form-group"><label className="form-label">Name *</label><input className="form-input" placeholder="Your name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                    <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="you@email.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                  </div>
                  <div className="grid-2">
                    <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" placeholder="(705) 555-0123" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                    <div className="form-group"><label className="form-label">Department</label>
                      <select className="form-input form-select" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                        <option value="general">General Inquiry</option>
                        <option value="adoptions">Adoptions</option>
                        <option value="fostering">Fostering</option>
                        <option value="volunteering">Volunteering</option>
                        <option value="donations">Donations</option>
                        <option value="lost-found">Lost & Found</option>
                        <option value="media">Media & Press</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group"><label className="form-label">Subject *</label><input className="form-input" placeholder="How can we help?" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Message *</label><textarea className="form-input form-textarea" placeholder="Your message..." required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} /></div>
                  <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {sending ? <>Sending...</> : sent ? <><Icon name="check" size={16} color="#fff" /> Message Sent!</> : <><Icon name="mail" size={16} color="#fff" /> Send Message</>}
                  </button>
                </form>
                {sent && (
                  <p style={{ color: 'var(--green-500)', textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', animation: 'fadeInUp 0.4s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Icon name="check" size={14} color="var(--green-500)" /> We&apos;ll get back to you within 1-2 business days.
                  </p>
                )}
              </div>
            </div>
            <div className="reveal-right">
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  { icon: 'location', title: 'Location', lines: ['962 Second Line East', 'Sault Ste. Marie, ON P6B 4K4'], color: 'var(--blue-400)' },
                  { icon: 'phone', title: 'Phone & Fax', lines: ['Phone: 705-949-3573', 'Fax: 705-949-0169'], color: 'var(--green-500)' },
                  { icon: 'mail', title: 'Email', lines: ['General: info@ssmhumanesociety.ca', 'Adoptions: adoptions@ssmhumanesociety.ca'], color: 'var(--rose-400)' },
                  { icon: 'clock', title: 'Hours', lines: ['Monday – Saturday: 12 PM – 5 PM', 'Sunday: Closed', 'Statutory Holidays: Closed'], color: 'var(--blue-500)', id: 'hours' },
                ].map((item, i) => (
                  <div key={i} id={item.id || undefined} className="card card-3d" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <IconCircle name={item.icon} size={44} color={item.color} bgOpacity={0.15} />
                    <div>
                      <div style={{ fontWeight: '700', marginBottom: '4px' }}>{item.title}</div>
                      {item.lines.map((l, j) => <div key={j} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{l}</div>)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="card" style={{ marginTop: '16px', padding: '24px' }}>
                <div style={{ fontWeight: 700, marginBottom: '12px' }}>Follow Us</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { icon: '📘', label: 'Facebook', href: '#', color: '#1877F2' },
                    { icon: '📸', label: 'Instagram', href: '#', color: '#E4405F' },
                    { icon: '🐦', label: 'Twitter', href: '#', color: '#1DA1F2' },
                    { icon: '📺', label: 'YouTube', href: '#', color: '#FF0000' },
                  ].map((s, i) => (
                    <a key={i} href={s.href} style={{
                      width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', textDecoration: 'none',
                      fontSize: '1.1rem', transition: 'all 0.2s',
                    }} title={s.label}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="card" style={{ marginTop: '16px', overflow: 'hidden', borderRadius: 'var(--radius-lg)', height: '220px' }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2783.8!2d-84.3127!3d46.5099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbCsDMwJzM2LjAiTiA4NMKwMTgnNDUuNyJX!5e0!3m2!1sen!2sca!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
