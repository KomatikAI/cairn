"use client";

import { useEffect, useState } from "react";

interface SeedlingInfo {
  codename: string;
  mission: string;
  status: "planned" | "active" | "completed";
  repoUrl: string;
  lastCommit?: string;
  tokensBurned?: number;
  costUsd?: number;
}

const SEEDLINGS: SeedlingInfo[] = [
  {
    codename: "Energy",
    mission: "Making clean energy accessible in communities that don't have it yet",
    status: "planned",
    repoUrl: "https://github.com/KomatikAI/cairn/tree/main/seeds/001-energy",
  },
  {
    codename: "Housing",
    mission: "Understanding and improving housing access in LA County through data and research",
    status: "planned",
    repoUrl: "https://github.com/KomatikAI/cairn/tree/main/seeds/002-homelessness-la",
  },
  {
    codename: "Hunger",
    mission: "Reducing the food that gets lost between farms and the people who need it",
    status: "planned",
    repoUrl: "https://github.com/KomatikAI/cairn",
  },
  {
    codename: "Water",
    mission: "Open designs for water purification that communities can build themselves",
    status: "planned",
    repoUrl: "https://github.com/KomatikAI/cairn",
  },
  {
    codename: "Health",
    mission: "Free diagnostic tools for medical settings that can't afford commercial ones",
    status: "planned",
    repoUrl: "https://github.com/KomatikAI/cairn",
  },
  {
    codename: "Education",
    mission: "Learning tools that work in places with limited internet and infrastructure",
    status: "planned",
    repoUrl: "https://github.com/KomatikAI/cairn",
  },
  {
    codename: "Climate",
    mission: "Helping communities prepare for and adapt to the effects of climate change",
    status: "planned",
    repoUrl: "https://github.com/KomatikAI/cairn",
  },
];

const STATUS_BADGE: Record<string, { text: string; style: React.CSSProperties }> = {
  planned: {
    text: "Planned",
    style: { backgroundColor: "rgb(var(--color-foreground) / 0.06)", color: "rgb(var(--color-foreground) / 0.5)" },
  },
  active: {
    text: "Active",
    style: { backgroundColor: "rgba(16, 185, 129, 0.12)", color: "rgba(5, 150, 105, 1)" },
  },
  completed: {
    text: "Completed",
    style: { backgroundColor: "rgba(59, 130, 246, 0.12)", color: "rgba(37, 99, 235, 1)" },
  },
};

interface RepoData {
  pushed_at: string;
  description: string;
}

export function MissionSeedlings({ accentColor }: { accentColor: string }) {
  const [repoData, setRepoData] = useState<RepoData | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/KomatikAI/cairn")
      .then((r) => (r.ok ? r.json() : null))
      .then(setRepoData)
      .catch(() => null);
  }, []);

  return (
    <div className="space-y-8">
      {repoData && (
        <div
          className="rounded-xl p-5"
          style={{
            border: "1px solid rgb(var(--color-foreground) / 0.1)",
            backgroundColor: "rgb(var(--color-foreground) / 0.03)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span
              className="text-sm font-medium"
              style={{ color: "rgb(var(--color-foreground) / 0.7)" }}
            >
              Live Repository
            </span>
          </div>
          <a
            href="https://github.com/KomatikAI/cairn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline"
            style={{ color: accentColor }}
          >
            github.com/KomatikAI/cairn
          </a>
          <p
            className="text-xs mt-2"
            style={{ color: "rgb(var(--color-foreground) / 0.35)" }}
          >
            Last updated: {new Date(repoData.pushed_at).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SEEDLINGS.map((seedling, i) => {
          const badge = STATUS_BADGE[seedling.status];
          return (
            <a
              key={seedling.codename}
              href={seedling.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl p-5 transition-all"
              style={{
                border: "1px solid rgb(var(--color-foreground) / 0.08)",
                backgroundColor: "rgb(var(--color-foreground) / 0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgb(var(--color-foreground) / 0.15)";
                e.currentTarget.style.backgroundColor = "rgb(var(--color-foreground) / 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgb(var(--color-foreground) / 0.08)";
                e.currentTarget.style.backgroundColor = "rgb(var(--color-foreground) / 0.02)";
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono font-bold rounded px-1.5 py-0.5"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    {String(i + 1).padStart(3, "0")}
                  </span>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "rgb(var(--color-foreground) / 0.9)" }}
                  >
                    {seedling.codename}
                  </h3>
                </div>
                <span
                  className="text-[10px] font-medium rounded-full px-2 py-0.5"
                  style={badge.style}
                >
                  {badge.text}
                </span>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgb(var(--color-foreground) / 0.5)" }}
              >
                {seedling.mission}
              </p>
              {seedling.tokensBurned !== undefined && (
                <div
                  className="mt-3 pt-3 flex items-center gap-4"
                  style={{ borderTop: "1px solid rgb(var(--color-foreground) / 0.08)" }}
                >
                  <span
                    className="text-[10px]"
                    style={{ color: "rgb(var(--color-foreground) / 0.35)" }}
                  >
                    {seedling.tokensBurned.toLocaleString()} tokens
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: "rgb(var(--color-foreground) / 0.35)" }}
                  >
                    ${seedling.costUsd?.toFixed(2)} donated
                  </span>
                </div>
              )}
            </a>
          );
        })}
      </div>

      <div
        className="rounded-xl p-5"
        style={{
          border: "1px solid rgb(var(--color-foreground) / 0.1)",
          backgroundColor: "rgb(var(--color-foreground) / 0.03)",
        }}
      >
        <h3
          className="text-sm font-semibold mb-2"
          style={{ color: "rgb(var(--color-foreground) / 0.9)" }}
        >
          Where the money goes
        </h3>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "rgb(var(--color-foreground) / 0.5)" }}
        >
          Komatik donates 1% of all compute to Cairn missions. Every AI call is
          logged in each mission&apos;s{" "}
          <code
            className="text-[10px] rounded px-1 py-0.5"
            style={{ backgroundColor: "rgb(var(--color-foreground) / 0.06)" }}
          >
            TOKENS.md
          </code>
          {" "}&mdash; a public ledger you can verify yourself. As Komatik grows, the
          budget for these missions grows with it.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span
            className="text-[10px] font-medium rounded-full px-2 py-0.5"
            style={{ backgroundColor: "rgba(16, 185, 129, 0.12)", color: "rgba(5, 150, 105, 1)" }}
          >
            Pledge 1% Compute
          </span>
          <span
            className="text-[10px]"
            style={{ color: "rgb(var(--color-foreground) / 0.35)" }}
          >
            Verified public ledger per mission
          </span>
        </div>
      </div>
    </div>
  );
}
