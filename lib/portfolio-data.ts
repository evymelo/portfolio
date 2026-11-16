export const PROFILE = {
  name: "Evelyn Melo",
  role: "Software Engineer",
  bio: "Olá! Sou uma pessoa apaixonada por criar experiências digitais com carinho e atenção aos detalhes. Gosto de transformar ideias em interfaces simples, bonitas e funcionais.",
  location: "Garanhuns, Pernambuco",
  education: "ADS - IFPE, Garanhuns",
  focus: "Software Engineer",
};

export interface SkillGroup {
  category: string;
  items: { name: string; level: number }[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Front-end",
    items: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 75 },
      { name: "Tailwind CSS", level: 90 },
    ],
  },
  {
    category: "Design",
    items: [
      { name: "Figma", level: 95 },
      { name: "UI / UX", level: 85 },
    ],
  },
  {
    category: "Back-end",
    items: [
      { name: "Node.js", level: 90 },
      { name: "PHP", level: 85 },
      { name: "Java", level: 70 },
      { name: "Python", level: 75 },
    ],
  },
  {
    category: "IA",
    items: [
      { name: "LLMs", level: 80 },
      { name: "RAG", level: 70 },
      { name: "MCP", level: 70 },
      { name: "Agentes de IA", level: 80 },
    ],
  },
];

export interface Project {
  slug: string;
  title: string;
  tags: string[];
  description: string;
  link: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "bikcraft",
    title: "Bikcraft",
    tags: ["HTML/CSS", "JavaScript"],
    description: "Concluído.",
    link: "https://bikcraft-bicicletas-eletricas.vercel.app/",
  },
  {
    slug: "lune",
    title: "Lune",
    tags: ["UI Design", "Figma"],
    description: "Concluído.",
    link: "https://www.figma.com/design/UcQu23QxMeOFX2xY9Fb5ZW/Lune?node-id=0-1&t=7EEKeSforwsYEUMX-1",
  },
  {
    slug: "projeto-3",
    title: "Nome do Projeto 3",
    tags: ["Node.js", "React"],
    description: "Em andamento.",
    link: "#",
  },
];

export interface ContactLink {
  kind: "email" | "github" | "linkedin";
  label: string;
  href: string;
}

export const CONTACT_LINKS: ContactLink[] = [
  { kind: "email", label: "evyszf@gmail.com", href: "mailto:evyszf@gmail.com" },
  { kind: "github", label: "github.com/evymelo", href: "https://github.com/evymelo" },
  {
    kind: "linkedin",
    label: "linkedin.com/in/evelyn",
    href: "https://www.linkedin.com/in/evelyn-m-430880275/",
  },
];

export function openLink(href: string) {
  if (href.startsWith("mailto:")) {
    window.location.href = href;
  } else {
    window.open(href, "_blank", "noopener,noreferrer");
  }
}
