import React from "react";

// Minimal archival markdown renderer for AI answers.
// Supports: headings, paragraphs, bullets, numbered lists, bold,
// italic, inline code, fenced code blocks, blockquotes, rules, links.
// Builds element trees only — never raw HTML — so AI text cannot inject markup.

function Inline({ text, base }: { text: string; base: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const key = `${base}-${i}`;
        if (p.startsWith("**") && p.endsWith("**")) return <strong key={key}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={key}>{p.slice(1, -1)}</em>;
        if (p.startsWith("`") && p.endsWith("`") && p.length > 2) return <code key={key}>{p.slice(1, -1)}</code>;
        const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(p);
        if (m) {
          const href = m[2].trim();
          const safe = /^(https?:\/\/|\/[^/])/.test(href);
          if (!safe) return <React.Fragment key={key}>{m[1]}</React.Fragment>;
          const external = href.startsWith("http");
          return (
            <a key={key} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
              {m[1]}
            </a>
          );
        }
        return <React.Fragment key={key}>{p}</React.Fragment>;
      })}
    </>
  );
}

export default function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let n = 0;

  while (i < lines.length) {
    const line = lines[i];
    const key = `b${n++}`;

    if (/^```/.test(line)) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++;
      blocks.push(<pre key={key}><code>{buf.join("\n")}</code></pre>);
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const lvl = h[1].length;
      const content = <Inline text={h[2]} base={key} />;
      if (lvl === 1) blocks.push(<h1 key={key}>{content}</h1>);
      else if (lvl === 2) blocks.push(<h2 key={key}>{content}</h2>);
      else if (lvl === 3) blocks.push(<h3 key={key}>{content}</h3>);
      else blocks.push(<h4 key={key}>{content}</h4>);
      i++;
      continue;
    }
    if (/^\s*([-*])\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*])\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*])\s+/, ""));
        i++;
      }
      blocks.push(<ul key={key}>{items.map((t, k) => <li key={k}><Inline text={t} base={`${key}-${k}`} /></li>)}</ul>);
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push(<ol key={key}>{items.map((t, k) => <li key={k}><Inline text={t} base={`${key}-${k}`} /></li>)}</ol>);
      continue;
    }
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
      blocks.push(<blockquote key={key}><Inline text={buf.join(" ")} base={key} /></blockquote>);
      continue;
    }
    if (/^---+$/.test(line.trim())) { blocks.push(<hr key={key} />); i++; continue; }
    if (!line.trim()) { i++; continue; }
    const buf: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|\s*([-*]|\d+[.)])\s+|>)/.test(lines[i])) {
      buf.push(lines[i].trim());
      i++;
    }
    blocks.push(<p key={key}><Inline text={buf.join(" ").trim()} base={key} /></p>);
  }

  return <div className="md">{blocks}</div>;
}
