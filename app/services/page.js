'use client';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';

export default function ServicesPage() {
  useScrollReveal();
  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Our <span className="text-gradient">Services</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            We provide a range of services to help animals and pet owners in our community.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="grid-3 stagger">
            {[
              { icon: '🏠', title: 'Adoption Services', desc: 'Browse available pets online and apply to adopt. Our staff will guide you through the process and help find your perfect match.', link: '/adopt' },
              { icon: '❤️', title: 'Foster Program', desc: 'Open your home temporarily to an animal in need. We provide supplies, veterinary care, and support throughout the fostering experience.', link: '/foster' },
              { icon: '🏥', title: 'Veterinary Care', desc: 'All shelter animals receive medical exams, vaccinations, spay/neuter surgery, microchipping, and any necessary treatment.', link: '/contact' },
              { icon: '🔍', title: 'Lost & Found', desc: 'Lost your pet? Found a stray? Contact us — we work with animal control to help reunite pets with their families.', link: '/contact' },
              { icon: '📚', title: 'Education Programs', desc: 'We offer educational programs about responsible pet ownership, animal welfare, and the benefits of adoption.', link: '/contact' },
              { icon: '🤝', title: 'Volunteer Opportunities', desc: 'Give your time to make a difference. We have volunteer opportunities for individuals, groups, and corporate teams.', link: '/volunteer' },
              { icon: '🐾', title: 'Animal Surrender', desc: 'If you can no longer care for your pet, contact us to discuss surrender options. We want to ensure every animal finds a safe home.', link: '/contact' },
              { icon: '🎗️', title: 'Community Outreach', desc: 'We participate in community events, school visits, and awareness campaigns to promote animal welfare across the Algoma District.', link: '/events' },
              { icon: '💊', title: 'Spay/Neuter Program', desc: 'All adopted animals are spayed/neutered. We advocate for spaying and neutering to reduce the number of homeless animals.', link: '/contact' },
            ].map((item, i) => (
              <Link key={i} href={item.link} className="card" style={{ textDecoration: 'none' }}>
                <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{item.icon}</div>
                  <h3 style={{ marginBottom: '12px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.9rem' }}>{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
