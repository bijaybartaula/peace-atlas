import type { Metadata } from "next";
import { treaties } from "@/lib";
import { Evidence, Relations, SourceList } from "@/components/Entity";

export const metadata: Metadata = {
  title: "Treaties and agreements",
  description:
    "Peace treaties, cease-fires, and conventions from Kadesh to the Mine Ban Treaty — provisions, implementation, criticism, and sources.",
};

export default function TreatiesPage() {
  return (
    <div>
      <p className="meta">Treaties, cease-fires, conventions, accords</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Treaties &amp; agreements</h1>
      {treaties.map((t) => (
        <article key={t.id} id={t.id} className="entity">
          <hr className="rule" />
          <p className="meta">{t.date} · {t.place}</p>
          <h2 className="display">{t.name}</h2>
          <p><strong>{t.summary}</strong></p>
          <p><strong>Signed by:</strong> {t.signatories.join("; ")}</p>
          <p><strong>Addressed:</strong> {t.addressed}</p>
          <ul>{t.provisions.map((p, i) => <li key={i}>{p}</li>)}</ul>
          <p><strong>Context:</strong> {t.context}</p>
          <p><strong>Implementation:</strong> {t.implementation}</p>
          <p><strong>Later developments:</strong> {t.developments}</p>
          <p><strong>Criticism:</strong> {t.criticism}</p>
          <Evidence items={t.evidence} />
          <Relations ids={[...t.relatedEvents, ...t.relatedPeople, ...t.relatedIdeas, ...t.relatedDocuments]} />
          <SourceList ids={t.sources} />
        </article>
      ))}
    </div>
  );
}
