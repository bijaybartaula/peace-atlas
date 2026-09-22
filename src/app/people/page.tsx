import type { Metadata } from "next";
import { people } from "@/lib";
import { Evidence, Relations, SourceList } from "@/components/Entity";

export const metadata: Metadata = {
  title: "People",
  description:
    "Philosophers, diplomats, activists, and organizers connected to the history of peace — profiles with context, influence, criticism, and sources.",
};

export default function PeoplePage() {
  return (
    <div>
      <p className="meta">Not a ranking — a catalogue for discovery</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>People</h1>
      {people.map((p) => (
        <article key={p.id} id={p.id} className="entity">
          <hr className="rule" />
          <p className="meta">{p.lifespan} · {p.region} · {p.occupations.join(" / ")}</p>
          <h2 className="display">{p.name}</h2>
          <p><strong>{p.summary}</strong></p>
          <p><strong>Context:</strong> {p.context}</p>
          <p><strong>Ideas:</strong> {p.ideas.join(" ")}</p>
          <p><strong>Key works:</strong> {p.keyWorks.join("; ")}</p>
          <p><strong>Influence:</strong> {p.influence}</p>
          <p><strong>Criticism / competing readings:</strong> {p.criticism}</p>
          <Evidence items={p.evidence} />
          <Relations ids={[...p.relatedEvents, ...p.relatedIdeas, ...p.relatedDocuments, ...p.relatedTreaties, ...p.relatedPeople]} />
          <SourceList ids={p.sources} />
        </article>
      ))}
    </div>
  );
}
