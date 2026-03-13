'use client';
import usePageTitle from '@/hooks/usePageTitle';
import Link from 'next/link';
import useScrollReveal from '@/components/effects/useScrollReveal';
import AnimatedCounter from '@/components/effects/AnimatedCounter';
import Icon, { IconCircle } from '@/components/ui/Icon';

const HAPPY_TAILS = [
  {
    name: 'Tucker & The Mitchell Family',
    pet: 'Tucker', petType: 'dog',
    quote: 'Tucker was at the shelter for 3 months before we found him. Now he\'s the center of our family — hiking buddy, couch companion, and best friend to our kids.',
    timeframe: 'Adopted 2025',
    color: 'var(--blue-400)',
  },
  {
    name: 'Luna & Sarah',
    pet: 'Luna', petType: 'cat',
    quote: 'I wasn\'t sure about adopting a senior cat, but Luna changed everything. She\'s the calmest, most affectionate soul. Seniors have so much love to give.',
    timeframe: 'Adopted 2024',
    color: 'var(--rose-400)',
  },
  {
    name: 'Biscuit & The Patels',
    pet: 'Biscuit', petType: 'dog',
    quote: 'We fostered Biscuit and fell in love within a week. The shelter team made the foster-to-adopt transition seamless. He\'s home forever now.',
    timeframe: 'Foster-to-Adopt 2025',
    color: 'var(--green-500)',
  },
];

export default function AboutPage() {
  useScrollReveal();
  usePageTitle('About Us');
  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '60px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '0', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative' }}>
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="paw" size={14} color="var(--blue-700)" /> About Us
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '16px' }}>
            Saving Lives <span className="text-gradient">Since 1978</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8', fontSize: '1.05rem' }}>
            The Sault Ste. Marie Humane Society is committed to improving the lives of animals through rescue, adoption, and education. We are a registered charity serving the Algoma District.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '64px' }}>
            <div className="reveal-left">
              <span className="badge badge-blue" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="heart" size={14} color="var(--blue-700)" /> Our Story
              </span>
              <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Our <span className="text-gradient">Mission</span></h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                We exist to protect and improve the lives of animals in our community. Through rescue operations, adoption services, foster programs, and community education, we work tirelessly to ensure every animal has the chance to live a happy, healthy life.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                Our shelter at 962 Second Line East houses over 100 animals on any given day. We rely on the generosity of our community — every donation, volunteer hour, and adoption makes a real difference.
              </p>
            </div>
            <div className="reveal-right" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { n: 1847, label: 'Pets Adopted', icon: 'home', color: 'var(--blue-500)' },
                { n: 250, label: 'Volunteers', icon: 'people', suffix: '+', color: 'var(--green-500)' },
                { n: 45, label: 'Years Serving SSM', icon: 'calendar', suffix: '+', color: 'var(--rose-400)' },
                { n: 100, label: 'Animals in Care', icon: 'paw', suffix: '+', color: 'var(--blue-400)' },
              ].map((s) => (
                <div key={s.label} className="card card-3d" style={{ textAlign: 'center', padding: '28px 20px' }}>
                  <IconCircle name={s.icon} size={48} color={s.color} bgOpacity={0.15} style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: s.color }}>
                    <AnimatedCounter target={s.n} suffix={s.suffix || ''} />
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 className="text-center reveal" style={{ fontSize: '2rem', marginBottom: '40px' }}>Our <span className="text-gradient">Journey</span></h2>
          <div className="timeline reveal">
            {[
              { year: '1978', title: 'Founded', desc: 'The Sault Ste. Marie Humane Society was established by a group of passionate animal welfare advocates.' },
              { year: '1995', title: 'New Shelter', desc: 'Moved to our current location at 962 Second Line East, providing a larger facility for animals in need.' },
              { year: '2010', title: 'Foster Program Launch', desc: 'Launched our foster care program, dramatically increasing our capacity to help animals.' },
              { year: '2024', title: 'Digital Transformation', desc: 'Launched our online adoption application system and digital community platform.' },
              { year: 'Today', title: '45+ Years of Service', desc: 'Continuing to serve the Algoma District with rescue, adoption, education, and community programs.' },
            ].map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-date">{item.year}</div>
                <h4 style={{ marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark wave-divider-top">
        <div className="container">
          <h2 className="text-center reveal" style={{ fontSize: '2rem', marginBottom: '40px' }}>What <span style={{ color: 'var(--blue-400)' }}>We Do</span></h2>
          <div className="grid-3 stagger">
            {[
              { icon: 'medical', title: 'Rescue & Shelter', desc: 'We provide a safe haven for abandoned, surrendered, and stray animals. Our team assesses each animal\'s needs and provides appropriate care.', color: 'var(--blue-400)' },
              { icon: 'home', title: 'Adoption Services', desc: 'Our application-based adoption process helps match pets with the right families. We ensure every adoption is a success through careful screening.', color: 'var(--green-500)' },
              { icon: 'heart', title: 'Foster Program', desc: 'Our foster network provides temporary homes for animals who need extra care. Foster parents play a critical role in our mission.', color: 'var(--rose-400)' },
              { icon: 'book', title: 'Community Education', desc: 'We educate the public on responsible pet ownership, animal welfare, and the importance of spaying/neutering.', color: 'var(--blue-300)' },
              { icon: 'shield', title: 'Medical Care', desc: 'Every animal receives veterinary exams, vaccinations, spay/neuter surgery, and any necessary medical treatment.', color: 'var(--green-600)' },
              { icon: 'search', title: 'Lost & Found', desc: 'We help reunite lost pets with their families and work closely with animal control services in our community.', color: 'var(--blue-500)' },
            ].map((item, i) => (
              <div key={i} className="card card-3d" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                  <IconCircle name={item.icon} size={56} color={item.color} bgOpacity={0.2} style={{ margin: '0 auto 16px', animation: `float ${3 + i * 0.5}s ease-in-out infinite` }} />
                  <h3 style={{ marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ color: '#94A3B8', lineHeight: '1.7', fontSize: '0.9rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Happy Tails - Success Stories */}
      <section className="section">
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '48px' }}>
            <span className="badge badge-rose" style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="heart" size={14} color="var(--rose-600)" /> Success Stories
            </span>
            <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Happy <span className="text-gradient-warm">Tails</span></h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
              Real stories from families whose lives were changed by adoption.
            </p>
          </div>
          <div className="grid-3 stagger">
            {HAPPY_TAILS.map((story, i) => (
              <div key={i} className="card card-3d" style={{ overflow: 'hidden' }}>
                <div style={{ height: '4px', background: story.color }} />
                <div style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: `linear-gradient(135deg, ${story.color}22, ${story.color}11)`,
                      border: `2px solid ${story.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}>
                      {story.petType === 'dog' ? '🐕' : story.petType === 'cat' ? '🐈' : '🐾'}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>{story.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: story.color, fontWeight: 600 }}>{story.timeframe}</span>
                    </div>
                  </div>
                  <p style={{
                    fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.8',
                    fontSize: '0.9rem', position: 'relative', paddingLeft: '16px',
                    borderLeft: `3px solid ${story.color}33`,
                  }}>
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center reveal" style={{ marginTop: '36px' }}>
            <Link href="/stories" className="btn btn-primary" style={{
              borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}>
              <Icon name="heart" size={16} color="#fff" /> Read More Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="text-center reveal" style={{ marginBottom: '8px' }}>Our <span className="text-gradient">Team</span></h2>
          <p className="text-center reveal" style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>
            Dedicated professionals and volunteers who make it all possible
          </p>
          <div className="grid-3 stagger">
            {[
              { name: 'Karen MacDonald', role: 'Executive Director', years: 12, color: 'var(--blue-500)', initials: 'KM', desc: 'Leading shelter operations and community partnerships with 12 years of animal welfare experience.' },
              { name: 'Dr. Lisa Chen', role: 'Shelter Veterinarian', years: 8, color: 'var(--green-500)', initials: 'LC', desc: 'Providing compassionate medical care for all shelter animals and overseeing health protocols.' },
              { name: 'Mike Johnson', role: 'Adoptions Manager', years: 6, color: 'var(--rose-400)', initials: 'MJ', desc: 'Matching animals with their perfect families and managing the adoption process.' },
              { name: 'Sarah Thompson', role: 'Volunteer Coordinator', years: 4, color: '#8B5CF6', initials: 'ST', desc: 'Recruiting, training, and scheduling our incredible team of 250+ volunteers.' },
              { name: 'David Wright', role: 'Animal Care Lead', years: 10, color: 'var(--blue-400)', initials: 'DW', desc: 'Managing daily care routines, feeding schedules, and enrichment programs.' },
              { name: 'Emily Parker', role: 'Community Outreach', years: 3, color: '#F59E0B', initials: 'EP', desc: 'Building relationships with schools, businesses, and organizations across the district.' },
            ].map((member, i) => (
              <div key={i} className="card card-3d" style={{ textAlign: 'center', padding: '28px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 14px',
                  background: `linear-gradient(135deg, ${member.color}22, ${member.color}44)`,
                  border: `2px solid ${member.color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1.1rem', color: member.color,
                }}>
                  {member.initials}
                </div>
                <h4 style={{ marginBottom: '4px', fontSize: '0.95rem' }}>{member.name}</h4>
                <div style={{ fontSize: '0.78rem', color: member.color, fontWeight: 600, marginBottom: '8px' }}>{member.role}</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '8px' }}>{member.desc}</p>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{member.years} years of service</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="text-center reveal" style={{ marginBottom: '32px' }}>Our Core <span className="text-gradient">Values</span></h2>
          <div className="grid-4 stagger">
            {[
              { icon: 'heart', title: 'Compassion', desc: 'Every animal deserves kindness, care, and dignity', color: 'var(--rose-400)' },
              { icon: 'shield', title: 'Integrity', desc: 'Transparent, ethical practices in everything we do', color: 'var(--blue-500)' },
              { icon: 'people', title: 'Community', desc: 'Building partnerships that strengthen our mission', color: 'var(--green-500)' },
              { icon: 'star', title: 'Excellence', desc: 'Setting the standard for animal welfare in our region', color: '#F59E0B' },
            ].map((v, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
                <IconCircle name={v.icon} size={48} color={v.color} bgOpacity={0.15} style={{ margin: '0 auto 14px' }} />
                <h4 style={{ marginBottom: '6px', fontSize: '0.95rem' }}>{v.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container text-center reveal">
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Visit <span className="text-gradient">Our Shelter</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>962 Second Line East, Sault Ste. Marie, ON P6B 4K4</p>
          <div className="grid-3" style={{ maxWidth: '600px', margin: '0 auto', gap: '24px' }}>
            {[
              { label: 'Mon-Sat', value: '12 PM - 5 PM', icon: 'clock' },
              { label: 'Sunday', value: 'Closed', icon: 'calendar' },
              { label: 'Phone', value: '705-949-3573', icon: 'phone', accent: true },
            ].map((item, i) => (
              <div key={i} className="card card-3d" style={{ padding: '24px', textAlign: 'center' }}>
                <IconCircle name={item.icon} size={40} color={item.accent ? 'var(--text-accent)' : 'var(--blue-400)'} bgOpacity={0.12} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: '700', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ color: item.accent ? 'var(--text-accent)' : 'var(--text-muted)', fontSize: '0.9rem' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
