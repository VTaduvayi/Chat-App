/**
 * Decodes HTML entities in API-returned strings.
 * e.g. "It&#39;s" → "It's"
 *
 */
export function decodeHtml(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}
