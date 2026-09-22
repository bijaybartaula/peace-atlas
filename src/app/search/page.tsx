"use client";
import { useState } from "react";
import { searchAtlas, type SearchHit } from "@/lib/search";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  return (
    <div>
      <p className="meta">Search across people, events, ideas, treaties, movements, documents, timeline</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Search</h1>
      <form onSubmit={(e) => { e.preventDefault(); setHits(searchAtlas(q)); }}>
        <input type="search" aria-label="Search the atlas" placeholder="Try: cease-fire, satyagraha, 1948, Geneva…" value={q} onChange={(e) => { setQ(e.target.value); setHits(searchAtlas(e.target.value)); }} />
      </form>
      <div style={{ marginTop: 16 }}>
        {hits.map((h) => (
          <div key={h.type + h.id} className="card" style={{ marginBottom: 10 }}>
            <span className="tag">{h.type}</span>
            <h3 style={{ margin: "6px 0" }}><a href={h.href}>{h.title}</a></h3>
            <p style={{ margin: 0 }}>{h.snippet}</p>
          </div>
        ))}
        {q && hits.length === 0 && <p>No matches. Try fewer words — e.g. “Geneva”, “Gandhi”, “cease-fire”.</p>}
      </div>
    </div>
  );
}
