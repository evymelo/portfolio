"use client";

import { useState } from "react";
import LoadingScreen from "@/components/village/LoadingScreen";
import Village from "@/components/village/Village";
import { useTheme } from "@/lib/useTheme";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [theme, setTheme] = useTheme();

  return (
    <main className="relative h-dvh w-screen overflow-hidden font-body">
      {entered ? <Village night={theme === "night"} onThemeChange={setTheme} /> : <LoadingScreen onEnter={() => setEntered(true)} />}
    </main>
  );
}
