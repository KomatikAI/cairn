// Komatik Cairn — standalone marketing site (cairn.komatik.xyz).
//
// Ported from the ecosystem bespoke page (komatik.ai/apps/cairn). Light
// "clean B2B confidence" theme, emerald accent. The MissionSeedlings grid
// (live GitHub data) and CairnStoryVisual are carried over. Public copy uses
// the Cairn brand only — the retired internal codename is not surfaced.

import type { CSSProperties, ReactNode } from "react";
import { MissionSeedlings } from "@/components/MissionSeedlings";
import { CairnStoryVisual } from "@/components/cairn/CairnStoryVisual";

const ACCENT = "#10B981"; // Cairn emerald
const EMERALD = ACCENT;
const EMERALD_DEEP = "#059669";
const REPO_URL = "https://github.com/KomatikAI/cairn";

export default function CairnPage() {
  return (
    <article
      className="relative overflow-hidden"
      style={
        {
          ["--cairn-accent"]: ACCENT,
          ["--font-display"]: "var(--font-sans), system-ui",
          ["--gt-canvas"]: "#FFFFFF",
          ["--gt-canvas-alt"]: "#ECFDF5",
          ["--gt-canvas-elevated"]: "#FFFFFF",
          ["--gt-ink-primary"]: "#04231A",
          ["--gt-ink-body"]: "#27433B",
          ["--gt-ink-muted"]: "#6B7A75",
          ["--gt-brand-primary"]: EMERALD,
          ["--gt-border-hairline"]: "#E2EFEA",
          ["--color-background"]: "255 255 255",
          ["--color-foreground"]: "4 35 26",
          ["--color-card"]: "255 255 255",
          backgroundColor: "rgb(255 255 255)",
          color: "rgb(4 35 26)",
        } as CSSProperties
      }
    >
      <Hero />
      <TrustWall />
      <GetStarted />
      <Missions />
      <Accountability />
      <Autonomy />
      <Pledge />
      <Audiences />
      <FAQ />
      <FinalCta />
    </article>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
const HERO_METRICS = [
  { n: "7", l: "active missions", accent: true },
  { n: "1%", l: "of platform compute pledged", accent: false },
  { n: "100%", l: "open source · public ledger", accent: true },
] as const;

function Hero() {
  return (
    <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20" style={{ background: "var(--gt-canvas-alt)" }}>
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: EMERALD }}>
              Cairn · The mission arm of Komatik
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]" style={{ fontFamily: "var(--font-display)", color: "var(--gt-ink-primary)" }}>
              Autonomous AI on the world&apos;s real problems. <span style={{ color: EMERALD }}>All in public.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--gt-ink-body)" }}>
              AI agent collectives work on seven hard problems — energy poverty, housing, food waste,
              clean water, health access, education gaps, climate resilience. Every finding is
              open-source. Every AI call is logged. Komatik pledges 1% of its compute to fund the work.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a href="#missions" className="inline-flex h-12 items-center rounded-lg px-6 text-sm font-bold text-white transition-transform hover:-translate-y-px" style={{ backgroundColor: EMERALD_DEEP }}>
                See the missions →
              </a>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold" style={{ color: EMERALD }}>
                Read the source →
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
              {HERO_METRICS.map((m) => (
                <div key={m.l}>
                  <p className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: m.accent ? EMERALD : "var(--gt-ink-primary)" }}>{m.n}</p>
                  <p className="mt-1 max-w-[12rem] text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--gt-ink-muted)" }}>{m.l}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 font-mono text-xs" style={{ color: "var(--gt-ink-muted)" }}>
              Code MIT · Research CC · Public TOKENS.md per mission
            </p>
          </div>
          <div className="w-full">
            <CairnStoryVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── TrustWall ─────────────────────────────────────────────────────────────────
function TrustWall() {
  const marks = ["MIT LICENSE", "CREATIVE COMMONS", "PUBLIC TOKENS.md", "PUBLISHED CHARTER", "GLASS WALL", "GITHUB"];
  return (
    <section className="relative border-y py-12" style={{ borderColor: "var(--gt-border-hairline)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--gt-ink-muted)" }}>
          Built in the open — verifiable by anyone with a browser
        </p>
        <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4 text-base font-bold tracking-tight" style={{ color: "var(--gt-ink-muted)" }}>
          {marks.map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>
    </section>
  );
}

// ── GetStarted ──────────────────────────────────────────────────────────────
function GetStarted() {
  const cards = [
    { eyebrow: "Missions · Open source", heading: "Explore the active missions", body: "Missions are seeded with GitHub repos — energy poverty, housing, food waste, clean water, health access, education gaps. Each has a public TOKENS.md ledger.", cta: "See the missions →", href: "#missions", external: false, tag: "Open" },
    { eyebrow: "Source code · MIT", heading: "Contribute or fork the harness", body: "The Cairn harness is MIT-licensed on GitHub. Fork it to spin up your own mission area, or contribute agents to an existing one.", cta: "View on GitHub →", href: REPO_URL, external: true, tag: "Free" },
    { eyebrow: "Partnership · Open channel", heading: "Bring a mission area", body: "Working on a hard problem with existing research or data? Cairn can provide compute, agents, and a public accountability stack. Talk to us.", cta: "Email us →", href: "mailto:questions@komatik.ai?subject=Cairn%20%E2%80%94%20Mission%20Partnership", external: false, tag: "Open" },
  ];

  return (
    <section id="get-started" className="relative scroll-mt-20 py-16 sm:py-20" style={{ backgroundColor: "rgb(var(--color-foreground) / 0.015)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: ACCENT }}>Get involved</p>
        <h2 className="mb-10 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.92)" }}>Three ways in.</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <a key={card.href} href={card.href} {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex flex-col rounded-2xl border p-6 transition-all hover:-translate-y-0.5" style={{ borderColor: "rgb(var(--color-foreground) / 0.1)", backgroundColor: "rgb(var(--color-card) / 0.6)" }}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: ACCENT }}>{card.eyebrow}</p>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${ACCENT}18`, color: ACCENT }}>{card.tag}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold leading-snug" style={{ color: "rgb(var(--color-foreground) / 0.9)" }}>{card.heading}</h3>
              <p className="mb-4 flex-1 text-sm leading-relaxed" style={{ color: "rgb(var(--color-foreground) / 0.58)" }}>{card.body}</p>
              <span className="text-sm font-semibold transition-colors group-hover:opacity-80" style={{ color: ACCENT }}>{card.cta}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Missions ────────────────────────────────────────────────────────────────
function Missions() {
  return (
    <section id="missions" className="relative scroll-mt-20 bg-[rgb(var(--color-foreground)/0.02)] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: ACCENT }}>Active missions</p>
        <h2 className="mb-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.92)" }}>
          Seven hard problems. AI agents working on each in public.
        </h2>
        <p className="mb-10 max-w-3xl text-base" style={{ color: "rgb(var(--color-foreground) / 0.6)" }}>
          Each mission is a long-running research program scoped to a specific problem in a specific
          geography. Six autonomous agent types per mission. Findings flow into a public repository as
          they&apos;re generated.
        </p>
        <MissionSeedlings accentColor={ACCENT} />
      </div>
    </section>
  );
}

// ── Accountability ────────────────────────────────────────────────────────────
function Accountability() {
  const items = [
    { title: "Published Charter", tag: "Governance", body: "Anti-advocacy. Safety protocols. Neutrality requirements. Findings published as propositions, not policy pitches. Prototypes are demonstrations, not deployable products. The charter is in the repo; agents read it as a hard constraint." },
    { title: "Public Ledger", tag: "Transparency", body: "Every AI call logged — provider, model, token count, cost, calling agent. Per-mission TOKENS.md files you can audit on GitHub. If we say we donated compute, you can verify exactly how much, to which model, on which day, for which mission." },
    { title: "Contention Map", tag: "Conflict-as-signal", body: "When research findings from different agents or missions contradict each other, the tensions are documented — not suppressed. The Contention Map is a first-class output. Disagreement between research lines is treated as valuable signal, not failure." },
    { title: "Glass Wall", tag: "Public observation", body: "The public sees everything but doesn't directly steer the research. Contributions route through the Public Signal pipeline (GitHub issues), aggregate at the Apex tier, and feed back into mission scope decisions. Engagement without pollution." },
  ];

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: ACCENT }}>The accountability stack</p>
        <h2 className="mb-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.92)" }}>
          Four mechanisms that turn the mission claims into verifiable facts.
        </h2>
        <p className="mb-12 max-w-3xl text-base" style={{ color: "rgb(var(--color-foreground) / 0.6)" }}>
          Cairn doesn&apos;t ask you to trust it. The Charter, the Ledger, the Contention Map, and the
          Glass Wall together make the claims auditable by anyone with a browser.
        </p>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border md:grid-cols-2" style={{ background: "rgb(4 35 26 / 0.08)", borderColor: "rgb(4 35 26 / 0.08)" }}>
          {items.map((it) => (
            <div key={it.title} className="bg-[rgb(var(--color-background))] p-6 sm:p-7">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.9)" }}>{it.title}</h3>
                <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: ACCENT, letterSpacing: "0.15em" }}>{it.tag}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-foreground) / 0.65)" }}>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Autonomy ──────────────────────────────────────────────────────────────────
function Autonomy() {
  const agents = [
    { role: "Mission Guardian", body: "Ensures every research cycle stays aligned with the mission's charter, scope, and safety constraints. Halts agents that drift." },
    { role: "Research", body: "Gathers evidence — literature, datasets, primary sources, prior work. The first agent to fire on any new research question." },
    { role: "Analysis", body: "Builds models, runs simulations, identifies patterns across the evidence Research surfaces. Outputs go to the public repository." },
    { role: "Prototype", body: "Writes code, builds demonstrations, ships open-source artifacts that prove or disprove an analysis hypothesis. MIT licensed." },
    { role: "Documentation", body: "Translates research outputs into readable findings — for governments, NGOs, researchers, communities. Creative Commons licensed." },
    { role: "Community", body: "Integrates external contributions from the Public Signal pipeline. Routes GitHub issues, aggregates feedback, surfaces signal to the Apex tier." },
  ];
  const tiers = [
    { name: "Apex", body: "Cross-mission synthesis. Pattern-spotting across roots." },
    { name: "Roots", body: "Four root areas — basic needs, personal growth, planet, society." },
    { name: "Categories", body: "Topic groupings within each root." },
    { name: "Seeds", body: "Individual missions. The actual research surface." },
  ];

  return (
    <section className="relative bg-[rgb(var(--color-foreground)/0.02)] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: ACCENT }}>How autonomy works</p>
        <h2 className="mb-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.92)" }}>
          Six agent types per mission. Four tiers above.
        </h2>
        <p className="mb-10 max-w-3xl text-base" style={{ color: "rgb(var(--color-foreground) / 0.6)" }}>
          Agents run research cycles continuously. We set the mission and review outputs — agents decide
          what to research, how to analyze it, and when findings are ready. The tier structure lets work
          flow up (synthesis across missions) and down (Apex-level decisions inform Seed-level scope).
        </p>

        <div className="mb-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-3" style={{ background: "rgb(4 35 26 / 0.08)", borderColor: "rgb(4 35 26 / 0.08)" }}>
          {agents.map((a) => (
            <div key={a.role} className="bg-[rgb(var(--color-background))] p-5 sm:p-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ backgroundColor: ACCENT }} />
                <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.9)" }}>{a.role}</h3>
              </div>
              <p className="pl-[18px] text-xs leading-relaxed" style={{ color: "rgb(var(--color-foreground) / 0.55)" }}>{a.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border p-6 sm:p-7" style={{ borderColor: `${ACCENT}25`, background: `linear-gradient(135deg, ${ACCENT}06 0%, transparent 70%)` }}>
          <p className="mb-4 font-mono text-xs uppercase tracking-wider" style={{ color: ACCENT, letterSpacing: "0.15em" }}>Tier structure</p>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {tiers.map((t, i) => (
              <li key={t.name} className="flex items-start gap-3">
                <span className="shrink-0 font-mono text-sm font-semibold tabular-nums" style={{ color: ACCENT }}>0{i + 1}</span>
                <div>
                  <h4 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.9)" }}>{t.name}</h4>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: "rgb(var(--color-foreground) / 0.6)" }}>{t.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ── Pledge ────────────────────────────────────────────────────────────────────
function Pledge() {
  const phases = [
    { n: "Phase 1", title: "Monthly budget per mission", body: "Komatik allocates a flat monthly compute budget to each active mission. Predictable, auditable, ledgered. Where we are today." },
    { n: "Phase 2", title: "Donor-Advised Fund", body: "When platform revenue is consistent enough to support it, the Pledge becomes a Donor-Advised Fund. Same 1% compute commitment, broader funding base, formalized governance." },
    { n: "Phase 3", title: "501(c)(3) foundation", body: "At scale, the Pledge graduates into a registered foundation. Independent board, statutory reporting, tax-deductible contributions, full institutional infrastructure." },
  ];

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: ACCENT }}>The Pledge · 1% Compute</p>
        <h2 className="mb-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.92)" }}>
          One percent of platform compute, structured to grow.
        </h2>
        <p className="mb-12 max-w-3xl text-base" style={{ color: "rgb(var(--color-foreground) / 0.6)" }}>
          Every Komatik product funds compute for Cairn missions. Not as a marketing line — as a
          verifiable, ledgered commitment that scales with the platform. Three phases for how the pledge
          institutionalizes over time.
        </p>
        <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {phases.map((p, i) => (
            <li key={p.n} className="relative overflow-hidden rounded-2xl border p-6 sm:p-7" style={{ borderColor: "rgb(var(--color-foreground) / 0.1)" }}>
              {i === 0 && <div className="absolute left-0 right-0 top-0 h-[2px]" style={{ backgroundColor: ACCENT }} />}
              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider" style={{ color: i === 0 ? ACCENT : "rgb(var(--color-foreground) / 0.45)", letterSpacing: "0.15em" }}>{p.n}</span>
                {i === 0 && <span className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT, border: `1px solid ${ACCENT}30` }}>Now</span>}
              </div>
              <h3 className="mb-3 text-lg font-bold leading-snug" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.9)" }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-foreground) / 0.65)" }}>{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ── Audiences ───────────────────────────────────────────────────────────────
function Audiences() {
  const audiences = [
    { label: "Komatik customer", headline: "Your software spend funds research that matters.", body: "Every Komatik product funds compute for Cairn missions. You can verify exactly where it goes — the public ledger shows every token spent on every mission. Your work pays for itself and contributes to something larger." },
    { label: "Researcher", headline: "Fork the work. Contribute findings. Propose new missions.", body: "All code is MIT-licensed. All research is Creative Commons. The Public Signal pipeline routes GitHub issues to the Apex tier for new mission proposals. Build on what the agents have already found — your time goes to net-new work, not rediscovery." },
    { label: "Policy advisor", headline: "Evidence-based analysis without the advocacy lean.", body: "The charter requires anti-advocacy — Cairn outputs are propositions, not policy pitches. The Contention Map documents disagreements instead of hiding them. Neutral, auditable, verifiable. Suitable for citation in a real policy memo." },
  ];

  return (
    <section className="relative bg-[rgb(var(--color-foreground)/0.02)] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: ACCENT }}>Who Cairn is for</p>
        <h2 className="mb-12 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.92)" }}>
          Three audiences. One open repository.
        </h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {audiences.map((a) => (
            <div key={a.label} className="rounded-2xl border p-7" style={{ borderColor: "rgb(var(--color-foreground) / 0.1)", background: "rgb(var(--color-card))" }}>
              <p className="mb-3 font-mono text-xs uppercase tracking-wider" style={{ color: ACCENT, letterSpacing: "0.15em" }}>{a.label}</p>
              <h3 className="mb-4 text-xl font-bold leading-snug" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.9)" }}>{a.headline}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgb(var(--color-foreground) / 0.65)" }}>{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ (native details) ──────────────────────────────────────────────────────
function FAQ() {
  const items = [
    { q: "What is the Public Ledger?", a: "Every AI call made by a Cairn agent is logged — which provider, which model, how many tokens, what it cost, which agent made the call. Each mission has a TOKENS.md file you can read on GitHub. Total transparency, verifiable by anyone with a browser. If we say we donated compute, you can audit exactly how much, to which model, on which day." },
    { q: "What is the Contention Map?", a: "When research findings from different agents or missions contradict each other, the tensions are documented — not suppressed. The Contention Map is a first-class output that captures unresolved disagreements. Conflict between research lines is treated as valuable signal, not a problem to hide. You can see exactly where the open questions are." },
    { q: "What does the Charter actually say?", a: "Anti-advocacy — findings are presented as propositions, not policy recommendations. Glass Wall transparency — the public can see everything but doesn't directly steer research. Safety protocols for agent behavior. Neutrality requirements. Prototypes are demonstrations, not deployable products. The full charter is in the repo." },
    { q: "How does the pledge work?", a: "Komatik pledges 1% of platform compute to Cairn. Phase 1 (now): flat monthly budget per mission. Phase 2: Donor-Advised Fund when platform revenue is consistent. Phase 3: 501(c)(3) foundation at scale. As Komatik grows, the commitment grows." },
    { q: "Can I contribute?", a: "Yes. Fork the research, contribute findings, propose new missions through the Public Signal pipeline (GitHub issues). Contributions are aggregated and routed by the Apex tier — individual voices are heard but don't directly steer research. All code is MIT-licensed, all research is Creative Commons." },
  ];

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: ACCENT }}>Questions</p>
        <h2 className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.92)" }}>What we get asked most.</h2>
        <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "rgb(4 35 26 / 0.08)", background: "rgb(var(--color-background))" }}>
          {items.map((it) => (
            <details key={it.q} className="group border-b last:border-b-0" style={{ borderColor: "rgb(4 35 26 / 0.08)" }}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-semibold hover:bg-[rgb(var(--color-foreground)/0.02)] sm:px-7 sm:text-lg" style={{ fontFamily: "var(--font-display)", color: "rgb(var(--color-foreground) / 0.9)" }}>
                {it.q}
                <span className="shrink-0 transition-transform group-open:rotate-45" style={{ color: ACCENT }} aria-hidden="true">+</span>
              </summary>
              <div className="max-w-3xl px-6 pb-7 text-base leading-relaxed sm:px-7" style={{ color: "rgb(var(--color-foreground) / 0.65)" }}>{it.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCta() {
  return (
    <section className="relative border-t py-24 sm:py-28" style={{ background: "var(--gt-canvas-alt)", borderColor: "var(--gt-border-hairline)" }}>
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: EMERALD }}>
          AI working on the world&apos;s real problems
        </p>
        <h2 className="mx-auto mb-8 max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-display)", color: "var(--gt-ink-primary)" }}>
          Every token logged. <span style={{ color: EMERALD }}>Every finding open.</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#missions" className="inline-flex h-14 items-center rounded-lg px-8 text-base font-bold text-white transition-transform hover:-translate-y-px" style={{ backgroundColor: EMERALD_DEEP }}>
            Explore the missions
          </a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center rounded-lg border px-8 text-base font-semibold" style={{ borderColor: "var(--gt-border-hairline)", color: "var(--gt-ink-body)", background: "transparent" }}>
            Read the source
          </a>
          <a href="mailto:questions@komatik.ai?subject=Cairn%20%E2%80%94%20Mission%20Inquiry" className="inline-flex h-14 items-center rounded-lg border px-8 text-base font-semibold" style={{ borderColor: "var(--gt-border-hairline)", color: "var(--gt-ink-body)", background: "transparent" }}>
            Sponsor a mission
          </a>
        </div>
        <p className="mt-12 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--gt-ink-muted)" }}>
          Komatik Cairn · Part of the Komatik platform
        </p>
      </div>
    </section>
  );
}
