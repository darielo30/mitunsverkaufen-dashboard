import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "Social Dashboard – mitunsverkaufen.de",
  description: "Instagram & TikTok Content-Tracker für mitunsverkaufen.de",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #07090d; font-family: 'Inter', -apple-system, sans-serif; transition: background 0.3s; }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #1E2A3A; border-radius: 4px; }

          /* Visible keyboard focus state (replaces per-input outline:none-only handling) */
          *:focus-visible { outline: 2px solid #4C7EFF; outline-offset: 2px; border-radius: 4px; }

          /* Findexa-style redesign: solid cards with a soft inner top highlight
             and outer drop shadow instead of frosted blur — reads as more
             "premium"/tactile than translucency. See the card/cardHover
             tokens in page.jsx. Class names kept from the previous glass
             iteration so existing className hooks didn't need touching. */
          .glass-panel {
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.25), 0 12px 24px rgba(0,0,0,0.18);
          }
          [data-theme="light"] .glass-panel {
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(15,23,42,0.04), 0 8px 20px rgba(15,23,42,0.06);
          }
          .glass-border { position: relative; }

          /* ── Framed app shell (desktop only) ──────────────────────
             Matches the reference: the whole app floats as one rounded,
             shadowed card on a darker page background instead of running
             edge-to-edge. Below 1024px this collapses back to a normal
             full-bleed page — a floating frame has no room to read as
             premium on a phone, and the sidebar needs to stay a true
             fixed-position off-canvas drawer there. */
          @media (min-width: 1024px) {
            .app-shell {
              max-width: 1680px; margin: 28px auto; height: calc(100vh - 56px);
              border-radius: 28px; overflow: hidden;
              border: 1px solid rgba(255,255,255,0.07);
              box-shadow: 0 40px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05);
            }
            [data-theme="light"] .app-shell {
              border-color: rgba(15,23,42,0.08);
              box-shadow: 0 30px 70px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.6);
            }
            .app-sidebar { position: sticky !important; top: 0; align-self: stretch; height: 100%; min-height: 0 !important; }
            .app-main { overflow-y: auto; height: 100%; }
          }

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
