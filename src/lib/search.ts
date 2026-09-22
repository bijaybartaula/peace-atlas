import { people, ideas, events, treaties, movements, cultures, documents, glossary, timeline } from "./index";
import type { EntityType } from "./types";

export interface SearchHit {
  type: EntityType;
  id: string;
  title: string;
  snippet: string;
  href: string;
}

const corpus: SearchHit[] = [
  ...people.map((p) => ({ type: "person" as const, id: p.id, title: p.name, snippet: p.summary, href: `/people#${p.id}` })),
  ...events.map((e) => ({ type: "event" as const, id: e.id, title: e.name, snippet: e.summary, href: `/events#${e.id}` })),
  ...ideas.map((i) => ({ type: "idea" as const, id: i.id, title: i.name, snippet: i.summary, href: `/ideas#${i.id}` })),
  ...treaties.map((t) => ({ type: "treaty" as const, id: t.id, title: t.name, snippet: t.summary, href: `/treaties#${t.id}` })),
  ...movements.map((m) => ({ type: "movement" as const, id: m.id, title: m.name, snippet: m.summary, href: `/movements#${m.id}` })),
  ...cultures.map((c) => ({ type: "culture" as const, id: c.id, title: c.name, snippet: c.summary, href: `/cultures#${c.id}` })),
  ...documents.map((d) => ({ type: "document" as const, id: d.id, title: d.name, snippet: d.summary, href: `/documents#${d.id}` })),
  ...timeline.map((t) => ({ type: "timeline" as const, id: t.id, title: t.title, snippet: t.summary, href: `/timeline#${t.id}` })),
  ...glossary.map((g) => ({ type: "glossary" as const, id: g.id, title: g.term, snippet: g.definition, href: `/glossary#${g.id}` })),
];

export function searchAtlas(query: string, limit = 30): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const scored = corpus.map((h) => {
    const text = `${h.title} ${h.snippet}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (h.title.toLowerCase().includes(t)) score += 3;
      if (text.includes(t)) score += 1;
    }
    return { h, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.h);
}
