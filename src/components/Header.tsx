"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import ThemeSwitch from "./ThemeSwitch";

// One coherent journey — discover → orient → understand → examine →
// reflect/interact → verify → reference. Never alphabetize or reshuffle.
const links: { href: string; label: string }[] = [
  { href: "/timeline", label: "Timeline" },
  { href: "/events", label: "Events" },
  { href: "/people", label: "People" },
  { href: "/ideas", label: "Ideas" },
  { href: "/movements", label: "Movements" },
  { href: "/cultures", label: "Cultures" },
  { href: "/treaties", label: "Treaties" },
  { href: "/documents", label: "Documents" },
  { href: "/peace-day", label: "Peace Day" },
  { href: "/ai", label: "AI Insights" },
  { href: "/quiz", label: "Quiz" },
  { href: "/games", label: "Games" },
  { href: "/sources", label: "Sources" },
  { href: "/glossary", label: "Glossary" },
  { href: "/about", label: "About" },
];

function sectionOf(pathname: string): string {
  if (pathname === "/") return "/";
  const seg = "/" + pathname.split("/").filter(Boolean)[0];
  return links.some((l) => l.href === seg) ? seg : "";
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = sectionOf(pathname ?? "");

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="head-row">
          <a className="brand" href="/" aria-current={active === "/" ? "page" : undefined}>
            The Peace Atlas
            <small>21 SEPT · LIVING KNOWLEDGE ATLAS · No. 001</small>
          </a>
          <div className="head-controls">
            <a className="icon-btn" href="/search" aria-label="Search the atlas" title="Search the atlas">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="6.2" stroke="currentColor" strokeWidth="1.8" />
                <line x1="13.8" y1="13.8" x2="18" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="icon-btn-text">Search</span>
            </a>
            <ThemeSwitch />
            <button
              type="button"
              className="ghost nav-toggle"
              aria-expanded={open}
              aria-controls="primary-nav"
              onClick={() => setOpen((o) => !o)}
              onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        <nav
          id="primary-nav"
          className={`main${open ? " open" : ""}`}
          aria-label="Primary"
          onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
        >
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive || undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
