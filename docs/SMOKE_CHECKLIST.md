# ReadyBoard Smoke Checklist

Run this before merging or releasing changes that touch dashboard, radial, note creation, or plugin packaging.

## Build And Install

- `npm run lint`
- `npm run build`
- `npm run install:local`
- Confirm Obsidian has `readyboard` enabled, not the old `mobile-quick-widget` plugin id.
- Confirm Settings > Community plugins shows ReadyBoard at the expected version.

## Command Palette

- Search `ReadyBoard`.
- Confirm these commands appear:
  - `Open radial menu`
  - `Open dashboard`
  - `Open dashboard in sidebar`
- Run each command once.

## Dashboard

- Open the modal dashboard.
- Open the sidebar dashboard.
- Confirm both surfaces have an opaque background and text is readable over the current note.
- Confirm `TOUCHED | MODIFIED` tabs switch and note rows open files.
- If separate sidebar settings are enabled, change a sidebar-only count or pulse setting and confirm it does not change the modal dashboard.

## Radial

- Open the radial menu.
- Tap the center to cycle Breadcrumbs, Commands, and Recents.
- Confirm command slot glyphs render as glyphs, not Lucide icon names.
- In the dashboard radial launcher, press-hold and release away from a slot; confirm it collapses.
- Press-hold and release over a slot; confirm it runs the slot action.

## Pulse Cards

- With desktop contextual pulse mode enabled, confirm passive cards are hidden.
- Pomodoro appears only while active or recently used.
- References appears only when the active note contains citekeys.
- Git appears when Obsidian Git has conflicts or local changed/staged files.
- Trigger an Obsidian Git refresh and confirm the sidebar Git pulse updates without flickering or repeatedly refreshing.

## Note Creation

- Create a new note from ReadyBoard.
- Confirm Unique Note folder/name fallback works when ReadyBoard note settings are blank.
- Confirm Templater syntax executes, including `tp.date.*` and file-specific template logic.
- Confirm core Obsidian `{{date}}`, `{{time}}`, and `{{title}}` placeholders expand.

## Release

- `npm run release:check` passes on the tagged commit.
- GitHub release assets include:
  - `main.js`
  - `manifest.json`
  - `styles.css`
