"use client";

import { useState } from "react";
import LockScreen from "@/components/LockScreen";
import Desktop from "@/components/Desktop";

export default function Home() {
  const [isLocked, setIsLocked] = useState(true);

  return (
    <main className="h-screen w-screen overflow-hidden bg-os-mist font-body">
      {isLocked ? (
        <LockScreen onUnlock={() => setIsLocked(false)} />
      ) : (
        <Desktop />
      )}
    </main>
  );
}
