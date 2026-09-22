import type { Metadata } from "next";
import { sources } from "@/lib";

export const metadata: Metadata = {
  title: "Sources",
  description:
    "The evidence room: UN records, archives, universities, and institutions behind every factual claim in the atlas.",
};

export default function SourcesPage() {
  return (
    <div>
      <p className="meta">Source room — evidence before synthesis</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Sources</h1>
      <p>Prioritizes UN, archives, libraries, universities, and recognized institutions. No AI-generated citations presented as real; no invented statistics.</p>
      {sources.map((s) => (
        <article key={s.id} id={s.id} className="entity">
          <hr className="rule" />
          <p className="meta">{s.type}{s.publicationDate ? ` · ${s.publicationDate}` : ""} · accessed {s.accessDate}</p>
          <h3><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></h3>
          <p>{s.publisher}{s.author ? ` — ${s.author}` : ""}. {s.notes ?? ""}</p>
        </article>
      ))}
    </div>
  );
}
