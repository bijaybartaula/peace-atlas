import { relatedLinks } from "@/lib/graph";
import { sourceById } from "@/lib/index";

export function Evidence({ items }: { items: { kind: string; label: string; text: string }[] }) {
  return (
    <div>
      {items.map((e, i) => (
        <div className="evidence" key={i}><b>{e.label}</b>{e.text}</div>
      ))}
    </div>
  );
}

export function Relations({ ids, label = "Follow the thread" }: { ids: string[]; label?: string }) {
  const links = relatedLinks(ids);
  if (!links.length) return null;
  return (
    <p className="rel"><span className="meta">{label} — </span>
      {links.map((l) => (
        <span key={l.href + l.label}><span className="tag">{l.type}</span><a href={l.href}>{l.label}</a></span>
      ))}
    </p>
  );
}

export function SourceList({ ids }: { ids: string[] }) {
  return (
    <details>
      <summary className="meta">Sources ({ids.length})</summary>
      <ul>
        {ids.map((id) => {
          const s = sourceById.get(id);
          if (!s) return <li key={id}>Unknown source: {id}</li>;
          return (
            <li key={id}>
              <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> — {s.publisher}
              {s.publicationDate ? ` · ${s.publicationDate}` : ""} · accessed {s.accessDate} · <span className="tag">{s.type}</span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
