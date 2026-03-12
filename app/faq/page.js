'use client';
import { useState } from 'react';
import useScrollReveal from '@/components/effects/useScrollReveal';

const FAQS = [
  { q: 'How do I adopt a pet?', a: 'Browse our available pets online, then fill out our interactive adoption application. Our staff will review your application and contact you within 2-3 business days. If approved, you\'ll be invited for a meet-and-greet!' },
  { q: 'What are the adoption fees?', a: 'Adoption fees vary by animal and help cover veterinary care including spay/neuter, vaccinations, microchipping, and deworming. Please contact us at 705-949-3573 for current fees.' },
  { q: 'Can I visit the shelter to see animals?', a: 'Our viewing rooms are currently closed for public walk-ins. All adoptions are done by application. This helps us ensure the best match between animals and their new families.' },
  { q: 'How long does the adoption process take?', a: 'Typically 2-5 business days from application submission to bringing your new pet home. You can track your application status in your dashboard.' },
  { q: 'What if the adoption doesn\'t work out?', a: 'We want every adoption to be successful. If issues arise, we offer support and guidance. If the placement truly isn\'t working, we will take the animal back — we never want an animal to end up homeless.' },
  { q: 'How can I become a foster parent?', a: 'Visit our Foster page and fill out a foster application. We provide all food, supplies, and veterinary care. You provide a loving temporary home!' },
  { q: 'Can I volunteer at the shelter?', a: 'Yes! We welcome volunteers for dog walking, cat socialization, kennel care, event support, and more. Visit our Volunteer page to apply.' },
  { q: 'Are donations tax-deductible?', a: 'Yes! We are a registered charity. Tax receipts are issued for donations of $20 or more. Charitable Registration #: 89238 0023 RR0001.' },
  { q: 'What should I do if I find a stray animal?', a: 'Contact us at 705-949-3573 or bring the animal to the shelter during open hours (Mon-Sat 12-5 PM). We work with animal control to reunite lost pets with their families.' },
  { q: 'What is your animal cruelty policy?', a: 'If you suspect animal cruelty or neglect, please contact the Ontario SPCA at 1-888-668-7722 or your local police. Animal cruelty is a criminal offense in Canada.' },
];

export default function FAQPage() {
  useScrollReveal();
  const [open, setOpen] = useState(null);
  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Frequently Asked <span className="text-gradient">Questions</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Find answers to common questions about adoption, fostering, volunteering, and more.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="reveal" style={{ display: 'grid', gap: '12px' }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="card" style={{ overflow: 'hidden' }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{
                  width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontWeight: '600', fontSize: '1rem', color: 'var(--text-primary)', textAlign: 'left', cursor: 'pointer',
                  background: 'none', border: 'none', fontFamily: 'inherit',
                }}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '1.2rem', transition: 'transform 0.3s', transform: open === i ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                </button>
                <div style={{
                  maxHeight: open === i ? '300px' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease',
                  padding: open === i ? '0 24px 20px' : '0 24px',
                }}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
