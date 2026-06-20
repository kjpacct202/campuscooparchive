"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Inert placeholder before hydration to avoid a server/client mismatch.
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="touch-target inline-flex items-center justify-center rounded-md p-2 transition-colors"
        style={{ color: "var(--text-secondary)" }}
        suppressHydrationWarning
      >
        <Sun className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="touch-target inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-cream-dark focus-visible:outline-none"
      style={{ color: "var(--text-secondary)" }}
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
