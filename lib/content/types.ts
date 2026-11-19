export type Cta = { label: string; href: string };
export type Logo = { name: string; src: string; width: number; height: number; href?: string };
export type Stat = { value: number | null; prefix?: string; suffix: string; label: string; source?: string };

export type BentoItem =
  | { kind: "photo"; src: string; alt: string; caption: string; span?: "tall" | "wide" }
  | { kind: "role"; years: string; org: string; title: string; text: string; logo?: string; span?: "tall" | "wide"; tone?: Tone }
  | { kind: "figure"; value: string; label: string; span?: "tall" | "wide"; tone?: Tone };

export type Tone = "navy" | "sky" | "white" | "blue" | "teal";

export type Expertise = {
  number: string;
  tag: string;
  title: string;
  lead: string;
  points: string[];
  href: string;
  cta: string;
  image?: string;
  tone: Tone;
};

export type TranslatorTerm = { term: string; plain: string; example: string };

export type BookStatus = "writing" | "preorder" | "available";

export type Offer = { title: string; text: string };
export type SpeakingTab = { key: string; title: string; text: string; points: string[] };

export type HomeContent = {
  hero: {
    label: string;
    line1: string;
    line2: string;
    keywords: string[];
    subtitle: string;
    primaryCta: Cta;
    secondaryCta: Cta;
    portraitAlt: string;
  };
  trust: { label: string; logos: Logo[] };
  profile: { label: string; title: string; paragraphs: string[]; email: string };
  stats: Stat[];
  bento: { label: string; title: string; text: string; items: BentoItem[] };
  ticker: string[];
  expertises: { label: string; title: string; intro: string; items: Expertise[] };
  translator: { label: string; title: string; terms: TranslatorTerm[]; moreHref: string };
  tools: { label: string; title: string; text: string; chips: Cta[] };
  articles: { label: string; title: string };
  books: { label: string; title: string; intro: string; waitlistTitle: string; waitlistText: string };
  pmp: { badge: string; title: string; text: string; chips: { value: string; label: string }[]; cta: Cta; note: string };
  coaching: { label: string; title: string; text: string; options: Offer[]; cta: Cta };
  speaking: { label: string; title: string; text: string; tabs: SpeakingTab[]; cta: Cta };
  testimonials: { label: string; title: string };
  newsletter: { label: string; title: string; text: string; interests: { value: string; label: string }[] };
  contact: { label: string; title: string; text: string; reasons: string[] };
};

export type LexiconTerm = { term: string; short: string };
export type Category = { slug: string; name: string; isFinance: boolean };

export type ArticleMeta = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingMinutes: number;
  publishedAt: string;
  cover: "payslip" | "net" | "budget" | "shield" | "exam" | "curve" | "tax" | "growth";
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company?: string;
  linkedin?: string;
  photo?: string;
  /** URL YouTube/Vimeo, ou fichier vidéo (/videos/xxx.mp4 ou Supabase Storage) */
  videoUrl?: string;
  poster?: string;
  featured?: boolean;
  published: boolean;
  note?: string;
};

export type GalleryItem = { src: string; alt: string; width: number; height: number; caption?: string };

export type Book = {
  slug: string;
  title: string;
  subtitle: string;
  status: BookStatus;
  statusLabel: string;
  pitch: string;
  cover?: string;
  color?: string;
  excerpts: { title: string; body: string }[];
  buyLinks: { label: string; href: string }[];
};
