'use client';
import { useState } from 'react';
import useScrollReveal from '@/components/effects/useScrollReveal';
import Icon, { IconCircle } from '@/components/ui/Icon';

export default function ContactPage() {
  useScrollReveal();
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="mail" size={14} color="var(--blue-700)" /> Reach Out
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Get In <span className="text-gradient">Touch</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Have questions? We&apos;d love to hear from you. Reach out anytime!
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '48px', alignItems: 'start' }}>
            <div className="reveal-left">
              <div className="card" style={{ padding: '36px' }}>
                <h2 style={{ marginBottom: '24px' }}>Send Us a Message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid-2">
                    <div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="Your name" required /></div>
                    <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@email.com" required /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Subject</label><input className="form-input" placeholder="How can we help?" required /></div>
                  <div className="form-group"><label className="form-label">Message</label><textarea className="form-input form-textarea" placeholder="Your message..." required /></div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {sent ? <><Icon name="check" size={16} color="#fff" /> Message Sent!</> : <><Icon name="mail" size={16} color="#fff" /> Send Message</>}
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
                  { icon: 'clock', title: 'Hours', lines: ['Monday - Saturday: 12 PM - 5 PM', 'Sunday: Closed'], color: 'var(--blue-500)' },
                ].map((item, i) => (
                  <div key={i} className="card card-3d" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <IconCircle name={item.icon} size={44} color={item.color} bgOpacity={0.15} />
                    <div>
                      <div style={{ fontWeight: '700', marginBottom: '4px' }}>{item.title}</div>
                      {item.lines.map((l, j) => <div key={j} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{l}</div>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ marginTop: '16px', overflow: 'hidden', borderRadius: 'var(--radius-lg)', height: '250px' }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2783.8!2d-84.3127!3d46.5099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbCsDMwJzM2LjAiTiA4NMKwMTgnNDUuNyJX!5e0!3m2!1sen!2sca!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
