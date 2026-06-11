# Seed 001 Template

This is a **template Seedling** for the Komatik Cairn charitable AI initiative. It provides a fully containerized, self-contained OpenClaw agent collective that can be instantiated for any charitable cause.

## Purpose

This template serves as:

1. **Starting point for new seeds** — Copy this directory structure to create new seed instances (e.g., 003-education, 004-healthcare, etc.)
2. **Reference implementation** — Demonstrates the complete architecture for containerized agent collectives
3. **Development sandbox** — Test new agent roles, workflows, and integrations before deploying to production seeds

## Quick Start

### 1. Copy the template

```bash
cp -r seeds/001-template seeds/003-your-new-seed
```

### 2. Update configuration

Edit the following files in your new seed directory:
- `MISSION.md` — Replace with your seed's mission statement
- `config/bifrost.json` — Update virtual keys and budget limits
- `config/agents/*.yaml` — Customize agent configurations as needed
- `seed.yaml` — Update name, slug, and description

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

### 4. Run the seed

```bash
docker compose --project-directory infrastructure \
  -f infrastructure/compose.yaml \
  -f seeds/003-your-new-seed/config/compose.override.yaml up
```

## Architecture

The Seedling includes:

- **OpenClaw Gateway** — Session lifecycle, workflow engine, RBAC
- **PostgreSQL 16** — Agent state and memory storage
- **Bifrost** — LLM proxy with virtual keys and budget metering
- **Scheduler** — Cycle loop manager (replaces OS-level cron)
- **Publisher** — Git output pipeline + TOKENS.md generator
- **6 Agent Containers** — Mission, Research, Analysis, Prototype, Documentation, Community

## Agent Roles

| Role | Responsibility |
|------|----------------|
| Mission | Mission alignment gate, publication approval |
| Research | Literature, datasets, open-source discovery |
| Analysis | Modeling, simulation, impact quantification |
| Prototype | Code, designs, proof-of-concepts |
| Documentation | Public-facing outputs, FINDINGS.md |
| Community | External contribution triage, PR review |

## Budget Management

Bifrost enforces budget caps through virtual keys:

- **Dry run**: $5/month — For testing and development
- **Production**: $50/month — For active seed operations

When budget is exhausted, Bifrost returns HTTP 429 and agents halt until the next billing cycle.

## Output Structure

```
seeds/001-template/
├── MISSION.md
├── seed.yaml
├── config/
│   ├── bifrost.json
│   ├── compose.override.yaml
│   └── agents/
│       ├── mission.yaml
│       ├── research.yaml
│       ├── analysis.yaml
│       ├── prototype.yaml
│       ├── documentation.yaml
│       └── community.yaml
└── output/
    ├── research/
    ├── analysis/
    ├── prototypes/
    ├── documentation/
    ├── community/
    └── publications/
```

## Creating New Seeds

To create a new seed:

1. Copy this directory: `cp -r seeds/001-template seeds/XXX-new-seed`
2. Update `seed.yaml` with new name and slug
3. Update `MISSION.md` with the new mission
4. Update `config/bifrost.json` with new virtual keys
5. Update `config/compose.override.yaml` with new paths
6. Create necessary output directories

## License

- **Code**: MIT
- **Documentation**: CC BY 4.0

This is part of the Komatik Cairn charitable AI initiative. All outputs are open-source.
