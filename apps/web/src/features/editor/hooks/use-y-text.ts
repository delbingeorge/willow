import { useCallback, useEffect, useState } from "react";
import type * as Y from "yjs";

function applyDiff(ytext: Y.Text, next: string) {
  const current = ytext.toString();
  if (current === next) {
    return;
  }

  let start = 0;
  while (start < current.length && start < next.length && current[start] === next[start]) {
    start++;
  }

  let endCurrent = current.length;
  let endNext = next.length;
  while (
    endCurrent > start &&
    endNext > start &&
    current[endCurrent - 1] === next[endNext - 1]
  ) {
    endCurrent--;
    endNext--;
  }

  ytext.doc?.transact(() => {
    if (endCurrent > start) {
      ytext.delete(start, endCurrent - start);
    }
    if (endNext > start) {
      ytext.insert(start, next.slice(start, endNext));
    }
  });
}

export function useYText(ydoc: Y.Doc, field: string) {
  const [ytext] = useState(() => ydoc.getText(field));
  const [value, setValue] = useState(() => ytext.toString());

  useEffect(() => {
    const handleUpdate = () => setValue(ytext.toString());
    handleUpdate();
    ytext.observe(handleUpdate);
    return () => ytext.unobserve(handleUpdate);
  }, [ytext]);

  const setText = useCallback((next: string) => applyDiff(ytext, next), [ytext]);

  return [value, setText] as const;
}
