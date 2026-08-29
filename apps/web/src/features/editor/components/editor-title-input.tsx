import { useEffect, useRef } from "react";
import type * as Y from "yjs";
import { useYText } from "@/features/editor/hooks/use-y-text";
import { useUpdateDocumentTitle } from "@/features/documents/hooks/use-update-document-title";

const PERSIST_DELAY_MS = 600;

export function EditorTitleInput({
  ydoc,
  documentId,
  readOnly,
}: {
  ydoc: Y.Doc;
  documentId: string;
  readOnly: boolean;
}) {
  const [title, setTitle] = useYText(ydoc, "title");
  const updateDocumentTitle = useUpdateDocumentTitle();
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

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          updateDocumentTitle.mutate({ id: documentId, title: next.trim() || "Untitled" });
        }, PERSIST_DELAY_MS);
      }}
      placeholder="Untitled"
      className="mb-4 w-full border-none bg-transparent text-2xl font-semibold text-fg-4 outline-none placeholder:text-fg-3"
    />
  );
}
