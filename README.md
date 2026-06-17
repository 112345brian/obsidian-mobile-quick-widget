# ReadyBoard

[![GitHub release](https://img.shields.io/github/v/release/112345brian/obsidian-mobile-quick-widget)](https://github.com/112345brian/obsidian-mobile-quick-widget/releases)
[![GitHub downloads](https://img.shields.io/github/downloads/112345brian/obsidian-mobile-quick-widget/total)](https://github.com/112345brian/obsidian-mobile-quick-widget/releases)

A radial menu and dashboard for Obsidian. Assign the radial menu to a swipe gesture, navigate your note's breadcrumbs, run commands, or jump to recent notes with one thumb — or open the dashboard as a persistent sidebar panel instead.

---

## Features

### Radial Menu
Three modes on a single ring, switched by tapping the center node or the mode-key dots at the bottom:

**Breadcrumbs** — navigate your note's hierarchy
- Parent at top (gold ↑), children at bottom (teal ↓), siblings/sequence on the sides (rose ← →)
- Overflow slot when there are more children than fit
- Auto-falls back to Commands mode when there's no active note

**Commands** — six fully configurable action slots
- Defaults: Capture, New note, Search, Backlinks, Graph, Daily
- Reassign any slot to any Quick Action (command, new note, homepage, append-to-note) in settings
- Icons can be a Lucide icon name or a literal glyph

**Recents** — last 6 opened notes, one tap to jump

**Connecting to the Dashboard**
- Swipe down on the radial to open the Dashboard
- The Dashboard's Radial Launcher expands into the radial section you choose
- Both surfaces are stateless by default — each always opens fresh unless you enable "Remember last mode"

### Dashboard
An opaque bottom-sheet modal with modular widgets:

**Radial Launcher**
- Compact center button for the radial menu inside the dashboard
- Touch/pen press-hold expands into your preferred radial section: Breadcrumbs, Commands, or Recents
- Release over a slot to select it; release anywhere else to collapse back to the compact button
- Mouse/keyboard activation opens a stable expanded desktop view for testing or inspection
- Empty breadcrumb positions are hidden; only real actionable slots are drawn
- New installs use this in the Full preset instead of the persistent Active Cluster graph

**Recently Touched / Modified**
- Segmented `TOUCHED | MODIFIED` header — tap either side to switch
- Shows breadcrumb parent above each note (reads `up` frontmatter or Breadcrumbs plugin)
- Configurable list length (default 15 each)
- Keyboard navigable: `↑↓` rows, `←→` tabs, `Enter` open, `Esc` close

**Active Cluster graph**
- Center node is the note you currently have open
- Neighbors positioned by breadcrumb relation: parents top, children bottom, next/prev on sides, siblings upper arc
- Labels wrap up to 3 lines; tap anywhere on the label to open
- Directional glyphs (↑ ↓ → ←) indicate relation type
- Tap graph to expand; tap FULL GRAPH → to open Obsidian graph view

**Open Tasks** *(widget, off by default)*
- Scans vault for unchecked `- [ ]` items, shows up to 10 with source note
- Tappable to jump to the note

**Pulse cards** *(3-column grid of stat cards, with the Radial Launcher anchored at center)*
- Daily note — jump to today
- Modified today — count of files changed today
- Vault stats — note and link counts
- Streak — consecutive days with at least one file modified
- Git status *(conditional)* — changed file count; tap to commit-and-sync or open git menu. Appears only when Obsidian Git is ready.
- Inbox *(conditional)* — count of files in a configured folder. Appears only when count > 0.
- Pomodoro *(conditional, reactive)* — live countdown + mode. Appears while a session is active or recently used.
- References *(conditional)* — citekey count for the active note. Appears only when citekeys are detected and opens Bripey Citation Suite's reference list.
- Homepage — opens your configured home note
- Quick action — runs any configured action

Pulse cards have separate desktop and mobile visibility modes. Desktop defaults to `Contextual`; mobile defaults to `Always`. Contextual mode hides passive cards; trash/inbox/references show only with current items, Git shows only with conflicts, and Pomodoro shows only while active or recently used.

Each card has a column-span setting (1, 2, or 3 columns). Span-wide cards that would collide with the radial slot are pushed to the next row.

**Overdrag to new note**
- Pull down past the top of the dashboard scroll, release to instantly create a new note
- Haptic feedback on Android

**Pomodoro Timer** *(widget, off by default — appears only if [Pomodoro Timer](https://github.com/eatgrass/obsidian-pomodoro-timer) is installed)*
- Live countdown, current mode (Focus/Break), tap to start/pause

---

## Extending ReadyBoard

Every dashboard widget — including all the built-in ones above — is registered through the same public API, so adding your own is the same amount of work as ReadyBoard's own widgets. No fork, no PR, no special-casing.

From your own plugin:

```ts
const readyBoard = app.plugins.plugins['readyboard'] as
  | { api?: {
      registerWidget(def: unknown): () => void;
      openDashboardSidebar(state?: unknown): void;
    } }
  | undefined;

const unregister = readyBoard?.api?.registerWidget({
  id: 'my-plugin-streaks',      // namespace it so it can't collide with another plugin's widget
  label: 'Writing Streak',       // shown as the toggle label in ReadyBoard's settings
  render: (root, ctx) => {
    root.createEl('div', { text: `${myStreak()} day streak` });
  },
});

// in your plugin's onunload:
unregister?.();
```

Once registered, your widget shows up as a disabled-by-default toggle in ReadyBoard's dashboard settings — the user opts in exactly like a built-in. If ReadyBoard isn't installed, `app.plugins.plugins['readyboard']` is `undefined` and the optional chaining above just no-ops.

You can also open the sidebar dashboard with temporary view-state parameters:

```ts
readyBoard?.api?.openDashboardSidebar({
  recentListCount: 6,
  modifiedListCount: 6,
  pulseCardDesktopDisplayMode: 'contextual',
  pulseCardMobileDisplayMode: 'always',
  radialMode: 'recents',
  widgets: [
    { type: 'radial', enabled: true },
    { type: 'continue', enabled: true },
  ],
});
```

**The context object (`ctx`) your `render` function receives:**

| Field | Type | What it's for |
|---|---|---|
| `app` | `App` | The usual Obsidian API surface |
| `settings` | `ReadonlyDeep<PluginSettings>` | ReadyBoard's own settings, read-only |
| `surface` | `'modal' \| 'sidebar'` | Which dashboard surface is rendering the widget |
| `getPlugin(id)` | `<T>(id: string) => T \| undefined` | Look up another installed plugin's instance by manifest id (e.g. integrating with a sibling plugin the way `src/widgets/git.ts`/`pomodoro.ts` do) — returns `undefined` if it's not installed/enabled. You're still responsible for checking the shape of what comes back before calling into it. |
| `close()` | `() => void` | Dismiss the dashboard (closes the modal, or collapses the sidebar) |
| `openFile(file)` | `(file: TFile) => void` | Closes the dashboard, then opens `file` — the common "tap a note" pattern |
| `vibrate(ms)` | `(durationMs: number) => void` | Short haptic pulse, no-op where unsupported |
| `editSettings(mutate)` | `(mutate: (settings) => void) => Promise<void>` | Persist your own bit of state (a selected filter, a last-used mode) the same way ReadyBoard's built-ins do |
| `onCleanup(fn)` | `(fn: () => void) => void` | Register a teardown — needed if your widget subscribes to another plugin's live store, otherwise a Modal-hosted dashboard leaks a new subscription on every open |

`render` can be `async` (e.g. to read a file before showing anything), and is called fresh every time the dashboard renders — do your own DOM cleanup the same way the rest of the dashboard does, since `root` is discarded on the next render/close.

**If your widget shows something that changes on its own** (a countdown, another plugin's live state), prefer subscribing directly to that plugin's own reactive API if it has one (e.g. a Svelte store) rather than duplicating its timing logic. The sidebar surface stays "warm" between ordinary opens and collapsing it is purely visual — it doesn't tear down your view, so a plain subscribe-and-redraw stays accurate the whole time the dashboard is hidden. It can still re-render when settings or sidebar view-state parameters change. Tear subscriptions down via `onCleanup`. Only reach for your own `setInterval` loop if the source plugin has no push-based way to observe changes. ReadyBoard's own Pomodoro widget (`src/widgets/pomodoro.ts`) is a working example: it subscribes to the Pomodoro Timer plugin's own store directly, with no extra polling.

Your widget's source files live wherever you like — there's no folder-scanning step. ReadyBoard's own built-ins follow a one-file-per-widget layout (`src/widgets/*.ts`, each exporting a single definition object) purely as a convention; nothing about the API requires it.

---

## Settings

### New note
| Setting | Description |
|---|---|
| New note folder | Folder to create notes in (blank = vault root) |
| New note template | Path to a template file (Templater supported) |
| Filename format | Untitled + date, Zettelkasten (YYYYMMDDHHmmss), or Custom |
| Custom format | Token-based: `YYYY` `YY` `MM` `DD` `HH` `mm` `ss` — e.g. `YYMMDD_HHmmss` |

### Dashboard
| Setting | Description |
|---|---|
| Handedness | Right-handed mode right-aligns headers and controls |
| Separate sidebar settings | Lets the regular modal dashboard and sidebar dashboard use different widget lists, counts, note-card display settings, pulse cards, and dashboard radial launcher settings |
| Recently touched count | How many files in the Touched list (default 15) |
| Recently modified count | How many files in the Modified list (default 15) |
| Show breadcrumbs | Show parent note above each item in the list |
| Breadcrumb field override | Custom frontmatter field for parent (default: `up`) |
| Show tags / backlinks / preview | Controls what each note row shows |
| Extra frontmatter fields | Fields to surface per-note when present (e.g. `status`, `type`) |
| Modified date field | Frontmatter field for modified date (default: file mtime) |
| Continue — excluded paths | Files/folders to hide from the Touched list |

### Pulse Cards
| Setting | Description |
|---|---|
| Per-card column span | 1, 2, or 3 columns in the pulse grid |
| Separate sidebar settings | When enabled, pulse cards are edited separately for regular and sidebar dashboards |
| Inbox folder path | Folder to count for the Inbox pulse card |
| Git card tap action | Commit-and-sync (default) or open git command menu |

### Radial Menu
| Setting | Description |
|---|---|
| Default mode | Which mode the radial opens in (default: Breadcrumbs) |
| Dashboard radial section | Which radial section the dashboard launcher expands into |
| Dashboard radial interaction | Press-and-hold or tap-to-toggle for the dashboard launcher; split per surface when separate sidebar settings are enabled |
| Remember last mode | Reopen in whatever mode you last used, instead of the default |
| Connect radial & dashboard | Enables the swipe-to-dashboard gesture |
| Radial Commands | Six configurable slots for Commands mode (label, icon, icon type, action) |

---

## Installation

Not yet in the Community Plugins directory.

### Via BRAT (recommended)

1. Install [BRAT](https://obsidian.md/plugins?id=obsidian42-brat)
2. Click [Install via BRAT](https://intradeus.github.io/http-protocol-redirector?r=obsidian://brat?plugin=https://github.com/112345brian/obsidian-mobile-quick-widget)
3. Click **Add plugin** and wait a few seconds

### Manual

Download `main.js`, `styles.css`, and `manifest.json` from the [latest release](https://github.com/112345brian/obsidian-mobile-quick-widget/releases/latest) and place them in `.obsidian/plugins/readyboard/`.

---

## Optional integrations

The plugin gracefully degrades when these aren't installed:

- **Breadcrumbs** — powers the graph relation layout and breadcrumb parent display
- **Bread-trail** — same; reads `up`/`down`/`next`/`prev` frontmatter edges
- **Continue** — supplies the Touched list with richer navigation history
- **Templater** — processes template syntax after new note creation
- **Homepage** — fallback for the Homepage pulse card
- **Pomodoro Timer** — powers the Pomodoro pulse card (live countdown, only surfaces when a session is active)
- **Obsidian Git** — powers the Git Status pulse card (change count, tap to commit-and-sync or open git menu)

---

## Debugging

```js
window.DEBUG.enable('readyboard');
```

---

## License

© [bri](https://github.com/112345brian/)
