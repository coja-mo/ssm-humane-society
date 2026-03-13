export const metadata = {
  title: 'Antigravity Solutions North — Developer Portal',
  description: 'SSM Humane Society project build dashboard. View all pages, API routes, components, and data stores.',
};

export default function DevLayout({ children }) {
  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9999, overflow: 'auto', background: '#0A0A0F',
    }}>
      {children}
    </div>
  );
}
