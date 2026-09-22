import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms for using The Peace Atlas: educational purpose, copyright respect, and AI synthesis guidance.",
};

export default function TermsPage() {
  return (
    <div>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Terms of use</h1>
      <p>Educational resource. Summaries link to authoritative originals; respect third-party copyright and do not reproduce bulk copyrighted works. AI output is labeled synthesis — verify against cited sources, especially for contested or contemporary matters.</p>
      <p>No warranty of completeness; historical knowledge is revised as evidence changes. Uncertainty is marked where it exists.</p>
    </div>
  );
}
