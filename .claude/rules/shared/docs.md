---
paths:
  - '**/*.md'
---

<!-- Compressed editing rules, loaded automatically when a Markdown file is edited. -->
<!-- The full reasoning is docs/README.md; keep them in sync. -->

# Docs

Every `.md` is English. The exceptions are `docs/ops/google-play/listing.md` and the quoted store text in `docs/ops/google-play/moderation.md` — submitted to the store verbatim.

Where a thing goes:

- `docs/architecture/` — a design decision, the "why", one topic per file; `pitfalls.md` for what has already bitten us.
- `docs/guides/{client,server,shared}/` — the full style guide, with examples and reasoning.
- `docs/ops/` — deploy, migrations, releases, Google Play.
- `.claude/rules/<area>/<topic>.md` — the compressed digest of a guide, with a `paths:` frontmatter. One topic per file.
- `CLAUDE.md` files — the short map and the rules that bite; they link out rather than repeat.

A new doc gets a line in `docs/README.md`. Links are relative to the file. Third-party docs are never vendored — they come from context7.

The `<!-- BEGIN:nextjs-agent-rules -->` block in `apps/web/CLAUDE.md` and `apps/site/CLAUDE.md` is written by `next dev`; leave it.
