import { useEffect, useRef } from "react";
import type * as Y from "yjs";
import { useYText } from "@/features/editor/hooks/use-y-text";

const PERSIST_DELAY_MS = 600;

export function EditorTitleInput({
  ydoc,
  readOnly,
  onPersist,
}: {
  ydoc: Y.Doc;
  readOnly: boolean;
  onPersist?: (title: string) => void;
}) {
  const [title, setTitle] = useYText(ydoc, "title");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  return (
    <input
      value={title}
      readOnly={readOnly}
      onChange={(event) => {
        const next = event.target.value;
        setTitle(next);

        if (!onPersist) {
          return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          onPersist(next.trim() || "Untitled");
        }, PERSIST_DELAY_MS);
      }}
      placeholder="Untitled"
      className="mb-4 w-full border-none bg-transparent text-2xl font-semibold text-ink outline-none placeholder:text-ink-subtle"
    />
  );
}
