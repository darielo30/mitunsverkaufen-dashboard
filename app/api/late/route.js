// ── Late API Proxy Route ─────────────────────────────────────────
// Keeps your API key secure on the server side
// Set LATE_API_KEY in your Vercel Environment Variables

const BASE = "https://getlate.dev/api/v1";
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
      const data = await res.json();
      return Response.json(data);
    }

    // Fetch all posts
    if (action === "posts") {
      const res = await fetch(`${BASE}/posts`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      return Response.json(data);
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

    // Fetch publishing logs
    if (action === "logs") {
      const res = await fetch(`${BASE}/logs`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      return Response.json(data);
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

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[Late API] Exception:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
