// Content-integrity validation. Run: npm run validate
import { people, events, ideas, treaties, movements, cultures, documents, timeline, quizQuestions, glossary, sources } from "../src/lib/index";

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.error("FAIL:", msg);
};

const ids = new Map<string, string>();
function reg(id: string, kind: string) {
  if (!id) return fail(`Missing id in ${kind}`);
  if (ids.has(id)) return fail(`Duplicate id '${id}' (${ids.get(id)} vs ${kind})`);
  ids.set(id, kind);
}

const sourceIds = new Set(sources.map((s) => s.id));
const known = new Set<string>();

people.forEach((p) => { reg(p.id, "person"); known.add(p.id); });
events.forEach((e) => { reg(e.id, "event"); known.add(e.id); });
ideas.forEach((i) => { reg(i.id, "idea"); known.add(i.id); });
treaties.forEach((t) => { reg(t.id, "treaty"); known.add(t.id); });
movements.forEach((m) => { reg(m.id, "movement"); known.add(m.id); });
cultures.forEach((c) => { reg(c.id, "culture"); known.add(c.id); });
documents.forEach((d) => { reg(d.id, "document"); known.add(d.id); });
timeline.forEach((t) => { reg(t.id, "timeline"); known.add(t.id); });
glossary.forEach((g) => { reg(g.id, "glossary"); known.add(g.id); });
quizQuestions.forEach((q) => reg(q.id, "quiz"));
sources.forEach((s) => reg(s.id, "source"));

function checkRels(owner: string, rels: string[] | undefined, field: string) {
  for (const r of rels ?? []) {
    if (!known.has(r)) fail(`${owner} → unknown relation '${r}' in ${field}`);
  }
}
function checkSources(owner: string, refs: string[]) {
  for (const r of refs) if (!sourceIds.has(r)) fail(`${owner} → unknown source '${r}'`);
  if (refs.length === 0) fail(`${owner} has no sources`);
}

people.forEach((p) => {
  if (!p.name || !p.summary || !p.lifespan || !p.region) fail(`person ${p.id} missing required field`);
  checkRels(p.id, [...p.relatedEvents, ...p.relatedIdeas, ...p.relatedDocuments, ...p.relatedTreaties, ...p.relatedPeople], "relations");
  checkSources(`person ${p.id}`, p.sources);
  if (!p.evidence?.length) fail(`person ${p.id} missing evidence blocks`);
});
events.forEach((e) => {
  if (!e.date || !e.place || !e.context) fail(`event ${e.id} missing required field`);
  checkRels(e.id, [...e.relatedPeople, ...e.relatedTreaties, ...e.relatedIdeas, ...e.relatedDocuments, ...e.relatedEvents], "relations");
  checkSources(`event ${e.id}`, e.sources);
});
ideas.forEach((i) => {
  if (!i.definition || !i.origins) fail(`idea ${i.id} missing required field`);
  checkRels(i.id, [...i.relatedIdeas, ...i.relatedEvents, ...i.relatedPeople, ...i.relatedDocuments], "relations");
  checkSources(`idea ${i.id}`, i.sources);
});
treaties.forEach((t) => {
  if (!t.date || !t.signatories?.length || !t.provisions?.length) fail(`treaty ${t.id} missing required field`);
  checkRels(t.id, [...t.relatedEvents, ...t.relatedPeople, ...t.relatedIdeas, ...t.relatedDocuments], "relations");
  checkSources(`treaty ${t.id}`, t.sources);
});
movements.forEach((m) => {
  if (!m.period || !m.location || !m.objectives?.length) fail(`movement ${m.id} missing required field`);
  checkSources(`movement ${m.id}`, m.sources);
});
documents.forEach((d) => {
  if (!d.author || !d.originalUrl.startsWith("http")) fail(`document ${d.id} missing author/URL`);
  checkSources(`document ${d.id}`, d.sources);
});
quizQuestions.forEach((q) => {
  if (!q.explanation) fail(`quiz ${q.id} missing explanation`);
  if (!q.answer || (Array.isArray(q.answer) && !q.answer.length)) fail(`quiz ${q.id} missing answer`);
  checkSources(`quiz ${q.id}`, q.sources);
});
timeline.forEach((t) => {
  if (!Number.isFinite(t.year)) fail(`timeline ${t.id} invalid year`);
  if (!t.category) fail(`timeline ${t.id} missing category`);
});

// Orphan detection (entities with zero inbound links, excluding sources/glossary)
const inbound = new Map<string, number>();
function bump(id: string) { inbound.set(id, (inbound.get(id) ?? 0) + 1); }
const allRel = [...people, ...events, ...ideas, ...treaties, ...movements, ...cultures, ...documents];
for (const e of allRel as { relatedEvents?: string[]; relatedPeople?: string[]; relatedIdeas?: string[]; relatedDocuments?: string[]; relatedTreaties?: string[] }[]) {
  for (const k of ["relatedEvents", "relatedPeople", "relatedIdeas", "relatedDocuments", "relatedTreaties"] as const) {
    for (const r of e[k] ?? []) bump(r);
  }
}
for (const id of known) {
  if ((inbound.get(id) ?? 0) === 0 && !id.startsWith("tl-") && !id.startsWith("q-")) {
    console.warn(`WARN: orphan entity '${id}' (no inbound links)`);
  }
}

if (failures > 0) {
  console.error(`\nValidation failed with ${failures} error(s).`);
  process.exit(1);
} else {
  console.log(`Validation passed: ${known.size} entities, ${sources.length} sources, ${quizQuestions.length} quiz questions.`);
}
