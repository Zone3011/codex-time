export type PortfolioProject = {
  id: string;
  title: string;
  summary: string;
  labels: string[];
  cover: "themes" | "scraper" | "sterling";
  href?: string;
  imageSrc?: `/${string}`;
  imageAlt?: string;
};

// Only owner-supplied projects and descriptions; illustrations are not project screenshots.
export const portfolioProjects: PortfolioProject[] = [
  {
    id: "twenty-themes",
    title: "20 Ways to See the Same Thing",
    summary: "A WordPress project built around 20 different themes.",
    labels: ["WordPress", "20 themes"],
    cover: "themes",
  },
  {
    id: "creaup",
    title: "Creaup",
    summary: "A web scraper that collects data from other websites.",
    labels: ["Web scraping", "Data collection"],
    cover: "scraper",
  },
  {
    id: "sterling",
    title: "Sterling",
    summary: "A WordPress website for Sterling.",
    labels: ["WordPress", "Website"],
    cover: "sterling",
  },
];
