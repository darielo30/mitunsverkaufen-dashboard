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
  Bookmark, Copy, List, LayoutGrid, Minus, MousePointerClick, ArrowUpDown, Facebook, Youtube, Linkedin
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, LineChart, Line, ScatterChart, Scatter, Cell
} from "recharts";

// ── Brand Colors ────────────────────────────────────────────────
const darkTheme = {
  bg: "#121212", bgSoft: "#151515", card: "#171717", cardHover: "#1E1E1E",
  border: "#2A2A2A", red: "#DC2626", redGlow: "rgba(220,38,38,0.12)",
  redLight: "#EF4444", green: "#22C55E", greenGlow: "rgba(34,197,94,0.12)",
  blue: "#3B82F6", blueGlow: "rgba(59,130,246,0.12)", purple: "#8B5CF6",
  purpleGlow: "rgba(139,92,246,0.12)", yellow: "#EAB308",
  yellowGlow: "rgba(234,179,8,0.12)", white: "#F9FAFB", muted: "#8B8FA3",
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

  // Analytics-Spalten wie bei Zernio
  const cols = [
    { key: "likes", label: "Likes", icon: Heart, color: C.redLight },
    { key: "comments", label: "Comments", icon: MessageCircle, color: C.blue },
    { key: "shares", label: "Shares", icon: Share2, color: C.green },
    { key: "saves", label: "Saves", icon: Bookmark, color: C.yellow },
    { key: "clicks", label: "Clicks", icon: MousePointerClick, color: C.purple },
    { key: "views", label: "Views", icon: Eye, color: C.muted },
    { key: "follows", label: "Follows", icon: UserPlus, color: C.blue },
    { key: "impressions", label: "Impr.", icon: TrendingUp, color: C.green },
    { key: "reach", label: "Reach", icon: UsersRound, color: C.purple },
  ];

  const sum = (k) => plats.reduce((a, p) => a + (p.analytics?.[k] || 0), 0);
  // Engagement Rate = (Likes + Kommentare + Shares + Saves) / Impressions
  const er = (a) => {
    const base = a?.impressions || a?.views || 0;
    if (!base) return null;
    const eng = (a.likes || 0) + (a.comments || 0) + (a.shares || 0) + (a.saves || 0);
    return ((eng / base) * 100).toFixed(2) + "%";
  };
  const totalAnalytics = Object.fromEntries(cols.map((c) => [c.key, sum(c.key)]));
  const hasAnalytics = cols.some((c) => sum(c.key) > 0);

  const dash = (v) => (v > 0 ? v.toLocaleString("de-DE") : "–");
  const cell = { padding: "10px 12px", fontSize: 12, textAlign: "right", whiteSpace: "nowrap" };

  const headline = post.status === "published" ? "Published" : post.status === "scheduled" ? "Scheduled for" : "Created";
  const headlineDate = new Date(post.publishedAt || post.date).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
  const headlineTime = new Date(post.publishedAt || post.date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  return (
    <div onClick={close} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: visible ? "rgba(0,0,0,0.5)" : "transparent",
      backdropFilter: visible ? "blur(4px)" : "none",
      transition: "background 0.3s, backdrop-filter 0.3s",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: "50vw", minWidth: 520, maxWidth: 760,
        background: C.card, borderLeft: `1px solid ${C.border}`,
        boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
        display: "flex", flexDirection: "column",
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>

        {/* Kopfzeile */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, color: C.white, letterSpacing: "-0.02em" }}>Post Details</div>
            <div style={{ fontSize: 12.5, color: C.dimmed, marginTop: 3 }}>{headline} {headlineDate} um {headlineTime}</div>
          </div>
          <button onClick={close} style={{ width: 34, height: 34, borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.redLight; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
            <X size={17} />
          </button>
        </div>

        {/* Scrollbereich */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 28px" }}>

          {/* Content */}
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 10 }}>Content</div>
          <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
            {post.caption || post.title || "–"}
          </div>

          {/* Medien */}
          {(post.videoUrl || post.thumbnail) && (
            <div style={{ marginBottom: 16, borderRadius: 8, overflow: "hidden", background: C.bg, border: `1px solid ${C.border}`, width: "fit-content", maxWidth: "100%" }}>
              {post.videoUrl ? (
                <video src={post.videoUrl} controls preload="metadata" style={{ display: "block", maxWidth: 340, maxHeight: 260, background: "#000" }} />
              ) : (
                <img src={post.thumbnail} alt="" style={{ display: "block", maxWidth: 340, maxHeight: 260, objectFit: "contain" }} />
              )}
            </div>
          )}

          {/* Plattform-Zeilen */}
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 22 }}>
            {plats.map((pd, i) => {
              const m = meta(pd.platform);
              const stColor = statusColors[pd.status] || C.dimmed;
              return (
                <div key={pd.platform} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: C.bg, borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                  <m.Icon size={16} color={C.white} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{m.label}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: stColor, background: stColor + "18", padding: "2px 8px", borderRadius: 5 }}>{pd.status}</span>
                  <span style={{ fontSize: 12, color: C.dimmed }}>
                    {pd.publishedAt
                      ? new Date(pd.publishedAt).toLocaleString("de-DE", { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })
                      : new Date(post.date).toLocaleString("de-DE", { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {pd.url && (
                    <a href={pd.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                      style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: C.muted, textDecoration: "none" }}>
                      View <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Analytics */}
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 10 }}>Analytics</div>
          {hasAnalytics ? (
            <>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflowX: "auto", marginBottom: 14 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                  <thead>
                    <tr style={{ background: C.bg }}>
                      <th style={{ padding: "10px 12px", fontSize: 11.5, color: C.dimmed, fontWeight: 600, textAlign: "left", whiteSpace: "nowrap" }}>Platform</th>
                      {cols.map((c) => (
                        <th key={c.key} style={{ padding: "10px 12px", fontSize: 11.5, color: C.dimmed, fontWeight: 600, textAlign: "right", whiteSpace: "nowrap" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                            <c.icon size={12} color={c.color} /> {c.label}
                          </span>
                        </th>
                      ))}
                      <th style={{ padding: "10px 12px", fontSize: 11.5, color: C.dimmed, fontWeight: 600, textAlign: "right" }}>ER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plats.map((pd) => {
                      const m = meta(pd.platform);
                      return (
                        <tr key={pd.platform} style={{ borderTop: `1px solid ${C.border}` }}>
                          <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.white }}>
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
                      <td style={{ padding: "10px 12px", fontSize: 12.5, fontWeight: 700, color: C.white }}>Total</td>
                      {cols.map((c) => (
                        <td key={c.key} style={{ ...cell, fontWeight: 700, color: totalAnalytics[c.key] > 0 ? C.white : C.dimmed }}>
                          {dash(totalAnalytics[c.key])}
                        </td>
                      ))}
                      <td style={{ ...cell, fontWeight: 700, color: C.white }}>{er(totalAnalytics) || "–"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ padding: "14px 16px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12.5, color: C.dimmed, textAlign: "center", marginBottom: 20 }}>
                Nur ein Snapshot bisher – morgen gibt es Trendlinien.
              </div>
            </>
          ) : (
            <div style={{ padding: "18px 16px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12.5, color: C.dimmed, textAlign: "center", marginBottom: 20 }}>
              Noch keine Analytics für diesen Beitrag verfügbar.
            </div>
          )}

          {/* Aktionen */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 18, borderTop: `1px solid ${C.border}`, marginBottom: 16 }}>
            <button onClick={() => { if (window.confirm("Beitrag aus dem Dashboard entfernen?\n(Bleibt auf den Plattformen online)")) { onHide(post); close(); } }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: C.redGlow, border: `1px solid ${C.red}25`, color: C.redLight, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              <EyeOff size={12} /> Ausblenden
            </button>
            {isConnected && (post.status === "scheduled" || post.status === "draft") && (
              <button onClick={async () => {
                if (!window.confirm("Beitrag unwiderruflich bei Zernio löschen?\nDer Beitrag wird NICHT veröffentlicht.")) return;
                const ok = await onDeleteRemote(post);
                if (ok) close();
              }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: C.red + "15", border: `1px solid ${C.red}50`, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                <Trash2 size={12} /> Bei Zernio löschen
              </button>
            )}
          </div>

          {/* Post ID */}
          <div style={{ fontSize: 12, color: C.dimmed, fontFamily: "monospace", display: "flex", alignItems: "center", gap: 8 }}>
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
        display: "flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 8,
        border: `1px solid ${open ? C.dimmed : C.border}`, background: C.card,
        color: value && value !== "all" ? C.white : C.muted, fontSize: 12.5, fontWeight: 500,
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
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
          boxShadow: "0 12px 32px rgba(0,0,0,0.5)", padding: 5,
        }}>
          {searchable && (
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter..."
              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 10px", color: C.white, fontSize: 12, fontFamily: "inherit", outline: "none", marginBottom: 5, boxSizing: "border-box" }} />
          )}
          {shown.map((o) => (
            o.divider ? (
              <div key={o.key} style={{ fontSize: 9.5, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em", padding: "10px 10px 5px" }}>{o.label}</div>
            ) : (
              <button key={o.key} onClick={() => { onChange(o.key); setOpen(false); setQ(""); }} style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", borderRadius: 6,
                border: "none", background: o.key === value ? C.cardHover : "transparent",
                color: o.key === value ? C.white : C.muted, fontSize: 12.5,
                fontWeight: o.key === value ? 600 : 400, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
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
          {shown.length === 0 && <div style={{ padding: "10px", fontSize: 12, color: C.dimmed }}>Keine Treffer</div>}
        </div>
      )}
    </div>
  );
}

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
  const selectedPlatformKeys = Object.entries(platforms).filter(([, v]) => v).map(([k]) => k);
  const mediaUploading = isUploading || mediaFiles.some((f) => f.uploading);
  const readyMedia = mediaFiles.filter((f) => f.url && f.url !== "local");
  const hasMedia = readyMedia.length > 0;

  let blockReason = null;
  if (isSubmitting) blockReason = null;
  else if (!content.trim()) blockReason = "Caption fehlt";
  else if (selectedPlatformKeys.length === 0) blockReason = "Keine Plattform ausgewählt";
  else if (mediaUploading) blockReason = "Video wird noch hochgeladen…";
  else if (!hasMedia) blockReason = "Video oder Bild erforderlich";
  else if (!postNow && (!scheduleDate || !scheduleTime)) blockReason = "Datum & Uhrzeit fehlen";

  const canSubmit = !blockReason && !isSubmitting;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const selectedPlatforms = selectedPlatformKeys;

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

  const [panelVisible, setPanelVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setPanelVisible(true)); }, []);
  const handleClose = () => { setPanelVisible(false); setTimeout(onClose, 300); };

  return (
    <div style={{ position: "fixed", inset: 0, background: panelVisible ? "rgba(0,0,0,0.5)" : "transparent", backdropFilter: panelVisible ? "blur(4px)" : "none", zIndex: 100, transition: "background 0.3s, backdrop-filter 0.3s" }} onClick={handleClose}>
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: "50vw", minWidth: 520, maxWidth: 720,
        background: C.card, borderLeft: `1px solid ${C.border}`, boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
        display: "flex", flexDirection: "column", transform: panelVisible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }} onClick={(e) => e.stopPropagation()}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.white }}>Neuer Beitrag</div>
            <div style={{ fontSize: 12, color: C.dimmed, marginTop: 2 }}>Erstelle & veröffentliche Content</div>
          </div>
          <button onClick={handleClose} style={{ width: 32, height: 32, borderRadius: 8, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} color={C.muted} /></button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, flex: 1, overflowY: "auto" }}>

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
              <div style={{ fontSize: 12, color: C.yellow, marginTop: 6, lineHeight: 1.5 }}>Keine Accounts verbunden. Verbinde Instagram/TikTok unter zernio.com → Settings.</div>
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

          {/* Caption */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>Caption</div>
              <button onClick={() => setShowAiCaption(!showAiCaption)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8,
                background: showAiCaption ? C.purpleGlow : "transparent",
                border: `1px solid ${showAiCaption ? C.purple + "60" : C.border}`,
                color: showAiCaption ? C.purple : C.dimmed, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
              }}>
                <Sparkles size={13} /> Mit KI generieren
              </button>
            </div>

            {/* AI Caption Generator Dialog */}
            {showAiCaption && (
              <div style={{ background: C.bg, border: `1px solid ${C.purple}30`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Sparkles size={16} color={C.purple} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>Caption aus Transkript generieren</div>
                </div>
                <div style={{ fontSize: 11, color: C.dimmed, marginBottom: 10, lineHeight: 1.5 }}>
                  Kopiere das Transkript deines Reels hier rein. Es werden automatisch Captions für Instagram & TikTok generiert.
                </div>

                {!aiResults && (
                  <React.Fragment>
                    <textarea value={aiTranscript} onChange={(e) => setAiTranscript(e.target.value)}
                      placeholder="Transkript hier einfügen..." rows={5}
                      style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, color: C.white, fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box", marginBottom: 10 }}
                      onFocus={(e) => e.target.style.borderColor = C.purple} onBlur={(e) => e.target.style.borderColor = C.border} />

                    {/* Hashtag Toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <button onClick={() => setIncludeHashtags(!includeHashtags)} style={{
                        width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
                        background: includeHashtags ? C.purple : C.border, position: "relative", transition: "background 0.2s",
                      }}>
                        <div style={{ width: 16, height: 16, borderRadius: 8, background: "#fff", position: "absolute", top: 2, left: includeHashtags ? 18 : 2, transition: "left 0.2s" }} />
                      </button>
                      <span style={{ fontSize: 12, color: C.muted }}>Hashtags einfügen</span>
                    </div>
                  </React.Fragment>
                )}

                {aiError && (
                  <div style={{ fontSize: 12, color: C.redLight, marginBottom: 8, padding: "6px 10px", background: C.redGlow, borderRadius: 6 }}>{aiError}</div>
                )}

                {/* Results: Show both captions */}
                {aiResults && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
                    {[
                      { key: "instagram", label: "Instagram", icon: Instagram, color: C.instagram, text: aiResults.instagram, limit: "2.200" },
                      { key: "tiktok", label: "TikTok", icon: TikTokIcon, color: C.tiktok, text: aiResults.tiktok, limit: "4.000" },
                    ].map((p) => (
                      <div key={p.key} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <p.icon size={14} color={p.color} />
                            <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.label}</span>
                            <span style={{ fontSize: 10, color: C.dimmed }}>{p.text.length} / {p.limit} Zeichen</span>
                          </div>
                          <button onClick={() => selectAiCaption(p.text)} style={{
                            display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 6,
                            background: p.color + "15", border: `1px solid ${p.color}40`, color: p.color,
                            fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                          }}>
                            <Check size={11} /> Übernehmen
                          </button>
                        </div>
                        <div style={{ padding: 14, fontSize: 12, color: C.white, lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 180, overflowY: "auto" }}>
                          {p.text}
                        </div>
                      </div>
                    ))}
                    <button onClick={() => { setAiResults(null); }} style={{ padding: "6px 14px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.dimmed, fontSize: 12, cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start" }}>
                      Neu generieren
                    </button>
                  </div>
                )}

                {!aiResults && (
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => { setShowAiCaption(false); setAiTranscript(""); setAiError(null); setAiResults(null); }} style={{ padding: "7px 14px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.dimmed, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
                    <button onClick={generateCaption} disabled={aiGenerating || !aiTranscript.trim()} style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8,
                      background: !aiTranscript.trim() ? C.border : C.purple, border: "none",
                      color: "#fff", fontSize: 12, fontWeight: 700, cursor: !aiTranscript.trim() ? "not-allowed" : "pointer",
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
              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, color: C.white, fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }}
              onFocus={(e) => e.target.style.borderColor = C.red} onBlur={(e) => e.target.style.borderColor = C.border} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <div style={{ fontSize: 12, color: content.length > 2200 ? C.redLight : C.dimmed }}>{content.length} / 2.200</div>
            </div>
          </div>

          {/* Collab Partner */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Collab Partner</div>

            {/* Quick-select default partners */}
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {DEFAULT_PARTNERS.map((partner) => {
                const isActive = collabs.some((c) => c.trim().replace(/^@/, "") === partner);
                return (
                  <button key={partner} onClick={() => toggleDefaultPartner(partner)} style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20,
                    border: `1.5px solid ${isActive ? C.green : C.border}`,
                    background: isActive ? C.greenGlow : "transparent",
                    color: isActive ? C.green : C.dimmed, fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                  }}>
                    {isActive ? <Check size={12} /> : <Plus size={12} />}
                    @{partner}
                  </button>
                );
              })}
            </div>

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          {blockReason && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: "auto", fontSize: 12, color: mediaUploading ? C.muted : C.dimmed }}>
              {mediaUploading
                ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                : <AlertCircle size={13} />}
              {blockReason}
            </div>
          )}
          <button onClick={handleClose} style={{ padding: "10px 20px", borderRadius: 10, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
          <button onClick={handleSubmit} disabled={!canSubmit} title={blockReason || ""} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 10,
            background: canSubmit ? C.red : C.border, border: "none",
            color: canSubmit ? "#fff" : C.dimmed, fontSize: 13, fontWeight: 700,
            cursor: canSubmit ? "pointer" : "not-allowed",
            fontFamily: "inherit", boxShadow: canSubmit ? `0 4px 16px ${C.redGlow}` : "none",
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
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: C.white, display: "flex", alignItems: "center", gap: 10 }}>
            <Kanban size={22} color={C.red} /> Content-Pipeline
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Von der Idee bis zur Produktion – Karten per Drag & Drop verschieben</div>
        </div>
        <div style={{ fontSize: 12, color: C.dimmed, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px" }}>
          {cards.length} Karte{cards.length !== 1 ? "n" : ""} insgesamt
        </div>
      </div>

      {/* Board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignItems: "start" }}>
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
                background: C.bgSoft, borderRadius: 16, border: `1px solid ${isDragTarget ? color : C.border}`,
                borderTop: `3px solid ${color}`, minHeight: 320, display: "flex", flexDirection: "column",
                boxShadow: isDragTarget ? `0 0 24px ${glow}` : "none", transition: "border-color 0.2s, box-shadow 0.2s",
              }}>
              {/* Column header */}
              <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: glow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <col.icon size={15} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{col.label}</div>
                  <div style={{ fontSize: 10.5, color: C.dimmed, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{col.desc}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color, background: glow, padding: "2px 8px", borderRadius: 10, flexShrink: 0 }}>{colCards.length}</span>
              </div>

              {/* Cards */}
              <div style={{ padding: "4px 10px 10px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {colCards.length === 0 && !isDragTarget && (
                  <div style={{ border: `1.5px dashed ${C.border}`, borderRadius: 10, padding: "18px 12px", textAlign: "center", fontSize: 11.5, color: C.dimmed }}>
                    Noch keine Karten
                  </div>
                )}
                {isDragTarget && (
                  <div style={{ border: `1.5px dashed ${color}`, background: glow, borderRadius: 10, padding: "14px 12px", textAlign: "center", fontSize: 11.5, fontWeight: 600, color }}>
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
                        borderRadius: 10, padding: "10px 12px", cursor: isEditing ? "default" : "grab",
                        opacity: isDragging ? 0.4 : 1, transition: "opacity 0.15s, border-color 0.2s, box-shadow 0.2s",
                      }}
                      onMouseOver={(e) => { if (!isEditing) { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 16px ${glow}`; e.currentTarget.style.borderLeftColor = color; } }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderLeftColor = color; }}>
                      {isEditing ? (
                        <div>
                          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus
                            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingId(null); }}
                            style={{ width: "100%", background: C.bg, border: `1px solid ${color}`, borderRadius: 8, padding: "7px 10px", color: C.white, fontSize: 13, fontWeight: 600, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                          <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} placeholder="Notizen / Skript-Text..."
                            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px", color: C.white, fontSize: 12, fontFamily: "inherit", outline: "none", resize: "vertical", lineHeight: 1.5, marginTop: 6, boxSizing: "border-box" }} />
                          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 6 }}>
                            <button onClick={() => setEditingId(null)} style={{ padding: "5px 10px", borderRadius: 6, background: "transparent", border: `1px solid ${C.border}`, color: C.dimmed, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
                            <button onClick={saveEdit} style={{ padding: "5px 12px", borderRadius: 6, background: color, border: "none", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Speichern</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                            <GripVertical size={13} color={C.dimmed} style={{ marginTop: 2, flexShrink: 0, opacity: 0.6 }} />
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.white, lineHeight: 1.4, flex: 1, wordBreak: "break-word" }}>{card.title}</div>
                          </div>
                          {card.notes && (
                            <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5, marginTop: 5, marginLeft: 19, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", whiteSpace: "pre-wrap" }}>{card.notes}</div>
                          )}
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, marginLeft: 19 }}>
                            <button onClick={() => moveStep(card.id, -1)} disabled={colIdx === 0} title="Schritt zurück"
                              style={{ width: 24, height: 24, borderRadius: 6, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: colIdx === 0 ? "default" : "pointer", opacity: colIdx === 0 ? 0.3 : 1 }}>
                              <ChevronLeft size={12} color={C.muted} />
                            </button>
                            <button onClick={() => moveStep(card.id, 1)} disabled={colIdx === PIPELINE_COLUMNS.length - 1} title="Nächster Schritt"
                              style={{ width: 24, height: 24, borderRadius: 6, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: colIdx === PIPELINE_COLUMNS.length - 1 ? "default" : "pointer", opacity: colIdx === PIPELINE_COLUMNS.length - 1 ? 0.3 : 1 }}>
                              <ChevronRight size={12} color={C.muted} />
                            </button>
                            <div style={{ flex: 1 }} />
                            <button onClick={() => startEdit(card)} title="Bearbeiten"
                              style={{ width: 24, height: 24, borderRadius: 6, background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                              <Pencil size={12} color={C.dimmed} />
                            </button>
                            <button onClick={() => deleteCard(card.id)} title="Löschen"
                              style={{ width: 24, height: 24, borderRadius: 6, background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
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
                  <div style={{ background: C.card, border: `1px solid ${color}`, borderRadius: 10, padding: 10 }}>
                    <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus placeholder="Titel der Karte..."
                      onKeyDown={(e) => { if (e.key === "Enter") addCard(col.key); if (e.key === "Escape") { setAddingCol(null); setNewTitle(""); } }}
                      style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 10px", color: C.white, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 8 }}>
                      <button onClick={() => { setAddingCol(null); setNewTitle(""); }} style={{ padding: "5px 10px", borderRadius: 6, background: "transparent", border: `1px solid ${C.border}`, color: C.dimmed, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
                      <button onClick={() => addCard(col.key)} style={{ padding: "5px 12px", borderRadius: 6, background: color, border: "none", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Hinzufügen</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setAddingCol(col.key); setNewTitle(""); }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "8px 0", borderRadius: 10, background: "transparent", border: `1.5px dashed ${C.border}`, color: C.dimmed, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}
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

function Sidebar({ activeTab, onTabChange, unreadCount, errorCount, isDarkMode, onToggleTheme }) {
  const [expandedMenu, setExpandedMenu] = useState(null);

  // Sidebar colors matching neutral dark theme
  const SB = {
    bg: isDarkMode ? "#171717" : "#F8F9FB",
    activeBg: isDarkMode ? "#1E1E1E" : "#E8EAFF",
    hoverBg: isDarkMode ? "#1C1C1C" : "#EEEEFF",
    text: isDarkMode ? "#8B8FA3" : "#6B7280",
    activeText: isDarkMode ? "#FFFFFF" : "#111827",
    border: isDarkMode ? "#2A2A2A" : "#E5E7EB",
    userBg: isDarkMode ? "#121212" : "#F3F4F6",
  };

  const navItems = [
    { key: "connections", icon: Globe, label: "Connections" },
    {
      key: "posts", icon: Send, label: "Posts", expandable: true,
      children: [
        { key: "dashboard", label: "Overview" },
        { key: "calendar", label: "Queues" },
      ],
    },
    { key: "analytics", icon: BarChart3, label: "Analytics" },
    {
      key: "inbox", icon: Bell, label: "Inbox", badge: unreadCount, expandable: true,
      children: [
        { key: "notifications", label: "Messages" },
        { key: "comments", label: "Comments" },
      ],
    },
    { key: "ads", icon: TrendingUp, label: "Ads", disabled: true },
    { key: "skripte", icon: FileText, label: "Skripte" },
    { key: "pipeline", icon: Kanban, label: "Content-Pipeline" },
    { key: "webhooks", icon: RefreshCw, label: "Webhooks", disabled: true },
    { key: "logs", icon: Shield, label: "Logs" },
    { key: "settings", icon: Settings, label: "Settings", badge: errorCount },
  ];

  const navItemStyle = (isActive, disabled) => ({
    display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 16px", borderRadius: 8,
    border: "none", background: isActive ? SB.activeBg : "transparent", color: isActive ? SB.activeText : disabled ? SB.text + "60" : SB.text,
    fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: disabled ? "default" : "pointer",
    fontFamily: "inherit", transition: "all 0.15s", textAlign: "left", opacity: disabled ? 0.5 : 1,
  });

  const subItemStyle = (isActive) => ({
    display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 16px 7px 42px", borderRadius: 8,
    border: "none", background: isActive ? SB.activeBg : "transparent", color: isActive ? SB.activeText : SB.text,
    fontSize: 12.5, fontWeight: isActive ? 600 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "left",
  });

  // Auto-expand parent menus based on active tab
  const isPostsChild = ["dashboard", "calendar"].includes(activeTab);
  const isInboxChild = ["notifications", "comments"].includes(activeTab);

  return (
    <div style={{
      width: 220, minWidth: 220, minHeight: "100vh", background: SB.bg, borderRight: `1px solid ${SB.border}`,
      display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 40,
      overflowY: "auto",
    }}>
      {/* User Profile */}
      <div style={{ padding: "20px 16px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.red}, #991B1B)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff", flexShrink: 0 }}>D</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: SB.activeText, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Dariel</div>
          <div style={{ fontSize: 10, color: SB.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>darielo30@live.de</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "4px 8px", flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
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
                    }
                  } else {
                    onTabChange(item.key);
                    setExpandedMenu(null);
                  }
                }}
                style={navItemStyle(isParentActive && !item.expandable, item.disabled)}
                onMouseOver={(e) => { if (!isParentActive && !item.disabled) e.currentTarget.style.background = SB.hoverBg; }}
                onMouseOut={(e) => { if (!isParentActive && !item.disabled) e.currentTarget.style.background = "transparent"; }}
              >
                <item.icon size={16} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: C.red, padding: "1px 6px", borderRadius: 8, minWidth: 18, textAlign: "center" }}>{item.badge > 99 ? "99+" : item.badge}</span>
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
                      <button key={child.key} onClick={() => onTabChange(child.key)} style={subItemStyle(childActive)}
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
      <div style={{ padding: "12px 16px", borderTop: `1px solid ${SB.border}` }}>
        <button onClick={onToggleTheme} style={{
          display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", borderRadius: 8,
          background: "transparent", border: "none", color: SB.text, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
        }}
        onMouseOver={(e) => e.currentTarget.style.background = SB.hoverBg}
        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
          {isDarkMode ? <Sun size={15} color={C.yellow} /> : <Moon size={15} color="#6366F1" />}
          {isDarkMode ? "Light Mode" : "Dark Mode"}
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
    display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s",
    background: active ? C.card : "transparent", borderBottom: `1px solid ${C.border}08`,
    borderLeft: active ? `3px solid ${C.red}` : "3px solid transparent",
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

  const PlatformBadge = ({ platform }) => {
    const p = (platform || "instagram").toLowerCase();
    const col = p === "instagram" ? C.instagram : C.tiktok;
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 6, background: col + "15", fontSize: 10, fontWeight: 600, color: col }}>
        {p === "instagram" ? <Instagram size={10} /> : <TikTokIcon size={10} />}
        {p === "instagram" ? "IG" : "TT"}
      </div>
    );
  };

  return (
    <div style={{ padding: 0, height: "100%" }}>
      {/* Top Bar */}
      <div style={{ padding: "20px 24px 0", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>Inbox</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                  display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8,
                  border: `1px solid ${active ? (f.color || C.red) : C.border}`,
                  background: active ? (f.color || C.red) + "15" : "transparent",
                  color: active ? (f.color || C.red) : C.dimmed, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  {f.icon && <f.icon size={12} />}{f.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* View Toggle Tabs — Zernio style */}
        <div style={{ display: "flex", gap: 0 }}>
          {[
            { key: "comments", label: "Kommentare", icon: MessageCircle, count: filtered.length },
            { key: "dms", label: "Nachrichten", icon: Send, count: conversations.length },
          ].map((v) => {
            const active = inboxView === v.key;
            return (
              <button key={v.key} onClick={() => { setInboxView(v.key); setSelectedComment(null); setSelectedConvo(null); }} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", fontSize: 13, fontWeight: 600,
                color: active ? C.white : C.dimmed, background: "transparent", border: "none",
                borderBottom: active ? `2px solid ${C.red}` : "2px solid transparent",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}>
                <v.icon size={14} /> {v.label}
                {v.count > 0 && <span style={{ fontSize: 10, background: active ? C.red + "20" : C.border, color: active ? C.red : C.dimmed, padding: "1px 6px", borderRadius: 10, fontWeight: 700 }}>{v.count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {apiError && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 24px", background: C.redGlow, borderBottom: `1px solid ${C.redLight}20` }}>
          <XCircle size={13} color={C.redLight} />
          <div style={{ fontSize: 12, color: C.redLight }}>{apiError}</div>
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
                <div style={{ padding: 40, textAlign: "center", color: C.dimmed, fontSize: 13 }}>
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
                        : <span style={{ fontSize: 15, fontWeight: 700, color: pc }}>{(n.user || "?")[0].toUpperCase()}</span>
                      }
                      {!n.read && <div style={{ position: "absolute", top: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: C.red, border: `2px solid ${C.bg}` }} />}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{n.user}</span>
                        <PlatformBadge platform={n.platform} />
                      </div>
                      <div style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {n.text || n.fullText || "Kommentar"}
                      </div>
                      <div style={{ fontSize: 10, color: C.dimmed, marginTop: 3 }}>
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
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.dimmed, gap: 12 }}>
                  <MessageCircle size={40} color={C.border} />
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Kommentar auswählen</div>
                  <div style={{ fontSize: 12 }}>Wähle einen Kommentar aus der Liste, um Details zu sehen.</div>
                </div>
              ) : (
                <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Comment header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: (selectedComment.platform === "instagram" ? C.instagram : C.tiktok) + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {selectedComment.avatar
                        ? <img src={selectedComment.avatar} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                        : <span style={{ fontSize: 18, fontWeight: 700, color: selectedComment.platform === "instagram" ? C.instagram : C.tiktok }}>{(selectedComment.user || "?")[0].toUpperCase()}</span>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{selectedComment.user}</span>
                        <PlatformBadge platform={selectedComment.platform} />
                      </div>
                      <div style={{ fontSize: 12, color: C.dimmed, marginTop: 2 }}>{formatTime(selectedComment.time)}</div>
                    </div>
                    {selectedComment.postId && selectedComment.commentId && (
                      <button onClick={async () => {
                        try {
                          await fetch("/api/late", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "hide-comment", postId: selectedComment.postId, commentId: selectedComment.commentId }) });
                        } catch {}
                      }} style={{ padding: "6px 12px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                        <EyeOff size={12} /> Ausblenden
                      </button>
                    )}
                  </div>

                  {/* Post reference */}
                  {selectedComment.post && (
                    <div style={{ padding: "12px 16px", borderRadius: 10, background: C.card, border: `1px solid ${C.border}`, marginBottom: 16, fontSize: 12, color: C.muted }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Beitrag</div>
                      {selectedComment.post}
                    </div>
                  )}

                  {/* Comment text */}
                  <div style={{ padding: "16px 20px", borderRadius: 14, background: C.card, border: `1px solid ${C.border}`, marginBottom: 16 }}>
                    <div style={{ fontSize: 14, color: C.white, lineHeight: 1.7 }}>
                      {selectedComment.text || selectedComment.fullText || "Kein Text"}
                    </div>
                  </div>

                  {/* Replies thread */}
                  {selectedComment.replies && selectedComment.replies.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Antworten ({selectedComment.replies.length})</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 16, borderLeft: `2px solid ${C.border}` }}>
                        {selectedComment.replies.map((r, ri) => (
                          <div key={ri} style={{ padding: "10px 14px", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{r.author?.username || r.username || "Unbekannt"}</span>
                              <span style={{ fontSize: 10, color: C.dimmed }}>{formatTime(r.createdAt)}</span>
                            </div>
                            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{r.text || r.content || r.message || ""}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply input at bottom */}
                  <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Antwort schreiben..."
                        style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: C.card, border: `1px solid ${C.border}`, color: C.white, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                      <button style={{ padding: "10px 18px", borderRadius: 10, background: C.red, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, opacity: !replyText.trim() ? 0.5 : 1 }}>
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
                <div style={{ padding: 30, textAlign: "center", color: C.dimmed, fontSize: 13 }}>
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite", display: "inline-block", marginRight: 6 }} /> Wird geladen...
                </div>
              )}
              {!loadingDMs && conversations.length === 0 && (
                <div style={{ padding: 40, textAlign: "center", color: C.dimmed, fontSize: 13 }}>
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
                        : <span style={{ fontSize: 15, fontWeight: 700, color: pc }}>{name[0].toUpperCase()}</span>
                      }
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{name}</span>
                          <PlatformBadge platform={convo.platform} />
                        </div>
                        <span style={{ fontSize: 10, color: C.dimmed, flexShrink: 0 }}>
                          {formatTime(lastMsg.createdAt || convo.updatedAt)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.dimmed, gap: 12 }}>
                  <Send size={40} color={C.border} />
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Konversation auswählen</div>
                  <div style={{ fontSize: 12 }}>Wähle eine Konversation, um den Chat zu öffnen.</div>
                </div>
              ) : (
                <React.Fragment>
                  {/* Chat header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 24px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: ((selectedConvo.platform || "instagram") === "instagram" ? C.instagram : C.tiktok) + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {selectedConvo.participant?.profilePicture
                        ? <img src={selectedConvo.participant.profilePicture} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
                        : <span style={{ fontSize: 15, fontWeight: 700, color: (selectedConvo.platform || "instagram") === "instagram" ? C.instagram : C.tiktok }}>{(selectedConvo.participant?.username || selectedConvo.name || "U")[0].toUpperCase()}</span>
                      }
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{selectedConvo.participant?.username || selectedConvo.name || "Unbekannt"}</span>
                        <PlatformBadge platform={selectedConvo.platform} />
                      </div>
                      <div style={{ fontSize: 11, color: C.dimmed, marginTop: 1 }}>Konversation</div>
                    </div>
                  </div>

                  {/* Messages area */}
                  <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {(selectedConvo.messages || []).length === 0 && (
                      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.dimmed, fontSize: 12 }}>Keine Nachrichten in dieser Konversation.</div>
                    )}
                    {(selectedConvo.messages || []).map((msg, mi) => {
                      const isOwn = msg.isOwn || msg.direction === "outgoing" || msg.from === "self";
                      return (
                        <div key={mi} style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start" }}>
                          <div style={{
                            maxWidth: "65%", padding: "10px 14px",
                            borderRadius: isOwn ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                            background: isOwn ? C.red : C.card,
                            border: isOwn ? "none" : `1px solid ${C.border}`,
                          }}>
                            <div style={{ fontSize: 13, color: isOwn ? "#fff" : C.white, lineHeight: 1.5 }}>
                              {msg.text || msg.content || msg.message}
                            </div>
                            <div style={{ fontSize: 10, color: isOwn ? "rgba(255,255,255,0.6)" : C.dimmed, marginTop: 4, textAlign: isOwn ? "right" : "left" }}>
                              {formatTime(msg.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply input */}
                  <div style={{ padding: "12px 24px 16px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !sendingReply) handleReply(selectedConvo.id); }}
                        placeholder="Nachricht schreiben..."
                        style={{ flex: 1, padding: "11px 16px", borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, color: C.white, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                      <button onClick={() => handleReply(selectedConvo.id)} disabled={sendingReply || !replyText.trim()}
                        style={{ padding: "11px 20px", borderRadius: 12, background: C.red, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: sendingReply ? "wait" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, opacity: !replyText.trim() ? 0.5 : 1 }}>
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
          <div style={{ fontSize: 22, fontWeight: 800, color: C.white, letterSpacing: "-0.02em" }}>Content-Skripte</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
            {scripts.length} Skript{scripts.length !== 1 ? "e" : ""}{selectedIds.size > 0 ? ` · ${selectedIds.size} ausgewählt` : ""}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onRefresh} disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: C.card, border: `1px solid ${C.border}`, color: C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <RefreshCw size={14} className={loading ? "spin" : ""} style={loading ? { animation: "spin 1s linear infinite" } : {}} /> Aktualisieren
          </button>
          <button onClick={exportPDF} disabled={selectedIds.size === 0 || exporting}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 10,
              background: selectedIds.size > 0 ? C.red : C.card,
              border: selectedIds.size > 0 ? "none" : `1px solid ${C.border}`,
              color: selectedIds.size > 0 ? "#fff" : C.dimmed,
              fontSize: 13, fontWeight: 700, cursor: selectedIds.size > 0 ? "pointer" : "default",
              fontFamily: "inherit", opacity: exporting ? 0.7 : 1,
              boxShadow: selectedIds.size > 0 ? `0 4px 16px ${C.redGlow}` : "none",
            }}>
            {exporting ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={14} />}
            {exporting ? "Exportiere..." : "PDF exportieren"}
          </button>
        </div>
      </div>

      {/* Search + Select All bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.dimmed }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Skripte durchsuchen..."
            style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.card, color: C.white, fontSize: 13, fontFamily: "inherit", outline: "none" }}
          />
        </div>
        <button onClick={selectAll}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: C.card, border: `1px solid ${C.border}`, color: C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
          {selectedIds.size === filtered.length && filtered.length > 0 ? <CheckSquare size={14} color={C.red} /> : <Square size={14} />}
          {selectedIds.size === filtered.length && filtered.length > 0 ? "Auswahl aufheben" : "Alle auswählen"}
        </button>
      </div>

      {/* Empty state */}
      {scripts.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", background: C.card, borderRadius: 14, border: `1px solid ${C.border}` }}>
          <FileText size={40} color={C.dimmed} style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 8 }}>Noch keine Skripte</div>
          <div style={{ fontSize: 13, color: C.muted, maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
            Skripte werden automatisch über den Make.com Webhook importiert. Konfiguriere dein Szenario mit der Webhook-URL deines Dashboards.
          </div>
          <div style={{ marginTop: 20, padding: "10px 16px", background: C.bg, borderRadius: 8, display: "inline-block", fontSize: 12, fontFamily: "monospace", color: C.muted }}>
            POST /api/scripts
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && scripts.length === 0 && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Loader2 size={24} color={C.red} style={{ animation: "spin 1s linear infinite" }} />
        </div>
      )}

      {/* Scripts list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((s) => {
          const isSelected = selectedIds.has(s.id);
          const isExpanded = expandedId === s.id;
          return (
            <div key={s.id}>
              <div
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px",
                  background: isExpanded ? C.cardHover : C.card,
                  border: `1px solid ${isExpanded ? C.red + "50" : isSelected ? C.red + "30" : C.border}`,
                  borderRadius: isExpanded ? "12px 12px 0 0" : 12,
                  borderBottom: isExpanded ? `1px solid ${C.border}` : undefined,
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {/* Checkbox */}
                <div onClick={(e) => { e.stopPropagation(); toggleSelect(s.id); }}
                  style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isSelected ? C.red : C.border}`, background: isSelected ? C.red : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: 2, flexShrink: 0, transition: "all 0.15s" }}>
                  {isSelected && <Check size={13} color="#fff" strokeWidth={3} />}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.title || "Skript"}
                    </div>
                    {s.competitor && (
                      <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, background: C.bg, padding: "2px 8px", borderRadius: 5, whiteSpace: "nowrap" }}>
                        {s.competitor}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.script?.substring(0, 120) || "Kein Inhalt"}...
                  </div>
                </div>

                {/* Date */}
                <div style={{ fontSize: 11, color: C.dimmed, fontWeight: 600, whiteSpace: "nowrap", marginTop: 2 }}>
                  {s.date ? new Date(s.date).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }) : "–"}
                </div>

                {/* Expand indicator */}
                <ChevronDown size={16} color={C.dimmed} style={{ marginTop: 3, transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{
                  background: C.card, border: `1px solid ${C.red}50`, borderTop: "none",
                  borderRadius: "0 0 12px 12px", padding: "20px 24px",
                  animation: "fadeIn 0.2s ease",
                }}>
                  {/* Script text */}
                  <div style={{
                    fontSize: 13, color: C.white, lineHeight: 1.8,
                    whiteSpace: "pre-wrap", wordBreak: "break-word",
                    background: C.bg, borderRadius: 10, padding: "16px 20px",
                    border: `1px solid ${C.border}`, maxHeight: 400, overflowY: "auto",
                  }}>
                    {s.script || "Kein Inhalt"}
                  </div>

                  {/* Meta info */}
                  <div style={{ display: "flex", gap: 20, marginTop: 14, fontSize: 11, color: C.dimmed }}>
                    {s.competitor && <span><strong style={{ color: C.muted }}>Quelle:</strong> {s.competitor}</span>}
                    {s.date && <span><strong style={{ color: C.muted }}>Datum:</strong> {s.date}</span>}
                    {s.receivedAt && <span><strong style={{ color: C.muted }}>Empfangen:</strong> {new Date(s.receivedAt).toLocaleString("de-DE")}</span>}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    {s.originalUrl && (
                      <a href={s.originalUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 600, textDecoration: "none", cursor: "pointer" }}>
                        <ExternalLink size={12} /> Original ansehen
                      </a>
                    )}
                    <button onClick={() => { navigator.clipboard.writeText(s.script || ""); }}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
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
      action: l.action || l.type || "publishing",
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
      action: e.action || "Error",
      status: "ERR",
      endpoint: "—",
      platform: e.platforms?.join(", ") || "—",
      account: "mitunsverkaufen.de",
      created: e.timestamp || "",
      ok: false,
      content: e.error || e.message || "",
      result: "Failed",
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
      if (diff < 60) return "just now";
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
      if (diff < 86400) return `about ${Math.floor(diff / 3600)} hours ago`;
      return `${Math.floor(diff / 86400)} days ago`;
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${C.border}30` }}>
        <span style={{ fontSize: 12, color: C.dimmed, minWidth: 120, flexShrink: 0 }}>{label}</span>
        <span style={{ fontSize: 12, color: C.white, textAlign: "right", wordBreak: "break-all", fontFamily: mono ? "monospace" : "inherit" }}>{value || "—"}</span>
      </div>
    );

    const jsonSection = (title, data, key) => {
      const jsonStr = data ? (typeof data === "string" ? data : JSON.stringify(data, null, 2)) : null;
      if (!jsonStr || jsonStr === "null" || jsonStr === "{}") return null;
      return (
        <div style={{ marginTop: 12 }}>
          <button onClick={() => toggleSection(key)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", color: C.white, fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
            <span>{title}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={(e) => { e.stopPropagation(); copyToClipboard(jsonStr, key); }} style={{ padding: "2px 8px", borderRadius: 4, background: C.card, border: `1px solid ${C.border}`, color: copiedField === key ? C.green : C.dimmed, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                {copiedField === key ? "Copied!" : "Copy"}
              </button>
              <ChevronDown size={14} color={C.dimmed} style={{ transform: expandedSections[key] ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </div>
          </button>
          {expandedSections[key] && (
            <pre style={{ margin: 0, marginTop: 4, padding: 14, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11, color: C.muted, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: 300, overflowY: "auto" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: isSuccess ? C.greenGlow : C.redGlow }}>
                {isSuccess ? <Check size={14} color={C.green} /> : <X size={14} color={C.redLight} />}
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: C.white, textTransform: "capitalize" }}>{selectedLog.action}</span>
            </div>
            <button onClick={() => setSelectedLog(null)} style={{ width: 28, height: 28, borderRadius: 6, background: C.bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={14} color={C.dimmed} />
            </button>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 6, color: isSuccess ? C.green : "#fff", background: isSuccess ? C.greenGlow : C.red, border: `1px solid ${isSuccess ? C.green + "30" : C.red + "30"}` }}>
            {isSuccess ? "SUCCESS" : "FAILED"}
          </span>
        </div>

        {detailLoading && (
          <div style={{ padding: 30, textAlign: "center", color: C.dimmed }}>
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite", display: "inline-block", marginRight: 6 }} /> Loading details...
          </div>
        )}

        {/* Detail Fields */}
        <div style={{ padding: "8px 24px 24px" }}>
          {detailRow("Platform", (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {React.createElement(PIcon, { size: 14, color: pColor })}
              {selectedLog.platform}
            </span>
          ))}
          {detailRow("Date", formatDate(selectedLog.created))}
          {detailRow("Status Code", (
            <span style={{ fontWeight: 700, color: selectedLog.ok ? C.green : C.redLight, background: selectedLog.ok ? C.greenGlow : C.redGlow, padding: "1px 8px", borderRadius: 4, fontFamily: "monospace" }}>
              {selectedLog.status}
            </span>
          ))}
          {detailRow("Type", (d.type || selectedLog.action || "publishing"))}
          {detailRow("Endpoint", selectedLog.endpoint, true)}
          {detailRow("Result", (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {isSuccess ? (
                <React.Fragment>
                  <span style={{ color: C.green }}>Published</span>
                  {(d.platformPostId || d.platformPostUrl || selectedLog.postId) && (
                    <span style={{ color: C.dimmed, fontSize: 11 }}>• Platform Post ID: {d.platformPostId || selectedLog.postId || "—"}</span>
                  )}
                </React.Fragment>
              ) : (
                <span style={{ color: C.redLight }}>{d.error || d.message || selectedLog.result || "Failed"}</span>
              )}
            </span>
          ))}

          {/* Content Preview */}
          {(selectedLog.content || d.content || d.postContent || d.text) && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.dimmed, marginBottom: 8 }}>Content</div>
              <div style={{ padding: 14, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, color: C.white, lineHeight: 1.6, whiteSpace: "pre-wrap", maxHeight: 160, overflowY: "auto" }}>
                {selectedLog.content || d.content || d.postContent || d.text}
              </div>
            </div>
          )}

          {/* Media Count */}
          {(selectedLog.mediaCount > 0 || d.mediaItems?.length > 0) && (
            <div style={{ marginTop: 12 }}>
              {detailRow("Media", `${selectedLog.mediaCount || d.mediaItems?.length || 0} file(s)`)}
            </div>
          )}

          {/* Expandable JSON Sections */}
          {jsonSection("Response Body", d.responseBody || d.response || d.result_data || d.apiResponse, "response")}
          {jsonSection("Request Body", d.requestBody || d.request || d.payload || d.body, "request")}

          {/* Post ID */}
          {(selectedLog.postId || d.postId || d._id) && (
            <div style={{ marginTop: 16 }}>
              {detailRow("Post ID", (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11 }}>{selectedLog.postId || d.postId || d._id}</span>
                  <button onClick={() => copyToClipboard(selectedLog.postId || d.postId || d._id, "postId")} style={{ padding: "1px 6px", borderRadius: 4, background: C.bg, border: `1px solid ${C.border}`, color: copiedField === "postId" ? C.green : C.dimmed, fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>
                    {copiedField === "postId" ? "Copied!" : "Copy"}
                  </button>
                </span>
              ), true)}
            </div>
          )}

          {/* Logged At */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}30` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: C.dimmed }}>Logged at</span>
              <span style={{ fontSize: 11, color: C.dimmed }}>{formatDate(selectedLog.created)}</span>
            </div>
          </div>

          {/* Platform Post URL if available */}
          {(d.platformPostUrl || d.postUrl) && (
            <div style={{ marginTop: 12 }}>
              <a href={d.platformPostUrl || d.postUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: C.blue, textDecoration: "none" }}>
                <ExternalLink size={12} /> View on platform
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
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: C.white }}>Logs</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>View activity logs and debug errors</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", flex: 1, maxWidth: 260 }}>
            <Search size={14} color={C.dimmed} />
            <input type="text" placeholder="Search logs..." value={logsSearch} onChange={(e) => setLogsSearch(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: C.white, fontSize: 12, width: "100%", fontFamily: "inherit" }} />
          </div>
          <button style={{ padding: "8px 14px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>Publishing <ChevronDown size={11} /></button>
          <button style={{ padding: "8px 14px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>All platforms <ChevronDown size={11} /></button>
          <button style={{ padding: "8px 14px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>All statuses <ChevronDown size={11} /></button>
          <button style={{ padding: "8px 14px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>Last 7 days <ChevronDown size={11} /></button>
          <button onClick={() => { setLogsData([]); fetchLogsData(); }} style={{ width: 34, height: 34, borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <RefreshCw size={14} color={C.dimmed} style={logsLoading ? { animation: "spin 1s linear infinite" } : {}} />
          </button>
        </div>

        <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "160px 80px 1fr 140px 180px 160px", padding: "12px 20px", borderBottom: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600, color: C.dimmed }}>
            <div>Action</div><div>Status</div><div>Endpoint</div><div>Platform</div><div>Account</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>Created <ChevronDown size={10} /></div>
          </div>

          {logsLoading && (
            <div style={{ padding: 30, textAlign: "center", color: C.dimmed, fontSize: 13 }}>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite", display: "inline-block", marginRight: 6 }} /> Loading logs...
            </div>
          )}
          {!logsLoading && filteredLogs.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: C.dimmed, fontSize: 13 }}>No logs found.</div>
          )}

          {filteredLogs.map((log, i) => {
            const pIcon = log.platform?.toLowerCase().includes("instagram") ? Instagram : log.platform?.toLowerCase().includes("tiktok") ? TikTokIcon : null;
            const pColor = log.platform?.toLowerCase().includes("instagram") ? C.instagram : log.platform?.toLowerCase().includes("tiktok") ? C.tiktok : C.dimmed;
            const isSelected = selectedLog && (selectedLog.id === log.id && selectedLog.created === log.created);
            return (
              <div key={i} onClick={() => setSelectedLog(log)} style={{ display: "grid", gridTemplateColumns: "160px 80px 1fr 140px 180px 160px", padding: "12px 20px", borderBottom: `1px solid ${C.border}08`, alignItems: "center", fontSize: 13, cursor: "pointer", transition: "background 0.1s", background: isSelected ? C.bg + "80" : "transparent", borderLeft: isSelected ? `3px solid ${C.red}` : "3px solid transparent" }}
                onMouseOver={(e) => { if (!isSelected) e.currentTarget.style.background = C.bg + "60"; }}
                onMouseOut={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: log.ok ? C.greenGlow : C.redGlow }}>
                    {log.ok ? <Check size={12} color={C.green} /> : <X size={12} color={C.redLight} />}
                  </div>
                  <span style={{ color: C.white, fontWeight: 500 }}>{log.action}</span>
                </div>
                <div><span style={{ fontSize: 12, fontWeight: 700, color: log.ok ? C.green : C.redLight, background: log.ok ? C.greenGlow : C.redGlow, padding: "2px 8px", borderRadius: 4 }}>{log.status}</span></div>
                <div style={{ color: C.muted, fontSize: 12, fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{log.endpoint}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {pIcon && React.createElement(pIcon, { size: 14, color: pColor })}
                  <span style={{ color: C.white, fontSize: 12 }}>{log.platform}</span>
                </div>
                <div style={{ color: C.muted, fontSize: 12 }}>{log.account}</div>
                <div style={{ color: C.dimmed, fontSize: 12 }}>{formatTimeAgo(log.created)}</div>
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
  const [activeTab, setActiveTab] = useState("dashboard");
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
        setPosts(postsList.map(mapPost).filter((p) => !hidden.includes(p.id)));
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
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} unreadCount={unreadCount} errorCount={errorLog.length} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: 220 }}>

      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 200, background: C.card, border: `1px solid ${notification.color === "green" ? C.green : notification.color === "red" ? C.redLight : C.yellow}`, borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", maxWidth: 480 }}>
          {notification.color === "red" ? <XCircle size={16} color={C.redLight} style={{ flexShrink: 0 }} /> :
           <div style={{ width: 8, height: 8, borderRadius: "50%", background: notification.color === "green" ? C.green : C.yellow, flexShrink: 0 }} />}
          <span style={{ fontSize: 13, fontWeight: 600, color: notification.color === "red" ? C.redLight : C.white }}>{notification.text}</span>
        </div>
      )}

      {/* ── Connections Tab (Zernio style) ──────────────────── */}
      {activeTab === "connections" && (
        <div style={{ padding: "24px 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: C.white }}>Connections</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Manage profiles and platform integrations</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 8, background: C.red, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                <Plus size={15} /> New Connection
              </button>
              <button style={{ padding: "9px 20px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, color: C.white, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                New Profile
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.white }}>Platforms</span>
              <select style={{ padding: "8px 14px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, color: C.white, fontSize: 13, fontFamily: "inherit", cursor: "pointer", minWidth: 140 }}>
                <option>All profiles</option>
              </select>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button style={{ padding: "7px 14px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>All platforms</button>
              <button style={{ padding: "7px 14px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, color: C.dimmed, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>All statuses</button>
            </div>
          </div>

          {/* Connection Cards */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {accounts.length > 0 ? accounts.map((acc, i) => {
              const isIG = acc.platform === "instagram";
              const color = isIG ? C.instagram : C.tiktok;
              const Icon = isIG ? Instagram : TikTokIcon;
              return (
                <div key={i} style={{ width: 240, background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "18px 20px", position: "relative" }}>
                  {/* Info icon top right */}
                  <div style={{ position: "absolute", top: 14, right: 14, cursor: "pointer" }}>
                    <AlertCircle size={16} color={C.dimmed} />
                  </div>
                  {/* Platform header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <Icon size={20} color={color} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{isIG ? "Instagram" : "TikTok"}</div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color: C.green, background: C.greenGlow, padding: "2px 8px", borderRadius: 4, marginTop: 2 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green }} /> connected
                      </div>
                    </div>
                  </div>
                  {/* Handle */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginTop: 10 }}>@{acc.name || "mitunsverkaufen.de"}</div>
                  <div style={{ fontSize: 11, color: C.dimmed, marginTop: 2 }}>{acc.connectedAt ? new Date(acc.connectedAt).toLocaleDateString("de-DE") : new Date().toLocaleDateString("de-DE")}</div>
                  {/* Business badge */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color: C.redLight, background: C.redGlow, padding: "3px 10px", borderRadius: 4, marginTop: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.redLight }} /> Business
                  </div>
                  {/* Disconnect button */}
                  <button style={{ display: "block", width: "100%", padding: "8px 0", borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 14, textAlign: "center" }}>
                    Disconnect
                  </button>
                </div>
              );
            }) : (
              /* Demo connection cards when not connected */
              ["Instagram", "TikTok"].map((plat) => {
                const isIG = plat === "Instagram";
                const color = isIG ? C.instagram : C.tiktok;
                const Icon = isIG ? Instagram : TikTokIcon;
                return (
                  <div key={plat} style={{ width: 240, background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "18px 20px", position: "relative" }}>
                    <div style={{ position: "absolute", top: 14, right: 14 }}><AlertCircle size={16} color={C.dimmed} /></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <Icon size={20} color={color} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{plat}</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color: isConnected ? C.green : C.yellow, background: isConnected ? C.greenGlow : C.yellowGlow, padding: "2px 8px", borderRadius: 4, marginTop: 2 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: isConnected ? C.green : C.yellow }} /> {isConnected ? "connected" : "disconnected"}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginTop: 10 }}>@mitunsverkaufen.de</div>
                    <div style={{ fontSize: 11, color: C.dimmed, marginTop: 2 }}>—</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 600, color: C.redLight, background: C.redGlow, padding: "3px 10px", borderRadius: 4, marginTop: 10 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.redLight }} /> Business
                    </div>
                    <button style={{ display: "block", width: "100%", padding: "8px 0", borderRadius: 8, background: isConnected ? C.bg : C.red, border: `1px solid ${isConnected ? C.border : C.red}`, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 14, textAlign: "center" }}>
                      {isConnected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
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
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: C.white }}>Analytics</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>View post performance metrics</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {["all", "instagram", "tiktok"].map((p) => {
                const active = analyticsPlatform === p;
                const col = p === "instagram" ? C.instagram : p === "tiktok" ? C.tiktok : C.white;
                return (
                  <button key={p} onClick={() => setAnalyticsPlatform(p)} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${active ? col + "60" : C.border}`, background: active ? col + "12" : "transparent", color: active ? col : C.dimmed, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {p === "all" ? "Alle Plattformen" : p === "instagram" ? "Instagram" : "TikTok"}
                  </button>
                );
              })}
              {["7d", "30d", "90d"].map((r) => {
                const active = analyticsRange === r;
                return (
                  <button key={r} onClick={() => setAnalyticsRange(r)} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${active ? C.blue + "60" : C.border}`, background: active ? C.blueGlow : "transparent", color: active ? C.blue : C.dimmed, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {r === "7d" ? "7 Tage" : r === "30d" ? "30 Tage" : "90 Tage"}
                  </button>
                );
              })}
              <button onClick={fetchAnalytics} style={{ width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: C.card, border: `1px solid ${C.border}`, cursor: "pointer" }}>
                <RefreshCw size={14} color={C.muted} style={analyticsLoading ? { animation: "spin 1s linear infinite" } : {}} />
              </button>
            </div>
          </div>

          {isDemo && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, background: C.yellowGlow, border: `1px solid ${C.yellow}30`, marginBottom: 20 }}>
              <AlertCircle size={14} color={C.yellow} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: C.yellow }}>Demo-Modus – Daten basieren auf deinen Posts. Verbinde die API für erweiterte Metriken.</div>
            </div>
          )}

          {/* ── Metric Cards (Zernio style: 2 rows of 4) ───────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
            {[
              { label: "Likes", icon: Heart, value: fmt(totals.likes), color: C.redLight, change: null },
              { label: "Comments", icon: MessageCircle, value: fmt(totals.comments), color: C.blue, change: null },
              { label: "Shares", icon: Share2, value: fmt(totals.shares), color: C.green, change: null },
              { label: "Views", icon: Eye, value: fmt(totals.views), color: C.purple, change: null },
              { label: "Impressions", icon: TrendingUp, value: fmt(totals.impressions), color: C.blue, change: null },
              { label: "Reach", icon: Users, value: fmt(totals.reach), color: C.yellow, change: null },
              { label: "Clicks", icon: ExternalLink, value: fmt(totals.clicks), color: C.green, change: null },
              { label: "Eng. Rate", icon: BarChart3, value: `${engRate}%`, color: C.redLight, change: null },
            ].map((m) => (
              <div key={m.label} style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ color: m.color, display: "flex", alignItems: "center" }}><m.icon size={16} /></div>
                <div>
                  <div style={{ fontSize: 11, color: C.dimmed, fontWeight: 500, marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.white }}>{m.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Daily Chart ────────────────────────────────────── */}
          <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: C.white }}>Tägliche Performance</div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="date" tick={{ fill: C.dimmed, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.dimmed, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                  <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12, color: C.white }} />
                  <Line type="monotone" dataKey="likes" name="Likes" stroke={C.redLight} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="comments" name="Comments" stroke={C.blue} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="views" name="Views" stroke={C.purple} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: C.dimmed, fontSize: 13 }}>Keine täglichen Daten verfügbar</div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            {/* ── Best Time to Post (green heatmap like Zernio) ── */}
            <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: C.white }}>Best Time to Post</div>
              <div style={{ display: "grid", gridTemplateColumns: `36px repeat(7, 1fr)`, gap: 3 }}>
                <div />
                {dayLabels.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 10, color: C.dimmed, fontWeight: 600, paddingBottom: 6 }}>{d}</div>)}
                {[6, 9, 12, 15, 18, 21].map((h) => (
                  <React.Fragment key={h}>
                    <div style={{ fontSize: 10, color: C.dimmed, lineHeight: "26px", textAlign: "right", paddingRight: 6 }}>{h < 10 ? "0" : ""}{h}:00</div>
                    {dayLabels.map((_, di) => {
                      const val = btMap[`${di}-${h}`] || 0;
                      const intensity = val / maxEng;
                      // Green gradient (Zernio style)
                      const bg = intensity > 0 ? `rgba(34,197,94,${0.15 + intensity * 0.75})` : C.bg;
                      return (
                        <div key={di} title={`${dayLabels[di]} ${h}:00 – ${val.toFixed(1)}% Engagement`} style={{
                          height: 26, borderRadius: 4, background: bg,
                          border: `1px solid ${intensity > 0.4 ? "rgba(34,197,94,0.3)" : C.border}`,
                          cursor: "default",
                        }} />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, justifyContent: "center" }}>
                <div style={{ fontSize: 10, color: C.dimmed }}>Fewer</div>
                {[0.1, 0.25, 0.45, 0.65, 0.85].map((o) => <div key={o} style={{ width: 14, height: 14, borderRadius: 3, background: `rgba(34,197,94,${o})` }} />)}
                <div style={{ fontSize: 10, color: C.dimmed }}>More</div>
              </div>
              {/* Best times badges */}
              {Object.entries(btMap).length > 0 && (() => {
                const sorted = Object.entries(btMap).sort((a, b) => b[1] - a[1]).slice(0, 3);
                return (
                  <div style={{ display: "flex", gap: 6, marginTop: 12, justifyContent: "center" }}>
                    <span style={{ fontSize: 11, color: C.dimmed, marginRight: 4 }}>Best time:</span>
                    {sorted.map(([key]) => {
                      const [d, h] = key.split("-").map(Number);
                      return <span key={key} style={{ fontSize: 11, fontWeight: 600, color: C.green, background: C.green + "15", padding: "2px 10px", borderRadius: 6, border: `1px solid ${C.green}25` }}>{dayLabels[d]} {h}:00</span>;
                    })}
                  </div>
                );
              })()}
            </div>

            {/* ── Top Performing Posts ──────────────────────────── */}
            <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: C.white }}>Top Performing Posts</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {topPosts.length === 0 && <div style={{ color: C.dimmed, fontSize: 12, padding: 20, textAlign: "center" }}>Keine veröffentlichten Posts</div>}
                {topPosts.map((p, i) => {
                  const eng = (p.likes || 0) + (p.comments || 0) + (p.shares || 0);
                  const pER = p.views > 0 ? ((eng / p.views) * 100).toFixed(2) : "–";
                  const postDate = new Date(p.date).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", borderRadius: 8, cursor: "pointer", transition: "background 0.15s" }}
                      onMouseOver={(e) => e.currentTarget.style.background = C.bg}
                      onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                      onClick={() => setSelectedPost(p)}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.dimmed, flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: C.white, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                        <div style={{ fontSize: 10, color: C.dimmed }}>{postDate}</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.green, background: C.greenGlow, padding: "3px 10px", borderRadius: 6, flexShrink: 0 }}>ER {pER}%</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        <Heart size={11} color={C.dimmed} /><span style={{ fontSize: 11, color: C.dimmed }}>{p.likes || 0}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Platform Breakdown (Zernio style cards) ────────── */}
          {platformCards.length > 0 && (
            <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: C.white }}>Platform Breakdown</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {platformCards.map((pc) => {
                  const isIG = pc.platform.toLowerCase().includes("instagram");
                  const isTT = pc.platform.toLowerCase().includes("tiktok");
                  const color = isIG ? C.instagram : isTT ? C.tiktok : C.blue;
                  const m = pc.metrics;
                  const eng = (m.likes || 0) + (m.comments || 0) + (m.shares || 0);
                  const er = m.impressions > 0 ? ((eng / m.impressions) * 100).toFixed(2) : m.reach > 0 ? ((eng / m.reach) * 100).toFixed(2) : "–";
                  return (
                    <div key={pc.key} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 140 }}>
                        {isIG ? <Instagram size={16} color={color} /> : <TikTokIcon size={16} color={color} />}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: color }}>{isIG ? "Instagram" : isTT ? "TikTok" : pc.name}</div>
                          <div style={{ fontSize: 10, color: C.dimmed }}>{pc.postCount} posts</div>
                        </div>
                      </div>
                      <div style={{ flex: 1, display: "flex", gap: 20, justifyContent: "space-around" }}>
                        {[
                          { icon: Heart, val: m.likes || 0 },
                          { icon: MessageCircle, val: m.comments || 0 },
                          { icon: Share2, val: m.shares || 0 },
                          { icon: Eye, val: m.views || 0 },
                        ].map((s, si) => (
                          <div key={si} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <s.icon size={12} color={C.dimmed} />
                            <span style={{ fontSize: 12, color: C.white, fontWeight: 600 }}>{fmt(s.val)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.green, background: C.greenGlow, padding: "4px 12px", borderRadius: 6 }}>ER {er}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Content Decay Chart ────────────────────────────── */}
          {decayData.length > 0 && (
            <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: C.white }}>Content Performance Decay</div>
              <div style={{ fontSize: 11, color: C.dimmed, marginBottom: 14 }}>Wie schnell erreicht ein Post seine finale Reichweite?</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={decayData}>
                  <defs>
                    <linearGradient id="gradDecay" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.purple} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={C.purple} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="bucket_label" tick={{ fill: C.dimmed, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.dimmed, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12, color: C.white }} formatter={(v) => [`${v}%`, "Erreicht"]} />
                  <Area type="monotone" dataKey="avg_pct_of_final" name="Performance" stroke={C.purple} fill="url(#gradDecay)" strokeWidth={2} dot={{ r: 3, fill: C.purple }} />
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
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4, color: C.white }}>Settings</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>API connection, team access, and notification settings</div>

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

          {/* ── Error Log Panel ──────────────────────────────── */}
          <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AlertCircle size={16} color={C.redLight} />
                <div style={{ fontSize: 14, fontWeight: 700 }}>Fehler-Protokoll</div>
                {errorLog.length > 0 && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: C.red, padding: "2px 8px", borderRadius: 10 }}>{errorLog.length}</div>
                )}
              </div>
              {errorLog.length > 0 && (
                <button onClick={clearErrorLog} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7, background: C.bg, border: `1px solid ${C.border}`, color: C.muted, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                  <Trash2 size={11} /> Alle löschen
                </button>
              )}
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Alle API-Fehler werden hier protokolliert und bleiben gespeichert.</div>

            {errorLog.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: C.dimmed, fontSize: 13 }}>
                <Check size={20} style={{ marginBottom: 6, opacity: 0.5 }} /><br />
                Keine Fehler vorhanden
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 400, overflowY: "auto" }}>
                {errorLog.map((entry) => {
                  const isExpanded = expandedError === entry.id;
                  const ts = new Date(entry.timestamp);
                  const timeStr = `${ts.toLocaleDateString("de-DE")} · ${ts.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`;
                  return (
                    <div key={entry.id} style={{ background: C.bg, borderRadius: 10, border: `1px solid ${isExpanded ? C.red + "40" : C.border}`, overflow: "hidden", transition: "border-color 0.2s" }}>
                      <div onClick={() => setExpandedError(isExpanded ? null : entry.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer" }}>
                        <div style={{ width: 6, height: 6, borderRadius: 3, background: C.redLight, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: C.white, marginBottom: 2 }}>{entry.action}</div>
                          <div style={{ fontSize: 11, color: C.redLight, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.error}</div>
                        </div>
                        <div style={{ fontSize: 10, color: C.dimmed, whiteSpace: "nowrap", flexShrink: 0 }}>{timeStr}</div>
                        <ChevronDown size={14} color={C.dimmed} style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} />
                      </div>
                      {isExpanded && (
                        <div style={{ padding: "0 14px 12px", borderTop: `1px solid ${C.border}` }}>
                          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px", padding: "10px 0", fontSize: 11 }}>
                            <span style={{ color: C.dimmed, fontWeight: 600 }}>Aktion:</span>
                            <span style={{ color: C.white }}>{entry.action}</span>
                            <span style={{ color: C.dimmed, fontWeight: 600 }}>Fehler:</span>
                            <span style={{ color: C.redLight }}>{entry.error}</span>
                            {entry.platforms && <>
                              <span style={{ color: C.dimmed, fontWeight: 600 }}>Plattformen:</span>
                              <span style={{ color: C.white }}>{entry.platforms.join(", ")}</span>
                            </>}
                            {entry.content && <>
                              <span style={{ color: C.dimmed, fontWeight: 600 }}>Inhalt:</span>
                              <span style={{ color: C.muted }}>{entry.content}...</span>
                            </>}
                            {entry.scheduledFor && <>
                              <span style={{ color: C.dimmed, fontWeight: 600 }}>Geplant für:</span>
                              <span style={{ color: C.white }}>{entry.scheduledFor}</span>
                            </>}
                            {entry.postTitle && <>
                              <span style={{ color: C.dimmed, fontWeight: 600 }}>Beitrag:</span>
                              <span style={{ color: C.white }}>{entry.postTitle}</span>
                            </>}
                            {entry.mediaCount > 0 && <>
                              <span style={{ color: C.dimmed, fontWeight: 600 }}>Medien:</span>
                              <span style={{ color: C.white }}>{entry.mediaCount} Datei(en)</span>
                            </>}
                            <span style={{ color: C.dimmed, fontWeight: 600 }}>Zeitpunkt:</span>
                            <span style={{ color: C.white }}>{ts.toLocaleString("de-DE")}</span>
                          </div>
                          {entry.response && (
                            <div>
                              <div style={{ fontSize: 11, color: C.dimmed, fontWeight: 600, marginBottom: 4 }}>API-Antwort:</div>
                              <pre style={{ background: C.card, borderRadius: 8, border: `1px solid ${C.border}`, padding: 10, fontSize: 10, color: C.muted, overflow: "auto", maxHeight: 180, whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.5, margin: 0 }}>
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
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: C.white }}>Posts</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Manage your scheduled and published content</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => { setCreateModalInitialDate(""); setShowCreateModal(true); }} style={{ display: "flex", alignItems: "center", gap: 6, background: C.red, border: "none", borderRadius: 8, padding: "9px 20px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              <Plus size={15} /> Create post
            </button>
          </div>
        </div>

        {/* ── Zernio-Filterleiste ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          <FilterDropdown
            label="All posts" value={statusFilter} onChange={setStatusFilter} width={180}
            options={[
              { key: "all", label: "All posts" },
              { key: "draft", label: "Draft" },
              { key: "scheduled", label: "Scheduled" },
              { key: "queued", label: "Queued" },
              { key: "published", label: "Published" },
              { key: "failed", label: "Failed" },
              { key: "partial", label: "Partial" },
            ]} />

          <FilterDropdown
            label="All platforms" value={platformFilter2} onChange={setPlatformFilter2} width={200}
            options={[
              { key: "all", label: "All platforms" },
              { key: "tiktok", label: "TikTok", icon: TikTokIcon, color: C.tiktok },
              { key: "instagram", label: "Instagram", icon: Instagram, color: C.instagram },
              { key: "facebook", label: "Facebook", icon: Facebook },
              { key: "youtube", label: "YouTube", icon: Youtube },
              { key: "linkedin", label: "LinkedIn", icon: Linkedin },
            ]} />

          <FilterDropdown
            label="All profiles" value={profileFilter} onChange={setProfileFilter} searchable width={200}
            options={[
              { key: "all", label: "All profiles" },
              ...profileOptions.map((p) => ({ key: p, label: p, dot: C.red })),
            ]} />

          <FilterDropdown
            label="All users" value={userFilter} onChange={setUserFilter} width={180}
            options={[
              { key: "all", label: "All users" },
              ...userOptions.map((u) => ({ key: u, label: u })),
            ]} />

          <FilterDropdown
            label="All dates" value={dateFilter} onChange={setDateFilter} icon={Calendar} width={180}
            options={[
              { key: "all", label: "All dates" },
              { key: "today", label: "Today" },
              { key: "tomorrow", label: "Tomorrow" },
              { key: "this_week", label: "This week" },
              { key: "next_week", label: "Next week" },
              { key: "this_month", label: "This month" },
            ]} />

          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px" }}>
            <Search size={14} color={C.dimmed} />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: C.white, fontSize: 12.5, width: 110, fontFamily: "inherit" }} />
          </div>

          {/* Rechte Seite: Sortierung, Ansicht, Spaltenanzahl */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => { fetchAccounts(); fetchPosts(); }} title="Aktualisieren" style={{ width: 34, height: 34, borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <RefreshCw size={14} color={C.muted} style={isLoading ? { animation: "spin 1s linear infinite" } : {}} />
            </button>

            <FilterDropdown
              label="Scheduled (new)" value={sortBy} onChange={setSortBy} icon={ArrowUpDown} width={330} align="right"
              options={[
                { key: "scheduled_desc", label: "Scheduled (newest first)" },
                { key: "scheduled_asc", label: "Scheduled (oldest first)" },
                { key: "created_desc", label: "Created (newest first)" },
                { key: "created_asc", label: "Created (oldest first)" },
                { key: "status", label: "Status" },
                { key: "platform", label: "Platform" },
                { key: "_div", label: "By metric · published only", divider: true },
                { key: "engagement", label: "Most engagement (likes+comments+shares+saves)" },
                { key: "likes", label: "Most likes" },
                { key: "comments", label: "Most comments" },
                { key: "shares", label: "Most shares" },
                { key: "views", label: "Most views" },
                { key: "impressions", label: "Most impressions" },
                { key: "reach", label: "Most reach" },
                { key: "saves", label: "Most saves" },
                { key: "clicks", label: "Most clicks" },
              ]} />

            {/* Ansichts-Umschalter */}
            <div style={{ display: "flex", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 3, gap: 2 }}>
              {[
                { key: "grid", icon: LayoutGrid, title: "Kacheln" },
                { key: "list", icon: List, title: "Liste" },
                { key: "calendar", icon: Calendar, title: "Kalender" },
              ].map((v) => (
                <button key={v.key} onClick={() => v.key === "calendar" ? setActiveTab("calendar") : setViewMode(v.key)} title={v.title} style={{
                  width: 30, height: 26, borderRadius: 6, border: "none", cursor: "pointer",
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
              <div style={{ display: "flex", alignItems: "center", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 3, gap: 2 }}>
                <button onClick={() => setGridCols(Math.max(2, gridCols - 1))} disabled={gridCols <= 2} style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", color: gridCols <= 2 ? C.border : C.dimmed, cursor: gridCols <= 2 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Minus size={13} />
                </button>
                <span style={{ fontSize: 12.5, color: C.muted, minWidth: 14, textAlign: "center", fontWeight: 600 }}>{gridCols}</span>
                <button onClick={() => setGridCols(Math.min(6, gridCols + 1))} disabled={gridCols >= 6} style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", color: gridCols >= 6 ? C.border : C.dimmed, cursor: gridCols >= 6 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          <div style={{ fontSize: 12, color: C.dimmed }}>
            {filtered.length > 0 ? `${pageStart + 1}–${Math.min(pageStart + PER_PAGE, filtered.length)} of ${filtered.length}` : "No posts"}
          </div>
        </div>

        {/* ── Zernio-style Post Cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: viewMode === "list" ? "1fr" : `repeat(${gridCols}, minmax(0, 1fr))`,
          gap: 14, alignItems: "start",
        }}>
          {/* Karten haben eine feste Höhe, damit das Raster gleichmäßig bleibt */}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: 40, textAlign: "center", color: C.dimmed, fontSize: 14 }}>Keine Beiträge gefunden.</div>
          )}
          {paged.map((post) => {
            const postPlats = post.platforms || [post.platform || "instagram"];
            const primaryColor = postPlats.includes("instagram") ? C.instagram : C.tiktok;
            const isSelected = selectedPost?.id === post.id;
            const statusConf = {
              published: { label: "published", color: C.green },
              scheduled: { label: "scheduled", color: C.blue },
              queued: { label: "queued", color: C.purple },
              draft: { label: "draft", color: C.dimmed },
              failed: { label: "failed", color: C.redLight },
              partial: { label: "partial", color: C.yellow },
            };
            const sc = statusConf[post.status] || statusConf.draft;
            const pid = String(post.id);
            const shortId = pid.length > 8 ? pid.substring(0, 7) + "…" : pid;

            // Metriken – nur anzeigen, was tatsächlich Werte hat
            const metrics = [
              { key: "likes", icon: Heart, value: post.likes },
              { key: "comments", icon: MessageCircle, value: post.comments },
              { key: "shares", icon: Share2, value: post.shares },
              { key: "views", icon: Eye, value: post.views },
              { key: "reach", icon: UsersRound, value: post.reach },
              { key: "saves", icon: Bookmark, value: post.saves },
              { key: "clicks", icon: MousePointerClick, value: post.clicks },
            ].filter((m) => m.value > 0);

            const fmtNum = (n) => n >= 1000 ? (n / 1000).toFixed(1).replace(".0", "") + "K" : String(n);

            return (
              <div key={post.id}>
              {/* ── Card ── */}
              <div onClick={() => setSelectedPost(isSelected ? null : post)}
                style={{
                  background: C.card, border: `1px solid ${isSelected ? primaryColor + "60" : C.border}`,
                  cursor: "pointer", transition: "border-color 0.15s", overflow: "hidden",
                  height: 186, display: "flex", flexDirection: "column",
                }}
                onMouseOver={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = C.dimmed + "60"; } }}
                onMouseOut={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = C.border; } }}>

                {/* Kopfbereich: Text links, Thumbnail rechts */}
                <div style={{ display: "flex", gap: 12, padding: 14, flex: 1, minHeight: 0 }}>
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                    {/* Titel – feste Höhe für 2 Zeilen */}
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: C.white, lineHeight: 1.45, height: 36, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 10 }}>
                      {post.title}
                    </div>

                    {/* Plattform-Icons */}
                    <div style={{ display: "flex", gap: 7, marginBottom: 9, alignItems: "center", height: 15 }}>
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
                    <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {", "}
                      {new Date(post.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </div>

                    {/* User · Profil · Post-ID */}
                    <div style={{ fontSize: 10.5, color: C.dimmed, display: "flex", gap: 5, alignItems: "center", whiteSpace: "nowrap", overflow: "hidden" }}>
                      {post.createdBy && <span>{post.createdBy}</span>}
                      {post.profile && (
                        <>
                          <span style={{ color: C.border }}>·</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.red, display: "inline-block" }} />
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
                        style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "monospace", cursor: "pointer", color: copiedId === pid ? C.green : C.dimmed }}>
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
                <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 14px", height: 40, borderTop: `1px solid ${C.border}`, flexShrink: 0, overflow: "hidden" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", fontSize: 10.5, fontWeight: 600, color: sc.color, background: sc.color + "18", padding: "3px 9px", borderRadius: 5, flexShrink: 0 }}>
                    {sc.label}
                  </div>
                  {metrics.map((m) => (
                    <div key={m.key} title={m.key} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: C.muted, flexShrink: 0 }}>
                      <m.icon size={11} />
                      {fmtNum(m.value)}
                    </div>
                  ))}
                  <div style={{ marginLeft: "auto", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.dimmed, fontSize: 15, letterSpacing: 1, flexShrink: 0 }}
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 24 }}>
            <button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage === 1} style={{
              width: 30, height: 30, borderRadius: 7, background: "transparent", border: `1px solid ${C.border}`,
              color: safePage === 1 ? C.border : C.muted, cursor: safePage === 1 ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 2)
              .map((n, idx, arr) => (
                <React.Fragment key={n}>
                  {idx > 0 && arr[idx - 1] !== n - 1 && <span style={{ color: C.dimmed, padding: "0 3px", fontSize: 12 }}>…</span>}
                  <button onClick={() => setPage(n)} style={{
                    minWidth: 30, height: 30, padding: "0 8px", borderRadius: 7,
                    background: n === safePage ? C.cardHover : "transparent",
                    border: `1px solid ${n === safePage ? C.dimmed + "60" : C.border}`,
                    color: n === safePage ? C.white : C.muted, fontSize: 12.5,
                    fontWeight: n === safePage ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
                  }}>{n}</button>
                </React.Fragment>
              ))}
            <button onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage === totalPages} style={{
              width: 30, height: 30, borderRadius: 7, background: "transparent", border: `1px solid ${C.border}`,
              color: safePage === totalPages ? C.border : C.muted, cursor: safePage === totalPages ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {!isConnected && (
          <div style={{ marginTop: 32, padding: 24, background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.redGlow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><BarChart3 size={22} color={C.red} /></div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 8 }}>Zernio API verbinden – 3 Schritte</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.8 }}>
                <span style={{ color: C.red, fontWeight: 700 }}>1.</span> Erstelle einen Account auf <span style={{ color: C.blue, fontWeight: 600 }}>zernio.com</span> und verbinde Instagram + TikTok<br />
                <span style={{ color: C.red, fontWeight: 700 }}>2.</span> Kopiere deinen API-Key unter Settings → API<br />
                <span style={{ color: C.red, fontWeight: 700 }}>3.</span> Füge ihn als <span style={{ color: C.green, fontWeight: 600 }}>LATE_API_KEY</span> in deinen Vercel Environment Variables ein und deploye erneut
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
  );
}
