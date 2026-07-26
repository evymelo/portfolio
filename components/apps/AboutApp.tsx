import Image from "next/image";
import { Sparkles, MapPin, GraduationCap } from "lucide-react";

const BIO = `Olá! Sou uma pessoa apaixonada por criar experiências digitais
com carinho e atenção aos detalhes. Gosto de transformar ideias em
interfaces simples, bonitas e funcionais.`;

const FACTS = [
  { icon: MapPin, label: "Localizado em", value: "Garanhuns, Pernambuco" },
  { icon: GraduationCap, label: "Formação", value: "ADS - IFPE, Garanhuns" },
  { icon: Sparkles, label: "Foco atual", value: "Full-Stack & designer" },
];

export default function AboutApp() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-os-pink">
          <Image src="/icons/icon01.png" alt="" width={40} height={40} />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-os-ink">
            Evelyn Melo
          </h2>
          <p className="font-body text-sm text-os-ink/70">
            Desenvolvedora &amp; Designer
          </p>
        </div>
      </div>

      <p className="font-body text-sm leading-relaxed text-os-ink/80">
        {BIO}
      </p>

      <div className="flex flex-col gap-2.5">
        {FACTS.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl bg-os-mist/70 px-3.5 py-2.5"
          >
            <Icon className="h-4 w-4 shrink-0 text-os-ink/60" />
            <span className="font-body text-sm text-os-ink/60">{label}:</span>
            <span className="font-body text-sm font-medium text-os-ink">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
