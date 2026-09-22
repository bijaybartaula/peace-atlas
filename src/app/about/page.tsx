import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the atlas",
  description:
    "What The Peace Atlas is: a living knowledge graph on peace and humanity, its method, evidence standards, and how to read it.",
};

export default function AboutPage() {
  return (
    <div>
      <p className="meta">What this is and how to read it</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>About</h1>
      <p>
        The Peace Atlas begins with a single date: 21 September, the International Day of Peace. Established in 1981
        and fixed as a day of non-violence and cease-fire in 2001, the observance is treated here as a doorway into
        the longer human history behind it: the ideas, agreements, movements, and people that have shaped how
        societies imagine and pursue peace.
      </p>
      <p>
        The atlas is organized as a knowledge graph rather than a shelf of articles. A timeline sets the chronological
        frame, while catalogues of events, people, ideas, movements, cultures, treaties, and documents link into one
        another, so every entry opens doors to the next. A quiz teaches rather than scores, games are played with the
        same underlying knowledge, and an optional AI companion helps you explore. Its answers are always labeled as
        interpretation, never authority.
      </p>
      <p>
        Evidence comes first here. Factual claims trace to institutional sources such as the UN, archives,
        universities, and recognized collections, and the text distinguishes documented fact from historical
        interpretation, competing readings, and genuine uncertainty. Nothing requires an account, and quiz and game
        progress lives only in your browser.
      </p>
      <p>
        Start anywhere: <a href="/timeline">the timeline</a>, <a href="/search">search</a>, or{" "}
        <a href="/ai">a question for the research companion</a>. The aim is modest: that you leave with a question
        you did not arrive with.
      </p>
    </div>
  );
}
