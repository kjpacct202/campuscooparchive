"use client";

import { useEffect } from "react";

const PALETTE = ["#0f766e", "#5eead4", "#6b3fb0", "#b5791b", "#1f8a4c"];

function confetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 28; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.left = Math.random() * 100 + "vw";
    el.style.background = PALETTE[i % PALETTE.length];
    el.style.animationDelay = Math.random() * 0.25 + "s";
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 2200);
  }
}

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

const GO: Record<string, string> = {
  h: "/", b: "/browse/", s: "/search/", c: "/chapters/",
  i: "/insights/", w: "/wisdom/", d: "/downloads/", m: "/methodology/",
};

/** Tasteful, hidden delights: Konami code → confetti + rainbow; "g" then a key
 * jumps to a section; confetti fires on the "coop-confetti" event (e.g. after an
 * export). All no-op under prefers-reduced-motion. */
export default function EasterEggs() {
  useEffect(() => {
    let seq: string[] = [];
    let gMode = false;
    let gTimer = 0;

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

      // Konami
      seq.push(e.key);
      seq = seq.slice(-KONAMI.length);
      if (KONAMI.every((k, i) => seq[i]?.toLowerCase() === k.toLowerCase())) {
        document.documentElement.classList.add("rainbow");
        confetti();
        window.setTimeout(() => document.documentElement.classList.remove("rainbow"), 6000);
        seq = [];
        return;
      }

      // "g" + key navigation
      if (gMode) {
        const dest = GO[e.key.toLowerCase()];
        gMode = false;
        window.clearTimeout(gTimer);
        if (dest) {
          e.preventDefault();
          window.location.assign(dest);
        }
        return;
      }
      if (e.key.toLowerCase() === "g") {
        gMode = true;
        gTimer = window.setTimeout(() => (gMode = false), 1200);
      }
    };

    const onConfetti = () => confetti();
    window.addEventListener("keydown", onKey);
    window.addEventListener("coop-confetti", onConfetti);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("coop-confetti", onConfetti);
    };
  }, []);
  return null;
}
