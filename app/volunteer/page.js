'use client';
import useScrollReveal from '@/components/effects/useScrollReveal';

export default function VolunteerPage() {
  useScrollReveal();
  return (
    <>
      <section style={{ paddingTop: '120px', paddingBottom: '40px', background: 'linear-gradient(180deg, var(--blue-50) 0%, var(--bg-primary) 100%)' }}>
        <div className="container text-center">
          <span className="badge badge-blue" style={{ marginBottom: '12px', display: 'inline-block' }}>🤝 Join Our Team</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '12px' }}>Become a <span className="text-gradient">Volunteer</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Your time and skills can make a real difference in the lives of shelter animals. Join over 250 volunteers who help us every year!
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="grid-3 stagger" style={{ marginBottom: '48px' }}>
            {[
              { icon: '🐕', title: 'Dog Walking', desc: 'Help our dogs get exercise and socialization. Walk dogs around the shelter grounds and help them burn off energy.' },
              { icon: '🐈', title: 'Cat Socialization', desc: 'Spend time with our cats — playing, grooming, and giving them the attention they need to thrive.' },
              { icon: '🧹', title: 'Kennel Care', desc: 'Help keep our shelter clean and comfortable for the animals. Cleaning, feeding, and daily maintenance.' },
              { icon: '📸', title: 'Photography', desc: 'Take photos of our adoptable animals to help them get noticed online and find homes faster.' },
              { icon: '🎉', title: 'Event Support', desc: 'Help organize and run fundraising events, adoption drives, and community outreach activities.' },
              { icon: '💻', title: 'Admin Support', desc: 'Help with data entry, phone calls, social media, and other administrative tasks.' },
            ].map((item, i) => (
              <div key={i} className="card">
                <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{item.icon}</div>
                  <h3 style={{ marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.9rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card reveal" style={{ padding: '40px', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Volunteer Application</h2>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="Full name" /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@email.com" /></div>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" type="tel" placeholder="(705) 555-0123" /></div>
              <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" placeholder="18" /></div>
            </div>
            <div className="form-group"><label className="form-label">Areas of Interest</label><textarea className="form-input form-textarea" placeholder="Which volunteer roles interest you?" /></div>
            <div className="form-group"><label className="form-label">Availability</label>
              <select className="form-input form-select"><option>Weekdays</option><option>Weekends</option><option>Both</option><option>Evenings Only</option></select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>Apply to Volunteer 🤝</button>
          </div>
        </div>
      </section>
    </>
  );
}
