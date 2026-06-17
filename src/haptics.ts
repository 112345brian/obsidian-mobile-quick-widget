/** Fires a short haptic pulse if the platform supports it (no-op on iOS/desktop). */
export function vibrate(durationMs: number): void {
  try {
    (navigator as { vibrate?: (d: number) => void } & Navigator).vibrate?.(durationMs);
  } catch { /* Unsupported */ }
}
