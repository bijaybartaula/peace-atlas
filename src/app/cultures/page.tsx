import type { Metadata } from "next";
import { cultures } from "@/lib";
import { Evidence, Relations, SourceList } from "@/components/Entity";

export const metadata: Metadata = {
  title: "Cultures and traditions",
  description:
    "How societies have understood peace, harmony, and reconciliation — shalom, ahimsa, ubuntu, Confucian harmony, hospitality codes, and more.",
};

export default function CulturesPage() {
  return (
    <div>
      <p className="meta">No single tradition is universal — context matters</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Cultures &amp; traditions</h1>
      {cultures.map((c) => (
        <article key={c.id} id={c.id} className="entity">
          <hr className="rule" />
          <p className="meta">{c.region} · {c.traditionType}</p>
          <h2 className="display">{c.name}</h2>
          <p><strong>{c.summary}</strong></p>
          <ul>{c.keyTerms.map((k, i) => <li key={i}><strong>{k.term}</strong>{k.transliteration ? ` (${k.transliteration})` : ""} — {k.meaning}</li>)}</ul>
          <p><strong>Practices:</strong> {c.practices.join("; ")}</p>
          <p><strong>Texts / artworks:</strong> {c.textsOrArtworks.join("; ")}</p>
          <p><strong>Reading note:</strong> {c.interpretationNote}</p>
          <Evidence items={c.evidence} />
          <Relations ids={[...c.relatedIdeas, ...c.relatedPeople, ...c.relatedEvents]} />
          <SourceList ids={c.sources} />
        </article>
      ))}
    </div>
  );
}
