import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PawBackground from '@/components/effects/PawBackground';
import CursorGlow from '@/components/effects/CursorGlow';
import ScrollProgress from '@/components/effects/ScrollProgress';
import BackToTop from '@/components/effects/BackToTop';
import SkipToContent from '@/components/ui/SkipToContent';

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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AnimalShelter',
              name: 'Sault Ste. Marie Humane Society',
              url: 'https://ssmhumanesociety.ca',
              telephone: '+1-705-949-3573',
              email: 'info@ssmhumanesociety.ca',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '962 Second Line East',
                addressLocality: 'Sault Ste. Marie',
                addressRegion: 'ON',
                postalCode: 'P6A 0B3',
                addressCountry: 'CA',
              },
              openingHoursSpecification: [
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '12:00', closes: '17:00' },
              ],
              description: 'The Sault Ste. Marie Humane Society is committed to improving the lives of animals through rescue, adoption, and education.',
              sameAs: [],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Services',
                itemListElement: [
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pet Adoption' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Foster Program' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Veterinary Services' } },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Trap-Neuter-Return (TNR)' } },
                ],
              },
            }),
          }}
        />
      </head>
      <body>
        <SkipToContent />
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
