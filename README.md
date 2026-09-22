# The Peace Atlas

21 September is one date. The history behind it is thousands of years old.

The Peace Atlas is a permanent, explorable reference on peace and humanity. It uses the International Day of Peace (established by GA Resolution 36/67 in 1981, fixed to 21 September as a day of non-violence and cease-fire by Resolution 55/282 in 2001) as an entry point into the longer record: people, events, ideas, movements, cultures, treaties, documents, and a chronological timeline. It also includes a teaching quiz, two small games built on the same data, full-text search, and an optional AI research companion.

There are no accounts, no paywalls, no analytics, and no tracking. Quiz progress lives in `localStorage` only. The site works fully without AI configured.

## Stack

- Next.js 15.5.4 (App Router, static generation by default), React 19, TypeScript
- No UI framework, no database, no client-side data fetching for content. All atlas content is typed modules shipped with the app.
- Runtime dependencies are `next`, `react`, `react-dom`. Dev dependencies are `typescript`, `tsx`, and React/Node types. See `package.json` for exact versions.
- `reactStrictMode: true`, `poweredByHeader: false` (`next.config.ts`).

## How it is organized

Content is a knowledge graph, not a set of disconnected articles. Every entity has a stable string ID and explicit relationship arrays pointing at other IDs. Relations are checked at build time by `scripts/validate.ts`.

```
src/
  app/                    # routes (server components by default)
    page.tsx              # home, daily discovery
    layout.tsx            # metadata, theme init, JSON-LD, header/footer
    timeline/ events/ people/ ideas/ movements/ cultures/
    treaties/ documents/ peace-day/ sources/ glossary/
    quiz/ games/ search/  # client components, local state
    ai/                   # client chat UI, calls /api/ai
    about/ privacy/ terms/
    api/ai/route.ts       # server-only Gemini call
    robots.ts sitemap.ts  # generated from src/lib/site.ts
  components/
    Header.tsx            # editorial nav order, mobile slide-in menu
    ThemeSwitch.tsx       # accessible switch, localStorage persistence
    Entity.tsx            # Evidence, Relations, SourceList renderers
    Markdown.tsx          # minimal renderer for AI answers (no raw HTML)
  lib/
    types.ts              # Person, HistoricalEvent, Idea, Treaty, Movement,
                          # CultureTradition, AtlasDocument, TimelineEntry,
                          # QuizQuestion, GlossaryTerm, Source, EvidenceBlock
    data/                 # one module per domain plus sources, quiz, peaceDay
    index.ts              # re-exports and sourceById map
    graph.ts              # resolveEntity / relatedLinks (id to href + label)
    search.ts             # client-side weighted search over titles + summaries
    daily.ts              # deterministic day-of-year rotation for home page
    site.ts               # canonical URL, site name, route list for SEO
    ai/provider.ts        # server-only Gemini provider (never imported client-side)
scripts/validate.ts       # duplicate IDs, broken relations, missing sources
```

Entity pages are collection pages with anchor links (`/people#immanuel-kant`), resolved through `graph.ts`, rather than one route per entity. This keeps the build fully static and keeps every entry one click from its relations.

## Routes

Catalog and reference: `/timeline`, `/events`, `/people`, `/ideas`, `/movements`, `/cultures`, `/treaties`, `/documents`, `/peace-day`, `/sources`, `/glossary`, `/about`. Interactive: `/quiz`, `/games`, `/search`, `/ai`. Legal: `/privacy`, `/terms`. API: `GET /api/ai` (capability probe), `POST /api/ai` (prompt in, synthesis out). SEO: `/robots.txt`, `/sitemap.xml`.

The header nav order is editorial and fixed (Explore through About). It is not alphabetical and should not be reshuffled.

## Editorial contract

Every entry distinguishes five levels, typed as `EvidenceKind` in `src/lib/types.ts`:

1. `documented-fact`
2. `interpretation`
3. `competing-interpretation`
4. `uncertainty`
5. `ai-synthesis`

The rule is simple: factual claims trace to listed institutional sources. Contested subjects present multiple readings. Uncertain dates and numbers say so. AI output is always labeled synthesis, never authority. There are no fabricated quotes, statistics, events, or citations. The 20 sources in `src/lib/data/sources.ts` are real institutional references (UN bodies, ICRC, Nobel, Stanford Encyclopedia of Philosophy, Britannica, PCA, Library of Congress) with access dates.

## AI companion

AI is optional and server-side only. The browser never sees the key.

- `src/lib/ai/provider.ts` reads `GEMINI_API_KEY` (and optional `GEMINI_MODEL`, default `gemini-3.5-flash-lite`) from the server environment. It posts to the Generative Language `generateContent` endpoint with a low temperature (0.4), a 900-token cap, a 30-second abort timeout, and explicit handling for 429/503 (including Google's `retryDelay` hint), 400, and malformed responses.
- `src/app/api/ai/route.ts` validates the prompt (required, 4000 chars max, max 12 context IDs), returns 503 with a plain message when unconfigured, and maps timeouts and busy states to 504/429/503 so the UI can explain what happened.
- `src/app/ai/page.tsx` is a client component with suggestion prompts, a thinking indicator, graceful unavailable/busy/error states, answers rendered by `Markdown.tsx` (element trees only, external links only, no injected markup), and follow-up links back into the atlas via `searchAtlas`.
- The system prompt (`SYSTEM` in `provider.ts`) instructs the model to prefer atlas entities by exact title and stable ID, to separate source-backed claims from synthesis, to present multiple perspectives on contested topics, and never to invent citations, quotes, or links.

## Key implementation details

- **Search** (`lib/search.ts`): in-memory scoring over titles and summaries. Title matches weigh 3x, body matches 1x, top 30 returned. No server round trip.
- **Daily discovery** (`lib/daily.ts`): deterministic day-of-year index, so the home page rotates through person, event, idea, treaty, document, question, and timeline entry without cookies or tracking.
- **Theme**: a pre-paint inline script in `layout.tsx` reads `peace-atlas-theme` from `localStorage` (falling back to `prefers-color-scheme`) and sets `data-theme` on `<html>` before first paint to avoid a flash. `ThemeSwitch.tsx` is a `role="switch"` button that syncs from the document attribute on mount and persists on toggle. The `<html>` element carries a scoped `suppressHydrationWarning` for its own attributes only, with the justification in a comment: the server cannot know the visitor's stored theme, so the pre-paint correction differs from SSR output by design. Children hydrate with full checking, and no other component touches `<html>`.
- **Mobile nav** (`Header.tsx`, `globals.css`): the hamburger toggles an off-canvas panel that slides from the right. Closed links use `visibility: hidden` so they leave the tab order. Escape closes the menu, links close it on navigation, and the panel uses `overflow-x: clip` scoping so it cannot cause horizontal scroll. Toggle and switch carry `aria-expanded`, `aria-controls`, and labeled states with visible focus rings.
- **SEO** (`layout.tsx`, `site.ts`, `robots.ts`, `sitemap.ts`): per-page unique titles and descriptions with a `%s · The Peace Atlas` template, `metadataBase` from `NEXT_PUBLIC_SITE_URL`, keywords, Open Graph and Twitter cards, robots directives, and `WebSite` JSON-LD. Sitemap priorities favor `/`, `/timeline`, and `/peace-day`.
- **Styling** (`globals.css`): single archival stylesheet with CSS variables, Fraunces/Source Serif 4/IBM Plex Mono type stack, light and dark themes via `[data-theme]`, card/grid/evidence/tag primitives, scroll-contained tables, wrapping form rows, and reduced-motion support. No CSS framework.
- **Accessibility**: skip link, semantic landmarks, one H1 per page, keyboard-operable menu/quiz/games/switch, live regions for AI answers.

## Setup

Requirements: Node 18 or later, npm.

```bash
npm install
npm run validate   # content integrity: IDs, relations, sources, evidence
npm run dev        # http://localhost:3000
```

AI setup (optional):

```bash
cp .env.example .env.local
# edit .env.local: GEMINI_API_KEY=<key>
# optional: GEMINI_MODEL=gemini-3.5-flash-lite
npm run dev
```

For production hosting, set `GEMINI_API_KEY` in the host's environment dashboard, never in code. Without it, `/api/ai` returns 503 and the rest of the site is unaffected. Also set `NEXT_PUBLIC_SITE_URL` to the production origin (no trailing slash) so sitemap, robots, canonical metadata, and JSON-LD use real URLs.

## Workflow

```bash
npm run validate   # must pass before committing content changes
npm run build      # production build, 26 routes including robots/sitemap
npm run start      # serve the production build
```

`validate` fails on duplicate IDs, relations pointing at unknown IDs, references to unknown sources, and entities with no sources or no evidence blocks. Entities with zero inbound links print as warnings (orphan detection), since some valid entries are reachable through search and the timeline rather than relations.

## Adding or editing content

1. Edit the relevant module in `src/lib/data/` (for example `people.ts`, `treaties.ts`, `timeline.ts`).
2. Reuse an existing stable ID or add a new lowercase slug-style ID. Never rename an ID that other entries link to without updating those relations.
3. Fill the required fields the validator checks (for example, people need name, summary, lifespan, region; treaties need date, signatories, provisions; documents need author and an `http` original URL).
4. Add at least one `evidence` block with the correct `kind`, at least one real source ID from `sources.ts`, and relation IDs that exist.
5. Run `npm run validate`, then `npm run build`.

When adding a new source, use a real institutional URL with an access date. Do not invent citations to satisfy the validator.
