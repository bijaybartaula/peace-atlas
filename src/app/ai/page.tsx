"use client";
import { useEffect, useState } from "react";
import Markdown from "@/components/Markdown";
import { searchAtlas } from "@/lib/search";

interface Msg { role: "user" | "ai"; text: string }

const thinkingWords = [
  "thinking…",
  "pondering…",
  "reflecting…",
  "considering…",
  "contemplating…",
  "discerning…",
  "reasoning…",
  "examining…",
  "unfolding…",
  "interpreting…",
  "searching…",
];

function ThinkingSequence() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % thinkingWords.length), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="card thinking-card" style={{ marginTop: 16 }}>
      <p className="meta">Consulting the atlas</p>
      <p className="thinking-word" aria-hidden="true" key={idx}>{thinkingWords[idx]}</p>
      <p className="sr-only" role="status">Consulting the atlas and composing a grounded answer.</p>
    </div>
  );
}

const starters = [
  "Why did the 2001 Peace Day resolution matter beyond symbolism?",
  "Three historian views of Versailles",
  "I know nothing about diplomacy — where do I start?",
];

export default function AIPage() {
  const [prompt, setPrompt] = useState(starters[0]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<"missing" | "busy" | "other" | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/ai")
      .then((r) => r.json())
      .then((j) => { if (live) setConfigured(j.configured === true); })
      .catch(() => { if (live) setConfigured(null); });
    return () => { live = false; };
  }, []);

  async function ask() {
    const q = prompt.trim();
    if (!q || loading) return;
    setLoading(true);
    setError(null);
    setErrorKind(null);
    setMsgs((m) => [...m, { role: "user", text: q }]);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 45000);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({ prompt: q }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = typeof j.error === "string" && j.error ? j.error : "AI request failed";
        const missing = res.status === 503 && msg.includes("not configured");
        setErrorKind(missing ? "missing" : res.status === 429 || res.status === 503 || res.status === 504 ? "busy" : "other");
        const hint = typeof j.retryAfterSec === "number" ? ` Try again in about ${Math.max(1, Math.round(j.retryAfterSec / 60))} minute(s).` : "";
        throw new Error(msg + hint);
      }
      if (typeof j.text !== "string" || !j.text.trim()) throw new Error("The AI service returned a malformed response. Please try again.");
      setMsgs((m) => [...m, { role: "ai", text: j.text }]);
      setPrompt("");
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setErrorKind("busy");
        setError("The request timed out. Please try again with a shorter question.");
      } else {
        setError(e instanceof Error ? e.message : "AI request failed");
      }
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }

  const lastUser = [...msgs].reverse().find((m) => m.role === "user");
  const followups = lastUser ? searchAtlas(lastUser.text).slice(0, 3) : [];

  return (
    <div>
      <p className="meta">Research companion, not authority · AI synthesis is labeled</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>AI insights</h1>
      <p>
        Ask for explanations, comparisons, document background, or “where should I start?”. Answers are{" "}
        <strong>AI-generated interpretation</strong> — not quotations from the sources — and should be checked against
        the linked people, events, treaties, and documents. For contested subjects, ask for multiple perspectives.
      </p>
      {configured === false && (
        <div className="card" style={{ marginBottom: 12 }}>
          <p className="meta">AI unavailable</p>
          <p style={{ margin: 0 }}>
            Insights are not configured on this deployment. The atlas remains fully usable — browse the{" "}
            <a href="/timeline">timeline</a>, try the <a href="/quiz">quiz</a>, or use <a href="/search">search</a>.
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} aria-label="Suggested questions">
        {starters.map((s) => (
          <button key={s} type="button" className="ghost" onClick={() => setPrompt(s)}>{s}</button>
        ))}
      </div>
      <div className="ask-row">
        <input
          aria-label="Ask the atlas"
          type="text"
          value={prompt}
          placeholder="Ask about a person, treaty, idea, or document…"
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") ask(); }}
        />
        <button type="button" onClick={ask} disabled={loading || !prompt.trim()}>
          {loading ? "Thinking…" : "Ask"}
        </button>
        {msgs.length > 0 && (
          <button type="button" className="ghost" onClick={() => { setMsgs([]); setError(null); }} disabled={loading}>
            Clear
          </button>
        )}
      </div>

      <div aria-live="polite">
        {loading && <ThinkingSequence />}
        {error && (
          <div className="card" style={{ marginTop: 16 }}>
            <p className="meta">{errorKind === "missing" ? "AI unavailable" : errorKind === "busy" ? "Please retry" : "Something went wrong"}</p>
            <p style={{ margin: 0 }}><strong>{error}</strong></p>
            {errorKind === "missing" && <p style={{ marginBottom: 0 }}>Meanwhile, the <a href="/search">search</a> and <a href="/timeline">timeline</a> work without AI.</p>}
          </div>
        )}
      </div>

      {msgs.length === 0 && !loading && !error && (
        <div className="card" style={{ marginTop: 16 }}>
          <p className="meta">No questions yet</p>
          <p style={{ margin: 0 }}>Choose a suggestion above or write your own question. Each answer ends with doors back into the atlas.</p>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {msgs.map((m, i) => (
          <div key={i} className="card" style={{ marginBottom: 10 }}>
            <p className="meta">{m.role === "user" ? "You" : "AI synthesis — interpretation, not source text"}</p>
            {m.role === "ai" ? (
              <Markdown text={m.text} />
            ) : (
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{m.text}</p>
            )}
          </div>
        ))}
        {followups.length > 0 && !loading && (
          <div className="card">
            <p className="meta">Continue in the atlas</p>
            <p style={{ margin: 0 }}>
              {followups.map((h) => (
                <span key={h.type + h.id}><span className="tag">{h.type}</span><a href={h.href}>{h.title}</a> </span>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
