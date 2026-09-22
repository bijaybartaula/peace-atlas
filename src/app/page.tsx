import type { Metadata } from "next";
import { events, people, ideas, treaties, documents, timeline, quizQuestions } from "@/lib";
import { dailyDiscovery } from "@/lib/daily";
import { currentTheme, currentPeaceDayYear } from "@/lib/data/peaceDay";
import { Relations } from "@/components/Entity";

export const metadata: Metadata = {
  title: "Explore the history of peace",
  description:
    "Start with 21 September and follow it outward: daily discoveries of people, events, ideas, treaties, and documents across humanity's history of peace.",
};

export default function Home() {
  const d = dailyDiscovery();
  const theme = currentTheme();
  return (
    <div>
      <p className="meta">21 September is one date. The history behind it is thousands of years old.</p>
      <h1 className="display hero-title">
        The Peace Atlas: what humanity has thought, built, broken, and repaired.
      </h1>
      <p style={{ maxWidth: "68ch", fontSize: "1.1rem" }}>
        The International Day of Peace (established in 1981 through Resolution 36/67, then fixed to 21 September
        as a day of non-violence and cease-fire in 2001 through Resolution 55/282) is the doorway, not the
        destination. Inside:{" "}
        {people.length} people, {events.length} events, {ideas.length} ideas, {treaties.length} treaties,{" "}
        {timeline.length} timeline entries, {documents.length} documents, and {quizQuestions.length} teaching questions.
        Every entry is linked and sourced, with honest marking of what is fact, what is interpretation, and what is uncertain.
      </p>
      <p>
        <span className="tag">Peace Day {currentPeaceDayYear}</span> <strong>{theme.theme}</strong>
        <br /><span style={{ fontSize: ".9rem" }}>Dated display. Please confirm the current theme at the <a href="https://www.un.org/en/observances/international-day-peace">UN observance page</a>. {theme.note}</span>
      </p>
      <hr className="rule" />

      <h2 className="display">Today in the atlas <span className="meta">(rotates daily, no account)</span></h2>
      <div className="grid two">
        <div className="card"><p className="meta">A person to know</p><h3><a href={`/people#${d.person.id}`}>{d.person.name}</a></h3><p>{d.person.summary}</p></div>
        <div className="card"><p className="meta">An event to investigate</p><h3><a href={`/events#${d.event.id}`}>{d.event.name}</a></h3><p>{d.event.summary}</p></div>
        <div className="card"><p className="meta">An idea to consider</p><h3><a href={`/ideas#${d.idea.id}`}>{d.idea.name}</a></h3><p>{d.idea.summary}</p></div>
        <div className="card"><p className="meta">A treaty to understand</p><h3><a href={`/treaties#${d.treaty.id}`}>{d.treaty.name}</a></h3><p>{d.treaty.summary}</p></div>
        <div className="card"><p className="meta">A document to read</p><h3><a href={`/documents#${d.document.id}`}>{d.document.name}</a></h3><p>{d.document.summary}</p></div>
        <div className="card"><p className="meta">A question to think about</p><h3><a href="/quiz">{d.question.question}</a></h3><p>Answer with explanation in the quiz — it teaches even when you are wrong.</p></div>
      </div>

      <hr className="rule" />
      <h2 className="display">Start a chain of curiosity</h2>
      <p>International Day of Peace → 1981 resolution → earlier observances → 2001 cease-fire → peace movements → treaties → people → ideas → documents → quiz → timeline → AI explanation → another question.</p>
      <Relations ids={["peace-day-ceasefire-2001", "bertha-von-suttner", "treaty-npt-1968", "non-violence", "udhr-1948"]} />
      <p>
        <a className="btn" href="/timeline">Explore the timeline</a>{" "}
        <a className="btn ghost" href="/search">Search the atlas</a>{" "}
        <a className="btn ghost" href="/games">Play Timeline Challenge</a>
      </p>

      <hr className="rule" />
      <h2 className="display">How to read this atlas</h2>
      <div className="grid three">
        <div className="card"><p className="meta">Level 1–2</p><h3>Discover → Understand</h3><p>What is this? What happened? Begin anywhere; every card links onward.</p></div>
        <div className="card"><p className="meta">Level 3–5</p><h3>Context → Connection → Interpretation</h3><p>Why did it happen? What is it connected to? How do historians disagree?</p></div>
        <div className="card"><p className="meta">Level 6–7</p><h3>Evidence → Exploration</h3><p>What are the sources? What should I investigate next? Leave with a new question.</p></div>
      </div>
    </div>
  );
}
