import type { App } from 'obsidian';

/**
 * Looks up another installed plugin's instance by its manifest id (the
 * single place this codebase reaches into Obsidian's internal plugin
 * registry — `app.plugins` isn't part of the public API surface, so every
 * call site needs the same unsafe cast; this is the one place it's written).
 * Returns undefined if the plugin isn't installed/enabled.
 */
export function getExternalPlugin<T>(app: App, id: string): T | undefined {
  return (app as unknown as { plugins: { plugins: Record<string, unknown> } })
    .plugins?.plugins?.[id] as T | undefined;
}
