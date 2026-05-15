# ADR 0001: Cairn is the canonical repository name

Date: 2026-05-15

## Status

Accepted

## Context

This repository was initialized from or alongside earlier Yggdrasil-era work. The root README, environment examples, website copy, and some infrastructure comments still refer to Yggdrasil, World Tree, and `komatik-yggdrasil`.

The repository is now configured and used as `KomatikAI/cairn`.

## Decision

Cairn is the canonical name for this repository and all active work in it.

Yggdrasil, World Tree, and `komatik-yggdrasil` are legacy names. They may remain only in archival files, historical retrospectives, or migration notes where the old name is necessary for traceability.

All active documentation, setup instructions, package metadata, environment examples, prompts, and proposal scaffolding should use Cairn.

## Consequences

- Root README and setup instructions must be rewritten around Cairn.
- Environment defaults should point to `KomatikAI/cairn`.
- Legacy website copy under `site/` requires a separate cleanup or archival decision.
- Legacy hierarchy directories such as `roots/`, `categories/`, and `seeds/` require classification as active Cairn infrastructure or archived Yggdrasil infrastructure.
- The archived capability slug `cairn` in `proposals/capabilities.json` must be renamed, removed, or explicitly marked as a historical collision.
