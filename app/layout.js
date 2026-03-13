import './globals.css';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Lazy-load decorative/non-critical effects — they don't block first paint
const PawBackground = dynamic(() => import('@/components/effects/PawBackground'), { ssr: false });
const CursorGlow = dynamic(() => import('@/components/effects/CursorGlow'), { ssr: false });
const ScrollProgress = dynamic(() => import('@/components/effects/ScrollProgress'), { ssr: false });
const BackToTop = dynamic(() => import('@/components/effects/BackToTop'), { ssr: false });

export const metadata = {
  metadataBase: new URL('https://ssmhumanesociety.ca'),
  title: {
    default: 'Sault Ste. Marie Humane Society — Find Your Furever Friend',
    template: '%s | SSM Humane Society',
  },
  description: 'The Sault Ste. Marie Humane Society is committed to improving the lives of animals through rescue, adoption, and education. Browse adoptable pets, apply to adopt, volunteer, foster, or donate.',
  keywords: ['humane society', 'sault ste marie', 'pet adoption', 'adopt a dog', 'adopt a cat', 'animal shelter', 'SSM', 'Ontario', 'animal rescue', 'foster pets'],
  authors: [{ name: 'Sault Ste. Marie Humane Society' }],
  creator: 'Antigravity Solutions North',
  openGraph: {
    title: 'Sault Ste. Marie Humane Society',
    description: 'Find your furever friend. Browse adoptable pets and apply today.',
    type: 'website',
    locale: 'en_CA',
    siteName: 'SSM Humane Society',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sault Ste. Marie Humane Society',
    description: 'Find your furever friend. Browse adoptable pets and apply today.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFCFF' },
    { media: '(prefers-color-scheme: dark)', color: '#050A14' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
