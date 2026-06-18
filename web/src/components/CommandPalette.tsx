"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { SlimPlan } from "@/lib/types";

const PAGES = [
  { href: "/browse/", label: "Browse all plans" },
  { href: "/institutions/", label: "Institutions index" },
  { href: "/statistics/", label: "Statistics" },
  { href: "/benchmark/", label: "The continuity benchmark" },
  { href: "/methodology/", label: "Methodology" },
  { href: "/about/", label: "About / how this was built" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [plans, setPlans] = useState<SlimPlan[] | null>(null);

  const load = useCallback(() => {
    if (plans) return;
    fetch("/data/plans.slim.json")
      .then((r) => r.json())
      .then((d: SlimPlan[]) => setPlans(d))
      .catch(() => setPlans([]));
  }, [plans]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        load();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => {
      setOpen(true);
      load();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-cmdk", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-cmdk", onOpen);
    };
  }, [load]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)}>
      <div className="cmdk-box" onClick={(e) => e.stopPropagation()}>
        <Command label="Search the COOP Archive" loop>
          <Command.Input autoFocus placeholder="Search institutions and pages…" />
          <Command.List>
            <Command.Empty>
              {plans === null ? "Loading…" : "No matches."}
            </Command.Empty>

            <Command.Group heading="Go to">
              {PAGES.map((p) => (
                <Command.Item
                  key={p.href}
                  value={"page " + p.label}
                  onSelect={() => go(p.href)}
                >
                  <span>{p.label}</span>
                  <span className="meta">page</span>
                </Command.Item>
              ))}
            </Command.Group>

            {plans && plans.length > 0 && (
              <Command.Group heading="Institutions">
                {plans.map((p) => (
                  <Command.Item
                    key={p.plan_id}
                    value={`${p.institution_name} ${p.state} ${p.plan_type ?? ""}`}
                    onSelect={() => go(`/plans/${p.plan_id}/`)}
                  >
                    <span>{p.institution_name}</span>
                    <span className="meta">
                      {p.state}
                      {p.benchmark_present != null
                        ? ` · ${p.benchmark_present}/22`
                        : ""}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
