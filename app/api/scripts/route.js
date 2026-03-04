// ── Scripts Webhook API ─────────────────────────────────────────
// POST: Receive scripts from Make.com webhook (supports full Discord message parsing)
// GET:  Return all stored scripts (+ accept client sync)
// DELETE: Remove a script by id

import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync, mkdirSync } from "fs";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const STORAGE_DIR = "/tmp/scripts";

// ── Persistent storage: one file per script (no race conditions) ──
function ensureDir() {
  try { if (!existsSync(STORAGE_DIR)) mkdirSync(STORAGE_DIR, { recursive: true }); } catch {}
}

function loadScripts() {
  ensureDir();
  const scripts = [];
  try {
    const files = readdirSync(STORAGE_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const data = JSON.parse(readFileSync(`${STORAGE_DIR}/${file}`, "utf-8"));
        scripts.push(data);
      } catch {}
    }
  } catch {}
  return scripts.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
}

function saveScript(script) {
  ensureDir();
  try {
    writeFileSync(`${STORAGE_DIR}/${script.id}.json`, JSON.stringify(script), "utf-8");
  } catch (err) {
    console.error("[Scripts] Failed to write:", err.message);
  }
}

function deleteScriptFile(id) {
  try {
    const path = `${STORAGE_DIR}/${id}.json`;
    if (existsSync(path)) unlinkSync(path);
  } catch {}
}

function getScripts() {
  if (!globalThis.__scripts || globalThis.__scripts.length === 0) {
    globalThis.__scripts = loadScripts();
  }
  return globalThis.__scripts;
}

function addScript(script) {
  saveScript(script); // Write individual file first (no race condition)
  // Then update in-memory cache
  if (!globalThis.__scripts) globalThis.__scripts = [];
  globalThis.__scripts.push(script);
}

function verifyAuth(request) {
  if (!WEBHOOK_SECRET) return true;
  const auth = request.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace("Bearer ", "").trim();
  return token === WEBHOOK_SECRET;
}

// ── Parser: Extract structured data from the full Discord message ──
function parseFullMessage(text) {
  const result = {
    competitor: null, originalUrl: null, likes: null, comments: null,
    analysis: null, script: null, hook: null, format: null,
  };

  if (!text || typeof text !== "string") return result;

  const accountMatch = text.match(/Account:\s*(.+?)(?:\n|$)/i);
  if (accountMatch) result.competitor = accountMatch[1].trim();

  const statsMatch = text.match(/Likes:\s*([\d.,]+).*?Comments:\s*([\d.,]+)/i);
  if (statsMatch) {
    result.likes = statsMatch[1].trim();
    result.comments = statsMatch[2].trim();
  }

  const urlMatch = text.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/[^\s)>\]]+/i);
  if (urlMatch) result.originalUrl = urlMatch[0].trim();

  const analyseMatch = text.match(/TEIL\s*1[:\s]*.*?ANALYSE.*?\n([\s\S]*?)(?=TEIL\s*2|═══.*TEIL\s*2|$)/i);
  if (analyseMatch) result.analysis = analyseMatch[1].trim();

  const hookMatch = text.match(/HOOK:\s*[""\u201C\u201D]?(.*?)[""\u201C\u201D]?(?:\n|$)/i);
  if (hookMatch) result.hook = hookMatch[1].trim().replace(/^[""\u201C\u201D]|[""\u201C\u201D]$/g, "");

  const formatMatch = text.match(/FORMAT:\s*(.+?)(?:\n|$)/i);
  if (formatMatch) result.format = formatMatch[1].trim();

  // Extract ADAPTIERTES SKRIPT section (Teil 2)
  const skriptMatch = text.match(/TEIL\s*2[:\s]*.*?(?:ADAPTIERTES?\s*SKRIPT|SKRIPT).*?\n([\s\S]*?)(?=Account:|Likes:\s*\d|───|$)/i);
  if (skriptMatch) result.script = skriptMatch[1].trim();

  // Fallback: Hook:/Mittelteil:/CTA: pattern
  if (!result.script) {
    const hookCtaMatch = text.match(/(Hook:[\s\S]*?CTA:[\s\S]*?)(?=Account:|Likes:\s*\d|───|═══|$)/i);
    if (hookCtaMatch) result.script = hookCtaMatch[1].trim();
  }

  return result;
}

function buildTitle(parsed, item) {
  if (item.title) return item.title;
  if (parsed.hook) {
    return parsed.hook.length > 60 ? parsed.hook.substring(0, 60) + "..." : parsed.hook;
  }
  if (parsed.format && parsed.competitor) return `${parsed.format} – ${parsed.competitor}`;
  if (parsed.competitor) return `Skript von ${parsed.competitor}`;
  return "Adaptiertes Skript";
}

// ── GET: Return scripts + accept client sync ────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Client can sync its localStorage scripts back to server
  const clientSync = searchParams.get("sync");
  if (clientSync) {
    try {
      const clientScripts = JSON.parse(decodeURIComponent(clientSync));
      if (Array.isArray(clientScripts) && clientScripts.length > 0) {
        const current = getScripts();
        const existingIds = new Set(current.map((s) => s.id));
        const newFromClient = clientScripts.filter((s) => s.id && !existingIds.has(s.id));
        if (newFromClient.length > 0) {
          for (const s of newFromClient) saveScript(s);
          globalThis.__scripts = [...current, ...newFromClient];
        }
      }
    } catch {}
  }

  const scripts = getScripts();
  return Response.json({ scripts, count: scripts.length });
}

// ── POST: Receive scripts from webhook ──────────────────────────
export async function POST(request) {
  if (!verifyAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawText = await request.text();
    let body;

    try {
      body = JSON.parse(rawText);
    } catch {
      body = { message: rawText };
    }

    const incoming = Array.isArray(body) ? body : [body];
    const added = [];

    for (const item of incoming) {
      const msgText = item.message || item.text || item.content || item.script || "";
      const hasStructuredScript = item.script && !item.message;

      let scriptData;

      if (hasStructuredScript) {
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
        const parsed = parseFullMessage(msgText);
        scriptData = {
          title: buildTitle(parsed, item),
          script: parsed.script || msgText,
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

      addScript(script);
      added.push(script);
    }

    return Response.json({
      success: true,
      added: added.length,
      total: getScripts().length,
      scripts: added,
    });
  } catch (err) {
    console.error("[Scripts Webhook] Error:", err);
    return Response.json({ error: err.message }, { status: 400 });
  }
}

// ── DELETE: Remove a script ─────────────────────────────────────
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return Response.json({ error: "id required" }, { status: 400 });

    const scripts = getScripts();
    const filtered = scripts.filter((s) => s.id !== id);
    const removed = scripts.length - filtered.length;
    globalThis.__scripts = filtered;
    deleteScriptFile(id);

    return Response.json({ success: true, removed, total: filtered.length });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
