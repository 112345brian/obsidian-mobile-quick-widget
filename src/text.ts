/** Escapes text for safe interpolation into raw SVG/XML markup. */
export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Plain-text tail preview of a note's content (last 3 lines, markdown stripped). */
export function extractTailPreview(raw: string): string {
  const lines = stripMarkdown(raw);
  return lines.slice(-3).join('  ·  ').replace(/\s{2,}/g, ' ').trim().slice(0, 140);
}

/** Formats a past timestamp as a short relative string ("3m ago", "2d ago"),
 * falling back to a short date once it's a week or older. */
export function fromNow(timestamp: number): string {
  const s = Math.floor((Date.now() - timestamp) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const day = Math.floor(h / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

/** Truncates `s` to at most `maxLen` characters, adding an ellipsis if cut. */
export function truncate(s: string, maxLen: number): string {
  return s.length > maxLen ? `${s.slice(0, maxLen - 1)}…` : s;
}

function stripMarkdown(raw: string): string[] {
  const body = raw.startsWith('---') ? raw.replace(/^---[\s\S]*?---\n?/, '') : raw;
  return body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/%%[\s\S]*?%%/g, '')
    .replace(/!\[\[.*?\]\]/g, '')
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '') // Strip # markers but keep heading text
    .replace(/^\s*\|.*\|\s*$/gm, '')
    .replace(/\*{1,3}([^*\n]+)\*{1,3}/g, '$1')
    .replace(/_([^_\n]+)_/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/`[^`\n]*`/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}
