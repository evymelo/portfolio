import type { DecorKind } from "@/lib/village-data";

export function RoofDecor({ kind, size = 70 }: { kind: DecorKind; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 100 100" } as const;

  switch (kind) {
    case "bow":
      return (
        <svg {...common}>
          <path d="M50 50 C30 22 8 26 10 48 C12 70 34 72 50 56Z" fill="#E8344E" stroke="#B3203A" strokeWidth="3" />
          <path d="M50 50 C70 22 92 26 90 48 C88 70 66 72 50 56Z" fill="#E8344E" stroke="#B3203A" strokeWidth="3" />
          <path d="M44 56 L36 82 L48 74 Z M56 56 L64 82 L52 74Z" fill="#E8344E" stroke="#B3203A" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="50" cy="52" r="10" fill="#F25C7A" stroke="#B3203A" strokeWidth="3" />
          <ellipse cx="26" cy="42" rx="5" ry="3" fill="#fff" opacity=".6" />
        </svg>
      );
    case "melody":
      return (
        <svg {...common}>
          <path d="M30 70 C18 40 20 10 32 8 C44 6 46 40 42 70Z" fill="#FFFFFF" stroke="#FF8FB1" strokeWidth="3" />
          <path d="M58 70 C54 40 56 6 68 8 C80 10 82 40 70 70Z" fill="#FFFFFF" stroke="#FF8FB1" strokeWidth="3" />
          <path d="M33 60 C28 40 29 20 33 16 M67 60 C72 40 71 20 67 16" stroke="#FFC2D4" strokeWidth="5" strokeLinecap="round" fill="none" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle
              key={a}
              cx={70 + 9 * Math.cos((a * Math.PI) / 180)}
              cy={66 + 9 * Math.sin((a * Math.PI) / 180)}
              r="7"
              fill="#FF9DBB"
              stroke="#E8668F"
              strokeWidth="2"
            />
          ))}
          <circle cx="70" cy="66" r="5" fill="#FFE27A" />
        </svg>
      );
    case "purin":
      return (
        <svg {...common}>
          <ellipse cx="50" cy="66" rx="34" ry="12" fill="#7E4F27" />
          <path d="M18 64 C18 36 82 36 82 64Z" fill="#9A6435" stroke="#6B4220" strokeWidth="3" />
          <rect x="47" y="24" width="6" height="14" rx="3" fill="#6B4220" />
          <ellipse cx="38" cy="48" rx="8" ry="4" fill="#fff" opacity=".25" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path
            d="M24 70 C10 70 8 52 22 50 C20 34 40 30 46 42 C50 28 74 28 76 46 C92 46 92 70 76 70Z"
            fill="#FFFFFF"
            stroke="#8FCBF2"
            strokeWidth="3"
          />
          <path d="M78 58 C90 56 92 44 84 40 C78 38 76 46 82 48" stroke="#8FCBF2" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="58" r="3" fill="#2B6F9E" />
          <circle cx="58" cy="58" r="3" fill="#2B6F9E" />
          <ellipse cx="34" cy="64" rx="4" ry="2.5" fill="#FFC7DA" />
          <ellipse cx="64" cy="64" rx="4" ry="2.5" fill="#FFC7DA" />
        </svg>
      );
    case "kuromi":
      return (
        <svg {...common}>
          <path d="M22 72 C12 46 14 16 24 10 C34 18 36 46 40 70Z" fill="#26202F" stroke="#B79CF2" strokeWidth="2.5" />
          <path d="M78 72 C88 46 86 16 76 10 C66 18 64 46 60 70Z" fill="#26202F" stroke="#B79CF2" strokeWidth="2.5" />
          <path d="M20 74 C20 50 80 50 80 74Z" fill="#26202F" stroke="#B79CF2" strokeWidth="2.5" />
          <path d="M50 52 C40 52 38 60 40 64 L44 68 L56 68 L60 64 C62 60 60 52 50 52Z" fill="#F48FB1" />
          <circle cx="46" cy="60" r="2.4" fill="#26202F" />
          <circle cx="54" cy="60" r="2.4" fill="#26202F" />
          <circle cx="24" cy="12" r="4" fill="#F48FB1" />
          <circle cx="76" cy="12" r="4" fill="#F48FB1" />
        </svg>
      );
    case "paw":
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="38" fill="#FFD54F" stroke="#E0A800" strokeWidth="3" />
          <path d="M14 42 C40 52 60 52 86 42" stroke="#5AAEE8" strokeWidth="6" fill="none" />
          <ellipse cx="50" cy="62" rx="11" ry="9" fill="#3D3D3D" />
          <circle cx="36" cy="48" r="5" fill="#3D3D3D" />
          <circle cx="46" cy="42" r="5" fill="#3D3D3D" />
          <circle cx="56" cy="42" r="5" fill="#3D3D3D" />
          <circle cx="65" cy="48" r="5" fill="#3D3D3D" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="14" y="30" width="72" height="48" rx="8" fill="#FFFFFF" stroke="#E25B5B" strokeWidth="3" />
          <path d="M16 34 L50 58 L84 34" fill="none" stroke="#E25B5B" strokeWidth="3" strokeLinejoin="round" />
          <path d="M50 52 C44 44 34 48 40 56 L50 64 L60 56 C66 48 56 44 50 52Z" fill="#F25C7A" />
        </svg>
      );
  }
}

export function Heart({ size = 16, filled = true, color = "#F25C7A" }: { size?: number; filled?: boolean; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.2 0 3.6 1.2 5.2 3 1.6-1.8 3-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}

export function Bow({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={className} style={{ display: "inline-block", lineHeight: 0 }}>
      <RoofDecor kind="bow" size={size} />
    </span>
  );
}

export function IconBadge({ children, size = 28 }: { children: React.ReactNode; size?: number }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-white shadow-sm align-middle"
    >
      {children}
    </span>
  );
}

export function ContactIcon({ kind, color, size = 32 }: { kind: "email" | "github" | "linkedin"; color: string; size?: number }) {
  if (kind === "email") return <RoofDecor kind="mail" size={size} />;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {kind === "github" ? (
          <path d="M36 36 L16 54 L36 72 M64 36 L84 54 L64 72 M56 32 L44 76" />
        ) : (
          <path d="M30 48 V76 M45 76 V48 M45 60 C45 51 52 46 61 46 C70 46 76 51 76 60 V76" />
        )}
      </g>
      {kind === "linkedin" && <circle cx="30" cy="36" r="3.5" fill={color} />}
    </svg>
  );
}
