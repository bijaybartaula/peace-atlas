// Canonical site URL. Set NEXT_PUBLIC_SITE_URL in production (see .env.example);
// falls back to localhost for local development.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const siteName = "The Peace Atlas";

export const siteRoutes = [
  "/",
  "/timeline",
  "/events",
  "/people",
  "/ideas",
  "/movements",
  "/cultures",
  "/treaties",
  "/documents",
  "/peace-day",
  "/ai",
  "/quiz",
  "/games",
  "/sources",
  "/glossary",
  "/search",
  "/about",
];
