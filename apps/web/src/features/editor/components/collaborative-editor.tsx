import { useEffect, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEditor, EditorContent } from "@tiptap/react";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { useAuth } from "@/shared/providers/auth-provider";
import { getAuthToken } from "@/shared/lib/auth-token";
import { collabColor } from "@/features/editor/lib/collab-color";
import { createBlockExtensions } from "@/features/editor/lib/block-extensions";
import { EditorTitleInput } from "@/features/editor/components/editor-title-input";
import { EditorBubbleMenu } from "@/features/editor/components/editor-bubble-menu";
import { EditorDragHandle } from "@/features/editor/components/editor-drag-handle";

const COLLAB_URL = import.meta.env.VITE_COLLAB_URL;

export function CollaborativeEditor({ documentId }: { documentId: string }) {
  const { user } = useAuth();
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
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    provider.on("authenticated", ({ scope }: { scope: string }) => {
      setIsReadOnly(scope === "readonly");
    });

    return () => {
      provider.destroy();
    };
  }, [provider]);

  const editor = useEditor({
    extensions: [
      ...createBlockExtensions(),
      Collaboration.configure({ document: ydoc }),
      CollaborationCaret.configure({
        provider,
        user: { name: user.name, color: collabColor(user.id) },
      }),
    ],
  });

  useEffect(() => {
    editor?.setEditable(!isReadOnly);
  }, [editor, isReadOnly]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <EditorTitleInput ydoc={ydoc} documentId={documentId} readOnly={isReadOnly} />
      {isReadOnly && (
        <p className="mb-2 text-xs text-fg-3">Viewing only — you don&apos;t have edit access</p>
      )}
      {!isReadOnly && <EditorBubbleMenu editor={editor} />}
      {!isReadOnly && <EditorDragHandle editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
