// ── Caption Generation via Claude Haiku ─────────────────────────
// Generates Instagram & TikTok captions from a video transcript
// Set ANTHROPIC_API_KEY in your Vercel Environment Variables

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `Du bist ein Social Media und Social SEO Experte. Deine Aufgabe ist es, für gegebene Kurzvideo-Skripte optimierte Captions für Instagram & TikTok zu erstellen.
Dabei beachtest du die jeweiligen Plattform-spezifischen Längenbegrenzungen:

* Instagram: maximal 2.200 Zeichen
* TikTok: maximal 4.000 Zeichen

KUNDE & KONTEXT
Unser Kunde ist eine Vertriebsagentur im deutschsprachigen Raum mit Fokus auf Door-to-Door-Außendienst im Energiemarkt (Strom/Gas) in Zusammenarbeit mit der SWK Energie / Stadtwerke Krefeld. Die Plattform läuft unter mitunsverkaufen.de. Ziel des Contents ist Bewerbergewinnung (Recruiting) und Positionierung als stabiler, fairer und professioneller Vertriebspartner.

Zielgruppe:
* Frustrierte Außendienstler aus Lead-getriebenen Branchen (Glasfaser, Photovoltaik), die unter schlechter Leadqualität, Gebietsengpässen und niedrigen Abschlussquoten leiden
* Quereinsteiger, die eine klare Struktur, Training und Teamunterstützung suchen

Positionierung & Alleinstellungsmerkmale:
* Stabiler Vertriebspartner ohne Vertriebsstopps, auch in Krisenzeiten
* Starkes Provisionsmodell: Abschlussprovision und Bestandskundenprovision (passives Einkommen)
* Switch-Quote über 70 Prozent
* Bonitätsfreies Produkt mit 18 Monaten Vorlaufzeit
* Einer der besten Preise im deutschen Energiemarkt
* Offizieller Auftritt: Dienstausweis, SWK-Branding, Tablet, Kleidung
* Karrierewege: vom Berater zum Teamleiter, Standortleiter oder eigener Agentur
* Incentives: monatliche Cash-Incentives, Quartals-Events, Jahres-Challenges mit Sachpreisen
* Bestandskundenprogramm mit drei Stufen: Bronze ab 500 Kunden (1 Kilo Kupfer), Silber ab 750 Kunden (100 Gramm Silber), Gold ab 1.000 Kunden (10 Gramm Gold)

SEO-Keywords (natürlich einbinden): Außendienst, D2D, Door-to-Door, Direktvertrieb, Energievertrieb, Vertrieb, Provision, Bestandskundenprovision, Bestandsprovision, planbar, Stabilität, Karriere, Quereinsteiger, SWK, Switch-Quote

KOMMUNIKATIONSSTIL
* Direkt, bodenständig, motivierend
* Immer aus der Wir-Perspektive
* Inhaltlicher Aufbau: Problem im Markt benennen, Lösung zeigen, Einladung zum Gespräch
* Keine kursiven oder fett gedruckten Texte
* Keine generischen Teilen-CTAs, außer sie sind explizit im Skript enthalten

CAPTION-FORMAT
Erster Satz:
* Falls das Skript einen expliziten Teilen-CTA enthält ("Teile das Video mit..." oder "Schicke das Video an..."), wird dieser als erster Satz übernommen – aber niemals mit einem Emoji beginnen
* Falls kein CTA vorhanden ist, ist der erste Satz eine aufmerksamkeitsstarke Einleitung

Hauptteil:
* Inhalt des Videos zusammenfassen und sinnvoll ergänzen
* Relevante Keywords für SEO einbinden
* Struktur durch Absätze und Emojis verbessern

Abschluss:
* Falls kein CTA am Anfang steht, kann er am Ende platziert werden
* Abschluss mit passendem Slogan und Hashtags (falls gewünscht)

WICHTIG:
* Unter keinen Umständen kursive oder fett gedruckte Formatierungen verwenden
* Plattform-Längenbegrenzungen immer einhalten
* Captions immer für beide Plattformen gleichzeitig liefern (Instagram & TikTok)
* Hashtag-Sets nur auf Nachfrage liefern`;

export async function POST(request) {
  if (!ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY not configured. Add it to your Vercel environment variables." },
      { status: 500 }
    );
  }

  try {
    const { transcript, includeHashtags } = await request.json();

    if (!transcript || !transcript.trim()) {
      return Response.json({ error: "Transcript is required" }, { status: 400 });
    }

    const hashtagNote = includeHashtags
      ? "Füge am Ende passende Hashtags hinzu."
      : "Keine Hashtags einfügen.";

    const userPrompt = `Erstelle optimierte Captions für Instagram UND TikTok basierend auf diesem Kurzvideo-Transkript:

---
${transcript.substring(0, 6000)}
---

${hashtagNote}

Antworte EXAKT in diesem Format (keine Erklärungen, nur die Captions):

===INSTAGRAM===
[Instagram Caption hier]

===TIKTOK===
[TikTok Caption hier]`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
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

    const fullText = data.content?.[0]?.text || "";

    // Parse both captions from response
    const igMatch = fullText.match(/===INSTAGRAM===\s*([\s\S]*?)(?====TIKTOK===|$)/);
    const ttMatch = fullText.match(/===TIKTOK===\s*([\s\S]*?)$/);

    const instagram = igMatch ? igMatch[1].trim() : fullText.trim();
    const tiktok = ttMatch ? ttMatch[1].trim() : instagram;

    return Response.json({ instagram, tiktok });
  } catch (err) {
    console.error("[Caption API] Exception:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
