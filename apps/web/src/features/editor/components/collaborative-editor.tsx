import { useEffect, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { useAuth } from "@/shared/providers/auth-provider";
import { getAuthToken } from "@/shared/lib/auth-token";
import { collabColor } from "@/features/editor/lib/collab-color";

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

  useEffect(() => {
    return () => {
      provider.destroy();
    };
  }, [provider]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ undoRedo: false }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCaret.configure({
        provider,
        user: { name: user.name, color: collabColor(user.id) },
      }),
    ],
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} className="flex-1 overflow-y-auto" />;
}
