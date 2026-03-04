// ── Scripts Webhook API ─────────────────────────────────────────
// POST: Receive scripts from Make.com webhook (supports full Discord message parsing)
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

// ── Parser: Extract structured data from the full Discord message ──
// Handles the format from the Make.com OpenAI → Discord flow:
//   Account: ...
//   Likes: ... Comments: ...
//   URL: ...
//   ═══ TEIL 1: ANALYSE ═══
//   Hook, Format, Watch-Time-Treiber, Winning Pattern
//   ═══ TEIL 2: ADAPTIERTES SKRIPT ═══
//   Hook:, Mittelteil:, CTA:
function parseFullMessage(text) {
  const result = {
    competitor: null,
    originalUrl: null,
    likes: null,
    comments: null,
    analysis: null,
    script: null,
    hook: null,
    format: null,
  };

  if (!text || typeof text !== "string") return result;

  // Extract competitor/account name
  const accountMatch = text.match(/Account:\s*(.+?)(?:\n|$)/i);
  if (accountMatch) result.competitor = accountMatch[1].trim();

  // Extract likes & comments
  const statsMatch = text.match(/Likes:\s*([\d.,]+).*?Comments:\s*([\d.,]+)/i);
  if (statsMatch) {
    result.likes = statsMatch[1].trim();
    result.comments = statsMatch[2].trim();
  }

  // Extract original URL
  const urlMatch = text.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/[^\s)>\]]+/i);
  if (urlMatch) result.originalUrl = urlMatch[0].trim();

  // Extract ANALYSE section (Teil 1)
  const analyseMatch = text.match(/TEIL\s*1[:\s]*.*?ANALYSE.*?\n([\s\S]*?)(?=TEIL\s*2|═══.*TEIL\s*2|$)/i);
  if (analyseMatch) result.analysis = analyseMatch[1].trim();

  // Extract HOOK from analysis
  const hookMatch = text.match(/HOOK:\s*[""]?(.*?)[""]?(?:\n|$)/i);
  if (hookMatch) result.hook = hookMatch[1].trim().replace(/^[""]|[""]$/g, "");

  // Extract FORMAT
  const formatMatch = text.match(/FORMAT:\s*(.+?)(?:\n|$)/i);
  if (formatMatch) result.format = formatMatch[1].trim();

  // Extract ADAPTIERTES SKRIPT section (Teil 2) — this is the main content we want
  const skriptMatch = text.match(/TEIL\s*2[:\s]*.*?(?:ADAPTIERTES?\s*SKRIPT|SKRIPT).*?\n([\s\S]*?)(?=Account:|Likes:|───|$)/i);
  if (skriptMatch) {
    result.script = skriptMatch[1].trim();
  }

  // Fallback: if no TEIL 2 found, try to extract Hook:/Mittelteil:/CTA: pattern
  if (!result.script) {
    const hookCtaMatch = text.match(/(Hook:[\s\S]*?CTA:[\s\S]*?)(?=Account:|Likes:|───|═══|$)/i);
    if (hookCtaMatch) result.script = hookCtaMatch[1].trim();
  }

  return result;
}

// Build a title from parsed data
function buildTitle(parsed, item) {
  if (item.title) return item.title;
  // Use the hook as title if available
  if (parsed.hook) {
    const short = parsed.hook.length > 60 ? parsed.hook.substring(0, 60) + "..." : parsed.hook;
    return short;
  }
  // Use format + competitor
  if (parsed.format && parsed.competitor) {
    return `${parsed.format} – ${parsed.competitor}`;
  }
  if (parsed.competitor) return `Skript von ${parsed.competitor}`;
  return "Adaptiertes Skript";
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since");

  let scripts = globalThis.__scripts || [];

  if (since) {
    const sinceDate = new Date(since);
    scripts = scripts.filter((s) => new Date(s.receivedAt) > sinceDate);
  }

  return Response.json({ scripts, count: scripts.length });
}

export async function POST(request) {
  if (!verifyAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Read raw body first, then try to parse as JSON — always fall back to plain text
    const rawText = await request.text();
    let body;

    try {
      body = JSON.parse(rawText);
    } catch {
      // Not valid JSON — treat the entire text as the script message
      body = { message: rawText };
    }

    const incoming = Array.isArray(body) ? body : [body];
    const added = [];

    for (const item of incoming) {
      // Check if this is a full Discord-style message or pre-structured data
      const rawText = item.message || item.text || item.content || item.script || "";
      const hasStructuredScript = item.script && !item.message;

      let scriptData;

      if (hasStructuredScript) {
        // Pre-structured: { title, script, competitor, ... }
        scriptData = {
          title: item.title || "Adaptiertes Skript",
          script: item.script,
          analysis: item.analysis || null,
          competitor: item.competitor || item.source || null,
          originalUrl: item.originalUrl || item.url || null,
          likes: item.likes || null,
          comments: item.comments || null,
          format: item.format || null,
        };
      } else {
        // Full message from Make.com — parse it
        const parsed = parseFullMessage(rawText);
        scriptData = {
          title: buildTitle(parsed, item),
          script: parsed.script || rawText, // fallback to full text if parsing fails
          analysis: parsed.analysis || null,
          competitor: item.competitor || parsed.competitor || null,
          originalUrl: item.originalUrl || parsed.originalUrl || null,
          likes: parsed.likes || null,
          comments: parsed.comments || null,
          format: parsed.format || null,
        };
      }

      if (!scriptData.script) continue;

      const script = {
        id: `script_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        ...scriptData,
        date: item.date || new Date().toISOString().split("T")[0],
        receivedAt: new Date().toISOString(),
      };

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
