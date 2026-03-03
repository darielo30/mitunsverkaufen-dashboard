"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Check, Eye, Heart, MessageCircle, Share2, Instagram,
  TrendingUp, TrendingDown, Calendar, ChevronDown, Plus, BarChart3,
  Users, Search, X, Clock, Send, Loader2,
  RefreshCw, Wifi, WifiOff, Upload, FileVideo, Trash2, ChevronLeft, ChevronRight,
  Globe, SkipForward, SkipBack, Scissors,
  LayoutDashboard, Bell, Settings, UserPlus, AlertCircle, XCircle, UsersRound, Shield, ExternalLink,
  Sun, Moon
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

// ── Brand Colors ────────────────────────────────────────────────
const darkTheme = {
  bg: "#0B0F19", bgSoft: "#0F1320", card: "#131825", cardHover: "#1A2035",
  border: "#1E2A3A", red: "#DC2626", redGlow: "rgba(220,38,38,0.12)",
  redLight: "#EF4444", green: "#22C55E", greenGlow: "rgba(34,197,94,0.12)",
  blue: "#3B82F6", blueGlow: "rgba(59,130,246,0.12)", purple: "#8B5CF6",
  purpleGlow: "rgba(139,92,246,0.12)", yellow: "#EAB308",
  yellowGlow: "rgba(234,179,8,0.12)", white: "#F9FAFB", muted: "#9CA3AF",
  dimmed: "#6B7280", instagram: "#E1306C", tiktok: "#00F2EA",
};
const lightTheme = {
  bg: "#F3F4F6", bgSoft: "#E5E7EB", card: "#FFFFFF", cardHover: "#F9FAFB",
  border: "#D1D5DB", red: "#DC2626", redGlow: "rgba(220,38,38,0.08)",
  redLight: "#EF4444", green: "#16A34A", greenGlow: "rgba(22,163,74,0.08)",
  blue: "#2563EB", blueGlow: "rgba(37,99,235,0.08)", purple: "#7C3AED",
  purpleGlow: "rgba(124,58,237,0.08)", yellow: "#CA8A04",
  yellowGlow: "rgba(202,138,4,0.08)", white: "#111827", muted: "#6B7280",
  dimmed: "#9CA3AF", instagram: "#E1306C", tiktok: "#00B8A9",
};
let C = darkTheme;

// ── TikTok Icon (original logo style, outline) ─────────────────
function TikTokIcon({ size = 24, color = "#00F2EA" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const fmt = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
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
    <div style={{ background: C.card, borderRadius: 16, padding: "20px 24px", border: `1px solid ${C.border}`, flex: 1, minWidth: 170, transition: "all 0.25s", cursor: "default" }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 24px ${glowColor}`; }}
      onMouseOut={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: glowColor, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={20} color={color} /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: isUp ? C.green : C.redLight, fontWeight: 600 }}>{isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}{isUp ? "+" : ""}{change}%</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: C.white, letterSpacing: "-0.03em" }}>{value}</div>
      <div style={{ fontSize: 13, color: C.muted, marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1A2035", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 8, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (<div key={i} style={{ fontSize: 13, color: p.color, fontWeight: 600, marginBottom: 2 }}>{p.name}: {fmt(p.value)}</div>))}
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
  return (<div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: c.color, background: c.bg, padding: "3px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, ...(isLive ? { animation: "livePulse 2s ease-in-out infinite" } : {}) }} />{c.label}</div>);
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
      <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${open ? C.red : C.border}`, borderRadius: 10, padding: "8px 14px", color: C.white, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
        <Calendar size={15} color={C.muted} /> {MONTHS_DE[selectedMonth]} {selectedYear} <ChevronDown size={13} color={C.muted} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, width: 280, boxShadow: "0 12px 40px rgba(0,0,0,0.5)", zIndex: 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button onClick={() => setYear(year - 1)} style={{ width: 30, height: 30, borderRadius: 8, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronLeft size={16} color={C.muted} /></button>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{year}</div>
            <button onClick={() => setYear(year + 1)} style={{ width: 30, height: 30, borderRadius: 8, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ChevronRight size={16} color={C.muted} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {SHORT_MONTHS.map((m, i) => {
              const isSelected = i === selectedMonth && year === selectedYear;
              return (
                <button key={m} onClick={() => { onSelect(i, year); setOpen(false); }} style={{
                  padding: "8px 4px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: isSelected ? 700 : 500,
                  background: isSelected ? C.red : "transparent", color: isSelected ? "#fff" : C.muted,
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
        display: "flex", alignItems: "center", gap: 6, background: C.bg, border: `1px solid ${open ? C.red : C.border}`,
        borderRadius: 8, padding: "8px 12px", color: C.white, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
        transition: "all 0.2s", minWidth: 180,
      }}>
        <Globe size={14} color={C.muted} />
        <span style={{ flex: 1, textAlign: "left" }}>{selected.label}</span>
        <ChevronDown size={12} color={C.muted} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", bottom: "100%", left: 0, marginBottom: 6, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 6, width: 260, maxHeight: 240, overflowY: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", zIndex: 70 }}>
          {TIMEZONES.map((tz) => (
            <button key={tz.value} onClick={() => { onChange(tz.value); setOpen(false); }} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 12px",
              borderRadius: 8, border: "none", background: value === tz.value ? C.redGlow : "transparent",
              color: value === tz.value ? C.red : C.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              fontWeight: value === tz.value ? 600 : 400, transition: "all 0.15s",
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
      <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <Scissors size={14} /> Thumbnail wählen
      </div>

      <div style={{ background: C.bg, borderRadius: 10, padding: 12, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.dimmed, marginBottom: 8 }}>Video durchscrubben und Frame auswählen:</div>
        <video
          ref={videoRef}
          src={videoUrlRef.current}
          style={{ width: "100%", maxHeight: 220, borderRadius: 8, background: "#000", display: "block" }}
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <button onClick={stepBack}
            style={{ width: 30, height: 30, borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <SkipBack size={13} color={C.muted} />
          </button>

          <input type="range" min={0} max={duration || 1} step={0.05} value={sliderValue}
            onMouseDown={handleSliderStart}
            onTouchStart={handleSliderStart}
            onChange={handleSliderChange}
            onMouseUp={handleSliderEnd}
            onTouchEnd={handleSliderEnd}
            style={{ flex: 1, accentColor: C.red, cursor: "pointer" }} />

          <button onClick={stepForward}
            style={{ width: 30, height: 30, borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <SkipForward size={13} color={C.muted} />
          </button>

          <span style={{ fontSize: 12, color: C.dimmed, fontVariantNumeric: "tabular-nums", minWidth: 48, textAlign: "center" }}>
            {formatTime(sliderValue)}
          </span>

          <button onClick={captureFrame} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 8,
            background: C.red, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", boxShadow: `0 2px 8px ${C.redGlow}`, flexShrink: 0,
          }}>
            <Scissors size={13} /> Frame wählen
          </button>
        </div>

        {/* Selected frame preview */}
        {selectedFrame && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, padding: "8px 10px", background: C.redGlow, borderRadius: 8, border: `1px solid ${C.red}30` }}>
            <img src={selectedFrame.dataUrl} alt="Gewähltes Thumbnail" style={{ width: 72, height: "auto", borderRadius: 6, objectFit: "cover", border: `1px solid ${C.border}` }} />
            <div>
              <div style={{ fontSize: 12, color: C.red, fontWeight: 700 }}>Thumbnail ausgewählt</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Frame bei {formatTime(selectedFrame.time)}</div>
            </div>
            <Check size={16} color={C.red} style={{ marginLeft: "auto" }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Content Type Definitions ─────────────────────────────────────
const CONTENT_TYPES = [
  { key: "reel", label: "Reel", desc: "Kurzvideos bis 90 Sek.", icon: "🎬", needsVideo: true },
  { key: "carousel", label: "Carousel", desc: "Bis zu 10 Bilder/Videos", icon: "🖼️", needsVideo: false },
  { key: "story", label: "Story", desc: "24h sichtbar, vertikal", icon: "📱", needsVideo: false },
  { key: "feed", label: "Feed Post", desc: "Klassischer Beitrag", icon: "📸", needsVideo: false },
];

// ── Create Post Modal with Media Upload + Thumbnail + Timezone ──
function CreatePostModal({ onClose, onSubmit, isSubmitting, accounts, initialDate }) {
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState({ instagram: true, tiktok: true });
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
  const [collabs, setCollabs] = useState([""]);
  const fileInputRef = useRef(null);
  const thumbInputRef = useRef(null);

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

  const handleSubmit = () => {
    if (!content.trim()) return;
    const selectedPlatforms = Object.entries(platforms).filter(([, v]) => v).map(([k]) => k);
    if (selectedPlatforms.length === 0) return;

    let scheduledFor = null;
    if (!postNow && scheduleDate && scheduleTime) {
      scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    }

    const mediaItems = mediaFiles.filter((f) => f.url && f.url !== "local").map((f) => ({ type: f.type, url: f.url }));
    const cleanCollabs = collabs.map((c) => c.trim().replace(/^@/, "")).filter(Boolean);

    const platformsPayload = selectedPlatforms.map((p) => {
      const account = accounts.find((a) => a.platform === p);
      const entry = { platform: p, accountId: account?.id || account?.accountId || undefined };

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

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, width: 640, maxWidth: "92vw", maxHeight: "92vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }} onClick={(e) => e.stopPropagation()}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.white }}>Neuer Beitrag</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} color={C.muted} /></button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Platform Selection */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Plattformen</div>
            <div style={{ display: "flex", gap: 10 }}>
              {[{ key: "instagram", label: "Instagram", icon: Instagram, color: C.instagram }, { key: "tiktok", label: "TikTok", icon: TikTokIcon, color: C.tiktok }].map((p) => {
                const account = accounts.find((a) => a.platform === p.key);
                return (
                  <div key={p.key} style={{ position: "relative" }}>
                    <button onClick={() => setPlatforms({ ...platforms, [p.key]: !platforms[p.key] })} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10,
                      border: `1.5px solid ${platforms[p.key] ? p.color : C.border}`,
                      background: platforms[p.key] ? p.color + "15" : "transparent",
                      color: platforms[p.key] ? p.color : C.dimmed,
                      fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                      opacity: account ? 1 : 0.5,
                    }}>
                      <p.icon size={16} />{p.label}
                      {account && platforms[p.key] && <Check size={14} />}
                      {!account && (
                        <span title={`${p.label}-Account nicht verbunden`}
                          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: C.yellowGlow, color: C.yellow, fontSize: 11, fontWeight: 800, cursor: "help" }}>!</span>
                      )}
                    </button>
                    {!account && platforms[p.key] && (
                      <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, background: C.card, border: `1px solid ${C.yellow}40`, borderRadius: 10, padding: "8px 12px", width: 240, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 10 }}>
                        <div style={{ fontSize: 12, color: C.yellow, fontWeight: 600, marginBottom: 4 }}>{p.label}-Account nicht verbunden</div>
                        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>Verbinde deinen {p.label}-Account in deinem Late Dashboard unter Settings.</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {accounts.length === 0 && (
              <div style={{ fontSize: 12, color: C.yellow, marginTop: 6, lineHeight: 1.5 }}>Keine Accounts verbunden. Verbinde Instagram/TikTok unter getlate.dev → Settings.</div>
            )}
          </div>

          {/* Content Type Selection – 2 per row */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Content-Typ</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {CONTENT_TYPES.map((ct) => {
                const isActive = contentType === ct.key;
                const isDisabled = (ct.needsVideo && hasOnlyImages) || (ct.key === "carousel" && hasVideo) || (ct.key === "story" && hasVideo && mediaFiles.length > 1);
                return (
                  <button key={ct.key} onClick={() => { if (!isDisabled) setContentType(ct.key); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12,
                      border: `1.5px solid ${isActive ? C.red : isDisabled ? C.border + "60" : C.border}`,
                      background: isActive ? C.redGlow : "transparent",
                      opacity: isDisabled ? 0.35 : 1,
                      cursor: isDisabled ? "not-allowed" : "pointer", transition: "all 0.2s", fontFamily: "inherit", textAlign: "left",
                    }}>
                    <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{ct.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? C.red : isDisabled ? C.dimmed : C.white }}>{ct.label}</div>
                      <div style={{ fontSize: 11, color: isDisabled ? C.dimmed + "80" : C.dimmed, marginTop: 2, lineHeight: 1.4 }}>{ct.desc}</div>
                    </div>
                    {isActive && <Check size={14} color={C.red} style={{ marginLeft: "auto", flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
            {contentType === "reel" && (
              <div style={{ fontSize: 11, color: C.blue, marginTop: 8, padding: "6px 10px", background: C.blueGlow, borderRadius: 8, lineHeight: 1.5 }}>
                💡 Tipp: Videos werden standardmäßig als Reels und auf dem Feed angezeigt, um maximale Reichweite zu gewähren.
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Beitragstext</div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Was möchtet ihr posten? Schreibt euren Text hier..." rows={4}
              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, color: C.white, fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = C.red} onBlur={(e) => e.target.style.borderColor = C.border} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <div style={{ fontSize: 12, color: content.length > 2200 ? C.redLight : C.dimmed }}>{content.length} / 2.200</div>
            </div>
          </div>

          {/* Collab Partners */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Collab Partner</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {collabs.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: C.dimmed, fontWeight: 600, pointerEvents: "none" }}>@</span>
                    <input type="text" value={c} onChange={(e) => updateCollab(i, e.target.value)}
                      placeholder="username"
                      style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px 8px 26px", color: C.white, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                      onFocus={(e) => e.target.style.borderColor = C.red} onBlur={(e) => e.target.style.borderColor = C.border} />
                  </div>
                  {(collabs.length > 1 || c.trim()) && (
                    <button onClick={() => removeCollab(i)} style={{ width: 28, height: 28, borderRadius: 6, background: "transparent", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                      <X size={12} color={C.dimmed} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Medien</div>
            <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm" multiple
              style={{ display: "none" }} onChange={(e) => handleFiles(Array.from(e.target.files))} />

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(Array.from(e.dataTransfer.files)); }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? C.red : C.border}`, borderRadius: 12, padding: "24px 16px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer",
                background: isDragging ? C.redGlow : "transparent", transition: "all 0.2s",
              }}>
              <Upload size={24} color={isDragging ? C.red : C.dimmed} />
              <div style={{ fontSize: 13, fontWeight: 600, color: isDragging ? C.red : C.muted }}>Bilder oder Videos hierher ziehen</div>
              <div style={{ fontSize: 12, color: C.dimmed }}>oder klicken zum Durchsuchen · JPG, PNG, MP4, MOV</div>
            </div>

            {mediaFiles.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                {mediaFiles.map((f) => (
                  <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 12, background: C.bg, borderRadius: 10, padding: "8px 12px", border: `1px solid ${C.border}` }}>
                    {f.preview ? (
                      <img src={f.preview} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: C.purpleGlow, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileVideo size={18} color={C.purple} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: C.dimmed }}>{fmtSize(f.size)} · {f.type === "video" ? "Video" : "Bild"}{f.uploading ? " · Wird hochgeladen..." : ""}</div>
                    </div>
                    {f.uploading && <Loader2 size={16} color={C.muted} style={{ animation: "spin 1s linear infinite" }} />}
                    {f.url === "local" && <div style={{ fontSize: 10, color: C.yellow, fontWeight: 600, padding: "2px 6px", background: C.yellowGlow, borderRadius: 4 }}>Lokal</div>}
                    {f.url && f.url !== "local" && <Check size={16} color={C.green} />}
                    <button onClick={(e) => { e.stopPropagation(); removeFile(f.name); }} style={{ width: 28, height: 28, borderRadius: 6, background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Trash2 size={14} color={C.dimmed} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Thumbnail Options for Video */}
            {videoFile && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <Scissors size={14} /> Thumbnail
                </div>
                {/* Mode Toggle */}
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <button onClick={() => setThumbnailMode("scrub")} style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8,
                    border: `1px solid ${thumbnailMode === "scrub" ? C.red : C.border}`,
                    background: thumbnailMode === "scrub" ? C.redGlow : "transparent",
                    color: thumbnailMode === "scrub" ? C.red : C.dimmed, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}><Scissors size={12} /> Frame aus Video</button>
                  <button onClick={() => { setThumbnailMode("upload"); }} style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8,
                    border: `1px solid ${thumbnailMode === "upload" ? C.red : C.border}`,
                    background: thumbnailMode === "upload" ? C.redGlow : "transparent",
                    color: thumbnailMode === "upload" ? C.red : C.dimmed, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}><Upload size={12} /> Eigenes Bild</button>
                </div>

                {thumbnailMode === "scrub" && (
                  <ThumbnailPicker videoFile={videoFile} onSelect={setThumbnailTimestamp} selectedTimestamp={thumbnailTimestamp} />
                )}

                {thumbnailMode === "upload" && (
                  <div style={{ background: C.bg, borderRadius: 10, padding: 12, border: `1px solid ${C.border}` }}>
                    <input type="file" ref={thumbInputRef} accept="image/jpeg,image/png,image/webp"
                      style={{ display: "none" }} onChange={handleThumbnailUpload} />
                    {!customThumbnail ? (
                      <div onClick={() => thumbInputRef.current?.click()}
                        style={{ border: `2px dashed ${C.border}`, borderRadius: 10, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                        <Upload size={20} color={C.dimmed} />
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Thumbnail-Bild hochladen</div>
                        <div style={{ fontSize: 11, color: C.dimmed }}>JPG, PNG oder WebP</div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src={customThumbnail.preview} alt="Thumbnail" style={{ width: 80, height: "auto", borderRadius: 8, border: `1px solid ${C.border}` }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>Thumbnail hochgeladen</div>
                          <div style={{ fontSize: 11, color: C.dimmed, marginTop: 2 }}>{customThumbnail.name}</div>
                        </div>
                        <button onClick={() => { setCustomThumbnail(null); }} style={{ width: 28, height: 28, borderRadius: 6, background: "transparent", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
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
            <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Zeitplanung</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <button onClick={() => setPostNow(true)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
                border: `1px solid ${postNow ? C.green : C.border}`, background: postNow ? C.greenGlow : "transparent",
                color: postNow ? C.green : C.dimmed, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              }}><Send size={14} /> Sofort posten</button>
              <button onClick={() => setPostNow(false)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
                border: `1px solid ${!postNow ? C.blue : C.border}`, background: !postNow ? C.blueGlow : "transparent",
                color: !postNow ? C.blue : C.dimmed, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              }}><Clock size={14} /> Planen</button>
            </div>
            {!postNow && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                    style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.white, fontSize: 13, fontFamily: "inherit", outline: "none", colorScheme: "dark" }} />
                  <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)}
                    style={{ width: 120, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.white, fontSize: 13, fontFamily: "inherit", outline: "none", colorScheme: "dark" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 12, color: C.dimmed, fontWeight: 500 }}>Zeitzone:</div>
                  <TimezonePicker value={timezone} onChange={setTimezone} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: `1px solid ${C.border}` }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
          <button onClick={handleSubmit} disabled={isSubmitting || !content.trim()} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 10,
            background: !content.trim() ? C.border : C.red, border: "none",
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: !content.trim() ? "not-allowed" : "pointer",
            fontFamily: "inherit", boxShadow: content.trim() ? `0 4px 16px ${C.redGlow}` : "none", opacity: isSubmitting ? 0.7 : 1,
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
function Sidebar({ activeTab, onTabChange, unreadCount, isDarkMode, onToggleTheme }) {
  const tabs = [
    { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { key: "calendar", icon: Calendar, label: "Kalender" },
    { key: "notifications", icon: Bell, label: "Benachrichtigungen", badge: unreadCount },
    { key: "analytics", icon: BarChart3, label: "Analytics" },
    { key: "settings", icon: Settings, label: "Einstellungen" },
  ];

  return (
    <div style={{
      width: 64, minHeight: "100vh", background: C.card, borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16, gap: 4,
      position: "fixed", left: 0, top: 0, zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.red}, #991B1B)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff", marginBottom: 20, boxShadow: `0 4px 12px ${C.redGlow}` }}>M</div>

      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button key={tab.key} onClick={() => onTabChange(tab.key)} title={tab.label}
            style={{
              width: 44, height: 44, borderRadius: 12, border: "none", display: "flex", alignItems: "center", justifyContent: "center",
              background: isActive ? C.redGlow : "transparent", cursor: "pointer", transition: "all 0.2s", position: "relative",
            }}
            onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = C.bg; }}
            onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
            <tab.icon size={20} color={isActive ? C.red : C.dimmed} />
            {tab.badge > 0 && (
              <div style={{
                position: "absolute", top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 9,
                background: C.red, color: "#fff", fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
                boxShadow: `0 2px 8px ${C.redGlow}`,
              }}>{tab.badge > 99 ? "99+" : tab.badge}</div>
            )}
          </button>
        );
      })}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Theme Toggle */}
      <button onClick={onToggleTheme} title={isDarkMode ? "Light Mode" : "Dark Mode"}
        style={{
          width: 40, height: 40, borderRadius: 12, border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isDarkMode ? C.bg : C.cardHover, cursor: "pointer",
          transition: "all 0.3s", marginBottom: 16,
        }}
        onMouseOver={(e) => { e.currentTarget.style.background = isDarkMode ? C.cardHover : C.border; }}
        onMouseOut={(e) => { e.currentTarget.style.background = isDarkMode ? C.bg : C.cardHover; }}>
        {isDarkMode ? <Sun size={18} color={C.yellow} /> : <Moon size={18} color="#6366F1" />}
      </button>
    </div>
  );
}

// ── Notification Panel ──────────────────────────────────────────
function NotificationPanel({ notifications, onMarkAllRead, isConnected }) {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [apiComments, setApiComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Fetch real comments from Late Inbox API
  useEffect(() => {
    if (!isConnected) return;
    const fetchComments = async () => {
      setLoadingComments(true);
      setApiError(null);
      try {
        const url = platformFilter !== "all"
          ? `/api/late?action=inbox-comments&platform=${platformFilter}`
          : `/api/late?action=inbox-comments`;
        const res = await fetch(url);
        const data = await res.json();
        if (data._raw) {
          const comments = Array.isArray(data._raw) ? data._raw : (data._raw.comments || data._raw.data || []);
          const mapped = comments.map((c, i) => ({
            id: c.id || `api-${i}`,
            type: "comment",
            user: c.author?.username || c.author?.name || c.username || "Unbekannt",
            text: `hat kommentiert: "${(c.text || c.content || c.message || "").substring(0, 80)}"`,
            post: c.postTitle || c.post?.content?.substring(0, 40) || null,
            time: c.createdAt ? new Date(c.createdAt).toLocaleString("de-DE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "",
            read: c.read || false,
            platform: (c.platform || "instagram").toLowerCase(),
            isApi: true,
          }));
          setApiComments(mapped);
        }
      } catch (err) {
        setApiError(err.message);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [isConnected, platformFilter]);

  // Merge API comments with demo notifications (demo as fallback)
  const allNotifs = apiComments.length > 0 ? apiComments : notifications;
  const filtered = platformFilter === "all" ? allNotifs : allNotifs.filter((n) => n.platform === platformFilter);
  const unread = filtered.filter((n) => !n.read);
  const isDemo = apiComments.length === 0;

  const getIcon = (type) => {
    if (type === "like") return { icon: Heart, color: C.redLight, bg: C.redGlow };
    if (type === "comment") return { icon: MessageCircle, color: C.blue, bg: C.blueGlow };
    if (type === "follow") return { icon: UserPlus, color: C.green, bg: C.greenGlow };
    return { icon: Bell, color: C.muted, bg: C.border };
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 800, margin: "0 auto" }}>
      {/* Demo hint */}
      {isDemo && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, background: C.yellowGlow, border: `1px solid ${C.yellow}30`, marginBottom: 20 }}>
          <AlertCircle size={14} color={C.yellow} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: C.yellow }}>Demo-Modus – Echte Benachrichtigungen werden angezeigt, sobald die Late API Interaktionsdaten liefert.</div>
        </div>
      )}

      {apiError && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, background: C.redGlow, border: `1px solid ${C.redLight}30`, marginBottom: 20 }}>
          <XCircle size={14} color={C.redLight} style={{ flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: C.redLight }}>API-Fehler: {apiError}</div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>Benachrichtigungen</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{unread.length} ungelesen{loadingComments ? " · Wird geladen..." : ""}</div>
        </div>
        {unread.length > 0 && (
          <button onClick={onMarkAllRead} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8,
            background: C.card, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13,
            fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}>
            <Check size={14} /> Alle gelesen
          </button>
        )}
      </div>

      {/* Platform Filter Buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { key: "all", label: "Alle", icon: null, color: C.red },
          { key: "instagram", label: "Instagram", icon: Instagram, color: C.instagram },
          { key: "tiktok", label: "TikTok", icon: TikTokIcon, color: C.tiktok },
        ].map((f) => {
          const active = platformFilter === f.key;
          return (
            <button key={f.key} onClick={() => setPlatformFilter(f.key)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10,
              border: `1.5px solid ${active ? f.color : C.border}`,
              background: active ? f.color + "15" : "transparent",
              color: active ? f.color : C.dimmed, fontSize: 13, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
            }}>
              {f.icon && <f.icon size={14} />}
              {f.label}
              {active && <Check size={13} />}
            </button>
          );
        })}
      </div>

      {/* Unread section */}
      {unread.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Neu</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {unread.map((n) => {
              const { icon: Icon, color, bg } = getIcon(n.type);
              const pc = n.platform === "instagram" ? C.instagram : C.tiktok;
              return (
                <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, background: C.card, border: `1px solid ${color}25`, cursor: "default", transition: "all 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.background = C.cardHover}
                  onMouseOut={(e) => e.currentTarget.style.background = C.card}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: C.white, lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 700 }}>{n.user}</span>{" "}
                      <span style={{ color: C.muted }}>{n.text}</span>
                    </div>
                    {n.post && <div style={{ fontSize: 12, color: C.dimmed, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.post}</div>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: C.dimmed }}>{n.time}</div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: pc }} />
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.red, flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Read section */}
      {filtered.filter((n) => n.read).length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Früher</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {filtered.filter((n) => n.read).map((n) => {
              const { icon: Icon, color, bg } = getIcon(n.type);
              const pc = n.platform === "instagram" ? C.instagram : C.tiktok;
              return (
                <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12, background: "transparent", cursor: "default", transition: "all 0.2s", opacity: 0.7 }}
                  onMouseOver={(e) => { e.currentTarget.style.background = C.card; e.currentTarget.style.opacity = "1"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.opacity = "0.7"; }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 600, color: C.white }}>{n.user}</span>{" "}{n.text}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: C.dimmed }}>{n.time}</div>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: pc }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && !loadingComments && (
        <div style={{ padding: 40, textAlign: "center", color: C.dimmed, fontSize: 14 }}>Keine Benachrichtigungen für diesen Filter.</div>
      )}
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
          <div style={{ fontSize: 22, fontWeight: 800, color: C.white }}>Content-Kalender</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Alle Beiträge auf einen Blick</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}
            style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: C.card, border: `1px solid ${C.border}`, cursor: "pointer", color: C.muted, fontSize: 18 }}>
            <ChevronLeft size={18} />
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.white, minWidth: 160, textAlign: "center" }}>
            {MONTHS_DE[calMonth]} {calYear}
          </div>
          <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }}
            style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: C.card, border: `1px solid ${C.border}`, cursor: "pointer", color: C.muted, fontSize: 18 }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {[{ label: "Live", color: C.green }, { label: "Geplant", color: C.yellow }, { label: "Entwurf", color: C.dimmed }, { label: "Fehler", color: C.redLight }].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />{l.label}
          </div>
        ))}
      </div>

      {/* Weekday headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, marginBottom: 1 }}>
        {WEEKDAYS.map((wd) => (
          <div key={wd} style={{ padding: "8px 0", textAlign: "center", fontSize: 11, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em" }}>{wd}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`e${i}`} style={{ minHeight: 100, background: C.bg, borderRadius: 8 }} />
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
                minHeight: 100, padding: 6, background: isHovered ? C.cardHover : C.card,
                borderRadius: 8, border: `1px solid ${isTodayCell ? C.red + "60" : C.border}`,
                transition: "all 0.15s", cursor: "default", position: "relative",
                display: "flex", flexDirection: "column",
              }}>
              {/* Day number */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: isTodayCell ? 800 : 600,
                  color: isTodayCell ? "#fff" : dayPosts.length > 0 ? C.white : C.dimmed,
                  background: isTodayCell ? C.red : "transparent",
                }}>
                  {day}
                </div>
                {/* Add button on hover */}
                {isHovered && onNewPost && (
                  <button onClick={() => onNewPost(new Date(calYear, calMonth, day))}
                    style={{ width: 20, height: 20, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", background: C.red + "20", border: "none", cursor: "pointer", color: C.red, fontSize: 14 }}>
                    <Plus size={12} />
                  </button>
                )}
              </div>

              {/* Posts for this day */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                {dayPosts.slice(0, 3).map((p) => {
                  const plats = p.platforms || [p.platform || "instagram"];
                  return (
                    <div key={p.id} onClick={() => onSelectPost && onSelectPost(p)}
                      style={{
                        padding: "3px 6px", borderRadius: 5, fontSize: 10, fontWeight: 600,
                        background: statusColor(p.status) + "15", color: statusColor(p.status),
                        cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        borderLeft: `3px solid ${statusColor(p.status)}`,
                        transition: "all 0.15s",
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = statusColor(p.status) + "30"; showTooltip(e, p); }}
                      onMouseOut={(e) => { e.currentTarget.style.background = statusColor(p.status) + "15"; hideTooltip(); }}>
                      <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
                        {plats.map((pl) => pl === "instagram" ? <Instagram key={pl} size={9} /> : <TikTokIcon key={pl} size={9} color={statusColor(p.status)} />)}
                      </span>{" "}
                      {p.title?.substring(0, 20) || "Post"}
                    </div>
                  );
                })}
                {dayPosts.length > 3 && (
                  <div style={{ fontSize: 9, color: C.dimmed, fontWeight: 600, paddingLeft: 6 }}>+{dayPosts.length - 3} mehr</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly stats summary */}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        {[
          { label: "Gesamt", count: Object.values(postsByDay).flat().length, color: C.white },
          { label: "Live", count: Object.values(postsByDay).flat().filter((p) => p.status === "published").length, color: C.green },
          { label: "Geplant", count: Object.values(postsByDay).flat().filter((p) => p.status === "scheduled").length, color: C.yellow },
          { label: "Entwurf", count: Object.values(postsByDay).flat().filter((p) => p.status === "draft").length, color: C.dimmed },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, padding: "14px 16px", background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
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
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: "12px 16px", minWidth: 200, zIndex: 9999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)", pointerEvents: "none",
            animation: "fadeIn 0.15s ease",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>
              {tp.title || "Post"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {rows.map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 11 }}>
                  <span style={{ color: C.dimmed, fontWeight: 600 }}>{r.label}</span>
                  <span style={{ color: r.color || C.muted, fontWeight: 600, textAlign: "right" }}>{r.value}</span>
                </div>
              ))}
            </div>
            {tPlats.length > 0 && (
              <div style={{ display: "flex", gap: 6, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                {tPlats.map((pl) => pl === "instagram"
                  ? <Instagram key={pl} size={13} color={C.instagram} />
                  : <TikTokIcon key={pl} size={13} color={C.tiktok} />
                )}
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
    owner: { label: "Inhaber", color: C.red, bg: C.redGlow },
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
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>Team</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{members.length} Mitglied{members.length !== 1 ? "er" : ""}</div>
        </div>
        <button onClick={() => setShowInvite(!showInvite)} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10,
          background: C.red, border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 16px ${C.redGlow}`,
        }}>
          <UserPlus size={15} /> Einladen
        </button>
      </div>

      {/* Invite Form */}
      {showInvite && (
        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.red}30`, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Teammitglied einladen</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="E-Mail-Adresse eingeben..."
              style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.white, fontSize: 13, fontFamily: "inherit", outline: "none" }}
              onFocus={(e) => e.target.style.borderColor = C.red} onBlur={(e) => e.target.style.borderColor = C.border}
              onKeyDown={(e) => { if (e.key === "Enter") handleInvite(); }}
            />
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
              style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", color: C.white, fontSize: 13, fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
              <option value="admin">Admin</option>
              <option value="editor">Redakteur</option>
              <option value="viewer">Betrachter</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleInvite} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, background: C.red, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              <Send size={13} /> Einladung senden
            </button>
            <button onClick={() => setShowInvite(false)} style={{ padding: "8px 16px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Role Legend */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.entries(roles).map(([key, r]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.dimmed }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} />
            <span style={{ color: r.color, fontWeight: 600 }}>{r.label}</span>
          </div>
        ))}
      </div>

      {/* Members List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {members.map((m) => {
          const r = roles[m.role] || roles.viewer;
          return (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, background: C.card, border: `1px solid ${C.border}`, transition: "all 0.2s" }}
              onMouseOver={(e) => { e.currentTarget.style.background = C.cardHover; e.currentTarget.style.borderColor = r.color + "40"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = C.card; e.currentTarget.style.borderColor = C.border; }}>
              {/* Avatar */}
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${r.color}, ${r.color}80)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                {m.avatar}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{m.name}</div>
                <div style={{ fontSize: 12, color: C.dimmed, marginTop: 2 }}>{m.email}</div>
              </div>
              {/* Role Badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: r.color, background: r.bg, padding: "4px 12px", borderRadius: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {m.role === "owner" ? <Shield size={12} /> : null}
                {r.label}
              </div>
              {/* Last Active */}
              <div style={{ fontSize: 12, color: m.lastActive === "Gerade aktiv" ? C.green : C.dimmed, fontWeight: 500, minWidth: 90, textAlign: "right" }}>
                {m.lastActive}
              </div>
              {/* Actions (not for owner) */}
              {m.role !== "owner" && (
                <div style={{ display: "flex", gap: 4 }}>
                  <select value={m.role} onChange={(e) => changeRole(m.id, e.target.value)}
                    style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", color: C.muted, fontSize: 11, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
                    <option value="admin">Admin</option>
                    <option value="editor">Redakteur</option>
                    <option value="viewer">Betrachter</option>
                  </select>
                  <button onClick={() => removeMemb(m.id)} title="Entfernen" style={{ width: 28, height: 28, borderRadius: 6, background: "transparent", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <X size={12} color={C.dimmed} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div style={{ marginTop: 24, padding: 16, background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <Shield size={14} color={C.muted} /> Rollen & Berechtigungen
        </div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
          <span style={{ color: C.red, fontWeight: 700 }}>Inhaber</span> – Voller Zugriff, kann Teammitglieder verwalten und das Dashboard konfigurieren<br />
          <span style={{ color: C.purple, fontWeight: 700 }}>Admin</span> – Kann Beiträge erstellen, planen und Statistiken einsehen<br />
          <span style={{ color: C.blue, fontWeight: 700 }}>Redakteur</span> – Kann Beiträge erstellen und planen<br />
          <span style={{ color: C.dimmed, fontWeight: 700 }}>Betrachter</span> – Kann nur das Dashboard und Statistiken einsehen
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
  // Theme state persisted in localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return true;
    try { return localStorage.getItem("theme") !== "light"; } catch { return true; }
  });
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState(demoNotifications);
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const showNotif = (text, color) => { setNotification({ text, color }); setTimeout(() => setNotification(null), 5000); };

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
        return {
          id: p._id || p.id || i + 1,
          platforms: plats,
          type: p.mediaItems?.some((m) => m.type === "video") ? "Video" : "Post",
          title: p.content?.substring(0, 60) + (p.content?.length > 60 ? "..." : "") || "Unbenannt",
          caption: p.content || "",
          date: p.scheduledFor || p.createdAt || new Date().toISOString(),
          views: p.analytics?.impressions || 0,
          likes: p.analytics?.likes || 0,
          comments: p.analytics?.comments || 0,
          shares: p.analytics?.shares || 0,
          done: p.status === "published",
          status: p.status || "draft",
          postUrls: Object.keys(urls).length > 0 ? urls : undefined,
          createdAt: p.createdAt || undefined,
          createdBy: p.createdBy || undefined,
          timezone: p.timezone || undefined,
        };
      };
      // Extract posts array from various possible response shapes
      const rawPosts = data._raw;
      const postsList = data.posts || (Array.isArray(rawPosts) ? rawPosts : rawPosts?.posts) || (Array.isArray(data) ? data : null);
      if (postsList && Array.isArray(postsList)) {
        const hidden = JSON.parse(localStorage.getItem("hiddenPostIds") || "[]");
        setPosts(postsList.map(mapPost).filter((p) => !hidden.includes(p.id)));
      }
    } catch {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAccounts(); fetchPosts(); }, [fetchAccounts, fetchPosts]);

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
    } finally { setIsSubmitting(false); setShowCreateModal(false); }
  };

  const toggle = (id) => setPosts(posts.map((p) => p.id === id ? { ...p, done: !p.done } : p));

  // Filter by month + search + platform/status
  const filtered = posts.filter((p) => {
    const d = new Date(p.date);
    const matchesMonth = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    const pPlats = p.platforms || [p.platform || "instagram"];
    const matchesFilter = filter === "all" ? true : filter === "instagram" ? pPlats.includes("instagram") : filter === "tiktok" ? pPlats.includes("tiktok") : filter === "offen" ? (!p.done && p.status !== "failed") : filter === "erledigt" ? p.done : filter === "failed" ? p.status === "failed" : true;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMonth && matchesFilter && matchesSearch;
  });

  const totalViews = filtered.reduce((a, p) => a + p.views, 0);
  const totalLikes = filtered.reduce((a, p) => a + p.likes, 0);
  const totalComments = filtered.reduce((a, p) => a + p.comments, 0);
  const totalShares = filtered.reduce((a, p) => a + p.shares, 0);
  const MONTHLY_GOAL = 30;
  const doneCount = filtered.filter((p) => p.done).length;
  const progress = Math.min(100, Math.round((filtered.length / MONTHLY_GOAL) * 100));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white, display: "flex" }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } } @keyframes livePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }`}</style>

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} unreadCount={unreadCount} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: 64 }}>

      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 200, background: C.card, border: `1px solid ${notification.color === "green" ? C.green : notification.color === "red" ? C.redLight : C.yellow}`, borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", maxWidth: 480 }}>
          {notification.color === "red" ? <XCircle size={16} color={C.redLight} style={{ flexShrink: 0 }} /> :
           <div style={{ width: 8, height: 8, borderRadius: "50%", background: notification.color === "green" ? C.green : C.yellow, flexShrink: 0 }} />}
          <span style={{ fontSize: 13, fontWeight: 600, color: notification.color === "red" ? C.redLight : C.white }}>{notification.text}</span>
        </div>
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

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <NotificationPanel notifications={notifications} onMarkAllRead={markAllRead} isConnected={isConnected} />
      )}

      {/* Analytics Tab (Placeholder) */}
      {activeTab === "analytics" && (
        <div style={{ padding: "28px 32px", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Analytics</div>
          <div style={{ fontSize: 13, color: C.muted }}>Detaillierte Statistiken kommen bald – hier werden Reichweite, Engagement-Rate und Follower-Wachstum angezeigt.</div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div style={{ padding: "28px 32px", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Einstellungen</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>API-Verbindung, Team-Zugang und Benachrichtigungseinstellungen.</div>

          {/* API Status */}
          <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Late API Status</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 16 }}>
              {isConnected ? <Wifi size={14} color={C.green} /> : <WifiOff size={14} color={C.yellow} />}
              <span style={{ color: isConnected ? C.green : C.yellow, fontWeight: 600 }}>{isConnected ? `Verbunden · ${accounts.length} Account${accounts.length !== 1 ? "s" : ""}` : "Nicht verbunden – Demo-Modus"}</span>
              <button onClick={() => { fetchAccounts(); fetchPosts(); }} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                <RefreshCw size={12} /> Neu laden
              </button>
            </div>

            {/* Connected Accounts List */}
            {accounts.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Verbundene Accounts</div>
                {accounts.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, marginBottom: 6 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: a.platform === "instagram" ? C.instagram + "20" : C.tiktok + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {a.platform === "instagram" ? <Instagram size={14} color={C.instagram} /> : <TikTokIcon size={14} color={C.tiktok} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: C.dimmed }}>{a.platform} · ID: {a.accountId || a.id || "?"}</div>
                    </div>
                    <Check size={14} color={C.green} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* API Debug Panel */}
          <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>API Debug</div>
              <div style={{ fontSize: 11, color: C.dimmed, background: C.bg, padding: "3px 10px", borderRadius: 6 }}>Für Fehlerbehebung</div>
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Rohe API-Antwort von <span style={{ color: C.blue, fontWeight: 600 }}>/api/v1/accounts</span>:</div>
            <pre style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, padding: 14, fontSize: 11, color: C.muted, overflow: "auto", maxHeight: 300, whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.6, margin: 0 }}>
              {debugInfo ? JSON.stringify(debugInfo, null, 2) : "Wird geladen..."}
            </pre>
          </div>
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (<>

      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: "rgba(11,15,25,0.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: "#FFFFFF" }}>mitunsverkaufen.de</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
              Social Media Dashboard
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: isConnected ? C.green : C.yellow, fontWeight: 600 }}>
                {isConnected ? <Wifi size={11} /> : <WifiOff size={11} />} {isConnected ? `Late API · ${accounts.length} Account${accounts.length !== 1 ? "s" : ""}` : "Demo-Modus"}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 14px", width: 220 }}>
            <Search size={16} color={C.dimmed} />
            <input type="text" placeholder="Beiträge suchen..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: C.white, fontSize: 13, width: "100%", fontFamily: "inherit" }} />
          </div>
          <button onClick={() => { fetchAccounts(); fetchPosts(); }} title="Daten aktualisieren" style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: C.card, border: `1px solid ${C.border}`, cursor: "pointer" }}>
            <RefreshCw size={16} color={C.muted} style={isLoading ? { animation: "spin 1s linear infinite" } : {}} />
          </button>
          <MonthPicker selectedMonth={selectedMonth} selectedYear={selectedYear} onSelect={(m, y) => { setSelectedMonth(m); setSelectedYear(y); }} />
          <button onClick={() => { setCreateModalInitialDate(""); setShowCreateModal(true); }} style={{ display: "flex", alignItems: "center", gap: 6, background: C.red, border: "none", borderRadius: 10, padding: "8px 18px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: `0 4px 16px ${C.redGlow}` }}>
            <Plus size={15} /> Neuer Beitrag
          </button>
        </div>
      </header>

      <div style={{ padding: "28px 32px", maxWidth: 1440, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          <StatCard icon={Eye} label="Views" value={fmt(totalViews)} change={18.2} color={C.yellow} glowColor={C.yellowGlow} />
          <StatCard icon={Heart} label="Likes" value={fmt(totalLikes)} change={12.5} color={C.redLight} glowColor={C.redGlow} />
          <StatCard icon={MessageCircle} label="Kommentare" value={fmt(totalComments)} change={24.1} color={C.blue} glowColor={C.blueGlow} />
          <StatCard icon={Share2} label="Shares" value={fmt(totalShares)} change={31.4} color={C.green} glowColor={C.greenGlow} />
          <StatCard icon={Users} label="Monatsziel" value={`${filtered.length}/${MONTHLY_GOAL}`} change={progress} color={C.purple} glowColor={C.purpleGlow} />
        </div>

        <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: 400, background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div><div style={{ fontSize: 16, fontWeight: 700 }}>Performance Trend</div><div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Letzte 6 Monate</div></div>
              <div style={{ display: "flex", gap: 16 }}>
                {[{ color: C.yellow, label: "Views" }, { color: C.redLight, label: "Likes" }, { color: C.blue, label: "Kommentare" }].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} /><span style={{ fontSize: 12, color: C.muted }}>{l.label}</span></div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={performance}>
                <defs>
                  <linearGradient id="vG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.yellow} stopOpacity={0.25} /><stop offset="100%" stopColor={C.yellow} stopOpacity={0} /></linearGradient>
                  <linearGradient id="lG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.redLight} stopOpacity={0.25} /><stop offset="100%" stopColor={C.redLight} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} /><XAxis dataKey="month" stroke={C.dimmed} fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke={C.dimmed} fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmt} /><Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="views" name="Views" stroke={C.yellow} strokeWidth={2.5} fill="url(#vG)" dot={false} />
                <Area type="monotone" dataKey="likes" name="Likes" stroke={C.redLight} strokeWidth={2.5} fill="url(#lG)" dot={false} />
                <Area type="monotone" dataKey="comments" name="Kommentare" stroke={C.blue} strokeWidth={2} fill="transparent" dot={false} strokeDasharray="5 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 1, minWidth: 280, background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Plattform-Vergleich</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Instagram vs. TikTok</div>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={(() => { const ig = filtered.filter(p => p.platform === "instagram"); const tt = filtered.filter(p => p.platform === "tiktok"); const sum = (a, k) => a.reduce((s, p) => s + p[k], 0); return [{ name: "Views", ig: sum(ig, "views"), tt: sum(tt, "views") }, { name: "Likes", ig: sum(ig, "likes"), tt: sum(tt, "likes") }, { name: "Komm.", ig: sum(ig, "comments"), tt: sum(tt, "comments") }, { name: "Shares", ig: sum(ig, "shares"), tt: sum(tt, "shares") }]; })()} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} /><XAxis dataKey="name" stroke={C.dimmed} fontSize={11} tickLine={false} axisLine={false} /><YAxis stroke={C.dimmed} fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmt} /><Tooltip content={<ChartTooltip />} />
                <Bar dataKey="ig" name="Instagram" fill={C.instagram} radius={[6, 6, 0, 0]} /><Bar dataKey="tt" name="TikTok" fill={C.tiktok} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: "14px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>Monatsziel</div>
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: C.border, overflow: "hidden" }}><div style={{ height: "100%", width: `${progress}%`, borderRadius: 4, background: `linear-gradient(90deg, ${C.red}, ${C.redLight})`, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)" }} /></div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.red, whiteSpace: "nowrap" }}>{filtered.length}/{MONTHLY_GOAL}</div>
          <div style={{ fontSize: 13, color: C.muted, whiteSpace: "nowrap" }}>{doneCount} erledigt · {MONTHLY_GOAL - filtered.length > 0 ? `${MONTHLY_GOAL - filtered.length} fehlen` : "Ziel erreicht!"}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {[{ key: "all", label: "Alle", count: filtered.length }, { key: "instagram", label: "Instagram", icon: Instagram, color: C.instagram, count: filtered.filter(p => p.platform === "instagram").length }, { key: "tiktok", label: "TikTok", icon: TikTokIcon, color: C.tiktok, count: filtered.filter(p => p.platform === "tiktok").length }, { key: "offen", label: "Offen", count: filtered.filter(p => !p.done && p.status !== "failed").length }, { key: "erledigt", label: "Erledigt", count: filtered.filter(p => p.done).length }, { key: "failed", label: "Fehler", icon: AlertCircle, color: C.redLight, count: filtered.filter(p => p.status === "failed").length }].filter(f => f.key !== "failed" || f.count > 0).map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: `1px solid ${filter === f.key ? (f.color || C.red) : C.border}`, background: filter === f.key ? (f.color ? f.color + "15" : C.redGlow) : "transparent", color: filter === f.key ? (f.color || C.red) : C.muted, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}>
              {f.icon && <f.icon size={14} />} {f.label} <span style={{ background: filter === f.key ? (f.color || C.red) + "30" : C.border, padding: "1px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: filter === f.key ? (f.color || C.red) : C.dimmed }}>{f.count}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 20px", fontSize: 11, fontWeight: 600, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <div style={{ width: 28 }} /><div style={{ width: 68 }} /><div style={{ flex: 1 }}>Beitrag</div><div style={{ width: 80 }}>Status</div><div style={{ width: 70, textAlign: "right" }}>Views</div><div style={{ width: 60, textAlign: "right" }}>Likes</div><div style={{ width: 60, textAlign: "right" }}>Komm.</div><div style={{ width: 60, textAlign: "right" }}>Shares</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: C.dimmed, fontSize: 14 }}>Keine Beiträge für {MONTHS_DE[selectedMonth]} {selectedYear} gefunden.</div>
          )}
          {filtered.map((post) => {
            const postPlats = post.platforms || [post.platform || "instagram"];
            const primaryColor = postPlats.includes("instagram") ? C.instagram : C.tiktok;
            const isSelected = selectedPost?.id === post.id;
            return (
              <div key={post.id}>
              <div onClick={() => setSelectedPost(isSelected ? null : post)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", borderRadius: isSelected ? "12px 12px 0 0" : 12, background: isSelected ? C.cardHover : C.card, border: `1px solid ${isSelected ? primaryColor + "60" : C.border}`, borderBottom: isSelected ? `1px solid ${C.border}` : undefined, cursor: "pointer", transition: "all 0.2s", opacity: post.done ? 0.6 : 1 }}
                onMouseOver={(e) => { if (!isSelected) { e.currentTarget.style.background = C.cardHover; e.currentTarget.style.borderColor = primaryColor + "40"; } }}
                onMouseOut={(e) => { if (!isSelected) { e.currentTarget.style.background = C.card; e.currentTarget.style.borderColor = C.border; } }}>
                {/* Checkbox – only toggles done, does NOT open detail */}
                <div onClick={(e) => { e.stopPropagation(); toggle(post.id); }} style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, border: post.done ? "none" : `2px solid ${C.border}`, background: post.done ? `linear-gradient(135deg, ${C.red}, #991B1B)` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: post.done ? `0 2px 8px ${C.redGlow}` : "none", cursor: "pointer" }}
                  onMouseOver={(e) => { if (!post.done) e.currentTarget.style.borderColor = C.red; }}
                  onMouseOut={(e) => { if (!post.done) e.currentTarget.style.borderColor = C.border; }}>
                  {post.done && <Check size={14} color="#fff" strokeWidth={3} />}
                </div>
                {/* Platform icons – show all platforms */}
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {postPlats.map((plat) => {
                    const ic = plat === "instagram" ? C.instagram : C.tiktok;
                    const Icon = plat === "instagram" ? Instagram : TikTokIcon;
                    return <div key={plat} style={{ width: 32, height: 32, borderRadius: 8, background: ic + "15", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={15} color={ic} /></div>;
                  })}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</div>
                  {post.status === "scheduled" ? (
                    <div style={{ fontSize: 11, color: C.yellow, marginTop: 3, lineHeight: 1.5, fontWeight: 500 }}>
                      Geplant: {new Date(post.date).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}, {new Date(post.date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} {post.timezone || "CET"}
                      {post.createdAt && <> – erstellt: {new Date(post.createdAt).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })}</>}
                      {post.createdBy && <> – von: {post.createdBy}</>}
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2, display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: primaryColor, fontWeight: 600 }}>{post.type}</span><span style={{ color: C.border }}>·</span><span>{new Date(post.date).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}</span></div>
                  )}
                </div>
                <div style={{ width: 80 }}><StatusBadge status={post.status} /></div>
                <div style={{ width: 70, textAlign: "right", fontSize: 13, fontWeight: 700, color: post.views > 0 ? C.white : C.dimmed }}>{post.views > 0 ? fmt(post.views) : "–"}</div>
                <div style={{ width: 60, textAlign: "right", fontSize: 13, fontWeight: 600, color: post.likes > 0 ? C.redLight : C.dimmed }}>{post.likes > 0 ? fmt(post.likes) : "–"}</div>
                <div style={{ width: 60, textAlign: "right", fontSize: 13, fontWeight: 600, color: post.comments > 0 ? C.muted : C.dimmed }}>{post.comments > 0 ? fmt(post.comments) : "–"}</div>
                <div style={{ width: 60, textAlign: "right", fontSize: 13, fontWeight: 600, color: post.shares > 0 ? C.muted : C.dimmed }}>{post.shares > 0 ? fmt(post.shares) : "–"}</div>
              </div>

              {/* ── Post Detail Panel ── */}
              {isSelected && (
                <div style={{ background: C.card, border: `1px solid ${primaryColor}60`, borderTop: "none", borderRadius: "0 0 12px 12px", padding: "20px 24px", animation: "fadeIn 0.2s ease" }}>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {/* Left: Caption */}
                    <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Caption</div>
                      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word", background: C.bg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}`, maxHeight: 180, overflowY: "auto" }}>
                        {post.caption || post.title || "–"}
                      </div>
                    </div>
                    {/* Right: Info grid */}
                    <div style={{ flex: "0 0 320px", display: "flex", flexDirection: "column", gap: 12 }}>
                      {/* Status */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", width: 110, flexShrink: 0, paddingTop: 2 }}>Status</div>
                        <div style={{ flex: 1 }}><StatusBadge status={post.status} /></div>
                      </div>
                      {/* Content Type */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", width: 110, flexShrink: 0, paddingTop: 2 }}>Typ</div>
                        <div style={{ fontSize: 13, color: C.white, fontWeight: 600, flex: 1 }}>{post.type}</div>
                      </div>
                      {/* Platforms */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", width: 110, flexShrink: 0, paddingTop: 4 }}>Plattformen</div>
                        <div style={{ display: "flex", gap: 6, flex: 1, flexWrap: "wrap" }}>
                          {postPlats.map((plat) => {
                            const ic = plat === "instagram" ? C.instagram : C.tiktok;
                            const Icon = plat === "instagram" ? Instagram : TikTokIcon;
                            return <div key={plat} style={{ display: "flex", alignItems: "center", gap: 5, background: ic + "15", borderRadius: 6, padding: "4px 10px" }}><Icon size={13} color={ic} /><span style={{ fontSize: 12, color: ic, fontWeight: 600 }}>{plat === "instagram" ? "Instagram" : "TikTok"}</span></div>;
                          })}
                        </div>
                      </div>
                      {/* Scheduled / Published date */}
                      {(post.status === "scheduled" || post.status === "published") && (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", width: 110, flexShrink: 0, paddingTop: 2 }}>{post.status === "scheduled" ? "Geplant" : "Veröffentlicht"}</div>
                          <div style={{ fontSize: 13, color: post.status === "scheduled" ? C.yellow : C.green, fontWeight: 600, flex: 1 }}>
                            {new Date(post.date).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}{post.status === "scheduled" && <><br />{new Date(post.date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} {post.timezone || "CET"}</>}
                          </div>
                        </div>
                      )}
                      {/* Created date */}
                      {post.createdAt && (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", width: 110, flexShrink: 0, paddingTop: 2 }}>Erstellt</div>
                          <div style={{ fontSize: 13, color: C.muted, flex: 1 }}>{new Date(post.createdAt).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}{post.createdBy && <><br /><span style={{ color: C.white, fontWeight: 600 }}>von {post.createdBy}</span></>}</div>
                        </div>
                      )}
                      {/* Performance stats if published */}
                      {post.status === "published" && post.views > 0 && (
                        <div style={{ display: "flex", gap: 16, marginTop: 4, padding: "10px 14px", background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
                          <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{fmt(post.views)}</div><div style={{ fontSize: 10, color: C.yellow, fontWeight: 600 }}>Views</div></div>
                          <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, color: C.redLight }}>{fmt(post.likes)}</div><div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Likes</div></div>
                          <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{fmt(post.comments)}</div><div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Komm.</div></div>
                          <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{fmt(post.shares)}</div><div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Shares</div></div>
                        </div>
                      )}
                      {/* Link buttons for published */}
                      {post.status === "published" && (
                        <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                          {postPlats.map((plat) => {
                            const ic = plat === "instagram" ? C.instagram : C.tiktok;
                            const url = post.postUrls?.[plat] || (plat === "instagram" ? "https://www.instagram.com/mitunsverkaufen/" : "https://www.tiktok.com/@mitunsverkaufen");
                            return (
                              <button key={plat} onClick={(e) => { e.stopPropagation(); window.open(url, "_blank"); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: ic + "15", border: `1px solid ${ic}30`, color: ic, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                                onMouseOver={(e) => { e.currentTarget.style.background = ic + "25"; e.currentTarget.style.borderColor = ic; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = ic + "15"; e.currentTarget.style.borderColor = ic + "30"; }}>
                                <ExternalLink size={12} /> {plat === "instagram" ? "Instagram öffnen" : "TikTok öffnen"}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {/* Delete button */}
                      <div style={{ marginTop: 8 }}>
                        <button onClick={(e) => { e.stopPropagation(); if (window.confirm("Beitrag aus dem Dashboard entfernen? (Bleibt auf den Plattformen online)")) { hidePost(post.id); setPosts((prev) => prev.filter((p) => p.id !== post.id)); setSelectedPost(null); showNotif("Beitrag vom Dashboard entfernt", "red"); } }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: C.redGlow, border: `1px solid ${C.red}25`, color: C.redLight, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
                          onMouseOver={(e) => { e.currentTarget.style.background = C.red + "25"; e.currentTarget.style.borderColor = C.red; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = C.redGlow; e.currentTarget.style.borderColor = C.red + "25"; }}>
                          <Trash2 size={12} /> Vom Dashboard entfernen
                        </button>
                        <div style={{ fontSize: 10, color: C.dimmed, marginTop: 4 }}>Der Beitrag bleibt auf Instagram & TikTok online.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            );
          })}
        </div>

        {!isConnected && (
          <div style={{ marginTop: 32, padding: 24, background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.redGlow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><BarChart3 size={22} color={C.red} /></div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 8 }}>Late API verbinden – 3 Schritte</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
                <span style={{ color: C.red, fontWeight: 700 }}>1.</span> Erstelle einen Account auf <span style={{ color: C.blue, fontWeight: 600 }}>getlate.dev</span> und verbinde Instagram + TikTok<br />
                <span style={{ color: C.red, fontWeight: 700 }}>2.</span> Kopiere deinen API-Key unter Settings → API<br />
                <span style={{ color: C.red, fontWeight: 700 }}>3.</span> Füge ihn als <span style={{ color: C.green, fontWeight: 600 }}>LATE_API_KEY</span> in deinen Vercel Environment Variables ein und deploye erneut
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 48, paddingTop: 20, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 32 }}>
          <div style={{ fontSize: 12, color: C.dimmed }}>© 2026 mitunsverkaufen.de GmbH</div>
          <div style={{ fontSize: 12, color: C.dimmed }}>Powered by Late API · Built with Claude AI</div>
        </div>
      </div>

      </>)}
      {/* End of tab content */}

      </div>
      {/* End of main content wrapper */}

      {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreatePost} isSubmitting={isSubmitting} accounts={accounts} initialDate={createModalInitialDate} />}
    </div>
  );
}
