import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PawBackground from '@/components/effects/PawBackground';
import CursorGlow from '@/components/effects/CursorGlow';
import ScrollProgress from '@/components/effects/ScrollProgress';
import BackToTop from '@/components/effects/BackToTop';

export const metadata = {
  title: 'Sault Ste. Marie Humane Society — Find Your Furever Friend',
  description: 'The Sault Ste. Marie Humane Society is committed to improving the lives of animals through rescue, adoption, and education. Browse adoptable pets, apply to adopt, volunteer, foster, or donate.',
  keywords: 'humane society, sault ste marie, pet adoption, adopt a dog, adopt a cat, animal shelter, SSM, Ontario',
  openGraph: {
    title: 'Sault Ste. Marie Humane Society',
    description: 'Find your furever friend. Browse adoptable pets and apply today.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ScrollProgress />
        <CursorGlow />
        <PawBackground />
        <Navbar />
        <main id="main-content" style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
