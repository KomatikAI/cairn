# Reference examples

External material held in the repo as a concrete reference for what "good"
looks like — not Cairn research output. Each subdirectory is attributed to its
source project.

## `nuna/`

The research framework from **Nuna** (separate project, same author), included
here as the **rigor north star** for Cairn's researcher agent.

The seed-002 dry-run (2026-06-20) produced findings that failed the charter
quality bar — zero citations, no methodology, over-calibrated confidence (see
[issue #49](https://github.com/KomatikAI/cairn/issues/49)). Nuna is the
concrete counter-example: what the charter's §6.1 universal requirements look
like when they're actually met. Specifically it demonstrates:

- **Dense inline citations on every claim** — linked URLs to primary sources
- **Primary-source-first** — government / academic / NGO before journalism
- **Quantitative specificity** — hard numbers attributed to a named source
- **Methodology stated up front** — search count, sources, date
- **Structured comparison** — tables with explicit gap framing
- **Layered discipline** — *"facts before fix; no layer assumes a number the
  layer above it hasn't established"*
- **Honest versioning** — `v0.1`, "living draft", open questions

### Most instructive file

[`nuna/docs/06-global-lifecycle-research.md`](nuna/docs/06-global-lifecycle-research.md)
— the actual research output. Read it next to `seeds/002-homelessness-la/FINDINGS.md`
to see the gap the researcher agent needs to close. Nuna reached this bar using
Firecrawl web search + authoritative scrapes, then synthesis — the capability
Cairn's researcher currently lacks (no web access) and that issue #49 Phase 1
adds.

### Scope of the copy

The framework layer only: `README.md` + `docs/00`–`06`. Nuna's `diligence/`,
`architecture/`, `plan/`, and `ledger/` layers exist in the source project but
are out of scope here.

### Provenance

Source: `Nuna` project (author: D. Schirmer). Copied verbatim 2026-06-20.
Internal markdown links resolve within `nuna/`. Nuna has no license file at the
time of copy; included by the author as reference material.
