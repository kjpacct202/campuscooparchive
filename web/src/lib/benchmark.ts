// Structured form of docs/CONTINUITY_BENCHMARK.md: the 22-component continuity
// scoring checklist (grouped) plus the federal/national source frameworks, with
// the verbatim URLs from that document. Used by the /benchmark page. Component
// keys match deep_analysis.json `benchmark_missing` and format.ts COMPONENT_LABEL.

export interface BenchmarkComponent {
  key: string;
  label: string;
  description: string;
}

export interface BenchmarkGroup {
  name: string;
  blurb: string;
  components: BenchmarkComponent[];
}

export const BENCHMARK_GROUPS: BenchmarkGroup[] = [
  {
    name: "A. Program foundation",
    blurb:
      "The promulgation, policy, and resourcing apparatus that gives a continuity program its authority.",
    components: [
      {
        key: "continuity_policy_promulgation",
        label: "Continuity policy & promulgation",
        description:
          "A signed promulgation / approval statement and a stated continuity policy that gives the plan authority, names the responsible executive/sponsor, and sets scope.",
      },
      {
        key: "concept_of_operations",
        label: "Concept of operations",
        description:
          "The operational narrative tying the plan together: how the institution moves through the four continuity phases (readiness → activation → continuity operations → reconstitution) and sustains essential functions during a disruption.",
      },
      {
        key: "standards_alignment",
        label: "Standards alignment",
        description:
          "Explicit alignment to recognized doctrine/standards (FCD 1/2, FEMA CGC, NIST 800-34, ISO 22301, NFPA 1600, NIMS, or a state continuity mandate) rather than an ad-hoc local format.",
      },
      {
        key: "budgeting_resources",
        label: "Budgeting & resources",
        description:
          "Identification of the budget, acquisition, and resource commitments needed to build and sustain the continuity capability (funding, contracts, MOUs, pre-positioned resources).",
      },
      {
        key: "plan_maintenance",
        label: "Plan maintenance",
        description:
          "A defined review/update cycle, version control, record of changes, and ownership for keeping the plan current (a multi-year maintenance schedule).",
      },
    ],
  },
  {
    name: "B. Analysis: the BIA spine",
    blurb:
      "The business-impact analysis spine: what must continue, how fast, and what it depends on.",
    components: [
      {
        key: "essential_functions",
        label: "Essential functions",
        description:
          "Identification of the institution's essential functions (mission-essential functions / critical services) that must be continued or rapidly resumed. The analytic core of any COOP.",
      },
      {
        key: "business_impact_analysis",
        label: "Business impact analysis",
        description:
          "A documented BIA (and/or business process analysis) that determines the impact of disruption over time, the resources each function depends on, and the prioritization of functions.",
      },
      {
        key: "recovery_time_objectives",
        label: "Recovery time objectives",
        description:
          "Stated RTOs (and ideally RPO / MTD / maximum tolerable downtime) or an explicit priority-tier recovery scheme (e.g., 0–24h / 1–7d / 7–30d) for essential functions.",
      },
      {
        key: "risk_threat_assessment",
        label: "Risk & threat assessment",
        description:
          "A documented assessment of the threats/hazards and vulnerabilities that could disrupt essential functions (the risk-management element), informing the strategy.",
      },
      {
        key: "interdependencies",
        label: "Interdependencies",
        description:
          "Explicit mapping of internal and external interdependencies (supporting units, vendors/suppliers, utilities, shared IT systems, mutual-aid partners) on which essential functions rely.",
      },
    ],
  },
  {
    name: "C. The continuity pillars: FCD 1 elements",
    blurb:
      "The FCD 1 continuity elements: who acts, from where, with what records and communications.",
    components: [
      {
        key: "orders_of_succession",
        label: "Orders of succession",
        description:
          "Pre-identified orders of succession for key leadership positions, at least three deep where practical, with the conditions/method of succession.",
      },
      {
        key: "delegations_of_authority",
        label: "Delegations of authority",
        description:
          "Pre-delegated authorities (decision-making, spending, HR) that let successors act when principals are unavailable, with triggers and limits.",
      },
      {
        key: "continuity_facilities",
        label: "Continuity facilities",
        description:
          "Identified alternate / continuity facilities (physical alternate site, telework/distributed operations, reciprocal space, or cloud-hosted operations) where essential functions can continue.",
      },
      {
        key: "continuity_communications",
        label: "Continuity communications",
        description:
          "Continuity communications capabilities that are resilient and interoperable, covering how leadership, responders, and the community stay connected when primary channels fail.",
      },
      {
        key: "vital_records_management",
        label: "Vital records management",
        description:
          "Identification, protection, and accessibility of vital records and databases (electronic and hardcopy) required to perform essential functions.",
      },
      {
        key: "continuity_personnel",
        label: "Continuity personnel / human capital",
        description:
          "Designation of continuity personnel (emergency relocation group / continuity team) and human-capital provisions (notification, accountability, family preparedness, telework readiness).",
      },
    ],
  },
  {
    name: "D. Operations",
    blurb: "Activation, devolution, and the return to normal.",
    components: [
      {
        key: "activation_triggers",
        label: "Activation triggers",
        description:
          "Defined activation triggers, decision authority, and procedures for invoking the plan (and an alert/notification sequence), including the readiness/threat posture that drives it.",
      },
      {
        key: "devolution",
        label: "Devolution",
        description:
          "Devolution of control and direction: transferring essential functions to a geographically separate unit/personnel if the primary staff or site is wholly incapacitated.",
      },
      {
        key: "reconstitution",
        label: "Reconstitution",
        description:
          "The process for resuming normal operations (or a new normal) once the emergency allows, including return, transition, and after-action review.",
      },
    ],
  },
  {
    name: "E. Higher-ed & technical extensions",
    blurb:
      "The IT-DR and academic-continuity components that make it a campus COOP, not a generic government one.",
    components: [
      {
        key: "it_disaster_recovery",
        label: "IT disaster recovery",
        description:
          "An IT disaster-recovery / system-contingency component: critical systems and data, backup strategy, alternate processing, RPO, and the DR/ISCP linkage to the broader plan.",
      },
      {
        key: "academic_instructional_continuity",
        label: "Academic / instructional continuity",
        description:
          "Provisions for continuing the academic mission: instruction (pivot-to-remote / alternate delivery), the academic calendar, research continuity (animals, samples, freezers, grants), and student services.",
      },
    ],
  },
  {
    name: "F. Sustainment",
    blurb: "The TT&E program that keeps the plan alive.",
    components: [
      {
        key: "tests_training_exercises",
        label: "Tests, training & exercises",
        description:
          "A TT&E program: training for continuity personnel plus drills/tabletop/functional/full-scale exercises that validate the plan, with corrective-action / improvement tracking.",
      },
    ],
  },
];

export interface FrameworkSource {
  name: string;
  publisher: string;
  date: string;
  url: string;
  summary: string;
}

export const FRAMEWORK_SOURCES: FrameworkSource[] = [
  {
    name: "FCD 1: Federal Continuity Directive 1",
    publisher: "FEMA / DHS",
    date: "January 17, 2017",
    url: "https://www.gpo.gov/docs/default-source/accessibility-privacy-coop-files/January2017FCD1-2.pdf",
    summary:
      "The keystone U.S. continuity directive. Defines the four phases of continuity and the program elements every COOP is built from: essential functions, orders of succession, delegations of authority, continuity facilities, communications, vital records, human capital, TT&E, devolution, and reconstitution.",
  },
  {
    name: "FCD 2: Federal Continuity Directive 2",
    publisher: "FEMA / DHS",
    date: "June 13, 2017",
    url: "https://www.fema.gov/sites/default/files/2020-07/Federal_Continuity_Directive-2_June132017.pdf",
    summary:
      "The analytic companion to FCD 1. Provides the Business Process Analysis (BPA) and Business Impact Analysis (BIA) methodology used to identify and prioritize essential functions, map their dependencies, and expose single points of failure.",
  },
  {
    name: "CGC: Continuity Guidance Circular",
    publisher: "FEMA National Continuity Programs",
    date: "February 2018 (2024 update issued)",
    url: "https://www.fema.gov/sites/default/files/2020-07/Continuity-Guidance-Circular_031218.pdf",
    summary:
      "Translates FCD 1/2 doctrine for the whole community, including higher education. The single most directly applicable federal document for a university COOP, and the basis of FEMA's Continuity Plan Template for Non-Federal Governments.",
  },
  {
    name: "NIST SP 800-34 Rev. 1: Contingency Planning Guide for Federal Information Systems",
    publisher: "NIST",
    date: "May 2010",
    url: "https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf",
    summary:
      "The standard for the IT disaster-recovery / system-contingency dimension of continuity: the contingency-planning process, the relationship between the BIA, ISCP, DRP, and BCP/COOP, plus RTO/RPO/MTD definitions and backup/alternate-site strategies.",
  },
  {
    name: "ISO 22301: Business continuity management systems · Requirements",
    publisher: "ISO",
    date: "2019 (Amd. 1, 2024)",
    url: "https://www.iso.org/standard/75106.html",
    summary:
      "The international BCMS standard. A Plan-Do-Check-Act management system spanning context, leadership & policy, planning, support, operation (incl. BIA and risk assessment), performance evaluation, and improvement.",
  },
  {
    name: "NFPA 1600: Standard on Continuity, Emergency, and Crisis Management",
    publisher: "NFPA",
    date: "2019 edition (7th ed.)",
    url: "https://www.nfpa.org/codes-and-standards/nfpa-1600-standard-development/1600",
    summary:
      "The overarching U.S. preparedness/resilience standard. Defines the interconnected program elements (program management, risk assessment, business impact analysis, prevention/mitigation, emergency management, business continuity, and crisis management), all aligned to PDCA.",
  },
  {
    name: "Higher-ed academic & instructional continuity (supporting)",
    publisher: "EDUCAUSE / provost & CTL practice literature",
    date: "Post-2020 norm",
    url: "https://www.educause.edu/",
    summary:
      "There is no single federal academic-continuity standard. The academic_instructional_continuity component draws on widely used higher-ed practice (EDUCAUSE resources, provost/CTL continuity-of-instruction guidance) and FEMA CGC's essential-functions logic applied to teaching, research, and the academic calendar.",
  },
];
