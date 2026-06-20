"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/** A single statistic that fades/rises into view once. The real figure is in the
 * DOM from first paint (correct pre-hydration, JS-off, and for screen readers).
 * Reduced-motion users get no transform. */
export default function AnimatedStat({
  value,
  label,
  align = "center",
}: {
  value: string | number;
  label: string;
  align?: "center" | "left";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  const display = typeof value === "number" ? value.toLocaleString() : value;
  return (
    <motion.div
      ref={ref}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      animate={reduce ? { opacity: 1, y: 0 } : isInView ? { opacity: 1, y: 0 } : {}}
      transition={reduce ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
      className={align === "left" ? "text-left" : "text-center"}
    >
      <div className="stat-value tabular-nums">{display}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}
