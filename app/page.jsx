"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Check, Eye, Heart, MessageCircle, Share2, Instagram, Music,
  TrendingUp, TrendingDown, Calendar, ChevronDown, Plus, BarChart3,
  Users, Search, X, Clock, Send, Loader2,
  RefreshCw, Wifi, WifiOff, Upload, FileVideo, Trash2, ChevronLeft, ChevronRight,
  Globe, SkipForward, SkipBack, Scissors,
  LayoutDashboard, Bell, Settings, UserPlus, AlertCircle, XCircle, UsersRound, Shield
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

// ── Brand Colors ────────────────────────────────────────────────
const C = {
  bg: "#0B0F19", bgSoft: "#0F1320", card: "#131825", cardHover: "#1A2035",
  border: "#1E2A3A", red: "#DC2626", redGlow: "rgba(220,38,38,0.12)",
  redLight: "#EF4444", green: "#22C55E", greenGlow: "rgba(34,197,94,0.12)",
  blue: "#3B82F6", blueGlow: "rgba(59,130,246,0.12)", purple: "#8B5CF6",
  purpleGlow: "rgba(139,92,246,0.12)", yellow: "#EAB308",
  yellowGlow: "rgba(234,179,8,0.12)", white: "#F9FAFB", muted: "#9CA3AF",
  dimmed: "#6B7280", instagram: "#E1306C", tiktok: "#00F2EA",
};

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
  { id: 1, platform: "instagram", type: "Reel", title: "Energievertrieb 2026 – So startest du durch", date: "2026-02-03", views: 12400, likes: 890, comments: 124, shares: 67, done: true, status: "published" },
  { id: 2, platform: "tiktok", type: "Video", title: "Door-to-Door Sales: 5 Tipps vom Profi", date: "2026-02-05", views: 34200, likes: 2100, comments: 310, shares: 445, done: true, status: "published" },
  { id: 3, platform: "instagram", type: "Karussell", title: "Partnermodell erklärt – Passives Einkommen", date: "2026-02-08", views: 8900, likes: 620, comments: 89, shares: 34, done: true, status: "published" },
  { id: 4, platform: "tiktok", type: "Video", title: "Tag im Leben eines Energieberaters", date: "2026-02-10", views: 51000, likes: 3400, comments: 520, shares: 780, done: false, status: "published" },
  { id: 5, platform: "instagram", type: "Reel", title: "Stadtwerke Krefeld – Behind the Scenes", date: "2026-02-12", views: 6200, likes: 410, comments: 56, shares: 23, done: false, status: "published" },
  { id: 6, platform: "instagram", type: "Story", title: "Q&A: Häufigste Fragen zu unserem Netzwerk", date: "2026-02-14", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "scheduled" },
  { id: 7, platform: "tiktok", type: "Video", title: "Vorher/Nachher: Agentur-Transformation", date: "2026-02-17", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "scheduled" },
  { id: 8, platform: "instagram", type: "Reel", title: "Warum Stadtwerke Krefeld? Die Vorteile", date: "2026-02-19", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "draft" },
  { id: 9, platform: "tiktok", type: "Video", title: "Recruiting-Strategie für Agenturen", date: "2026-02-21", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "draft" },
  { id: 10, platform: "instagram", type: "Karussell", title: "5 Gründe für mitunsverkaufen.de", date: "2026-02-24", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "draft" },
  { id: 11, platform: "tiktok", type: "Video", title: "Live-Coaching: Einwandbehandlung", date: "2026-02-26", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "draft" },
  { id: 12, platform: "instagram", type: "Reel", title: "Monatsrückblick Februar", date: "2026-02-28", views: 0, likes: 0, comments: 0, shares: 0, done: false, status: "draft" },
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
  return (<div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: c.color, background: c.bg, padding: "3px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: c.color }} />{c.label}</div>);
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

// ── Create Post Modal with Media Upload + Thumbnail + Timezone ──
function CreatePostModal({ onClose, onSubmit, isSubmitting, accounts }) {
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState({ instagram: true, tiktok: true });
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [postNow, setPostNow] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [timezone, setTimezone] = useState("Europe/Berlin");
  const [thumbnailTimestamp, setThumbnailTimestamp] = useState(null);
  const fileInputRef = useRef(null);

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

    // Upload each file via presigned URL
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
          // API not connected – keep file locally for display
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

  const handleSubmit = () => {
    if (!content.trim()) return;
    const selectedPlatforms = Object.entries(platforms).filter(([, v]) => v).map(([k]) => k);
    if (selectedPlatforms.length === 0) return;

    let scheduledFor = null;
    if (!postNow && scheduleDate && scheduleTime) {
      scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    }

    const mediaItems = mediaFiles.filter((f) => f.url && f.url !== "local").map((f) => ({ type: f.type, url: f.url }));

    // Build platform objects with accountId
    const platformsPayload = selectedPlatforms.map((p) => {
      const account = accounts.find((a) => a.platform === p);
      return { platform: p, accountId: account?.id || account?.accountId || undefined };
    });

    // TikTok thumbnail settings
    let tiktokSettings = null;
    if (thumbnailTimestamp !== null && selectedPlatforms.includes("tiktok")) {
      tiktokSettings = { video_cover_timestamp_ms: thumbnailTimestamp };
    }

    onSubmit({ content, platforms: platformsPayload, scheduledFor, publishNow: postNow, mediaItems, timezone, tiktokSettings });
  };

  const fmtSize = (bytes) => bytes > 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + " MB" : (bytes / 1024).toFixed(0) + " KB";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, width: 600, maxWidth: "92vw", maxHeight: "92vh", overflow: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }} onClick={(e) => e.stopPropagation()}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.white }}>Neuer Beitrag</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: C.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} color={C.muted} /></button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Platform Selection */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Plattformen</div>
            <div style={{ display: "flex", gap: 10 }}>
              {[{ key: "instagram", label: "Instagram", icon: Instagram, color: C.instagram }, { key: "tiktok", label: "TikTok", icon: Music, color: C.tiktok }].map((p) => {
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
                        <span title={`${p.label}-Account nicht verbunden – verbinde ihn zuerst in deinem Late Dashboard unter getlate.dev`}
                          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: C.yellowGlow, color: C.yellow, fontSize: 11, fontWeight: 800, cursor: "help" }}>!</span>
                      )}
                    </button>
                    {!account && platforms[p.key] && (
                      <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, background: C.card, border: `1px solid ${C.yellow}40`, borderRadius: 10, padding: "8px 12px", width: 240, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 10 }}>
                        <div style={{ fontSize: 12, color: C.yellow, fontWeight: 600, marginBottom: 4 }}>{p.label}-Account nicht verbunden</div>
                        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>Verbinde deinen {p.label}-Account in deinem Late Dashboard unter Settings, damit Posts veröffentlicht werden können.</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {accounts.length === 0 && (
              <div style={{ fontSize: 12, color: C.yellow, marginTop: 6, lineHeight: 1.5 }}>Keine Social-Media-Accounts verbunden. Verbinde Instagram und/oder TikTok in deinem Late Dashboard unter getlate.dev → Settings.</div>
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

          {/* Media Upload */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Medien</div>
            <input type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm" multiple
              style={{ display: "none" }} onChange={(e) => handleFiles(Array.from(e.target.files))} />

            {/* Drop Zone */}
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
              <div style={{ fontSize: 13, fontWeight: 600, color: isDragging ? C.red : C.muted }}>
                Bilder oder Videos hierher ziehen
              </div>
              <div style={{ fontSize: 12, color: C.dimmed }}>oder klicken zum Durchsuchen · JPG, PNG, MP4, MOV</div>
            </div>

            {/* Uploaded Files Preview */}
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

            {/* Video Thumbnail Picker */}
            {videoFile && (
              <ThumbnailPicker videoFile={videoFile} onSelect={setThumbnailTimestamp} selectedTimestamp={thumbnailTimestamp} />
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
                {/* Timezone */}
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
function Sidebar({ activeTab, onTabChange, unreadCount }) {
  const tabs = [
    { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { key: "notifications", icon: Bell, label: "Benachrichtigungen", badge: unreadCount },
    { key: "analytics", icon: BarChart3, label: "Analytics" },
    { key: "team", icon: UsersRound, label: "Team" },
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
          { key: "tiktok", label: "TikTok", icon: Music, color: C.tiktok },
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

// ── Team Panel ──────────────────────────────────────────────────
function TeamPanel() {
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
  const [posts, setPosts] = useState(demoPosts);
  const [performance] = useState(demoPerformance);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
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
      if (data.posts && Array.isArray(data.posts)) {
        const transformed = data.posts.map((p, i) => ({
          id: p.id || i + 1,
          platform: p.platforms?.[0]?.platform || p.platforms?.[0] || "instagram",
          type: p.mediaItems?.some((m) => m.type === "video") ? "Video" : "Post",
          title: p.content?.substring(0, 60) + (p.content?.length > 60 ? "..." : "") || "Unbenannt",
          date: p.scheduledFor || p.createdAt || new Date().toISOString(),
          views: p.analytics?.impressions || 0,
          likes: p.analytics?.likes || 0,
          comments: p.analytics?.comments || 0,
          shares: p.analytics?.shares || 0,
          done: p.status === "published",
          status: p.status || "draft",
        }));
        setPosts(transformed);
      } else if (Array.isArray(data)) {
        const transformed = data.map((p, i) => ({
          id: p.id || i + 1,
          platform: p.platforms?.[0]?.platform || p.platforms?.[0] || "instagram",
          type: p.mediaItems?.some((m) => m.type === "video") ? "Video" : "Post",
          title: p.content?.substring(0, 60) + (p.content?.length > 60 ? "..." : "") || "Unbenannt",
          date: p.scheduledFor || p.createdAt || new Date().toISOString(),
          views: p.analytics?.impressions || 0,
          likes: p.analytics?.likes || 0,
          comments: p.analytics?.comments || 0,
          shares: p.analytics?.shares || 0,
          done: p.status === "published",
          status: p.status || "draft",
        }));
        setPosts(transformed);
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
        const np = { id: Date.now(), platform: platforms[0]?.platform || "instagram", type: mediaItems?.length ? "Video" : "Post",
          title: content.substring(0, 60) + (content.length > 60 ? "..." : ""),
          date: scheduledFor || new Date().toISOString(), views: 0, likes: 0, comments: 0, shares: 0,
          done: false, status: "failed" };
        setPosts((prev) => [np, ...prev]);
        showNotif(`Fehler: ${errMsg}`, "red");
      } else {
        showNotif(scheduledFor ? "Beitrag erfolgreich geplant!" : "Beitrag wird gepostet!", "green");
        fetchPosts();
      }
    } catch (err) {
      const np = { id: Date.now(), platform: platforms[0]?.platform || "instagram", type: "Post",
        title: content.substring(0, 60) + (content.length > 60 ? "..." : ""),
        date: scheduledFor || new Date().toISOString(), views: 0, likes: 0, comments: 0, shares: 0,
        done: false, status: "failed" };
      setPosts((prev) => [np, ...prev]);
      showNotif("Netzwerkfehler – Upload fehlgeschlagen", "red");
    } finally { setIsSubmitting(false); setShowCreateModal(false); }
  };

  const toggle = (id) => setPosts(posts.map((p) => p.id === id ? { ...p, done: !p.done } : p));

  // Filter by month + search + platform/status
  const filtered = posts.filter((p) => {
    const d = new Date(p.date);
    const matchesMonth = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    const matchesFilter = filter === "all" ? true : filter === "instagram" ? p.platform === "instagram" : filter === "tiktok" ? p.platform === "tiktok" : filter === "offen" ? (!p.done && p.status !== "failed") : filter === "erledigt" ? p.done : filter === "failed" ? p.status === "failed" : true;
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
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} unreadCount={unreadCount} />

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: 64 }}>

      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 200, background: C.card, border: `1px solid ${notification.color === "green" ? C.green : notification.color === "red" ? C.redLight : C.yellow}`, borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", maxWidth: 480 }}>
          {notification.color === "red" ? <XCircle size={16} color={C.redLight} style={{ flexShrink: 0 }} /> :
           <div style={{ width: 8, height: 8, borderRadius: "50%", background: notification.color === "green" ? C.green : C.yellow, flexShrink: 0 }} />}
          <span style={{ fontSize: 13, fontWeight: 600, color: notification.color === "red" ? C.redLight : C.white }}>{notification.text}</span>
        </div>
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

      {/* Team Tab */}
      {activeTab === "team" && (
        <TeamPanel />
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
                      {a.platform === "instagram" ? <Instagram size={14} color={C.instagram} /> : <Music size={14} color={C.tiktok} />}
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
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>mitunsverkaufen.de</div>
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
          <button onClick={() => setShowCreateModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: C.red, border: "none", borderRadius: 10, padding: "8px 18px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: `0 4px 16px ${C.redGlow}` }}>
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
                {[{ color: C.red, label: "Views" }, { color: C.green, label: "Likes" }, { color: C.blue, label: "Kommentare" }].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} /><span style={{ fontSize: 12, color: C.muted }}>{l.label}</span></div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={performance}>
                <defs>
                  <linearGradient id="vG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.red} stopOpacity={0.25} /><stop offset="100%" stopColor={C.red} stopOpacity={0} /></linearGradient>
                  <linearGradient id="lG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green} stopOpacity={0.25} /><stop offset="100%" stopColor={C.green} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} /><XAxis dataKey="month" stroke={C.dimmed} fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke={C.dimmed} fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmt} /><Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="views" name="Views" stroke={C.red} strokeWidth={2.5} fill="url(#vG)" dot={false} />
                <Area type="monotone" dataKey="likes" name="Likes" stroke={C.green} strokeWidth={2.5} fill="url(#lG)" dot={false} />
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
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#1E2A3A", overflow: "hidden" }}><div style={{ height: "100%", width: `${progress}%`, borderRadius: 4, background: `linear-gradient(90deg, ${C.red}, ${C.redLight})`, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)" }} /></div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.red, whiteSpace: "nowrap" }}>{filtered.length}/{MONTHLY_GOAL}</div>
          <div style={{ fontSize: 13, color: C.muted, whiteSpace: "nowrap" }}>{doneCount} erledigt · {MONTHLY_GOAL - filtered.length > 0 ? `${MONTHLY_GOAL - filtered.length} fehlen` : "Ziel erreicht!"}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {[{ key: "all", label: "Alle", count: filtered.length }, { key: "instagram", label: "Instagram", icon: Instagram, color: C.instagram, count: filtered.filter(p => p.platform === "instagram").length }, { key: "tiktok", label: "TikTok", icon: Music, color: C.tiktok, count: filtered.filter(p => p.platform === "tiktok").length }, { key: "offen", label: "Offen", count: filtered.filter(p => !p.done && p.status !== "failed").length }, { key: "erledigt", label: "Erledigt", count: filtered.filter(p => p.done).length }, { key: "failed", label: "Fehler", icon: AlertCircle, color: C.redLight, count: filtered.filter(p => p.status === "failed").length }].filter(f => f.key !== "failed" || f.count > 0).map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: `1px solid ${filter === f.key ? (f.color || C.red) : C.border}`, background: filter === f.key ? (f.color ? f.color + "15" : C.redGlow) : "transparent", color: filter === f.key ? (f.color || C.red) : C.muted, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit" }}>
              {f.icon && <f.icon size={14} />} {f.label} <span style={{ background: filter === f.key ? (f.color || C.red) + "30" : C.border, padding: "1px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: filter === f.key ? (f.color || C.red) : C.dimmed }}>{f.count}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 20px", fontSize: 11, fontWeight: 600, color: C.dimmed, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <div style={{ width: 28 }} /><div style={{ width: 36 }} /><div style={{ flex: 1 }}>Beitrag</div><div style={{ width: 80 }}>Status</div><div style={{ width: 70, textAlign: "right" }}>Views</div><div style={{ width: 60, textAlign: "right" }}>Likes</div><div style={{ width: 60, textAlign: "right" }}>Komm.</div><div style={{ width: 60, textAlign: "right" }}>Shares</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: C.dimmed, fontSize: 14 }}>Keine Beiträge für {MONTHS_DE[selectedMonth]} {selectedYear} gefunden.</div>
          )}
          {filtered.map((post) => {
            const pc = post.platform === "instagram" ? C.instagram : C.tiktok;
            const PI = post.platform === "instagram" ? Instagram : Music;
            return (
              <div key={post.id} onClick={() => toggle(post.id)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, cursor: "pointer", transition: "all 0.2s", opacity: post.done ? 0.6 : 1 }}
                onMouseOver={(e) => { e.currentTarget.style.background = C.cardHover; e.currentTarget.style.borderColor = pc + "40"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = C.card; e.currentTarget.style.borderColor = C.border; }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, border: post.done ? "none" : `2px solid ${C.border}`, background: post.done ? `linear-gradient(135deg, ${C.red}, #991B1B)` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: post.done ? `0 2px 8px ${C.redGlow}` : "none" }}>
                  {post.done && <Check size={14} color="#fff" strokeWidth={3} />}
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: pc + "15", display: "flex", alignItems: "center", justifyContent: "center" }}><PI size={17} color={pc} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.white, textDecoration: post.done ? "line-through" : "none", textDecorationColor: C.dimmed, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2, display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: pc, fontWeight: 600 }}>{post.type}</span><span style={{ color: C.border }}>·</span><span>{new Date(post.date).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}</span></div>
                </div>
                <div style={{ width: 80 }}><StatusBadge status={post.status} /></div>
                <div style={{ width: 70, textAlign: "right", fontSize: 13, fontWeight: 700, color: post.views > 0 ? C.white : C.dimmed }}>{post.views > 0 ? fmt(post.views) : "–"}</div>
                <div style={{ width: 60, textAlign: "right", fontSize: 13, fontWeight: 600, color: post.likes > 0 ? C.redLight : C.dimmed }}>{post.likes > 0 ? fmt(post.likes) : "–"}</div>
                <div style={{ width: 60, textAlign: "right", fontSize: 13, fontWeight: 600, color: post.comments > 0 ? C.muted : C.dimmed }}>{post.comments > 0 ? fmt(post.comments) : "–"}</div>
                <div style={{ width: 60, textAlign: "right", fontSize: 13, fontWeight: 600, color: post.shares > 0 ? C.muted : C.dimmed }}>{post.shares > 0 ? fmt(post.shares) : "–"}</div>
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

      {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreatePost} isSubmitting={isSubmitting} accounts={accounts} />}
    </div>
  );
}
