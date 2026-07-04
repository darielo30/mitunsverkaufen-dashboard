// ── Caption Generation via Claude Sonnet ───────────────────────
// Generates an Instagram/TikTok caption from a video transcript
// Set ANTHROPIC_API_KEY in your Vercel Environment Variables

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request) {
  if (!ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY not configured. Add it to your Vercel environment variables." },
      { status: 500 }
    );
  }

  try {
    const { transcript, platform } = await request.json();

    if (!transcript || !transcript.trim()) {
      return Response.json({ error: "Transcript is required" }, { status: 400 });
    }

    const platformHint = platform === "tiktok"
      ? "TikTok (casual, trend-aware, younger audience)"
      : "Instagram (polished, brand-aware, professional yet approachable)";

    const systemPrompt = `Du bist ein Social-Media-Experte für die Marke "mitunsverkaufen.de" – ein Vertriebsnetzwerk im Energiebereich. Du schreibst Captions auf Deutsch.

Dein Stil:
- Kurz, knackig, auf den Punkt
- Professionell aber nahbar
- Motivierend und aktivierend
- Nutze passende Emojis sparsam aber gezielt
- Verwende relevante Hashtags am Ende (5-10 Stück)
- Die Caption soll Engagement fördern (Frage am Ende, Call-to-Action)
- Schreibe im "wir"-Stil der Marke
- Halte das Sprachniveau niedrig/einfach – jeder soll es verstehen`;

    const userPrompt = `Erstelle eine ${platformHint} Caption basierend auf diesem Reel-Transkript:

---
${transcript.substring(0, 4000)}
---

Schreibe NUR die fertige Caption, keine Erklärungen. Die Caption soll den Kerninhalt des Videos zusammenfassen und als eigenständiger Post-Text funktionieren.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[Caption API] Anthropic error:", data);
      return Response.json(
        { error: data.error?.message || "Claude API error" },
        { status: res.status }
      );
    }

    const caption = data.content?.[0]?.text || "";
    return Response.json({ caption });
  } catch (err) {
    console.error("[Caption API] Exception:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
