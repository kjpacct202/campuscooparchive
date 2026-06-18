import type { ReactNode } from "react";

type Variant = "state" | "ok" | "link" | "score" | "doctype";

export function Badge({
  children,
  variant,
  title,
}: {
  children: ReactNode;
  variant?: Variant;
  title?: string;
}) {
  return (
    <span className={"badge" + (variant ? ` badge--${variant}` : "")} title={title}>
      {children}
    </span>
  );
}
