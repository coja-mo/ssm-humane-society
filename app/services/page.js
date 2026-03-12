'use client';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import Icon, { IconCircle } from '@/components/ui/Icon';

const SERVICES = [
  { icon: 'home', title: 'Adoption Services', desc: 'Browse available pets online and apply to adopt. Our staff will guide you through the process and help find your perfect match.', link: '/adopt', color: 'var(--blue-400)' },
  { icon: 'heart', title: 'Foster Program', desc: 'Open your home temporarily to an animal in need. We provide supplies, veterinary care, and support throughout the experience.', link: '/foster', color: 'var(--rose-400)' },
  { icon: 'medical', title: 'Veterinary Care', desc: 'All shelter animals receive medical exams, vaccinations, spay/neuter surgery, microchipping, and any necessary treatment.', link: '/contact', color: 'var(--green-500)' },
  { icon: 'search', title: 'Lost & Found', desc: 'Lost your pet? Found a stray? Contact us — we work with animal control to help reunite pets with their families.', link: '/contact', color: 'var(--blue-500)' },
  { icon: 'book', title: 'Education Programs', desc: 'We offer educational programs about responsible pet ownership, animal welfare, and the benefits of adoption.', link: '/contact', color: 'var(--blue-300)' },
  { icon: 'people', title: 'Volunteer Opportunities', desc: 'Give your time to make a difference. We have volunteer opportunities for individuals, groups, and corporate teams.', link: '/volunteer', color: 'var(--green-600)' },
  { icon: 'paw', title: 'Animal Surrender', desc: 'If you can no longer care for your pet, contact us to discuss surrender options. We want to ensure every animal finds a safe home.', link: '/contact', color: 'var(--rose-500)' },
  { icon: 'ribbon', title: 'Community Outreach', desc: 'We participate in community events, school visits, and awareness campaigns to promote animal welfare.', link: '/events', color: 'var(--blue-600)' },
  { icon: 'scissors', title: 'Spay/Neuter Program', desc: 'All adopted animals are spayed/neutered. We advocate for spaying and neutering to reduce the number of homeless animals.', link: '/contact', color: 'var(--green-700)' },
];

export default function ServicesPage() {
  useScrollReveal();
  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="medical" size={14} color="var(--blue-700)" /> How We Help
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Our <span className="text-gradient">Services</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            We provide a range of services to help animals and pet owners in our community.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="grid-3 stagger">
            {SERVICES.map((item, i) => (
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
    </>
  );
}
