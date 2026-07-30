# Changelog fragments

This directory holds one file per user-facing change, compiled into
`CHANGELOG.md` by [towncrier](https://towncrier.readthedocs.io/) at release
time (`towncrier build --version X.Y.Z`).

## Naming a fragment

```
changelog.d/<name>.<type>.md
```

- `<name>` is normally the issue/PR number (e.g. `42.fix.md`). If there's no
  issue to reference, use an orphan name prefixed with `+`, e.g.
  `+short-description.fix.md`.
- `<type>` is one of:
  - `feature` — a new capability
  - `change` — a change to existing behavior
  - `fix` — a bug fix
  - `removed` — a removed capability

## Content

Each fragment is a single line (or short paragraph) of **user-facing**
prose, written as you'd want it to read in the changelog — no issue links or
internal jargon needed, towncrier adds those. For example:

```markdown
Migrated settings UI to Obsidian's new declarative settings API (requires Obsidian 1.13.0+).
```

Run `towncrier build --version X.Y.Z` to compile all fragments in this
directory into `CHANGELOG.md` and delete them.
