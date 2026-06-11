# Seed 001 Template — Mission Statement

**Seed Name:** Template  
**Category:** General Purpose  
**Status:** Template  
**Created:** 2026-05-28

## Mission

This is a template Seedling for the Komatik Cairn charitable AI initiative. It provides a fully containerized, self-contained OpenClaw agent collective that can be instantiated for any charitable cause.

## Purpose

The Seedling base image serves as:

1. **Template for new seeds** — Copy this structure to create new seed instances (e.g., 002-homelessness-la, 003-education, etc.)
2. **Reference implementation** — Demonstrates the complete architecture for containerized agent collectives
3. **Development sandbox** — Test new agent roles, workflows, and integrations before deploying to production seeds

## Core Principles

- **Open source** — All code and outputs are publicly available
- **Budget constrained** — LLM spend is metered and capped via Bifrost virtual keys
- **Mission-aligned** — All outputs must pass the Mission Guardian's alignment check
- **Transparent** — Token usage is tracked in TOKENS.md and published to GitHub

## Agent Roles

This Seedling includes six specialized agent roles:

1. **Mission Guardian** — Ensures alignment with seed mission, approves publications
2. **Research Agent** — Discovers literature, datasets, and open-source resources
3. **Analysis Agent** — Performs modeling, simulation, and impact quantification
4. **Prototype Agent** — Develops code, designs, and proof-of-concepts
5. **Documentation Agent** — Creates public-facing outputs and FINDINGS.md
6. **Community Agent** — Triages external contributions and reviews PRs

## Technical Architecture

- **OpenClaw Gateway** — Session lifecycle, workflow engine, RBAC
- **PostgreSQL 16** — Agent state and memory storage
- **Bifrost** — LLM proxy with virtual keys and budget metering
- **Scheduler** — Cycle loop manager (replaces OS-level cron)
- **Publisher** — Git output pipeline + TOKENS.md generator

## Usage

See `README.md` for detailed setup and usage instructions.

## License

- **Code**: MIT
- **Documentation**: CC BY 4.0

---

*This is a template. Replace this content with seed-specific mission statements when instantiating new seeds.*
