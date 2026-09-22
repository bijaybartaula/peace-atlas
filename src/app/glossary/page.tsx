import type { Metadata } from "next";
import { glossary } from "@/lib";
import { relatedLinks } from "@/lib/graph";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Armistice, cease-fire, mediation, deterrence, sovereignty and more — precise definitions of peace and diplomacy terminology.",
};

export default function GlossaryPage() {
  return (
    <div>
      <p className="meta">Unfamiliar terms, precisely defined</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Glossary</h1>
      {glossary.map((g) => (
        <article key={g.id} id={g.id} className="entity">
          <hr className="rule" />
          <h3>{g.term}</h3>
          <p>{g.definition} {g.example && <em>Example: {g.example}</em>}</p>
          <p>{relatedLinks(g.relatedIdeas).map((l) => <span key={l.href}><span className="tag">{l.type}</span><a href={l.href}>{l.label}</a> </span>)}</p>
        </article>
      ))}
    </div>
  );
}
