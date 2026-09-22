import { NextResponse } from "next/server";
import { aiConfigured, askAtlas } from "@/lib/ai/provider";

export async function GET() {
  return NextResponse.json({ configured: aiConfigured() });
}

export async function POST(req: Request) {
  if (!aiConfigured()) {
    return NextResponse.json(
      { error: "AI is not configured. Set GEMINI_API_KEY server-side to enable insights. The atlas remains fully usable without it." },
      { status: 503 }
    );
  }
  let body: { prompt?: string; contextIds?: string[] };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const prompt = (body.prompt ?? "").toString().slice(0, 4000).trim();
  if (!prompt) return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  try {
    const out = await askAtlas(prompt, Array.isArray(body.contextIds) ? body.contextIds.slice(0, 12).map(String) : []);
    return NextResponse.json({ ...out, synthesis: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "AI request failed.";
    const retryAfterSec = e instanceof Error ? (e as Error & { retryAfterSec?: number }).retryAfterSec : undefined;
    const busy = e instanceof Error && (e as Error & { busy?: boolean }).busy === true;
    const status = /timed out/i.test(message) ? 504 : busy ? (message.includes("high demand") ? 503 : 429) : 502;
    return NextResponse.json({ error: message, retryAfterSec }, { status });
  }
}
