// Synthesized cross-corpus wisdom (web/src/content/wisdom.json), produced by a
// multi-lens mining → synthesis → quote-verification workflow over all deep-coded
// plans. Every evidence quote is verbatim from its source plan; `link` is true when
// the cited plan_id resolves to a detail page.

import data from "../content/wisdom.json";

export interface WisdomEvidence {
  institution: string;
  plan_id: string;
  quote: string;
  link?: boolean;
}
export interface WisdomTheme {
  title: string;
  category: string;
  insight: string;
  takeaway: string;
  evidence: WisdomEvidence[];
}
export interface Wisdom {
  headline: string;
  themes: WisdomTheme[];
}

export const wisdom = data as Wisdom;
