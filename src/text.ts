/** Truncates `s` to at most `maxLen` characters, adding an ellipsis if cut. */
export function truncate(s: string, maxLen: number): string {
  return s.length > maxLen ? s.slice(0, maxLen - 1) + '…' : s;
}
