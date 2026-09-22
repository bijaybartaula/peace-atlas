import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "No accounts, no tracking: how The Peace Atlas handles privacy and local-only progress.",
};

export default function PrivacyPage() {
  return (
    <div>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Privacy</h1>
      <p>No accounts, no payments, no subscriptions, no tracking analytics. Quiz and game progress and bookmarks (if added) live only in your browser&apos;s local storage and never leave your device.</p>
      <p>AI questions are sent to the configured model provider (Gemini) via our server route solely to answer your prompt; do not include personal data. Server logs follow standard hosting retention.</p>
    </div>
  );
}
