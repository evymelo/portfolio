const SKILL_GROUPS = [
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
    ],
  },
];

export default function SkillsApp() {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-lg font-semibold text-os-ink">
        Habilidades
      </h2>
      {SKILL_GROUPS.map((group) => (
        <div key={group.category} className="flex flex-col gap-2.5">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-os-ink/60">
            {group.category}
          </h3>
          <div className="flex flex-col gap-3">
            {group.items.map((item) => (
              <div key={item.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-body text-sm font-medium text-os-ink">
                    {item.name}
                  </span>
                  <span className="font-body text-xs text-os-ink/50">
                    {item.level}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-os-mist">
                  <div
                    className="h-2 rounded-full bg-os-slate"
                    style={{ width: `${item.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
