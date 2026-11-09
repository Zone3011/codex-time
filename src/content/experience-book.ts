export type MemoryPhoto = { caption: string; src?: `/${string}`; alt?: string };

export type CompanyMemory = {
  id: string;
  company: string;
  role: string;
  accent: string;
  secondary: string;
  monogram: string;
  draftSummary: string;
  summary?: string;
  logoSrc?: `/${string}`;
  photos: MemoryPhoto[];
};

// Company names, roles and colors supplied by Nirav. Logos, dates and work details are pending.
export const companyMemories: CompanyMemory[] = [
  {
    id: "sedani-digital",
    company: "Sedani Digital",
    role: "Intern Software Developer",
    accent: "#24242b",
    secondary: "#e9e8e5",
    monogram: "sd.",
    photos: [
      { caption: "Photo 01" },
      { caption: "Photo 02" },
      { caption: "Photo 03" },
    ],
    draftSummary:
      "A space for the first chapter: the work, the learning, and the details worth keeping.",
  },
  {
    id: "hfiles",
    company: "hfiles",
    role: "Web Developer",
    accent: "#1d5cba",
    secondary: "#f8d34d",
    monogram: "hf",
    photos: [
      { caption: "Photo 01" },
      { caption: "Photo 02" },
      { caption: "Photo 03" },
    ],
    draftSummary:
      "A place to collect web projects, day-to-day work, and the ideas behind them.",
  },
];
