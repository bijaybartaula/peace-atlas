import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { siteUrl, siteName } from "@/lib/site";

const description =
  "A living knowledge atlas of peace and humanity: timeline, people, ideas, events, treaties, movements, cultures, documents, quiz, games, and AI-assisted exploration. No account needed.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — 21 September as a doorway into humanity's history of peace`,
    template: `%s · ${siteName}`,
  },
  description,
  keywords: [
    "International Day of Peace",
    "21 September",
    "history of peace",
    "peace treaties",
    "non-violence",
    "diplomacy",
    "reconciliation",
    "human rights",
    "peace movements",
    "United Nations",
  ],
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — 21 September as a doorway into humanity's history of peace`,
    description,
  },
  twitter: {
    card: "summary",
    title: `${siteName} — 21 September as a doorway into humanity's history of peace`,
    description,
  },
  robots: { index: true, follow: true },
};

// Applied before first paint so the stored theme never flashes.
const themeInit = `(function(){try{var t=localStorage.getItem("peace-atlas-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  description,
  inLanguage: "en",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning is scoped to <html>'s own attributes only.
    // Justification: the pre-paint theme script above intentionally sets
    // data-theme on <html> before hydration (read from localStorage, which
    // the server cannot know) to prevent a theme flash. That deliberate
    // DOM state differs from SSR output by design; children still hydrate
    // with full mismatch checking. Alternatives (SSR default, effects-only
    // theming) either still mismatch for dark-mode users or reintroduce
    // the flash. No other component touches <html> during hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body>
        <a className="skip" href="#content">Skip to content</a>
        <Header />
        <main id="content" className="wrap" style={{ paddingTop: 28, paddingBottom: 12 }}>{children}</main>
        <footer className="site">
          <div className="wrap">
            <p className="meta">The Peace Atlas · an archival, editorial, educational work</p>
            <p>
              Distinguishes <strong>documented fact</strong>, <strong>interpretation</strong>, <strong>competing interpretation</strong>,{" "}
              <strong>uncertainty</strong>, and <strong>AI synthesis</strong>. Claims trace to listed sources; no fabricated quotes,
              statistics, or citations. AI runs server-side only and is optional.
            </p>
            <p className="foot-nav">
              <a href="/about">About</a> · <a href="/sources">Sources</a> · <a href="/privacy">Privacy</a> ·{" "}
              <a href="/terms">Terms</a> · <a href="https://www.un.org/en/observances/international-day-peace">UN: International Day of Peace</a>
            </p>
            <p className="contribute">
              <a href="https://github.com/bijaybartaula/peace-day">contribute</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
