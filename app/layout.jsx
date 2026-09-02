export const metadata = {
  title: "Social Dashboard – mitunsverkaufen.de",
  description: "Instagram & TikTok Content-Tracker für mitunsverkaufen.de",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0B0F19; font-family: 'Inter', -apple-system, sans-serif; transition: background 0.3s; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #1E2A3A; border-radius: 4px; }

          /* Visible keyboard focus state (replaces per-input outline:none-only handling) */
          *:focus-visible { outline: 2px solid #F97316; outline-offset: 2px; border-radius: 4px; }

          /* ── Responsive layout: sidebar off-canvas + grid column-drop ── */
          .mobile-menu-btn { display: none; }
          .sidebar-backdrop { display: none; }

          @media (max-width: 1023px) {
            .app-sidebar { transform: translateX(-100%); transition: transform 0.25s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 0 40px rgba(0,0,0,0.35); }
            .app-sidebar.open { transform: translateX(0); }
            .app-main { margin-left: 0 !important; }
            .mobile-menu-btn { display: flex; }
            .sidebar-backdrop.open { display: block; }
          }

          @media (max-width: 767px) {
            .post-card-grid { grid-template-columns: 1fr !important; }
            .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .two-col-grid { grid-template-columns: 1fr !important; }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            .post-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .two-col-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
