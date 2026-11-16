export type DecorKind = "bow" | "melody" | "purin" | "cloud" | "kuromi" | "paw" | "mail";

export interface HousePalette {
  wall: string;
  wallSide: string;
  roof: string;
  roofBack: string;
  door: string;
  trim: string;
  accent: string;
  room: string;
  ink: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface House {
  id: string;
  resident: string;
  label: string;
  guide: string;
  kind: "about" | "experience" | "contact";
  title: string;
  company?: string;
  tagline: string;
  summary: string;
  highlights: string[];
  metrics?: Metric[];
  stack: string[];
  decor: DecorKind;
  palette: HousePalette;
  x: number;
  y: number;
  size: { w: number; d: number; h: number; roof: number };
}

export const HOUSES: House[] = [
  {
    id: "kitty",
    resident: "Hello Kitty",
    label: "Casa da Hello Kitty",
    guide: "Oi! Bem-vinda à vila! Comece pela casa da Hello Kitty: lá você conhece a Evelyn.",
    kind: "about",
    title: "Prazer, Evelyn!",
    tagline: "Software Engineer",
    summary:
      "Sou apaixonada por criar experiências digitais com carinho e atenção aos detalhes. Transformo ideias em interfaces simples, bonitas e funcionais, do protótipo no Figma até o back-end em produção.",
    highlights: [
      "Formação em Análise e Desenvolvimento de Sistemas (IFPE Garanhuns)",
      "Experiência do design (UX/UI) à engenharia de performance e cloud",
      "Uso de agentes de IA no dia a dia para investigar, entender e acelerar entregas",
    ],
    stack: ["React", "Next.js", "TypeScript", "Node.js", "Java", "Python", "PHP", "LLMs", "AWS", "Figma"],
    decor: "bow",
    palette: {
      wall: "#FFFFFF",
      wallSide: "#F3E9EE",
      roof: "#F25C7A",
      roofBack: "#D9445F",
      door: "#F7B2C1",
      trim: "#FFD86B",
      accent: "#E8344E",
      room: "#FFF0F4",
      ink: "#B3264A",
    },
    x: 0,
    y: 330,
    size: { w: 190, d: 130, h: 120, roof: 65 },
  },
  {
    id: "melody",
    resident: "My Melody",
    label: "Casa da My Melody",
    guide: "Agora siga o caminho até a casa da My Melody. Ela adora um design caprichado!",
    kind: "experience",
    title: "Plataforma de Atendimento",
    company: "Show Tecnologia/Omnilink",
    tagline: "Do Figma ao código, com foco em UX/UI",
    summary:
      "Evoluí a plataforma de atendimento de ponta a ponta: prototipei as telas no Figma e implementei as interfaces, conectando o front ao back-end com APIs e comunicação em tempo real.",
    highlights: [
      "Prototipação no Figma e implementação das interfaces com foco em UX/UI",
      "Front-end em jQuery e CSS integrado a serviços em Node.js e PHP",
      "Criação e consumo de APIs REST e WebSockets para atualizações em tempo real",
      "Endpoints com busca inteligente e paginação",
    ],
    stack: ["Figma", "jQuery", "CSS", "Node.js", "PHP", "REST", "WebSockets"],
    decor: "melody",
    palette: {
      wall: "#FFE6EE",
      wallSide: "#F7D3DF",
      roof: "#FF9DBB",
      roofBack: "#EE7FA2",
      door: "#FFFFFF",
      trim: "#FFF6B3",
      accent: "#FF6F9C",
      room: "#FFF2F6",
      ink: "#C2416E",
    },
    x: -340,
    y: 110,
    size: { w: 160, d: 120, h: 110, roof: 60 },
  },
  {
    id: "purin",
    resident: "Pompompurin",
    label: "Casa do Pompompurin",
    guide: "Próxima parada: casa do Pompompurin. Aqui tem relatório com milhões de registros!",
    kind: "experience",
    title: "Relatórios de Alta Performance & Engenharia de IA",
    company: "Show Tecnologia/Omnilink",
    tagline: "Milhões de registros, pouquíssima memória",
    summary:
      "Resolvi falhas críticas em relatórios com milhões de registros. Com agentes de IA mapeei fluxos e gargalos, e reestruturei a geração com streaming e escrita incremental, sem estourar a memória.",
    highlights: [
      "Agentes de IA para analisar código, mapear fluxos e acelerar diagnósticos",
      "Reestruturação em Node.js + TypeScript com streaming e escrita incremental em disco",
      "Exportação em JSON, XLSX e CSV com ExcelJS Streaming",
      "Compressão Gzip e upload multipart para AWS S3",
    ],
    metrics: [
      { value: "1M", label: "registros por relatório" },
      { value: "40–60 MB", label: "de memória estável" },
      { value: "−85%", label: "no tamanho com Gzip" },
    ],
    stack: ["Node.js", "TypeScript", "Streams", "ExcelJS", "Gzip", "AWS S3", "Agentes de IA"],
    decor: "purin",
    palette: {
      wall: "#FFF1B5",
      wallSide: "#F5E09A",
      roof: "#9A6435",
      roofBack: "#7E4F27",
      door: "#C98A4B",
      trim: "#FFFFFF",
      accent: "#E3A93A",
      room: "#FFF8DD",
      ink: "#7A4A1E",
    },
    x: -300,
    y: -250,
    size: { w: 160, d: 120, h: 105, roof: 60 },
  },
  {
    id: "cinna",
    resident: "Cinnamoroll",
    label: "Casa do Cinnamoroll",
    guide: "Vamos voar até a casa do Cinnamoroll. Ela fica pertinho das nuvens (e da cloud!).",
    kind: "experience",
    title: "Interfaces, Sustentação & Cloud",
    company: "Show Tecnologia/Omnilink",
    tagline: "Sites bonitos no ar e incidentes resolvidos rápido",
    summary:
      "Desenvolvi o site institucional e a Landing Page Siga-me, com animações e responsividade. Na sustentação, analisei incidentes com AWS DynamoDB, sempre orientada por SLAs.",
    highlights: [
      "Site institucional e Landing Page Siga-me com Next.js, React e Tailwind CSS",
      "Animações, responsividade e testes end-to-end",
      "Sustentação e análise de incidentes com AWS DynamoDB",
      "Atuação orientada por SLAs, com foco em estabilidade e eficiência",
    ],
    metrics: [{ value: "~80%", label: "menos tempo médio de resolução" }],
    stack: ["Next.js", "React", "Tailwind CSS", "Testes E2E", "AWS DynamoDB"],
    decor: "cloud",
    palette: {
      wall: "#FFFFFF",
      wallSide: "#E6F2FB",
      roof: "#8FCBF2",
      roofBack: "#6DB4E4",
      door: "#C9E7FA",
      trim: "#FFC7DA",
      accent: "#4AA3DE",
      room: "#F0F8FF",
      ink: "#2B6F9E",
    },
    x: 40,
    y: -380,
    size: { w: 170, d: 120, h: 115, roof: 60 },
  },
  {
    id: "kuromi",
    resident: "Kuromi",
    label: "Casa da Kuromi",
    guide: "Hora de visitar a Kuromi! Ela automatiza tudo pra não ter que fazer trabalho chato!",
    kind: "experience",
    title: "Automação de Processos & IA",
    company: "Show Tecnologia/Omnilink",
    tagline: "Menos tarefa manual, mais eficiência",
    summary:
      "Automatizei atividades operacionais para reduzir trabalho manual: integrei sistemas, automatizei etapas e o tratamento de informações, incluindo aprovação, validação e emissão de documentos fiscais.",
    highlights: [
      "Integração entre sistemas e automação de etapas operacionais",
      "Fluxos de aprovação, validação e emissão de documentos fiscais",
      "Agentes de IA para análise de código, identificação de fluxos e investigação de problemas",
      "Aceleração de tarefas técnicas com ferramentas de IA",
    ],
    stack: ["Automação", "Integrações", "Documentos fiscais", "Agentes de IA"],
    decor: "kuromi",
    palette: {
      wall: "#4A3F5C",
      wallSide: "#3A3149",
      roof: "#26202F",
      roofBack: "#18131F",
      door: "#F48FB1",
      trim: "#B79CF2",
      accent: "#F06FA0",
      room: "#2B2436",
      ink: "#F7B6CF",
    },
    x: 350,
    y: -170,
    size: { w: 160, d: 120, h: 115, roof: 60 },
  },
  {
    id: "pochacco",
    resident: "Pochacco",
    label: "Casa do Pochacco",
    guide: "O Pochacco te espera! Ele é fã de um projeto sobre pets (adivinha qual?).",
    kind: "experience",
    title: "ConnectaPet & ConnectaInfo",
    company: "Show Tecnologia/Omnilink",
    tagline: "Coleiras inteligentes e análise de risco",
    summary:
      "Desenvolvi duas plataformas com Next.js, React e TypeScript seguindo Atomic Design. O ConnectaPet gerencia coleiras inteligentes integradas a um app mobile; o ConnectaInfo analisa o risco de motoristas.",
    highlights: [
      "ConnectaPet: gestão de coleiras inteligentes integrada a app mobile",
      "Rastreamento em tempo real e geofencing",
      "ConnectaInfo: análise de risco de motoristas cruzando dados públicos e privados",
      "Componentização com Atomic Design e ambiente com Docker",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Docker", "Atomic Design"],
    decor: "paw",
    palette: {
      wall: "#FFFFFF",
      wallSide: "#EEF1F5",
      roof: "#5AAEE8",
      roofBack: "#3F93CF",
      door: "#FFD54F",
      trim: "#3D3D3D",
      accent: "#2F86C8",
      room: "#F3F9FF",
      ink: "#1F5F8F",
    },
    x: 360,
    y: 190,
    size: { w: 160, d: 115, h: 105, roof: 57.5 },
  },
  {
    id: "correio",
    resident: "Correio da Vila",
    label: "Correio da Vila",
    guide: "Última etapa! Passe no Correio da Vila e veja como falar com a Evelyn.",
    kind: "contact",
    title: "Vamos conversar?",
    tagline: "A caixinha de correio está sempre aberta",
    summary:
      "Gostou da visita? Estou aberta a novas oportunidades, projetos e trocas. Escolha um dos caminhos abaixo e me mande uma mensagem.",
    highlights: [],
    stack: [],
    decor: "mail",
    palette: {
      wall: "#FFF4E3",
      wallSide: "#F6E3C6",
      roof: "#EF7C7C",
      roofBack: "#D86262",
      door: "#FFFFFF",
      trim: "#9ED9B5",
      accent: "#E25B5B",
      room: "#FFF8EE",
      ink: "#A63C3C",
    },
    x: 0,
    y: -40,
    size: { w: 130, d: 100, h: 90, roof: 50 },
  },
];

export const TOTAL_STAGES = HOUSES.length;
