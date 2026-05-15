# Cairn

Cairn is Komatik's repository for grant/proposal infrastructure, capability scaffolding, and agent-oriented research/proposal workflows.

The repository currently contains two major strata:

1. **Active Cairn proposal infrastructure**
   Reusable proposal assets, capability maps, cost-volume templates, archived proposal examples, and gap-checking templates live under `proposals/`.

2. **Legacy autonomous research infrastructure**
   Earlier Yggdrasil-era agent infrastructure, seed/category/root hierarchy concepts, and public-signal pipeline code remain in the repo and need a deliberate cleanup pass before they should be treated as current product documentation.

Cairn is the canonical name for this repository. References to Yggdrasil, World Tree, or `komatik-yggdrasil` should be treated as legacy unless a file is explicitly marked archival.

---

## Current Status

This repository is in a cleanup and normalization phase.

Known work remaining:

- Rename or remove stale Yggdrasil-facing docs and website copy.
- Update repo URLs and environment examples to `KomatikAI/cairn`.
- Fact-check proposal scaffold fields marked `[CONFIRM]`.
- Fill proposal narrative fields marked `[NEEDS DAVID INPUT]`.
- Resolve the archived `cairn` capability-name collision in `proposals/capabilities.json`.
- Decide which legacy agent-infrastructure modules remain active Cairn components and which should move to archive.

---

## Repository Structure

```text
cairn/
├── proposals/
│   ├── capabilities.json          # Capability map for proposal authoring
│   ├── pi-bio.md                  # Reusable PI biography paragraphs
│   ├── rates.yaml                 # Labor, fringe, indirect, fee, and ODC assumptions
│   ├── templates/                 # Reusable proposal templates and checklists
│   ├── archive/                   # Historical proposal material and retrospectives
│   ├── active/                    # Working directory for active proposal efforts
│   └── opportunities/             # Parsed opportunity records
├── infrastructure/                # Legacy/active agent infrastructure; cleanup pending
├── docs/                          # Architecture notes and ADRs
├── site/                          # Legacy public website; cleanup pending
├── roots/                         # Legacy Yggdrasil hierarchy; cleanup pending
├── categories/                    # Legacy Yggdrasil hierarchy; cleanup pending
└── seeds/                         # Legacy Yggdrasil hierarchy; cleanup pending
```

---

## Proposal Scaffold

The proposal scaffold is the most current Cairn-specific portion of the repo.

Primary files:

- `proposals/capabilities.json`
- `proposals/pi-bio.md`
- `proposals/rates.yaml`
- `proposals/templates/cost-volume-phase1.md`
- `proposals/templates/sdvosb-phase3-framing.md`
- `proposals/templates/commercialization-channels.md`
- `proposals/templates/gap-checklist-template.md`

Before using the scaffold for a live submission, resolve every `[CONFIRM]` and `[NEEDS DAVID INPUT]` marker.

---

## Local Setup

```bash
git clone https://github.com/KomatikAI/cairn.git
cd cairn
```

Agent infrastructure setup is not yet canonicalized for Cairn. Until the infrastructure cleanup is complete, treat environment files and service names as legacy and verify each value before use.

For the legacy infrastructure stack:

```bash
cp infrastructure/.env.example infrastructure/.env
# Edit infrastructure/.env before running any services.
```

---

## Naming Policy

Cairn is canonical.

Legacy names:

- `Yggdrasil`
- `World Tree`
- `komatik-yggdrasil`

These names should not be used in new active documentation, package metadata, environment examples, prompts, or proposal templates. They may remain in archival proposal material or migration notes when needed for historical traceability.

---

## Licensing

- Code and infrastructure: MIT License
- Research, proposal templates, and documentation: CC BY 4.0 unless otherwise noted
- Komatik brand assets: All rights reserved
