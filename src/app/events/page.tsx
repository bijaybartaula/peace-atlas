import type { Metadata } from "next";
import { events } from "@/lib";
import { Evidence, Relations, SourceList } from "@/components/Entity";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Conflicts, negotiations, transitions, and turning points in peace history — each with context, outcomes, consequences, and sources.",
};

export default function EventsPage() {
  return (
    <div>
      <p className="meta">Documented outcomes first; inspiration second</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Events</h1>
      {events.map((e) => (
        <article key={e.id} id={e.id} className="entity">
          <hr className="rule" />
          <p className="meta">{e.date}{e.circa ? " · circa" : ""} · {e.place}</p>
          <h2 className="display">{e.name}</h2>
          <p><strong>{e.summary}</strong></p>
          <p><strong>Context:</strong> {e.context}</p>
          <ol>{e.sequence.map((s, i) => <li key={i}>{s}</li>)}</ol>
          <p><strong>Outcomes:</strong> {e.outcomes.join("; ")}</p>
          <p><strong>Consequences:</strong> {e.consequences}</p>
          <p><strong>Participants:</strong> {e.participants.join("; ")}</p>
          <Evidence items={e.evidence} />
          <Relations ids={[...e.relatedPeople, ...e.relatedTreaties, ...e.relatedIdeas, ...e.relatedDocuments, ...e.relatedEvents]} />
          <SourceList ids={e.sources} />
        </article>
      ))}
    </div>
  );
}
