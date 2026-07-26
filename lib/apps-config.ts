export interface AppConfig {
  id: string;
  title: string;
  icon: string;
  accent: string; 
  defaultSize: { width: number; height: number };
}

export const APPS: AppConfig[] = [
  {
    id: "about",
    title: "Sobre mim",
    icon: "/icons/icon01.png",
    accent: "bg-os-pink",
    defaultSize: { width: 560, height: 480 },
  },
  {
    id: "projects",
    title: "Projetos",
    icon: "/icons/icon02.png",
    accent: "bg-os-lilac",
    defaultSize: { width: 560, height: 480 },
  },
  {
    id: "gallery",
    title: "Galeria",
    icon: "/icons/icon03.png",
    accent: "bg-os-slate",
    defaultSize: { width: 560, height: 480 },
  },
  {
    id: "spotify",
    title: "Spotify",
    icon: "/icons/icon04.png",
    accent: "bg-os-pink",
    defaultSize: { width: 560, height: 480 },
  },
  {
    id: "contact",
    title: "Contato",
    icon: "/icons/icon05.png",
    accent: "bg-os-lilac",
    defaultSize: { width: 460, height: 440 },
  },
  {
    id: "skills",
    title: "Habilidades",
    icon: "/icons/icon06.png",
    accent: "bg-os-slate",
    defaultSize: { width: 560, height: 480 },
  },
  
  {
    id: "game",
    title: "Jogo",
    icon: "/icons/icon07.png",
    accent: "bg-os-lilac",
    defaultSize: { width: 420, height: 500 },
  },
  {
    id: "notes",
    title: "Notas",
    icon: "/icons/icon08.png",
    accent: "bg-os-pink",
    defaultSize: { width: 640, height: 500 },
  },
  {
    id: "calendar",
    title: "Calendário",
    icon: "/icons/icon09.png",
    accent: "bg-os-slate",
    defaultSize: { width: 520, height: 540 },
  },
];
