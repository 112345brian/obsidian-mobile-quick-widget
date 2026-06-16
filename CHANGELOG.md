# Changelog

## 0.1.14 — 2026-06-16

### Added
- **Custom note filename format** — new "Custom" option with date/time tokens (`YYYY` `YY` `MM` `DD` `HH` `mm` `ss`). Enter any format string e.g. `YYMMDD_HHmmss`. Field only appears when Custom is selected.
- **Keyboard navigation** — `↑`/`↓` moves through note and task rows, `Enter` opens, `←`/`→` switches TOUCHED/MODIFIED tabs, `Esc` closes. Modal auto-focuses on open.

### Fixed
- Settings migration: renamed fields (`parentField` → `breadcrumbField` etc.) now carry over across plugin updates via a RENAMES table in `PluginSettingsManager`.

---

## 0.1.13 — 2026-06-16

### Added
- **Active Cluster graph** — center node is now the active note (not previously-viewed). Neighbors positioned by breadcrumb relation: parents top, children bottom, next/prev on sides, siblings upper arc. Labels wrap up to 3 lines. Hit target is the text bounding box. Wikilink syntax removed. Directional glyphs (↑ ↓ → ←) on labels. Sequence edges get arrowheads.
- **TOUCHED / MODIFIED segmented header** — replaces the old toggle label. Tap either side of the `|` divider to switch lists.
- **Both lists default to 15 items**, independently configurable (`recentListCount`, `modifiedListCount`).
- **Breadcrumb parents in note list** — optional line above each note showing its `up` parent. Uses Breadcrumbs plugin if installed, falls back to frontmatter. Toggle + optional field override in settings.
- **Open Tasks widget** (off by default) — scans vault for unchecked `- [ ]` items, shows up to 10 with source note, tappable to open.
- **Homepage pulse card** — home icon, uniform sizing with other pulse cards. Opens `homePath` or falls back to `homepage:open` command.
- **Handedness setting** — right-handed mode right-aligns section headers, segment tabs, note rows, and graph footer.

### Changed
- Active note excluded from the Active Cluster center (was using previously-viewed note).
- First row highlight ("active file" accent) removed from Recently Touched list.

---

## 0.1.12 — 2026-06-15

### Added
- **Overdrag to new note** — pull down past the top of the dashboard, release to create a new note instantly. Haptic feedback (Android) and burst animation.
- Active note excluded from Recently Touched list.

### Removed
- Capture bar (replaced by overdrag gesture).

---

## 0.1.11 — 2026-06-14

### Fixed
- Scrolling on mobile — mirrored Obsidian's internal flex modal layout (`display:flex; flex-direction:column` on modal, `flex:1; min-height:0; overflow-y:auto` on content).
- iOS purple lip removed (stale `main.css` artifact at project root was being deployed instead of `dist/build/styles.css`).
- Drag handle hidden.

---

## 0.1.10 — 2026-06-14

### Added
- Dashboard modal (bottom sheet) with modular widget system.
- Recently Touched list with tail preview, tags, and backlink count.
- Active Cluster graph (radial SVG).
- Pulse cards: Daily Note, Modified Today, Vault Stats, Trash (conditional).
- Dashboard presets: Focus, Full, Triage.
