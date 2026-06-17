# ReadyBoard — TODO

## Pulse cards

- **Git tap-to-expand**: tapping the Git pulse card should toggle the main content area between the normal dashboard (Recently Touched etc.) and a full git view — changed files list, current-file diff, quick actions (stage/commit/push/discard). Tap the pulse again to dismiss. Not conditional visibility — always available when git is ready. The pulse acts as a tab trigger, not a gate.

- **Smart context layer**: when multiple conditions are active simultaneously (Pomodoro running + note has references), both need to surface. True solution is a "context zone" above the note list that smart cards/sections can claim at whatever scale they need — pulse-sized or full-section. Design work required before implementation.

## Dashboard

- **Dashboard setup experience**: live configuration mode similar to an iPhone/Android home screen. While setting up pulse cards and widgets, the user sees the actual rendered dashboard updating in real time as they toggle options and reorder cards. Drag-to-reorder on the live dashboard itself. Replaces the settings-tab-only configuration flow.

## Note cards

- **Smart mode**: top-level toggle where fields only show when they have relevant content for that specific note (e.g. citekey only shows if the note has a citekey field). Individual field toggles become exclusions rather than opt-ins when smart mode is on.
