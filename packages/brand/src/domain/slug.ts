const COMBINING_MARKS = /[̀-ͯ]/g;
const NON_ALPHANUMERIC = /[^a-z0-9]+/g;
const EDGE_HYPHENS = /^-+|-+$/g;

/** Derive a URL-safe slug from a human-readable value. */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim()
    .replace(NON_ALPHANUMERIC, "-")
    .replace(EDGE_HYPHENS, "");
}

/**
 * Return `base` if it is free, otherwise the first `base-N` (N >= 2) that is
 * not already taken.
 */
export function uniqueSlug(base: string, taken: ReadonlySet<string>): string {
  if (!taken.has(base)) {
    return base;
  }
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`;
}
