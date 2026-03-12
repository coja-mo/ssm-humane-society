'use client';
import { useState } from 'react';
import useScrollReveal from '@/components/effects/useScrollReveal';

const FAQS = [
  { q: 'How do I adopt a pet?', a: 'Browse our available pets online, then fill out our interactive adoption application. Our staff will review your application and contact you within 2-3 business days. If approved, you\'ll be invited for a meet-and-greet!', icon: '🐾' },
  { q: 'What are the adoption fees?', a: 'Adoption fees vary by animal and help cover veterinary care including spay/neuter, vaccinations, microchipping, and deworming. Please contact us at 705-949-3573 for current fees.', icon: '💰' },
  { q: 'Can I visit the shelter to see animals?', a: 'Our viewing rooms are currently closed for public walk-ins. All adoptions are done by application. This helps us ensure the best match between animals and their new families.', icon: '🏠' },
  { q: 'How long does the adoption process take?', a: 'Typically 2-5 business days from application submission to bringing your new pet home. You can track your application status in your dashboard.', icon: '⏱️' },
  { q: 'What if the adoption doesn\'t work out?', a: 'We want every adoption to be successful. If issues arise, we offer support and guidance. If the placement truly isn\'t working, we will take the animal back — we never want an animal to end up homeless.', icon: '🤝' },
  { q: 'How can I become a foster parent?', a: 'Visit our Foster page and fill out a foster application. We provide all food, supplies, and veterinary care. You provide a loving temporary home!', icon: '❤️' },
  { q: 'Can I volunteer at the shelter?', a: 'Yes! We welcome volunteers for dog walking, cat socialization, kennel care, event support, and more. Visit our Volunteer page to apply.', icon: '🙋' },
  { q: 'Are donations tax-deductible?', a: 'Yes! We are a registered charity. Tax receipts are issued for donations of $20 or more. Charitable Registration #: 89238 0023 RR0001.', icon: '🧾' },
  { q: 'What should I do if I find a stray animal?', a: 'Contact us at 705-949-3573 or bring the animal to the shelter during open hours (Mon-Sat 12-5 PM). We work with animal control to reunite lost pets with their families.', icon: '🔍' },
  { q: 'What is your animal cruelty policy?', a: 'If you suspect animal cruelty or neglect, please contact the Ontario SPCA at 1-888-668-7722 or your local police. Animal cruelty is a criminal offense in Canada.', icon: '⚖️' },
];

export default function FAQPage() {
  useScrollReveal();
  const [open, setOpen] = useState(null);
  const [searchQ, setSearchQ] = useState('');

  const filtered = searchQ ? FAQS.filter(f => f.q.toLowerCase().includes(searchQ.toLowerCase()) || f.a.toLowerCase().includes(searchQ.toLowerCase())) : FAQS;

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>❓ Help Center</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Frequently Asked <span className="text-gradient">Questions</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', marginBottom: '24px' }}>
            Find answers to common questions about adoption, fostering, volunteering, and more.
          </p>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <input className="pet-search" placeholder="🔍 Search questions..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ width: '100%' }} />
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="reveal" style={{ display: 'grid', gap: '10px' }}>
            {filtered.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="card" style={{ overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)', borderColor: isOpen ? 'var(--border-accent)' : 'var(--border-light)' }}>
                  <button onClick={() => setOpen(isOpen ? null : i)} style={{
                    width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px',
                    fontWeight: '600', fontSize: '0.95rem', color: isOpen ? 'var(--text-accent)' : 'var(--text-primary)', textAlign: 'left', cursor: 'pointer',
                    background: 'none', border: 'none', fontFamily: 'inherit', transition: 'color 0.3s',
                  }}>
                    <span style={{ fontSize: '1.3rem', flexShrink: 0, width: '32px', textAlign: 'center' }}>{faq.icon}</span>
                    <span style={{ flex: 1 }}>{faq.q}</span>
                    <span style={{ fontSize: '1rem', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', color: 'var(--text-muted)', flexShrink: 0 }}>▼</span>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? '300px' : '0', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                    padding: isOpen ? '0 24px 20px 70px' : '0 24px 0 70px',
                  }}>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.9rem' }}>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center" style={{ padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🤔</div>
              <p>No questions match your search. <a href="/contact" style={{ color: 'var(--text-accent)', fontWeight: 600 }}>Contact us</a> directly!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
