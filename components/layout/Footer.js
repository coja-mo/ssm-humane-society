import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">🐾 SSM Humane Society</div>
            <p className="footer-desc">
              The Sault Ste. Marie Humane Society is committed to improving the lives of animals through rescue, adoption, and education. Together, we can make a difference.
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <a href="https://www.facebook.com/ssmhumanesociety/" target="_blank" rel="noopener noreferrer" className="btn btn-icon" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%' }}>f</a>
              <a href="https://www.instagram.com/ssmhumanesociety/" target="_blank" rel="noopener noreferrer" className="btn btn-icon" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%' }}>📷</a>
            </div>
          </div>
          <div>
            <div className="footer-title">Adopt</div>
            <ul className="footer-links">
              <li><Link href="/adopt">All Pets</Link></li>
              <li><Link href="/adopt?type=dog">Dogs</Link></li>
              <li><Link href="/adopt?type=cat">Cats</Link></li>
              <li><Link href="/adopt?type=critter">Critters</Link></li>
              <li><Link href="/apply/dog">Apply to Adopt</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-title">Get Involved</div>
            <ul className="footer-links">
              <li><Link href="/donate">Donate</Link></li>
              <li><Link href="/foster">Foster</Link></li>
              <li><Link href="/volunteer">Volunteer</Link></li>
              <li><Link href="/events">Events</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-title">Contact</div>
            <ul className="footer-links">
              <li>📍 962 Second Line East</li>
              <li>Sault Ste. Marie, ON P6B 4K4</li>
              <li>📞 705-949-3573</li>
              <li>📠 705-949-0169</li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sault Ste. Marie Humane Society. All rights reserved.</span>
          <div className="footer-socials">
            <span>Proud members of their community 💙</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
