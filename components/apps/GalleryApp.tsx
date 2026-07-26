import { Image } from "lucide-react";

const PLACEHOLDERS = [
  "bg-os-pink",
  "bg-os-lilac",
  "bg-os-slate",
  "bg-os-mist",
  "bg-os-lilac",
  "bg-os-pink",
];

export default function GalleryApp() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg font-semibold text-os-ink">
        Galeria
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PLACEHOLDERS.map((color, i) => (
          <div
            key={i}
            className={`flex aspect-square items-center justify-center rounded-2xl border border-white/60 ${color}`}
          >
            <Image className="h-6 w-6 text-os-ink/40" />
          </div>
        ))}
      </div>
      <p className="font-body text-xs text-os-ink/50">
        Adicionar fotos/registros.
      </p>
    </div>
  );
}
