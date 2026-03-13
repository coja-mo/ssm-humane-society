'use client';
import usePageTitle from '@/hooks/usePageTitle';
import { useState } from 'react';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const PET_SERVICES = [
  { icon: 'home', title: 'Adoption Services', desc: 'Browse available pets online and apply to adopt. Our staff will guide you through the process and help find your perfect match. All adoptions include a thorough screening to ensure the best fit.', details: ['Online application system', 'Meet-and-greet scheduling', 'Home visit assessment', 'Post-adoption support'], link: '/adopt', color: 'var(--blue-400)', popular: true },
  { icon: 'heart', title: 'Foster Program', desc: 'Open your home temporarily to an animal in need. We provide supplies, veterinary care, and support throughout the experience. Choose from short-term medical fosters or longer socialization placements.', details: ['All supplies provided', 'Veterinary care covered', 'Training support', 'Flexible time commitments'], link: '/foster', color: 'var(--rose-400)', popular: false },
  { icon: 'medical', title: 'Veterinary Care', desc: 'All shelter animals receive comprehensive medical care including exams, vaccinations, spay/neuter surgery, microchipping, dental care, and any necessary treatment.', details: ['Full medical exams', 'Age-appropriate vaccinations', 'Dental evaluation', 'Parasite treatment'], link: '/contact', color: 'var(--green-500)', popular: false },
  { icon: 'scissors', title: 'Spay/Neuter Program', desc: 'All adopted animals are spayed/neutered. We advocate for responsible pet ownership and offer community programs to help reduce overpopulation.', details: ['Included in adoption fee', 'Community program available', 'Licensed veterinarian on staff', 'Post-surgery recovery support'], link: '/contact', color: 'var(--green-700)', popular: true },
];

const COMMUNITY_SERVICES = [
  { icon: 'search', title: 'Lost & Found', desc: 'Lost your pet? Found a stray? Contact us — we work with animal control and use our matching system to help reunite pets with their families quickly.', link: '/lost-found', color: 'var(--blue-500)' },
  { icon: 'book', title: 'Education Programs', desc: 'We offer educational programs about responsible pet ownership, animal welfare, and the benefits of adoption for schools and community groups.', link: '/contact', color: 'var(--blue-300)' },
  { icon: 'people', title: 'Volunteer Opportunities', desc: 'Give your time to make a difference. We have volunteer opportunities including dog walking, cat socialization, event support, and more.', link: '/volunteer', color: 'var(--green-600)' },
  { icon: 'paw', title: 'Animal Surrender', desc: 'If you can no longer care for your pet, contact us to discuss surrender options. We ensure every animal finds a safe home with dignity.', link: '/surrender', color: 'var(--rose-500)' },
  { icon: 'ribbon', title: 'Community Outreach', desc: 'We participate in community events, school visits, and awareness campaigns to promote animal welfare across the Algoma District.', link: '/events', color: 'var(--blue-600)' },
  { icon: 'shield', title: 'Behavioral Support', desc: 'Struggling with pet behavior? Our experienced staff can provide guidance, training tips, and resources before you consider surrender.', link: '/contact', color: '#8B5CF6' },
];

const PARTNERS = [
  { name: 'Algoma Animal Hospital', type: 'Veterinary Partner' },
  { name: 'PetSmart Sault Ste. Marie', type: 'Retail Partner' },
  { name: 'Ontario SPCA', type: 'Provincial Partner' },
  { name: 'Sault Ste. Marie Police', type: 'Enforcement Partner' },
];

export default function ServicesPage() {
  useScrollReveal();
  usePageTitle('Our Services');
  const [expandedService, setExpandedService] = useState(null);

  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="medical" size={14} color="var(--blue-700)" /> How We Help
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Our <span className="text-gradient">Services</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            We provide a comprehensive range of services to help animals and pet owners across the Algoma District.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div className="container glass" style={{
          display: 'flex', justifyContent: 'space-around', padding: '28px 32px',
          flexWrap: 'wrap', gap: '20px', borderRadius: 'var(--radius-xl)',
          maxWidth: '750px', margin: '0 auto', position: 'relative', top: '-28px',
        }}>
          {[
            { target: 10, label: 'Services Offered', icon: 'medical', color: 'var(--blue-500)' },
            { target: 1847, label: 'Animals Helped', icon: 'paw', color: 'var(--green-500)' },
            { target: 45, label: 'Years of Service', suffix: '+', icon: 'calendar', color: 'var(--rose-400)' },
            { target: 4, label: 'Partner Orgs', icon: 'people', color: '#F59E0B' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: stat.color }}>
                <AnimatedCounter target={stat.target} suffix={stat.suffix || ''} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pet Services — now with expandable details */}
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Pet <span className="text-gradient">Services</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Direct care and support for animals in our shelter.</p>
          </div>
          <div className="grid-2 stagger" style={{ gap: '20px' }}>
            {PET_SERVICES.map((item, i) => {
              const isExpanded = expandedService === i;
              return (
                <div key={i} className="card card-3d" style={{ position: 'relative', overflow: 'hidden' }}>
                  {item.popular && (
                    <div style={{
                      position: 'absolute', top: '12px', right: '12px',
                      padding: '3px 10px', borderRadius: '100px',
                      background: item.color, color: '#fff', fontSize: '0.65rem',
                      fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', zIndex: 1,
                    }}>
                      Popular
                    </div>
                  )}
                  <div style={{ height: '4px', background: item.color }} />
                  <div className="card-body" style={{ padding: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <IconCircle name={item.icon} size={56} color={item.color} bgOpacity={0.15} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: '8px' }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.9rem', marginBottom: '12px' }}>{item.desc}</p>

                      {/* Expandable Details */}
                      <div style={{ maxHeight: isExpanded ? '200px' : '0', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                        <div style={{ paddingTop: '12px', paddingBottom: '8px', borderTop: '1px solid var(--border-light)' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Includes</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            {item.details.map((d, j) => (
                              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                <Icon name="check" size={12} color={item.color} /> {d}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                        <button onClick={() => setExpandedService(isExpanded ? null : i)} style={{
                          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                          color: 'var(--text-accent)', fontWeight: 600, fontSize: '0.85rem',
                          display: 'inline-flex', alignItems: 'center', gap: '4px', padding: 0
                        }}>
                          {isExpanded ? 'Show less' : 'Learn more'} <Icon name="arrow" size={14} color="var(--text-accent)" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
                        </button>
                        <Link href={item.link} style={{ color: item.color, fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none', opacity: 0.8 }}>
                          Get started →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Services */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Community <span className="text-gradient">Programs</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Engaging our community to build a better world for animals.</p>
          </div>
          <div className="grid-3 stagger">
            {COMMUNITY_SERVICES.map((item, i) => (
              <Link key={i} href={item.link} className="card card-3d" style={{ textDecoration: 'none' }}>
                <div style={{ height: '4px', background: item.color }} />
                <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                  <IconCircle name={item.icon} size={56} color={item.color} bgOpacity={0.15} style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ marginBottom: '12px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.9rem' }}>{item.desc}</p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '16px', color: 'var(--text-accent)', fontWeight: 600, fontSize: '0.85rem' }}>
                    Learn more <Icon name="arrow" size={14} color="var(--text-accent)" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Partners */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="text-center reveal" style={{ marginBottom: '8px' }}>Our <span className="text-gradient">Partners</span></h2>
          <p className="text-center reveal" style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>Working together to make our community better for animals</p>
          <div className="grid-4 stagger" style={{ gap: '12px' }}>
            {PARTNERS.map((p, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', margin: '0 auto 12px' }}>🤝</div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '4px' }}>{p.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.type}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="story-card reveal-scale" style={{ padding: '40px', textAlign: 'center' }}>
            <IconCircle name="heart" size={56} color="var(--rose-400)" bgOpacity={0.15} style={{ margin: '0 auto 20px' }} />
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.9', maxWidth: '500px', margin: '0 auto 20px', fontSize: '1.05rem' }}>
              &ldquo;The team at the humane society went above and beyond to help us find the perfect family dog. Their adoption process was smooth, supportive, and clearly designed with the animal&apos;s best interest in mind.&rdquo;
            </p>
            <p style={{ fontWeight: 700 }}>— Rachel & James T.</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Adopted Cooper, 2025</p>
          </div>
        </div>
      </section>

      {/* Adoption Fees */}
      <section className="section">
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '12px' }}>
              Adoption <span className="text-gradient">Fees</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
              All fees include spay/neuter, vaccinations, microchip, and health check.
            </p>
          </div>
          <div className="grid-4 stagger" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {[
              { animal: 'Dog', price: '$300', includes: ['Spay/Neuter', 'Vaccinations', 'Microchip', 'Heartworm test', 'Flea treatment', 'Deworming'], icon: '🐕', popular: true },
              { animal: 'Cat', price: '$175', includes: ['Spay/Neuter', 'Vaccinations', 'Microchip', 'FeLV/FIV test', 'Flea treatment', 'Deworming'], icon: '🐈', popular: false },
              { animal: 'Kitten', price: '$200', includes: ['Spay/Neuter', 'Vaccinations', 'Microchip', 'FeLV test', 'Flea treatment', 'First vet visit'], icon: '🐱', popular: true },
              { animal: 'Small Animal', price: '$50', includes: ['Health check', 'Parasite treatment', 'Care guide', 'Starter supplies', 'Diet info'], icon: '🐰', popular: false },
            ].map((item, i) => (
              <div key={i} className="card card-3d" style={{ padding: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                {item.popular && (
                  <div style={{ position: 'absolute', top: '12px', right: '-32px', transform: 'rotate(45deg)', background: 'var(--blue-500)', color: '#fff', padding: '4px 40px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em' }}>POPULAR</div>
                )}
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{item.icon}</div>
                <h3 style={{ marginBottom: '4px', fontSize: '1.05rem' }}>{item.animal}</h3>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-accent)', marginBottom: '16px' }}>{item.price}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
                  {item.includes.map((inc, j) => (
                    <li key={j} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '6px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Icon name="check" size={12} color="var(--green-500)" /> {inc}
                    </li>
                  ))}
                </ul>
                <Link href="/adopt" className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '16px', borderRadius: 'var(--radius-lg)' }}>
                  Browse {item.animal}s
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service FAQ */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <h2 className="text-center reveal" style={{ marginBottom: '32px' }}>
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <div className="stagger" style={{ display: 'grid', gap: '12px' }}>
            {[
              { q: 'What does the adoption fee include?', a: 'Every adoption includes spay/neuter surgery, age-appropriate vaccinations, microchip implantation and registration, a basic health exam, parasite treatment, and a take-home care package. Dogs also receive a heartworm test, and cats receive FeLV/FIV testing.' },
              { q: 'Do you offer low-cost veterinary services to the public?', a: 'Our primary veterinary services are for shelter animals. However, we do run periodic low-cost spay/neuter clinics open to the public. Follow our events page or sign up for our newsletter to be notified of upcoming clinics.' },
              { q: 'How does the foster program work?', a: 'We provide everything your foster pet needs: food, litter, crate, toys, and veterinary care. Foster periods typically range from 2-8 weeks. You\'ll receive training and have 24/7 support from our foster coordinator. Visit our foster page for the full details.' },
              { q: 'Can I surrender my pet to the shelter?', a: 'Yes, though we encourage you to explore alternatives first. We offer behavioral support, temporary fostering, and rehoming assistance. If surrender is the best option, contact us to schedule an intake appointment. A surrender fee may apply.' },
              { q: 'Do you operate a trap-neuter-return (TNR) program?', a: 'Yes! Our TNR program helps manage community cat colonies humanely. We provide traps, perform spay/neuter, and return cats to their colony. Contact us for assistance with feral cats in your neighbourhood.' },
            ].map((item, i) => (
              <details key={i} className="card" style={{ padding: 0, cursor: 'pointer' }}>
                <summary style={{ padding: '18px 24px', fontWeight: 600, fontSize: '0.95rem', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  {item.q}
                  <Icon name="arrow" size={14} color="var(--text-muted)" style={{ transform: 'rotate(90deg)', flexShrink: 0, transition: 'transform 0.2s' }} />
                </summary>
                <div style={{ padding: '0 24px 18px', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Dark CTA Section */}
      <section className="section section-dark" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <h2 className="reveal" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '16px' }}>
            How Can <span style={{ color: 'var(--blue-400)' }}>You Help</span>?
          </h2>
          <p className="reveal" style={{ color: '#94A3B8', maxWidth: '500px', margin: '0 auto 40px', lineHeight: '1.7' }}>
            Whether you adopt, foster, volunteer, or donate — every action makes a difference in the life of an animal.
          </p>
          <div className="grid-4 stagger" style={{ maxWidth: '900px', margin: '0 auto 40px' }}>
            {[
              { icon: 'paw', title: 'Adopt', desc: 'Give a pet their forever home', link: '/adopt', color: 'var(--blue-400)' },
              { icon: 'home', title: 'Foster', desc: 'Provide temporary safe haven', link: '/foster', color: 'var(--green-500)' },
              { icon: 'people', title: 'Volunteer', desc: 'Donate your time and skills', link: '/volunteer', color: 'var(--rose-400)' },
              { icon: 'heart', title: 'Donate', desc: 'Fund critical animal care', link: '/donate', color: '#F59E0B' },
            ].map((item, i) => (
              <Link key={i} href={item.link} className="card" style={{
                background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)',
                textAlign: 'center', padding: '32px 20px', textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}>
                <IconCircle name={item.icon} size={48} color={item.color} bgOpacity={0.15} style={{ margin: '0 auto 14px' }} />
                <h4 style={{ marginBottom: '6px', color: '#F1F5F9' }}>{item.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{item.desc}</p>
              </Link>
            ))}
          </div>
          <Link href="/contact" className="btn btn-primary btn-lg reveal" style={{ borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="mail" size={18} color="#fff" /> Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
