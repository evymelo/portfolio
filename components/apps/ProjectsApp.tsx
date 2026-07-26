import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    title: "Nome do Projeto 1",
    tags: ["React", "Next.js"],
    description: "Em andamento.",
    link: "#",
  },
  {
    title: "Nome do Projeto 2",
    tags: ["UI Design", "Figma"],
    description: "Em andamento.",
    link: "#",
  },
  {
    title: "Nome do Projeto 3",
    tags: ["Node.js", "React"],
    description: "Em andamento.",
    link: "#",
  },
];

export default function ProjectsApp() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg font-semibold text-os-ink">
        Meus Projetos
      </h2>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <a
            key={p.title}
            href={p.link}
            className="group flex flex-col gap-2.5 rounded-2xl border border-os-lilac/40 bg-os-mist/60 p-4 transition hover:bg-os-pink/40"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-display text-base font-semibold text-os-ink">
                {p.title}
              </h3>
              <ArrowUpRight className="h-4 w-4 text-os-ink/50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="font-body text-sm leading-snug text-os-ink/70">
              {p.description}
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-os-slate/30 px-2.5 py-0.5 font-body text-xs font-medium text-os-ink/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
