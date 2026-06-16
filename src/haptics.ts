/** Fires a short haptic pulse if the platform supports it (no-op on iOS/desktop). */
export function vibrate(durationMs: number): void {
  try {
    (navigator as Navigator & { vibrate?: (d: number) => void }).vibrate?.(durationMs);
  } catch { /* unsupported */ }
}
