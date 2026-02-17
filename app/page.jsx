"use client";

import { useState } from "react";
import {
  Check, Eye, Heart, MessageCircle, Share2, Instagram, Music,
  TrendingUp, TrendingDown, Calendar, ChevronDown, Plus, BarChart3,
  Users, Search, Bell, Settings, LogOut
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

// ── Brand Colors ────────────────────────────────────────────────
const C = {
  bg: "#0B0F19",
  bgSoft: "#0F1320",
  card: "#131825",
  cardHover: "#1A2035",
  border: "#1E2A3A",
  red: "#DC2626",
  redGlow: "rgba(220,38,38,0.12)",
  redLight: "#EF4444",
  green: "#22C55E",
  greenGlow: "rgba(34,197,94,0.12)",
  blue: "#3B82F6",
  blueGlow: "rgba(59,130,246,0.12)",
  purple: "#8B5CF6",
  purpleGlow: "rgba(139,92,246,0.12)",
  white: "#F9FAFB",
  muted: "#9CA3AF",
  dimmed: "#6B7280",
  instagram: "#E1306C",
  tiktok: "#00F2EA",
};

// ── Mock Data ───────────────────────────────────────────────────
const monthlyPerformance = [
  { month: "Sep", views: 42000, likes: 3200, comments: 890, shares: 420 },
  { month: "Okt", views: 58000, likes: 4100, comments: 1200, shares: 680 },
  { month: "Nov", views: 71000, likes: 5400, comments: 1500, shares: 890 },
  { month: "Dez", views: 65000, likes: 4800, comments: 1350, shares: 760 },
  { month: "Jan", views: 89000, likes: 6200, comments: 1800, shares: 1100 },
  { month: "Feb", views: 94000, likes: 7100, comments: 2100, shares: 1340 },
];

const initialPostings = [
  { id: 1, platform: "instagram", type: "Reel", title: "Energievertrieb 2026 – So startest du durch", date: "2026-02-03", views: 12400, likes: 890, comments: 124, shares: 67, done: true },
  { id: 2, platform: "tiktok", type: "Video", title: "Door-to-Door Sales: 5 Tipps vom Profi", date: "2026-02-05", views: 34200, likes: 2100, comments: 310, shares: 445, done: true },
  { id: 3, platform: "instagram", type: "Karussell", title: "Partnermodell erklärt – Passives Einkommen", date: "2026-02-08", views: 8900, likes: 620, comments: 89, shares: 34, done: true },
  { id: 4, platform: "tiktok", type: "Video", title: "Tag im Leben eines Energieberaters", date: "2026-02-10", views: 51000, likes: 3400, comments: 520, shares: 780, done: false },
  { id: 5, platform: "instagram", type: "Reel", title: "Stadtwerke Krefeld Partnerschaft – Behind the Scenes", date: "2026-02-12", views: 6200, likes: 410, comments: 56, shares: 23, done: false },
  { id: 6, platform: "instagram", type: "Story", title: "Q&A: Häufigste Fragen zu unserem Netzwerk", date: "2026-02-14", views: 0, likes: 0, comments: 0, shares: 0, done: false },
  { id: 7, platform: "tiktok", type: "Video", title: "Vorher/Nachher: Agentur-Transformation", date: "2026-02-17", views: 0, likes: 0, comments: 0, shares: 0, done: false },
  { id: 8, platform: "instagram", type: "Reel", title: "Warum Stadtwerke Krefeld? Die Vorteile erklärt", date: "2026-02-19", views: 0, likes: 0, comments: 0, shares: 0, done: false },
  { id: 9, platform: "tiktok", type: "Video", title: "Recruiting-Strategie für Vertriebsagenturen", date: "2026-02-21", views: 0, likes: 0, comments: 0, shares: 0, done: false },
  { id: 10, platform: "instagram", type: "Karussell", title: "5 Gründe für mitunsverkaufen.de", date: "2026-02-24", views: 0, likes: 0, comments: 0, shares: 0, done: false },
  { id: 11, platform: "tiktok", type: "Video", title: "Live-Coaching: Einwandbehandlung an der Haustür", date: "2026-02-26", views: 0, likes: 0, comments: 0, shares: 0, done: false },
  { id: 12, platform: "instagram", type: "Reel", title: "Monatsrückblick Februar – Highlights", date: "2026-02-28", views: 0, likes: 0, comments: 0, shares: 0, done: false },
];

const fmt = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

// ── Stat Card ───────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, change, color, glowColor }) {
  const isUp = change >= 0;
  return (
    <div style={{
      background: C.card, borderRadius: 16, padding: "20px 24px",
      border: `1px solid ${C.border}`, flex: 1, minWidth: 190,
      transition: "all 0.2s", cursor: "default",
    }}
    onMouseOver={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 0 24px ${glowColor}`; }}
    onMouseOut={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: glowColor,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Icon size={20} color={color} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: isUp ? C.green : C.redLight, fontWeight: 600 }}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {isUp ? "+" : ""}{change}%
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: C.white, letterSpacing: "-0.03em" }}>{value}</div>
      <div style={{ fontSize: 13, color: C.muted, marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// ── Custom Tooltip ──────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1A2035", border: `1px solid ${C.border}`, borderRadius: 12,
      padding: "12px 16px", boxShadow: "0 12px 40px rgba(0,0,0,0.5)"
    }}>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 8, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, color: p.color, fontWeight: 600, marginBottom: 2 }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────
export default function Dashboard() {
  const [posts, setPosts] = useState(initialPostings);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = (id) => setPosts(posts.map((p) => (p.id === id ? { ...p, done: !p.done } : p)));

  const filtered = posts.filter((p) => {
    const matchesFilter =
      filter === "all" ? true :
      filter === "instagram" ? p.platform === "instagram" :
      filter === "tiktok" ? p.platform === "tiktok" :
      filter === "offen" ? !p.done :
      filter === "erledigt" ? p.done : true;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalViews = posts.reduce((a, p) => a + p.views, 0);
  const totalLikes = posts.reduce((a, p) => a + p.likes, 0);
  const totalComments = posts.reduce((a, p) => a + p.comments, 0);
  const totalShares = posts.reduce((a, p) => a + p.shares, 0);
  const doneCount = posts.filter((p) => p.done).length;
  const progress = Math.round((doneCount / posts.length) * 100);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.white }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: `1px solid ${C.border}`,
        background: "rgba(11,15,25,0.8)", backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${C.red}, #991B1B)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.04em",
            boxShadow: `0 4px 16px ${C.redGlow}`
          }}>M</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>mitunsverkaufen.de</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Social Media Dashboard</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: "8px 14px", width: 240,
          }}>
            <Search size={16} color={C.dimmed} />
            <input
              type="text" placeholder="Beiträge suchen..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "transparent", border: "none", outline: "none",
                color: C.white, fontSize: 13, width: "100%", fontFamily: "inherit"
              }}
            />
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: "8px 14px", color: C.white, fontSize: 13, cursor: "pointer",
          }}>
            <Calendar size={15} color={C.muted} /> Februar 2026 <ChevronDown size={13} color={C.muted} />
          </button>
          <button style={{
            width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center",
            justifyContent: "center", background: C.card, border: `1px solid ${C.border}`, cursor: "pointer",
          }}>
            <Bell size={16} color={C.muted} />
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, background: C.red, border: "none",
            borderRadius: 10, padding: "8px 18px", color: "#fff", fontSize: 13,
            fontWeight: 600, cursor: "pointer", boxShadow: `0 4px 16px ${C.redGlow}`,
          }}>
            <Plus size={15} /> Neuer Beitrag
          </button>
        </div>
      </header>

      <div style={{ padding: "28px 32px", maxWidth: 1440, margin: "0 auto" }}>

        {/* ── Stats Row ────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          <StatCard icon={Eye} label="Gesamte Views" value={fmt(totalViews)} change={18.2} color={C.red} glowColor={C.redGlow} />
          <StatCard icon={Heart} label="Gesamte Likes" value={fmt(totalLikes)} change={12.5} color={C.redLight} glowColor={C.redGlow} />
          <StatCard icon={MessageCircle} label="Kommentare" value={fmt(totalComments)} change={24.1} color={C.blue} glowColor={C.blueGlow} />
          <StatCard icon={Share2} label="Shares" value={fmt(totalShares)} change={31.4} color={C.green} glowColor={C.greenGlow} />
          <StatCard icon={Users} label="Fortschritt" value={`${doneCount}/${posts.length}`} change={progress} color={C.purple} glowColor={C.purpleGlow} />
        </div>

        {/* ── Charts Row ──────────────────────────────────── */}
        <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          {/* Views Trend */}
          <div style={{
            flex: 2, minWidth: 420, background: C.card, borderRadius: 16,
            border: `1px solid ${C.border}`, padding: 24
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Performance Trend</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Views & Engagement – letzte 6 Monate</div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { color: C.red, label: "Views" },
                  { color: C.green, label: "Likes" },
                  { color: C.blue, label: "Kommentare" },
                ].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />
                    <span style={{ fontSize: 12, color: C.muted }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={monthlyPerformance}>
                <defs>
                  <linearGradient id="vG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.red} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={C.red} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="lG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.green} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="month" stroke={C.dimmed} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={C.dimmed} fontSize={12} tickLine={false} axisLine={false} tickFormatter={fmt} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="views" name="Views" stroke={C.red} strokeWidth={2.5} fill="url(#vG)" dot={false} />
                <Area type="monotone" dataKey="likes" name="Likes" stroke={C.green} strokeWidth={2.5} fill="url(#lG)" dot={false} />
                <Area type="monotone" dataKey="comments" name="Kommentare" stroke={C.blue} strokeWidth={2} fill="transparent" dot={false} strokeDasharray="5 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Split */}
          <div style={{
            flex: 1, minWidth: 300, background: C.card, borderRadius: 16,
            border: `1px solid ${C.border}`, padding: 24
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Plattform-Vergleich</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Instagram vs. TikTok</div>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={[
                { name: "Views", ig: 27500, tt: 85200 },
                { name: "Likes", ig: 1920, tt: 5500 },
                { name: "Komm.", ig: 269, tt: 830 },
                { name: "Shares", ig: 124, tt: 1225 },
              ]} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="name" stroke={C.dimmed} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={C.dimmed} fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmt} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="ig" name="Instagram" fill={C.instagram} radius={[6, 6, 0, 0]} />
                <Bar dataKey="tt" name="TikTok" fill={C.tiktok} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Progress Bar ────────────────────────────────── */}
        <div style={{
          background: C.card, borderRadius: 14, border: `1px solid ${C.border}`,
          padding: "14px 24px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 20
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>Monatsfortschritt</div>
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#1E2A3A", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progress}%`, borderRadius: 4,
              background: `linear-gradient(90deg, ${C.red}, ${C.redLight})`,
              transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)"
            }} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.red, whiteSpace: "nowrap" }}>{progress}%</div>
          <div style={{ fontSize: 13, color: C.muted, whiteSpace: "nowrap" }}>{doneCount} von {posts.length} erledigt</div>
        </div>

        {/* ── Filter Bar ──────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {[
            { key: "all", label: "Alle", count: posts.length },
            { key: "instagram", label: "Instagram", icon: Instagram, color: C.instagram, count: posts.filter(p => p.platform === "instagram").length },
            { key: "tiktok", label: "TikTok", icon: Music, color: C.tiktok, count: posts.filter(p => p.platform === "tiktok").length },
            { key: "offen", label: "Offen", count: posts.filter(p => !p.done).length },
            { key: "erledigt", label: "Erledigt", count: posts.filter(p => p.done).length },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 16px", borderRadius: 8,
              border: `1px solid ${filter === f.key ? (f.color || C.red) : C.border}`,
              background: filter === f.key ? (f.color ? f.color + "15" : C.redGlow) : "transparent",
              color: filter === f.key ? (f.color || C.red) : C.muted,
              fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
              fontFamily: "inherit",
            }}>
              {f.icon && <f.icon size={14} />}
              {f.label}
              <span style={{
                background: filter === f.key ? (f.color || C.red) + "30" : C.border,
                padding: "1px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                color: filter === f.key ? (f.color || C.red) : C.dimmed
              }}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* ── Table Header ────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, padding: "10px 20px",
          fontSize: 11, fontWeight: 600, color: C.dimmed, textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          <div style={{ width: 28 }} />
          <div style={{ width: 36 }} />
          <div style={{ flex: 1 }}>Beitrag</div>
          <div style={{ width: 80, textAlign: "right" }}>Views</div>
          <div style={{ width: 70, textAlign: "right" }}>Likes</div>
          <div style={{ width: 70, textAlign: "right" }}>Komm.</div>
          <div style={{ width: 70, textAlign: "right" }}>Shares</div>
          <div style={{ width: 80 }} />
        </div>

        {/* ── Posting List ────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map((post) => {
            const isPublished = post.views > 0;
            const platformColor = post.platform === "instagram" ? C.instagram : C.tiktok;
            const PlatformIcon = post.platform === "instagram" ? Instagram : Music;
            return (
              <div key={post.id} onClick={() => toggle(post.id)} style={{
                display: "flex", alignItems: "center", gap: 16, padding: "12px 20px",
                borderRadius: 12, background: C.card, border: `1px solid ${C.border}`,
                cursor: "pointer", transition: "all 0.2s",
                opacity: post.done ? 0.6 : 1,
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = C.cardHover; e.currentTarget.style.borderColor = platformColor + "40"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = C.card; e.currentTarget.style.borderColor = C.border; }}
              >
                {/* Checkbox */}
                <div style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  border: post.done ? "none" : `2px solid ${C.border}`,
                  background: post.done ? `linear-gradient(135deg, ${C.red}, #991B1B)` : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                  boxShadow: post.done ? `0 2px 8px ${C.redGlow}` : "none",
                }}>
                  {post.done && <Check size={14} color="#fff" strokeWidth={3} />}
                </div>

                {/* Platform Badge */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: platformColor + "15",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <PlatformIcon size={17} color={platformColor} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 600, color: C.white,
                    textDecoration: post.done ? "line-through" : "none",
                    textDecorationColor: C.dimmed,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                  }}>
                    {post.title}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2, display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: platformColor, fontWeight: 600 }}>{post.type}</span>
                    <span style={{ color: C.border }}>·</span>
                    <span>{new Date(post.date).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}</span>
                  </div>
                </div>

                {/* Metrics */}
                {isPublished ? (
                  <>
                    <div style={{ width: 80, textAlign: "right", fontSize: 13, fontWeight: 700, color: C.white }}>{fmt(post.views)}</div>
                    <div style={{ width: 70, textAlign: "right", fontSize: 13, fontWeight: 600, color: C.redLight }}>{fmt(post.likes)}</div>
                    <div style={{ width: 70, textAlign: "right", fontSize: 13, fontWeight: 600, color: C.muted }}>{fmt(post.comments)}</div>
                    <div style={{ width: 70, textAlign: "right", fontSize: 13, fontWeight: 600, color: C.muted }}>{fmt(post.shares)}</div>
                    <div style={{ width: 80 }} />
                  </>
                ) : (
                  <>
                    <div style={{ width: 290, display: "flex", justifyContent: "flex-end" }}>
                      <div style={{
                        fontSize: 11, color: C.dimmed, fontWeight: 600, fontStyle: "italic",
                        background: C.bg, padding: "4px 14px", borderRadius: 6,
                        textTransform: "uppercase", letterSpacing: "0.06em"
                      }}>
                        Geplant
                      </div>
                    </div>
                    <div style={{ width: 80 }} />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* ── API Hint Footer ─────────────────────────────── */}
        <div style={{
          marginTop: 32, padding: 24, background: C.card, borderRadius: 16,
          border: `1px solid ${C.border}`, display: "flex", gap: 16, alignItems: "flex-start"
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: C.redGlow,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <BarChart3 size={22} color={C.red} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 4 }}>
              Live-Metriken aktivieren
            </div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
              Dieses Dashboard zeigt Beispieldaten. Verbinde die Instagram Graph API und die TikTok Business API,
              um echte Performance-Daten zu sehen. Die Integrationsanleitung findest du in der mitgelieferten Datei
              <span style={{ color: C.red, fontWeight: 600 }}> api-integration-guide.md</span>.
            </div>
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        <div style={{
          marginTop: 48, paddingTop: 20, borderTop: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 32
        }}>
          <div style={{ fontSize: 12, color: C.dimmed }}>© 2026 mitunsverkaufen.de GmbH</div>
          <div style={{ fontSize: 12, color: C.dimmed }}>Erstellt mit Claude AI</div>
        </div>
      </div>
    </div>
  );
}
