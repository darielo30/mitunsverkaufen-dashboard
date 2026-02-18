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
          body { background: #0B0F19; font-family: 'Inter', -apple-system, sans-serif; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #0B0F19; }
          ::-webkit-scrollbar-thumb { background: #1E2A3A; border-radius: 4px; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
