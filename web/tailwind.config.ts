import type { Config } from "tailwindcss";

/**
 * Campus COOP Archive — Tailwind config, shared design language with the
 * Campus Alert Archive (CSS-variable-backed tokens) re-accented for continuity.
 * Preflight is disabled: globals.css keeps its own resets + element styles, and
 * the shadcn/ui primitives specify their own colors/borders.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "var(--background)",
          dark: "var(--background-alt)",
          darker: "var(--border)",
        },
        surface: "var(--surface)",
        border: { DEFAULT: "var(--border)", strong: "var(--border-strong)" },
        text: {
          primary: "var(--text-primary)",
          body: "var(--text-body)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          light: "var(--accent-light)",
          ink: "var(--accent-ink)",
        },
        // Continuity chart/badge hues (theme-aware via CSS vars).
        ok: "var(--green)",
        warn: "var(--amber)",
        info: "var(--violet)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "Consolas", '"Courier New"', "monospace"],
      },
      fontSize: {
        hero: ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        page: ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1" }],
        section: ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.2" }],
        stat: ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
