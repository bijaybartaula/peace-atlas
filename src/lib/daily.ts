import { people, events, ideas, treaties, documents, quizQuestions, timeline } from "./index";

// Deterministic daily rotation: no accounts, no tracking.
export function dayIndex(days = 1): number {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const day = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start) / 86400000);
  return (day + now.getUTCFullYear() * 37) % days;
}

export function dailyDiscovery() {
  const pick = <T,>(arr: T[]): T => arr[dayIndex(arr.length) % arr.length];
  return {
    event: pick(events),
    person: pick(people),
    idea: pick(ideas),
    treaty: pick(treaties),
    document: pick(documents),
    question: pick(quizQuestions),
    timelineEntry: pick(timeline),
  };
}
