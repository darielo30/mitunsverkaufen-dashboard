"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Check, Eye, Heart, MessageCircle, Share2, Instagram,
  TrendingUp, TrendingDown, Calendar, ChevronDown, Plus, BarChart3,
  Users, Search, X, Clock, Send, Loader2,
  RefreshCw, Wifi, WifiOff, Upload, FileVideo, Trash2, ChevronLeft, ChevronRight,
  Globe, SkipForward, SkipBack, Scissors,
  LayoutDashboard, Bell, Settings, UserPlus, AlertCircle, XCircle, UsersRound, Shield, ExternalLink,
  Sun, Moon, FileText, CheckSquare, Square, Download, EyeOff, Sparkles,
  Kanban, Lightbulb, PenLine, Wand2, Rocket, GripVertical, Pencil,
  Bookmark, Copy, List, LayoutGrid, Minus, MousePointerClick, ArrowUpDown, Facebook, Youtube, Linkedin, Menu,
  Filter, MoreHorizontal, Target
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, LineChart, Line, ScatterChart, Scatter, Cell
} from "recharts";

// ── Brand Colors ────────────────────────────────────────────────
// `accent` = general system/interactive color (nav, links, secondary actions).
// `cta` = the one color reserved for the single action used every day
// ("Neuer Beitrag") so it visually outranks everything else on screen.
// `red` = errors/destructive actions only — keeping these three apart avoids
// any of them reading as one of the others (see design critique history).
//
// Findexa-reference redesign: solid near-black cards (see `.glass-panel` /
// `.glass-border` in layout.jsx for the inset-highlight + drop-shadow
// treatment — same class names as the previous glass iteration, now solid
// instead of translucent/blurred) with a tighter, less-rounded corner scale.
const darkTheme = {
  bg: "#07090d", bgSoft: "#0b0e15", card: "#12151d", cardHover: "#181c26",
  border: "rgba(255,255,255,0.08)",
  glass: "#12151d", glassHover: "#181c26", glassBorder: "rgba(255,255,255,0.08)",
  glassStrong: "#12151d",
  accent: "#4C7EFF", accentGlow: "rgba(76,126,255,0.16)", accentLight: "#6F97FF",
  cta: "#F97316", ctaGlow: "rgba(249,115,22,0.16)", ctaLight: "#FB923C",
  red: "#DC2626", redGlow: "rgba(220,38,38,0.12)",
  redLight: "#EF4444", green: "#22C55E", greenGlow: "rgba(34,197,94,0.12)",
  blue: "#4C7EFF", blueGlow: "rgba(76,126,255,0.12)", purple: "#8B5CF6",
  purpleGlow: "rgba(139,92,246,0.12)", teal: "#14B8A6", tealGlow: "rgba(20,184,166,0.14)",
  yellow: "#EAB308",
  yellowGlow: "rgba(234,179,8,0.12)", white: "#F5F7FA", muted: "#94A3B8",
  dimmed: "#64748B", instagram: "#E1306C", tiktok: "#00F2EA", youtube: "#FF0000",
};
const lightTheme = {
  bg: "#F3F4F6", bgSoft: "#E5E7EB", card: "#FFFFFF", cardHover: "#F9FAFB",
  border: "#D1D5DB",
  glass: "#FFFFFF", glassHover: "#F9FAFB", glassBorder: "#D1D5DB",
  glassStrong: "#FFFFFF",
  accent: "#3468E0", accentGlow: "rgba(52,104,224,0.10)", accentLight: "#4C7EFF",
  cta: "#EA580C", ctaGlow: "rgba(234,88,12,0.10)", ctaLight: "#F97316",
  red: "#DC2626", redGlow: "rgba(220,38,38,0.08)",
  redLight: "#EF4444", green: "#16A34A", greenGlow: "rgba(22,163,74,0.08)",
  blue: "#3468E0", blueGlow: "rgba(52,104,224,0.08)", purple: "#7C3AED",
  purpleGlow: "rgba(124,58,237,0.08)", teal: "#0F9C8C", tealGlow: "rgba(15,156,140,0.10)",
  yellow: "#CA8A04",
  yellowGlow: "rgba(202,138,4,0.08)", white: "#111827", muted: "#6B7280",
  dimmed: "#9CA3AF", instagram: "#E1306C", tiktok: "#00B8A9", youtube: "#FF0000",
};
let C = darkTheme;

// ── Design tokens: type scale, spacing scale, radius scale ───────
// Consolidated from 14 ad-hoc fontSize values / 15 gap values / 13 radius
// values down to a named, documented scale (see design critique). Radius
// scale tightened for the Findexa-reference pass — buttons and cards read
// noticeably less "soft"/pill-shaped than the earlier glass redesign.
const TYPE = {
  micro: 10, caption: 11, small: 12, body: 13, bodyLg: 14,
  label: 15, labelLg: 16, h4: 18, h3: 20, h2: 22, display: 28,
};
const SPACE = {
  none: 0, xxs: 2, xs: 4, sm: 6, md: 8, lg: 10, xl: 12, xxl: 16, xxxl: 20,
};
const RADIUS = {
  sm: 4, md: 6, lg: 8, xl: 10, xxl: 16, xxxl: 18, pill: 10, shell: 22,
};

// ── TikTok Icon (original logo style, outline) ─────────────────
function TikTokIcon({ size = 24, color = "#00F2EA" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

// Maps a Late/Zernio platform key to its icon + label. `color` is read lazily
// (via a getter) since `C` is reassigned when the theme toggles.
const PLATFORM_META = {
  instagram: { label: "Instagram", icon: Instagram, get color() { return C.instagram; } },
  tiktok: { label: "TikTok", icon: TikTokIcon, get color() { return C.tiktok; } },
  youtube: { label: "YouTube", icon: Youtube, get color() { return C.youtube; } },
  facebook: { label: "Facebook", icon: Facebook, get color() { return C.accent; } },
  linkedin: { label: "LinkedIn", icon: Linkedin, get color() { return C.accent; } },
};
const platformMeta = (p) => PLATFORM_META[p] || { label: p ? p[0].toUpperCase() + p.slice(1) : "Unbekannt", icon: Globe, get color() { return C.muted; } };

const fmt = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

// Translates raw backend/API error strings (env var names, HTTP jargon) into a
// message end users can act on, instead of surfacing internals verbatim.
const friendlyApiError = (raw) => {
  if (!raw) return raw;
  const msg = String(raw);
  if (/LATE_API_KEY|not configured/i.test(msg)) {
    return "Verbindung ist noch nicht eingerichtet. Bitte in den Settings die Zernio-API verbinden.";
  }
  return msg;
};

const MONTHS_DE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const SHORT_MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

// ── Common Timezones ────────────────────────────────────────────
const TIMEZONES = [
  { value: "Europe/Berlin", label: "Berlin (GMT+1)", short: "CET" },
  { value: "Europe/Vienna", label: "Wien (GMT+1)", short: "CET" },
  { value: "Europe/Zurich", label: "Zürich (GMT+1)", short: "CET" },
  { value: "Europe/London", label: "London (GMT+0)", short: "GMT" },
  { value: "Europe/Paris", label: "Paris (GMT+1)", short: "CET" },
  { value: "Europe/Amsterdam", label: "Amsterdam (GMT+1)", short: "CET" },
  { value: "Europe/Istanbul", label: "Istanbul (GMT+3)", short: "TRT" },
  { value: "America/New_York", label: "New York (GMT-5)", short: "EST" },
  { value: "America/Los_Angeles", label: "Los Angeles (GMT-8)", short: "PST" },
  { value: "Asia/Dubai", label: "Dubai (GMT+4)", short: "GST" },
  { value: "Asia/Tokyo", label: "Tokio (GMT+9)", short: "JST" },
];

// ── Demo Data ───────────────────────────────────────────────────
const demoPerformance = [
  { month: "Sep", views: 42000, likes: 3200, comments: 890, shares: 420 },
  { month: "Okt", views: 58000, likes: 4100, comments: 1200, shares: 680 },
  { month: "Nov", views: 71000, likes: 5400, comments: 1500, shares: 890 },
  { month: "Dez", views: 65000, likes: 4800, comments: 1350, shares: 760 },
  { month: "Jan", views: 89000, likes: 6200, comments: 1800, shares: 1100 },
  { month: "Feb", views: 94000, likes: 7100, comments: 2100, shares: 1340 },
];

const demoPosts = [
  { id: 1, platforms: ["instagram", "tiktok"], type: "Reel", title: "Energievertrieb 2026 – So startest du durch", caption: "Energievertrieb 2026 – So startest du durch 🚀\n\nDer Energiemarkt verändert sich rasant. In diesem Reel zeigen wir dir, wie du 2026 im Vertrieb durchstartest.\n\n#energievertrieb #vertrieb #sales", date: "2026-02-03", views: 12400, likes: 890, comments: 124, shares: 67, done: true, status: "published", createdAt: "2026-01-30", createdBy: "Dariel", postUrls: { instagram: "https://www.instagram.com/mitunsverkaufen/", tiktok: "https://www.tiktok.com/@mitunsverkaufen" } },
  { id: 2, platforms: ["instagram", "tiktok"], type: "Video", title: "Door-to-Door Sales: 5 Tipps vom Profi", caption: "Door-to-Door Sales: 5 Tipps vom Profi 💡\n\n1. Erster Eindruck zählt\n2. Kenne dein Produkt\n3. Einwandbehandlung meistern\n4. Follow-Up nicht vergessen\n5. Bleib authentisch\n\n#doortodoor #salestips", date: "2026-02-05", views: 34200, likes: 2100, comments: 310, shares: 445, done: true, status: "published", createdAt: "2026-02-01", createdBy: "Dariel", postUrls: { instagram: "https://www.instagram.com/mitunsverkaufen/", tiktok: "https://www.tiktok.com/@mitunsverkaufen" } },
  { id: 3, platforms: ["instagram", "tiktok"], type: "Karussell", title: "Partnermodell erklärt – Passives Einkommen", caption: "Partnermodell erklärt – Passives Einkommen 💰\n\nMit unserem Partnermodell kannst du dir ein nachhaltiges Einkommen aufbauen.\n\n#passivesincome #partner", date: "2026-02-08", views: 8900, likes: 620, comments: 89, shares: 34, done: true, status: "published", createdAt: "2026-02-05", createdBy: "Dariel", postUrls: { instagram: "https://www.instagram.com/mitunsverkaufen/", tiktok: "https://www.tiktok.com/@mitunsverkaufen" } },
  { id: 4, platforms: ["instagram", "tiktok"], type: "Video", title: "Tag im Leben eines Energieberaters", caption: "Tag im Leben eines Energieberaters ⚡\n\nVon morgens bis abends – so sieht ein typischer Arbeitstag aus.\n\n#dayinthelife #energieberater", date: "2026-02-10", views: 51000, likes: 3400, comments: 520, shares: 780, done: false, status: "published", createdAt: "2026-02-07", createdBy: "Dariel", postUrls: { instagram: "https://www.instagram.com/mitunsverkaufen/", tiktok: "https://www.tiktok.com/@mitunsverkaufen" } },
  { id: 5, platforms: ["instagram", "tiktok"], type: "Reel", title: "Stadtwerke Krefeld – Behind the Scenes", caption: "Stadtwerke Krefeld – Behind the Scenes 🎬\n\nExklusiver Blick hinter die Kulissen unserer Zusammenarbeit.\n\n#behindthescenes #stadtwerke", date: "2026-02-12", views: 6200, likes: 410, comments: 56, shares: 23, done: false, status: "published", createdAt: "2026-02-09", createdBy: "Dariel", postUrls: { instagram: "https://www.instagram.com/mitunsverkaufen/", tiktok: "https://www.tiktok.com/@mitunsverkaufen" } },
  { id: 6, platforms: ["instagram", "tiktok"], type: "Story", title: "Q&A: Häufigste Fragen zu unserem Netzwerk", caption: "Q&A: Häufigste Fragen zu unserem Netzwerk 🤔\n\nIhr habt gefragt – wir antworten!", date: "2026-02-14T18:00:00", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "scheduled", timezone: "CET", createdAt: "2026-02-10", createdBy: "Dariel" },
  { id: 7, platforms: ["instagram", "tiktok"], type: "Video", title: "Vorher/Nachher: Agentur-Transformation", caption: "Vorher/Nachher: Agentur-Transformation 📈\n\nSo haben wir unsere Agentur transformiert.", date: "2026-02-17T12:30:00", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "scheduled", timezone: "CET", createdAt: "2026-02-12", createdBy: "Dariel" },
  { id: 8, platforms: ["instagram"], type: "Reel", title: "Warum Stadtwerke Krefeld? Die Vorteile", caption: "Warum Stadtwerke Krefeld? Die Vorteile ✅", date: "2026-02-19", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "draft", createdAt: "2026-02-13", createdBy: "Dariel" },
  { id: 9, platforms: ["tiktok"], type: "Video", title: "Recruiting-Strategie für Agenturen", caption: "Recruiting-Strategie für Agenturen 🎯", date: "2026-02-21", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "draft", createdAt: "2026-02-14", createdBy: "Dariel" },
  { id: 10, platforms: ["instagram", "tiktok"], type: "Karussell", title: "5 Gründe für mitunsverkaufen.de", caption: "5 Gründe für mitunsverkaufen.de 🔥", date: "2026-02-24", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "draft", createdAt: "2026-02-15", createdBy: "Dariel" },
  { id: 11, platforms: ["instagram", "tiktok"], type: "Video", title: "Live-Coaching: Einwandbehandlung", caption: "Live-Coaching: Einwandbehandlung 💪", date: "2026-02-26", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "draft", createdAt: "2026-02-16", createdBy: "Dariel" },
  { id: 12, platforms: ["instagram", "tiktok"], type: "Reel", title: "Monatsrückblick Februar", caption: "Monatsrückblick Februar 📊", date: "2026-02-28", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "draft", createdAt: "2026-02-17", createdBy: "Dariel" },
];

// ── Stat Card ───────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, change, color, glowColor }) {
  const isUp = change >= 0;
  return (
    <div style={{ background: C.card, borderRadius: RADIUS.xxxl, padding: "20px 24px", border: `1px solid ${C.border}`, flex: 1, minWidth: 170, transition: "all 0.25s", cursor: "default" }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 24px ${glowColor}`; }}
      onMouseOut={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: RADIUS.xxl, background: glowColor, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={20} color={color} /></div>
        <div style={{ display: "flex", alignItems: "center", gap: SPACE.xs, fontSize: TYPE.body, color: isUp ? C.green : C.redLight, fontWeight: 500 }}>{isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{isUp ? "+" : ""}{change}%</div>
      </div>
      <div style={{ fontSize: TYPE.display, fontWeight: 700, color: C.white, letterSpacing: "-0.03em" }}>{value}</div>
      <div style={{ fontSize: TYPE.body, color: C.muted, marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1A2035", border: `1px solid ${C.border}`, borderRadius: RADIUS.xxl, padding: `${SPACE.xl}px ${SPACE.xxl}px`, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: TYPE.body, color: C.muted, marginBottom: 8, fontWeight: 500 }}>{label}</div>
      {payload.map((p, i) => (<div key={i} style={{ fontSize: TYPE.body, color: p.color, fontWeight: 500, marginBottom: 2 }}>{p.name}: {fmt(p.value)}</div>))}
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    published: { label: "Live", color: C.green, bg: C.greenGlow },
    scheduled: { label: "Geplant", color: C.yellow, bg: C.yellowGlow },
    draft: { label: "Entwurf", color: C.dimmed, bg: "rgba(107,114,128,0.12)" },
    failed: { label: "Fehler", color: C.redLight, bg: C.redGlow },
  };
  const c = config[status] || config.draft;
  const isLive = status === "published";
  return (<div style={{ display: "flex", alignItems: "center", gap: SPACE.sm, fontSize: TYPE.caption, fontWeight: 600, color: c.color, background: c.bg, padding: "3px 10px", borderRadius: RADIUS.md, textTransform: "uppercase", letterSpacing: "0.06em" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, ...(isLive ? { animation: "livePulse 2s ease-in-out infinite" } : {}) }} />{c.label}</div>);
}

// ── Month Picker Dropdown ───────────────────────────────────────
function MonthPicker({ selectedMonth, selectedYear, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [year, setYear] = useState(selectedYear);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: SPACE.md, background: C.card, border: `1px solid ${open ? C.accent : C.border}`, borderRadius: RADIUS.xl, padding: "8px 14px", color: C.white, fontSize: TYPE.body, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
        <Calendar size={15} color={C.muted} /> {MONTHS_DE[selectedMonth]} {selectedYear} <ChevronDown size={13} color={C.muted} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.xxxl, padding: 16, width: 280, boxShadow: "0 12px 40px rgba(0,0,0,0.5)", zIndex: 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button onClick={() => setYear(year - 1)} style={{ width: 30, height: 30, borderRadius: RADIUS.lg, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronLeft size={16} color={C.muted} /></button>
            <div style={{ fontSize: TYPE.label, fontWeight: 600, color: C.white }}>{year}</div>
            <button onClick={() => setYear(year + 1)} style={{ width: 30, height: 30, borderRadius: RADIUS.lg, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronRight size={16} color={C.muted} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: SPACE.sm }}>
            {SHORT_MONTHS.map((m, i) => {
              const isSelected = i === selectedMonth && year === selectedYear;
              return (
                <button key={m} onClick={() => { onSelect(i, year); setOpen(false); }} style={{
                  padding: `${SPACE.md}px ${SPACE.xs}px`, borderRadius: RADIUS.lg, border: "none", fontSize: TYPE.body, fontWeight: isSelected ? 600 : 500,
                  background: isSelected ? C.accent : "transparent", color: isSelected ? "#fff" : C.muted,
                  cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                }} onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.background = C.bg; }}
                   onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Timezone Picker ─────────────────────────────────────────────
function TimezonePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = TIMEZONES.find((tz) => tz.value === value) || TIMEZONES[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: SPACE.sm, background: C.bg, border: `1px solid ${open ? C.accent : C.border}`,
        borderRadius: RADIUS.lg, padding: `${SPACE.md}px ${SPACE.xl}px`, color: C.white, fontSize: TYPE.body, cursor: "pointer", fontFamily: "inherit",
        transition: "all 0.2s", minWidth: 180,
      }}>
        <Globe size={14} color={C.muted} />
        <span style={{ flex: 1, textAlign: "left" }}>{selected.label}</span>
        <ChevronDown size={12} color={C.muted} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", bottom: "100%", left: 0, marginBottom: 6, background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.xxl, padding: 6, width: 260, maxHeight: 240, overflowY: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", zIndex: 70 }}>
          {TIMEZONES.map((tz) => (
            <button key={tz.value} onClick={() => { onChange(tz.value); setOpen(false); }} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: `${SPACE.md}px ${SPACE.xl}px`,
              borderRadius: RADIUS.lg, border: "none", background: value === tz.value ? C.accentGlow : "transparent",
              color: value === tz.value ? C.accent : C.muted, fontSize: TYPE.body, cursor: "pointer", fontFamily: "inherit",
              fontWeight: value === tz.value ? 500 : 400, transition: "all 0.15s",
            }} onMouseOver={(e) => { if (value !== tz.value) e.currentTarget.style.background = C.bg; }}
               onMouseOut={(e) => { if (value !== tz.value) e.currentTarget.style.background = "transparent"; }}>
              <span>{tz.label}</span>
              {value === tz.value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Video Thumbnail Picker (Scrubber only) ─────────────────────
function ThumbnailPicker({ videoFile, onSelect, selectedTimestamp }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const videoUrlRef = useRef(null);
  const isScrubbing = useRef(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState(null);

  // Create a stable video URL that doesn't change on re-render
  useEffect(() => {
    if (!videoFile?.file) return;
    videoUrlRef.current = URL.createObjectURL(videoFile.file);
    return () => {
      if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
    };
  }, [videoFile]);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    // Use the video's actual dimensions for correct aspect ratio
    const vw = video.videoWidth || 320;
    const vh = video.videoHeight || 180;
    canvas.width = 160;
    canvas.height = Math.round(160 * (vh / vw));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const timeMs = Math.round(video.currentTime * 1000);
    setSelectedFrame({ time: video.currentTime, dataUrl, timeMs });
    onSelect(timeMs);
  };

  const handleSliderStart = () => {
    isScrubbing.current = true;
  };

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setSliderValue(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleSliderEnd = () => {
    isScrubbing.current = false;
  };

  const handleVideoTimeUpdate = () => {
    // Only update slider when NOT scrubbing to prevent the feedback loop
    if (!isScrubbing.current && videoRef.current) {
      setSliderValue(videoRef.current.currentTime);
    }
  };

  const stepBack = () => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, videoRef.current.currentTime - 0.5);
    videoRef.current.currentTime = newTime;
    setSliderValue(newTime);
  };

  const stepForward = () => {
    if (!videoRef.current) return;
    const newTime = Math.min(duration, videoRef.current.currentTime + 0.5);
    videoRef.current.currentTime = newTime;
    setSliderValue(newTime);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!videoFile?.file || !videoUrlRef.current) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.muted, marginBottom: 8, display: "flex", alignItems: "center", gap: SPACE.sm }}>
        <Scissors size={14} /> Thumbnail wählen
      </div>

      <div style={{ background: C.bg, borderRadius: RADIUS.xl, padding: 12, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: TYPE.small, fontWeight: 500, color: C.dimmed, marginBottom: 8 }}>Video durchscrubben und Frame auswählen:</div>
        <video
          ref={videoRef}
          src={videoUrlRef.current}
          style={{ width: "100%", maxHeight: 220, borderRadius: RADIUS.lg, background: "#000", display: "block" }}
          muted
          preload="auto"
          playsInline
          onTimeUpdate={handleVideoTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Scrubber controls */}
        <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, marginTop: 10 }}>
          <button onClick={stepBack}
            style={{ width: 30, height: 30, borderRadius: RADIUS.md, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <SkipBack size={13} color={C.muted} />
          </button>

          <input type="range" min={0} max={duration || 1} step={0.05} value={sliderValue}
            onMouseDown={handleSliderStart}
            onTouchStart={handleSliderStart}
            onChange={handleSliderChange}
            onMouseUp={handleSliderEnd}
            onTouchEnd={handleSliderEnd}
            style={{ flex: 1, accentColor: C.accent, cursor: "pointer" }} />

          <button onClick={stepForward}
            style={{ width: 30, height: 30, borderRadius: RADIUS.md, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <SkipForward size={13} color={C.muted} />
          </button>

          <span style={{ fontSize: TYPE.small, color: C.dimmed, fontVariantNumeric: "tabular-nums", minWidth: 48, textAlign: "center" }}>
            {formatTime(sliderValue)}
          </span>

          <button onClick={captureFrame} style={{
            display: "flex", alignItems: "center", gap: SPACE.sm, padding: "6px 14px", borderRadius: RADIUS.lg,
            background: C.accent, border: "none", color: "#fff", fontSize: TYPE.small, fontWeight: 500, cursor: "pointer",
            fontFamily: "inherit", boxShadow: `0 2px 8px ${C.accentGlow}`, flexShrink: 0,
          }}>
            <Scissors size={13} /> Frame wählen
          </button>
        </div>

        {/* Selected frame preview */}
        {selectedFrame && (
          <div style={{ display: "flex", alignItems: "center", gap: SPACE.xl, marginTop: 10, padding: `${SPACE.md}px ${SPACE.lg}px`, background: C.accentGlow, borderRadius: RADIUS.lg, border: `1px solid ${C.accent}30` }}>
            <img src={selectedFrame.dataUrl} alt="Gewähltes Thumbnail" style={{ width: 72, height: "auto", borderRadius: RADIUS.md, objectFit: "cover", border: `1px solid ${C.border}` }} />
            <div>
              <div style={{ fontSize: TYPE.small, color: C.accent, fontWeight: 600 }}>Thumbnail ausgewählt</div>
              <div style={{ fontSize: TYPE.caption, color: C.muted, marginTop: 2 }}>Frame bei {formatTime(selectedFrame.time)}</div>
            </div>
            <Check size={16} color={C.accent} style={{ marginLeft: "auto" }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Content Type Definitions ─────────────────────────────────────
const CONTENT_TYPES = [
  { key: "reel", label: "Reel", desc: "Kurzvideos bis 90 Sek.", icon: "🎬", needsVideo: true },
  { key: "carousel", label: "Karussell", desc: "Bis zu 10 Bilder/Videos", icon: "🖼️", needsVideo: false },
  { key: "story", label: "Story", desc: "24h sichtbar, vertikal", icon: "📱", needsVideo: false },
  { key: "feed", label: "Feed Post", desc: "Klassischer Beitrag", icon: "📸", needsVideo: false },
];

// ── Create Post Modal with Media Upload + Thumbnail + Timezone ──
// ── Analytics-Verlauf (Tages-Snapshots) ─────────────────────────
// Zernios API liefert nur den aktuellen Stand pro Post, keinen Verlauf.
// Wir speichern deshalb einmal pro Tag einen Snapshot lokal – daraus
// entstehen nach ein paar Tagen echte Trendlinien.
const SNAPSHOT_KEY = "postAnalyticsSnapshots";
const SNAP_METRICS = ["likes", "comments", "shares", "saves", "views", "impressions", "reach", "clicks"];

function saveAnalyticsSnapshots(items) {
  if (typeof window === "undefined") return;
  try {
    const store = JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || "{}");
    const today = new Date().toISOString().split("T")[0];

    for (const it of items) {
      const id = it.postId || it.latePostId || it._id || it.id;
      const a = it.analytics;
      if (!id || !a) continue;
      // Nur Posts mit tatsächlichen Werten aufzeichnen
      if (!SNAP_METRICS.some((k) => (a[k] || 0) > 0)) continue;

      const entry = { date: today };
      for (const k of SNAP_METRICS) entry[k] = a[k] || 0;

      const arr = Array.isArray(store[id]) ? store[id] : [];
      const idx = arr.findIndex((e) => e.date === today);
      if (idx >= 0) arr[idx] = entry; else arr.push(entry);
      arr.sort((x, y) => x.date.localeCompare(y.date));
      store[id] = arr.slice(-120);
    }
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(store));
  } catch {}
}

function loadAnalyticsSnapshots(postId, publishedAt) {
  if (typeof window === "undefined") return [];
  try {
    const store = JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || "{}");
    const arr = store[String(postId)] || [];
    if (arr.length === 0) return [];

    // Startpunkt am Veröffentlichungstag ergänzen (dort waren alle Werte 0),
    // damit schon ab dem ersten Snapshot eine Linie sichtbar ist.
    if (publishedAt) {
      const pub = new Date(publishedAt).toISOString().split("T")[0];
      if (pub < arr[0].date) {
        const zero = { date: pub };
        for (const k of SNAP_METRICS) zero[k] = 0;
        return [zero, ...arr];
      }
    }
    return arr;
  } catch {
    return [];
  }
}

// ── Verlaufs-Diagramm mit zwei Y-Achsen ─────────────────────────
function ChartCard({ title, hint, data, left, right }) {
  const fmtDay = (d) => new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "short" });
  const axis = { stroke: C.dimmed, fontSize: TYPE.micro, tickLine: false, axisLine: false };

  return (
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: "14px 14px 8px", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: SPACE.lg, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white }}>{title}</div>
        <div style={{ fontSize: TYPE.caption, color: C.dimmed }}>{hint}</div>
      </div>
      <div style={{ height: 190 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 6, bottom: 0, left: -12 }}>
            <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={fmtDay} {...axis} minTickGap={20} />
            <YAxis yAxisId="l" {...axis} width={38} allowDecimals={false} />
            <YAxis yAxisId="r" orientation="right" {...axis} width={38} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, fontSize: TYPE.small }}
              labelStyle={{ color: C.white, fontWeight: 500, marginBottom: 4 }}
              labelFormatter={fmtDay}
            />
            {left.map((s) => (
              <Line key={s.key} yAxisId="l" type="monotone" dataKey={s.key} name={s.label}
                stroke={s.color} strokeWidth={2} dot={{ r: 2.5, fill: s.color }} activeDot={{ r: 4 }} />
            ))}
            {right.map((s) => (
              <Line key={s.key} yAxisId="r" type="monotone" dataKey={s.key} name={s.label}
                stroke={s.color} strokeWidth={2} dot={{ r: 2.5, fill: s.color }} activeDot={{ r: 4 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Legende */}
      <div style={{ display: "flex", justifyContent: "center", gap: SPACE.xxl, flexWrap: "wrap", paddingTop: 6 }}>
        {[...left, ...right].map((s) => (
          <span key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: SPACE.sm, fontSize: TYPE.caption, color: s.color }}>
            <span style={{ width: 12, height: 2, background: s.color, display: "inline-block", borderRadius: RADIUS.sm }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Post Detail Panel (Slide-in von rechts) ─────────────────────
function PostDetailPanel({ post, onClose, isConnected, onHide, onDeleteRemote }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  const close = () => { setVisible(false); setTimeout(onClose, 300); };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!post) return null;

  const plats = post.platformDetails?.length
    ? post.platformDetails
    : (post.platforms || []).map((pl) => ({ platform: pl, status: post.status, url: post.postUrls?.[pl], analytics: {} }));

  const meta = (name) => name === "instagram"
    ? { label: "Instagram", Icon: Instagram, color: C.instagram }
    : name === "tiktok"
      ? { label: "TikTok", Icon: TikTokIcon, color: C.tiktok }
      : { label: name, Icon: Globe, color: C.muted };

  const statusColors = {
    published: C.green, scheduled: C.blue, queued: C.purple,
    draft: C.dimmed, failed: C.redLight, partial: C.yellow,
  };
  const statusLabels = {
    published: "Live", scheduled: "Geplant", queued: "Warteschlange",
    draft: "Entwurf", failed: "Fehler", partial: "Teilweise",
  };

  // Analytics-Spalten wie bei Zernio
  const cols = [
    { key: "likes", label: "Likes", icon: Heart, color: C.redLight },
    { key: "comments", label: "Kommentare", icon: MessageCircle, color: C.blue },
    { key: "shares", label: "Geteilt", icon: Share2, color: C.green },
    { key: "saves", label: "Gespeichert", icon: Bookmark, color: C.yellow },
    { key: "clicks", label: "Klicks", icon: MousePointerClick, color: C.purple },
    { key: "views", label: "Aufrufe", icon: Eye, color: C.muted },
    { key: "follows", label: "Follower", icon: UserPlus, color: C.blue },
    { key: "impressions", label: "Impr.", icon: TrendingUp, color: C.green },
    { key: "reach", label: "Reichweite", icon: UsersRound, color: C.purple },
  ];

  const sum = (k) => plats.reduce((a, p) => a + (p.analytics?.[k] || 0), 0);
  // Engagement Rate = (Likes + Kommentare + Shares + Saves) / Impressions
  const er = (a) => {
    // Zernio liefert engagementRate direkt mit – sonst selbst rechnen
    if (typeof a?.engagementRate === "number" && a.engagementRate > 0) {
      return a.engagementRate.toFixed(2) + "%";
    }
    const base = a?.impressions || a?.views || 0;
    if (!base) return null;
    const eng = (a.likes || 0) + (a.comments || 0) + (a.shares || 0) + (a.saves || 0);
    return ((eng / base) * 100).toFixed(2) + "%";
  };
  const totalAnalytics = Object.fromEntries(cols.map((c) => [c.key, sum(c.key)]));
  totalAnalytics.engagementRate = post.engagementRate;
  const hasAnalytics = cols.some((c) => sum(c.key) > 0);
  const history = loadAnalyticsSnapshots(post.id, post.publishedAt || post.date);

  const dash = (v) => (v > 0 ? v.toLocaleString("de-DE") : "–");
  const cell = { padding: `${SPACE.lg}px ${SPACE.xl}px`, fontSize: TYPE.small, textAlign: "right", whiteSpace: "nowrap" };

  const headline = post.status === "published" ? "Veröffentlicht" : post.status === "scheduled" ? "Geplant für" : "Erstellt";
  const headlineDate = new Date(post.publishedAt || post.date).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
  const headlineTime = new Date(post.publishedAt || post.date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  return (
    <div onClick={close} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: visible ? "rgba(0,0,0,0.5)" : "transparent",
      backdropFilter: visible ? "blur(4px)" : "none",
      transition: "background 0.3s, backdrop-filter 0.3s",
    }}>
      <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: "50vw", minWidth: 520, maxWidth: 760,
        background: C.glassStrong, borderLeft: `1px solid ${C.glassBorder}`,
        boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
        display: "flex", flexDirection: "column",
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>

        {/* Kopfzeile */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: TYPE.h4, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>Post-Details</div>
            <div style={{ fontSize: TYPE.body, color: C.dimmed, marginTop: 3 }}>{headline} {headlineDate} um {headlineTime}</div>
          </div>
          <button onClick={close} style={{ width: 34, height: 34, borderRadius: RADIUS.lg, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.redLight; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
            <X size={17} />
          </button>
        </div>

        {/* Scrollbereich */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 28px" }}>

          {/* Content */}
          <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, color: C.white, marginBottom: 10 }}>Content</div>
          <div style={{ fontSize: TYPE.body, color: C.muted, lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word", background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: "14px 16px", marginBottom: 16 }}>
            {post.caption || post.title || "–"}
          </div>

          {/* Medien */}
          {(post.videoUrl || post.thumbnail) && (
            <div style={{ marginBottom: 16, borderRadius: RADIUS.lg, overflow: "hidden", background: C.bg, border: `1px solid ${C.border}`, width: "fit-content", maxWidth: "100%" }}>
              {post.videoUrl ? (
                <video src={post.videoUrl} controls preload="metadata" style={{ display: "block", maxWidth: 340, maxHeight: 260, background: "#000" }} />
              ) : (
                <img src={post.thumbnail} alt="" style={{ display: "block", maxWidth: 340, maxHeight: 260, objectFit: "contain" }} />
              )}
            </div>
          )}

          {/* Plattform-Zeilen */}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, overflow: "hidden", marginBottom: 22 }}>
            {plats.map((pd, i) => {
              const m = meta(pd.platform);
              const stColor = statusColors[pd.status] || C.dimmed;
              return (
                <div key={pd.platform} style={{ display: "flex", alignItems: "center", gap: SPACE.lg, padding: "11px 14px", background: C.bg, borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                  <m.Icon size={16} color={C.white} />
                  <span style={{ fontSize: TYPE.body, fontWeight: 500, color: C.white }}>{m.label}</span>
                  <span style={{ fontSize: TYPE.caption, fontWeight: 500, color: stColor, background: stColor + "18", padding: `${SPACE.xxs}px ${SPACE.md}px`, borderRadius: RADIUS.md }}>{statusLabels[pd.status] || pd.status}</span>
                  <span style={{ fontSize: TYPE.small, color: C.dimmed }}>
                    {pd.publishedAt
                      ? new Date(pd.publishedAt).toLocaleString("de-DE", { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })
                      : new Date(post.date).toLocaleString("de-DE", { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {pd.url && (
                    <a href={pd.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                      style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: SPACE.xs, fontSize: TYPE.small, color: C.muted, textDecoration: "none" }}>
                      Ansehen <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Analytics */}
          <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, color: C.white, marginBottom: 10 }}>Statistiken</div>
          {hasAnalytics ? (
            <>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, overflowX: "auto", marginBottom: 14 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                  <thead>
                    <tr style={{ background: C.bg }}>
                      <th style={{ padding: `${SPACE.lg}px ${SPACE.xl}px`, fontSize: TYPE.small, color: C.dimmed, fontWeight: 500, textAlign: "left", whiteSpace: "nowrap" }}>Plattform</th>
                      {cols.map((c) => (
                        <th key={c.key} style={{ padding: `${SPACE.lg}px ${SPACE.xl}px`, fontSize: TYPE.small, color: C.dimmed, fontWeight: 500, textAlign: "right", whiteSpace: "nowrap" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: SPACE.sm }}>
                            <c.icon size={12} color={c.color} /> {c.label}
                          </span>
                        </th>
                      ))}
                      <th style={{ padding: `${SPACE.lg}px ${SPACE.xl}px`, fontSize: TYPE.small, color: C.dimmed, fontWeight: 500, textAlign: "right" }}>ER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plats.map((pd) => {
                      const m = meta(pd.platform);
                      return (
                        <tr key={pd.platform} style={{ borderTop: `1px solid ${C.border}` }}>
                          <td style={{ padding: `${SPACE.lg}px ${SPACE.xl}px`, whiteSpace: "nowrap" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: SPACE.md, fontSize: TYPE.body, color: C.white }}>
                              <m.Icon size={13} color={C.white} /> {m.label}
                            </span>
                          </td>
                          {cols.map((c) => (
                            <td key={c.key} style={{ ...cell, color: (pd.analytics?.[c.key] || 0) > 0 ? C.white : C.dimmed }}>
                              {dash(pd.analytics?.[c.key] || 0)}
                            </td>
                          ))}
                          <td style={{ ...cell, color: C.white }}>{er(pd.analytics) || "–"}</td>
                        </tr>
                      );
                    })}
                    <tr style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
                      <td style={{ padding: `${SPACE.lg}px ${SPACE.xl}px`, fontSize: TYPE.body, fontWeight: 600, color: C.white }}>Gesamt</td>
                      {cols.map((c) => (
                        <td key={c.key} style={{ ...cell, fontWeight: 600, color: totalAnalytics[c.key] > 0 ? C.white : C.dimmed }}>
                          {dash(totalAnalytics[c.key])}
                        </td>
                      ))}
                      <td style={{ ...cell, fontWeight: 600, color: C.white }}>{er(totalAnalytics) || "–"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Verlaufsdiagramme */}
              {history.length >= 2 ? (
                <>
                  <ChartCard
                    title="Engagement im Zeitverlauf"
                    hint="Likes ← linke Achse · andere → rechte Achse"
                    data={history}
                    left={[{ key: "likes", label: "Likes", color: C.redLight }]}
                    right={[
                      { key: "comments", label: "Kommentare", color: C.blue },
                      { key: "saves", label: "Gespeichert", color: C.yellow },
                      { key: "shares", label: "Geteilt", color: C.green },
                    ]}
                  />
                  <ChartCard
                    title="Reichweite & Impressionen im Zeitverlauf"
                    hint="Impressionen ← linke Achse · Reichweite & Aufrufe → rechte Achse"
                    data={history}
                    left={[{ key: "impressions", label: "Impressionen", color: C.purple }]}
                    right={[
                      { key: "reach", label: "Reichweite", color: C.blue },
                      { key: "views", label: "Aufrufe", color: C.instagram },
                    ]}
                  />
                </>
              ) : (
                <div style={{ padding: "14px 16px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, fontSize: TYPE.body, color: C.dimmed, textAlign: "center", marginBottom: 20 }}>
                  Erst ein Snapshot vorhanden – ab morgen entstehen hier Trendlinien.
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: "18px 16px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, fontSize: TYPE.body, color: C.dimmed, textAlign: "center", marginBottom: 20 }}>
              Noch keine Statistiken für diesen Beitrag verfügbar.
            </div>
          )}

          {/* Aktionen */}
          <div style={{ display: "flex", gap: SPACE.md, flexWrap: "wrap", paddingTop: 18, borderTop: `1px solid ${C.border}`, marginBottom: 16 }}>
            <button onClick={() => { if (window.confirm("Beitrag aus dem Dashboard entfernen?\n(Bleibt auf den Plattformen online)")) { onHide(post); close(); } }}
              style={{ display: "flex", alignItems: "center", gap: SPACE.sm, padding: "7px 14px", borderRadius: RADIUS.lg, background: C.redGlow, border: `1px solid ${C.red}25`, color: C.redLight, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              <EyeOff size={12} /> Ausblenden
            </button>
            {isConnected && (post.status === "scheduled" || post.status === "draft") && (
              <button onClick={async () => {
                if (!window.confirm("Beitrag unwiderruflich bei Zernio löschen?\nDer Beitrag wird NICHT veröffentlicht.")) return;
                const ok = await onDeleteRemote(post);
                if (ok) close();
              }}
                style={{ display: "flex", alignItems: "center", gap: SPACE.sm, padding: "7px 14px", borderRadius: RADIUS.lg, background: C.red + "15", border: `1px solid ${C.red}50`, color: "#fff", fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                <Trash2 size={12} /> Bei Zernio löschen
              </button>
            )}
          </div>

          {/* Post ID */}
          <div style={{ fontSize: TYPE.small, color: C.dimmed, fontFamily: "monospace", display: "flex", alignItems: "center", gap: SPACE.md }}>
            Post ID: {String(post.id)}
            <button onClick={() => navigator.clipboard?.writeText(String(post.id))} title="Kopieren"
              style={{ background: "transparent", border: "none", color: C.dimmed, cursor: "pointer", display: "flex", padding: 2 }}>
              <Copy size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Zernio-style Filter Dropdown ────────────────────────────────
function FilterDropdown({ label, value, options, onChange, icon: LeadIcon, searchable = false, width, align = "left" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQ(""); } };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const current = options.find((o) => o.key === value);
  const shown = searchable && q
    ? options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()))
    : options;

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: SPACE.md, padding: `${SPACE.md}px ${SPACE.xl}px`, borderRadius: RADIUS.lg,
        border: `1px solid ${open ? C.dimmed : C.border}`, background: C.card,
        color: value && value !== "all" ? C.white : C.muted, fontSize: TYPE.body, fontWeight: 500,
        cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "border-color 0.15s",
      }}>
        {LeadIcon && <LeadIcon size={13} />}
        {current?.label || label}
        <ChevronDown size={12} style={{ opacity: 0.6, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", [align]: 0, zIndex: 60,
          minWidth: width || 200, maxHeight: 380, overflowY: "auto",
          background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.xl,
          boxShadow: "0 12px 32px rgba(0,0,0,0.5)", padding: 5,
        }}>
          {searchable && (
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter..."
              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.md, padding: "7px 10px", color: C.white, fontSize: TYPE.small, fontFamily: "inherit", outline: "none", marginBottom: 5, boxSizing: "border-box" }} />
          )}
          {shown.map((o) => (
            o.divider ? (
              <div key={o.key} style={{ fontSize: TYPE.micro, fontWeight: 600, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", padding: "10px 10px 5px" }}>{o.label}</div>
            ) : (
              <button key={o.key} onClick={() => { onChange(o.key); setOpen(false); setQ(""); }} style={{
                display: "flex", alignItems: "center", gap: SPACE.md, width: "100%", padding: `${SPACE.md}px ${SPACE.lg}px`, borderRadius: RADIUS.md,
                border: "none", background: o.key === value ? C.cardHover : "transparent",
                color: o.key === value ? C.white : C.muted, fontSize: TYPE.body,
                fontWeight: o.key === value ? 500 : 400, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
              }}
                onMouseOver={(e) => { if (o.key !== value) e.currentTarget.style.background = C.bgSoft; }}
                onMouseOut={(e) => { if (o.key !== value) e.currentTarget.style.background = "transparent"; }}>
                {o.dot && <div style={{ width: 7, height: 7, borderRadius: "50%", background: o.dot, flexShrink: 0 }} />}
                {o.icon && <o.icon size={13} color={o.color || "currentColor"} />}
                <span style={{ flex: 1 }}>{o.label}</span>
                {o.key === value && <Check size={13} />}
              </button>
            )
          ))}
          {shown.length === 0 && <div style={{ padding: `${SPACE.lg}px`, fontSize: TYPE.small, color: C.dimmed }}>Keine Treffer</div>}
        </div>
      )}
    </div>
  );
}

function CreatePostModal({ onClose, onSubmit, isSubmitting, accounts, initialDate }) {
  const [content, setContent] = useState("");
  // Keyed by account id (not platform) – multiple accounts can share a
  // platform now (e.g. two TikTok accounts under different profiles), so a
  // post target has to identify the specific account, not just "tiktok".
  // All connected accounts are preselected by default; toggle any off per post.
  const [selectedAccountIds, setSelectedAccountIds] = useState(() => {
    const defaults = {};
    accounts.forEach((a) => {
      defaults[a.id || a.accountId] = true;
    });
    return defaults;
  });
  const [scheduleDate, setScheduleDate] = useState(initialDate || "");
  const [scheduleTime, setScheduleTime] = useState("");
  const [postNow, setPostNow] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [timezone, setTimezone] = useState("Europe/Berlin");
  const [thumbnailTimestamp, setThumbnailTimestamp] = useState(null);
  const [customThumbnail, setCustomThumbnail] = useState(null);
  const [thumbnailMode, setThumbnailMode] = useState("scrub"); // "scrub" | "upload"
  const [contentType, setContentType] = useState("reel");
  const [collabs, setCollabs] = useState(["ludewigmarketing", "proadvicemarketing", ""]);
  const [showAiCaption, setShowAiCaption] = useState(false);
  const [aiTranscript, setAiTranscript] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiResults, setAiResults] = useState(null); // { instagram, tiktok }
  const [includeHashtags, setIncludeHashtags] = useState(false);
  const fileInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  // Default collab partners that should always be included
  const DEFAULT_PARTNERS = ["ludewigmarketing", "proadvicemarketing"];

  const hasVideo = mediaFiles.some((f) => f.type === "video");
  const hasOnlyImages = mediaFiles.length > 0 && !hasVideo;

  const handleFiles = async (files) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/quicktime", "video/webm"];
    const newFiles = [];

    for (const file of files) {
      if (!validTypes.includes(file.type)) continue;
      const isVideo = file.type.startsWith("video/");
      const preview = isVideo ? null : URL.createObjectURL(file);
      newFiles.push({ file, name: file.name, type: isVideo ? "video" : "image", size: file.size, preview, uploading: true, url: null });
    }
    setMediaFiles((prev) => [...prev, ...newFiles]);

    // Auto-select content type based on media
    if (newFiles.some((f) => f.type === "video")) setContentType("reel");
    else if (newFiles.length > 1 || mediaFiles.length + newFiles.length > 1) setContentType("carousel");

    setIsUploading(true);
    for (const mf of newFiles) {
      try {
        const presignRes = await fetch("/api/late", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "presign-upload", filename: mf.file.name, contentType: mf.file.type }),
        });
        const presignData = await presignRes.json();
        if (presignData.uploadUrl) {
          await fetch(presignData.uploadUrl, { method: "PUT", body: mf.file, headers: { "Content-Type": mf.file.type } });
          setMediaFiles((prev) => prev.map((f) => f.name === mf.name ? { ...f, url: presignData.publicUrl, uploading: false } : f));
        } else {
          setMediaFiles((prev) => prev.map((f) => f.name === mf.name ? { ...f, uploading: false, url: "local" } : f));
        }
      } catch {
        setMediaFiles((prev) => prev.map((f) => f.name === mf.name ? { ...f, uploading: false, url: "local" } : f));
      }
    }
    setIsUploading(false);
  };

  const removeFile = (name) => setMediaFiles((prev) => prev.filter((f) => f.name !== name));
  const videoFile = mediaFiles.find((f) => f.type === "video");

  // Collab handlers
  const updateCollab = (i, val) => { const c = [...collabs]; c[i] = val; setCollabs(c); };
  const removeCollab = (i) => { const c = collabs.filter((_, idx) => idx !== i); setCollabs(c.length === 0 ? [""] : c); };

  // Auto-add new row when last row has content
  useEffect(() => {
    if (collabs.length > 0 && collabs[collabs.length - 1].trim() !== "") {
      setCollabs((prev) => [...prev, ""]);
    }
  }, [collabs]);

  // Custom thumbnail upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setCustomThumbnail({ file, preview, name: file.name });
    setThumbnailMode("upload");
    // Upload thumbnail
    try {
      const presignRes = await fetch("/api/late", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "presign-upload", filename: file.name, contentType: file.type }),
      });
      const presignData = await presignRes.json();
      if (presignData.uploadUrl) {
        await fetch(presignData.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        setCustomThumbnail((prev) => ({ ...prev, url: presignData.publicUrl }));
      }
    } catch { /* keep local */ }
  };

  // AI Caption generation from transcript
  const generateCaption = async () => {
    if (!aiTranscript.trim()) return;
    setAiGenerating(true);
    setAiError(null);
    setAiResults(null);
    try {
      const res = await fetch("/api/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: aiTranscript, includeHashtags }),
      });
      const data = await res.json();
      if (data.error) { setAiError(data.error); }
      else if (data.instagram || data.tiktok) {
        setAiResults({ instagram: data.instagram, tiktok: data.tiktok });
      }
    } catch (err) { setAiError(err.message); }
    finally { setAiGenerating(false); }
  };

  const selectAiCaption = (text) => {
    setContent(text);
    setAiResults(null);
    setShowAiCaption(false);
    setAiTranscript("");
  };

  // Toggle a default partner on/off
  const toggleDefaultPartner = (username) => {
    const clean = username.replace(/^@/, "");
    const exists = collabs.some((c) => c.trim().replace(/^@/, "") === clean);
    if (exists) {
      setCollabs((prev) => {
        const filtered = prev.filter((c) => c.trim().replace(/^@/, "") !== clean);
        return filtered.length === 0 ? [""] : filtered;
      });
    } else {
      setCollabs((prev) => {
        const withoutEmpty = prev.filter((c) => c.trim() !== "");
        return [...withoutEmpty, clean, ""];
      });
    }
  };

  // ── Submit-Voraussetzungen ────────────────────────────────────
  const selectedAccounts = accounts.filter((a) => selectedAccountIds[a.id || a.accountId]);
  const mediaUploading = isUploading || mediaFiles.some((f) => f.uploading);
  const readyMedia = mediaFiles.filter((f) => f.url && f.url !== "local");
  const hasMedia = readyMedia.length > 0;

  let blockReason = null;
  if (isSubmitting) blockReason = null;
  else if (!content.trim()) blockReason = "Caption fehlt";
  else if (selectedAccounts.length === 0) blockReason = "Kein Account ausgewählt";
  else if (mediaUploading) blockReason = "Video wird noch hochgeladen…";
  else if (!hasMedia) blockReason = "Video oder Bild erforderlich";
  else if (!postNow && (!scheduleDate || !scheduleTime)) blockReason = "Datum & Uhrzeit fehlen";

  const canSubmit = !blockReason && !isSubmitting;

  const handleSubmit = () => {
    if (!canSubmit) return;

    let scheduledFor = null;
    if (!postNow && scheduleDate && scheduleTime) {
      scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    }

    const mediaItems = mediaFiles.filter((f) => f.url && f.url !== "local").map((f) => ({ type: f.type, url: f.url }));
    const cleanCollabs = collabs.map((c) => c.trim().replace(/^@/, "")).filter(Boolean);

    const platformsPayload = selectedAccounts.map((account) => {
      const p = account.platform;
      const entry = { platform: p, accountId: account.id || account.accountId || undefined };

      // Instagram-specific: collaborators
      if (p === "instagram" && cleanCollabs.length > 0) {
        entry.platformSpecificData = { collaborators: cleanCollabs };
      }

      // TikTok-specific: video cover timestamp
      if (p === "tiktok" && thumbnailMode === "scrub" && thumbnailTimestamp !== null) {
        entry.platformSpecificData = { ...(entry.platformSpecificData || {}), video_cover_timestamp_ms: thumbnailTimestamp };
      }

      return entry;
    });

    onSubmit({ content, platforms: platformsPayload, scheduledFor, publishNow: postNow, mediaItems, timezone, contentType, customThumbnail: thumbnailMode === "upload" && customThumbnail?.url ? customThumbnail.url : null });
  };

  const fmtSize = (bytes) => bytes > 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + " MB" : (bytes / 1024).toFixed(0) + " KB";

  const [panelVisible, setPanelVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setPanelVisible(true)); }, []);
  const handleClose = () => { setPanelVisible(false); setTimeout(onClose, 300); };

  return (
    <div style={{ position: "fixed", inset: 0, background: panelVisible ? "rgba(0,0,0,0.5)" : "transparent", backdropFilter: panelVisible ? "blur(4px)" : "none", zIndex: 100, transition: "background 0.3s, backdrop-filter 0.3s" }} onClick={handleClose}>
      <div className="glass-panel" style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: "50vw", minWidth: 520, maxWidth: 720,
        background: C.glassStrong, borderLeft: `1px solid ${C.glassBorder}`, boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
        display: "flex", flexDirection: "column", transform: panelVisible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }} onClick={(e) => e.stopPropagation()}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: TYPE.labelLg, fontWeight: 600, color: C.white }}>Neuer Beitrag</div>
            <div style={{ fontSize: TYPE.small, color: C.dimmed, marginTop: 2 }}>Erstelle & veröffentliche Content</div>
          </div>
          <button onClick={handleClose} style={{ width: 32, height: 32, borderRadius: RADIUS.lg, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} color={C.muted} /></button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: SPACE.xxxl, flex: 1, overflowY: "auto" }}>

          {/* Platform Selection – one chip per connected account, not per platform,
              since a platform can have more than one account (e.g. two TikToks). */}
          <div>
            <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.muted, marginBottom: 8 }}>Accounts</div>
            <div style={{ display: "flex", gap: SPACE.lg, flexWrap: "wrap" }}>
              {accounts.map((acc) => {
                const id = acc.id || acc.accountId;
                const meta = platformMeta(acc.platform);
                const isSelected = !!selectedAccountIds[id];
                return (
                  <button key={id} onClick={() => setSelectedAccountIds({ ...selectedAccountIds, [id]: !isSelected })} style={{
                    display: "flex", alignItems: "center", gap: SPACE.md, padding: "10px 18px", borderRadius: RADIUS.xl,
                    border: `1.5px solid ${isSelected ? meta.color : C.border}`,
                    background: isSelected ? meta.color + "15" : "transparent",
                    color: isSelected ? meta.color : C.dimmed,
                    fontSize: TYPE.body, fontWeight: 500, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                  }}>
                    <meta.icon size={16} />
                    <span>{meta.label}{acc.profileName ? <span style={{ opacity: 0.7 }}> · {acc.profileName}</span> : null}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
            {accounts.length === 0 && (
              <div style={{ fontSize: TYPE.small, color: C.yellow, marginTop: 6, lineHeight: 1.5 }}>Keine Accounts verbunden. Verbinde Instagram/TikTok unter zernio.com → Settings.</div>
            )}
          </div>

          {/* Content Type Selection – 2 per row */}
          <div>
            <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.muted, marginBottom: 8 }}>Content-Typ</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACE.md }}>
              {CONTENT_TYPES.map((ct) => {
                const isActive = contentType === ct.key;
                const isDisabled = (ct.needsVideo && hasOnlyImages) || (ct.key === "carousel" && hasVideo) || (ct.key === "story" && hasVideo && mediaFiles.length > 1);
                return (
                  <button key={ct.key} onClick={() => { if (!isDisabled) setContentType(ct.key); }}
                    style={{
                      display: "flex", alignItems: "center", gap: SPACE.lg, padding: "12px 14px", borderRadius: RADIUS.xxl,
                      border: `1.5px solid ${isActive ? C.accent : isDisabled ? C.border + "60" : C.border}`,
                      background: isActive ? C.accentGlow : "transparent",
                      opacity: isDisabled ? 0.35 : 1,
                      cursor: isDisabled ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "inherit", textAlign: "left",
                    }}>
                    <div style={{ fontSize: TYPE.h2, lineHeight: 1, flexShrink: 0 }}>{ct.icon}</div>
                    <div>
                      <div style={{ fontSize: TYPE.body, fontWeight: 600, color: isActive ? C.accent : isDisabled ? C.dimmed : C.white }}>{ct.label}</div>
                      <div style={{ fontSize: TYPE.caption, color: isDisabled ? C.dimmed + "80" : C.dimmed, marginTop: 2, lineHeight: 1.4 }}>{ct.desc}</div>
                    </div>
                    {isActive && <Check size={14} color={C.accent} style={{ marginLeft: "auto", flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
            {contentType === "reel" && (
              <div style={{ fontSize: TYPE.caption, color: C.blue, marginTop: 8, padding: `${SPACE.sm}px ${SPACE.lg}px`, background: C.blueGlow, borderRadius: RADIUS.lg, lineHeight: 1.5 }}>
                💡 Tipp: Videos werden standardmäßig als Reels und auf dem Feed angezeigt, um maximale Reichweite zu gewähren.
              </div>
            )}
          </div>

          {/* Caption */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.muted }}>Caption</div>
              <button onClick={() => setShowAiCaption(!showAiCaption)} style={{
                display: "flex", alignItems: "center", gap: SPACE.sm, padding: "5px 12px", borderRadius: RADIUS.lg,
                background: showAiCaption ? C.purpleGlow : "transparent",
                border: `1px solid ${showAiCaption ? C.purple + "60" : C.border}`,
                color: showAiCaption ? C.purple : C.dimmed, fontSize: TYPE.small, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
              }}>
                <Sparkles size={13} /> Mit KI generieren
              </button>
            </div>

            {/* AI Caption Generator Dialog */}
            {showAiCaption && (
              <div style={{ background: C.bg, border: `1px solid ${C.purple}30`, borderRadius: RADIUS.xxl, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, marginBottom: 10 }}>
                  <Sparkles size={16} color={C.purple} />
                  <div style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white }}>Caption aus Transkript generieren</div>
                </div>
                <div style={{ fontSize: TYPE.caption, color: C.dimmed, marginBottom: 10, lineHeight: 1.5 }}>
                  Kopiere das Transkript deines Reels hier rein. Es werden automatisch Captions für Instagram & TikTok generiert.
                </div>

                {!aiResults && (
                  <React.Fragment>
                    <textarea value={aiTranscript} onChange={(e) => setAiTranscript(e.target.value)}
                      placeholder="Transkript hier einfügen..." rows={5}
                      style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.xl, padding: 12, color: C.white, fontSize: TYPE.body, fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box", marginBottom: 10 }}
                      onFocus={(e) => e.target.style.borderColor = C.purple} onBlur={(e) => e.target.style.borderColor = C.border} />

                    {/* Hashtag Toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, marginBottom: 12 }}>
                      <button onClick={() => setIncludeHashtags(!includeHashtags)} style={{
                        width: 36, height: 20, borderRadius: RADIUS.xl, border: "none", cursor: "pointer",
                        background: includeHashtags ? C.purple : C.border, position: "relative", transition: "background 0.2s",
                      }}>
                        <div style={{ width: 16, height: 16, borderRadius: RADIUS.lg, background: "#fff", position: "absolute", top: 2, left: includeHashtags ? 18 : 2, transition: "left 0.2s" }} />
                      </button>
                      <span style={{ fontSize: TYPE.small, color: C.muted }}>Hashtags einfügen</span>
                    </div>
                  </React.Fragment>
                )}

                {aiError && (
                  <div style={{ fontSize: TYPE.small, color: C.redLight, marginBottom: 8, padding: `${SPACE.sm}px ${SPACE.lg}px`, background: C.redGlow, borderRadius: RADIUS.md }}>{aiError}</div>
                )}

                {/* Results: Show both captions */}
                {aiResults && (
                  <div style={{ display: "flex", flexDirection: "column", gap: SPACE.xl, marginBottom: 12 }}>
                    {[
                      { key: "instagram", label: "Instagram", icon: Instagram, color: C.instagram, text: aiResults.instagram, limit: "2.200" },
                      { key: "tiktok", label: "TikTok", icon: TikTokIcon, color: C.tiktok, text: aiResults.tiktok, limit: "4.000" },
                    ].map((p) => (
                      <div key={p.key} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.xl, overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
                            <p.icon size={14} color={p.color} />
                            <span style={{ fontSize: TYPE.small, fontWeight: 600, color: p.color }}>{p.label}</span>
                            <span style={{ fontSize: TYPE.micro, color: C.dimmed }}>{p.text.length} / {p.limit} Zeichen</span>
                          </div>
                          <button onClick={() => selectAiCaption(p.text)} style={{
                            display: "flex", alignItems: "center", gap: SPACE.sm, padding: "5px 12px", borderRadius: RADIUS.md,
                            background: p.color + "15", border: `1px solid ${p.color}40`, color: p.color,
                            fontSize: TYPE.caption, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                          }}>
                            <Check size={11} /> Übernehmen
                          </button>
                        </div>
                        <div style={{ padding: 14, fontSize: TYPE.small, color: C.white, lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 180, overflowY: "auto" }}>
                          {p.text}
                        </div>
                      </div>
                    ))}
                    <button onClick={() => { setAiResults(null); }} style={{ padding: "6px 14px", borderRadius: RADIUS.lg, background: "transparent", border: `1px solid ${C.border}`, color: C.dimmed, fontSize: TYPE.small, cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start" }}>
                      Neu generieren
                    </button>
                  </div>
                )}

                {!aiResults && (
                  <div style={{ display: "flex", gap: SPACE.md, justifyContent: "flex-end" }}>
                    <button onClick={() => { setShowAiCaption(false); setAiTranscript(""); setAiError(null); setAiResults(null); }} style={{ padding: "7px 14px", borderRadius: RADIUS.lg, background: "transparent", border: `1px solid ${C.border}`, color: C.dimmed, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
                    <button onClick={generateCaption} disabled={aiGenerating || !aiTranscript.trim()} style={{
                      display: "flex", alignItems: "center", gap: SPACE.sm, padding: "7px 16px", borderRadius: RADIUS.lg,
                      background: !aiTranscript.trim() ? C.border : C.purple, border: "none",
                      color: "#fff", fontSize: TYPE.small, fontWeight: 600, cursor: !aiTranscript.trim() ? "not-allowed" : "pointer",
                      fontFamily: "inherit", opacity: aiGenerating ? 0.7 : 1,
                    }}>
                      {aiGenerating ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={13} />}
                      {aiGenerating ? "Wird generiert..." : "Captions generieren"}
                    </button>
                  </div>
                )}
              </div>
            )}

            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Caption hier eingeben oder mit KI generieren..." rows={4}
              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.xxl, padding: 14, color: C.white, fontSize: TYPE.bodyLg, fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = C.accent} onBlur={(e) => e.target.style.borderColor = C.border} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <div style={{ fontSize: TYPE.small, color: content.length > 2200 ? C.redLight : C.dimmed }}>{content.length} / 2.200</div>
            </div>
          </div>

          {/* Collab Partner */}
          <div>
            <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.muted, marginBottom: 8 }}>Collab Partner</div>

            {/* Quick-select default partners */}
            <div style={{ display: "flex", gap: SPACE.md, marginBottom: 10 }}>
              {DEFAULT_PARTNERS.map((partner) => {
                const isActive = collabs.some((c) => c.trim().replace(/^@/, "") === partner);
                return (
                  <button key={partner} onClick={() => toggleDefaultPartner(partner)} style={{
                    display: "flex", alignItems: "center", gap: SPACE.sm, padding: "6px 14px", borderRadius: RADIUS.pill,
                    border: `1.5px solid ${isActive ? C.green : C.border}`,
                    background: isActive ? C.greenGlow : "transparent",
                    color: isActive ? C.green : C.dimmed, fontSize: TYPE.small, fontWeight: 500,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                  }}>
                    {isActive ? <Check size={12} /> : <Plus size={12} />}
                    @{partner}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: SPACE.sm }}>
              {collabs.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: TYPE.body, color: C.dimmed, fontWeight: 500, pointerEvents: "none" }}>@</span>
                    <input type="text" value={c} onChange={(e) => updateCollab(i, e.target.value)}
                      placeholder="username"
                      style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: "8px 12px 8px 26px", color: C.white, fontSize: TYPE.body, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                      onFocus={(e) => e.target.style.borderColor = C.accent} onBlur={(e) => e.target.style.borderColor = C.border} />
                  </div>
                  {(collabs.length > 1 || c.trim()) && (
                    <button onClick={() => removeCollab(i)} style={{ width: 28, height: 28, borderRadius: RADIUS.md, background: "transparent", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                      <X size={12} color={C.dimmed} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.muted, marginBottom: 8 }}>Medien</div>
            <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm" multiple
              style={{ display: "none" }} onChange={(e) => handleFiles(Array.from(e.target.files))} />

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(Array.from(e.dataTransfer.files)); }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? C.accent : C.border}`, borderRadius: RADIUS.xxl, padding: "24px 16px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: SPACE.md, cursor: "pointer",
                background: isDragging ? C.accentGlow : "transparent", transition: "all 0.2s",
              }}>
              <Upload size={24} color={isDragging ? C.accent : C.dimmed} />
              <div style={{ fontSize: TYPE.body, fontWeight: 500, color: isDragging ? C.accent : C.muted }}>Bilder oder Videos hierher ziehen</div>
              <div style={{ fontSize: TYPE.small, color: C.dimmed }}>oder klicken zum Durchsuchen · JPG, PNG, MP4, MOV</div>
            </div>

            {mediaFiles.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: SPACE.md, marginTop: 12 }}>
                {mediaFiles.map((f) => (
                  <div key={f.name} style={{ display: "flex", alignItems: "center", gap: SPACE.xl, background: C.bg, borderRadius: RADIUS.xl, padding: `${SPACE.md}px ${SPACE.xl}px`, border: `1px solid ${C.border}` }}>
                    {f.preview ? (
                      <img src={f.preview} alt="" style={{ width: 40, height: 40, borderRadius: RADIUS.lg, objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: RADIUS.lg, background: C.purpleGlow, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileVideo size={18} color={C.purple} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                      <div style={{ fontSize: TYPE.caption, color: C.dimmed }}>{fmtSize(f.size)} · {f.type === "video" ? "Video" : "Bild"}{f.uploading ? " · Wird hochgeladen..." : ""}</div>
                    </div>
                    {f.uploading && <Loader2 size={16} color={C.muted} style={{ animation: "spin 1s linear infinite" }} />}
                    {f.url === "local" && <div style={{ fontSize: TYPE.micro, color: C.yellow, fontWeight: 500, padding: `${SPACE.xxs}px ${SPACE.sm}px`, background: C.yellowGlow, borderRadius: RADIUS.sm }}>Lokal</div>}
                    {f.url && f.url !== "local" && <Check size={16} color={C.green} />}
                    <button onClick={(e) => { e.stopPropagation(); removeFile(f.name); }} style={{ width: 28, height: 28, borderRadius: RADIUS.md, background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Trash2 size={14} color={C.dimmed} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Thumbnail Options for Video */}
            {videoFile && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.muted, marginBottom: 8, display: "flex", alignItems: "center", gap: SPACE.sm }}>
                  <Scissors size={14} /> Thumbnail
                </div>
                {/* Mode Toggle */}
                <div style={{ display: "flex", gap: SPACE.md, marginBottom: 10 }}>
                  <button onClick={() => setThumbnailMode("scrub")} style={{
                    display: "flex", alignItems: "center", gap: SPACE.sm, padding: "6px 14px", borderRadius: RADIUS.lg,
                    border: `1px solid ${thumbnailMode === "scrub" ? C.accent : C.border}`,
                    background: thumbnailMode === "scrub" ? C.accentGlow : "transparent",
                    color: thumbnailMode === "scrub" ? C.accent : C.dimmed, fontSize: TYPE.small, fontWeight: 500,
                    cursor: "pointer", fontFamily: "inherit",
                  }}><Scissors size={12} /> Frame aus Video</button>
                  <button onClick={() => { setThumbnailMode("upload"); }} style={{
                    display: "flex", alignItems: "center", gap: SPACE.sm, padding: "6px 14px", borderRadius: RADIUS.lg,
                    border: `1px solid ${thumbnailMode === "upload" ? C.accent : C.border}`,
                    background: thumbnailMode === "upload" ? C.accentGlow : "transparent",
                    color: thumbnailMode === "upload" ? C.accent : C.dimmed, fontSize: TYPE.small, fontWeight: 500,
                    cursor: "pointer", fontFamily: "inherit",
                  }}><Upload size={12} /> Eigenes Bild</button>
                </div>

                {thumbnailMode === "scrub" && (
                  <ThumbnailPicker videoFile={videoFile} onSelect={setThumbnailTimestamp} selectedTimestamp={thumbnailTimestamp} />
                )}

                {thumbnailMode === "upload" && (
                  <div style={{ background: C.bg, borderRadius: RADIUS.xl, padding: 12, border: `1px solid ${C.border}` }}>
                    <input type="file" ref={thumbInputRef} accept="image/jpeg,image/png,image/webp"
                      style={{ display: "none" }} onChange={handleThumbnailUpload} />
                    {!customThumbnail ? (
                      <div onClick={() => thumbInputRef.current?.click()}
                        style={{ border: `2px dashed ${C.border}`, borderRadius: RADIUS.xl, padding: `${SPACE.xxxl}px ${SPACE.xxl}px`, display: "flex", flexDirection: "column", alignItems: "center", gap: SPACE.sm, cursor: "pointer" }}>
                        <Upload size={20} color={C.dimmed} />
                        <div style={{ fontSize: TYPE.small, fontWeight: 500, color: C.muted }}>Thumbnail-Bild hochladen</div>
                        <div style={{ fontSize: TYPE.caption, color: C.dimmed }}>JPG, PNG oder WebP</div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: SPACE.xl }}>
                        <img src={customThumbnail.preview} alt="Thumbnail" style={{ width: 80, height: "auto", borderRadius: RADIUS.lg, border: `1px solid ${C.border}` }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: TYPE.small, color: C.green, fontWeight: 600 }}>Thumbnail hochgeladen</div>
                          <div style={{ fontSize: TYPE.caption, color: C.dimmed, marginTop: 2 }}>{customThumbnail.name}</div>
                        </div>
                        <button onClick={() => { setCustomThumbnail(null); }} style={{ width: 28, height: 28, borderRadius: RADIUS.md, background: "transparent", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <X size={12} color={C.dimmed} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Scheduling */}
          <div>
            <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.muted, marginBottom: 8 }}>Zeitplanung</div>
            <div style={{ display: "flex", gap: SPACE.lg, marginBottom: 12 }}>
              <button onClick={() => setPostNow(true)} style={{
                display: "flex", alignItems: "center", gap: SPACE.sm, padding: `${SPACE.md}px ${SPACE.xxl}px`, borderRadius: RADIUS.lg,
                border: `1px solid ${postNow ? C.green : C.border}`, background: postNow ? C.greenGlow : "transparent",
                color: postNow ? C.green : C.dimmed, fontSize: TYPE.body, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              }}><Send size={14} /> Sofort posten</button>
              <button onClick={() => setPostNow(false)} style={{
                display: "flex", alignItems: "center", gap: SPACE.sm, padding: `${SPACE.md}px ${SPACE.xxl}px`, borderRadius: RADIUS.lg,
                border: `1px solid ${!postNow ? C.blue : C.border}`, background: !postNow ? C.blueGlow : "transparent",
                color: !postNow ? C.blue : C.dimmed, fontSize: TYPE.body, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              }}><Clock size={14} /> Planen</button>
            </div>
            {!postNow && (
              <div style={{ display: "flex", flexDirection: "column", gap: SPACE.lg }}>
                <div style={{ display: "flex", gap: SPACE.lg }}>
                  <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                    style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: `${SPACE.md}px ${SPACE.xl}px`, color: C.white, fontSize: TYPE.body, fontFamily: "inherit", outline: "none", colorScheme: "dark" }} />
                  <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}
                    style={{ width: 120, background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: `${SPACE.md}px ${SPACE.xl}px`, color: C.white, fontSize: TYPE.body, fontFamily: "inherit", outline: "none", colorScheme: "dark" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
                  <div style={{ fontSize: TYPE.small, color: C.dimmed, fontWeight: 500 }}>Zeitzone:</div>
                  <TimezonePicker value={timezone} onChange={setTimezone} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: SPACE.lg, padding: "16px 24px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          {blockReason && (
            <div style={{ display: "flex", alignItems: "center", gap: SPACE.sm, marginRight: "auto", fontSize: TYPE.small, color: mediaUploading ? C.muted : C.dimmed }}>
              {mediaUploading
                ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                : <AlertCircle size={13} />}
              {blockReason}
            </div>
          )}
          <button onClick={handleClose} style={{ padding: `${SPACE.lg}px ${SPACE.xxxl}px`, borderRadius: RADIUS.xl, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: TYPE.body, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
          <button onClick={handleSubmit} disabled={!canSubmit} title={blockReason || ""} style={{
            display: "flex", alignItems: "center", gap: SPACE.sm, padding: "10px 24px", borderRadius: RADIUS.xl,
            background: canSubmit ? C.cta : C.border, border: "none",
            color: canSubmit ? "#fff" : C.dimmed, fontSize: TYPE.body, fontWeight: 600,
            cursor: canSubmit ? "pointer" : "not-allowed",
            fontFamily: "inherit", boxShadow: canSubmit ? `inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 16px ${C.ctaGlow}` : "none",
            opacity: isSubmitting ? 0.7 : 1, transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
          }}>
            {isSubmitting ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : postNow ? <Send size={15} /> : <Clock size={15} />}
            {isSubmitting ? "Wird gesendet..." : postNow ? "Jetzt posten" : "Beitrag planen"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Demo Notifications ──────────────────────────────────────────
const demoNotifications = [
  { id: 1, type: "like", user: "max.energy", text: "gefällt dein Beitrag", post: "Energievertrieb 2026", time: "vor 5 Min.", read: false, platform: "instagram" },
  { id: 2, type: "comment", user: "sarah_vertrieb", text: "hat kommentiert: \"Mega Tipps! 🔥\"", post: "Door-to-Door Sales: 5 Tipps", time: "vor 12 Min.", read: false, platform: "tiktok" },
  { id: 3, type: "follow", user: "energy_pro_de", text: "folgt dir jetzt", post: null, time: "vor 28 Min.", read: false, platform: "instagram" },
  { id: 4, type: "like", user: "krefeld_strom", text: "gefällt dein Beitrag", post: "Stadtwerke Krefeld – Behind the Scenes", time: "vor 1 Std.", read: true, platform: "instagram" },
  { id: 5, type: "comment", user: "vertrieb_kevin", text: "hat kommentiert: \"Wann kommt Teil 2?\"", post: "Tag im Leben eines Energieberaters", time: "vor 2 Std.", read: true, platform: "tiktok" },
  { id: 6, type: "follow", user: "julia.sales", text: "folgt dir jetzt", post: null, time: "vor 3 Std.", read: true, platform: "instagram" },
  { id: 7, type: "like", user: "powerteam_nrw", text: "gefällt dein Beitrag", post: "Partnermodell erklärt", time: "vor 4 Std.", read: true, platform: "instagram" },
  { id: 8, type: "comment", user: "daniel.agency", text: "hat kommentiert: \"Top Content!\"", post: "Energievertrieb 2026", time: "vor 5 Std.", read: true, platform: "tiktok" },
];

// ── Sidebar ─────────────────────────────────────────────────────
// ── Content Pipeline (Kanban Board) ─────────────────────────────
const PIPELINE_COLUMNS = [
  { key: "idea", label: "Idee", icon: Lightbulb, colorKey: "yellow", glowKey: "yellowGlow", desc: "Rohe Content-Ideen" },
  { key: "script", label: "Skript", icon: PenLine, colorKey: "blue", glowKey: "blueGlow", desc: "Skript aus der Idee" },
  { key: "optimized", label: "Optimiertes Skript", icon: Wand2, colorKey: "purple", glowKey: "purpleGlow", desc: "Überarbeitet & verbessert" },
  { key: "ready", label: "Ready für Produktion", icon: Rocket, colorKey: "green", glowKey: "greenGlow", desc: "Bereit zum Dreh" },
];

function ContentPipelinePanel() {
  const [cards, setCards] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pipelineCards") || "[]"); } catch { return []; }
  });
  const [dragId, setDragId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [addingCol, setAddingCol] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const persist = (next) => {
    setCards(next);
    try { localStorage.setItem("pipelineCards", JSON.stringify(next)); } catch {}
  };

  const addCard = (colKey) => {
    if (!newTitle.trim()) return;
    persist([...cards, { id: Date.now(), title: newTitle.trim(), notes: "", column: colKey, createdAt: new Date().toISOString() }]);
    setNewTitle("");
  };

  const moveCard = (id, colKey) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.column === colKey) return;
    persist([...cards.filter((c) => c.id !== id), { ...card, column: colKey }]);
  };

  const moveStep = (id, dir) => {
    const card = cards.find((c) => c.id === id);
    if (!card) return;
    const idx = PIPELINE_COLUMNS.findIndex((col) => col.key === card.column);
    const target = PIPELINE_COLUMNS[idx + dir];
    if (target) moveCard(id, target.key);
  };

  const deleteCard = (id) => persist(cards.filter((c) => c.id !== id));

  const startEdit = (card) => { setEditingId(card.id); setEditTitle(card.title); setEditNotes(card.notes || ""); };
  const saveEdit = () => {
    persist(cards.map((c) => c.id === editingId ? { ...c, title: editTitle.trim() || c.title, notes: editNotes } : c));
    setEditingId(null);
  };

  return (
    <div style={{ padding: "24px 32px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: TYPE.h2, fontWeight: 700, letterSpacing: "-0.02em", color: C.white, display: "flex", alignItems: "center", gap: SPACE.lg }}>
            <Kanban size={22} color={C.accent} /> Content-Pipeline
          </div>
          <div style={{ fontSize: TYPE.body, color: C.muted, marginTop: 2 }}>Von der Idee bis zur Produktion – Karten per Drag & Drop verschieben</div>
        </div>
        <div style={{ fontSize: TYPE.small, color: C.dimmed, background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: "8px 14px" }}>
          {cards.length} Karte{cards.length !== 1 ? "n" : ""} insgesamt
        </div>
      </div>

      {/* Board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: SPACE.xxl, alignItems: "start" }}>
        {PIPELINE_COLUMNS.map((col, colIdx) => {
          const color = C[col.colorKey];
          const glow = C[col.glowKey];
          const colCards = cards.filter((c) => c.column === col.key);
          const isDragTarget = dragOverCol === col.key && dragId !== null;

          return (
            <div key={col.key}
              onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.key); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverCol(null); }}
              onDrop={(e) => { e.preventDefault(); if (dragId !== null) moveCard(dragId, col.key); setDragId(null); setDragOverCol(null); }}
              style={{
                background: C.bgSoft, borderRadius: RADIUS.xxxl, border: `1px solid ${isDragTarget ? color : C.border}`,
                borderTop: `3px solid ${color}`, minHeight: 320, display: "flex", flexDirection: "column",
                boxShadow: isDragTarget ? `0 0 24px ${glow}` : "none", transition: "border-color 0.2s, box-shadow 0.2s",
              }}>
              {/* Column header */}
              <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", gap: SPACE.md }}>
                <div style={{ width: 30, height: 30, borderRadius: RADIUS.xl, background: glow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <col.icon size={15} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{col.label}</div>
                  <div style={{ fontSize: TYPE.caption, color: C.dimmed, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{col.desc}</div>
                </div>
                <span style={{ fontSize: TYPE.caption, fontWeight: 600, color, background: glow, padding: `${SPACE.xxs}px ${SPACE.md}px`, borderRadius: RADIUS.xl, flexShrink: 0 }}>{colCards.length}</span>
              </div>

              {/* Cards */}
              <div style={{ padding: "4px 10px 10px", display: "flex", flexDirection: "column", gap: SPACE.md, flex: 1 }}>
                {colCards.length === 0 && !isDragTarget && (
                  <div style={{ border: `1.5px dashed ${C.border}`, borderRadius: RADIUS.xl, padding: "18px 12px", textAlign: "center", fontSize: TYPE.small, color: C.dimmed }}>
                    Noch keine Karten
                  </div>
                )}
                {isDragTarget && (
                  <div style={{ border: `1.5px dashed ${color}`, background: glow, borderRadius: RADIUS.xl, padding: "14px 12px", textAlign: "center", fontSize: TYPE.small, fontWeight: 500, color }}>
                    Hier ablegen
                  </div>
                )}
                {colCards.map((card) => {
                  const isEditing = editingId === card.id;
                  const isDragging = dragId === card.id;
                  return (
                    <div key={card.id}
                      draggable={!isEditing}
                      onDragStart={(e) => { setDragId(card.id); e.dataTransfer.effectAllowed = "move"; }}
                      onDragEnd={() => { setDragId(null); setDragOverCol(null); }}
                      style={{
                        background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${color}`,
                        borderRadius: RADIUS.xl, padding: `${SPACE.lg}px ${SPACE.xl}px`, cursor: isEditing ? "default" : "grab",
                        opacity: isDragging ? 0.4 : 1, transition: "opacity 0.15s, border-color 0.2s, box-shadow 0.2s",
                      }}
                      onMouseOver={(e) => { if (!isEditing) { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 16px ${glow}`; e.currentTarget.style.borderLeftColor = color; } }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderLeftColor = color; }}>
                      {isEditing ? (
                        <div>
                          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus
                            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingId(null); }}
                            style={{ width: "100%", background: C.bg, border: `1px solid ${color}`, borderRadius: RADIUS.lg, padding: "7px 10px", color: C.white, fontSize: TYPE.body, fontWeight: 500, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                          <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} placeholder="Notizen / Skript-Text..."
                            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: "7px 10px", color: C.white, fontSize: TYPE.small, fontFamily: "inherit", outline: "none", resize: "vertical", lineHeight: 1.5, marginTop: 6, boxSizing: "border-box" }} />
                          <div style={{ display: "flex", gap: SPACE.sm, justifyContent: "flex-end", marginTop: 6 }}>
                            <button onClick={() => setEditingId(null)} style={{ padding: "5px 10px", borderRadius: RADIUS.md, background: "transparent", border: `1px solid ${C.border}`, color: C.dimmed, fontSize: TYPE.caption, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
                            <button onClick={saveEdit} style={{ padding: "5px 12px", borderRadius: RADIUS.md, background: color, border: "none", color: "#fff", fontSize: TYPE.caption, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Speichern</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: SPACE.sm }}>
                            <GripVertical size={13} color={C.dimmed} style={{ marginTop: 2, flexShrink: 0, opacity: 0.6 }} />
                            <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.white, lineHeight: 1.4, flex: 1, wordBreak: "break-word" }}>{card.title}</div>
                          </div>
                          {card.notes && (
                            <div style={{ fontSize: TYPE.small, color: C.muted, lineHeight: 1.5, marginTop: 5, marginLeft: 19, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", whiteSpace: "pre-wrap" }}>{card.notes}</div>
                          )}
                          <div style={{ display: "flex", alignItems: "center", gap: SPACE.xs, marginTop: 8, marginLeft: 19 }}>
                            <button onClick={() => moveStep(card.id, -1)} disabled={colIdx === 0} title="Schritt zurück"
                              style={{ width: 24, height: 24, borderRadius: RADIUS.md, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: colIdx === 0 ? "default" : "pointer", opacity: colIdx === 0 ? 0.3 : 1 }}>
                              <ChevronLeft size={12} color={C.muted} />
                            </button>
                            <button onClick={() => moveStep(card.id, 1)} disabled={colIdx === PIPELINE_COLUMNS.length - 1} title="Nächster Schritt"
                              style={{ width: 24, height: 24, borderRadius: RADIUS.md, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: colIdx === PIPELINE_COLUMNS.length - 1 ? "default" : "pointer", opacity: colIdx === PIPELINE_COLUMNS.length - 1 ? 0.3 : 1 }}>
                              <ChevronRight size={12} color={C.muted} />
                            </button>
                            <div style={{ flex: 1 }} />
                            <button onClick={() => startEdit(card)} title="Bearbeiten"
                              style={{ width: 24, height: 24, borderRadius: RADIUS.md, background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                              <Pencil size={12} color={C.dimmed} />
                            </button>
                            <button onClick={() => deleteCard(card.id)} title="Löschen"
                              style={{ width: 24, height: 24, borderRadius: RADIUS.md, background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                              <Trash2 size={12} color={C.dimmed} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add card */}
              <div style={{ padding: "0 10px 12px" }}>
                {addingCol === col.key ? (
                  <div style={{ background: C.card, border: `1px solid ${color}`, borderRadius: RADIUS.xl, padding: 10 }}>
                    <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus placeholder="Titel der Karte..."
                      onKeyDown={(e) => { if (e.key === "Enter") addCard(col.key); if (e.key === "Escape") { setAddingCol(null); setNewTitle(""); } }}
                      style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: "7px 10px", color: C.white, fontSize: TYPE.body, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: SPACE.sm, justifyContent: "flex-end", marginTop: 8 }}>
                      <button onClick={() => { setAddingCol(null); setNewTitle(""); }} style={{ padding: "5px 10px", borderRadius: RADIUS.md, background: "transparent", border: `1px solid ${C.border}`, color: C.dimmed, fontSize: TYPE.caption, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
                      <button onClick={() => addCard(col.key)} style={{ padding: "5px 12px", borderRadius: RADIUS.md, background: color, border: "none", color: "#fff", fontSize: TYPE.caption, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Hinzufügen</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setAddingCol(col.key); setNewTitle(""); }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: SPACE.sm, width: "100%", padding: `${SPACE.md}px 0`, borderRadius: RADIUS.xl, background: "transparent", border: `1.5px dashed ${C.border}`, color: C.dimmed, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; e.currentTarget.style.background = glow; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.dimmed; e.currentTarget.style.background = "transparent"; }}>
                    <Plus size={13} /> Karte hinzufügen
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Sidebar({ activeTab, onTabChange, unreadCount, errorCount, isDarkMode, onToggleTheme, isOpen, onClose }) {
  const [expandedMenu, setExpandedMenu] = useState(null);

  // Sidebar colors — dark-glass: translucent frosted fill + accent-tinted
  // active state instead of a flat neutral panel.
  const SB = {
    bg: isDarkMode ? "rgba(18,21,29,0.55)" : "rgba(255,255,255,0.75)",
    activeBg: C.accentGlow,
    hoverBg: isDarkMode ? "rgba(255,255,255,0.06)" : "#EEEEFF",
    text: isDarkMode ? "#94A3B8" : "#6B7280",
    activeText: isDarkMode ? "#F5F7FA" : "#111827",
    border: isDarkMode ? "rgba(255,255,255,0.08)" : "#E5E7EB",
    userBg: isDarkMode ? "rgba(255,255,255,0.05)" : "#F3F4F6",
  };

  const navItems = [
    { key: "home", icon: LayoutDashboard, label: "Übersicht" },
    { key: "connections", icon: Globe, label: "Verbindungen" },
    {
      key: "posts", icon: Send, label: "Posts", expandable: true,
      children: [
        { key: "dashboard", label: "Alle Posts" },
        { key: "calendar", label: "Warteschlange" },
      ],
    },
    { key: "analytics", icon: BarChart3, label: "Statistiken" },
    {
      key: "inbox", icon: Bell, label: "Posteingang", badge: unreadCount, expandable: true,
      children: [
        { key: "notifications", label: "Nachrichten" },
        { key: "comments", label: "Kommentare" },
      ],
    },
    { key: "ads", icon: TrendingUp, label: "Ads", disabled: true },
    { key: "skripte", icon: FileText, label: "Skripte" },
    { key: "pipeline", icon: Kanban, label: "Content-Pipeline" },
    { key: "webhooks", icon: RefreshCw, label: "Webhooks", disabled: true },
    { key: "logs", icon: Shield, label: "Logs" },
    { key: "settings", icon: Settings, label: "Einstellungen", badge: errorCount },
  ];

  const navItemStyle = (isActive, disabled) => ({
    display: "flex", alignItems: "center", gap: SPACE.lg, width: "100%", padding: "9px 16px", borderRadius: RADIUS.lg,
    border: "none", background: isActive ? SB.activeBg : "transparent", color: isActive ? SB.activeText : disabled ? SB.text + "60" : SB.text,
    fontSize: TYPE.body, fontWeight: isActive ? 500 : 500, cursor: disabled ? "default" : "pointer",
    fontFamily: "inherit", transition: "all 0.15s", textAlign: "left", opacity: disabled ? 0.5 : 1,
    // Right-edge indicator bar on the active item, matching the reference.
    boxShadow: isActive ? `inset -3px 0 0 0 ${C.accent}` : "none",
  });

  const subItemStyle = (isActive) => ({
    display: "flex", alignItems: "center", gap: SPACE.md, width: "100%", padding: "7px 16px 7px 42px", borderRadius: RADIUS.lg,
    border: "none", background: isActive ? SB.activeBg : "transparent", color: isActive ? SB.activeText : SB.text,
    fontSize: TYPE.body, fontWeight: isActive ? 500 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "left",
  });

  // Auto-expand parent menus based on active tab
  const isPostsChild = ["dashboard", "calendar"].includes(activeTab);
  const isInboxChild = ["notifications", "comments"].includes(activeTab);

  return (
    <div className={`app-sidebar glass-panel${isOpen ? " open" : ""}`} style={{
      width: 220, minWidth: 220, minHeight: "100vh", background: SB.bg, borderRight: `1px solid ${SB.border}`,
      display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 60,
      overflowY: "auto",
    }}>
      {/* User Profile */}
      <div style={{ padding: "20px 16px 16px", display: "flex", alignItems: "center", gap: SPACE.lg }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, #9A3412)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: TYPE.label, color: "#fff", flexShrink: 0 }}>D</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: TYPE.body, fontWeight: 600, color: SB.activeText, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Dariel</div>
          <div style={{ fontSize: TYPE.micro, color: SB.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>darielo30@live.de</div>
        </div>
        <button onClick={onClose} aria-label="Menü schließen" className="mobile-menu-btn" style={{
          width: 32, height: 32, borderRadius: RADIUS.lg, border: `1px solid ${SB.border}`, background: "transparent",
          color: SB.text, cursor: "pointer", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <X size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ padding: `${SPACE.xs}px ${SPACE.md}px`, flex: 1, display: "flex", flexDirection: "column", gap: SPACE.xxs }}>
        {navItems.map((item) => {
          const isParentActive = item.expandable
            ? item.children.some((c) => c.key === activeTab)
            : activeTab === item.key;
          const isExpanded = item.expandable && (
            (item.key === "posts" && (isPostsChild || expandedMenu === "posts")) ||
            (item.key === "inbox" && (isInboxChild || expandedMenu === "inbox"))
          );

          return (
            <div key={item.key}>
              <button
                onClick={() => {
                  if (item.disabled) return;
                  if (item.expandable) {
                    setExpandedMenu(isExpanded ? null : item.key);
                    // Navigate to first child if not already in this group
                    if (!item.children.some((c) => c.key === activeTab)) {
                      onTabChange(item.children[0].key);
                      onClose?.();
                    }
                  } else {
                    onTabChange(item.key);
                    setExpandedMenu(null);
                    onClose?.();
                  }
                }}
                style={navItemStyle(isParentActive && !item.expandable, item.disabled)}
                onMouseOver={(e) => { if (!isParentActive && !item.disabled) e.currentTarget.style.background = SB.hoverBg; }}
                onMouseOut={(e) => { if (!isParentActive && !item.disabled) e.currentTarget.style.background = "transparent"; }}
              >
                <item.icon size={16} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{ fontSize: TYPE.micro, fontWeight: 600, color: "#fff", background: C.accent, padding: "1px 6px", borderRadius: RADIUS.lg, minWidth: 18, textAlign: "center" }}>{item.badge > 99 ? "99+" : item.badge}</span>
                )}
                {item.expandable && (
                  <ChevronDown size={13} style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", opacity: 0.5 }} />
                )}
              </button>
              {/* Sub-items */}
              {item.expandable && isExpanded && (
                <div style={{ marginTop: 1 }}>
                  {item.children.map((child) => {
                    const childActive = activeTab === child.key;
                    return (
                      <button key={child.key} onClick={() => { onTabChange(child.key); onClose?.(); }} style={subItemStyle(childActive)}
                        onMouseOver={(e) => { if (!childActive) e.currentTarget.style.background = SB.hoverBg; }}
                        onMouseOut={(e) => { if (!childActive) e.currentTarget.style.background = "transparent"; }}>
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom: Theme Toggle */}
      <div style={{ padding: `${SPACE.xl}px ${SPACE.xxl}px`, borderTop: `1px solid ${SB.border}` }}>
        <button onClick={onToggleTheme} style={{
          display: "flex", alignItems: "center", gap: SPACE.md, width: "100%", padding: `${SPACE.md}px ${SPACE.xl}px`, borderRadius: RADIUS.lg,
          background: "transparent", border: "none", color: SB.text, fontSize: TYPE.small, cursor: "pointer", fontFamily: "inherit",
        }}
        onMouseOver={(e) => e.currentTarget.style.background = SB.hoverBg}
        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
          {isDarkMode ? <Sun size={15} color={C.yellow} /> : <Moon size={15} color="#6366F1" />}
          {isDarkMode ? "Heller Modus" : "Dunkler Modus"}
        </button>
      </div>
    </div>
  );
}

// ── Notification Panel ──────────────────────────────────────────
function NotificationPanel({ notifications, onMarkAllRead, isConnected, defaultView }) {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [apiComments, setApiComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [inboxView, setInboxView] = useState(defaultView || "dms"); // "comments" | "dms"
  // Sync view when tab changes
  useEffect(() => { if (defaultView) setInboxView(defaultView); }, [defaultView]);
  const [conversations, setConversations] = useState([]);
  const [loadingDMs, setLoadingDMs] = useState(false);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Always fetch real comments from Zernio Inbox API (no isConnected gate)
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      setApiError(null);
      try {
        const url = platformFilter !== "all"
          ? `/api/late?action=inbox-comments&platform=${platformFilter}`
          : `/api/late?action=inbox-comments`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) { setApiError(data.error); setLoadingComments(false); return; }
        const raw = data._raw || data;
        const comments = Array.isArray(raw) ? raw : (raw.comments || raw.data || raw.items || []);
        const mapped = comments.map((c, i) => ({
          id: c.id || c._id || `api-${i}`,
          type: "comment",
          user: c.author?.username || c.author?.name || c.username || c.from?.username || "Unbekannt",
          avatar: c.author?.profilePicture || c.author?.avatar || c.from?.profilePicture || null,
          text: c.text || c.content || c.message || c.body || "",
          post: c.postTitle || c.postContent?.substring(0, 60) || c.post?.content?.substring(0, 60) || "Beitrag",
          postId: c.postId || c.post?.id || c.post?._id || null,
          postThumbnail: c.post?.thumbnail || c.post?.mediaItems?.[0]?.url || null,
          commentId: c.id || c._id || c.commentId || null,
          time: c.createdAt || c.timestamp || c.created || "",
          timeFormatted: c.createdAt ? new Date(c.createdAt).toLocaleString("de-DE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "",
          read: c.read || c.seen || false,
          platform: (c.platform || c.source || "instagram").toLowerCase(),
          replies: c.replies || c.children || [],
          likes: c.likes || c.likeCount || 0,
          isApi: true,
        }));
        setApiComments(mapped);
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [platformFilter]);

  // Always fetch DM conversations (no isConnected gate)
  useEffect(() => {
    if (inboxView !== "dms") return;
    const fetchDMs = async () => {
      setLoadingDMs(true);
      try {
        const url = platformFilter !== "all"
          ? `/api/late?action=inbox-conversations&platform=${platformFilter}`
          : `/api/late?action=inbox-conversations`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) { setApiError(data.error); setLoadingDMs(false); return; }
        const raw = data._raw || data;
        const convos = Array.isArray(raw) ? raw : (raw.conversations || raw.data || raw.items || []);
        setConversations(convos);
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoadingDMs(false);
      }
    };
    fetchDMs();
  }, [inboxView, platformFilter]);

  const handleReply = async (conversationId) => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch("/api/late", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "inbox-reply", conversationId, message: replyText }),
      });
      const data = await res.json();
      if (data.error) { setApiError(data.error); }
      else { setReplyText(""); }
    } catch (err) { setApiError(err.message); }
    finally { setSendingReply(false); }
  };

  // Always use real API data (no demo fallback)
  const allNotifs = apiComments;
  const filtered = platformFilter === "all" ? allNotifs : allNotifs.filter((n) => n.platform === platformFilter);
  const isDemo = false; // removed demo mode – always live

  // Zernio-style split panel styles
  const listPanelStyle = { width: 360, minWidth: 360, borderRight: `1px solid ${C.border}`, height: "calc(100vh - 140px)", overflowY: "auto", flexShrink: 0 };
  const detailPanelStyle = { flex: 1, height: "calc(100vh - 140px)", overflowY: "auto", display: "flex", flexDirection: "column" };
  const listItemStyle = (active) => ({
    display: "flex", alignItems: "center", gap: SPACE.xl, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s",
    background: active ? C.card : "transparent", borderBottom: `1px solid ${C.border}08`,
    borderLeft: active ? `3px solid ${C.accent}` : "3px solid transparent",
  });

  const formatTime = (t) => {
    if (!t) return "";
    try {
      const d = new Date(t);
      const now = new Date();
      const diff = (now - d) / 1000;
      if (diff < 60) return "Gerade eben";
      if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
      if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std.`;
      if (diff < 604800) return `vor ${Math.floor(diff / 86400)} Tagen`;
      return d.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
    } catch { return typeof t === "string" ? t : ""; }
  };

  const PLATFORM_ABBR = { instagram: "IG", tiktok: "TT", youtube: "YT", facebook: "FB", linkedin: "LI" };
  const PlatformBadge = ({ platform }) => {
    const p = (platform || "instagram").toLowerCase();
    const meta = platformMeta(p);
    const Icon = meta.icon;
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: SPACE.xs, padding: `${SPACE.xxs}px ${SPACE.md}px`, borderRadius: RADIUS.md, background: meta.color + "15", fontSize: TYPE.micro, fontWeight: 500, color: meta.color }}>
        <Icon size={10} />
        {PLATFORM_ABBR[p] || p.slice(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <div style={{ padding: 0, height: "100%" }}>
      {/* Top Bar */}
      <div style={{ padding: "20px 24px 0", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: TYPE.h3, fontWeight: 700, letterSpacing: "-0.02em" }}>Posteingang</div>
          <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
            {loadingComments && <Loader2 size={14} color={C.dimmed} style={{ animation: "spin 1s linear infinite" }} />}
            {/* Platform pills */}
            {[
              { key: "all", label: "Alle" },
              { key: "instagram", label: "Instagram", icon: Instagram, color: C.instagram },
              { key: "tiktok", label: "TikTok", icon: TikTokIcon, color: C.tiktok },
            ].map((f) => {
              const active = platformFilter === f.key;
              return (
                <button key={f.key} onClick={() => setPlatformFilter(f.key)} style={{
                  display: "flex", alignItems: "center", gap: SPACE.sm, padding: "5px 12px", borderRadius: RADIUS.lg,
                  border: `1px solid ${active ? (f.color || C.accent) : C.border}`,
                  background: active ? (f.color || C.accent) + "15" : "transparent",
                  color: active ? (f.color || C.accent) : C.dimmed, fontSize: TYPE.small, fontWeight: 500,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  {f.icon && <f.icon size={12} />}{f.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* View Toggle Tabs — Zernio style */}
        <div style={{ display: "flex", gap: SPACE.none }}>
          {[
            { key: "comments", label: "Kommentare", icon: MessageCircle, count: filtered.length },
            { key: "dms", label: "Nachrichten", icon: Send, count: conversations.length },
          ].map((v) => {
            const active = inboxView === v.key;
            return (
              <button key={v.key} onClick={() => { setInboxView(v.key); setSelectedComment(null); setSelectedConvo(null); }} style={{
                display: "flex", alignItems: "center", gap: SPACE.sm, padding: `${SPACE.lg}px ${SPACE.xxxl}px`, fontSize: TYPE.body, fontWeight: 500,
                color: active ? C.white : C.dimmed, background: "transparent", border: "none",
                borderBottom: active ? `2px solid ${C.accent}` : "2px solid transparent",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}>
                <v.icon size={14} /> {v.label}
                {v.count > 0 && <span style={{ fontSize: TYPE.micro, background: active ? C.accent + "20" : C.border, color: active ? C.accent : C.dimmed, padding: "1px 6px", borderRadius: RADIUS.xl, fontWeight: 600 }}>{v.count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {apiError && (
        <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, padding: "8px 24px", background: C.redGlow, borderBottom: `1px solid ${C.redLight}20` }}>
          <XCircle size={13} color={C.redLight} />
          <div style={{ fontSize: TYPE.small, color: C.redLight }}>{friendlyApiError(apiError)}</div>
          <button onClick={() => setApiError(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: C.redLight, cursor: "pointer", padding: 2 }}><X size={12} /></button>
        </div>
      )}

      {/* Demo banner removed – always live data */}

      {/* ── Split Panel Layout ──────────────────────────────── */}
      <div style={{ display: "flex", height: "calc(100vh - 200px)" }}>

        {/* ── COMMENTS VIEW ────────────────────────────────── */}
        {inboxView === "comments" && (
          <React.Fragment>
            {/* Left: Comment List */}
            <div style={listPanelStyle}>
              {filtered.length === 0 && !loadingComments && (
                <div style={{ padding: 40, textAlign: "center", color: C.dimmed, fontSize: TYPE.body }}>
                  <MessageCircle size={32} color={C.border} style={{ marginBottom: 12 }} />
                  <div>Keine Kommentare vorhanden.</div>
                </div>
              )}
              {filtered.map((n, idx) => {
                const active = selectedComment?.id === n.id;
                const pc = n.platform === "instagram" ? C.instagram : C.tiktok;
                return (
                  <div key={n.id || idx} onClick={() => setSelectedComment(n)} style={listItemStyle(active)}
                    onMouseOver={(e) => { if (!active) e.currentTarget.style.background = C.cardHover; }}
                    onMouseOut={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                    {/* Avatar */}
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: pc + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                      {n.avatar
                        ? <img src={n.avatar} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
                        : <span style={{ fontSize: TYPE.label, fontWeight: 600, color: pc }}>{(n.user || "?")[0].toUpperCase()}</span>
                      }
                      {!n.read && <div style={{ position: "absolute", top: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: C.accent, border: `2px solid ${C.bg}` }} />}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: SPACE.sm, marginBottom: 2 }}>
                        <span style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white }}>{n.user}</span>
                        <PlatformBadge platform={n.platform} />
                      </div>
                      <div style={{ fontSize: TYPE.small, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {n.text || n.fullText || "Kommentar"}
                      </div>
                      <div style={{ fontSize: TYPE.micro, color: C.dimmed, marginTop: 3 }}>
                        {formatTime(n.time)} {n.post ? `· ${n.post}` : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Comment Detail */}
            <div style={detailPanelStyle}>
              {!selectedComment ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.dimmed, gap: SPACE.xl }}>
                  <MessageCircle size={40} color={C.border} />
                  <div style={{ fontSize: TYPE.bodyLg, fontWeight: 500 }}>Kommentar auswählen</div>
                  <div style={{ fontSize: TYPE.small }}>Wähle einen Kommentar aus der Liste, um Details zu sehen.</div>
                </div>
              ) : (
                <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Comment header */}
                  <div style={{ display: "flex", alignItems: "center", gap: SPACE.xxl, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: (selectedComment.platform === "instagram" ? C.instagram : C.tiktok) + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {selectedComment.avatar
                        ? <img src={selectedComment.avatar} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                        : <span style={{ fontSize: TYPE.h4, fontWeight: 600, color: selectedComment.platform === "instagram" ? C.instagram : C.tiktok }}>{(selectedComment.user || "?")[0].toUpperCase()}</span>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
                        <span style={{ fontSize: TYPE.labelLg, fontWeight: 600, color: C.white }}>{selectedComment.user}</span>
                        <PlatformBadge platform={selectedComment.platform} />
                      </div>
                      <div style={{ fontSize: TYPE.small, color: C.dimmed, marginTop: 2 }}>{formatTime(selectedComment.time)}</div>
                    </div>
                    {selectedComment.postId && selectedComment.commentId && (
                      <button onClick={async () => {
                        try {
                          await fetch("/api/late", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "hide-comment", postId: selectedComment.postId, commentId: selectedComment.commentId }) });
                        } catch {}
                      }} style={{ padding: `${SPACE.sm}px ${SPACE.xl}px`, borderRadius: RADIUS.lg, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: TYPE.caption, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: SPACE.xs }}>
                        <EyeOff size={12} /> Ausblenden
                      </button>
                    )}
                  </div>

                  {/* Post reference */}
                  {selectedComment.post && (
                    <div style={{ padding: `${SPACE.xl}px ${SPACE.xxl}px`, borderRadius: RADIUS.xl, background: C.card, border: `1px solid ${C.border}`, marginBottom: 16, fontSize: TYPE.small, color: C.muted }}>
                      <div style={{ fontSize: TYPE.micro, fontWeight: 600, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Beitrag</div>
                      {selectedComment.post}
                    </div>
                  )}

                  {/* Comment text */}
                  <div style={{ padding: `${SPACE.xxl}px ${SPACE.xxxl}px`, borderRadius: RADIUS.xxxl, background: C.card, border: `1px solid ${C.border}`, marginBottom: 16 }}>
                    <div style={{ fontSize: TYPE.bodyLg, color: C.white, lineHeight: 1.7 }}>
                      {selectedComment.text || selectedComment.fullText || "Kein Text"}
                    </div>
                  </div>

                  {/* Replies thread */}
                  {selectedComment.replies && selectedComment.replies.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: TYPE.caption, fontWeight: 600, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Antworten ({selectedComment.replies.length})</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: SPACE.md, paddingLeft: 16, borderLeft: `2px solid ${C.border}` }}>
                        {selectedComment.replies.map((r, ri) => (
                          <div key={ri} style={{ padding: "10px 14px", borderRadius: RADIUS.xl, background: C.bg, border: `1px solid ${C.border}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: SPACE.sm, marginBottom: 4 }}>
                              <span style={{ fontSize: TYPE.small, fontWeight: 600, color: C.white }}>{r.author?.username || r.username || "Unbekannt"}</span>
                              <span style={{ fontSize: TYPE.micro, color: C.dimmed }}>{formatTime(r.createdAt)}</span>
                            </div>
                            <div style={{ fontSize: TYPE.body, color: C.muted, lineHeight: 1.5 }}>{r.text || r.content || r.message || ""}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply input at bottom */}
                  <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", gap: SPACE.md }}>
                      <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Antwort schreiben..."
                        style={{ flex: 1, padding: "10px 14px", borderRadius: RADIUS.xl, background: C.card, border: `1px solid ${C.border}`, color: C.white, fontSize: TYPE.body, fontFamily: "inherit", outline: "none" }} />
                      <button style={{ padding: "10px 18px", borderRadius: RADIUS.xl, background: C.accent, border: "none", color: "#fff", fontSize: TYPE.body, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: SPACE.sm, opacity: !replyText.trim() ? 0.5 : 1 }}>
                        <Send size={14} /> Antworten
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </React.Fragment>
        )}

        {/* ── DMs VIEW ─────────────────────────────────────── */}
        {inboxView === "dms" && (
          <React.Fragment>
            {/* Left: Conversations List */}
            <div style={listPanelStyle}>
              {loadingDMs && (
                <div style={{ padding: 30, textAlign: "center", color: C.dimmed, fontSize: TYPE.body }}>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite", display: "inline-block", marginRight: 6 }} /> Wird geladen...
                </div>
              )}
              {!loadingDMs && conversations.length === 0 && (
                <div style={{ padding: 40, textAlign: "center", color: C.dimmed, fontSize: TYPE.body }}>
                  <Send size={32} color={C.border} style={{ marginBottom: 12 }} />
                  <div>{isConnected ? "Keine Nachrichten vorhanden." : "Verbinde die API, um Nachrichten zu laden."}</div>
                </div>
              )}
              {conversations.map((convo, i) => {
                const active = selectedConvo?.id === convo.id;
                const pc = (convo.platform || "instagram") === "instagram" ? C.instagram : C.tiktok;
                const lastMsg = convo.lastMessage || convo.messages?.[convo.messages.length - 1] || {};
                const name = convo.participant?.username || convo.participant?.name || convo.name || "Unbekannt";
                return (
                  <div key={convo.id || i} onClick={() => setSelectedConvo(convo)} style={listItemStyle(active)}
                    onMouseOver={(e) => { if (!active) e.currentTarget.style.background = C.cardHover; }}
                    onMouseOut={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                    {/* Avatar */}
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: pc + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {convo.participant?.profilePicture
                        ? <img src={convo.participant.profilePicture} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
                        : <span style={{ fontSize: TYPE.label, fontWeight: 600, color: pc }}>{name[0].toUpperCase()}</span>
                      }
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: SPACE.sm }}>
                          <span style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white }}>{name}</span>
                          <PlatformBadge platform={convo.platform} />
                        </div>
                        <span style={{ fontSize: TYPE.micro, color: C.dimmed, flexShrink: 0 }}>
                          {formatTime(lastMsg.createdAt || convo.updatedAt)}
                        </span>
                      </div>
                      <div style={{ fontSize: TYPE.small, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {lastMsg.text || lastMsg.content || lastMsg.message || "Keine Nachricht"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Chat Detail */}
            <div style={detailPanelStyle}>
              {!selectedConvo ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.dimmed, gap: SPACE.xl }}>
                  <Send size={40} color={C.border} />
                  <div style={{ fontSize: TYPE.bodyLg, fontWeight: 500 }}>Konversation auswählen</div>
                  <div style={{ fontSize: TYPE.small }}>Wähle eine Konversation, um den Chat zu öffnen.</div>
                </div>
              ) : (
                <React.Fragment>
                  {/* Chat header */}
                  <div style={{ display: "flex", alignItems: "center", gap: SPACE.xxl, padding: "16px 24px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: ((selectedConvo.platform || "instagram") === "instagram" ? C.instagram : C.tiktok) + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {selectedConvo.participant?.profilePicture
                        ? <img src={selectedConvo.participant.profilePicture} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
                        : <span style={{ fontSize: TYPE.label, fontWeight: 600, color: (selectedConvo.platform || "instagram") === "instagram" ? C.instagram : C.tiktok }}>{(selectedConvo.participant?.username || selectedConvo.name || "U")[0].toUpperCase()}</span>
                      }
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
                        <span style={{ fontSize: TYPE.label, fontWeight: 600, color: C.white }}>{selectedConvo.participant?.username || selectedConvo.name || "Unbekannt"}</span>
                        <PlatformBadge platform={selectedConvo.platform} />
                      </div>
                      <div style={{ fontSize: TYPE.caption, color: C.dimmed, marginTop: 1 }}>Konversation</div>
                    </div>
                  </div>

                  {/* Messages area */}
                  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: SPACE.lg }}>
                    {(selectedConvo.messages || []).length === 0 && (
                      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.dimmed, fontSize: TYPE.small }}>Keine Nachrichten in dieser Konversation.</div>
                    )}
                    {(selectedConvo.messages || []).map((msg, mi) => {
                      const isOwn = msg.isOwn || msg.direction === "outgoing" || msg.from === "self";
                      return (
                        <div key={mi} style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start" }}>
                          <div style={{
                            maxWidth: "65%", padding: "10px 14px",
                            borderRadius: isOwn ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                            background: isOwn ? C.accent : C.card,
                            border: isOwn ? "none" : `1px solid ${C.border}`,
                          }}>
                            <div style={{ fontSize: TYPE.body, color: isOwn ? "#fff" : C.white, lineHeight: 1.5 }}>
                              {msg.text || msg.content || msg.message}
                            </div>
                            <div style={{ fontSize: TYPE.micro, color: isOwn ? "rgba(255,255,255,0.6)" : C.dimmed, marginTop: 4, textAlign: isOwn ? "right" : "left" }}>
                              {formatTime(msg.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply input */}
                  <div style={{ padding: "12px 24px 16px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
                    <div style={{ display: "flex", gap: SPACE.md }}>
                      <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !sendingReply) handleReply(selectedConvo.id); }}
                        placeholder="Nachricht schreiben..."
                        style={{ flex: 1, padding: "11px 16px", borderRadius: RADIUS.xxl, background: C.card, border: `1px solid ${C.border}`, color: C.white, fontSize: TYPE.body, fontFamily: "inherit", outline: "none" }} />
                      <button onClick={() => handleReply(selectedConvo.id)} disabled={sendingReply || !replyText.trim()}
                        style={{ padding: "11px 20px", borderRadius: RADIUS.xxl, background: C.accent, border: "none", color: "#fff", fontSize: TYPE.body, fontWeight: 500, cursor: sendingReply ? "wait" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: SPACE.sm, opacity: !replyText.trim() ? 0.5 : 1 }}>
                        {sendingReply ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={14} />}
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

// ── Calendar Panel ──────────────────────────────────────────────
function CalendarPanel({ posts, onSelectPost, onNewPost }) {
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltip, setTooltip] = useState(null); // { post, x, y }

  const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  // Get days in month & first weekday (Monday-based)
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = (new Date(calYear, calMonth, 1).getDay() + 6) % 7; // Monday = 0
  const today = new Date();
  const isToday = (d) => today.getDate() === d && today.getMonth() === calMonth && today.getFullYear() === calYear;

  // Map posts to days
  const postsByDay = {};
  posts.forEach((p) => {
    const d = new Date(p.date);
    if (d.getMonth() === calMonth && d.getFullYear() === calYear) {
      const day = d.getDate();
      if (!postsByDay[day]) postsByDay[day] = [];
      postsByDay[day].push(p);
    }
  });

  const statusColor = (s) => s === "published" ? C.green : s === "scheduled" ? C.yellow : s === "failed" ? C.redLight : C.dimmed;
  const statusLabel = (s) => s === "published" ? "Live" : s === "scheduled" ? "Geplant" : s === "failed" ? "Fehler" : "Entwurf";

  const showTooltip = (e, post) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ post, x: rect.right + 8, y: rect.top });
  };
  const hideTooltip = () => setTooltip(null);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: TYPE.h2, fontWeight: 700, color: C.white }}>Content-Kalender</div>
          <div style={{ fontSize: TYPE.body, color: C.muted, marginTop: 4 }}>Alle Beiträge auf einen Blick</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
          <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}
            style={{ width: 36, height: 36, borderRadius: RADIUS.xl, display: "flex", alignItems: "center", justifyContent: "center", background: C.card, border: `1px solid ${C.border}`, cursor: "pointer", color: C.muted, fontSize: TYPE.h4 }}>
            <ChevronLeft size={18} />
          </button>
          <div style={{ fontSize: TYPE.labelLg, fontWeight: 600, color: C.white, minWidth: 160, textAlign: "center" }}>
            {MONTHS_DE[calMonth]} {calYear}
          </div>
          <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }}
            style={{ width: 36, height: 36, borderRadius: RADIUS.xl, display: "flex", alignItems: "center", justifyContent: "center", background: C.card, border: `1px solid ${C.border}`, cursor: "pointer", color: C.muted, fontSize: TYPE.h4 }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: SPACE.xxl, marginBottom: 16 }}>
        {[{ label: "Live", color: C.green }, { label: "Geplant", color: C.yellow }, { label: "Entwurf", color: C.dimmed }, { label: "Fehler", color: C.redLight }].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: SPACE.sm, fontSize: TYPE.caption, color: C.muted }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />{l.label}
          </div>
        ))}
      </div>

      {/* Weekday headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: SPACE.xxs, marginBottom: 1 }}>
        {WEEKDAYS.map((wd) => (
          <div key={wd} style={{ padding: `${SPACE.md}px 0`, textAlign: "center", fontSize: TYPE.caption, fontWeight: 600, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em" }}>{wd}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: 116, gap: SPACE.xxs }}>
        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`e${i}`} style={{ height: 116, background: C.bg, borderRadius: RADIUS.lg }} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayPosts = postsByDay[day] || [];
          const isHovered = hoveredDay === day;
          const isTodayCell = isToday(day);
          return (
            <div key={day}
              onMouseOver={() => setHoveredDay(day)}
              onMouseOut={() => setHoveredDay(null)}
              style={{
                height: 116, padding: 6, background: isHovered ? C.cardHover : C.card,
                borderRadius: RADIUS.lg, border: `1px solid ${isTodayCell ? C.accent + "60" : C.border}`,
                transition: "all 0.15s", cursor: "default", position: "relative",
                display: "flex", flexDirection: "column", overflow: "hidden",
              }}>
              {/* Day number */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: TYPE.small, fontWeight: isTodayCell ? 700 : 500,
                  color: isTodayCell ? "#fff" : dayPosts.length > 0 ? C.white : C.dimmed,
                  background: isTodayCell ? C.accent : "transparent",
                }}>
                  {day}
                </div>
                {/* Add button on hover */}
                {isHovered && onNewPost && (
                  <button onClick={() => onNewPost(new Date(calYear, calMonth, day))}
                    style={{ width: 20, height: 20, borderRadius: RADIUS.sm, display: "flex", alignItems: "center", justifyContent: "center", background: C.accent + "20", border: "none", cursor: "pointer", color: C.accent, fontSize: TYPE.bodyLg }}>
                    <Plus size={12} />
                  </button>
                )}
              </div>

              {/* Posts for this day */}
              <div style={{ display: "flex", flexDirection: "column", gap: SPACE.xs, flex: 1 }}>
                {dayPosts.slice(0, 3).map((p) => {
                  const plats = p.platforms || [p.platform || "instagram"];
                  return (
                    <div key={p.id} onClick={() => onSelectPost && onSelectPost(p)}
                      style={{
                        padding: "3px 6px", borderRadius: RADIUS.md, fontSize: TYPE.micro, fontWeight: 500,
                        background: statusColor(p.status) + "15", color: statusColor(p.status),
                        cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        borderLeft: `3px solid ${statusColor(p.status)}`,
                        transition: "all 0.15s",
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = statusColor(p.status) + "30"; showTooltip(e, p); }}
                      onMouseOut={(e) => { e.currentTarget.style.background = statusColor(p.status) + "15"; hideTooltip(); }}>
                      <span style={{ display: "inline-flex", gap: SPACE.xs, alignItems: "center" }}>
                        {plats.map((pl) => { const Icon = platformMeta(pl).icon; return <Icon key={pl} size={9} color={statusColor(p.status)} />; })}
                      </span>{" "}
                      {p.title?.substring(0, 20) || "Post"}
                    </div>
                  );
                })}
                {dayPosts.length > 3 && (
                  <div style={{ fontSize: TYPE.micro, color: C.dimmed, fontWeight: 500, paddingLeft: 6 }}>+{dayPosts.length - 3} mehr</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly stats summary */}
      <div style={{ display: "flex", gap: SPACE.xl, marginTop: 20 }}>
        {[
          { label: "Gesamt", count: Object.values(postsByDay).flat().length, color: C.white },
          { label: "Live", count: Object.values(postsByDay).flat().filter((p) => p.status === "published").length, color: C.green },
          { label: "Geplant", count: Object.values(postsByDay).flat().filter((p) => p.status === "scheduled").length, color: C.yellow },
          { label: "Entwurf", count: Object.values(postsByDay).flat().filter((p) => p.status === "draft").length, color: C.dimmed },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, padding: "14px 16px", background: C.card, borderRadius: RADIUS.xxl, border: `1px solid ${C.border}`, textAlign: "center" }}>
            <div style={{ fontSize: TYPE.h2, fontWeight: 700, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: TYPE.caption, color: C.muted, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (() => {
        const tp = tooltip.post;
        const tPlats = tp.platforms || [tp.platform || "instagram"];
        const sColor = statusColor(tp.status);
        const rows = [
          { label: "Status", value: statusLabel(tp.status), color: sColor },
          tp.type ? { label: "Typ", value: tp.type } : null,
          { label: "Plattformen", value: tPlats.map((pl) => pl === "instagram" ? "Instagram" : "TikTok").join(", ") },
          tp.createdAt ? { label: "Erstellt", value: new Date(tp.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) } : null,
          tp.status === "published" && tp.date ? { label: "Veröffentlicht", value: new Date(tp.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) } : null,
          tp.status === "scheduled" && tp.date ? { label: "Geplant für", value: new Date(tp.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) } : null,
        ].filter(Boolean);
        return (
          <div style={{
            position: "fixed", left: tooltip.x, top: tooltip.y,
            background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.xl,
            padding: `${SPACE.xl}px ${SPACE.xxl}px`, minWidth: 200, zIndex: 9999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)", pointerEvents: "none",
            animation: "fadeIn 0.15s ease",
          }}>
            <div style={{ fontSize: TYPE.small, fontWeight: 600, color: C.white, marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>
              {tp.title || "Post"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: SPACE.sm }}>
              {rows.map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: SPACE.xxl, fontSize: TYPE.caption }}>
                  <span style={{ color: C.dimmed, fontWeight: 500 }}>{r.label}</span>
                  <span style={{ color: r.color || C.muted, fontWeight: 500, textAlign: "right" }}>{r.value}</span>
                </div>
              ))}
            </div>
            {tPlats.length > 0 && (
              <div style={{ display: "flex", gap: SPACE.sm, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                {tPlats.map((pl) => { const Icon = platformMeta(pl).icon; return <Icon key={pl} size={13} color={platformMeta(pl).color} />; })}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

function _TeamPanelRemoved() { /* removed – demo only */
  const [members, setMembers] = useState([
    { id: 1, name: "Dariel", email: "darielo30@live.de", role: "owner", avatar: "D", joined: "2026-01-15", lastActive: "Gerade aktiv" },
  ]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");

  const roles = {
    owner: { label: "Inhaber", color: C.accent, bg: C.accentGlow },
    admin: { label: "Admin", color: C.purple, bg: C.purpleGlow },
    editor: { label: "Redakteur", color: C.blue, bg: C.blueGlow },
    viewer: { label: "Betrachter", color: C.dimmed, bg: "rgba(107,114,128,0.12)" },
  };

  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) return;
    const newMember = {
      id: Date.now(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: inviteEmail[0].toUpperCase(),
      joined: new Date().toISOString().split("T")[0],
      lastActive: "Eingeladen",
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setShowInvite(false);
  };

  const removeMemb = (id) => setMembers((prev) => prev.filter((m) => m.id !== id));
  const changeRole = (id, role) => setMembers((prev) => prev.map((m) => m.id === id ? { ...m, role } : m));

  return (
    <div style={{ padding: "28px 32px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: TYPE.h2, fontWeight: 700, letterSpacing: "-0.02em" }}>Team</div>
          <div style={{ fontSize: TYPE.body, color: C.muted, marginTop: 4 }}>{members.length} Mitglied{members.length !== 1 ? "er" : ""}</div>
        </div>
        <button onClick={() => setShowInvite(!showInvite)} style={{
          display: "flex", alignItems: "center", gap: SPACE.sm, padding: `${SPACE.lg}px ${SPACE.xxxl}px`, borderRadius: RADIUS.xl,
          background: C.accent, border: "none", color: "#fff", fontSize: TYPE.body, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 16px ${C.accentGlow}`,
        }}>
          <UserPlus size={15} /> Einladen
        </button>
      </div>

      {/* Invite Form */}
      {showInvite && (
        <div style={{ background: C.card, borderRadius: RADIUS.xxxl, border: `1px solid ${C.accent}30`, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, marginBottom: 14 }}>Teammitglied einladen</div>
          <div style={{ display: "flex", gap: SPACE.lg, marginBottom: 12 }}>
            <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="E-Mail-Adresse eingeben..."
              style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.xl, padding: "10px 14px", color: C.white, fontSize: TYPE.body, fontFamily: "inherit", outline: "none" }}
              onFocus={(e) => e.target.style.borderColor = C.accent} onBlur={(e) => e.target.style.borderColor = C.border}
              onKeyDown={(e) => { if (e.key === "Enter") handleInvite(); }}
            />
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
              style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.xl, padding: "10px 14px", color: C.white, fontSize: TYPE.body, fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
              <option value="admin">Admin</option>
              <option value="editor">Redakteur</option>
              <option value="viewer">Betrachter</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: SPACE.lg }}>
            <button onClick={handleInvite} style={{ display: "flex", alignItems: "center", gap: SPACE.sm, padding: "8px 18px", borderRadius: RADIUS.lg, background: C.accent, border: "none", color: "#fff", fontSize: TYPE.body, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              <Send size={13} /> Einladung senden
            </button>
            <button onClick={() => setShowInvite(false)} style={{ padding: `${SPACE.md}px ${SPACE.xxl}px`, borderRadius: RADIUS.lg, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: TYPE.body, cursor: "pointer", fontFamily: "inherit" }}>
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Role Legend */}
      <div style={{ display: "flex", gap: SPACE.xl, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.entries(roles).map(([key, r]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: SPACE.sm, fontSize: TYPE.small, color: C.dimmed }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} />
            <span style={{ color: r.color, fontWeight: 500 }}>{r.label}</span>
          </div>
        ))}
      </div>

      {/* Members List */}
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE.md }}>
        {members.map((m) => {
          const r = roles[m.role] || roles.viewer;
          return (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: SPACE.xxl, padding: "14px 18px", borderRadius: RADIUS.xxxl, background: C.card, border: `1px solid ${C.border}`, transition: "all 0.2s" }}
              onMouseOver={(e) => { e.currentTarget.style.background = C.cardHover; e.currentTarget.style.borderColor = r.color + "40"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = C.card; e.currentTarget.style.borderColor = C.border; }}>
              {/* Avatar */}
              <div style={{ width: 42, height: 42, borderRadius: RADIUS.xxl, background: `linear-gradient(135deg, ${r.color}, ${r.color}80)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: TYPE.labelLg, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {m.avatar}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, color: C.white }}>{m.name}</div>
                <div style={{ fontSize: TYPE.small, color: C.dimmed, marginTop: 2 }}>{m.email}</div>
              </div>
              {/* Role Badge */}
              <div style={{ display: "flex", alignItems: "center", gap: SPACE.sm, fontSize: TYPE.caption, fontWeight: 600, color: r.color, background: r.bg, padding: `${SPACE.xs}px ${SPACE.xl}px`, borderRadius: RADIUS.lg, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {m.role === "owner" ? <Shield size={12} /> : null}
                {r.label}
              </div>
              {/* Last Active */}
              <div style={{ fontSize: TYPE.small, color: m.lastActive === "Gerade aktiv" ? C.green : C.dimmed, fontWeight: 500, minWidth: 90, textAlign: "right" }}>
                {m.lastActive}
              </div>
              {/* Actions (not for owner) */}
              {m.role !== "owner" && (
                <div style={{ display: "flex", gap: SPACE.xs }}>
                  <select value={m.role} onChange={(e) => changeRole(m.id, e.target.value)}
                    style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.md, padding: `${SPACE.xs}px ${SPACE.md}px`, color: C.muted, fontSize: TYPE.caption, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
                    <option value="admin">Admin</option>
                    <option value="editor">Redakteur</option>
                    <option value="viewer">Betrachter</option>
                  </select>
                  <button onClick={() => removeMemb(m.id)} title="Entfernen" style={{ width: 28, height: 28, borderRadius: RADIUS.md, background: "transparent", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <X size={12} color={C.dimmed} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div style={{ marginTop: 24, padding: 16, background: C.card, borderRadius: RADIUS.xxl, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white, marginBottom: 8, display: "flex", alignItems: "center", gap: SPACE.sm }}>
          <Shield size={14} color={C.muted} /> Rollen & Berechtigungen
        </div>
        <div style={{ fontSize: TYPE.small, color: C.muted, lineHeight: 1.8 }}>
          <span style={{ color: C.accent, fontWeight: 600 }}>Inhaber</span> – Voller Zugriff, kann Teammitglieder verwalten und das Dashboard konfigurieren<br />
          <span style={{ color: C.purple, fontWeight: 600 }}>Admin</span> – Kann Beiträge erstellen, planen und Statistiken einsehen<br />
          <span style={{ color: C.blue, fontWeight: 600 }}>Redakteur</span> – Kann Beiträge erstellen und planen<br />
          <span style={{ color: C.dimmed, fontWeight: 600 }}>Betrachter</span> – Kann nur das Dashboard und Statistiken einsehen
        </div>
      </div>
    </div>
  );
}

// ── Skripte Panel ───────────────────────────────────────────────
function SkriptePanel({ scripts, onRefresh, loading }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [exporting, setExporting] = useState(false);

  const filtered = scripts.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (s.title || "").toLowerCase().includes(q) || (s.script || "").toLowerCase().includes(q) || (s.competitor || "").toLowerCase().includes(q);
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((s) => s.id)));
    }
  };

  const exportPDF = async () => {
    const selected = scripts.filter((s) => selectedIds.has(s.id));
    if (selected.length === 0) return;
    setExporting(true);

    try {
      // Dynamic import jsPDF
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentW = pageW - margin * 2;
      const today = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

      // ── Cover Page ──
      // Red accent bar top
      doc.setFillColor(220, 38, 38);
      doc.rect(0, 0, pageW, 4, "F");

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(30, 30, 30);
      doc.text("Content-Skripte", margin, 50);

      // Subtitle
      doc.setFontSize(14);
      doc.setTextColor(120, 120, 120);
      doc.text("mitunsverkaufen.de", margin, 62);

      // Date + count
      doc.setFontSize(11);
      doc.text(`Erstellt am ${today} · ${selected.length} Skript${selected.length !== 1 ? "e" : ""}`, margin, 74);

      // Divider line
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.5);
      doc.line(margin, 82, pageW - margin, 82);

      // Table of contents
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Inhaltsverzeichnis", margin, 96);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      selected.forEach((s, i) => {
        const y = 106 + i * 7;
        if (y < pageH - 30) {
          doc.text(`${i + 1}. ${s.title || "Skript " + (i + 1)}`, margin + 4, y);
        }
      });

      // Footer on cover
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.text("mitunsverkaufen.de", margin, pageH - 12);
      doc.text("Seite 1", pageW - margin, pageH - 12, { align: "right" });

      // ── Script Pages ──
      selected.forEach((s, i) => {
        doc.addPage();
        const pageNum = i + 2;

        // Red accent bar
        doc.setFillColor(220, 38, 38);
        doc.rect(0, 0, pageW, 3, "F");

        // Script number badge
        doc.setFillColor(220, 38, 38);
        doc.roundedRect(margin, 14, 28, 10, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text(`Skript ${i + 1}`, margin + 14, 20.5, { align: "center" });

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(30, 30, 30);
        const titleLines = doc.splitTextToSize(s.title || "Skript " + (i + 1), contentW);
        doc.text(titleLines, margin, 36);
        let yPos = 36 + titleLines.length * 7;

        // Meta info line
        if (s.competitor || s.date) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(140, 140, 140);
          const meta = [s.competitor ? `Quelle: ${s.competitor}` : null, s.date ? `Datum: ${s.date}` : null].filter(Boolean).join("  ·  ");
          doc.text(meta, margin, yPos + 4);
          yPos += 10;
        }

        // Divider
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.3);
        doc.line(margin, yPos + 2, pageW - margin, yPos + 2);
        yPos += 10;

        // Script body
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);
        doc.setTextColor(50, 50, 50);
        const bodyLines = doc.splitTextToSize(s.script || "", contentW);
        const lineH = 5;

        for (const line of bodyLines) {
          if (yPos + lineH > pageH - 20) {
            // Footer before new page
            doc.setFontSize(8);
            doc.setTextColor(160, 160, 160);
            doc.text("mitunsverkaufen.de", margin, pageH - 12);
            doc.text(`Seite ${pageNum}`, pageW - margin, pageH - 12, { align: "right" });
            doc.addPage();
            // Red accent on continuation
            doc.setFillColor(220, 38, 38);
            doc.rect(0, 0, pageW, 3, "F");
            yPos = 16;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            doc.setTextColor(50, 50, 50);
          }
          doc.text(line, margin, yPos);
          yPos += lineH;
        }

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(160, 160, 160);
        doc.text("mitunsverkaufen.de", margin, pageH - 12);
        doc.text(`Seite ${pageNum}`, pageW - margin, pageH - 12, { align: "right" });
      });

      doc.save(`content-skripte-${today.replace(/\./g, "-")}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("PDF-Export fehlgeschlagen: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: TYPE.h2, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>Content-Skripte</div>
          <div style={{ fontSize: TYPE.body, color: C.muted, marginTop: 4 }}>
            {scripts.length} Skript{scripts.length !== 1 ? "e" : ""}{selectedIds.size > 0 ? ` · ${selectedIds.size} ausgewählt` : ""}
          </div>
        </div>
        <div style={{ display: "flex", gap: SPACE.md }}>
          <button onClick={onRefresh} disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: SPACE.sm, padding: "8px 14px", borderRadius: RADIUS.xl, background: C.card, border: `1px solid ${C.border}`, color: C.muted, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            <RefreshCw size={14} className={loading ? "spin" : ""} style={loading ? { animation: "spin 1s linear infinite" } : {}} /> Aktualisieren
          </button>
          <button onClick={exportPDF} disabled={selectedIds.size === 0 || exporting}
            style={{
              display: "flex", alignItems: "center", gap: SPACE.sm, padding: "8px 18px", borderRadius: RADIUS.xl,
              background: selectedIds.size > 0 ? C.accent : C.card,
              border: selectedIds.size > 0 ? "none" : `1px solid ${C.border}`,
              color: selectedIds.size > 0 ? "#fff" : C.dimmed,
              fontSize: TYPE.body, fontWeight: 600, cursor: selectedIds.size > 0 ? "pointer" : "default",
              fontFamily: "inherit", opacity: exporting ? 0.7 : 1,
              boxShadow: selectedIds.size > 0 ? `inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 16px ${C.accentGlow}` : "none",
            }}>
            {exporting ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={14} />}
            {exporting ? "Exportiere..." : "PDF exportieren"}
          </button>
        </div>
      </div>

      {/* Search + Select All bar */}
      <div style={{ display: "flex", gap: SPACE.lg, marginBottom: 16, alignItems: "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.dimmed }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Skripte durchsuchen..."
            style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: RADIUS.xl, border: `1px solid ${C.border}`, background: C.card, color: C.white, fontSize: TYPE.body, fontFamily: "inherit", outline: "none" }}
          />
        </div>
        <button onClick={selectAll}
          style={{ display: "flex", alignItems: "center", gap: SPACE.sm, padding: `${SPACE.lg}px ${SPACE.xxl}px`, borderRadius: RADIUS.xl, background: C.card, border: `1px solid ${C.border}`, color: C.muted, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
          {selectedIds.size === filtered.length && filtered.length > 0 ? <CheckSquare size={14} color={C.accent} /> : <Square size={14} />}
          {selectedIds.size === filtered.length && filtered.length > 0 ? "Auswahl aufheben" : "Alle auswählen"}
        </button>
      </div>

      {/* Empty state */}
      {scripts.length === 0 && !loading && (
        <div className="glass-panel glass-border" style={{ textAlign: "center", padding: "60px 20px", background: C.glass, borderRadius: RADIUS.shell, boxShadow: "0 20px 48px rgba(0,0,0,0.3)" }}>
          <FileText size={40} color={C.dimmed} style={{ marginBottom: 16 }} />
          <div style={{ fontSize: TYPE.labelLg, fontWeight: 600, color: C.white, marginBottom: 8 }}>Noch keine Skripte</div>
          <div style={{ fontSize: TYPE.body, color: C.muted, maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
            Skripte werden automatisch über den Make.com Webhook importiert. Konfiguriere dein Szenario mit der Webhook-URL deines Dashboards.
          </div>
          <div style={{ marginTop: 20, padding: `${SPACE.lg}px ${SPACE.xxl}px`, background: C.bg, borderRadius: RADIUS.lg, display: "inline-block", fontSize: TYPE.small, fontFamily: "monospace", color: C.muted }}>
            POST /api/scripts
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && scripts.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Loader2 size={24} color={C.accent} style={{ animation: "spin 1s linear infinite" }} />
        </div>
      )}

      {/* Scripts list */}
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE.md }}>
        {filtered.map((s) => {
          const isSelected = selectedIds.has(s.id);
          const isExpanded = expandedId === s.id;
          return (
            <div key={s.id}>
              <div
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: SPACE.xxl, padding: `${SPACE.xxl}px ${SPACE.xxxl}px`,
                  background: isExpanded ? C.cardHover : C.card,
                  border: `1px solid ${isExpanded ? C.accent + "50" : isSelected ? C.accent + "30" : C.border}`,
                  borderRadius: isExpanded ? "12px 12px 0 0" : 12,
                  borderBottom: isExpanded ? `1px solid ${C.border}` : undefined,
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {/* Checkbox */}
                <div onClick={(e) => { e.stopPropagation(); toggleSelect(s.id); }}
                  style={{ width: 22, height: 22, borderRadius: RADIUS.md, border: `2px solid ${isSelected ? C.accent : C.border}`, background: isSelected ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: 2, flexShrink: 0, transition: "all 0.15s" }}>
                  {isSelected && <Check size={13} color="#fff" strokeWidth={3} />}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: SPACE.lg, marginBottom: 4 }}>
                    <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.title || "Skript"}
                    </div>
                    {s.competitor && (
                      <div style={{ fontSize: TYPE.micro, fontWeight: 500, color: C.muted, background: C.bg, padding: `${SPACE.xxs}px ${SPACE.md}px`, borderRadius: RADIUS.md, whiteSpace: "nowrap" }}>
                        {s.competitor}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: TYPE.small, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.script?.substring(0, 120) || "Kein Inhalt"}...
                  </div>
                </div>

                {/* Date */}
                <div style={{ fontSize: TYPE.caption, color: C.dimmed, fontWeight: 500, whiteSpace: "nowrap", marginTop: 2 }}>
                  {s.date ? new Date(s.date).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }) : "–"}
                </div>

                {/* Expand indicator */}
                <ChevronDown size={16} color={C.dimmed} style={{ marginTop: 3, transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{
                  background: C.card, border: `1px solid ${C.accent}50`, borderTop: "none",
                  borderRadius: "0 0 12px 12px", padding: "20px 24px",
                  animation: "fadeIn 0.2s ease",
                }}>
                  {/* Script text */}
                  <div style={{
                    fontSize: TYPE.body, color: C.white, lineHeight: 1.8,
                    whiteSpace: "pre-wrap", wordBreak: "break-word",
                    background: C.bg, borderRadius: RADIUS.xl, padding: `${SPACE.xxl}px ${SPACE.xxxl}px`,
                    border: `1px solid ${C.border}`, maxHeight: 400, overflowY: "auto",
                  }}>
                    {s.script || "Kein Inhalt"}
                  </div>

                  {/* Meta info */}
                  <div style={{ display: "flex", gap: SPACE.xxxl, marginTop: 14, fontSize: TYPE.caption, color: C.dimmed }}>
                    {s.competitor && <span><strong style={{ color: C.muted }}>Quelle:</strong> {s.competitor}</span>}
                    {s.date && <span><strong style={{ color: C.muted }}>Datum:</strong> {s.date}</span>}
                    {s.receivedAt && <span><strong style={{ color: C.muted }}>Empfangen:</strong> {new Date(s.receivedAt).toLocaleString("de-DE")}</span>}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: SPACE.md, marginTop: 14 }}>
                    {s.originalUrl && (
                      <a href={s.originalUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: SPACE.sm, padding: "6px 14px", borderRadius: RADIUS.lg, background: C.bg, border: `1px solid ${C.border}`, color: C.muted, fontSize: TYPE.caption, fontWeight: 500, textDecoration: "none", cursor: "pointer" }}>
                        <ExternalLink size={12} /> Original ansehen
                      </a>
                    )}
                    <button onClick={() => { navigator.clipboard.writeText(s.script || ""); }}
                      style={{ display: "flex", alignItems: "center", gap: SPACE.sm, padding: "6px 14px", borderRadius: RADIUS.lg, background: C.bg, border: `1px solid ${C.border}`, color: C.muted, fontSize: TYPE.caption, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                      Skript kopieren
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────
// ── Logs Panel (Zernio-style table) ──────────────────────────
function LogsPanel({ errorLog }) {
  const [logsData, setLogsData] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsSearch, setLogsSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [logDetail, setLogDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [expandedSections, setExpandedSections] = useState({ response: false, request: false });

  const fetchLogsData = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/late?action=logs");
      const data = await res.json();
      // Handle _raw wrapper from updated API route
      const raw = data._raw || data;
      const entries = Array.isArray(raw) ? raw : (raw.logs || raw.data || raw.items || []);
      setLogsData(entries);
    } catch { setLogsData([]); }
    finally { setLogsLoading(false); }
  };

  useEffect(() => { fetchLogsData(); }, []);

  // Fetch detail when a log is selected
  useEffect(() => {
    if (!selectedLog) { setLogDetail(null); return; }
    const logId = selectedLog._raw?.id || selectedLog._raw?._id || selectedLog.id || selectedLog._id;
    if (!logId || logId.startsWith?.("err_")) { setLogDetail(selectedLog._raw || selectedLog); return; }
    const fetchDetail = async () => {
      setDetailLoading(true);
      try {
        const res = await fetch(`/api/late?action=log-detail&logId=${logId}`);
        const data = await res.json();
        setLogDetail(data._raw || data);
      } catch { setLogDetail(selectedLog._raw || selectedLog); }
      finally { setDetailLoading(false); }
    };
    fetchDetail();
  }, [selectedLog]);

  const allLogs = [
    ...logsData.map((l) => ({
      _raw: l,
      id: l.id || l._id || null,
      action: l.action || l.type || "Veröffentlichung",
      status: l.statusCode || l.status || 200,
      endpoint: l.endpoint || l.url || "POST /api/v1/posts",
      platform: l.platform || l.platforms?.[0] || "—",
      account: l.account || l.profile || l.accountName || "mitunsverkaufen.de",
      created: l.createdAt || l.created || l.timestamp || l.loggedAt || "",
      ok: l.success !== false && ((l.statusCode || l.status || 200) < 400),
      content: l.content || l.postContent || l.text || "",
      result: l.result || l.message || "",
      postId: l.postId || l.post?.id || l.platformPostId || null,
      mediaCount: l.mediaItems?.length || l.media?.length || 0,
    })),
    ...errorLog.map((e) => ({
      _raw: e,
      id: e.id,
      action: e.action || "Fehler",
      status: "ERR",
      endpoint: "—",
      platform: e.platforms?.join(", ") || "—",
      account: "mitunsverkaufen.de",
      created: e.timestamp || "",
      ok: false,
      content: e.error || e.message || "",
      result: "Fehlgeschlagen",
      postId: null,
      mediaCount: 0,
    })),
  ].sort((a, b) => new Date(b.created) - new Date(a.created));

  const filteredLogs = logsSearch
    ? allLogs.filter((l) => JSON.stringify(l).toLowerCase().includes(logsSearch.toLowerCase()))
    : allLogs;

  const formatTimeAgo = (t) => {
    if (!t) return "—";
    try {
      const diff = (Date.now() - new Date(t).getTime()) / 1000;
      if (diff < 60) return "gerade eben";
      if (diff < 3600) return `vor ${Math.floor(diff / 60)} Minuten`;
      if (diff < 86400) return `vor etwa ${Math.floor(diff / 3600)} Stunden`;
      return `vor ${Math.floor(diff / 86400)} Tagen`;
    } catch { return "—"; }
  };

  const formatDate = (t) => {
    if (!t) return "—";
    try { return new Date(t).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return "—"; }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(typeof text === "string" ? text : JSON.stringify(text, null, 2));
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleSection = (section) => setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  // ── Detail Side Panel ──────────────────────────────────────
  const renderDetailPanel = () => {
    if (!selectedLog) return null;
    const d = logDetail || selectedLog._raw || selectedLog;
    const isSuccess = selectedLog.ok;
    const pName = (selectedLog.platform || "").toLowerCase();
    const PIcon = pName.includes("instagram") ? Instagram : pName.includes("tiktok") ? TikTokIcon : Globe;
    const pColor = pName.includes("instagram") ? C.instagram : pName.includes("tiktok") ? C.tiktok : C.blue;

    const detailRow = (label, value, mono) => (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: `${SPACE.lg}px 0`, borderBottom: `1px solid ${C.border}30` }}>
        <span style={{ fontSize: TYPE.small, color: C.dimmed, minWidth: 120, flexShrink: 0 }}>{label}</span>
        <span style={{ fontSize: TYPE.small, color: C.white, textAlign: "right", wordBreak: "break-all", fontFamily: mono ? "monospace" : "inherit" }}>{value || "—"}</span>
      </div>
    );

    const jsonSection = (title, data, key) => {
      const jsonStr = data ? (typeof data === "string" ? data : JSON.stringify(data, null, 2)) : null;
      if (!jsonStr || jsonStr === "null" || jsonStr === "{}") return null;
      return (
        <div style={{ marginTop: 12 }}>
          <button onClick={() => toggleSection(key)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, cursor: "pointer", color: C.white, fontSize: TYPE.body, fontWeight: 500, fontFamily: "inherit" }}>
            <span>{title}</span>
            <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
              <button onClick={(e) => { e.stopPropagation(); copyToClipboard(jsonStr, key); }} style={{ padding: `${SPACE.xxs}px ${SPACE.md}px`, borderRadius: RADIUS.sm, background: C.card, border: `1px solid ${C.border}`, color: copiedField === key ? C.green : C.dimmed, fontSize: TYPE.caption, cursor: "pointer", fontFamily: "inherit" }}>
                {copiedField === key ? "Kopiert!" : "Kopieren"}
              </button>
              <ChevronDown size={14} color={C.dimmed} style={{ transform: expandedSections[key] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </div>
          </button>
          {expandedSections[key] && (
            <pre style={{ margin: 0, marginTop: 4, padding: 14, background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, fontSize: TYPE.caption, color: C.muted, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: 300, overflowY: "auto" }}>
              {jsonStr}
            </pre>
          )}
        </div>
      );
    };

    return (
      <div style={{ width: 420, minWidth: 420, borderLeft: `1px solid ${C.border}`, height: "calc(100vh - 140px)", overflowY: "auto", background: C.card, flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: SPACE.lg }}>
              <div style={{ width: 28, height: 28, borderRadius: RADIUS.lg, display: "flex", alignItems: "center", justifyContent: "center", background: isSuccess ? C.greenGlow : C.redGlow }}>
                {isSuccess ? <Check size={14} color={C.green} /> : <X size={14} color={C.redLight} />}
              </div>
              <span style={{ fontSize: TYPE.labelLg, fontWeight: 600, color: C.white, textTransform: "capitalize" }}>{selectedLog.action}</span>
            </div>
            <button onClick={() => setSelectedLog(null)} style={{ width: 28, height: 28, borderRadius: RADIUS.md, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={14} color={C.dimmed} />
            </button>
          </div>
          <span style={{ fontSize: TYPE.small, fontWeight: 600, padding: "3px 10px", borderRadius: RADIUS.md, color: isSuccess ? C.green : "#fff", background: isSuccess ? C.greenGlow : C.red, border: `1px solid ${isSuccess ? C.green + "30" : C.red + "30"}` }}>
            {isSuccess ? "ERFOLGREICH" : "FEHLGESCHLAGEN"}
          </span>
        </div>

        {detailLoading && (
          <div style={{ padding: 30, textAlign: "center", color: C.dimmed }}>
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite", display: "inline-block", marginRight: 6 }} /> Details werden geladen...
          </div>
        )}

        {/* Detail Fields */}
        <div style={{ padding: "8px 24px 24px" }}>
          {detailRow("Plattform", (
            <span style={{ display: "inline-flex", alignItems: "center", gap: SPACE.sm }}>
              {React.createElement(PIcon, { size: 14, color: pColor })}
              {selectedLog.platform}
            </span>
          ))}
          {detailRow("Datum", formatDate(selectedLog.created))}
          {detailRow("Statuscode", (
            <span style={{ fontWeight: 600, color: selectedLog.ok ? C.green : C.redLight, background: selectedLog.ok ? C.greenGlow : C.redGlow, padding: "1px 8px", borderRadius: RADIUS.sm, fontFamily: "monospace" }}>
              {selectedLog.status}
            </span>
          ))}
          {detailRow("Typ", (d.type || selectedLog.action || "Veröffentlichung"))}
          {detailRow("Endpunkt", selectedLog.endpoint, true)}
          {detailRow("Ergebnis", (
            <span style={{ display: "inline-flex", alignItems: "center", gap: SPACE.sm }}>
              {isSuccess ? (
                <React.Fragment>
                  <span style={{ color: C.green }}>Veröffentlicht</span>
                  {(d.platformPostId || d.platformPostUrl || selectedLog.postId) && (
                    <span style={{ color: C.dimmed, fontSize: TYPE.caption }}>• Plattform-Post-ID: {d.platformPostId || selectedLog.postId || "—"}</span>
                  )}
                </React.Fragment>
              ) : (
                <span style={{ color: C.redLight }}>{d.error || d.message || selectedLog.result || "Fehlgeschlagen"}</span>
              )}
            </span>
          ))}

          {/* Content Preview */}
          {(selectedLog.content || d.content || d.postContent || d.text) && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: TYPE.small, fontWeight: 500, color: C.dimmed, marginBottom: 8 }}>Content</div>
              <div style={{ padding: 14, background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, fontSize: TYPE.small, color: C.white, lineHeight: 1.6, whiteSpace: "pre-wrap", maxHeight: 160, overflowY: "auto" }}>
                {selectedLog.content || d.content || d.postContent || d.text}
              </div>
            </div>
          )}

          {/* Media Count */}
          {(selectedLog.mediaCount > 0 || d.mediaItems?.length > 0) && (
            <div style={{ marginTop: 12 }}>
              {detailRow("Medien", `${selectedLog.mediaCount || d.mediaItems?.length || 0} Datei(en)`)}
            </div>
          )}

          {/* Expandable JSON Sections */}
          {jsonSection("Antwort (Response Body)", d.responseBody || d.response || d.result_data || d.apiResponse, "response")}
          {jsonSection("Anfrage (Request Body)", d.requestBody || d.request || d.payload || d.body, "request")}

          {/* Post ID */}
          {(selectedLog.postId || d.postId || d._id) && (
            <div style={{ marginTop: 16 }}>
              {detailRow("Post-ID", (
                <span style={{ display: "inline-flex", alignItems: "center", gap: SPACE.sm }}>
                  <span style={{ fontFamily: "monospace", fontSize: TYPE.caption }}>{selectedLog.postId || d.postId || d._id}</span>
                  <button onClick={() => copyToClipboard(selectedLog.postId || d.postId || d._id, "postId")} style={{ padding: "1px 6px", borderRadius: RADIUS.sm, background: C.bg, border: `1px solid ${C.border}`, color: copiedField === "postId" ? C.green : C.dimmed, fontSize: TYPE.micro, cursor: "pointer", fontFamily: "inherit" }}>
                    {copiedField === "postId" ? "Kopiert!" : "Kopieren"}
                  </button>
                </span>
              ), true)}
            </div>
          )}

          {/* Logged At */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}30` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: TYPE.caption, color: C.dimmed }}>Protokolliert um</span>
              <span style={{ fontSize: TYPE.caption, color: C.dimmed }}>{formatDate(selectedLog.created)}</span>
            </div>
          </div>

          {/* Platform Post URL if available */}
          {(d.platformPostUrl || d.postUrl) && (
            <div style={{ marginTop: 12 }}>
              <a href={d.platformPostUrl || d.postUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: SPACE.sm, fontSize: TYPE.small, color: C.blue, textDecoration: "none" }}>
                <ExternalLink size={12} /> Auf der Plattform ansehen
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
      {/* Main Logs Table */}
      <div style={{ flex: 1, padding: "24px 32px", overflowY: "auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: TYPE.h2, fontWeight: 700, letterSpacing: "-0.02em", color: C.white }}>Logs</div>
          <div style={{ fontSize: TYPE.body, color: C.muted, marginTop: 2 }}>Aktivitätsprotokolle und Fehler ansehen</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: `${SPACE.md}px ${SPACE.xl}px`, flex: 1, maxWidth: 260 }}>
            <Search size={14} color={C.dimmed} />
            <input type="text" placeholder="Logs durchsuchen..." value={logsSearch} onChange={(e) => setLogsSearch(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: C.white, fontSize: TYPE.small, width: "100%", fontFamily: "inherit" }} />
          </div>
          <button style={{ padding: "8px 14px", borderRadius: RADIUS.lg, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: SPACE.xs }}>Veröffentlichung <ChevronDown size={11} /></button>
          <button style={{ padding: "8px 14px", borderRadius: RADIUS.lg, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: SPACE.xs }}>Alle Plattformen <ChevronDown size={11} /></button>
          <button style={{ padding: "8px 14px", borderRadius: RADIUS.lg, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: SPACE.xs }}>Alle Status <ChevronDown size={11} /></button>
          <button style={{ padding: "8px 14px", borderRadius: RADIUS.lg, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: SPACE.xs }}>Letzte 7 Tage <ChevronDown size={11} /></button>
          <button onClick={() => { setLogsData([]); fetchLogsData(); }} style={{ width: 34, height: 34, borderRadius: RADIUS.lg, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <RefreshCw size={14} color={C.dimmed} style={logsLoading ? { animation: "spin 1s linear infinite" } : {}} />
          </button>
        </div>

        <div className="glass-panel glass-border" style={{ background: C.glassStrong, borderRadius: RADIUS.shell, boxShadow: "0 20px 48px rgba(0,0,0,0.3)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "160px 80px 1fr 140px 180px 160px", padding: `${SPACE.xl}px ${SPACE.xxxl}px`, borderBottom: `1px solid ${C.border}`, fontSize: TYPE.small, fontWeight: 500, color: C.dimmed }}>
            <div>Aktion</div><div>Status</div><div>Endpunkt</div><div>Plattform</div><div>Konto</div>
            <div style={{ display: "flex", alignItems: "center", gap: SPACE.xs }}>Erstellt <ChevronDown size={10} /></div>
          </div>

          {logsLoading && (
            <div style={{ padding: 30, textAlign: "center", color: C.dimmed, fontSize: TYPE.body }}>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite", display: "inline-block", marginRight: 6 }} /> Logs werden geladen...
            </div>
          )}
          {!logsLoading && filteredLogs.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: C.dimmed, fontSize: TYPE.body }}>Keine Logs gefunden.</div>
          )}

          {filteredLogs.map((log, i) => {
            const pIcon = log.platform?.toLowerCase().includes("instagram") ? Instagram : log.platform?.toLowerCase().includes("tiktok") ? TikTokIcon : null;
            const pColor = log.platform?.toLowerCase().includes("instagram") ? C.instagram : log.platform?.toLowerCase().includes("tiktok") ? C.tiktok : C.dimmed;
            const isSelected = selectedLog && (selectedLog.id === log.id && selectedLog.created === log.created);
            return (
              <div key={i} onClick={() => setSelectedLog(log)} style={{ display: "grid", gridTemplateColumns: "160px 80px 1fr 140px 180px 160px", padding: `${SPACE.xl}px ${SPACE.xxxl}px`, borderBottom: `1px solid ${C.border}08`, alignItems: "center", fontSize: TYPE.body, cursor: "pointer", transition: "background 0.1s", background: isSelected ? C.bg + "80" : "transparent", borderLeft: isSelected ? `3px solid ${C.accent}` : "3px solid transparent" }}
                onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.background = C.bg + "60"; }}
                onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
                  <div style={{ width: 22, height: 22, borderRadius: RADIUS.md, display: "flex", alignItems: "center", justifyContent: "center", background: log.ok ? C.greenGlow : C.redGlow }}>
                    {log.ok ? <Check size={12} color={C.green} /> : <X size={12} color={C.redLight} />}
                  </div>
                  <span style={{ color: C.white, fontWeight: 500 }}>{log.action}</span>
                </div>
                <div><span style={{ fontSize: TYPE.small, fontWeight: 600, color: log.ok ? C.green : C.redLight, background: log.ok ? C.greenGlow : C.redGlow, padding: `${SPACE.xxs}px ${SPACE.md}px`, borderRadius: RADIUS.sm }}>{log.status}</span></div>
                <div style={{ color: C.muted, fontSize: TYPE.small, fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{log.endpoint}</div>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.sm }}>
                  {pIcon && React.createElement(pIcon, { size: 14, color: pColor })}
                  <span style={{ color: C.white, fontSize: TYPE.small }}>{log.platform}</span>
                </div>
                <div style={{ color: C.muted, fontSize: TYPE.small }}>{log.account}</div>
                <div style={{ color: C.dimmed, fontSize: TYPE.small }}>{formatTimeAgo(log.created)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Side Panel */}
      {renderDetailPanel()}
    </div>
  );
}

export default function Dashboard() {
  // Theme state persisted in localStorage. Starts as the server-rendered
  // default (dark) and syncs to the stored preference after mount, so the
  // client's first render always matches the server's (avoids a hydration
  // mismatch that reading localStorage during useState init would cause).
  const [isDarkMode, setIsDarkMode] = useState(true);
  useEffect(() => {
    try { if (localStorage.getItem("theme") === "light") setIsDarkMode(false); } catch {}
  }, []);
  C = isDarkMode ? darkTheme : lightTheme;
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
      return next;
    });
  };

  // Sync body background with theme
  useEffect(() => {
    document.body.style.background = C.bg;
  }, [isDarkMode]);

  // Hidden/deleted post IDs persisted in localStorage
  const [hiddenPostIds, setHiddenPostIds] = useState(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("hiddenPostIds") || "[]"); } catch { return []; }
  });
  const hidePost = (id) => {
    setHiddenPostIds((prev) => {
      const next = [...prev, id];
      try { localStorage.setItem("hiddenPostIds", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const [posts, setPosts] = useState(() => demoPosts.filter((p) => !hiddenPostIds.includes(p.id)));
  const [performance] = useState(demoPerformance);
  const [filter, setFilter] = useState("all");
  // ── Zernio-Filterleiste ──
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter2, setPlatformFilter2] = useState("all");
  const [profileFilter, setProfileFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("scheduled_desc");
  const [viewMode, setViewMode] = useState("grid");
  const [gridCols, setGridCols] = useState(4);
  const [copiedId, setCopiedId] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalInitialDate, setCreateModalInitialDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [accounts, setAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  // The framed app shell scrolls internally (see .app-main in layout.jsx)
  // instead of the page/window, so tab and pagination changes need to reset
  // this element's scroll position directly rather than window.scrollTo.
  const mainScrollRef = useRef(null);
  useEffect(() => { mainScrollRef.current?.scrollTo({ top: 0, behavior: "auto" }); }, [activeTab]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(demoNotifications);
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [scripts, setScripts] = useState(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("scripts") || "[]"); } catch { return []; }
  });
  const [scriptsLoading, setScriptsLoading] = useState(false);
  const [errorLog, setErrorLog] = useState(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("errorLog") || "[]"); } catch { return []; }
  });
  const [expandedError, setExpandedError] = useState(null);

  const addErrorLog = useCallback((entry) => {
    const logEntry = { id: `err_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, timestamp: new Date().toISOString(), ...entry };
    setErrorLog((prev) => {
      const updated = [logEntry, ...prev].slice(0, 50); // keep last 50
      try { localStorage.setItem("errorLog", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const clearErrorLog = () => { setErrorLog([]); try { localStorage.removeItem("errorLog"); } catch {} };

  const fetchScripts = useCallback(async () => {
    setScriptsLoading(true);
    try {
      // Send localStorage scripts to server for sync
      let syncParam = "";
      try {
        const local = localStorage.getItem("scripts");
        if (local && JSON.parse(local).length > 0) {
          syncParam = `?sync=${encodeURIComponent(local)}`;
        }
      } catch {}

      const res = await fetch(`/api/scripts${syncParam}`);
      if (res.ok) {
        const data = await res.json();
        const apiScripts = data.scripts || [];
        // Merge: keep localStorage scripts + add any new ones from API
        setScripts((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          const newOnes = apiScripts.filter((s) => !existingIds.has(s.id));
          const merged = [...prev, ...newOnes];
          try { localStorage.setItem("scripts", JSON.stringify(merged)); } catch {}
          return merged;
        });
      }
    } catch (err) {
      console.error("Failed to fetch scripts:", err);
    } finally {
      setScriptsLoading(false);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const showNotif = (text, color) => { setNotification({ text, color }); setTimeout(() => setNotification(null), 5000); };

  // ── Post-Analytics nachladen ───────────────────────────────
  // Zernios /posts-Liste enthaelt keine Kennzahlen. GET /analytics
  // liefert dagegen eine Liste, in der jeder Eintrag bereits
  // analytics + platformAnalytics mitbringt (siehe Zernio API-Doku).
  const analyticsLoadedRef = useRef(new Set());

  const fetchPostAnalytics = useCallback(async (postList) => {
    try {
      // Nur Beitraege abfragen, deren Kennzahlen noch nicht geladen sind
      const ids = (postList || [])
        .map((p) => p.id)
        .filter(Boolean)
        .filter((id) => !analyticsLoadedRef.current.has(String(id)))
        .slice(0, 50);
      if (ids.length === 0) return;
      ids.forEach((id) => analyticsLoadedRef.current.add(String(id)));

      const res = await fetch(`/api/late?action=posts-analytics&postIds=${encodeURIComponent(ids.join(","))}`);
      const data = await res.json();
      const items = data.posts || [];

      console.log("[Analytics]", { mode: data._mode, count: data._count, withAnalytics: data._withAnalytics, sample: items[0] });

      if (items.length === 0) return;

      const failed = items.filter((it) => it._error);
      if (failed.length > 0) {
        const first = failed[0]._error;
        addErrorLog({
          action: "Statistiken laden",
          error: first?.status === 402
            ? "Zernio Analytics-Add-on nicht aktiv (HTTP 402)"
            : `Statistiken für ${failed.length} Beitrag/Beiträge fehlgeschlagen (HTTP ${first?.status || "?"})`,
          response: failed.slice(0, 3),
        });
      }

      const ok = items.filter((it) => !it._error && it.analytics);

      // Tages-Snapshot sichern, damit ueber die Zeit Trendlinien entstehen
      saveAnalyticsSnapshots(ok.map((it) => ({ ...it, postId: it._requestedId || it.postId })));

      // Zuordnung ueber die angefragte ID plus alle IDs aus der Antwort
      const byId = {};
      for (const it of ok) {
        for (const key of [it._requestedId, it.postId, it.latePostId, it._id, it.id]) {
          if (key) byId[String(key)] = it;
        }
      }

      const zero = { impressions: 0, reach: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, views: 0, follows: 0 };

      setPosts((prev) => prev.map((p) => {
        const hit = byId[String(p.id)];
        if (!hit) return p;
        const a = { ...zero, ...(hit.analytics || {}) };

        // Kennzahlen je Plattform aus platformAnalytics uebernehmen
        const perPlat = {};
        for (const pa of hit.platformAnalytics || []) {
          if (!pa.platform) continue;
          perPlat[String(pa.platform).toLowerCase()] = {
            ...zero,
            ...(pa.analytics || {}),
            _status: pa.status,
            _url: pa.platformPostUrl,
            _username: pa.accountUsername,
          };
        }

        const existing = p.platformDetails || [];
        const merged = Object.keys(perPlat).length > 0
          ? Object.entries(perPlat).map(([name, m]) => {
              const old = existing.find((d) => d.platform === name) || {};
              return {
                platform: name,
                status: m._status || old.status || p.status,
                publishedAt: old.publishedAt || hit.publishedAt,
                url: m._url || old.url,
                username: m._username,
                analytics: m,
              };
            })
          : existing;

        return {
          ...p,
          likes: a.likes, comments: a.comments, shares: a.shares,
          saves: a.saves, clicks: a.clicks, views: a.views,
          impressions: a.impressions, reach: a.reach, follows: a.follows,
          engagementRate: hit.analytics?.engagementRate,
          analyticsUpdatedAt: hit.analytics?.lastUpdated,
          publishedAt: p.publishedAt || hit.publishedAt,
          thumbnail: p.thumbnail || hit.thumbnailUrl,
          platformDetails: merged,
        };
      }));
    } catch (err) {
      console.error("Post-Analytics konnten nicht geladen werden:", err);
    }
  }, []);


  // ── Analytics State ────────────────────────────────────────
  const [analyticsData, setAnalyticsData] = useState({ daily: null, bestTime: null, decay: null, frequency: null });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsPlatform, setAnalyticsPlatform] = useState("all");
  const [analyticsRange, setAnalyticsRange] = useState("30d");

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const now = new Date();
      const days = analyticsRange === "7d" ? 7 : analyticsRange === "30d" ? 30 : 90;
      const from = new Date(now - days * 86400000).toISOString().split("T")[0];
      const to = now.toISOString().split("T")[0];
      const plat = analyticsPlatform !== "all" ? `&platform=${analyticsPlatform}` : "";

      const [dailyRes, bestRes, decayRes, freqRes] = await Promise.all([
        fetch(`/api/late?action=analytics-daily&fromDate=${from}&toDate=${to}${plat}`),
        fetch(`/api/late?action=analytics-best-time${plat}`),
        fetch(`/api/late?action=analytics-content-decay${plat}`),
        fetch(`/api/late?action=analytics-frequency${plat}`),
      ]);

      const [dailyJson, bestJson, decayJson, freqJson] = await Promise.all([
        dailyRes.json(), bestRes.json(), decayRes.json(), freqRes.json(),
      ]);

      setAnalyticsData({
        daily: dailyJson._raw || dailyJson,
        bestTime: bestJson._raw || bestJson,
        decay: decayJson._raw || decayJson,
        frequency: freqJson._raw || freqJson,
      });
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [analyticsPlatform, analyticsRange]);

  // Fetch connected accounts from Late
  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch("/api/late?action=accounts");
      const data = await res.json();
      setDebugInfo(data);

      if (!res.ok || data.error) return;

      // Try all possible response shapes from Late API
      let accs = [];
      if (data.accounts && Array.isArray(data.accounts)) {
        accs = data.accounts;
      } else if (Array.isArray(data)) {
        accs = data;
      } else if (data._raw) {
        if (Array.isArray(data._raw)) accs = data._raw;
        else if (data._raw.accounts) accs = data._raw.accounts;
        else if (data._raw.data) accs = data._raw.data;
      } else if (data.data && Array.isArray(data.data)) {
        accs = data.data;
      }

      // Normalize account objects – Late may use different field names
      const normalized = accs.map((a) => ({
        ...a,
        id: a.id || a.accountId || a._id,
        accountId: a.accountId || a.id || a._id,
        platform: (a.platform || a.provider || a.type || "").toLowerCase(),
        name: a.name || a.username || a.displayName || a.handle || "Unbekannt",
        profileName: (typeof a.profileId === "object" ? a.profileId?.name : a.profileName) || undefined,
      }));

      if (normalized.length > 0) {
        setAccounts(normalized);
        setIsConnected(true);
      }
    } catch (err) {
      setDebugInfo({ fetchError: err.message });
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/late?action=posts");
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.error) { setIsConnected(false); return; }
      setIsConnected(true);
      const mapPost = (p, i) => {
        const plats = p.platforms?.map((pl) => pl.platform || pl).filter(Boolean) || ["instagram"];
        const urls = {};
        (p.platforms || []).forEach((pl) => {
          const platName = pl.platform || pl;
          // Late API uses "platformPostUrl" for the actual post permalink
          let u = pl.platformPostUrl || pl.postUrl || pl.permalink || pl.url || pl.link;
          // Fallback: construct URL from platformPostId if no direct URL
          if (!u && pl.platformPostId) {
            if (platName === "instagram") u = `https://www.instagram.com/reel/${pl.platformPostId}/`;
            else if (platName === "tiktok") u = `https://www.tiktok.com/@mitunsverkaufen/video/${pl.platformPostId}`;
          }
          if (u) urls[platName] = u;
        });
        // Also check top-level fields
        if (p.platformPostUrl) urls[plats[0]] = p.platformPostUrl;
        else if (p.postUrl || p.permalink || p.url) urls[plats[0]] = p.postUrl || p.permalink || p.url;
        const a = p.analytics || {};
        // ── Medien / Thumbnail robust auslesen ──
        const media = p.mediaItems || p.media || p.mediaUrls || [];
        const mediaArr = Array.isArray(media) ? media : [media];
        const pick = (m, keys) => keys.map((k) => m?.[k]).find(Boolean);
        // Schritt 1 – explizites Thumbnail-Feld auf Post-Ebene
        let thumb = pick(p, ["thumbnailUrl", "thumbnail", "coverUrl", "previewUrl", "imageUrl"]);
        // Schritt 2 – Thumbnail-Feld auf Media-Ebene
        if (!thumb) {
          for (const m of mediaArr) {
            const t = typeof m === "string" ? null : pick(m, ["thumbnailUrl", "thumbnail", "coverUrl", "previewUrl", "posterUrl"]);
            if (t) { thumb = t; break; }
          }
        }
        // Schritt 3 – Bild-Media direkt verwenden
        if (!thumb) {
          for (const m of mediaArr) {
            const url = typeof m === "string" ? m : pick(m, ["url", "src", "mediaUrl", "publicUrl"]);
            if (url && /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(url)) { thumb = url; break; }
          }
        }
        // Schritt 4 – Video-URL merken, daraus rendert das Frontend das erste Frame
        let videoUrl;
        for (const m of mediaArr) {
          const url = typeof m === "string" ? m : pick(m, ["url", "src", "mediaUrl", "publicUrl"]);
          const isVid = (typeof m !== "string" && (m?.type === "video" || m?.mediaType === "video"))
            || (url && /\.(mp4|mov|webm|m4v)(\?|$)/i.test(url));
          if (url && isVid) { videoUrl = url; break; }
        }
        return {
          id: p._id || p.id || i + 1,
          platforms: plats,
          type: videoUrl ? "Video" : "Post",
          title: p.content?.substring(0, 60) + (p.content?.length > 60 ? "..." : "") || "Unbenannt",
          caption: p.content || "",
          date: p.scheduledFor || p.createdAt || new Date().toISOString(),
          views: a.views || a.impressions || 0,
          likes: a.likes || 0,
          comments: a.comments || 0,
          shares: a.shares || 0,
          reach: a.reach || 0,
          impressions: a.impressions || 0,
          saves: a.saves || 0,
          clicks: a.clicks || 0,
          thumbnail: thumb,
          videoUrl,
          publishedAt: p.publishedAt || p.completedAt || undefined,
          // Pro-Plattform-Details für das Detail-Panel
          platformDetails: (p.platforms || []).map((pl) => {
            const name = pl.platform || pl;
            const pa = pl.analytics || pl.metrics || pl.stats || {};
            return {
              platform: name,
              status: pl.status || p.status || "draft",
              publishedAt: pl.publishedAt || pl.postedAt || pl.completedAt || undefined,
              url: urls[name],
              analytics: {
                likes: pa.likes || 0, comments: pa.comments || 0, shares: pa.shares || 0,
                saves: pa.saves || 0, clicks: pa.clicks || 0, views: pa.views || 0,
                follows: pa.follows || pa.newFollowers || 0,
                impressions: pa.impressions || 0, reach: pa.reach || 0,
              },
            };
          }),
          profile: p.profile?.name || p.profileName || p.profile || undefined,
          profileColor: p.profile?.color || undefined,
          done: p.status === "published",
          status: p.status || "draft",
          postUrls: Object.keys(urls).length > 0 ? urls : undefined,
          createdAt: p.createdAt || undefined,
          createdBy: p.createdBy || p.user?.name || p.userName || undefined,
          timezone: p.timezone || undefined,
        };
      };
      // Extract posts array from various possible response shapes
      const rawPosts = data._raw;
      const postsList = data.posts || (Array.isArray(rawPosts) ? rawPosts : rawPosts?.posts) || (Array.isArray(data) ? data : null);
      if (postsList && Array.isArray(postsList)) {
        const hidden = JSON.parse(localStorage.getItem("hiddenPostIds") || "[]");
        const mapped = postsList.map(mapPost).filter((p) => !hidden.includes(p.id));
        setPosts(mapped);
        // Kennzahlen werden pro sichtbarer Seite nachgeladen (siehe useEffect)
        analyticsLoadedRef.current = new Set();
      }
    } catch {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAccounts(); fetchPosts(); fetchScripts(); }, [fetchAccounts, fetchPosts, fetchScripts]);

  // Fetch analytics when tab opens or filters change
  useEffect(() => { if (activeTab === "analytics" && isConnected) fetchAnalytics(); }, [activeTab, isConnected, fetchAnalytics]);

  const handleCreatePost = async ({ content, platforms, scheduledFor, publishNow, mediaItems, timezone, tiktokSettings }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/late", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create-post", content, platforms, scheduledFor, publishNow, mediaItems, timezone, tiktokSettings }),
      });
      const data = await res.json();
      if (data.error) {
        const errMsg = data.details?.message || data.error || "Unbekannter Fehler";
        const tzShort = TIMEZONES.find((t) => t.value === timezone)?.short || "CET";
        const plats = platforms.map((p) => p.platform || p).filter(Boolean);
        const np = { id: Date.now(), platforms: plats.length > 0 ? plats : ["instagram"], type: mediaItems?.length ? "Video" : "Post",
          title: content.substring(0, 60) + (content.length > 60 ? "..." : ""), caption: content,
          date: scheduledFor || new Date().toISOString(), views: 0, likes: 0, comments: 0, shares: 0,
          done: false, status: "failed", timezone: tzShort, createdAt: new Date().toISOString(), createdBy: "Dariel" };
        setPosts((prev) => [np, ...prev]);
        showNotif(`Fehler: ${errMsg}`, "red");
        addErrorLog({ action: "Beitrag erstellen", error: errMsg, platforms: plats, content: content.substring(0, 120), scheduledFor: scheduledFor || "Sofort", response: data, mediaCount: mediaItems?.length || 0 });
      } else {
        const tzShort = TIMEZONES.find((t) => t.value === timezone)?.short || "CET";
        const plats = platforms.map((p) => p.platform || p).filter(Boolean);
        const np = { id: data.id || Date.now(), platforms: plats.length > 0 ? plats : ["instagram"], type: mediaItems?.length ? "Video" : "Post",
          title: content.substring(0, 60) + (content.length > 60 ? "..." : ""), caption: content,
          date: scheduledFor || new Date().toISOString(), views: 0, likes: 0, comments: 0, shares: 0,
          done: false, status: scheduledFor ? "scheduled" : "published", timezone: tzShort, createdAt: new Date().toISOString(), createdBy: "Dariel" };
        setPosts((prev) => [np, ...prev]);
        showNotif(scheduledFor ? "Beitrag erfolgreich geplant!" : "Beitrag wird gepostet!", "green");
        fetchPosts();
      }
    } catch (err) {
      const plats = platforms.map((p) => p.platform || p).filter(Boolean);
      const np = { id: Date.now(), platforms: plats.length > 0 ? plats : ["instagram"], type: "Post",
        title: content.substring(0, 60) + (content.length > 60 ? "..." : ""), caption: content,
        date: scheduledFor || new Date().toISOString(), views: 0, likes: 0, comments: 0, shares: 0,
        done: false, status: "failed", createdAt: new Date().toISOString(), createdBy: "Dariel" };
      setPosts((prev) => [np, ...prev]);
      showNotif("Netzwerkfehler – Upload fehlgeschlagen", "red");
      addErrorLog({ action: "Beitrag erstellen", error: `Netzwerkfehler: ${err.message}`, platforms: plats, content: content.substring(0, 120), scheduledFor: scheduledFor || "Sofort", mediaCount: mediaItems?.length || 0 });
    } finally { setIsSubmitting(false); setShowCreateModal(false); }
  };

  const toggle = (id) => setPosts(posts.map((p) => p.id === id ? { ...p, done: !p.done } : p));

  // ── Dynamische Optionen aus den echten Daten ──
  const profileOptions = Array.from(new Set(posts.map((p) => p.profile).filter(Boolean)));
  const userOptions = Array.from(new Set(posts.map((p) => p.createdBy).filter(Boolean)));

  // ── Datumsbereiche für den "All dates"-Filter ──
  const dateRange = (key) => {
    const now = new Date();
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    const today = startOfDay(now);
    // Woche startet Montag
    const weekStart = addDays(today, -((today.getDay() + 6) % 7));
    switch (key) {
      case "today": return [today, addDays(today, 1)];
      case "tomorrow": return [addDays(today, 1), addDays(today, 2)];
      case "this_week": return [weekStart, addDays(weekStart, 7)];
      case "next_week": return [addDays(weekStart, 7), addDays(weekStart, 14)];
      case "this_month": return [new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 1)];
      default: return null;
    }
  };

  // Filter: Status + Plattform + Profil + User + Datum + Suche
  const filtered = posts.filter((p) => {
    const d = new Date(p.date);
    const pPlats = p.platforms || [p.platform || "instagram"];

    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (platformFilter2 !== "all" && !pPlats.includes(platformFilter2)) return false;
    if (profileFilter !== "all" && p.profile !== profileFilter) return false;
    if (userFilter !== "all" && p.createdBy !== userFilter) return false;

    if (dateFilter !== "all") {
      const r = dateRange(dateFilter);
      if (r && (d < r[0] || d >= r[1])) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(p.title || "").toLowerCase().includes(q) && !(p.caption || "").toLowerCase().includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    const num = (x, k) => x[k] || 0;
    switch (sortBy) {
      case "scheduled_asc": return new Date(a.date) - new Date(b.date);
      case "created_desc": return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
      case "created_asc": return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
      case "status": return (a.status || "").localeCompare(b.status || "");
      case "platform": return (a.platforms?.[0] || "").localeCompare(b.platforms?.[0] || "");
      case "engagement": return (num(b, "likes") + num(b, "comments") + num(b, "shares") + num(b, "saves")) - (num(a, "likes") + num(a, "comments") + num(a, "shares") + num(a, "saves"));
      case "likes": return num(b, "likes") - num(a, "likes");
      case "comments": return num(b, "comments") - num(a, "comments");
      case "shares": return num(b, "shares") - num(a, "shares");
      case "views": return num(b, "views") - num(a, "views");
      case "impressions": return num(b, "impressions") - num(a, "impressions");
      case "reach": return num(b, "reach") - num(a, "reach");
      case "saves": return num(b, "saves") - num(a, "saves");
      case "clicks": return num(b, "clicks") - num(a, "clicks");
      default: return new Date(b.date) - new Date(a.date);
    }
  });

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PER_PAGE;
  const paged = filtered.slice(pageStart, pageStart + PER_PAGE);
  // Bei Filterwechsel zurück auf Seite 1
  useEffect(() => { setPage(1); }, [statusFilter, platformFilter2, profileFilter, userFilter, dateFilter, searchQuery, sortBy]);

  // Nach Seitenwechsel an den Anfang der Liste scrollen
  useEffect(() => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Kennzahlen fuer die aktuell sichtbare Seite nachladen
  const pagedIdsKey = paged.map((p) => p.id).join(",");
  useEffect(() => {
    if (!isConnected || paged.length === 0) return;
    const needed = paged.filter((p) => p.status === "published" || p.status === "partial");
    if (needed.length > 0) fetchPostAnalytics(needed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagedIdsKey, isConnected]);

  const totalViews = filtered.reduce((a, p) => a + p.views, 0);
  const totalLikes = filtered.reduce((a, p) => a + p.likes, 0);
  const totalComments = filtered.reduce((a, p) => a + p.comments, 0);
  const totalShares = filtered.reduce((a, p) => a + p.shares, 0);
  const MONTHLY_GOAL = 30;
  const doneCount = filtered.filter((p) => p.done).length;
  const progress = Math.min(100, Math.round((filtered.length / MONTHLY_GOAL) * 100));

  // Restrained atmospheric glow behind the whole app (dark mode only) — the
  // cards sit on top of this instead of a flat page background. Kept as a
  // separate backgroundImage (not the `background` shorthand) so it never
  // collides with the plain backgroundColor fallback.
  const atmosphere = isDarkMode
    ? `radial-gradient(1100px 560px at 12% -8%, rgba(76,126,255,0.10), transparent 60%),`
      + `radial-gradient(900px 500px at 100% 0%, rgba(139,92,246,0.08), transparent 55%),`
      + `radial-gradient(800px 520px at 45% 115%, rgba(249,115,22,0.05), transparent 60%)`
    : "none";
  // Page backdrop behind the floating shell — deliberately darker/lighter
  // than the shell's own C.bg so the frame reads as a distinct surface
  // (only visible >=1024px; below that the shell fills the page exactly).
  const pageBg = isDarkMode ? "#020304" : "#d8dbe2";

  return (
    <div data-theme={isDarkMode ? "dark" : "light"} style={{ minHeight: "100vh", background: pageBg, display: "flex", justifyContent: "center" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } } @keyframes livePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }`}</style>

      {/* Framed app shell — floats as one rounded card on desktop (see
          layout.jsx), collapses to a plain full-bleed page under 1024px. */}
      <div className="app-shell" style={{ width: "100%", backgroundImage: atmosphere, backgroundColor: C.bg, color: C.white, display: "flex" }}>

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} unreadCount={unreadCount} errorCount={errorLog.length} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Mobile-only backdrop behind the off-canvas sidebar */}
      <div className={`sidebar-backdrop${isSidebarOpen ? " open" : ""}`} onClick={() => setIsSidebarOpen(false)} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50,
      }} />

      {/* Mobile-only hamburger button to open the sidebar */}
      <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Menü öffnen" style={{
        position: "fixed", top: 14, left: 14, zIndex: 45, width: 40, height: 40, borderRadius: RADIUS.lg,
        background: C.card, border: `1px solid ${C.border}`, color: C.white, cursor: "pointer",
        alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
      }}>
        <Menu size={18} />
      </button>

      {/* Main Content */}
      <div className="app-main" ref={mainScrollRef} style={{ flex: 1 }}>

      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 200, background: C.card, border: `1px solid ${notification.color === "green" ? C.green : notification.color === "red" ? C.redLight : C.yellow}`, borderRadius: RADIUS.xxl, padding: `${SPACE.xl}px ${SPACE.xxxl}px`, display: "flex", alignItems: "center", gap: SPACE.lg, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", maxWidth: 480 }}>
          {notification.color === "red" ? <XCircle size={16} color={C.redLight} style={{ flexShrink: 0 }} /> :
           <div style={{ width: 8, height: 8, borderRadius: "50%", background: notification.color === "green" ? C.green : C.yellow, flexShrink: 0 }} />}
          <span style={{ fontSize: TYPE.body, fontWeight: 500, color: notification.color === "red" ? C.redLight : C.white }}>{notification.text}</span>
        </div>
      )}

      {/* ── Übersicht (Overview / Findexa-style landing) ─────── */}
      {activeTab === "home" && (() => {
        const now = new Date();
        const monthKey = (d) => { const dt = new Date(d); return `${dt.getFullYear()}-${dt.getMonth()}`; };
        const thisMonthKey = monthKey(now);
        const lastMonthKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));

        const published = posts.filter((p) => p.status === "published");
        const thisMonth = published.filter((p) => monthKey(p.publishedAt || p.date) === thisMonthKey);
        const lastMonth = published.filter((p) => monthKey(p.publishedAt || p.date) === lastMonthKey);
        const sumOf = (list, key) => list.reduce((a, p) => a + (p[key] || 0), 0);
        const pctDelta = (curr, prev) => (prev > 0 ? Math.round(((curr - prev) / prev) * 100) : null);

        const reachThis = sumOf(thisMonth, "reach") || sumOf(thisMonth, "views");
        const reachLast = sumOf(lastMonth, "reach") || sumOf(lastMonth, "views");
        const engThis = sumOf(thisMonth, "likes") + sumOf(thisMonth, "comments") + sumOf(thisMonth, "shares");
        const impThis = sumOf(thisMonth, "impressions") || reachThis;
        const engRateThis = impThis > 0 ? (engThis / impThis) * 100 : 0;
        const engLast = sumOf(lastMonth, "likes") + sumOf(lastMonth, "comments") + sumOf(lastMonth, "shares");
        const impLast = sumOf(lastMonth, "impressions") || reachLast;
        const engRateLast = impLast > 0 ? (engLast / impLast) * 100 : 0;

        const doneCountAll = posts.filter((p) => p.done).length;
        const goalPct = Math.min(100, Math.round((doneCountAll / MONTHLY_GOAL) * 100));

        const chartPosts = [...published]
          .sort((a, b) => new Date(a.publishedAt || a.date) - new Date(b.publishedAt || b.date))
          .slice(-8)
          .map((p) => ({ name: p.title.length > 14 ? p.title.slice(0, 13) + "…" : p.title, value: p.reach || p.views || 0, full: p.title }));
        const bestVal = Math.max(0, ...chartPosts.map((c) => c.value));

        const recentPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        const homeStatusConf = {
          published: { label: "Live", color: C.green },
          scheduled: { label: "Geplant", color: C.accent },
          queued: { label: "Warteschlange", color: C.purple },
          draft: { label: "Entwurf", color: C.dimmed },
          failed: { label: "Fehler", color: C.redLight },
          partial: { label: "Teilweise", color: C.yellow },
        };

        const exportCsv = () => {
          const rows = [
            ["Titel", "Datum", "Status", "Likes", "Kommentare", "Shares"],
            ...posts.map((p) => [p.title, new Date(p.date).toLocaleDateString("de-DE"), p.status, p.likes, p.comments, p.shares]),
          ];
          const csv = rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
          const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = `beitraege-${now.toISOString().slice(0, 10)}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        };

        const DeltaTag = ({ value }) => value === null ? (
          <span style={{ fontSize: TYPE.small, color: C.dimmed }}>seit Verbindung</span>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: SPACE.xs, fontSize: TYPE.small, fontWeight: 500, color: value >= 0 ? C.green : C.redLight }}>
            {value >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {value >= 0 ? "+" : ""}{value}%
            <span style={{ color: C.dimmed, fontWeight: 500 }}>ggü. Vormonat</span>
          </div>
        );

        const StatCard = ({ icon: Icon, iconColor, iconBg, label, value, delta }) => (
          <div className="glass-panel" style={{ background: C.glass, border: `1px solid ${C.border}`, borderRadius: RADIUS.xxl, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: SPACE.lg, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: RADIUS.lg, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={16} /></div>
              <div style={{ fontSize: TYPE.small, fontWeight: 500, color: C.muted }}>{label}</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.01em", color: C.white }}>{value}</div>
            <div style={{ marginTop: 8 }}><DeltaTag value={delta} /></div>
          </div>
        );

        return (
          <div style={{ padding: "24px 32px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: SPACE.xxl }}>
              <div>
                <div style={{ fontSize: TYPE.h2, fontWeight: 700, letterSpacing: "-0.02em", color: C.white }}>Willkommen zurück, Dariel 👋</div>
                <div style={{ fontSize: TYPE.body, color: C.muted, marginTop: 6 }}>Behalte den Überblick über deine Content-Performance und Workflows.</div>
              </div>
              <div style={{ display: "flex", gap: SPACE.md }}>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.sm, background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.pill, padding: "9px 16px", fontSize: TYPE.small, color: C.muted, fontWeight: 500 }}>
                  <Calendar size={14} /> {now.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                </div>
                <button onClick={exportCsv} style={{ display: "flex", alignItems: "center", gap: SPACE.sm, background: C.accent, border: "none", borderRadius: RADIUS.pill, padding: "9px 18px", color: "#fff", fontSize: TYPE.small, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 6px 16px ${C.accentGlow}` }}>
                  <Download size={14} /> Export
                </button>
              </div>
            </div>

            <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: SPACE.xl, marginBottom: SPACE.xl }}>
              <StatCard icon={TrendingUp} iconColor={C.accent} iconBg={C.accentGlow} label="Reichweite (Monat)" value={fmt(reachThis)} delta={pctDelta(reachThis, reachLast)} />
              <StatCard icon={Heart} iconColor={C.purple} iconBg={C.purpleGlow} label="Engagement Rate" value={`${engRateThis.toFixed(2)}%`} delta={pctDelta(engRateThis, engRateLast)} />
              <StatCard icon={Check} iconColor={C.teal} iconBg={C.tealGlow} label="Veröffentlichte Beiträge" value={thisMonth.length} delta={pctDelta(thisMonth.length, lastMonth.length)} />
            </div>

            <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: SPACE.xl, marginBottom: SPACE.xl, alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", gap: SPACE.md, marginBottom: SPACE.xl }}>
                  <button onClick={() => { setCreateModalInitialDate(""); setShowCreateModal(true); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: SPACE.sm, background: `linear-gradient(135deg, ${C.ctaLight}, ${C.cta})`, border: "none", borderRadius: RADIUS.lg, padding: "11px 18px", color: "#fff", fontSize: TYPE.body, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 20px ${C.ctaGlow}` }}>
                    <Plus size={15} /> Neuer Beitrag
                  </button>
                  <button onClick={() => setActiveTab("calendar")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: SPACE.sm, background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: "11px 18px", color: C.white, fontSize: TYPE.body, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                    <Calendar size={15} /> Warteschlange ansehen
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white }}>Meine Kanäle</div>
                  <div onClick={() => setActiveTab("connections")} style={{ display: "flex", alignItems: "center", gap: SPACE.xs, fontSize: TYPE.small, color: C.muted, cursor: "pointer" }}><Plus size={13} /> Verbinden</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACE.md }}>
                  {(isConnected && accounts.length > 0 ? accounts : [{ platform: "instagram" }, { platform: "tiktok" }]).map((acc, i) => {
                    const connected = isConnected && !!acc.id;
                    const meta = platformMeta(acc.platform);
                    const Icon = meta.icon;
                    return (
                      <div key={acc.id || acc.accountId || i} className="glass-panel" style={{ background: C.glass, border: `1px solid ${C.border}`, borderRadius: RADIUS.xl, padding: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, marginBottom: 10 }}>
                          <div style={{ width: 26, height: 26, borderRadius: RADIUS.md, background: meta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={13} color="#fff" />
                          </div>
                          <div style={{ fontSize: TYPE.small, fontWeight: 500, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {meta.label}{acc.profileName ? ` · ${acc.profileName}` : ""}
                          </div>
                        </div>
                        <div style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{connected ? `@${acc.username || acc.name || "mitunsverkaufen"}` : "—"}</div>
                        <div style={{ fontSize: TYPE.caption, fontWeight: 500, color: connected ? C.green : C.dimmed, marginTop: 5 }}>● {connected ? "Aktiv" : "Nicht verbunden"}</div>
                      </div>
                    );
                  })}
                  <div className="glass-panel" style={{ background: C.glass, border: `1px solid ${C.border}`, borderRadius: RADIUS.xl, padding: 14, gridColumn: "1 / -1" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, marginBottom: 10 }}>
                      <div style={{ width: 26, height: 26, borderRadius: RADIUS.md, background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Target size={13} color="#fff" /></div>
                      <div style={{ fontSize: TYPE.small, fontWeight: 500, color: C.muted }}>Monatsziel</div>
                    </div>
                    <div style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white }}>{doneCountAll} / {MONTHLY_GOAL} Beiträge</div>
                    <div style={{ fontSize: TYPE.caption, fontWeight: 500, color: C.accent, marginTop: 5 }}>● Im Plan · {goalPct}%</div>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ background: C.glass, border: `1px solid ${C.border}`, borderRadius: RADIUS.xxl, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: RADIUS.lg, background: C.accentGlow, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><BarChart3 size={16} /></div>
                  <div style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white }}>Reichweite je Beitrag</div>
                </div>
                {chartPosts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartPosts} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: C.dimmed, fontSize: TYPE.micro }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: C.dimmed, fontSize: TYPE.micro }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                      <Tooltip cursor={{ fill: C.cardHover }} content={({ active, payload }) => active && payload?.[0] ? (
                        <div style={{ background: C.cardHover, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: "8px 12px", fontSize: TYPE.small, color: C.white, boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}>
                          <div style={{ color: C.dimmed, marginBottom: 2 }}>{payload[0].payload.full}</div>
                          <div style={{ fontWeight: 600 }}>{fmt(payload[0].value)} Reichweite</div>
                        </div>
                      ) : null} />
                      <Bar dataKey="value" radius={[6, 6, 2, 2]}>
                        {chartPosts.map((entry, i) => <Cell key={i} fill={entry.value === bestVal ? C.accent : C.cardHover} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: C.dimmed, fontSize: TYPE.body, textAlign: "center" }}>Noch keine veröffentlichten Beiträge mit Reichweite</div>
                )}
              </div>
            </div>

            <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.35fr", gap: SPACE.xl }}>
              <div className="glass-panel" style={{ background: C.glass, border: `1px solid ${C.border}`, borderRadius: RADIUS.xxl, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: RADIUS.lg, background: C.yellowGlow, color: C.yellow, display: "flex", alignItems: "center", justifyContent: "center" }}><Target size={16} /></div>
                  <div style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white }}>Content-Ziele</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.lg }}>
                  <div style={{ width: 32, height: 32, borderRadius: RADIUS.lg, background: C.accentGlow, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Send size={15} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: TYPE.small, fontWeight: 500, color: C.white, marginBottom: 6 }}>Monatsziel · {doneCountAll} / {MONTHLY_GOAL} Beiträge</div>
                    <div style={{ height: 5, background: C.bg, borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${goalPct}%`, background: C.accent, borderRadius: 999 }} />
                    </div>
                  </div>
                  <div style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white, flexShrink: 0 }}>{goalPct}%</div>
                </div>
              </div>

              <div className="glass-panel" style={{ background: C.glass, border: `1px solid ${C.border}`, borderRadius: RADIUS.xxl, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: RADIUS.lg, background: C.purpleGlow, color: C.purple, display: "flex", alignItems: "center", justifyContent: "center" }}><FileText size={16} /></div>
                  <div style={{ fontSize: TYPE.body, fontWeight: 600, color: C.white, flex: 1 }}>Neueste Beiträge</div>
                  <div onClick={() => setActiveTab("dashboard")} style={{ display: "flex", alignItems: "center", gap: SPACE.xs, background: C.bg, border: `1px solid ${C.border}`, borderRadius: RADIUS.pill, padding: "6px 12px", fontSize: TYPE.caption, color: C.muted, cursor: "pointer" }}><Filter size={12} /> Alle ansehen</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 0.8fr 1fr", gap: SPACE.md, padding: `0 ${SPACE.xs}px ${SPACE.sm}px`, borderBottom: `1px solid ${C.border}`, fontSize: TYPE.micro, letterSpacing: "0.05em", textTransform: "uppercase", color: C.dimmed }}>
                  <div>Beitrag</div><div>Datum</div><div>Likes</div><div>Status</div>
                </div>
                {recentPosts.length === 0 && <div style={{ padding: "20px 0", textAlign: "center", color: C.dimmed, fontSize: TYPE.small }}>Noch keine Beiträge</div>}
                {recentPosts.map((p) => {
                  const postMeta = platformMeta((p.platforms || [])[0]);
                  const PostIcon = postMeta.icon;
                  const sc = homeStatusConf[p.status] || homeStatusConf.draft;
                  return (
                    <div key={p.id} onClick={() => setSelectedPost(p)} style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 0.8fr 1fr", gap: SPACE.md, alignItems: "center", padding: `${SPACE.md}px ${SPACE.xs}px`, borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, minWidth: 0 }}>
                        <div style={{ width: 26, height: 26, borderRadius: RADIUS.md, background: postMeta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <PostIcon size={12} color="#fff" />
                        </div>
                        <span style={{ fontSize: TYPE.small, fontWeight: 500, color: C.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</span>
                      </div>
                      <div style={{ fontSize: TYPE.caption, color: C.muted }}>{new Date(p.date).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}</div>
                      <div style={{ fontSize: TYPE.caption, color: C.muted }}>{p.likes > 0 ? p.likes.toLocaleString("de-DE") : "—"}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: SPACE.xs, fontSize: TYPE.caption, fontWeight: 500, color: sc.color }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.color }} />{sc.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Connections Tab (Zernio style) ──────────────────── */}
      {activeTab === "connections" && (
        <div style={{ padding: "24px 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: TYPE.h2, fontWeight: 700, letterSpacing: "-0.02em", color: C.white }}>Verbindungen</div>
              <div style={{ fontSize: TYPE.body, color: C.muted, marginTop: 2 }}>Profile und Plattform-Integrationen verwalten</div>
            </div>
            <div style={{ display: "flex", gap: SPACE.md }}>
              <button style={{ display: "flex", alignItems: "center", gap: SPACE.sm, padding: "9px 20px", borderRadius: RADIUS.lg, background: C.accent, border: "none", color: "#fff", fontSize: TYPE.body, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                <Plus size={15} /> Neue Verbindung
              </button>
              <button style={{ padding: "9px 20px", borderRadius: RADIUS.lg, background: C.card, border: `1px solid ${C.border}`, color: C.white, fontSize: TYPE.body, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                Neues Profil
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div style={{ display: "flex", alignItems: "center", gap: SPACE.xxl, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
              <span style={{ fontSize: TYPE.bodyLg, fontWeight: 600, color: C.white }}>Plattformen</span>
              <select style={{ padding: "8px 14px", borderRadius: RADIUS.lg, background: C.card, border: `1px solid ${C.border}`, color: C.white, fontSize: TYPE.body, fontFamily: "inherit", cursor: "pointer", minWidth: 140 }}>
                <option>Alle Profile</option>
              </select>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: SPACE.md }}>
              <button style={{ padding: "7px 14px", borderRadius: RADIUS.lg, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Alle Plattformen</button>
              <button style={{ padding: "7px 14px", borderRadius: RADIUS.lg, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Alle Status</button>
            </div>
          </div>

          {/* Connection Cards – grouped by profile so multiple accounts per platform (e.g. two TikTok accounts under different profiles) stay distinguishable */}
          {accounts.length > 0 ? (
            Object.entries(
              accounts.reduce((groups, acc) => {
                const key = acc.profileName || "Weitere";
                (groups[key] = groups[key] || []).push(acc);
                return groups;
              }, {})
            ).map(([profileName, profileAccounts]) => (
              <div key={profileName} style={{ marginBottom: SPACE.xxl }}>
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.sm, fontSize: TYPE.small, fontWeight: 600, color: C.muted, marginBottom: SPACE.lg }}>
                  <Users size={13} /> {profileName}
                </div>
                <div style={{ display: "flex", gap: SPACE.xxl, flexWrap: "wrap" }}>
                  {profileAccounts.map((acc) => {
                    const meta = platformMeta(acc.platform);
                    const Icon = meta.icon;
                    return (
                      <div key={acc.id || acc.accountId} style={{ width: 240, background: C.card, borderRadius: RADIUS.xxl, border: `1px solid ${C.border}`, padding: "18px 20px", position: "relative" }}>
                        {/* Info icon top right */}
                        <div style={{ position: "absolute", top: 14, right: 14, cursor: "pointer" }}>
                          <AlertCircle size={16} color={C.dimmed} />
                        </div>
                        {/* Platform header */}
                        <div style={{ display: "flex", alignItems: "center", gap: SPACE.lg, marginBottom: 4 }}>
                          <Icon size={20} color={meta.color} />
                          <div>
                            <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, color: C.white }}>{meta.label}</div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: SPACE.xs, fontSize: TYPE.micro, fontWeight: 500, color: C.green, background: C.greenGlow, padding: `${SPACE.xxs}px ${SPACE.md}px`, borderRadius: RADIUS.sm, marginTop: 2 }}>
                              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green }} /> verbunden
                            </div>
                          </div>
                        </div>
                        {/* Handle */}
                        <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.white, marginTop: 10 }}>@{acc.username || acc.name || "mitunsverkaufen.de"}</div>
                        <div style={{ fontSize: TYPE.caption, color: C.dimmed, marginTop: 2 }}>{acc.connectedAt ? new Date(acc.connectedAt).toLocaleDateString("de-DE") : new Date().toLocaleDateString("de-DE")}</div>
                        {/* Profile badge */}
                        <div style={{ display: "inline-flex", alignItems: "center", gap: SPACE.xs, fontSize: TYPE.micro, fontWeight: 500, color: C.purple, background: C.purpleGlow, padding: "3px 10px", borderRadius: RADIUS.sm, marginTop: 10 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.purple }} /> {profileName}
                        </div>
                        {/* Disconnect button */}
                        <button style={{ display: "block", width: "100%", padding: `${SPACE.md}px 0`, borderRadius: RADIUS.lg, background: C.bg, border: `1px solid ${C.border}`, color: C.white, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginTop: 14, textAlign: "center" }}>
                          Trennen
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div style={{ display: "flex", gap: SPACE.xxl, flexWrap: "wrap" }}>
            {(
              /* Demo connection cards when not connected */
              ["Instagram", "TikTok"].map((plat) => {
                const isIG = plat === "Instagram";
                const color = isIG ? C.instagram : C.tiktok;
                const Icon = isIG ? Instagram : TikTokIcon;
                return (
                  <div key={plat} style={{ width: 240, background: C.card, borderRadius: RADIUS.xxl, border: `1px solid ${C.border}`, padding: "18px 20px", position: "relative" }}>
                    <div style={{ position: "absolute", top: 14, right: 14 }}><AlertCircle size={16} color={C.dimmed} /></div>
                    <div style={{ display: "flex", alignItems: "center", gap: SPACE.lg, marginBottom: 4 }}>
                      <Icon size={20} color={color} />
                      <div>
                        <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, color: C.white }}>{plat}</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: SPACE.xs, fontSize: TYPE.micro, fontWeight: 500, color: isConnected ? C.green : C.yellow, background: isConnected ? C.greenGlow : C.yellowGlow, padding: `${SPACE.xxs}px ${SPACE.md}px`, borderRadius: RADIUS.sm, marginTop: 2 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: isConnected ? C.green : C.yellow }} /> {isConnected ? "verbunden" : "nicht verbunden"}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.white, marginTop: 10 }}>@mitunsverkaufen.de</div>
                    <div style={{ fontSize: TYPE.caption, color: C.dimmed, marginTop: 2 }}>—</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: SPACE.xs, fontSize: TYPE.micro, fontWeight: 500, color: C.purple, background: C.purpleGlow, padding: "3px 10px", borderRadius: RADIUS.sm, marginTop: 10 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.purple }} /> Business
                    </div>
                    <button style={{ display: "block", width: "100%", padding: `${SPACE.md}px 0`, borderRadius: RADIUS.lg, background: isConnected ? C.bg : C.accent, border: `1px solid ${isConnected ? C.border : C.accent}`, color: "#fff", fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginTop: 14, textAlign: "center" }}>
                      {isConnected ? "Trennen" : "Verbinden"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
          )}
        </div>
      )}

      {/* ── Logs Tab (Zernio style table) ─────────────────── */}
      {activeTab === "logs" && (
        <LogsPanel errorLog={errorLog} />
      )}

      {/* Calendar Tab */}
      {activeTab === "calendar" && (
        <CalendarPanel
          posts={posts}
          onSelectPost={(post) => {
            setActiveTab("dashboard");
            setTimeout(() => setSelectedPost(post), 100);
          }}
          onNewPost={(date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            setCreateModalInitialDate(`${y}-${m}-${d}`);
            setShowCreateModal(true);
          }}
        />
      )}

      {/* Skripte Tab */}
      {activeTab === "skripte" && (
        <SkriptePanel scripts={scripts} onRefresh={fetchScripts} loading={scriptsLoading} />
      )}

      {/* Content-Pipeline Tab */}
      {activeTab === "pipeline" && (
        <ContentPipelinePanel />
      )}

      {/* Inbox Tabs (Messages & Comments share one panel with preset view) */}
      {(activeTab === "notifications" || activeTab === "comments") && (
        <NotificationPanel notifications={notifications} onMarkAllRead={markAllRead} isConnected={isConnected} defaultView={activeTab === "comments" ? "comments" : "dms"} />
      )}

      {/* ── Analytics Tab (Zernio Design) ─────────────────────── */}
      {activeTab === "analytics" && (() => {
        // ── Robust data extraction from API response ──
        const raw = analyticsData.daily || {};
        // Try every possible path for daily data
        let daily = raw.dailyData || raw.data || raw.daily || (Array.isArray(raw) ? raw : null);
        if (!daily || (Array.isArray(daily) && daily.length === 0)) daily = null;

        // Extract breakdown – try multiple paths
        const breakdown = raw.platformBreakdown || raw.breakdown || raw.platforms || null;

        // Compute totals: prefer breakdown sums (more reliable), fallback to daily sums
        let totals = { likes: 0, comments: 0, shares: 0, views: 0, impressions: 0, reach: 0, clicks: 0, saves: 0 };
        if (breakdown && typeof breakdown === "object") {
          Object.values(breakdown).forEach((m) => {
            totals.likes += (m.likes || 0);
            totals.comments += (m.comments || 0);
            totals.shares += (m.shares || 0);
            totals.views += (m.views || 0);
            totals.impressions += (m.impressions || 0);
            totals.reach += (m.reach || 0);
            totals.clicks += (m.clicks || 0);
            totals.saves += (m.saves || 0);
          });
        } else if (daily) {
          daily.forEach((d) => {
            totals.likes += (d.likes || 0);
            totals.comments += (d.comments || 0);
            totals.shares += (d.shares || 0);
            totals.views += (d.views || 0);
            totals.impressions += (d.impressions || 0);
            totals.reach += (d.reach || 0);
            totals.clicks += (d.clicks || 0);
            totals.saves += (d.saves || 0);
          });
        }

        // Engagement rate
        const totalEngagement = totals.likes + totals.comments + totals.shares;
        const engRate = totals.impressions > 0 ? ((totalEngagement / totals.impressions) * 100).toFixed(2) : totals.reach > 0 ? ((totalEngagement / totals.reach) * 100).toFixed(2) : "0.00";

        const hasRealData = breakdown || daily;
        const isDemo = !hasRealData;

        // Chart data: use daily if available, else build from posts
        const chartData = daily || posts.filter((p) => p.status === "published").slice(0, 30).map((p) => ({
          date: new Date(p.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }),
          likes: p.likes || 0, comments: p.comments || 0, shares: p.shares || 0, views: p.views || 0,
        })).reverse();

        // Best time
        const bestTimeRaw = analyticsData.bestTime || {};
        const bestTimeData = bestTimeRaw.slots || bestTimeRaw.data || bestTimeRaw.bestTimes || [];
        const dayLabels = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
        const btMap = {};
        (Array.isArray(bestTimeData) ? bestTimeData : []).forEach((s) => {
          btMap[`${s.dayOfWeek || s.day}-${s.hour}`] = s.avg_engagement || s.engagement || s.score || 0;
        });
        const maxEng = Math.max(...Object.values(btMap), 1);

        // Top performing posts (sort by engagement)
        const topPosts = [...posts].filter((p) => p.status === "published").sort((a, b) => ((b.likes || 0) + (b.comments || 0) + (b.shares || 0)) - ((a.likes || 0) + (a.comments || 0) + (a.shares || 0))).slice(0, 5);

        // Platform breakdown cards
        const platformCards = [];
        if (breakdown) {
          Object.entries(breakdown).forEach(([key, metrics]) => {
            // Detect platform from key (could be platform name, accountId, or profileId)
            const acct = accounts.find((a) => a.accountId === key || a.id === key || a.profileId === key);
            const platName = acct?.platform || (key.toLowerCase().includes("instagram") ? "instagram" : key.toLowerCase().includes("tiktok") ? "tiktok" : key);
            platformCards.push({ key, platform: platName, name: acct?.name || platName, metrics, postCount: metrics.postCount || metrics.posts || "–" });
          });
        }

        // Content decay
        const decayRaw = analyticsData.decay || {};
        const decayData = decayRaw.buckets || decayRaw.data || [];

        return (
        <div style={{ padding: "24px 32px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: TYPE.h2, fontWeight: 700, letterSpacing: "-0.02em", color: C.white }}>Statistiken</div>
              <div style={{ fontSize: TYPE.body, color: C.muted, marginTop: 2 }}>Leistungskennzahlen deiner Posts</div>
            </div>
            <div style={{ display: "flex", gap: SPACE.md, alignItems: "center" }}>
              {["all", "instagram", "tiktok"].map((p) => {
                const active = analyticsPlatform === p;
                const col = p === "instagram" ? C.instagram : p === "tiktok" ? C.tiktok : C.white;
                return (
                  <button key={p} onClick={() => setAnalyticsPlatform(p)} style={{ padding: "7px 16px", borderRadius: RADIUS.lg, border: `1px solid ${active ? col + "60" : C.border}`, background: active ? col + "12" : "transparent", color: active ? col : C.dimmed, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                    {p === "all" ? "Alle Plattformen" : p === "instagram" ? "Instagram" : "TikTok"}
                  </button>
                );
              })}
              {["7d", "30d", "90d"].map((r) => {
                const active = analyticsRange === r;
                return (
                  <button key={r} onClick={() => setAnalyticsRange(r)} style={{ padding: "7px 14px", borderRadius: RADIUS.lg, border: `1px solid ${active ? C.blue + "60" : C.border}`, background: active ? C.blueGlow : "transparent", color: active ? C.blue : C.dimmed, fontSize: TYPE.small, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                    {r === "7d" ? "7 Tage" : r === "30d" ? "30 Tage" : "90 Tage"}
                  </button>
                );
              })}
              <button onClick={fetchAnalytics} style={{ width: 34, height: 34, borderRadius: RADIUS.lg, display: "flex", alignItems: "center", justifyContent: "center", background: C.card, border: `1px solid ${C.border}`, cursor: "pointer" }}>
                <RefreshCw size={14} color={C.muted} style={analyticsLoading ? { animation: "spin 1s linear infinite" } : {}} />
              </button>
            </div>
          </div>

          {isDemo && (
            <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, padding: `${SPACE.lg}px ${SPACE.xxl}px`, borderRadius: RADIUS.xl, background: C.yellowGlow, border: `1px solid ${C.yellow}30`, marginBottom: 20 }}>
              <AlertCircle size={14} color={C.yellow} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: TYPE.small, color: C.yellow }}>Demo-Modus – Daten basieren auf deinen Posts. Verbinde die API für erweiterte Metriken.</div>
            </div>
          )}

          {/* ── Metric Cards (Zernio style: 2 rows of 4) ───────── */}
          <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: SPACE.lg, marginBottom: 24 }}>
            {[
              { label: "Likes", icon: Heart, value: fmt(totals.likes), color: C.redLight, change: null },
              { label: "Kommentare", icon: MessageCircle, value: fmt(totals.comments), color: C.blue, change: null },
              { label: "Geteilt", icon: Share2, value: fmt(totals.shares), color: C.green, change: null },
              { label: "Aufrufe", icon: Eye, value: fmt(totals.views), color: C.purple, change: null },
              { label: "Impressionen", icon: TrendingUp, value: fmt(totals.impressions), color: C.blue, change: null },
              { label: "Reichweite", icon: Users, value: fmt(totals.reach), color: C.yellow, change: null },
              { label: "Klicks", icon: ExternalLink, value: fmt(totals.clicks), color: C.green, change: null },
              { label: "Eng.-Rate", icon: BarChart3, value: `${engRate}%`, color: C.redLight, change: null },
            ].map((m) => (
              <div key={m.label} className="glass-panel glass-border" style={{ background: C.glass, borderRadius: RADIUS.xxl, boxShadow: "0 12px 28px rgba(0,0,0,0.25)", padding: "14px 16px", display: "flex", alignItems: "center", gap: SPACE.lg }}>
                <div style={{ color: m.color, display: "flex", alignItems: "center" }}><m.icon size={16} /></div>
                <div>
                  <div style={{ fontSize: TYPE.caption, color: C.dimmed, fontWeight: 500, marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: TYPE.h4, fontWeight: 700, color: C.white }}>{m.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Daily Chart ────────────────────────────────────── */}
          <div className="glass-panel glass-border" style={{ background: C.glass, borderRadius: RADIUS.shell, boxShadow: "0 20px 48px rgba(0,0,0,0.35)", padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, marginBottom: 16, color: C.white }}>Tägliche Performance</div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="date" tick={{ fill: C.dimmed, fontSize: TYPE.micro }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.dimmed, fontSize: TYPE.micro }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                  <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.xl, fontSize: TYPE.small, color: C.white }} />
                  <Line type="monotone" dataKey="likes" name="Likes" stroke={C.redLight} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="comments" name="Kommentare" stroke={C.blue} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="views" name="Aufrufe" stroke={C.purple} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: C.dimmed, fontSize: TYPE.body }}>Keine täglichen Daten verfügbar</div>
            )}
          </div>

          <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: SPACE.xxxl, marginBottom: 20 }}>
            {/* ── Best Time to Post (green heatmap like Zernio) ── */}
            <div className="glass-panel glass-border" style={{ background: C.glass, borderRadius: RADIUS.shell, boxShadow: "0 20px 48px rgba(0,0,0,0.35)", padding: 20 }}>
              <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, marginBottom: 14, color: C.white }}>Beste Zeit zum Posten</div>
              <div style={{ display: "grid", gridTemplateColumns: `36px repeat(7, 1fr)`, gap: SPACE.xs }}>
                <div />
                {dayLabels.map((d) => <div key={d} style={{ textAlign: "center", fontSize: TYPE.micro, color: C.dimmed, fontWeight: 500, paddingBottom: 6 }}>{d}</div>)}
                {[6, 9, 12, 15, 18, 21].map((h) => (
                  <React.Fragment key={h}>
                    <div style={{ fontSize: TYPE.micro, color: C.dimmed, lineHeight: "26px", textAlign: "right", paddingRight: 6 }}>{h < 10 ? "0" : ""}{h}:00</div>
                    {dayLabels.map((_, di) => {
                      const val = btMap[`${di}-${h}`] || 0;
                      const intensity = val / maxEng;
                      // Green gradient (Zernio style)
                      const bg = intensity > 0 ? `rgba(34,197,94,${0.15 + intensity * 0.75})` : C.bg;
                      return (
                        <div key={di} title={`${dayLabels[di]} ${h}:00 – ${val.toFixed(1)}% Engagement`} style={{
                          height: 26, borderRadius: RADIUS.sm, background: bg,
                          border: `1px solid ${intensity > 0.4 ? "rgba(34,197,94,0.3)" : C.border}`,
                          cursor: "default",
                        }} />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: SPACE.sm, marginTop: 12, justifyContent: "center" }}>
                <div style={{ fontSize: TYPE.micro, color: C.dimmed }}>Weniger</div>
                {[0.1, 0.25, 0.45, 0.65, 0.85].map((o) => <div key={o} style={{ width: 14, height: 14, borderRadius: RADIUS.sm, background: `rgba(34,197,94,${o})` }} />)}
                <div style={{ fontSize: TYPE.micro, color: C.dimmed }}>Mehr</div>
              </div>
              {/* Best times badges */}
              {Object.entries(btMap).length > 0 && (() => {
                const sorted = Object.entries(btMap).sort((a, b) => b[1] - a[1]).slice(0, 3);
                return (
                  <div style={{ display: "flex", gap: SPACE.sm, marginTop: 12, justifyContent: "center" }}>
                    <span style={{ fontSize: TYPE.caption, color: C.dimmed, marginRight: 4 }}>Beste Zeit:</span>
                    {sorted.map(([key]) => {
                      const [d, h] = key.split("-").map(Number);
                      return <span key={key} style={{ fontSize: TYPE.caption, fontWeight: 500, color: C.green, background: C.green + "15", padding: `${SPACE.xxs}px ${SPACE.lg}px`, borderRadius: RADIUS.md, border: `1px solid ${C.green}25` }}>{dayLabels[d]} {h}:00</span>;
                    })}
                  </div>
                );
              })()}
            </div>

            {/* ── Top Performing Posts ──────────────────────────── */}
            <div className="glass-panel glass-border" style={{ background: C.glass, borderRadius: RADIUS.shell, boxShadow: "0 20px 48px rgba(0,0,0,0.35)", padding: 20 }}>
              <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, marginBottom: 14, color: C.white }}>Top Posts</div>
              <div style={{ display: "flex", flexDirection: "column", gap: SPACE.md }}>
                {topPosts.length === 0 && <div style={{ color: C.dimmed, fontSize: TYPE.small, padding: 20, textAlign: "center" }}>Keine veröffentlichten Posts</div>}
                {topPosts.map((p, i) => {
                  const eng = (p.likes || 0) + (p.comments || 0) + (p.shares || 0);
                  const pER = p.views > 0 ? ((eng / p.views) * 100).toFixed(2) : "–";
                  const postDate = new Date(p.date).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: SPACE.xl, padding: `${SPACE.md}px ${SPACE.lg}px`, borderRadius: RADIUS.lg, cursor: "pointer", transition: "background 0.15s" }}
                      onMouseOver={(e) => e.currentTarget.style.background = C.bg}
                      onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                      onClick={() => setSelectedPost(p)}>
                      <div style={{ width: 22, height: 22, borderRadius: RADIUS.md, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: TYPE.caption, fontWeight: 600, color: C.dimmed, flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: TYPE.small, color: C.white, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                        <div style={{ fontSize: TYPE.micro, color: C.dimmed }}>{postDate}</div>
                      </div>
                      <div style={{ fontSize: TYPE.small, fontWeight: 600, color: C.green, background: C.greenGlow, padding: "3px 10px", borderRadius: RADIUS.md, flexShrink: 0 }}>ER {pER}%</div>
                      <div style={{ display: "flex", alignItems: "center", gap: SPACE.xs, flexShrink: 0 }}>
                        <Heart size={11} color={C.dimmed} /><span style={{ fontSize: TYPE.caption, color: C.dimmed }}>{p.likes || 0}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Platform Breakdown (Zernio style cards) ────────── */}
          {platformCards.length > 0 && (
            <div style={{ background: C.card, borderRadius: RADIUS.xxxl, border: `1px solid ${C.border}`, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, marginBottom: 14, color: C.white }}>Plattform-Übersicht</div>
              <div style={{ display: "flex", flexDirection: "column", gap: SPACE.md }}>
                {platformCards.map((pc) => {
                  const key = pc.platform.toLowerCase();
                  const detected = ["instagram", "tiktok", "youtube", "facebook", "linkedin"].find((k) => key.includes(k));
                  const meta = detected ? platformMeta(detected) : { label: pc.name, icon: Globe, color: C.blue };
                  const Icon = meta.icon;
                  const m = pc.metrics;
                  const eng = (m.likes || 0) + (m.comments || 0) + (m.shares || 0);
                  const er = m.impressions > 0 ? ((eng / m.impressions) * 100).toFixed(2) : m.reach > 0 ? ((eng / m.reach) * 100).toFixed(2) : "–";
                  return (
                    <div key={pc.key} style={{ display: "flex", alignItems: "center", gap: SPACE.xxl, padding: `${SPACE.xl}px ${SPACE.xxl}px`, borderRadius: RADIUS.xl, background: C.bg, border: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, minWidth: 140 }}>
                        <Icon size={16} color={meta.color} />
                        <div>
                          <div style={{ fontSize: TYPE.body, fontWeight: 600, color: meta.color }}>{meta.label}</div>
                          <div style={{ fontSize: TYPE.micro, color: C.dimmed }}>{pc.postCount} posts</div>
                        </div>
                      </div>
                      <div style={{ flex: 1, display: "flex", gap: SPACE.xxxl, justifyContent: "space-around" }}>
                        {[
                          { icon: Heart, val: m.likes || 0 },
                          { icon: MessageCircle, val: m.comments || 0 },
                          { icon: Share2, val: m.shares || 0 },
                          { icon: Eye, val: m.views || 0 },
                        ].map((s, si) => (
                          <div key={si} style={{ display: "flex", alignItems: "center", gap: SPACE.xs }}>
                            <s.icon size={12} color={C.dimmed} />
                            <span style={{ fontSize: TYPE.small, color: C.white, fontWeight: 500 }}>{fmt(s.val)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: TYPE.small, fontWeight: 600, color: C.green, background: C.greenGlow, padding: `${SPACE.xs}px ${SPACE.xl}px`, borderRadius: RADIUS.md }}>ER {er}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Content Decay Chart ────────────────────────────── */}
          {decayData.length > 0 && (
            <div style={{ background: C.card, borderRadius: RADIUS.xxxl, border: `1px solid ${C.border}`, padding: 20 }}>
              <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, marginBottom: 4, color: C.white }}>Content-Leistungsverlauf</div>
              <div style={{ fontSize: TYPE.caption, color: C.dimmed, marginBottom: 14 }}>Wie schnell erreicht ein Post seine finale Reichweite?</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={decayData}>
                  <defs>
                    <linearGradient id="gradDecay" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.purple} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={C.purple} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="bucket_label" tick={{ fill: C.dimmed, fontSize: TYPE.micro }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.dimmed, fontSize: TYPE.micro }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.xl, fontSize: TYPE.small, color: C.white }} formatter={(v) => [`${v}%`, "Erreicht"]} />
                  <Area type="monotone" dataKey="avg_pct_of_final" name="Leistung" stroke={C.purple} fill="url(#gradDecay)" strokeWidth={2} dot={{ r: 3, fill: C.purple }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        );
      })()}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div style={{ padding: "24px 32px", maxWidth: 800 }}>
          <div style={{ fontSize: TYPE.h2, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4, color: C.white }}>Einstellungen</div>
          <div style={{ fontSize: TYPE.body, color: C.muted, marginBottom: 24 }}>API-Verbindung, Team-Zugriff und Benachrichtigungseinstellungen</div>

          {/* API Status */}
          <div style={{ background: C.card, borderRadius: RADIUS.xxxl, border: `1px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600, marginBottom: 12 }}>Late-API-Status</div>
            <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, fontSize: TYPE.body, marginBottom: 16 }}>
              {isConnected ? <Wifi size={14} color={C.green} /> : <WifiOff size={14} color={C.yellow} />}
              <span style={{ color: isConnected ? C.green : C.yellow, fontWeight: 500 }}>{isConnected ? `Verbunden · ${accounts.length} Account${accounts.length !== 1 ? "s" : ""}` : "Nicht verbunden – Demo-Modus"}</span>
              <button onClick={() => { fetchAccounts(); fetchPosts(); }} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: SPACE.sm, padding: "6px 14px", borderRadius: RADIUS.lg, background: C.bg, border: `1px solid ${C.border}`, color: C.muted, fontSize: TYPE.small, cursor: "pointer", fontFamily: "inherit" }}>
                <RefreshCw size={12} /> Neu laden
              </button>
            </div>

            {/* Connected Accounts List */}
            {accounts.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: TYPE.small, fontWeight: 600, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Verbundene Accounts</div>
                {accounts.map((a, i) => {
                  const meta = platformMeta(a.platform);
                  const Icon = meta.icon;
                  return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: SPACE.lg, padding: `${SPACE.md}px ${SPACE.xl}px`, borderRadius: RADIUS.lg, background: C.bg, border: `1px solid ${C.border}`, marginBottom: 6 }}>
                    <div style={{ width: 28, height: 28, borderRadius: RADIUS.lg, background: meta.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={14} color={meta.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.white }}>{a.name}{a.profileName ? ` · ${a.profileName}` : ""}</div>
                      <div style={{ fontSize: TYPE.caption, color: C.dimmed }}>{a.platform} · ID: {a.accountId || a.id || "?"}</div>
                    </div>
                    <Check size={14} color={C.green} />
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* API Debug Panel */}
          <div style={{ background: C.card, borderRadius: RADIUS.xxxl, border: `1px solid ${C.border}`, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600 }}>API-Diagnose</div>
              <div style={{ fontSize: TYPE.caption, color: C.dimmed, background: C.bg, padding: "3px 10px", borderRadius: RADIUS.md }}>Für Fehlerbehebung</div>
            </div>
            <div style={{ fontSize: TYPE.small, color: C.muted, marginBottom: 10 }}>Rohe API-Antwort von <span style={{ color: C.blue, fontWeight: 500 }}>/api/v1/accounts</span>:</div>
            <pre style={{ background: C.bg, borderRadius: RADIUS.xl, border: `1px solid ${C.border}`, padding: 14, fontSize: TYPE.caption, color: C.muted, overflow: "auto", maxHeight: 300, whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.6, margin: 0 }}>
              {debugInfo ? JSON.stringify(debugInfo, null, 2) : "Wird geladen..."}
            </pre>
          </div>

          {/* ── Error Log Panel ──────────────────────────────── */}
          <div style={{ background: C.card, borderRadius: RADIUS.xxxl, border: `1px solid ${C.border}`, padding: 20, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
                <AlertCircle size={16} color={C.redLight} />
                <div style={{ fontSize: TYPE.bodyLg, fontWeight: 600 }}>Fehler-Protokoll</div>
                {errorLog.length > 0 && (
                  <div style={{ fontSize: TYPE.caption, fontWeight: 600, color: "#fff", background: C.red, padding: `${SPACE.xxs}px ${SPACE.md}px`, borderRadius: RADIUS.xl }}>{errorLog.length}</div>
                )}
              </div>
              {errorLog.length > 0 && (
                <button onClick={clearErrorLog} style={{ display: "flex", alignItems: "center", gap: SPACE.sm, padding: "5px 12px", borderRadius: RADIUS.lg, background: C.bg, border: `1px solid ${C.border}`, color: C.muted, fontSize: TYPE.caption, cursor: "pointer", fontFamily: "inherit" }}>
                  <Trash2 size={11} /> Alle löschen
                </button>
              )}
            </div>
            <div style={{ fontSize: TYPE.small, color: C.muted, marginBottom: 12 }}>Alle API-Fehler werden hier protokolliert und bleiben gespeichert.</div>

            {errorLog.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: C.dimmed, fontSize: TYPE.body }}>
                <Check size={20} style={{ marginBottom: 6, opacity: 0.5 }} /><br />
                Keine Fehler vorhanden
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: SPACE.md, maxHeight: 400, overflowY: "auto" }}>
                {errorLog.map((entry) => {
                  const isExpanded = expandedError === entry.id;
                  const ts = new Date(entry.timestamp);
                  const timeStr = `${ts.toLocaleDateString("de-DE")} · ${ts.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`;
                  return (
                    <div key={entry.id} style={{ background: C.bg, borderRadius: RADIUS.xl, border: `1px solid ${isExpanded ? C.red + "40" : C.border}`, overflow: "hidden", transition: "border-color 0.2s" }}>
                      <div onClick={() => setExpandedError(isExpanded ? null : entry.id)} style={{ display: "flex", alignItems: "center", gap: SPACE.lg, padding: "10px 14px", cursor: "pointer" }}>
                        <div style={{ width: 6, height: 6, borderRadius: RADIUS.sm, background: C.redLight, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: TYPE.small, fontWeight: 500, color: C.white, marginBottom: 2 }}>{entry.action}</div>
                          <div style={{ fontSize: TYPE.caption, color: C.redLight, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.error}</div>
                        </div>
                        <div style={{ fontSize: TYPE.micro, color: C.dimmed, whiteSpace: "nowrap", flexShrink: 0 }}>{timeStr}</div>
                        <ChevronDown size={14} color={C.dimmed} style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} />
                      </div>
                      {isExpanded && (
                        <div style={{ padding: "0 14px 12px", borderTop: `1px solid ${C.border}` }}>
                          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px", padding: `${SPACE.lg}px 0`, fontSize: TYPE.caption }}>
                            <span style={{ color: C.dimmed, fontWeight: 500 }}>Aktion:</span>
                            <span style={{ color: C.white }}>{entry.action}</span>
                            <span style={{ color: C.dimmed, fontWeight: 500 }}>Fehler:</span>
                            <span style={{ color: C.redLight }}>{entry.error}</span>
                            {entry.platforms && <>
                              <span style={{ color: C.dimmed, fontWeight: 500 }}>Plattformen:</span>
                              <span style={{ color: C.white }}>{entry.platforms.join(", ")}</span>
                            </>}
                            {entry.content && <>
                              <span style={{ color: C.dimmed, fontWeight: 500 }}>Inhalt:</span>
                              <span style={{ color: C.muted }}>{entry.content}...</span>
                            </>}
                            {entry.scheduledFor && <>
                              <span style={{ color: C.dimmed, fontWeight: 500 }}>Geplant für:</span>
                              <span style={{ color: C.white }}>{entry.scheduledFor}</span>
                            </>}
                            {entry.postTitle && <>
                              <span style={{ color: C.dimmed, fontWeight: 500 }}>Beitrag:</span>
                              <span style={{ color: C.white }}>{entry.postTitle}</span>
                            </>}
                            {entry.mediaCount > 0 && <>
                              <span style={{ color: C.dimmed, fontWeight: 500 }}>Medien:</span>
                              <span style={{ color: C.white }}>{entry.mediaCount} Datei(en)</span>
                            </>}
                            <span style={{ color: C.dimmed, fontWeight: 500 }}>Zeitpunkt:</span>
                            <span style={{ color: C.white }}>{ts.toLocaleString("de-DE")}</span>
                          </div>
                          {entry.response && (
                            <div>
                              <div style={{ fontSize: TYPE.caption, color: C.dimmed, fontWeight: 500, marginBottom: 4 }}>API-Antwort:</div>
                              <pre style={{ background: C.card, borderRadius: RADIUS.lg, border: `1px solid ${C.border}`, padding: 10, fontSize: TYPE.micro, color: C.muted, overflow: "auto", maxHeight: 180, whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.5, margin: 0 }}>
                                {JSON.stringify(entry.response, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dashboard / Posts Tab */}
      {activeTab === "dashboard" && (<>

      <div style={{ padding: "24px 32px 0" }}>
        {/* Zernio-style Posts header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: TYPE.h2, fontWeight: 700, letterSpacing: "-0.02em", color: C.white }}>Posts</div>
            <div style={{ fontSize: TYPE.body, color: C.muted, marginTop: 2 }}>Verwalte deine geplanten und veröffentlichten Posts</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
            <button onClick={() => { setCreateModalInitialDate(""); setShowCreateModal(true); }} style={{ display: "flex", alignItems: "center", gap: SPACE.sm, background: `linear-gradient(135deg, ${C.ctaLight}, ${C.cta})`, border: "none", borderRadius: RADIUS.pill, padding: "9px 20px", color: "#fff", fontSize: TYPE.body, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 20px ${C.ctaGlow}` }}>
              <Plus size={15} /> Post erstellen
            </button>
          </div>
        </div>

        {/* ── Zernio-Filterleiste ── */}
        <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, marginBottom: 20, flexWrap: "wrap" }}>
          <FilterDropdown
            label="Alle Posts" value={statusFilter} onChange={setStatusFilter} width={180}
            options={[
              { key: "all", label: "Alle Posts" },
              { key: "draft", label: "Entwurf" },
              { key: "scheduled", label: "Geplant" },
              { key: "queued", label: "Warteschlange" },
              { key: "published", label: "Veröffentlicht" },
              { key: "failed", label: "Fehlgeschlagen" },
              { key: "partial", label: "Teilweise" },
            ]} />

          <FilterDropdown
            label="Alle Plattformen" value={platformFilter2} onChange={setPlatformFilter2} width={200}
            options={[
              { key: "all", label: "Alle Plattformen" },
              { key: "tiktok", label: "TikTok", icon: TikTokIcon, color: C.tiktok },
              { key: "instagram", label: "Instagram", icon: Instagram, color: C.instagram },
              { key: "facebook", label: "Facebook", icon: Facebook },
              { key: "youtube", label: "YouTube", icon: Youtube },
              { key: "linkedin", label: "LinkedIn", icon: Linkedin },
            ]} />

          <FilterDropdown
            label="Alle Profile" value={profileFilter} onChange={setProfileFilter} searchable width={200}
            options={[
              { key: "all", label: "Alle Profile" },
              ...profileOptions.map((p) => ({ key: p, label: p, dot: C.accent })),
            ]} />

          <FilterDropdown
            label="Alle Nutzer" value={userFilter} onChange={setUserFilter} width={180}
            options={[
              { key: "all", label: "Alle Nutzer" },
              ...userOptions.map((u) => ({ key: u, label: u })),
            ]} />

          <FilterDropdown
            label="Alle Termine" value={dateFilter} onChange={setDateFilter} icon={Calendar} width={180}
            options={[
              { key: "all", label: "Alle Termine" },
              { key: "today", label: "Heute" },
              { key: "tomorrow", label: "Morgen" },
              { key: "this_week", label: "Diese Woche" },
              { key: "next_week", label: "Nächste Woche" },
              { key: "this_month", label: "Diesen Monat" },
            ]} />

          <div style={{ display: "flex", alignItems: "center", gap: SPACE.md, background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: `${SPACE.md}px ${SPACE.xl}px` }}>
            <Search size={14} color={C.dimmed} />
            <input type="text" placeholder="Suchen..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: C.white, fontSize: TYPE.body, width: 110, fontFamily: "inherit" }} />
          </div>

          {/* Rechte Seite: Sortierung, Ansicht, Spaltenanzahl */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: SPACE.md }}>
            <button onClick={() => { fetchAccounts(); fetchPosts(); }} title="Aktualisieren" style={{ width: 34, height: 34, borderRadius: RADIUS.lg, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <RefreshCw size={14} color={C.muted} style={isLoading ? { animation: "spin 1s linear infinite" } : {}} />
            </button>

            <FilterDropdown
              label="Geplant (neu)" value={sortBy} onChange={setSortBy} icon={ArrowUpDown} width={330} align="right"
              options={[
                { key: "scheduled_desc", label: "Geplant (neueste zuerst)" },
                { key: "scheduled_asc", label: "Geplant (älteste zuerst)" },
                { key: "created_desc", label: "Erstellt (neueste zuerst)" },
                { key: "created_asc", label: "Erstellt (älteste zuerst)" },
                { key: "status", label: "Status" },
                { key: "platform", label: "Plattform" },
                { key: "_div", label: "Nach Kennzahl · nur veröffentlicht", divider: true },
                { key: "engagement", label: "Meistes Engagement (Likes+Kommentare+Shares+Gespeichert)" },
                { key: "likes", label: "Meiste Likes" },
                { key: "comments", label: "Meiste Kommentare" },
                { key: "shares", label: "Meiste Shares" },
                { key: "views", label: "Meiste Aufrufe" },
                { key: "impressions", label: "Meiste Impressionen" },
                { key: "reach", label: "Meiste Reichweite" },
                { key: "saves", label: "Meiste Speicherungen" },
                { key: "clicks", label: "Meiste Klicks" },
              ]} />

            {/* Ansichts-Umschalter */}
            <div style={{ display: "flex", background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: 3, gap: SPACE.xxs }}>
              {[
                { key: "grid", icon: LayoutGrid, title: "Kacheln" },
                { key: "list", icon: List, title: "Liste" },
                { key: "calendar", icon: Calendar, title: "Kalender" },
              ].map((v) => (
                <button key={v.key} onClick={() => v.key === "calendar" ? setActiveTab("calendar") : setViewMode(v.key)} title={v.title} style={{
                  width: 30, height: 26, borderRadius: RADIUS.md, border: "none", cursor: "pointer",
                  background: viewMode === v.key ? C.cardHover : "transparent",
                  color: viewMode === v.key ? C.white : C.dimmed,
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                }}>
                  <v.icon size={14} />
                </button>
              ))}
            </div>

            {/* Spaltenanzahl */}
            {viewMode === "grid" && (
              <div style={{ display: "flex", alignItems: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: RADIUS.lg, padding: 3, gap: SPACE.xxs }}>
                <button onClick={() => setGridCols(Math.max(2, gridCols - 1))} disabled={gridCols <= 2} style={{ width: 26, height: 26, borderRadius: RADIUS.md, border: "none", background: "transparent", color: gridCols <= 2 ? C.border : C.dimmed, cursor: gridCols <= 2 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Minus size={13} />
                </button>
                <span style={{ fontSize: TYPE.body, color: C.muted, minWidth: 14, textAlign: "center", fontWeight: 500 }}>{gridCols}</span>
                <button onClick={() => setGridCols(Math.min(6, gridCols + 1))} disabled={gridCols >= 6} style={{ width: 26, height: 26, borderRadius: RADIUS.md, border: "none", background: "transparent", color: gridCols >= 6 ? C.border : C.dimmed, cursor: gridCols >= 6 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Plus size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 32px 32px" }}>

        {/* Post Count */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: TYPE.small, color: C.dimmed }}>
            {filtered.length > 0 ? `${pageStart + 1}–${Math.min(pageStart + PER_PAGE, filtered.length)} von ${filtered.length}` : "Keine Posts"}
          </div>
        </div>

        {/* ── Zernio-style Post Cards ── */}
        <div className="post-card-grid" style={{
          display: "grid",
          gridTemplateColumns: viewMode === "list" ? "1fr" : `repeat(${gridCols}, minmax(0, 1fr))`,
          gap: SPACE.xxl, alignItems: "start",
        }}>
          {/* Karten haben eine feste Höhe, damit das Raster gleichmäßig bleibt */}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: 40, textAlign: "center", color: C.dimmed, fontSize: TYPE.bodyLg }}>Keine Beiträge gefunden.</div>
          )}
          {paged.map((post) => {
            const postPlats = post.platforms || [post.platform || "instagram"];
            const primaryColor = postPlats.includes("instagram") ? C.instagram : C.tiktok;
            const isSelected = selectedPost?.id === post.id;
            const statusConf = {
              published: { label: "Live", color: C.green },
              scheduled: { label: "Geplant", color: C.blue },
              queued: { label: "Warteschlange", color: C.purple },
              draft: { label: "Entwurf", color: C.dimmed },
              failed: { label: "Fehler", color: C.redLight },
              partial: { label: "Teilweise", color: C.yellow },
            };
            const sc = statusConf[post.status] || statusConf.draft;
            const pid = String(post.id);
            const shortId = pid.length > 8 ? pid.substring(0, 7) + "…" : pid;

            // Metriken – nur anzeigen, was tatsächlich Werte hat
            const metrics = [
              { key: "likes", label: "Likes", icon: Heart, value: post.likes },
              { key: "comments", label: "Kommentare", icon: MessageCircle, value: post.comments },
              { key: "shares", label: "Geteilt", icon: Share2, value: post.shares },
              { key: "views", label: "Aufrufe", icon: Eye, value: post.views },
              { key: "reach", label: "Reichweite", icon: UsersRound, value: post.reach },
              { key: "saves", label: "Gespeichert", icon: Bookmark, value: post.saves },
              { key: "clicks", label: "Klicks", icon: MousePointerClick, value: post.clicks },
            ].filter((m) => m.value > 0);

            const fmtNum = (n) => n >= 1000 ? (n / 1000).toFixed(1).replace(".0", "") + "K" : String(n);

            return (
              <div key={post.id}>
              {/* ── Card ── */}
              <div className="glass-panel" onClick={() => setSelectedPost(isSelected ? null : post)}
                style={{
                  background: C.glass, border: `1px solid ${isSelected ? primaryColor + "60" : C.glassBorder}`,
                  borderRadius: RADIUS.xxl, boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
                  cursor: "pointer", transition: "border-color 0.15s, background 0.15s", overflow: "hidden",
                  height: 186, display: "flex", flexDirection: "column",
                }}
                onMouseOver={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = C.dimmed + "60"; e.currentTarget.style.background = C.glassHover; } }}
                onMouseOut={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = C.glassBorder; e.currentTarget.style.background = C.glass; } }}>

                {/* Kopfbereich: Text links, Thumbnail rechts */}
                <div style={{ display: "flex", gap: SPACE.xl, padding: 14, flex: 1, minHeight: 0 }}>
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                    {/* Titel – feste Höhe für 2 Zeilen */}
                    <div style={{ fontSize: TYPE.body, fontWeight: 500, color: C.white, lineHeight: 1.45, height: 36, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 10 }}>
                      {post.title}
                    </div>

                    {/* Plattform-Icons */}
                    <div style={{ display: "flex", gap: SPACE.md, marginBottom: 9, alignItems: "center", height: 15 }}>
                      {postPlats.map((plat) => {
                        const Icon = plat === "instagram" ? Instagram : plat === "tiktok" ? TikTokIcon : Globe;
                        const ic = plat === "instagram" ? C.instagram : plat === "tiktok" ? C.tiktok : C.muted;
                        const url = post.postUrls?.[plat];
                        return (
                          <div key={plat} style={{ position: "relative", display: "flex" }}>
                            <Icon size={15} color={ic} />
                            {url && <ExternalLink size={7} color={ic} style={{ position: "absolute", top: -2, right: -5 }} />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Datum + Uhrzeit */}
                    <div style={{ fontSize: TYPE.small, color: C.muted, marginBottom: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {new Date(post.date).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                      {", "}
                      {new Date(post.date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                    </div>

                    {/* User · Profil · Post-ID */}
                    <div style={{ fontSize: TYPE.caption, color: C.dimmed, display: "flex", gap: SPACE.sm, alignItems: "center", whiteSpace: "nowrap", overflow: "hidden" }}>
                      {post.createdBy && <span>{post.createdBy}</span>}
                      {post.profile && (
                        <>
                          <span style={{ color: C.border }}>·</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: SPACE.xs }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, display: "inline-block" }} />
                            {post.profile}
                          </span>
                        </>
                      )}
                      {(post.createdBy || post.profile) && <span style={{ color: C.border }}>·</span>}
                      <span
                        title={`Post ID: ${pid} (klicken zum Kopieren)`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard?.writeText(pid);
                          setCopiedId(pid);
                          setTimeout(() => setCopiedId(null), 1500);
                        }}
                        style={{ display: "inline-flex", alignItems: "center", gap: SPACE.xs, fontFamily: "monospace", cursor: "pointer", color: copiedId === pid ? C.green : C.dimmed }}>
                        {copiedId === pid ? "kopiert!" : shortId}
                        {copiedId === pid ? <Check size={9} /> : <Copy size={9} />}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail rechts – Bild, Video-Erstframe oder Platzhalter */}
                  <div style={{ position: "relative", width: 76, flexShrink: 0, alignSelf: "stretch", overflow: "hidden", background: C.bg }}>
                    {post.thumbnail ? (
                      <img src={post.thumbnail} alt="" loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    ) : post.videoUrl ? (
                      <video src={`${post.videoUrl}#t=0.1`} preload="metadata" muted playsInline
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${C.cardHover} 0%, ${C.bg} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileVideo size={20} color={C.dimmed} />
                      </div>
                    )}
                    {post.type === "Video" && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "8px solid #fff", marginLeft: 2 }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fußzeile: Status + Metriken */}
                <div style={{ display: "flex", alignItems: "center", gap: SPACE.lg, padding: "0 14px", height: 40, borderTop: `1px solid ${C.border}`, flexShrink: 0, overflow: "hidden" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", fontSize: TYPE.caption, fontWeight: 500, color: sc.color, background: sc.color + "18", padding: "3px 9px", borderRadius: RADIUS.md, flexShrink: 0 }}>
                    {sc.label}
                  </div>
                  {metrics.map((m) => (
                    <div key={m.key} title={m.label} style={{ display: "inline-flex", alignItems: "center", gap: SPACE.xs, fontSize: TYPE.caption, color: C.muted, flexShrink: 0 }}>
                      <m.icon size={11} />
                      {fmtNum(m.value)}
                    </div>
                  ))}
                  <div style={{ marginLeft: "auto", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.dimmed, fontSize: TYPE.label, letterSpacing: 1, flexShrink: 0 }}
                    onClick={(e) => { e.stopPropagation(); setSelectedPost(isSelected ? null : post); }}>
                    ⋮
                  </div>
                </div>
              </div>

              </div>
            );
          })}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: SPACE.xs, marginTop: 24 }}>
            <button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage === 1} style={{
              width: 30, height: 30, borderRadius: RADIUS.lg, background: "transparent", border: `1px solid ${C.border}`,
              color: safePage === 1 ? C.border : C.muted, cursor: safePage === 1 ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
              .map((n, idx, arr) => (
                <React.Fragment key={n}>
                  {idx > 0 && arr[idx - 1] !== n - 1 && <span style={{ color: C.dimmed, padding: "0 3px", fontSize: TYPE.small }}>…</span>}
                  <button onClick={() => setPage(n)} style={{
                    minWidth: 30, height: 30, padding: "0 8px", borderRadius: RADIUS.lg,
                    background: n === safePage ? C.cardHover : "transparent",
                    border: `1px solid ${n === safePage ? C.dimmed + "60" : "transparent"}`,
                    color: n === safePage ? C.white : C.muted, fontSize: TYPE.body,
                    fontWeight: n === safePage ? 600 : 500, cursor: "pointer", fontFamily: "inherit",
                  }}>{n}</button>
                </React.Fragment>
              ))}
            <button onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage === totalPages} style={{
              width: 30, height: 30, borderRadius: RADIUS.lg, background: "transparent", border: `1px solid ${C.border}`,
              color: safePage === totalPages ? C.border : C.muted, cursor: safePage === totalPages ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {!isConnected && (
          <div style={{ marginTop: 32, padding: 24, background: C.card, borderRadius: RADIUS.xxxl, border: `1px solid ${C.border}`, display: "flex", gap: SPACE.xxl, alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: RADIUS.xxl, background: C.blueGlow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><BarChart3 size={22} color={C.blue} /></div>
            <div>
              <div style={{ fontSize: TYPE.label, fontWeight: 600, color: C.white, marginBottom: 8 }}>Zernio API verbinden – 3 Schritte</div>
              <div style={{ fontSize: TYPE.body, color: C.muted, lineHeight: 1.8 }}>
                <span style={{ color: C.blue, fontWeight: 600 }}>1.</span> Erstelle einen Account auf <span style={{ color: C.blue, fontWeight: 500 }}>zernio.com</span> und verbinde Instagram + TikTok<br />
                <span style={{ color: C.blue, fontWeight: 600 }}>2.</span> Kopiere deinen API-Key unter Einstellungen → API<br />
                <span style={{ color: C.blue, fontWeight: 600 }}>3.</span> Füge ihn als <span style={{ color: C.green, fontWeight: 500 }}>LATE_API_KEY</span> in deine Vercel-Umgebungsvariablen ein und deploye erneut
              </div>
            </div>
          </div>
        )}
      </div>

      </>)}
      {/* End of tab content */}

      </div>
      {/* End of main content wrapper */}

      {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreatePost} isSubmitting={isSubmitting} accounts={accounts} initialDate={createModalInitialDate} />}

      {selectedPost && (
        <PostDetailPanel
          post={selectedPost}
          isConnected={isConnected}
          onClose={() => setSelectedPost(null)}
          onHide={(post) => {
            hidePost(post.id);
            setPosts((prev) => prev.filter((p) => p.id !== post.id));
            showNotif("Beitrag vom Dashboard entfernt", "red");
          }}
          onDeleteRemote={async (post) => {
            try {
              const res = await fetch("/api/late", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete-post", postId: post.id }) });
              const data = await res.json();
              if (res.ok) {
                hidePost(post.id);
                setPosts((prev) => prev.filter((p) => p.id !== post.id));
                showNotif("Beitrag bei Zernio gelöscht", "green");
                return true;
              }
              showNotif(data.error || "Fehler beim Löschen", "red");
              addErrorLog({ action: "Beitrag löschen", error: data.error || "Unbekannter Fehler", postId: post.id, postTitle: post.title, response: data });
              return false;
            } catch (err) {
              showNotif("Verbindungsfehler: " + err.message, "red");
              addErrorLog({ action: "Beitrag löschen", error: `Netzwerkfehler: ${err.message}`, postId: post.id, postTitle: post.title });
              return false;
            }
          }}
        />
      )}
      </div>
      {/* End of app-shell */}
    </div>
  );
}
