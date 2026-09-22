"use client";
import { useMemo, useState } from "react";
import { timeline, events } from "@/lib";

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function TimelineChallenge() {
  const [round, setRound] = useState(0);
  const [order, setOrder] = useState<string[]>([]);
  const items = useMemo(() => {
    const pool = shuffled(timeline.filter((t) => !t.circa)).slice(0, 5);
    return [...pool].sort((a, b) => a.year - b.year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);
  const [deck, setDeck] = useState<string[] | null>(null);
  const current = deck ?? (() => { const d = shuffled(items.map((i) => i.id)); return d; })();
  const [checked, setChecked] = useState(false);
  const correctOrder = items.map((i) => i.id);
  const won = checked && JSON.stringify(current) === JSON.stringify(correctOrder);

  return (
    <div className="card">
      <p className="meta">Game 1 · uses the same timeline data as the atlas</p>
      <h3>Timeline Challenge — place 5 events in chronological order</h3>
      <ol>
        {current.map((id) => {
          const t = timeline.find((x) => x.id === id)!;
          return (
            <li key={id} style={{ marginBottom: 8 }}>
              <strong>{t.title}</strong> ({t.dateLabel})
              <br />
              <button className="ghost" disabled={checked} onClick={() => {
                const i = current.indexOf(id);
                if (i > 0) { const n = [...current]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; setDeck(n); }
              }}>↑</button>{" "}
              <button className="ghost" disabled={checked} onClick={() => {
                const i = current.indexOf(id);
                if (i < current.length - 1) { const n = [...current]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; setDeck(n); }
              }}>↓</button>{" "}
              <a href={`/timeline#${id}`}>Learn more →</a>
            </li>
          );
        })}
      </ol>
      {!checked
        ? <button onClick={() => setChecked(true)}>Check order</button>
        : won
          ? <p><strong>Correct.</strong> {items.map((i) => `${i.title} (${i.dateLabel})`).join(" → ")} <button className="ghost" onClick={() => { setRound((r) => r + 1); setDeck(null); setChecked(false); setOrder([]); }}>New round</button></p>
          : <p><strong>Not yet.</strong> Correct order: {items.map((i) => `${i.title} (${i.dateLabel})`).join(" → ")} <button className="ghost" onClick={() => { setChecked(false); }}>Try again</button></p>}
      <p style={{ display: "none" }}>{order.join()}</p>
    </div>
  );
}

function PeaceHistorian() {
  const ev = useMemo(() => events[Math.floor(Math.random() * events.length)], []);
  const [revealed, setRevealed] = useState(0);
  const clues = [`Place: ${ev.place}`, `Context: ${ev.context}`, `Sequence: ${ev.sequence[0] ?? ev.summary}`, `Outcome: ${ev.outcomes[0] ?? ""}`];
  return (
    <div className="card">
      <p className="meta">Game 2 · historical clues, then reconstruct</p>
      <h3>The Peace Historian — who / where / when / what followed?</h3>
      <ul>{clues.slice(0, revealed + 1).map((c, i) => <li key={i}>{c}</li>)}</ul>
      {revealed < clues.length - 1
        ? <button className="ghost" onClick={() => setRevealed((r) => r + 1)}>Reveal another clue</button>
        : <div><p><strong>{ev.name}</strong> ({ev.date}). {ev.summary}</p><p><a href={`/events#${ev.id}`}>Open the event page → people → treaties → sources</a></p></div>}
    </div>
  );
}

export default function GamesPage() {
  return (
    <div>
      <p className="meta">Small, polished, and wired into the knowledge graph</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Games</h1>
      <p>Each game opens into the atlas: event → people → treaty → timeline → sources. Progress stays in your browser.</p>
      <div className="grid two">
        <TimelineChallenge />
        <PeaceHistorian />
      </div>
      <hr className="rule" />
      <p style={{ fontSize: ".9rem" }}><em>Diplomat&apos;s Desk (scenario deliberation) and Connect-the-History (person → idea → event → treaty) ship next as the graph grows; only finished games appear here — no “coming soon” placeholders pretending to be complete.</em></p>
    </div>
  );
}
