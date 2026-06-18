// Mirror of slugify() in scripts/build_dataset.py (lines 126-128). Keeping this
// byte-identical guarantees route ids match plan_id / institution_id exactly.
export function slugify(text: string | null | undefined): string {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
