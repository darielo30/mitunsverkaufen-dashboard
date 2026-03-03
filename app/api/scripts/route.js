// ── Scripts Webhook API ─────────────────────────────────────────
// POST: Receive scripts from Make.com webhook
// GET:  Return all stored scripts
// DELETE: Remove a script by id

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// In-memory store (persists across warm invocations on Vercel)
// Client-side localStorage serves as the persistent backup
if (!globalThis.__scripts) {
  globalThis.__scripts = [];
}

function verifyAuth(request) {
  if (!WEBHOOK_SECRET) return true; // No secret configured = open (dev mode)
  const auth = request.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace("Bearer ", "").trim();
  return token === WEBHOOK_SECRET;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since"); // optional: only return scripts after this timestamp

  let scripts = globalThis.__scripts || [];

  if (since) {
    const sinceDate = new Date(since);
    scripts = scripts.filter((s) => new Date(s.receivedAt) > sinceDate);
  }

  return Response.json({ scripts, count: scripts.length });
}

export async function POST(request) {
  // Verify webhook authentication
  if (!verifyAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Support both single script and batch
    const incoming = Array.isArray(body) ? body : [body];
    const added = [];

    for (const item of incoming) {
      const script = {
        id: `script_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        title: item.title || "Untitled Script",
        script: item.script || item.text || item.content || "",
        competitor: item.competitor || item.source || null,
        originalUrl: item.originalUrl || item.url || null,
        date: item.date || new Date().toISOString().split("T")[0],
        receivedAt: new Date().toISOString(),
      };

      if (!script.script) {
        continue; // Skip entries without actual script content
      }

      globalThis.__scripts.push(script);
      added.push(script);
    }

    return Response.json({
      success: true,
      added: added.length,
      total: globalThis.__scripts.length,
      scripts: added,
    });
  } catch (err) {
    console.error("[Scripts Webhook] Error:", err);
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return Response.json({ error: "id required" }, { status: 400 });

    const before = globalThis.__scripts.length;
    globalThis.__scripts = globalThis.__scripts.filter((s) => s.id !== id);
    const removed = before - globalThis.__scripts.length;

    return Response.json({ success: true, removed, total: globalThis.__scripts.length });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
