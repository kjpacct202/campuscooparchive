# Deep analysis — campus continuity plans against the 22-component benchmark

*What full-text reading reveals. Generated 2026-06-17 from
`data/deep_analysis.json` (n = 40 plans read end-to-end, all `high` read
confidence) scored against `docs/CONTINUITY_BENCHMARK.md`. 101 notable design
decisions captured, each with a verbatim quote in the dataset.*

## Overview

Forty plans — spanning full institutional COOPs, business-continuity frameworks,
IT-DR plans, academic-continuity plans, and institution-published templates —
were read in full and scored. **Mean score: 13.1 / 22. Range: 1–22.**

| benchmark band | plans |
|---|--:|
| 20–22 | 6 |
| 15–19 | 9 |
| 10–14 | 17 |
| 5–9 | 5 |
| 0–4 | 3 |

The distribution is wide because the corpus deliberately mixes document scopes:
a one-page IT-DR quick-start and a 100-page institutional COOP are both here, and
the `document_type` segmentation below keeps the comparison honest.

## Score by document type

| document_type | n | mean /22 |
|---|--:|--:|
| full-coop | 12 | **15.5** |
| it-dr | 5 | 13.4 |
| business-continuity-framework | 9 | 13.1 |
| template | 9 | 12.6 |
| department-level | 1 | 11.0 |
| academic-continuity | 4 | 7.0 |

Full institutional COOPs score highest, as expected. Academic-continuity plans
score lowest **by design** — they are deep on instruction and student-facing
continuity and intentionally silent on succession, devolution, vital records,
and alternate facilities, which live in the institution's broader COOP.

## Score by organizing structure

| organizing structure | n | mean /22 |
|---|--:|--:|
| essential-functions-based | 20 | **14.2** |
| phase-based | 9 | 13.1 |
| departmental | 6 | 12.2 |
| FCD-element-based | 3 | 9.7 |
| unclear | 2 | 9.0 |

Plans built around **essential functions** — the FCD 2 / FEMA CGC analytic
spine — are the most complete. (The small `FCD-element-based` group scores lower
here because those three happened to be thin policy/overview documents, not
because the FCD element structure is weak; n is small.)

## The most-missing components (of 40 deep-coded)

| missing in… | component |
|--:|---|
| **38 (95%)** | **devolution** |
| 32 (80%) | budgeting & resources |
| 30 (75%) | delegations of authority |
| 25 (63%) | orders of succession |
| 22 (55%) | business impact analysis |
| 21 (53%) | standards alignment (named doctrine) |
| 18 (45%) | reconstitution |
| 18 (45%) | vital records management |
| 16 (40%) | recovery time objectives |
| 15 (38%) | risk/threat assessment |

And the most-**present** (near-universal): **essential functions** (missing in
only 5), **continuity personnel** (4), **plan maintenance** (7), and
**continuity communications** (9).

### The single clearest finding: devolution is the field's blind spot

**95% of deep-coded plans contain no devolution provision** — no pre-arranged
transfer of essential functions to a geographically separate unit or staff if
the primary team or site is wholly lost. This is the FCD element campuses most
consistently skip. The standout exception is instructive and transferable:

> **University of Houston–Downtown** uses its sister system campuses as both the
> relocation site *and* the devolution destination —
> *"If UHD is unable to deploy an ERG to an ERS due to loss of personnel, UHD
> will devolve to one of the University of Houston System campuses."* A
> multi-campus system is a ready-made devolution partner, and almost no one uses
> it that way.

The succession/delegation gap is the same story one rung up: campuses identify
*what* must continue (essential functions are nearly universal) but far fewer
pre-wire *who is authorized to act, and from where,* when leadership or a
building is unavailable.

## Exemplars — the 20+/22 plans

- **CSU Bakersfield (22/22)** — an integrated program mapped explicitly to the
  consolidated COOP/COG element set: *"A viable Business Continuity Plan
  identifies essential functions and consists of plans and procedures, alternate
  facilities, interoperable communications, data support systems…"*
- **University of Houston–Downtown (22/22)** — full FCD element coverage plus the
  rare, well-executed system-campus devolution model above.
- **San José State University (21/22)** — a BCP master plan that sequences
  continuity *after* stabilization: *"Business Continuity: This phase involves
  restarting mission-critical (essential) business operations after a major
  disruption occurs."*
- **Cornell University (20/22)** — operationalizes continuity through a
  university-wide web tool: *"the University provides a robust, web-based
  software tool called C-COOP."*
- **CSU Fullerton (20/22)** and **Florida State University (20/22, template)**
  round out the top tier.

## How continuity is housed

Across the deep set, **coop_treatment** splits almost evenly:
**integrated** (17) — continuity lives inside a broader plan/policy;
**separate** (12) — a standalone continuity document; **program** (11) — a
central office runs a program and unit plans carry the operational detail. There
is no single dominant model; campus continuity is genuinely pluralistic.

**Alternate-facility models:** `multiple` (15) and `telework-distributed` (11)
dominate — post-2020, "the alternate site is wherever staff have a laptop" has
become the default, with formal physical alternate sites (4) and reciprocal /
mutual-aid arrangements (1) far rarer.

## A gallery of transferable design decisions

Each is backed by a verbatim quote in `data/deep_analysis.json` (and browsable in
`site/index.html`):

- **Cornell's C-COOP web tool** — a central, living repository of unit essential
  services, priorities, personnel, and vital-records mapping, rather than static
  binders.
- **University of Vermont** names three parallel continuity domains —
  *academic, administrative, research* — as first-class concepts, including
  *"the capability to maintain critical research equipment, supplies, computers,
  unique data and specimens/samples."*
- **Florida State University** treats continuity of research — *"including the
  care and management of animals used for education and research"* — as an
  essential function, and invokes a Florida public-records exemption to control
  plan distribution.
- **Itawamba Community College** frames recovery-time tiers in blunt
  survival terms: if essential functions can't resume in ~three weeks, *"the
  College may be facing the cancellation of a semester and a refunding of
  tuitions."*
- **Orange Coast College** adopts a deliberate rebuild-from-template IT model:
  *"Workstations are not backed up as: all business data is stored on servers and
  workstations…can be recreated from build templates."*
- **University of Michigan (HRPP)** sets explicit clinical-risk criteria for
  which active research studies continue through a disruption (e.g., implanted
  devices).
- **Cal Maritime** anchors its essential-function definitions in Federal
  Preparedness Circular 65 — one of the very few plans to cite continuity
  doctrine by name.

## Takeaways for an emergency/continuity manager

1. **If you do one thing, write a devolution clause.** It is the field's biggest
   gap; multi-campus systems should name a sister campus as the devolution site.
2. **Pre-wire succession and delegations of authority**, not just essential
   functions. Knowing *what* matters is the easy 87%; authorizing *who acts* is
   the neglected 20%.
3. **Build around essential functions** (the highest-scoring structure), and
   make the BIA real — over half of plans lack a documented one.
4. **Treat academic and research continuity as first-class**, as UVM and FSU do;
   it is what distinguishes a campus COOP from a generic government COOP.
5. **A living tool beats a binder** — Cornell's C-COOP and SJSU's phased model
   show continuity working as an ongoing program, which matches the corpus-wide
   finding that most campuses publish a *program*, not a *document*.
