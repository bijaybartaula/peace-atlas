import { people, ideas, events, treaties, movements, cultures, documents, timeline, glossary } from "./index";
import type { EntityType } from "./types";

const stores: Record<string, Map<string, { id: string; name?: string; title?: string }>> = {
  person: new Map(people.map((p) => [p.id, p])),
  event: new Map(events.map((e) => [e.id, e])),
  idea: new Map(ideas.map((i) => [i.id, i])),
  treaty: new Map(treaties.map((t) => [t.id, t])),
  movement: new Map(movements.map((m) => [m.id, m])),
  culture: new Map(cultures.map((c) => [c.id, c])),
  document: new Map(documents.map((d) => [d.id, d])),
  timeline: new Map(timeline.map((t) => [t.id, t])),
  glossary: new Map(glossary.map((g) => [g.id, { id: g.id, name: g.term }])),
};

export function resolveEntity(id: string): { type: EntityType; href: string; label: string } | null {
  for (const [type, map] of Object.entries(stores)) {
    const e = map.get(id);
    if (e) {
      const label = (e as { name?: string; title?: string }).name ?? (e as { title?: string }).title ?? id;
      const base =
        type === "person" ? "/people" : type === "event" ? "/events" : type === "idea" ? "/ideas" : type === "treaty" ? "/treaties" : type === "movement" ? "/movements" : type === "culture" ? "/cultures" : type === "document" ? "/documents" : type === "timeline" ? "/timeline" : "/glossary";
      return { type: type as EntityType, href: `${base}#${id}`, label: String(label) };
    }
  }
  return null;
}

export function relatedLinks(ids: string[]): { href: string; label: string; type: EntityType }[] {
  return ids
    .map((id) => resolveEntity(id))
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .map((r) => ({ href: r.href, label: r.label, type: r.type }));
}
