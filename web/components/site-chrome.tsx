// Shared header + footer for the standalone Cairn marketing site.
// Light "clean B2B confidence" chrome, emerald accent. Outbound links return
// to the Komatik ecosystem and the open-source repo.

const KOMATIK = "https://komatik.ai";
const APPS = "https://komatik.ai/apps";
const REPO = "https://github.com/KomatikAI/cairn";
const EMERALD = "#10B981";
const EMERALD_DEEP = "#059669";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: "#E2EFEA", backgroundColor: "rgb(255 255 255 / 0.82)" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href={KOMATIK} className="flex items-center gap-2.5 text-sm font-semibold tracking-tight" style={{ color: "#04231A" }}>
          <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: EMERALD }} aria-hidden="true" />
          <span>Komatik</span>
          <span style={{ color: "#6B7A75" }}>/</span>
          <span style={{ color: "#27433B" }}>Cairn</span>
        </a>
        <nav className="flex items-center gap-5 text-sm">
          <a href={APPS} className="hidden sm:inline" style={{ color: "#6B7A75" }}>All apps</a>
          <a href={REPO} target="_blank" rel="noopener noreferrer" className="hidden sm:inline" style={{ color: "#6B7A75" }}>GitHub</a>
          <a href="#missions" className="rounded-lg px-4 py-1.5 text-xs font-bold text-white transition-transform hover:-translate-y-px" style={{ backgroundColor: EMERALD_DEEP }}>
            See the missions
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="border-t" style={{ borderColor: "#E2EFEA", backgroundColor: "#ECFDF5" }}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#04231A" }}>
              <span className="inline-block size-2 rounded-full" style={{ backgroundColor: EMERALD }} aria-hidden="true" />
              Komatik Cairn
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "#6B7A75" }}>
              The mission arm of Komatik — autonomous AI working on the world&apos;s real problems, in
              public. Code MIT, research CC, every token on a public ledger.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm">
            <div className="flex flex-col gap-2.5">
              <span className="text-xs uppercase tracking-[0.18em]" style={{ color: "#9AA8A3" }}>Cairn</span>
              <a href="#missions" style={{ color: "#6B7A75" }}>Missions</a>
              <a href={REPO} target="_blank" rel="noopener noreferrer" style={{ color: "#6B7A75" }}>Source (GitHub)</a>
              <a href="mailto:questions@komatik.ai?subject=Cairn%20%E2%80%94%20Mission%20Inquiry" style={{ color: "#6B7A75" }}>Sponsor a mission</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-xs uppercase tracking-[0.18em]" style={{ color: "#9AA8A3" }}>Komatik</span>
              <a href={KOMATIK} style={{ color: "#6B7A75" }}>komatik.ai</a>
              <a href={APPS} style={{ color: "#6B7A75" }}>All apps</a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-xs" style={{ borderColor: "#D6EBE2", color: "#9AA8A3" }}>
          © {year} Komatik · Cairn is part of the Komatik platform.
        </div>
      </div>
    </footer>
  );
}
