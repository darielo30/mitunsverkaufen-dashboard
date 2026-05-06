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
    if (action === "posts") {
      const res = await fetch(`${BASE}/posts`, {
        headers: authHeaders(),
      });
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        return Response.json({ error: `Posts API non-JSON: ${rawText.substring(0, 300)}` }, { status: 500 });
      }
      return Response.json({ _raw: data, _status: res.status, _ok: res.ok, ...(typeof data === "object" && !Array.isArray(data) ? data : { posts: data }) });
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
    if (action === "post-analytics") {
      const postId = searchParams.get("postId");
      const res = await fetch(`${BASE}/analytics/${postId}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      return Response.json(data);
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
