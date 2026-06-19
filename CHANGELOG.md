# Changelog

## 0.3.11 — 2026-06-18

### Fixed
- Sidebar git pulse card now force-refreshes after Obsidian Git sync/push/commit events so the count updates immediately instead of waiting for the next poll cycle.
- Eliminated an event feedback loop where `obsidian-git:refresh` and `obsidian-git:head-change` were triggering recursive `updateCachedStatus()` calls from the sidebar, causing the Obsidian Git status bar icon to spin continuously.
- Release workflow tag glob corrected (`[0-9]*` instead of `[0-9]+`) so the workflow now actually fires on semver tags; lint and build run before the release check to prevent stranding a public tag on a broken build.
- Radial launcher geometry constants and `renderSlotIcon` are now shared with the settings preview, eliminating a source of drift between the preview and the live radial.
- Date header in dashboard "TODAY" section no longer renders when all contextual cards are hidden.
- Overdrag touch listeners are now properly cleaned up on re-render to prevent listener accumulation.

## 0.3.10 — 2026-06-18

### Fixed
- Git pulse cards now refresh from Obsidian Git events without recursively forcing sidebar refreshes, and contextual mode treats conflicts or local changed/staged files as relevant.
- Quick-action glyph icons now render as literal glyphs in pulse cards, dashboard action buttons, and radial command slots instead of being sent through Lucide icon lookup.

## 0.3.9 — 2026-06-18

### Fixed
- New-note creation now resolves Obsidian Unique Note settings as a fallback when ReadyBoard's own folder/template fields are blank.
- Configured template files now run through Templater's create-new-note API when Templater is installed, so user scripts and `tp.file.*` context execute against the created note instead of copied template text.
- Core Obsidian template placeholders such as `{{date:YYYY-MM-DDTHH:mm:ss}}`, `{{time}}`, and `{{title}}` are expanded after template insertion.

## 0.3.8 — 2026-06-17

### Fixed
- Text fields in ReadyBoard settings now save on blur or Enter instead of on every keystroke, preventing Obsidian Settings search from stealing focus while typing.

## 0.3.7 — 2026-06-17

### Changed
- ReadyBoard now prefers the public `obsidian-continue` API for recent-note history instead of reading `openedLog` directly, with a compatibility fallback for older Continue installs.
- The References pulse card now prefers Bripey Citation Suite's public API for citekey detection and reference-panel focus, with a command/parser fallback for older Citation Suite installs.

## 0.3.6 — 2026-06-17

### Added
- Pulse cards now support separate desktop and mobile visibility modes. Desktop defaults to contextual; mobile defaults to always visible. In contextual mode, passive cards stay hidden unless they have current work to report.
- Added a References pulse card that appears only when the active note contains citekeys and opens Bripey Citation Suite's reference list.

### Changed
- Git pulse cards only surface in contextual mode when conflicts or local changed/staged files are present.
- Pomodoro pulse cards now remain relevant while active or for an hour after a visible timer session was used.

## 0.3.5 — 2026-06-17

### Added
- Sidebar dashboards can now be opened with view-state parameters through `api.openDashboardSidebar(state)`. Supported overrides include widget list, pulse cards, touched/modified counts, radial launcher mode/interaction, and note-card display settings.
- Separate sidebar settings now cover the whole dashboard surface: widgets, list counts, pulse cards, note-card display, and dashboard radial launcher preferences.

### Fixed
- Settings changes now persist through the settings manager's real mutable settings object instead of mutating the read-only safe settings copy.
- Open sidebar dashboards refresh when settings are saved, external settings are reloaded, or a new sidebar view state is applied.
- Empty sidebar widget configuration now means "show no sidebar widgets" instead of silently falling back to the regular dashboard's widgets.

## 0.3.2 — 2026-06-16

### Added
- **3-column pulse grid** — pulse cards now live in a 3-column CSS grid. The Radial Launcher is embedded as a fixed anchor at column 2, row 2 (so expansion is always vertically centered). Cards flank it left and right; when the radial expands it takes the full row and flanking cards fade out, then return when it collapses.
- **Pulse card column span** — each pulse card can be set to 1, 2, or 3 columns wide. Span-2/3 cards that would collide with the radial slot are pushed to the next row automatically.
- **Streak pulse card** — consecutive days with at least one file modified. Shows count + "days" sub-label.
- **Inbox pulse card** (conditional) — count of markdown files inside a configurable folder path. Only appears when count > 0. Configure path in Settings → Pulse Cards → Inbox folder path.
- **Pomodoro pulse card** (conditional, reactive) — shows live countdown and mode (focus/break) when a Pomodoro session is actively running. Disappears when idle. Subscribes to the Pomodoro Timer plugin's own store; no polling.
- **Note Card settings section** — controls what each note row shows: breadcrumb parent, tags, backlink count, preview text, and extra frontmatter fields to surface per-note.
- Backlink count moved inline with the date on the note title row (was its own line). Toggled by the new "Show backlink count" setting.

### Changed
- **Git Status moved from dashboard widget to conditional pulse card** — removed the `git.ts` widget; git status now lives in the pulse grid where it belongs. Tap to commit-and-sync (default) or show a git command menu (configurable).
- `cardShowTags` now defaults to `false`.

## 0.3.1 — 2026-06-16

### Fixed
- Dashboard Radial Launcher now draws only real actionable slots, instead of rendering empty ghost controls and a misleading full ring when the active note has only one breadcrumb relation.
- Desktop mouse and keyboard activation now opens the dashboard radial as a stable expanded view for inspection/use, while touch/pen press-hold still preserves release-to-select and release-elsewhere-to-collapse behavior.
- Fixed the expanded radial center being pushed out of alignment by Obsidian button reset CSS; the center now stays centered under the active slot guide.

## 0.3.0 — 2026-06-16

### Breaking
- **Renamed the plugin to ReadyBoard** (id: `mobile-quick-widget` → `readyboard`). Since the plugin ID changed, Obsidian treats this as a different plugin: it now lives in `.obsidian/plugins/readyboard/` instead of `.obsidian/plugins/mobile-quick-widget/`, and command IDs are now prefixed `readyboard:...`. Existing gesture/hotkey bindings to the old command IDs need to be reassigned. Settings (`data.json`) carry over unchanged since the settings shape itself didn't change — only the folder it lives in.

### Added
- **Public widget API** — any plugin can register its own dashboard widget via `app.plugins.plugins['readyboard'].api.registerWidget(...)`. Every built-in widget (Recently Touched, Active Cluster graph, Radial Launcher, Open Tasks, More Actions, Pomodoro) is now registered through this exact same mechanism — there is no separate "built-in" code path, so the API is necessarily as capable as ReadyBoard's own widgets. See the README's "Extending ReadyBoard" section.
- Each built-in widget now lives in its own file under `src/widgets/`, one definition per file, aggregated by `src/widgets/index.ts` — a deliberate architectural choice so adding a widget (built-in or third-party) never means touching a large shared file.
- **Pomodoro widget** (off by default) — shows up only if [Pomodoro Timer](https://github.com/eatgrass/obsidian-pomodoro-timer) is installed. Live countdown, current mode, tap to start/pause. Subscribes directly to that plugin's own reactive store rather than polling, so it stays accurate whether you're looking at the modal or revealing the sidebar after it's been collapsed for a while.
- **Git Status widget** (off by default) — shows up only if [Obsidian Git](https://github.com/Vinzent03/obsidian-git) is installed. Current branch, changed/staged file count, conflict warning, tap to commit-and-sync. Listens for that plugin's own `obsidian-git:status-changed` workspace event instead of polling.
- **Dashboard as a sidebar** — new "Open dashboard in sidebar" command, independent of the existing "Open dashboard" (modal) command. The sidebar view stays warm between opens (collapses rather than destroying the leaf), so widget state — which TOUCHED/MODIFIED tab was active, which radial mode was last cycled to — persists across reveals instead of rebuilding from zero every time. New setting: **Dashboard sidebar side** (left/right).
- Dashboard **Radial Launcher** widget: a compact radial center button that expands into the preferred radial section while pressed; releasing without selecting collapses it back down.

### Fixed
- Removed the redundant dashboard header compass button now that the dashboard has the Radial Launcher widget as its radial entry point.
- Existing dashboard configs that had **Active Cluster graph** enabled now migrate to the **Radial Launcher** widget, with the old graph left disabled. This keeps upgraded installs aligned with the new default dashboard layout instead of preserving the stale graph-heavy view.
- Dashboard modal styling now forces an opaque dark background on the modal shell, content root, and backdrop so note text no longer bleeds through under transparent Obsidian/theme modal styles.
- The dashboard's "Needs Review" widget toggle was dead — `trash` was never a real dashboard widget (only a Pulse Card), so enabling it did nothing. Removed it from presets; the working Pulse Card version is unaffected.
- The breadcrumb radial's overflow slot (shown when a note has more children than fit) used to redirect to the *other* radial surface — the dashboard's embedded launcher opened the full-screen radial menu, and the full-screen menu's own overflow slot opened the dashboard right back. For a note with more than 2 children, tapping overflow on either surface bounced forever without ever showing the extra children. It now opens a simple menu listing the overflowed children directly, on both surfaces.
- Keyboard arrow-key navigation in the dashboard sidebar went dead after the sidebar was collapsed and revealed again, since focus was only ever applied once (on the sidebar's first render) and revealing an already-open sidebar leaf doesn't re-run that setup. Revealing the sidebar now re-applies focus every time.
- Sidebar/Modal widgets that integrate with another installed plugin (Pomodoro Timer, Obsidian Git) now go through a single shared `ctx.getPlugin(id)` lookup instead of each hand-rolling the same unsafe cast into Obsidian's internal plugin registry — also now part of the public widget API, so third-party widgets get the same helper.

---

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
- **Radial ↔ Dashboard hand-off** — swipe down on the radial to open the dashboard, with dashboard-side radial access handled by the Radial Launcher widget. Both are gated by **Connect radial & dashboard** (on by default). Stateless: each surface always opens fresh unless **Remember last mode** is explicitly enabled.
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
