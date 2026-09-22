import type { Metadata } from "next";
import { documents } from "@/lib";
import { Evidence, Relations, SourceList } from "@/components/Entity";

export const metadata: Metadata = {
  title: "Document room",
  description:
    "Primary sources: UN resolutions, the UDHR, Kant's Perpetual Peace, King's Birmingham letter, the UN Charter, and Geneva law — with context and links.",
};

export default function DocumentsPage() {
  return (
    <div>
      <p className="meta">Document room — link to authority, don&apos;t reproduce copyrighted bulk</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Documents</h1>
      {documents.map((d) => (
        <article key={d.id} id={d.id} className="entity">
          <hr className="rule" />
          <p className="meta">{d.date} · {d.category} · {d.author}</p>
          <h2 className="display">{d.name}</h2>
          <p><strong>{d.summary}</strong></p>
          <p><strong>Context:</strong> {d.context}</p>
          <p><strong>Why it matters:</strong> {d.explanation}</p>
          {d.excerpt && <blockquote>“{d.excerpt}”</blockquote>}
          <p><a href={d.originalUrl} target="_blank" rel="noreferrer">Read at the authoritative source →</a></p>
          <Evidence items={d.evidence} />
          <Relations ids={[...d.relatedPeople, ...d.relatedEvents, ...d.relatedIdeas, ...d.relatedTreaties]} />
          <SourceList ids={d.sources} />
        </article>
      ))}
    </div>
  );
}
