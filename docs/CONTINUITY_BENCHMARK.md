# The Continuity Benchmark

*The COOP analog of the Higher Ed EOP Atlas's 24-point federal benchmark.*

A "complete" higher-education continuity plan that follows federal and national
guidance — **Federal Continuity Directive 1 (FCD 1)**, **FCD 2**, the **FEMA
Continuity Guidance Circular (CGC)**, **NIST SP 800-34 Rev. 1**, **ISO 22301**,
and **NFPA 1600** — addresses the **22 components** below. Each deep-coded plan
is scored as the count of components clearly present:

> **`benchmark_present = 22 − (count of distinct valid keys in `benchmark_missing`)`**

The `benchmark_missing` array uses the exact key strings listed for each
component so the deep-analysis layer, the pipeline, and the website all align.

---

## Why a separate benchmark from the EOP Atlas

The Higher Ed EOP Atlas scores *emergency operations* plans against a 24-point
standard built on the REMS IHE Guide, FEMA CPG 101, NIMS/ICS, the NRF, and the
Clery Act. Those frameworks answer *"how does a campus respond to an incident?"*

Continuity planning answers a different question: *"when the incident degrades
or denies people, facilities, or systems, how does the institution keep its
**essential functions** running — and how does it teach, research, pay people,
and recover?"* The governing doctrine is different (the FEMA **continuity**
family + the BCM standards), so it gets its own, parallel benchmark. The two
benchmarks deliberately overlap on a few seams (activation, recovery,
exercises) because real campus plans do.

---

## The federal & national continuity doctrine this synthesizes

Each framework below was located on, and the title/date confirmed against, its
official host on **2026-06-17**.

### FCD 1 — Federal Continuity Directive 1
**FEMA / DHS · *Federal Executive Branch National Continuity Program and
Requirements* · January 17, 2017.**
The keystone U.S. continuity directive. Defines the **four phases of continuity**
(Readiness & Preparedness; Activation & Relocation; Continuity Operations;
Reconstitution) and the **continuity program elements** that became the de-facto
checklist every COOP is built from: essential functions, orders of succession,
delegations of authority, continuity facilities, continuity communications,
vital records management, human capital, tests/training/exercises (TT&E),
devolution, and reconstitution — wrapped in program plans/procedures, risk
management, and budgeting/acquisition.
Primary source: <https://www.gpo.gov/docs/default-source/accessibility-privacy-coop-files/January2017FCD1-2.pdf>

### FCD 2 — Federal Continuity Directive 2
**FEMA / DHS · *Mission Essential Functions Identification & the Business Process / Business Impact Analysis Process* · June 13, 2017 (orig. Feb 2008).**
The analytic companion to FCD 1. Provides the **Business Process Analysis (BPA)**
and **Business Impact Analysis (BIA)** methodology used to identify and prioritize
essential functions, map their dependencies (people, systems, facilities,
suppliers), and expose single points of failure.
Primary source: <https://www.fema.gov/sites/default/files/2020-07/Federal_Continuity_Directive-2_June132017.pdf>

### CGC — Continuity Guidance Circular
**FEMA National Continuity Programs · February 2018 (2024 update issued).**
Translates FCD 1/2 doctrine for the **whole community** — state, local, tribal,
territorial governments, the private sector, and non-governmental organizations
(the category higher education falls into). The single most directly applicable
federal document for a university COOP, and the basis of FEMA's *Continuity Plan
Template for Non-Federal Governments*.
Primary source: <https://www.fema.gov/sites/default/files/2020-07/Continuity-Guidance-Circular_031218.pdf>
2024 update: <https://www.fema.gov/sites/default/files/documents/fema_continuity-guidance-circular_082024.pdf>

### NIST SP 800-34 Rev. 1 — Contingency Planning Guide for Federal Information Systems
**NIST · May 2010 (with updates through 11/11/2010).**
The standard for the **IT disaster-recovery / system-contingency** dimension of
continuity: the contingency-planning process, the relationship between the BIA,
the Information System Contingency Plan (ISCP), the Disaster Recovery Plan (DRP),
and the BCP/COOP, plus RTO/RPO/MTD definitions and backup/alternate-site
strategies.
Primary source: <https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf>
Catalog page: <https://csrc.nist.gov/pubs/sp/800/34/r1/final>

### ISO 22301 — Security and resilience · Business continuity management systems · Requirements
**ISO · 2019 (Amd. 1 "climate action," 2024).**
The international **BCMS** standard. A Plan-Do-Check-Act management system:
context (Cl. 4), leadership & policy (Cl. 5), planning (Cl. 6), support (Cl. 7),
operation incl. BIA & risk assessment and business-continuity strategies &
procedures (Cl. 8), performance evaluation (Cl. 9), and improvement (Cl. 10).
Primary source: <https://www.iso.org/standard/75106.html>

### NFPA 1600 — Standard on Continuity, Emergency, and Crisis Management
**NFPA · 2019 edition (7th ed.; DHS-adopted voluntary consensus standard).**
The overarching U.S. preparedness/resilience standard. Defines the interconnected
program elements — program management, risk assessment, **business impact
analysis**, prevention/mitigation, emergency management, **business continuity**,
crisis management, and crisis communications — aligned to PDCA.
Primary source: <https://www.nfpa.org/codes-and-standards/nfpa-1600-standard-development/1600>

### Higher-ed academic & instructional continuity (supporting)
There is no single *federal* academic-continuity standard. The benchmark's
`academic_instructional_continuity` component draws on the widely used
higher-ed practice literature (EDUCAUSE academic-continuity resources;
provost/CTL "continuity of instruction" guidance; the post-2020 norm of an
explicit pivot-to-remote plan) and on FEMA CGC's "essential functions" logic
applied to *teaching, research, and the academic calendar* — the functions that
distinguish a university COOP from a generic government COOP.

---

## The 22 components

Legend for "Anchored in": **FCD1** · **FCD2** · **CGC** · **NIST** (800-34 r1) ·
**ISO** (22301) · **NFPA** (1600).

### A. Program foundation

**1. Continuity policy & promulgation** — key `continuity_policy_promulgation`
A signed promulgation / approval statement and a stated continuity **policy**
that gives the plan authority, names the responsible executive/sponsor, and sets
scope. *Anchored in: FCD1 (program plans & procedures); ISO Cl. 5; NFPA (program
management).*

**2. Concept of operations** — key `concept_of_operations`
The operational narrative tying the plan together: how the institution moves
through the four phases (readiness → activation → continuity operations →
reconstitution) and sustains essential functions during a disruption.
*Anchored in: FCD1 (four phases); CGC.*

**3. Standards alignment** — key `standards_alignment`
Explicit alignment to recognized doctrine/standards — FCD 1/2, FEMA CGC, NIST
800-34, ISO 22301, NFPA 1600, NIMS, or a state continuity mandate — rather than
an ad-hoc local format. *Anchored in: NFPA; ISO; CGC.*

**4. Budgeting & resources** — key `budgeting_resources`
Identification of the budget, acquisition, and resource commitments needed to
build and sustain the continuity capability (funding, contracts, MOUs,
pre-positioned resources). *Anchored in: FCD1 (budgeting & acquisition of
resources); CGC.*

**5. Plan maintenance** — key `plan_maintenance`
A defined review/update cycle, version control, record of changes, and ownership
for keeping the plan current (a multi-year strategy/maintenance schedule).
*Anchored in: FCD1; ISO Cl. 10; NFPA (PDCA).*

### B. Analysis (the BIA spine)

**6. Essential functions** — key `essential_functions`
Identification of the institution's **essential functions** (a.k.a. mission-
essential functions / critical services) that must be continued or rapidly
resumed. The analytic core of any COOP. *Anchored in: FCD1; FCD2; CGC.*

**7. Business impact analysis** — key `business_impact_analysis`
A documented **BIA** (and/or business process analysis) that determines the
impact of disruption over time, the resources each function depends on, and the
prioritization of functions. *Anchored in: FCD2; NIST; ISO Cl. 8.2; NFPA.*

**8. Recovery time objectives** — key `recovery_time_objectives`
Stated **RTOs** (and ideally RPO / MTD / maximum tolerable downtime) or an
explicit priority-tier recovery scheme (e.g., 0–24h / 1–7d / 7–30d) for essential
functions. *Anchored in: NIST; ISO Cl. 8.2.*

**9. Risk & threat assessment** — key `risk_threat_assessment`
A documented assessment of the threats/hazards and vulnerabilities that could
disrupt essential functions (the risk-management element), informing the
strategy. *Anchored in: FCD1 (risk management); FCD2; NFPA; ISO Cl. 6/8.*

**10. Interdependencies** — key `interdependencies`
Explicit mapping of internal and external **interdependencies** — supporting
units, vendors/suppliers, utilities, shared IT systems, mutual-aid partners —
on which essential functions rely. *Anchored in: FCD2 (BPA/BIA dependencies);
ISO; NFPA.*

### C. The continuity pillars (FCD 1 elements)

**11. Orders of succession** — key `orders_of_succession`
Pre-identified **orders of succession** for key leadership positions, at least
three deep where practical, with the conditions/method of succession.
*Anchored in: FCD1; CGC.*

**12. Delegations of authority** — key `delegations_of_authority`
Pre-delegated **authorities** (decision-making, spending, HR) that let
successors act when principals are unavailable, with triggers and limits.
*Anchored in: FCD1; CGC.*

**13. Continuity facilities** — key `continuity_facilities`
Identified **alternate / continuity facilities** (physical alternate site,
telework/distributed operations, reciprocal space, or cloud-hosted operations)
where essential functions can continue. *Anchored in: FCD1; CGC; NIST (alternate
sites).*

**14. Continuity communications** — key `continuity_communications`
**Continuity communications** capabilities that are resilient and
interoperable — how leadership, responders, and the community stay connected
when primary channels fail. *Anchored in: FCD1; CGC.*

**15. Vital records management** — key `vital_records_management`
Identification, protection, and accessibility of **vital records and databases**
(electronic and hardcopy) required to perform essential functions. *Anchored in:
FCD1; CGC; NIST (data backup).*

**16. Continuity personnel / human capital** — key `continuity_personnel`
Designation of **continuity personnel** (emergency relocation group / continuity
team), and human-capital provisions (notification, accountability, family
preparedness, telework readiness). *Anchored in: FCD1 (human capital); CGC.*

### D. Operations

**17. Activation triggers** — key `activation_triggers`
Defined **activation** triggers, decision authority, and procedures for invoking
the plan (and an alert/notification sequence), including the readiness/threat
posture that drives it. *Anchored in: FCD1 (activation phase); CGC.*

**18. Devolution** — key `devolution`
**Devolution** of control and direction: transferring essential functions to a
geographically separate unit/personnel if the primary staff or site is wholly
incapacitated. *Anchored in: FCD1; FCD2; CGC.*

**19. Reconstitution** — key `reconstitution`
**Reconstitution**: the process for resuming normal operations (or a new normal)
once the emergency allows, including return, transition, and after-action
review. *Anchored in: FCD1; CGC.*

### E. Higher-ed & technical extensions

**20. IT disaster recovery** — key `it_disaster_recovery`
An **IT disaster-recovery / system-contingency** component: critical systems and
data, backup strategy, alternate processing, RPO, and the DR/ISCP linkage to the
broader plan. *Anchored in: NIST; ISO; NFPA.*

**21. Academic / instructional continuity** — key `academic_instructional_continuity`
Provisions for continuing the institution's **academic mission** — instruction
(pivot-to-remote / alternate delivery), the academic calendar, research
continuity (animals, samples, freezers, grants), and student services.
The component that makes a plan a *campus* COOP. *Anchored in: higher-ed
academic-continuity practice; CGC essential-functions logic.*

### F. Sustainment

**22. Tests, training & exercises** — key `tests_training_exercises`
A **TT&E** program: training for continuity personnel plus drills/tabletop/
functional/full-scale exercises that validate the plan, with corrective-action /
improvement tracking. *Anchored in: FCD1 (TT&E); ISO Cl. 9; NFPA.*

---

## How the catalog scores (rubric)

A component is coded **present** only when the plan text shows it clearly enough
to support a **verbatim evidence quote**. When in doubt, it is recorded in
`benchmark_missing` — scores are conservative.

Document-scope artifacts are expected and disclosed: a *departmental COOP
template*, an *academic-continuity-only* plan, or an *IT-DR-only* plan will
legitimately miss whole sections of the benchmark. The `document_type` field
(see `schema/taxonomies.md`) lets analysts segment these out, exactly as the EOP
Atlas separates base-plan-only releases and quick-reference guides.

### The 22 keys, as an array (for tooling)

```json
[
  "continuity_policy_promulgation", "concept_of_operations", "standards_alignment",
  "budgeting_resources", "plan_maintenance", "essential_functions",
  "business_impact_analysis", "recovery_time_objectives", "risk_threat_assessment",
  "interdependencies", "orders_of_succession", "delegations_of_authority",
  "continuity_facilities", "continuity_communications", "vital_records_management",
  "continuity_personnel", "activation_triggers", "devolution", "reconstitution",
  "it_disaster_recovery", "academic_instructional_continuity", "tests_training_exercises"
]
```

*Frameworks current as of access date 2026-06-17. Source documents remain the
work of their issuing bodies and are linked, not redistributed.*
