// Server-side Gemini provider abstraction.
// Reads GEMINI_API_KEY (and optional GEMINI_MODEL) from environment only.
// Never import this file from client components.

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

export function aiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

const SYSTEM = `You are the Peace Atlas research companion, not an authority.
Rules:
- Prefer the site's knowledge base; name real entities with stable IDs when relevant.
- Distinguish source-backed information from AI-generated synthesis.
- For contested subjects, present multiple credible perspectives and note uncertainty.
- Give dates with sources or mark them uncertain. Never fabricate citations, quotes, or statistics.
- Encourage the visitor to open linked people/events/treaties/documents/sources.
- When naming atlas content, use its exact title (e.g. "Treaty of Versailles (1919)", "Toward Perpetual Peace (1795)") so visitors can find it with Search; never invent titles, quotes, or links.
- For contemporary geopolitics, stress dates, attribution, and that circumstances change.
- Do not persuade toward a political position or generate propaganda.`;

export async function askAtlas(prompt: string, contextIds: string[] = []): Promise<{ text: string; model: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured.");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(key)}`;
  const context = contextIds.length ? `\n\nSite context entity IDs the visitor is viewing: ${contextIds.join(", ")}. Refer to them by name where relevant.` : "";
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: "user", parts: [{ text: prompt + context }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 900 },
      }),
    });
  } catch (e) {
    throw new Error(e instanceof Error && e.name === "AbortError" ? "Gemini request timed out. Please try again." : "Could not reach the AI service. Please try again.");
  } finally {
    clearTimeout(timer);
  }
  if (res.status === 429 || res.status === 503) {
    // Honest signal only: the API itself says it is busy or out of quota.
    // Extract Google's RetryInfo hint (timing metadata, never secrets).
    let retryAfterSec: number | undefined;
    try {
      const errBody = (await res.json()) as {
        error?: { details?: { "@type"?: string; retryDelay?: string }[] };
      };
      const retry = errBody.error?.details?.find((d) => typeof d.retryDelay === "string");
      const m = retry?.retryDelay?.match(/([\d.]+)s/);
      if (m) retryAfterSec = Math.max(1, Math.round(Number(m[1])));
    } catch {
      /* timing hint unavailable — still a genuine busy signal */
    }
    const busy = res.status === 429
      ? "The AI service is rate-limited right now. Please wait a little and try again."
      : "The AI service is experiencing high demand right now. Please try again shortly.";
    const e = new Error(busy) as Error & { retryAfterSec?: number; busy?: boolean };
    e.retryAfterSec = retryAfterSec;
    e.busy = true;
    throw e;
  }
  if (res.status === 400) throw new Error("The AI service could not process that prompt. Try a shorter or simpler question.");
  if (!res.ok) throw new Error(`The AI service returned an error (${res.status}). Please try again later.`);
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("The AI service returned a malformed response. Please try again.");
  }
  const parsed = data as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    error?: { message?: string };
  };
  if (parsed.error) throw new Error("The AI service returned an error. Please try again later.");
  if (!Array.isArray(parsed.candidates)) throw new Error("The AI service returned a malformed response. Please try again.");
  const text = parsed.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("")?.trim() ?? "";
  if (!text) throw new Error("Gemini returned an empty response.");
  return { text, model: GEMINI_MODEL };
}
