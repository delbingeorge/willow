import { useEffect, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { getAuthToken } from "@/shared/lib/auth-token";
import type { DevLoginUser } from "@/features/auth/types";
import { collabColor } from "@/features/editor/lib/collab-color";
import { EditorShell } from "@/features/editor/components/editor-shell";
import { useUpdateDocumentTitle } from "@/features/documents/hooks/use-update-document-title";

const COLLAB_URL = import.meta.env.VITE_COLLAB_URL;

export function CollaborativeEditor({
  documentId,
  user,
}: {
  documentId: string;
  user: DevLoginUser;
}) {
  const updateDocumentTitle = useUpdateDocumentTitle();

  const [ydoc] = useState(() => new Y.Doc());
  const [provider] = useState(
    () =>
      new HocuspocusProvider({
        url: COLLAB_URL,
        name: documentId,
        document: ydoc,
        token: () => getAuthToken() ?? "",
      }),
  );
  const [collabExtensions] = useState(() => [
    Collaboration.configure({ document: ydoc }),
    CollaborationCaret.configure({
      provider,
      user: { name: user.name, color: collabColor(user.id) },
    }),
  ]);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const handleAuthenticated = ({ scope }: { scope: string }) => {
      setIsReadOnly(scope === "readonly");
    };

    provider.on("authenticated", handleAuthenticated);

    return () => {
      provider.off("authenticated", handleAuthenticated);
      provider.destroy();
    };
  }, [provider]);

  return (
    <EditorShell
      ydoc={ydoc}
      collabExtensions={collabExtensions}
      readOnly={isReadOnly}
      notice={isReadOnly ? "Viewing only — you don't have edit access" : undefined}
      onPersistTitle={
        isReadOnly
          ? undefined
          : (title) => updateDocumentTitle.mutate({ id: documentId, title })
      }
    />
  );
}
