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
      const payload = {
        content: body.content,
        platforms: body.platforms, // Already formatted with platform + accountId from frontend
      };

      // Media items (array of { type: "image"|"video", url: "..." })
      if (body.mediaItems && body.mediaItems.length > 0) {
        payload.mediaItems = body.mediaItems;
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
        // Merge into platform-specific data
        payload.platforms = payload.platforms.map((p) => {
          if (p.platform === "tiktok" && body.tiktokSettings) {
            return {
              ...p,
              platformSpecificData: {
                ...p.platformSpecificData,
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

      const data = await res.json();

      if (!res.ok) {
        console.error("[Late API] Error response:", res.status, data);
        return Response.json({ error: data.message || data.error || "API error", details: data }, { status: res.status });
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
