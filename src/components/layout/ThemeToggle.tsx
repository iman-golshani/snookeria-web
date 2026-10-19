"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Mode = "light" | "dark";
const storageKey = "snookeria-site-theme";

function applyTheme(value: Mode) {
  document.documentElement.dataset.theme = value;
  try { localStorage.setItem(storageKey, value); } catch {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", value === "dark" ? "#101f38" : "#ffffff");
}

export default function ThemeToggle({ admin = false }: { admin?: boolean }) {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(storageKey); } catch {}
    const current: Mode = saved === "dark" ? "dark" : "light";
    setMode(current);
    applyTheme(current);
  }, []);

  function toggle() {
    const next: Mode = mode === "light" ? "dark" : "light";
    setMode(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "light" ? "فعال کردن حالت شب" : "فعال کردن حالت روز"}
      title={mode === "light" ? "حالت شب" : "حالت روز"}
      className={admin
        ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
        : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--ink)]"}
    >
      {mode === "light" ? <Moon size={19} /> : <Sun size={19} />}
    </button>
  );
}
