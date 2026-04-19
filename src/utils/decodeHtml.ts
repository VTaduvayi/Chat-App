/**
 * Decodes HTML entities in API-returned strings.
 * e.g. "It&#39;s" → "It's"
 *
 * Uses the browser's own HTML parser — no library needed,
 * no XSS risk since we never inject into innerHTML.
 */
export function decodeHtml(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}
