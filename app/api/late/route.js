// ── Late API Proxy Route ─────────────────────────────────────────
// Keeps your API key secure on the server side
// Set LATE_API_KEY in your Vercel Environment Variables

const LATE_API = "https://api.getlate.dev/v1";
const API_KEY = process.env.LATE_API_KEY;

function headers() {
  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    // ── Fetch all posts with analytics ──────────────────────
    if (action === "posts") {
      const res = await fetch(`${LATE_API}/posts`, { headers: headers() });
      const data = await res.json();
      return Response.json(data);
    }

    // ── Fetch analytics for a specific post ─────────────────
    if (action === "analytics") {
      const postId = searchParams.get("postId");
      const res = await fetch(`${LATE_API}/analytics/post/${postId}`, { headers: headers() });
      const data = await res.json();
      return Response.json(data);
    }

    // ── Fetch overall analytics ─────────────────────────────
    if (action === "analytics-overview") {
      const res = await fetch(`${LATE_API}/analytics`, { headers: headers() });
      const data = await res.json();
      return Response.json(data);
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const { action } = body;

  try {
    // ── Create & schedule a post ────────────────────────────
    if (action === "create-post") {
      const payload = {
        platforms: body.platforms, // ["instagram", "tiktok"]
        content: body.content,
        mediaUrls: body.mediaUrls || [],
      };

      // If scheduledDate is provided, add it for scheduling
      if (body.scheduledDate) {
        payload.scheduledDate = body.scheduledDate; // ISO 8601 format
      }

      const res = await fetch(`${LATE_API}/posts`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return Response.json(data);
    }

    // ── Delete a scheduled post ─────────────────────────────
    if (action === "delete-post") {
      const res = await fetch(`${LATE_API}/posts/${body.postId}`, {
        method: "DELETE",
        headers: headers(),
      });
      const data = await res.json();
      return Response.json(data);
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
