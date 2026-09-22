"use client";
import { useMemo, useState } from "react";
import { timeline } from "@/lib";
import { relatedLinks } from "@/lib/graph";

const cats = ["all", ...Array.from(new Set(timeline.map((t) => t.category)))];

export default function TimelinePage() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    return [...timeline]
      .sort((a, b) => a.year - b.year)
      .filter((t) => (cat === "all" ? true : t.category === cat))
      .filter((t) => (q ? `${t.title} ${t.summary} ${t.location}`.toLowerCase().includes(q.toLowerCase()) : true));
  }, [cat, q]);
  return (
    <div>
      <p className="meta">Century → era → year → event · no false precision for ancient dates</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Historical timeline</h1>
      <p>Not a march of progress: agreements, collapses, revivals, and unfinished business side by side.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <select aria-label="Filter by category" value={cat} onChange={(e) => setCat(e.target.value)} style={{ maxWidth: 320 }}>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="search" aria-label="Filter timeline" placeholder="Filter… e.g. Geneva, 1948, peacekeeping" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 420 }} />
      </div>
      <div className="table-scroll">
      <table className="timeline">
        <thead><tr><th>Date</th><th>Entry</th><th>Category</th></tr></thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} id={t.id} className="entity">
              <td style={{ whiteSpace: "nowrap" }}><span className="meta">{t.dateLabel}{t.circa ? " · circa" : ""}</span><br />{t.location}</td>
              <td>
                <strong>{t.title}</strong> — {t.summary}
                <br /><span style={{ fontSize: ".9rem" }}>Why it matters: {t.whyItMatters} Consequences: {t.consequences}</span>
                {t.disagreement && <><br /><span style={{ fontSize: ".9rem" }}><em>Disagreement: {t.disagreement}</em></span></>}
                <br />
                {relatedLinks([...t.relatedEvents, ...t.relatedPeople, ...t.relatedTreaties, ...t.relatedIdeas, ...t.relatedDocuments]).map((l) => (
                  <span key={l.href + l.label}><span className="tag">{l.type}</span><a href={l.href}>{l.label}</a> </span>
                ))}
              </td>
              <td><span className="tag">{t.category}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
