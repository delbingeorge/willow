import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { getAuthToken } from "@/shared/lib/auth-token";
import type { DevLoginUser } from "@/features/auth/types";
import { collabColor } from "@/features/editor/lib/collab-color";
import { EditorShell } from "@/features/editor/components/editor-shell";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { useOnlineUsers } from "@/features/editor/hooks/use-online-users";
import { ShareDialog } from "@/features/sharing/components/share-dialog";
import { useDocument } from "@/features/documents/hooks/use-document";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";
import { useUpdateDocumentTitle } from "@/features/documents/hooks/use-update-document-title";
import { VersionPanel } from "@/features/versions/components/version-panel";
import { VersionPreview } from "@/features/versions/components/version-preview";
import type { SelectedVersion } from "@/features/versions/types";

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
  const onlineUsers = useOnlineUsers(provider);
  const [shareOpen, setShareOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [previewVersion, setPreviewVersion] = useState<SelectedVersion | null>(null);
  const { data: documentMeta } = useDocument(documentId);

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
    <>
      <ShareDialog
        documentId={documentId}
        title={documentMeta?.title ?? ""}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
      <VersionPreview
        documentId={documentId}
        version={previewVersion}
        onClose={() => setPreviewVersion(null)}
      />

      <div className="flex min-h-0 flex-1">
        <EditorShell
          ydoc={ydoc}
          collabExtensions={collabExtensions}
          readOnly={isReadOnly}
          header={
            <EditorHeader
              documentId={documentId}
              users={onlineUsers}
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => setHistoryOpen((value) => !value)}
                    aria-pressed={historyOpen}
                    className={buttonVariants({
                      variant: "secondary",
                      className: cn("h-7 px-2.5", historyOpen && "bg-surface-active"),
                    })}
                  >
                    History
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareOpen(true)}
                    className={buttonVariants({ variant: "secondary", className: "h-7 px-2.5" })}
                  >
                    Share
                  </button>
                </>
              }
            />
          }
          notice={isReadOnly ? "Viewing only — you don't have edit access" : undefined}
          onPersistTitle={
            isReadOnly
              ? undefined
              : (title) => updateDocumentTitle.mutate({ id: documentId, title })
          }
        />

        <AnimatePresence initial={false}>
          {historyOpen && (
            <VersionPanel
              documentId={documentId}
              selectedId={previewVersion?.id ?? null}
              onSelect={setPreviewVersion}
              onClose={() => setHistoryOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
