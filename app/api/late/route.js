// ── Late API Proxy Route ─────────────────────────────────────────
// Keeps your API key secure on the server side
// Set LATE_API_KEY in your Vercel Environment Variables

const BASE = "https://zernio.com/api/v1";
const API_KEY = process.env.LATE_API_KEY;

function authHeaders() {
  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
}

// ── GET: Fetch posts, analytics, accounts ───────────────────────
export async function GET(request) {
  if (!API_KEY) {
    return Response.json({ error: "LATE_API_KEY not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    // Fetch connected social accounts (needed for accountId)
    if (action === "accounts") {
      const res = await fetch(`${BASE}/accounts`, {
        headers: authHeaders(),
      });
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        return Response.json({ error: `Accounts API non-JSON: ${rawText.substring(0, 300)}`, raw: rawText.substring(0, 500) }, { status: 500 });
      }
      // Return the data plus debug info
      return Response.json({
        _raw: data,
        _status: res.status,
        _ok: res.ok,
        accounts: Array.isArray(data) ? data : (data.accounts || data.data || []),
      });
    }

    // Fetch all posts (include full platform data with platformPostUrl)
    // Zernio liefert per Default nur 10 Posts (max. 500 pro Seite) und
    // gibt ein pagination-Objekt zurueck. Wir laufen alle Seiten ab,
    // damit das Dashboard die komplette Historie filtern kann.
    if (action === "posts") {
      const PAGE_SIZE = 100;
      const MAX_PAGES = 20; // Sicherheitsnetz: max. 2000 Posts

      const collected = [];
      let pagination = null;
      let lastStatus = 200;
      let apiError = null;

      for (let page = 1; page <= MAX_PAGES; page++) {
        const params = new URLSearchParams({
          limit: String(PAGE_SIZE),
          page: String(page),
          sortBy: "scheduled-desc",
        });
        const res = await fetch(`${BASE}/posts?${params}`, { headers: authHeaders() });
        lastStatus = res.status;
        const rawText = await res.text();

        let data;
        try {
          data = JSON.parse(rawText);
        } catch {
          if (page === 1) {
            return Response.json({ error: `Posts API non-JSON: ${rawText.substring(0, 300)}` }, { status: 500 });
          }
          apiError = { stage: "parse", page, body: rawText.substring(0, 300) };
          break;
        }

        if (!res.ok) {
          if (page === 1) {
            return Response.json({ error: data.error || `Posts API Fehler (${res.status})`, details: data }, { status: res.status });
          }
          apiError = { stage: "http", page, status: res.status, body: data };
          break;
        }

        const items = Array.isArray(data) ? data : (data.posts || data.data || []);
        collected.push(...items);
        pagination = data.pagination || pagination;

        // Abbruch, wenn die letzte Seite erreicht ist
        const totalPages = pagination?.pages;
        if (totalPages && page >= totalPages) break;
        if (!totalPages && items.length < PAGE_SIZE) break;
        if (items.length === 0) break;
      }

      return Response.json({
        posts: collected,
        pagination,
        _count: collected.length,
        _status: lastStatus,
        _ok: true,
        _error: apiError,
      });
    }

    // Fetch single post by ID (debug: shows all platform fields incl. platformPostUrl)
    if (action === "post-detail") {
      const postId = searchParams.get("postId");
      if (!postId) return Response.json({ error: "postId required" }, { status: 400 });
      const res = await fetch(`${BASE}/posts/${postId}`, { headers: authHeaders() });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch { return Response.json({ error: rawText.substring(0, 300) }, { status: 500 }); }
      return Response.json({ _raw: data, _status: res.status });
    }

    // Fetch analytics overview
    if (action === "analytics") {
      const res = await fetch(`${BASE}/analytics`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      return Response.json(data);
    }

    // Fetch analytics for a specific post
    // Wichtig: Zernio erwartet ?postId=… – NICHT /analytics/{id}
    if (action === "post-analytics") {
      const postId = searchParams.get("postId");
      if (!postId) return Response.json({ error: "postId required" }, { status: 400 });
      const res = await fetch(`${BASE}/analytics?postId=${encodeURIComponent(postId)}`, {
        headers: authHeaders(),
      });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch { return Response.json({ error: rawText.substring(0, 300) }, { status: 500 }); }
      return Response.json({ _raw: data, _status: res.status, _ok: res.ok });
    }

    // ── Kennzahlen für ALLE Posts auf einmal ────────────────
    // GET /analytics ohne postId liefert eine paginierte Liste, in der
    // jeder Eintrag bereits analytics + platformAnalytics enthält.
    if (action === "posts-analytics") {
      // Bevorzugter Weg: Einzelabfrage je Post.
      // Nur dort löst Zernio eine Zernio-Post-ID automatisch auf die
      // zugehörigen External-Post-Analytics auf. Die Listenabfrage
      // liefert stattdessen externe Einträge mit fremden IDs.
      const idParam = searchParams.get("postIds");
      if (idParam) {
        const ids = idParam.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 50);

        const results = await Promise.all(ids.map(async (id) => {
          try {
            const res = await fetch(`${BASE}/analytics?postId=${encodeURIComponent(id)}`, { headers: authHeaders() });
            const text = await res.text();
            let d;
            try { d = JSON.parse(text); } catch {
              return { _requestedId: id, _error: { status: res.status, body: text.substring(0, 200) } };
            }
            // 202 = Sync läuft noch, 424 = alle Plattformen fehlgeschlagen
            if (!res.ok && res.status !== 202) {
              return { _requestedId: id, _error: { status: res.status, body: d } };
            }
            return { ...d, _requestedId: id, _httpStatus: res.status };
          } catch (e) {
            return { _requestedId: id, _error: { message: e.message } };
          }
        }));

        return Response.json({
          posts: results,
          _count: results.length,
          _mode: "byId",
          _withAnalytics: results.filter((r) => r.analytics).length,
        });
      }

      const fromDate = searchParams.get("fromDate")
        || new Date(Date.now() - 365 * 86400000).toISOString().split("T")[0];
      const toDate = searchParams.get("toDate") || new Date().toISOString().split("T")[0];

      const collected = [];
      let lastStatus = 200;
      let apiError = null;
      let firstPayloadKeys = null;

      // Bis zu 5 Seiten à 100 Einträge einsammeln
      for (let page = 1; page <= 5; page++) {
        const params = new URLSearchParams({ limit: "100", page: String(page), fromDate, toDate });
        const url = `${BASE}/analytics?${params}`;
        const res = await fetch(url, { headers: authHeaders() });
        lastStatus = res.status;
        const text = await res.text();

        let data;
        try { data = JSON.parse(text); } catch {
          apiError = { stage: "parse", status: res.status, body: text.substring(0, 400), url };
          break;
        }

        if (!res.ok) {
          apiError = { stage: "http", status: res.status, body: data, url };
          break;
        }

        // Antwortformat tolerant auslesen – erste Array-Eigenschaft gewinnt
        let items = Array.isArray(data) ? data
          : data.posts || data.data || data.results || data.items || data.analytics || null;
        if (!Array.isArray(items) && data && typeof data === "object") {
          const arrKey = Object.keys(data).find((k) => Array.isArray(data[k]));
          items = arrKey ? data[arrKey] : [];
        }
        if (!Array.isArray(items)) items = [];

        // Beim ersten Durchlauf die Top-Level-Keys mitgeben – hilft,
        // ein unerwartetes Antwortformat sofort zu erkennen.
        if (page === 1) {
          firstPayloadKeys = Array.isArray(data) ? ["<array>"] : Object.keys(data);
          if (!Array.isArray(items) || items.length === 0) {
            apiError = apiError || { stage: "empty", status: res.status, keys: firstPayloadKeys, sample: JSON.stringify(data).substring(0, 400) };
          }
        }

        if (!Array.isArray(items)) break;
        collected.push(...items);
        if (items.length < 100) break;
      }

      return Response.json({
        posts: collected,
        _count: collected.length,
        _status: lastStatus,
        _keys: firstPayloadKeys,
        _error: apiError,
        _range: { fromDate, toDate },
      });
    }

    // ── Advanced Analytics Endpoints ─────────────────────────
    if (action === "analytics-daily") {
      const platform = searchParams.get("platform") || "";
      const profileId = searchParams.get("profileId") || "";
      const fromDate = searchParams.get("fromDate") || "";
      const toDate = searchParams.get("toDate") || "";
      const params = new URLSearchParams();
      if (platform) params.set("platform", platform);
      if (profileId) params.set("profileId", profileId);
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);
      const res = await fetch(`${BASE}/analytics/daily-metrics?${params}`, { headers: authHeaders() });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch { return Response.json({ error: rawText.substring(0, 300) }, { status: 500 }); }
      return Response.json({ _raw: data, _status: res.status, _ok: res.ok });
    }

    if (action === "analytics-best-time") {
      const platform = searchParams.get("platform") || "";
      const profileId = searchParams.get("profileId") || "";
      const params = new URLSearchParams();
      if (platform) params.set("platform", platform);
      if (profileId) params.set("profileId", profileId);
      const res = await fetch(`${BASE}/analytics/best-time?${params}`, { headers: authHeaders() });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch { return Response.json({ error: rawText.substring(0, 300) }, { status: 500 }); }
      return Response.json({ _raw: data, _status: res.status, _ok: res.ok });
    }

    if (action === "analytics-content-decay") {
      const platform = searchParams.get("platform") || "";
      const profileId = searchParams.get("profileId") || "";
      const params = new URLSearchParams();
      if (platform) params.set("platform", platform);
      if (profileId) params.set("profileId", profileId);
      const res = await fetch(`${BASE}/analytics/content-decay?${params}`, { headers: authHeaders() });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch { return Response.json({ error: rawText.substring(0, 300) }, { status: 500 }); }
      return Response.json({ _raw: data, _status: res.status, _ok: res.ok });
    }

    if (action === "analytics-frequency") {
      const platform = searchParams.get("platform") || "";
      const profileId = searchParams.get("profileId") || "";
      const params = new URLSearchParams();
      if (platform) params.set("platform", platform);
      if (profileId) params.set("profileId", profileId);
      const res = await fetch(`${BASE}/analytics/posting-frequency?${params}`, { headers: authHeaders() });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch { return Response.json({ error: rawText.substring(0, 300) }, { status: 500 }); }
      return Response.json({ _raw: data, _status: res.status, _ok: res.ok });
    }

    // Fetch publishing logs
    if (action === "logs") {
      const res = await fetch(`${BASE}/logs`, {
        headers: authHeaders(),
      });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch { return Response.json({ error: rawText.substring(0, 300) }, { status: 500 }); }
      return Response.json({ _raw: data, _status: res.status, _ok: res.ok });
    }

    // Fetch single log detail
    if (action === "log-detail") {
      const logId = searchParams.get("logId");
      if (!logId) return Response.json({ error: "logId required" }, { status: 400 });
      const res = await fetch(`${BASE}/logs/${logId}`, { headers: authHeaders() });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch { return Response.json({ error: rawText.substring(0, 300) }, { status: 500 }); }
      return Response.json({ _raw: data, _status: res.status, _ok: res.ok });
    }

    // Fetch inbox comments (notifications)
    if (action === "inbox-comments") {
      const platform = searchParams.get("platform");
      const url = platform
        ? `${BASE}/inbox/comments?platform=${platform}`
        : `${BASE}/inbox/comments`;
      const res = await fetch(url, { headers: authHeaders() });
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        return Response.json({ error: `Inbox API non-JSON: ${rawText.substring(0, 300)}` }, { status: 500 });
      }
      return Response.json({ _raw: data, _status: res.status, _ok: res.ok });
    }

    // Fetch inbox conversations (DMs)
    if (action === "inbox-conversations") {
      const platform = searchParams.get("platform");
      const url = platform
        ? `${BASE}/inbox/conversations?platform=${platform}`
        : `${BASE}/inbox/conversations`;
      const res = await fetch(url, { headers: authHeaders() });
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        return Response.json({ error: `Inbox API non-JSON: ${rawText.substring(0, 300)}` }, { status: 500 });
      }
      return Response.json({ _raw: data, _status: res.status, _ok: res.ok });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// ── POST: Create posts, upload media ────────────────────────────
export async function POST(request) {
  if (!API_KEY) {
    return Response.json({ error: "LATE_API_KEY not configured" }, { status: 500 });
  }

  const body = await request.json();
  const { action } = body;

  try {
    // ── Create & schedule a post ────────────────────────────
    if (action === "create-post") {
      // Clean platforms array – remove entries without accountId
      const cleanPlatforms = (body.platforms || [])
        .filter((p) => p.platform && p.accountId)
        .map((p) => {
          const clean = { platform: p.platform, accountId: p.accountId };
          if (p.platformSpecificData) clean.platformSpecificData = p.platformSpecificData;
          return clean;
        });

      if (cleanPlatforms.length === 0) {
        return Response.json({
          error: "Keine Plattform mit verbundenem Account ausgewählt. Verbinde zuerst einen Account in Late.",
          details: { platformsReceived: body.platforms },
        }, { status: 400 });
      }

      const payload = {
        content: body.content,
        platforms: cleanPlatforms,
      };

      // Media items – only include items with valid URLs
      if (body.mediaItems && body.mediaItems.length > 0) {
        const validMedia = body.mediaItems.filter((m) => m.url && m.url !== "local");
        if (validMedia.length > 0) {
          payload.mediaItems = validMedia;
        }
      }

      // Schedule for later or post now
      if (body.scheduledFor) {
        payload.scheduledFor = body.scheduledFor;
      } else if (body.publishNow) {
        payload.publishNow = true;
      }

      // Timezone (e.g. "Europe/Berlin")
      if (body.timezone) {
        payload.timezone = body.timezone;
      }

      // TikTok-specific: video cover timestamp for thumbnail
      if (body.tiktokSettings) {
        payload.platforms = payload.platforms.map((p) => {
          if (p.platform === "tiktok") {
            return {
              ...p,
              platformSpecificData: {
                ...(p.platformSpecificData || {}),
                ...body.tiktokSettings,
              },
            };
          }
          return p;
        });
      }

      console.log("[Late API] Creating post with payload:", JSON.stringify(payload, null, 2));

      const res = await fetch(`${BASE}/posts`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      // Read raw response text first for better error reporting
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        console.error("[Late API] Non-JSON response:", res.status, rawText);
        return Response.json({ error: `Late API Fehler (${res.status}): ${rawText.substring(0, 200)}` }, { status: res.status });
      }

      if (!res.ok) {
        // Extract error from all possible response formats
        const errMsg = data.message || data.error || data.detail ||
          (data.errors && Array.isArray(data.errors) ? data.errors.map(e => e.message || e).join(", ") : null) ||
          JSON.stringify(data).substring(0, 200);
        console.error("[Late API] Error response:", res.status, data);
        return Response.json({ error: errMsg, details: data, status: res.status }, { status: res.status });
      }

      return Response.json(data);
    }

    // ── Request presigned upload URL ────────────────────────
    if (action === "presign-upload") {
      const res = await fetch(`${BASE}/media/presign`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          filename: body.filename,
          contentType: body.contentType,
        }),
      });
      const data = await res.json();
      return Response.json(data);
    }

    // ── Update an existing (draft/scheduled) post ────────────
    if (action === "update-post") {
      const { postId } = body;
      if (!postId) return Response.json({ error: "postId required" }, { status: 400 });

      const payload = {};
      if (body.content !== undefined) payload.content = body.content;
      if (body.platforms) {
        payload.platforms = body.platforms
          .filter((p) => p.platform && p.accountId)
          .map((p) => {
            const clean = { platform: p.platform, accountId: p.accountId };
            if (p.platformSpecificData) clean.platformSpecificData = p.platformSpecificData;
            return clean;
          });
      }
      if (body.scheduledFor !== undefined) payload.scheduledFor = body.scheduledFor;
      if (body.timezone !== undefined) payload.timezone = body.timezone;

      const res = await fetch(`${BASE}/posts/${postId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch { return Response.json({ error: rawText.substring(0, 300) }, { status: res.status }); }
      if (!res.ok) {
        const errMsg = data.message || data.error || JSON.stringify(data).substring(0, 200);
        return Response.json({ error: errMsg, details: data }, { status: res.status });
      }
      return Response.json(data);
    }

    // ── Delete a post ───────────────────────────────────────
    if (action === "delete-post") {
      const res = await fetch(`${BASE}/posts/${body.postId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      return Response.json(data);
    }

    // ── Reply to inbox conversation (DM) ───────────────────
    if (action === "inbox-reply") {
      const { conversationId, message } = body;
      if (!conversationId || !message) {
        return Response.json({ error: "conversationId and message required" }, { status: 400 });
      }
      const res = await fetch(`${BASE}/inbox/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ message }),
      });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch { return Response.json({ error: rawText.substring(0, 300) }, { status: 500 }); }
      if (!res.ok) return Response.json({ error: data.message || data.error || "Fehler beim Senden", details: data }, { status: res.status });
      return Response.json(data);
    }

    // ── Hide/unhide comment ────────────────────────────────
    if (action === "hide-comment") {
      const { postId, commentId } = body;
      if (!postId || !commentId) return Response.json({ error: "postId and commentId required" }, { status: 400 });
      const res = await fetch(`${BASE}/inbox/comments/${postId}/${commentId}/hide`, {
        method: "POST",
        headers: authHeaders(),
      });
      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); } catch { return Response.json({ error: rawText.substring(0, 300) }, { status: 500 }); }
      return Response.json(data);
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[Late API] Exception:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
