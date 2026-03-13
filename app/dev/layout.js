export const metadata = {
  title: 'Antigravity Solutions North — Developer Portal',
  description: 'SSM Humane Society project build dashboard.',
};

export default function DevLayout({ children }) {
  return (
    <>
      {/* Hide the site Navbar, Footer, and background effects */}
      <style>{`
        nav, footer, #scroll-progress, .cursor-glow, .paw-background, .back-to-top,
        [class*="navbar"], [class*="footer"] {
          display: none !important;
        }
        #main-content {
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
      {children}
    </>
  );
}
