export interface HighlightSegment {
  text: string;
  match: boolean;
}

const HEADLINE_MARK = /<b>([\s\S]*?)<\/b>/g;

export function parseHighlight(snippet: string | null, fallback: string): HighlightSegment[] {
  const source = snippet ?? fallback;
  const segments: HighlightSegment[] = [];
  let cursor = 0;
  let found: RegExpExecArray | null;

  HEADLINE_MARK.lastIndex = 0;

  while ((found = HEADLINE_MARK.exec(source)) !== null) {
    if (found.index > cursor) {
      segments.push({ text: source.slice(cursor, found.index), match: false });
    }
    if (found[1]) {
      segments.push({ text: found[1], match: true });
    }
    cursor = HEADLINE_MARK.lastIndex;
  }

  if (cursor < source.length) {
    segments.push({ text: source.slice(cursor), match: false });
  }

  return segments.length > 0 ? segments : [{ text: source, match: false }];
}
