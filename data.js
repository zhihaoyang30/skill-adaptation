/* ============================================================
 * data.js — all figure data, 1:1 from the paper's plotting code
 *   reports/figures/fig1_data.json      (Fig 1a teaser)
 *   reports/figures/fig1/part_b/...     (Fig 2 five-round curves)
 *   fig2_long.pdf values                (Fig 3 dumbbell + donut)
 *   reports/cache/task_categories.json  (donut task lists)
 * ============================================================ */

const PALETTE = {
  ink: "#333333",
  inkDark: "#151A21",
  grid: "#e2e2e2",
  purple: "#7668d4",     // w/ skill
  muted: "#7f7b73",      // w/o skill
  paper: "#fdfcfa",
  tiers: {
    weak:   { ink: "#B4503A", wash: "#E0A594", bg: "#f8ece8" },
    mid:    { ink: "#C08428", wash: "#EFC97C", bg: "#faf1de" },
    strong: { ink: "#1F6A8C", wash: "#9CC4D8", bg: "#e8f1f6" },
  },
  donut: ["#7668d4", "#5b8fc9", "#55803a", "#2f9e8f", "#b04a5e", "#d9a03f", "#9a9a9a"],
  models: {
    "Qwen3.6-flash": "#7668d4",
    "Qwen3.5-9B":    "#5b86b0",
    "Gemma-4-E4B":   "#7f7b73",
  },
  metaGreen: "#2e7d57",
};

/* ---------------- Fig 1a: skill benefit vs base capability ---------------- */
const FIG1A = [
  { label: "Gemma-4-E4B",   tier: "weak",   x: 22.0, y: -9.0,  icon: "gemma-color.svg",  iconColor: "#446EFF", measured: { base: 11.7, benefit: -8.8 } },
  { label: "Qwen3.5-9B",    tier: "weak",   x: 34.0, y: 0.8,   icon: "qwen-color.svg",   iconColor: "#B3A6E3", measured: { base: 30.3, benefit: 2.0 } },
  { label: "Qwen3.6-flash", tier: "weak",   x: 42.4, y: 3.5,   icon: "qwen-color.svg",   iconColor: "#8465C9", measured: { base: 42.4, benefit: 10.5 } },
  { label: "GPT-5.4-mini",  tier: "mid",    x: 39.5, y: 23.8,  icon: "openai.svg",       iconColor: "#000000", measured: { base: 39.5, benefit: 23.8 } },
  { label: "Sonnet-4.6",    tier: "mid",    x: 50.3, y: 24.3,  icon: "claude-color.svg", iconColor: null,      measured: { base: 50.3, benefit: 24.3 } },
  { label: "GPT-5.6-luna",  tier: "strong", x: 57.8, y: 26.5,  icon: "openai.svg",       iconColor: "#000000", measured: { base: 57.8, benefit: 31.1 } },
  { label: "Opus-5",        tier: "strong", x: 60.3, y: 27.3,  icon: "claude-color.svg", iconColor: null,      measured: { base: 60.3, benefit: 27.3 } },
];

const TIER_INFO = {
  weak: {
    name: "WEAK",
    headline: "Skills barely help — or actively hurt",
    body: "The same skill that lifts frontier models ~30 points gives Gemma-4-E4B −8.8 — and in 86% of failed runs the violated requirement is already written in the skill.",
    models: ["Gemma-4-E4B", "Qwen3.5-9B", "Qwen3.6-flash"],
  },
  mid: {
    name: "MEDIUM",
    headline: "Solid gains, but far from the ceiling",
    body: "Roughly +24 points from the same skills — most guidance lands, but context-management and verification requirements still trip them.",
    models: ["GPT-5.4-mini", "Sonnet-4.6"],
  },
  strong: {
    name: "STRONG",
    headline: "Skills are written for these models",
    body: "+31.1 (luna) and +27.3 (Opus-5): model-agnostic skill libraries implicitly assume this capability level.",
    models: ["GPT-5.6-luna", "Opus-5"],
  },
};

/* ---------------- Fig 1b: one skill, two executors ---------------- */
const FIG1B = {
  skill: {
    file: "SKILL.md",
    lines: [
      "- Use the pcap_utils.py helpers directly.",
      "- Fill only the value column; keep metric names.",
    ],
  },
  strong: {
    model: "Opus-5",
    icon: "claude-color.svg",
    tier: "strong",
    steps: [
      { cmd: "$ import pcap_utils",        note: "ran",   ok: true },
      { cmd: "$ p = split_proto(pk)",      note: "dict",  ok: true },
      { cmd: "$ csv ← len(p['tcp'])", note: "32620", ok: true },
    ],
    table: [["protocol_tcp", "32620"], ["protocol_udp", "4416"], ["...", "..."]],
    verdict: "PASS 37 / 37 tests",
  },
  weak: {
    model: "Gemma-4-E4B",
    icon: "gemma-color.svg",
    tier: "weak",
    steps: [
      { cmd: "$ import pcap_utils",       note: "skipped",    ok: false },
      { cmd: "$ p = split_proto(pk)",     note: "none",       ok: false },
      { cmd: "$ csv ← hand-typed",   note: "2038",       ok: false },
    ],
    table: [["2038", ""], ["200", ""], ["...", ""]],
    tableCorrupted: true,
    verdict: "FAIL 0 / 37 tests",
  },
};

/* ---------------- Fig 2: five-round self-evolution (qualitative, from paper code) ---------------- */
const FIG2 = {
  tierLines: { strong: 0.86, mid: 0.62, weak: 0.24 },
  // with skill adaptation (meta-skill)
  meta: {
    "Qwen3.6-flash": [0.25, 0.30, 0.355, 0.415, 0.47, 0.52],
    "Qwen3.5-9B":    [0.07, 0.10, 0.145, 0.20, 0.26, 0.325],
    "Gemma-4-E4B":   [0.015, 0.03, 0.05, 0.085, 0.14, 0.205],
  },
  // without skill adaptation
  nometa: {
    "Qwen3.6-flash": [0.25, 0.292, 0.322, 0.343, 0.355, 0.36],
    "Qwen3.5-9B":    [0.07, 0.083, 0.093, 0.10, 0.104, 0.105],
    "Gemma-4-E4B":   [0.015, 0.0173, 0.0188, 0.0196, 0.02, 0.02],
  },
  lineColors: {
    "Qwen3.6-flash": "#8465C9",
    "Qwen3.5-9B":    "#B3A6E3",
    "Gemma-4-E4B":   "#6E86C0",
  },
  icons: {
    "Qwen3.6-flash": { svg: "qwen-color.svg", ring: "#B4503A" },
    "Qwen3.5-9B":    { svg: "qwen-color.svg", ring: "#B4503A" },
    "Gemma-4-E4B":   { svg: "gemma-color.svg", ring: "#B4503A" },
  },
};

/* Round-by-round narrative: Qwen3.6-flash on the earthquake-distance task
 * (the fig:case study in §4.3 — real skill edits from the trajectories).
 * Chronology matches the paper: the meta-skill rewrite in round 1 introduces
 * guidance for all four failure modes at once; rounds 2–5 refine it from the
 * trajectories. Rewards per round (r0→r5): ✗ ✓ ✓ ✗ ✓ ✓ with the meta-skill,
 * ✗ ✗ ✗ ✗ ✗ ✗ without it. */
const ROUNDS = [
  {
    round: 0, label: "Round 0",
    mode: "The original skill",
    nometa: { text: "Six sections of reference notes — no deliverable, no projection rule, no check.", ok: false },
    meta:   { text: "Same starting point: both arms begin from the identical raw skill.", ok: false },
  },
  {
    round: 1, label: "Round 1",
    mode: "The first rewrite",
    nometa: { text: "Rewrite stays reference notes; the same wrong distance survives.", ok: false },
    meta:   { text: "Meta-skill adds four blocks: scope & delivery, EPSG:4087 only, ISO 8601 checked, verification loop.", ok: true },
  },
  {
    round: 2, label: "Round 2",
    mode: "Tool execution",
    nometa: { text: "Cosmetic edits only — the invented projection keeps failing.", ok: false },
    meta:   { text: "Pinned tool rule holds; helper-call examples tightened from the trajectory.", ok: true },
  },
  {
    round: 3, label: "Round 3",
    mode: "The executor's own limit",
    nometa: { text: "Still the same wrong distance, round after round.", ok: false },
    meta:   { text: "Executor edits a script but never reruns it — a stale value is written. The one miss.", ok: false },
  },
  {
    round: 4, label: "Round 4",
    mode: "Verification from evidence",
    nometa: { text: "No trajectory signal is used; nothing changes.", ok: false },
    meta:   { text: "Read-back made unconditional: after any edit, rerun, re-read, compare. Recovered.", ok: true },
  },
  {
    round: 5, label: "Round 5",
    mode: "The loop converges",
    nometa: { text: "Five rounds, five failures: ✗ ✗ ✗ ✗ ✗", ok: false },
    meta:   { text: "4 of 5 rounds pass (✗ ✓ ✓ ✗ ✓ ✓). Suite-wide: +2.0 ~ +5.1 points over the no-meta loop.", ok: true },
  },
];

/* Reward marks per round for the case (from fig:case caption): r0..r5 */
const CASE_MARKS = {
  meta:   [false, true, true, false, true, true],
  nometa: [false, false, false, false, false, false],
};

/* ---------------- Fig 3: benchmark dumbbells + donut ---------------- */
const FIG3_DUMBBELL = {
  all: {
    n: 607,
    rows: [
      { label: "Claude-Opus-5",   tier: "strong", wo: 0.669, w: 0.706 },
      { label: "GPT-5.6-luna",    tier: "strong", wo: 0.603, w: 0.657 },
      { label: "Claude-Sonnet-4.6", tier: "mid",  wo: 0.554, w: 0.636 },
      { label: "GPT-5.4-mini",    tier: "mid",    wo: 0.535, w: 0.563 },
      { label: "Qwen3.6-flash",   tier: "weak",   wo: 0.444, w: 0.491 },
      { label: "Qwen3.5-9B",      tier: "weak",   wo: 0.316, w: 0.364 },
      { label: "Gemma-4-E4B",     tier: "weak",   wo: 0.091, w: 0.100 },
    ],
  },
  sensitive: {
    n: 103,
    rows: [
      { label: "Claude-Opus-5",   tier: "strong", wo: 0.603, w: 0.876 },
      { label: "GPT-5.6-luna",    tier: "strong", wo: 0.578, w: 0.889 },
      { label: "Claude-Sonnet-4.6", tier: "mid",  wo: 0.503, w: 0.746 },
      { label: "GPT-5.4-mini",    tier: "mid",    wo: 0.395, w: 0.633 },
      { label: "Qwen3.6-flash",   tier: "weak",   wo: 0.424, w: 0.529 },
      { label: "Qwen3.5-9B",      tier: "weak",   wo: 0.303, w: 0.323 },
      { label: "Gemma-4-E4B",     tier: "weak",   wo: 0.117, w: 0.029 },
    ],
  },
};

const FIG3_DONUT = [
  {
    name: "Document processing", count: 38, color: "#7668d4",
    desc: "Editing, repairing and releasing real documents — Excel budget rollups, PDF contract-conflict reasoning, PPTX theme transfer, bilingual Word report publication.",
    sources: "SkillsBench (6) + DocOps (32)",
    examples: [
      { n: "court-form-filling", d: "fill a legal court form from case facts, preserving the official layout" },
      { n: "edit-pdf", d: "apply a set of requested edits to an existing PDF without breaking other content" },
      { n: "pdf_002_contract_conflict_reasoning", d: "find and resolve conflicting clauses across a contract PDF" },
      { n: "pptc_009_reorder_and_theme_governance_deck", d: "reorder slides and re-theme a governance deck consistently" },
      { n: "wordwf_003_bilingual_report_publication", d: "publish a bilingual Word report through a full editing workflow" },
    ],
    tasks: ["court-form-filling", "edit-pdf", "offer-letter-generator", "pptx-reference-formatting", "protein-expression-analysis", "weighted-gdp-calc", "excel_001_budget_bucket_totals", "excel_008_client_update_editing", "excel_011_theme_transfer", "pdf_002_contract_conflict_reasoning", "pdf_005_paragraph_editing", "ppt_001_generate_risk_points", "ppt_003_theme_transfer", "ppt_009_metric_conflict_reasoning", "word_003_client_letter_editing", "word_012_table_structure", "excelc_006_formalize_update_and_match_body_style", "excelc_010_compute_risk_flag_and_highlight_rows", "pdfc_002_reorder_pages_and_rebuild_bookmarks", "pdfc_003_fill_summary_box_and_apply_theme", "pdfc_009_reason_and_rewrite_conflict_note", "pdfc_010_theme_and_align_callout_boxes", "pptc_001_retheme_restyle_and_realign", "pptc_007_insert_summary_slide_and_generate_bullets", "pptc_009_reorder_and_theme_governance_deck", "wordc_001_repair_hierarchy_and_standardize_styles", "pdfxr_003_due_diligence_latest_uploads_packet", "pdfxr_004_security_response_packet_fill_cover", "pptxr_004_handover_owner_matrix_from_closeout_logs", "pptxr_005_public_health_briefing_template_fill", "wordxr_004_mou_template_scope_term_and_contacts", "l3_007_docx_museum_installation_binder_release", "l3_009_docx_incident_manual_publication", "l3_027_pptx_food_recall_public_briefing_repair", "l3_031_pdf_public_hearing_packet_flatten_release", "l3_037_pdf_bus_detour_notice_layout_repair", "l3_040_pdf_grant_reimbursement_closeout_packet_repair", "wordwf_003_bilingual_report_publication"],
  },
  {
    name: "Software engineering", count: 21, color: "#5b8fc9",
    desc: "Debugging training loops, parsing dialogue formats, wiring SDKs and frameworks correctly — Apollo federation, Clerk backend API, Shopify Liquid themes, Next.js cache components.",
    sources: "SkillsBench (5) + Tessl (16)",
    examples: [
      { n: "debug-trl-grpo", d: "find and fix the bug in a TRL GRPO training loop so training converges" },
      { n: "dialogue-parser", d: "parse a nonstandard dialogue transcript format into structured turns" },
      { n: "apollo-federation", d: "compose a federated GraphQL supergraph following Apollo's federation rules" },
      { n: "shopify-liquid-themes", d: "build a Shopify Liquid theme component that meets the theme standards" },
      { n: "next-cache-components", d: "use Next.js cache components correctly for a given data-freshness requirement" },
    ],
    tasks: ["data-to-d3", "debug-trl-grpo", "dialogue-parser", "llm-prefix-cache-replay", "threejs-structure-parser", "apollo-federation", "clerk-backend-api", "chdb-sql", "elevenlabs voice-changer", "langfuse", "mastra react-best-practices", "apm-triage-panel (3 task–skill pairs)", "neon-auth", "resend-cli", "liquid-theme-standards", "shopify-liquid-themes", "vercel portless oauth", "routing-middleware", "next-cache-components"],
  },
  {
    name: "Scientific computing", count: 10, color: "#55803a",
    desc: "Optimization and control with hard numeric targets — drone planning, energy unit commitment, lake thermal modeling, HVAC control, flexible job-shop scheduling, PDDL planning.",
    sources: "SkillsBench (10)",
    examples: [
      { n: "drone-planning-control", d: "plan and control a drone trajectory that satisfies dynamics and waypoint constraints" },
      { n: "energy-unit-commitment", d: "solve a power-grid unit-commitment optimization to a cost target" },
      { n: "glm-lake-mendota", d: "calibrate a lake thermal model (GLM) against observed Lake Mendota data" },
      { n: "manufacturing-fjsp-optimization", d: "schedule a flexible job shop to minimize makespan" },
      { n: "pddl-tpp-planning", d: "write a PDDL plan for a travelling-purchase problem that validates" },
    ],
    tasks: ["bike-rebalance", "drone-planning-control", "energy-unit-commitment", "glm-lake-mendota", "grid-dispatch-operator", "hvac-control", "manufacturing-fjsp-optimization", "paratransit-routing", "pddl-tpp-planning", "r2r-mpc-control"],
  },
  {
    name: "Data analysis", count: 10, color: "#2f9e8f",
    desc: "Extracting the right number from messy data — intrusion detection over pcaps, earthquake plate kinematics, financial modeling QA, lab-unit harmonization, demand shock analysis.",
    sources: "SkillsBench (9) + Tessl (1)",
    examples: [
      { n: "dapt-intrusion-detection", d: "detect intrusion events in packet captures and report per-protocol statistics" },
      { n: "earthquake-plate-calculation", d: "compute plate-motion distances from earthquake catalog coordinates (the Fig. 2 case task)" },
      { n: "financial-modeling-qa", d: "answer valuation questions from a financial model workbook" },
      { n: "lab-unit-harmonization", d: "harmonize lab measurements reported in mixed units into one consistent table" },
      { n: "shock-analysis-demand", d: "quantify a demand shock's effect from before/after sales data" },
    ],
    tasks: ["dapt-intrusion-detection", "earthquake-plate-calculation", "financial-modeling-qa", "lab-unit-harmonization", "lake-warming-attribution", "manufacturing-equipment-maintenance", "mario-coin-counting", "shock-analysis-demand", "tictoc-unnecessary-abort-detection", "eval-result-interpreter"],
  },
  {
    name: "API integration", count: 8, color: "#b04a5e",
    desc: "Driving third-party APIs end-to-end — Sentry alert creation and tracing setup, Firecrawl search, Shopify storefront GraphQL, Runway studio, Vercel workflows.",
    sources: "Tessl (8)",
    examples: [
      { n: "sentry-create-alert", d: "create a correctly-scoped Sentry alert rule through the API (2 task–skill pairs)" },
      { n: "sentry-setup-tracing", d: "instrument an app with Sentry tracing following the SDK's setup contract" },
      { n: "shopify-storefront-graphql", d: "query the Shopify storefront GraphQL API for the requested catalog data" },
      { n: "vercel workflow-init", d: "initialize and configure a Vercel workflow project" },
    ],
    tasks: ["firecrawl-search", "sentry-nextjs-sdk", "sentry-create-alert (2 task–skill pairs)", "sentry-setup-tracing", "runway-studio-skills", "shopify-storefront-graphql", "vercel workflow-init"],
  },
  {
    name: "Writing & review", count: 5, color: "#d9a03f",
    desc: "Auditing and revising technical content — Anthropic cookbook audits, ClickHouse architecture advice, Firecrawl search-result write-ups, Stripe project docs.",
    sources: "Tessl (5)",
    examples: [
      { n: "anthropic-cookbook audit", d: "audit a cookbook notebook for outdated APIs and broken guidance" },
      { n: "clickhouse-architecture-advisor", d: "review a proposed ClickHouse schema and advise on architecture" },
      { n: "stripe-projects review", d: "review Stripe project documentation for accuracy and completeness" },
    ],
    tasks: ["anthropic-cookbook audit", "claude-cookbooks audit", "clickhouse-architecture-advisor", "firecrawl-search review", "stripe-projects review"],
  },
  {
    name: "Other", count: 11, color: "#9a9a9a",
    desc: "Testing & verification (4): fuzzing setup, security review, vitest, web-design guidelines. Infrastructure & ops (3): Stripe projects, Vercel CLI, skill discovery. Web automation (2): browser-use cloud, Firecrawl scrape. Miscellaneous (2): multilingual video dubbing, find-skills.",
    sources: "SkillsBench (2) + Tessl (9)",
    examples: [
      { n: "setup-fuzzing-py", d: "set up a Python fuzzing harness that finds the seeded crash" },
      { n: "sentry-python security-review", d: "run a security review of a Python service using the review skill" },
      { n: "browser-use cloud", d: "drive a cloud browser session to complete a multi-step web task" },
      { n: "multilingual-video-dubbing", d: "dub a video into multiple languages with aligned timing" },
    ],
    tasks: ["setup-fuzzing-py", "sentry-python security-review", "next-sanity vitest", "web-design-guidelines", "stripe agent-toolkit projects", "vercel-cli", "find-skills (2 task–skill pairs)", "browser-use cloud", "firecrawl-scrape", "multilingual-video-dubbing"],
  },
];

const FIG3_SOURCES = [
  { name: "SkillsBench", tasks: 87, picked: 32 },
  { name: "DocOps", tasks: 186, picked: 32 },
  { name: "Tessl", tasks: 334, picked: 39 },
];
