"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Check, Eye, Heart, MessageCircle, Share2, Instagram, Music,
  TrendingUp, TrendingDown, Calendar, ChevronDown, Plus, BarChart3,
  Users, Search, X, Clock, Send, Loader2,
  RefreshCw, Wifi, WifiOff, Upload, FileVideo, Trash2, ChevronLeft, ChevronRight,
  Globe, SkipForward, SkipBack, Scissors
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
  const config = { published: { label: "Live", color: C.green, bg: C.greenGlow }, scheduled: { label: "Geplant", color: C.yellow, bg: C.yellowGlow }, draft: { label: "Entwurf", color: C.dimmed, bg: "rgba(107,114,128,0.12)" } };
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

  const showNotif = (text, color) => { setNotification({ text, color }); setTimeout(() => setNotification(null), 4000); };

  // Fetch connected accounts from Late
  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch("/api/late?action=accounts");
      if (!res.ok) return;
      const data = await res.json();
      if (data.error) return;
      if (Array.isArray(data)) {
        setAccounts(data);
        setIsConnected(true);
      } else if (data.accounts && Array.isArray(data.accounts)) {
        setAccounts(data.accounts);
        setIsConnected(true);
      }
    } catch {
      // API not available
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
        // Show error details
        const errMsg = data.details?.message || data.error || "Unbekannter Fehler";
        const np = { id: Date.now(), platform: platforms[0]?.platform || "instagram", type: mediaItems?.length ? "Video" : "Post",
          title: content.substring(0, 60) + (content.length > 60 ? "..." : ""),
          date: scheduledFor || new Date().toISOString(), views: 0, likes: 0, comments: 0, shares: 0,
          done: false, status: scheduledFor ? "scheduled" : publishNow ? "published" : "draft" };
        setPosts((prev) => [np, ...prev]);
        showNotif(`Fehler: ${errMsg} – Beitrag lokal gespeichert`, "yellow");
      } else {
        showNotif(scheduledFor ? "Beitrag erfolgreich geplant!" : "Beitrag wird gepostet!", "green");
        fetchPosts();
      }
    } catch (err) {
      const np = { id: Date.now(), platform: platforms[0]?.platform || "instagram", type: "Post",
        title: content.substring(0, 60) + (content.length > 60 ? "..." : ""),
        date: scheduledFor || new Date().toISOString(), views: 0, likes: 0, comments: 0, shares: 0,
        done: false, status: scheduledFor ? "scheduled" : "draft" };
      setPosts((prev) => [np, ...prev]);
      showNotif("Netzwerkfehler – Beitrag lokal gespeichert", "yellow");
    } finally { setIsSubmitting(false); setShowCreateModal(false); }
  };

  const toggle = (id) => setPosts(posts.map((p) => p.id === id ? { ...p, done: !p.done } : p));

  // Filter by month + search + platform/status
  const filtered = posts.filter((p) => {
    const d = new Date(p.date);
    const matchesMonth = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    const matchesFilter = filter === "all" ? true : filter === "instagram" ? p.platform === "instagram" : filter === "tiktok" ? p.platform === "tiktok" : filter === "offen" ? !p.done : filter === "erledigt" ? p.done : true;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMonth && matchesFilter && matchesSearch;
  });

  const totalViews = filtered.reduce((a, p) => a + p.views, 0);
  const totalLikes = filtered.reduce((a, p) => a + p.likes, 0);
  const totalComments = filtered.reduce((a, p) => a + p.comments, 0);
  const totalShares = filtered.reduce((a, p) => a + p.shares, 0);
  const doneCount = filtered.filter((p) => p.done).length;
  const progress = filtered.length > 0 ? Math.round((doneCount / filtered.length) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 200, background: C.card, border: `1px solid ${notification.color === "green" ? C.green : C.yellow}`, borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", maxWidth: 420 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: notification.color === "green" ? C.green : C.yellow, flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{notification.text}</span>
        </div>
      )}

      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: "rgba(11,15,25,0.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${C.red}, #991B1B)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.04em", boxShadow: `0 4px 16px ${C.redGlow}` }}>M</div>
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
          <StatCard icon={Eye} label="Views" value={fmt(totalViews)} change={18.2} color={C.red} glowColor={C.redGlow} />
          <StatCard icon={Heart} label="Likes" value={fmt(totalLikes)} change={12.5} color={C.redLight} glowColor={C.redGlow} />
          <StatCard icon={MessageCircle} label="Kommentare" value={fmt(totalComments)} change={24.1} color={C.blue} glowColor={C.blueGlow} />
          <StatCard icon={Share2} label="Shares" value={fmt(totalShares)} change={31.4} color={C.green} glowColor={C.greenGlow} />
          <StatCard icon={Users} label="Fortschritt" value={`${doneCount}/${filtered.length}`} change={progress} color={C.purple} glowColor={C.purpleGlow} />
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
          <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>Monatsfortschritt</div>
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#1E2A3A", overflow: "hidden" }}><div style={{ height: "100%", width: `${progress}%`, borderRadius: 4, background: `linear-gradient(90deg, ${C.red}, ${C.redLight})`, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)" }} /></div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.red, whiteSpace: "nowrap" }}>{progress}%</div>
          <div style={{ fontSize: 13, color: C.muted, whiteSpace: "nowrap" }}>{doneCount} von {filtered.length} erledigt</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {[{ key: "all", label: "Alle", count: filtered.length }, { key: "instagram", label: "Instagram", icon: Instagram, color: C.instagram, count: filtered.filter(p => p.platform === "instagram").length }, { key: "tiktok", label: "TikTok", icon: Music, color: C.tiktok, count: filtered.filter(p => p.platform === "tiktok").length }, { key: "offen", label: "Offen", count: filtered.filter(p => !p.done).length }, { key: "erledigt", label: "Erledigt", count: filtered.filter(p => p.done).length }].map((f) => (
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

      {showCreateModal && <CreatePostModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreatePost} isSubmitting={isSubmitting} accounts={accounts} />}
    </div>
  );
}
