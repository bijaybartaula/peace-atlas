"use client";
import { useEffect, useMemo, useState } from "react";
import { quizQuestions } from "@/lib";

const cats = ["all", "mixed", ...Array.from(new Set(quizQuestions.map((q) => q.category))).filter((c) => c !== "mixed")];

export default function QuizPage() {
  const [cat, setCat] = useState("all");
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(0);

  const pool = useMemo(() => quizQuestions.filter((q) => (cat === "all" ? true : q.category === cat || q.category === "mixed")), [cat]);
  useEffect(() => { setIdx(0); setPicked(null); }, [cat]);
  const q = pool[idx % pool.length];

  useEffect(() => {
    try {
      const s = localStorage.getItem("peace-atlas-quiz");
      if (s) { const p = JSON.parse(s); setScore(p.score ?? 0); setDone(p.done ?? 0); }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("peace-atlas-quiz", JSON.stringify({ score, done })); } catch {}
  }, [score, done]);

  if (!q) return <p>No questions in this category.</p>;
  const correct = Array.isArray(q.answer) ? q.answer[0] : q.answer;
  return (
    <div>
      <p className="meta">A serious quiz — every answer teaches</p>
      <h1 className="display" style={{ fontSize: "2.4rem" }}>Quiz</h1>
      <p><span className="tag">score {score} / {done}</span> <span className="tag">{q.kind}</span> <span className="tag">{q.category}</span></p>
      <select aria-label="Quiz category" value={cat} onChange={(e) => setCat(e.target.value)} style={{ maxWidth: 320 }}>
        {cats.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <div className="card" style={{ marginTop: 12 }}>
        <h3>{q.question}</h3>
        {(q.choices ?? [correct, "False"].filter(Boolean)).map((c) => {
          const isC = c === correct;
          const cls = picked ? (isC ? "quiz-choice correct" : c === picked ? "quiz-choice wrong" : "quiz-choice") : "quiz-choice";
          return (
            <button key={c} className={cls} disabled={picked !== null} onClick={() => {
              setPicked(c);
              setDone((d) => d + 1);
              if (isC) setScore((s) => s + 1);
            }}>{c}</button>
          );
        })}
        {picked && (
          <div>
            <p><strong>{picked === correct ? "Correct." : `Not quite — the answer is “${correct}”.`}</strong></p>
            <p><strong>Why:</strong> {q.explanation}</p>
            <button className="ghost" onClick={() => { setIdx((i) => i + 1); setPicked(null); }}>Next question →</button>
          </div>
        )}
      </div>
      <p style={{ fontSize: ".9rem" }}>Progress is stored only in your browser (localStorage). No accounts, no leaderboards, no fabricated stats.</p>
    </div>
  );
}
