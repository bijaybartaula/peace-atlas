import type { Metadata } from "next";
import { ideas } from "@/lib";
import { Evidence, Relations, SourceList } from "@/components/Entity";

export const metadata: Metadata = {
  title: "Ideas library",
  description:
    "Non-violence, diplomacy, reconciliation, justice, disarmament, human rights and more — concepts explained historically, with criticisms and connections.",
};

export default function IdeasPage() {
  return (
    <div>
      <p className="meta">The intellectual center of the atlas</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Ideas library</h1>
      {ideas.map((i) => (
        <article key={i.id} id={i.id} className="entity">
          <hr className="rule" />
          <h2 className="display">{i.name}</h2>
          <p><strong>{i.summary}</strong></p>
          <p><strong>What does it mean?</strong> {i.definition}</p>
          <p><strong>Where did it come from?</strong> {i.origins}</p>
          <p><strong>How has it changed?</strong> {i.evolution}</p>
          <p><strong>Applied:</strong> {i.applications.join("; ")}</p>
          <p><strong>Criticisms / limits:</strong> {i.criticisms.join(" ")}</p>
          <Evidence items={i.evidence} />
          <Relations ids={[...i.relatedIdeas, ...i.relatedEvents, ...i.relatedPeople, ...i.relatedDocuments]} label="Explore next" />
          <SourceList ids={i.sources} />
        </article>
      ))}
    </div>
  );
}
