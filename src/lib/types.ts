// Central typed schemas for The Peace Atlas.
// Every entity has a stable id and explicit relationship arrays so the
// site behaves as a knowledge graph, not a set of disconnected articles.

export type EvidenceKind =
  | "documented-fact"
  | "interpretation"
  | "competing-interpretation"
  | "uncertainty"
  | "ai-synthesis";

export interface EvidenceBlock {
  kind: EvidenceKind;
  label: string;
  text: string;
}

export type SourceType =
  | "primary"
  | "secondary"
  | "reference"
  | "institutional"
  | "ai-synthesis";

export interface Source {
  id: string;
  title: string;
  publisher: string;
  author?: string;
  publicationDate?: string;
  accessDate: string;
  url: string;
  type: SourceType;
  notes?: string;
}

export interface BaseEntity {
  id: string;
  name: string;
  summary: string;
  slug?: string;
}

export interface Person extends BaseEntity {
  lifespan: string;
  birthYear?: number;
  deathYear?: number;
  region: string;
  occupations: string[];
  context: string;
  ideas: string[];
  keyWorks: string[];
  organizations: string[];
  influence: string;
  criticism: string;
  evidence: EvidenceBlock[];
  relatedEvents: string[];
  relatedIdeas: string[];
  relatedDocuments: string[];
  relatedTreaties: string[];
  relatedPeople: string[];
  sources: string[];
}

export interface HistoricalEvent extends BaseEntity {
  date: string;
  year?: number;
  circa?: boolean;
  place: string;
  participants: string[];
  context: string;
  sequence: string[];
  outcomes: string[];
  consequences: string;
  evidence: EvidenceBlock[];
  relatedPeople: string[];
  relatedTreaties: string[];
  relatedIdeas: string[];
  relatedDocuments: string[];
  relatedEvents: string[];
  sources: string[];
}

export interface Idea extends BaseEntity {
  definition: string;
  origins: string;
  evolution: string;
  keyThinkers: string[];
  applications: string[];
  criticisms: string[];
  evidence: EvidenceBlock[];
  relatedIdeas: string[];
  relatedEvents: string[];
  relatedPeople: string[];
  relatedDocuments: string[];
  sources: string[];
}

export interface Treaty extends BaseEntity {
  date: string;
  year?: number;
  place: string;
  signatories: string[];
  addressed: string;
  provisions: string[];
  context: string;
  implementation: string;
  developments: string;
  criticism: string;
  evidence: EvidenceBlock[];
  relatedEvents: string[];
  relatedPeople: string[];
  relatedIdeas: string[];
  relatedDocuments: string[];
  sources: string[];
}

export interface Movement extends BaseEntity {
  period: string;
  startYear?: number;
  endYear?: number;
  location: string;
  objectives: string[];
  methods: string[];
  organizers: string[];
  context: string;
  achievements: string;
  opposition: string;
  consequences: string;
  evidence: EvidenceBlock[];
  relatedEvents: string[];
  relatedPeople: string[];
  relatedIdeas: string[];
  relatedDocuments: string[];
  sources: string[];
}

export interface CultureTradition extends BaseEntity {
  region: string;
  traditionType: string;
  keyTerms: { term: string; transliteration?: string; meaning: string }[];
  practices: string[];
  textsOrArtworks: string[];
  context: string;
  interpretationNote: string;
  evidence: EvidenceBlock[];
  relatedIdeas: string[];
  relatedPeople: string[];
  relatedEvents: string[];
  sources: string[];
}

export interface AtlasDocument extends BaseEntity {
  date: string;
  year?: number;
  author: string;
  institution?: string;
  category:
    | "UN resolution"
    | "treaty text"
    | "declaration"
    | "speech"
    | "letter"
    | "philosophical text"
    | "convention"
    | "academic resource"
    | "archival material";
  context: string;
  explanation: string;
  excerpt?: string;
  originalUrl: string;
  evidence: EvidenceBlock[];
  relatedPeople: string[];
  relatedEvents: string[];
  relatedIdeas: string[];
  relatedTreaties: string[];
  sources: string[];
}

export type TimelineCategory =
  | "ancient civilization"
  | "philosophical tradition"
  | "religious tradition"
  | "major conflict"
  | "peace agreement"
  | "diplomatic development"
  | "international organization"
  | "peace movement"
  | "legal development"
  | "cultural milestone"
  | "technological development"
  | "contemporary event";

export interface TimelineEntry {
  id: string;
  title: string;
  dateLabel: string;
  year: number;
  circa?: boolean;
  category: TimelineCategory;
  location: string;
  people: string[];
  summary: string;
  context: string;
  whyItMatters: string;
  consequences: string;
  relatedEvents: string[];
  relatedPeople: string[];
  relatedTreaties: string[];
  relatedIdeas: string[];
  relatedDocuments: string[];
  disagreement?: string;
  sources: string[];
}

export type QuizCategory =
  | "ancient history"
  | "modern history"
  | "people"
  | "treaties"
  | "diplomacy"
  | "philosophy"
  | "institutions"
  | "culture"
  | "documents"
  | "geography"
  | "peace day"
  | "mixed";

export type QuizKind =
  | "multiple-choice"
  | "true-false"
  | "identify-person"
  | "identify-event"
  | "ordering"
  | "connection"
  | "source-based";

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  kind: QuizKind;
  question: string;
  choices?: string[];
  answer: string | string[];
  explanation: string;
  relatedIds: string[];
  sources: string[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  example?: string;
  relatedIdeas: string[];
  relatedTerms: string[];
}

export type EntityType =
  | "person"
  | "event"
  | "idea"
  | "treaty"
  | "movement"
  | "culture"
  | "document"
  | "timeline"
  | "glossary"
  | "peace-day";
