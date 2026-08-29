import { useEffect, useState } from "react";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import Collaboration from "@tiptap/extension-collaboration";
import { EditorShell } from "@/features/editor/components/editor-shell";

export function LocalEditor({ documentId }: { documentId: string }) {
  const [ydoc] = useState(() => new Y.Doc());
  const [persistence] = useState(() => new IndexeddbPersistence(documentId, ydoc));
  const [collabExtensions] = useState(() => [Collaboration.configure({ document: ydoc })]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    persistence.whenSynced.then(() => {
      if (!cancelled) {
        setIsReady(true);
      }
    });

    return () => {
      cancelled = true;
      persistence.destroy();
    };
  }, [persistence]);

  if (!isReady) {
    return null;
  }

  return <EditorShell ydoc={ydoc} collabExtensions={collabExtensions} />;
}
