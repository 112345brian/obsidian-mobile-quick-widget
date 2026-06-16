# Mobile Quick Widget

[![GitHub release](https://img.shields.io/github/v/release/112345brian/obsidian-mobile-quick-widget)](https://github.com/112345brian/obsidian-mobile-quick-widget/releases)
[![GitHub downloads](https://img.shields.io/github/downloads/112345brian/obsidian-mobile-quick-widget/total)](https://github.com/112345brian/obsidian-mobile-quick-widget/releases)

A radial pie menu and dashboard for Obsidian mobile. Assign it to a swipe gesture and tap a slice to run a command, create a note, or open the dashboard.

---

## Features

### Radial Menu
- Configurable slices — assign any Obsidian command, new note, homepage, or append-to-note
- Smooth open/close animation

### Dashboard
A bottom-sheet modal with modular widgets:

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

**Pulse cards** *(configurable row of stat cards)*
- Daily note — jump to today
- Modified today — count of files changed today
- Vault stats — note and link counts
- Homepage — opens your configured home note
- Quick action — runs any configured action

**Overdrag to new note**
- Pull down past the top of the dashboard scroll, release to instantly create a new note
- Haptic feedback on Android

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
| Recently touched count | How many files in the Touched list (default 15) |
| Recently modified count | How many files in the Modified list (default 15) |
| Show breadcrumbs | Show parent note above each item in the list |
| Breadcrumb field override | Custom frontmatter field for parent (default: `up`) |
| Modified date field | Frontmatter field for modified date (default: file mtime) |
| Continue — excluded paths | Files/folders to hide from the Touched list |

---

## Installation

Not yet in the Community Plugins directory.

### Via BRAT (recommended)

1. Install [BRAT](https://obsidian.md/plugins?id=obsidian42-brat)
2. Click [Install via BRAT](https://intradeus.github.io/http-protocol-redirector?r=obsidian://brat?plugin=https://github.com/112345brian/obsidian-mobile-quick-widget)
3. Click **Add plugin** and wait a few seconds

### Manual

Download `main.js`, `styles.css`, and `manifest.json` from the [latest release](https://github.com/112345brian/obsidian-mobile-quick-widget/releases/latest) and place them in `.obsidian/plugins/mobile-quick-widget/`.

---

## Optional integrations

The plugin gracefully degrades when these aren't installed:

- **Breadcrumbs** — powers the graph relation layout and breadcrumb parent display
- **Bread-trail** — same; reads `up`/`down`/`next`/`prev` frontmatter edges
- **Continue** — supplies the Touched list with richer navigation history
- **Templater** — processes template syntax after new note creation
- **Homepage** — fallback for the Homepage pulse card

---

## Debugging

```js
window.DEBUG.enable('mobile-quick-widget');
```

---

## License

© [bri](https://github.com/112345brian/)
