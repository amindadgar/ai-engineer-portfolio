// Homepage sections in page order, used by the "On this page" navigation.
export const pageSections = [
  { id: "about", label: "About" },
  { id: "ask", label: "Ask AI" },
  { id: "recommendations", label: "Recommendations" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "github", label: "GitHub" },
  { id: "skills", label: "Skills" },
  { id: "writings", label: "Writings" },
  { id: "volunteer", label: "Community" },
  { id: "contact", label: "Contact" },
] as const;

export type PageSection = (typeof pageSections)[number];
