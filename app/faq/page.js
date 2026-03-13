'use client';
import usePageTitle from '@/hooks/usePageTitle';
import { useState } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import Icon, { IconCircle } from '@/components/ui/Icon';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'book' },
  { id: 'adoption', label: 'Adoption', icon: 'paw' },
  { id: 'fostering', label: 'Fostering', icon: 'home' },
  { id: 'volunteering', label: 'Volunteering', icon: 'people' },
  { id: 'donations', label: 'Donations', icon: 'heart' },
  { id: 'general', label: 'General', icon: 'info' },
];

const FAQS = [
  { q: 'How do I adopt a pet?', a: 'Browse our available pets online, then fill out our interactive adoption application. Our staff will review your application and contact you within 2-3 business days. If approved, you\'ll be invited for a meet-and-greet!', icon: 'paw', cat: 'adoption', popular: true },
  { q: 'What are the adoption fees?', a: 'Adoption fees vary by animal and help cover veterinary care including spay/neuter, vaccinations, microchipping, and deworming. Dogs are typically $250-$400 and cats $150-$250. Senior pets often have reduced fees. Please contact us at 705-949-3573 for current fees.', icon: 'donate', cat: 'adoption', popular: true },
  { q: 'Can I visit the shelter to see animals?', a: 'Our viewing rooms are currently closed for public walk-ins. All adoptions are done by application. This helps us ensure the best match between animals and their new families while reducing stress on the animals.', icon: 'home', cat: 'adoption' },
  { q: 'How long does the adoption process take?', a: 'Typically 2-5 business days from application submission to bringing your new pet home. You can track your application status in your dashboard. Factors like landlord verification and reference checks may affect timing.', icon: 'clock', cat: 'adoption' },
  { q: 'What if the adoption doesn\'t work out?', a: 'We want every adoption to be successful. If issues arise, we offer support and guidance. If the placement truly isn\'t working, we will take the animal back — we never want an animal to end up homeless. Our 30-day trial period ensures a good fit.', icon: 'people', cat: 'adoption' },
  { q: 'What does the adoption fee include?', a: 'All adoption fees include: spay/neuter surgery, age-appropriate vaccinations, microchip with registration, flea and tick treatment, deworming, a veterinary health check, and a 2-week health guarantee. Many pets also come with a starter kit of food and toys.', icon: 'medical', cat: 'adoption', popular: true },
  { q: 'Can I adopt if I rent?', a: 'Yes! You will need to provide proof that your landlord allows pets. This can be a clause in your lease or a letter from your landlord. Our staff can help with any questions your landlord may have.', icon: 'home', cat: 'adoption' },
  { q: 'How can I become a foster parent?', a: 'Visit our Foster page and fill out a foster application. We provide all food, supplies, and veterinary care. You provide a loving temporary home! Most foster periods are 2-4 weeks, and you can specify your availability.', icon: 'heart', cat: 'fostering', popular: true },
  { q: 'What expenses do foster families cover?', a: 'None! We cover all costs including food, litter, medication, veterinary care, and supplies. We also provide a crate, leash, bowls, and other essentials. If your foster pet needs emergency vet care, simply bring them to our partner vet.', icon: 'donate', cat: 'fostering' },
  { q: 'Can I foster if I already have pets?', a: 'In many cases, yes! We match foster animals carefully with your household. You\'ll need to disclose your existing pets and we\'ll select animals that are cat-friendly or dog-friendly as needed. A meet-and-greet may be arranged.', icon: 'paw', cat: 'fostering' },
  { q: 'How long do foster periods last?', a: 'Foster periods typically range from 2 weeks to 3 months, depending on the animal\'s needs. Some animals need short-term care while recovering from surgery; others may need longer socialization. You can specify your preferred duration.', icon: 'calendar', cat: 'fostering' },
  { q: 'Can I volunteer at the shelter?', a: 'Yes! We welcome volunteers for dog walking, cat socialization, kennel care, event support, photography, admin work, and more. Volunteers must be 16 or older (14+ with a parent). Visit our Volunteer page to apply.', icon: 'handshake', cat: 'volunteering' },
  { q: 'What volunteer opportunities are available?', a: 'We have diverse roles including: dog walking, cat socialization, kennel cleaning, laundry, reception help, event planning, photography for pet profiles, social media management, fundraising, and grant writing. Something for everyone!', icon: 'people', cat: 'volunteering' },
  { q: 'Is there a minimum time commitment?', a: 'We ask for a minimum of 4 hours per month. Shifts are typically 2-3 hours and you can schedule at your convenience. Some events may require longer commitments. Corporate and group volunteer days are also available.', icon: 'clock', cat: 'volunteering' },
  { q: 'Are donations tax-deductible?', a: 'Yes! We are a registered Canadian charity. Tax receipts are automatically issued for donations of $20 or more. Our Charitable Registration Number is 89238 0023 RR0001.', icon: 'shield', cat: 'donations', popular: true },
  { q: 'What other ways can I support the shelter?', a: 'Beyond monetary donations, you can: donate supplies from our wish list, sponsor a specific animal\'s care, leave a legacy gift in your will, organize a fundraiser, shop at businesses that support us, or spread the word on social media.', icon: 'heart', cat: 'donations' },
  { q: 'Can I donate supplies instead of money?', a: 'Absolutely! We always need: dog and cat food (dry and wet), cat litter, blankets and towels, cleaning supplies, toys, leashes, collars, and pet beds. You can drop off donations during business hours or arrange a pickup.', icon: 'paw', cat: 'donations' },
  { q: 'What should I do if I find a stray animal?', a: 'Contact us at 705-949-3573 or bring the animal to the shelter during open hours (Mon-Sat 12-5 PM). We work with animal control to reunite lost pets with their families. You can also report found animals on our Lost & Found page.', icon: 'search', cat: 'general' },
  { q: 'What is your animal cruelty policy?', a: 'If you suspect animal cruelty or neglect, please contact the Ontario SPCA at 1-888-668-7722 or your local police. Animal cruelty is a criminal offense in Canada under the Criminal Code. We work closely with enforcement agencies.', icon: 'shield', cat: 'general' },
  { q: 'What are your hours and location?', a: 'We are located at 962 Second Line East, Sault Ste. Marie, ON P6B 4K4. Our hours are Monday through Saturday, 12 PM to 5 PM. We are closed on Sundays and statutory holidays. Surrenders and adoptions are by appointment.', icon: 'location', cat: 'general' },
  { q: 'How do I report a lost or found pet?', a: 'Visit our Lost & Found page to submit a report with photos and description. You can also call us at 705-949-3573. We cross-reference all reports and check for microchips on found animals. Share on our social media for maximum reach.', icon: 'search', cat: 'general' },
];

export default function FAQPage() {
  useScrollReveal();
  usePageTitle('FAQ');
  const [open, setOpen] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  const filtered = FAQS.filter(f => {
    if (activeCat !== 'all' && f.cat !== activeCat) return false;
    if (searchQ) return f.q.toLowerCase().includes(searchQ.toLowerCase()) || f.a.toLowerCase().includes(searchQ.toLowerCase());
    return true;
  });

  const popularFaqs = FAQS.filter(f => f.popular);

  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(41,171,226,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="book" size={14} color="var(--blue-700)" /> Help Center
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Frequently Asked <span className="text-gradient">Questions</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', marginBottom: '24px' }}>
            Find answers to common questions about adoption, fostering, volunteering, and more.
          </p>
          <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
            <Icon name="search" size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
            <input className="pet-search" placeholder="Search questions..." value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ width: '100%', paddingLeft: '38px' }} />
          </div>
        </div>
      </section>

      {/* Quick Answers */}
      {!searchQ && activeCat === 'all' && (
        <section style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <h3 className="reveal" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.78rem' }}>⭐ Most Popular</h3>
            <div className="grid-3 stagger" style={{ gap: '12px' }}>
              {popularFaqs.map((faq, i) => (
                <button key={i} onClick={() => { setOpen(FAQS.indexOf(faq)); }} className="card card-3d" style={{
                  textAlign: 'left', cursor: 'pointer', padding: '0', border: '1px solid var(--border-light)', overflow: 'hidden',
                }}>
                  <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--blue-400), var(--blue-600))' }} />
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <IconCircle name={faq.icon} size={36} color="var(--blue-400)" bgOpacity={0.12} style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.4, marginBottom: '4px' }}>{faq.q}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{faq.a}</div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filters */}
      <section style={{ paddingTop: '10px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="reveal" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => { setActiveCat(cat.id); setOpen(null); }} style={{
                padding: '8px 18px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                background: activeCat === cat.id ? 'linear-gradient(135deg, var(--blue-500), var(--blue-600))' : 'var(--bg-secondary)',
                color: activeCat === cat.id ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: activeCat === cat.id ? '0 2px 8px rgba(41,171,226,0.3)' : 'none',
              }}>
                <Icon name={cat.icon} size={14} color={activeCat === cat.id ? '#fff' : 'var(--text-muted)'} />
                {cat.label}
                {cat.id !== 'all' && <span style={{ padding: '0 6px', borderRadius: '100px', background: activeCat === cat.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-card)', fontSize: '0.72rem' }}>
                  {FAQS.filter(f => f.cat === cat.id).length}
                </span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="reveal" style={{ display: 'grid', gap: '10px' }}>
            {filtered.map((faq, i) => {
              const globalIdx = FAQS.indexOf(faq);
              const isOpen = open === globalIdx;
              return (
                <div key={globalIdx} className="card" style={{ overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)', borderColor: isOpen ? 'var(--border-accent)' : 'var(--border-light)' }}>
                  <button onClick={() => setOpen(isOpen ? null : globalIdx)} style={{
                    width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px',
                    fontWeight: '600', fontSize: '0.95rem', color: isOpen ? 'var(--text-accent)' : 'var(--text-primary)', textAlign: 'left', cursor: 'pointer',
                    background: 'none', border: 'none', fontFamily: 'inherit', transition: 'color 0.3s',
                  }}>
                    <Icon name={faq.icon} size={20} color={isOpen ? 'var(--blue-500)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{faq.q}</span>
                    {faq.popular && !isOpen && <span style={{ padding: '2px 8px', borderRadius: '100px', background: 'var(--blue-50)', color: 'var(--blue-600)', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>Popular</span>}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', color: 'var(--text-muted)', flexShrink: 0 }}>
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? '300px' : '0', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                    padding: isOpen ? '0 24px 20px 58px' : '0 24px 0 58px',
                  }}>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.9rem' }}>{faq.a}</p>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '100px', background: 'var(--bg-secondary)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{faq.cat}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center" style={{ padding: '60px 0', color: 'var(--text-muted)' }}>
              <Icon name="search" size={48} color="var(--text-muted)" style={{ display: 'block', margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ marginBottom: '12px' }}>No questions match your search.</p>
              <Link href="/contact" style={{ color: 'var(--text-accent)', fontWeight: 600 }}>Contact us</Link> directly!
            </div>
          )}
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="grid-3 stagger">
            {[
              { icon: 'phone', title: 'Call Us', desc: '705-949-3573', sub: 'Mon-Sat 12-5 PM', color: 'var(--green-500)', href: 'tel:7059493573' },
              { icon: 'mail', title: 'Email Us', desc: 'info@ssmhumanesociety.ca', sub: '1-2 business day response', color: 'var(--blue-500)', href: 'mailto:info@ssmhumanesociety.ca' },
              { icon: 'location', title: 'Visit Us', desc: '962 Second Line East', sub: 'Sault Ste. Marie, ON', color: 'var(--rose-400)', href: '/contact' },
            ].map((c, i) => (
              <a key={i} href={c.href} className="card card-3d" style={{ textDecoration: 'none', textAlign: 'center', padding: '32px' }}>
                <IconCircle name={c.icon} size={52} color={c.color} bgOpacity={0.15} style={{ margin: '0 auto 14px' }} />
                <h3 style={{ marginBottom: '6px', fontSize: '1rem' }}>{c.title}</h3>
                <p style={{ color: 'var(--text-accent)', fontWeight: 600, fontSize: '0.9rem' }}>{c.desc}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>{c.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section">
        <div className="container text-center reveal" style={{ maxWidth: '500px' }}>
          <IconCircle name="phone" size={52} color="var(--blue-400)" bgOpacity={0.12} style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Still Have <span className="text-gradient">Questions</span>?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.7 }}>
            Can&apos;t find what you&apos;re looking for? Our team is here to help.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary" style={{ borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="mail" size={16} color="#fff" /> Contact Us
            </Link>
            <a href="tel:7059493573" className="btn btn-secondary" style={{ borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="phone" size={16} /> 705-949-3573
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
