import { Mail, Code2, BriefcaseBusiness } from "lucide-react";

const LINKS = [
  { icon: Mail, label: "evyszf@gmail.com", href: "mailto:evyszf@gmail.com" },
  { icon: Code2, label: "github.com/evymelo", href: "https://github.com/evymelo" },
  { icon: BriefcaseBusiness, label: "linkedin.com/in/evelyn", href: "https://www.linkedin.com/in/evelyn-m-430880275/" },
];

export default function ContactApp() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg font-semibold text-os-ink">
        Vamos conversar?
      </h2>
      <p className="font-body text-sm text-os-ink/70">
        Fico feliz em trocar uma ideia sobre projetos, trabalho ou apenas
        bater um papo. Me encontre por aqui:
      </p>
      <div className="flex flex-col gap-2.5">
        {LINKS.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-xl bg-os-mist/70 px-3.5 py-3 transition hover:bg-os-pink/40"
          >
            <Icon className="h-4 w-4 shrink-0 text-os-ink/60" />
            <span className="font-body text-sm font-medium text-os-ink">
              {label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
