# Changelog

## 0.2.1 — 2026-06-16

### Fixed
- Command palette entries now register on desktop as well as mobile, so "Open radial menu" and "Open dashboard" are visible when configuring or debugging the plugin.

---

## 0.2.0 — 2026-06-16

### Added
- **New 3-mode radial menu** (replaces the old slice-based pie menu) — Breadcrumbs, Commands, and Recents modes on a single ring, faithfully ported from the design mock. Center-tap cycles modes; mode key dots show/select the current mode.
  - **Breadcrumbs mode**: parent (top, gold ↑), children (bottom, teal ↓), siblings/sequence (sides, rose ← →), with an overflow slot when there are more children than slots. Auto-falls back to Commands mode when there's no active note.
  - **Commands mode**: six fully configurable slots (new **Radial Commands** settings section), reusing the existing Quick Action editor. Icons support either a Lucide icon name or a literal glyph (explicit toggle, not inferred).
  - **Recents mode**: last 6 opened notes, sharing the same recents source as the dashboard.
  - New command: **"Open Radial Menu"** (replaces "Open Quick Menu").
- **Radial ↔ Dashboard hand-off** — swipe down on the radial to open the dashboard; a compass button on the dashboard returns to the radial. Both gated by a new **Connect radial & dashboard** setting (on by default). Stateless: each surface always opens fresh unless **Remember last mode** is explicitly enabled.
- New settings: **Default mode**, **Remember last mode**, **Connect radial & dashboard**, **Radial Commands** (six slots).

### Changed
- Unified the breadcrumb relationship color system across the dashboard graph and the radial menu: gold = parent, teal = child, rose = sibling/sequence. Purple is now exclusively reserved for commands/chrome on both surfaces (previously the dashboard graph used a different blue/purple/green scheme).
- Extracted shared logic into new modules so the dashboard and radial menu behave identically: `src/breadcrumbs.ts` (relation resolver + palette), `src/recents.ts` (recent-files source), `src/quickActions.ts` (action executor), `src/text.ts` (truncation helper).
- The dashboard's `breadcrumbField` setting now also governs the radial's and the graph's parent-relation lookup (previously only the Continue list respected it).

### Removed
- **Breaking:** the old slice-based radial menu (`SliceConfig`, the `slices` setting, the "Slices" settings section, and the "Open Quick Menu" command) has been removed entirely. Existing custom slice configurations are not migrated — reassign your swipe gesture to "Open Radial Menu".

### Fixed
- Settings manager now also cleans up purely-removed keys (like `slices`) from `data.json`, not just renamed ones.
- Radial menu defends against a stale/invalid `radialDefaultMode` value (e.g. from hand-edited settings) instead of crashing on open.
- `executeQuickAction`'s "Append to note" branch now closes the calling modal first, consistent with every other action type.
- Removed a duplicate breadcrumb-relation scan that ran twice per radial render.

---

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
