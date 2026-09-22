import type { Metadata } from "next";
import { movements } from "@/lib";
import { Evidence, Relations, SourceList } from "@/components/Entity";

export const metadata: Metadata = {
  title: "Movements",
  description:
    "Peace and non-violence movements across eras and continents — objectives, methods, achievements, opposition, and consequences.",
};

export default function MovementsPage() {
  return (
    <div>
      <p className="meta">Comparable, not identical</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Movements</h1>
      {movements.map((m) => (
        <article key={m.id} id={m.id} className="entity">
          <hr className="rule" />
          <p className="meta">{m.period} · {m.location}</p>
          <h2 className="display">{m.name}</h2>
          <p><strong>{m.summary}</strong></p>
          <p><strong>Objectives:</strong> {m.objectives.join("; ")}</p>
          <p><strong>Methods:</strong> {m.methods.join("; ")}</p>
          <p><strong>Organizers:</strong> {m.organizers.join("; ")}</p>
          <p><strong>Achievements:</strong> {m.achievements}</p>
          <p><strong>Opposition:</strong> {m.opposition}</p>
          <p><strong>Consequences:</strong> {m.consequences}</p>
          <Evidence items={m.evidence} />
          <Relations ids={[...m.relatedEvents, ...m.relatedPeople, ...m.relatedIdeas, ...m.relatedDocuments]} />
          <SourceList ids={m.sources} />
        </article>
      ))}
    </div>
  );
}
