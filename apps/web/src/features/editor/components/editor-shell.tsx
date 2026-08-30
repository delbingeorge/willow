import { useEffect } from "react";
import type * as Y from "yjs";
import type { Extensions } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import { createBlockExtensions } from "@/features/editor/lib/block-extensions";
import { EditorTitleInput } from "@/features/editor/components/editor-title-input";
import { EditorBubbleMenu } from "@/features/editor/components/editor-bubble-menu";
import { EditorDragHandle } from "@/features/editor/components/editor-drag-handle";

export function EditorShell({
  ydoc,
  collabExtensions,
  readOnly = false,
  onPersistTitle,
  notice,
}: {
  ydoc: Y.Doc;
  collabExtensions: Extensions;
  readOnly?: boolean;
  onPersistTitle?: (title: string) => void;
  notice?: string;
}) {
  const editor = useEditor({
    extensions: [...createBlockExtensions(), ...collabExtensions],
  });

  useEffect(() => {
    editor?.setEditable(!readOnly);
  }, [editor, readOnly]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-[860px] px-14 py-14">
        <EditorTitleInput ydoc={ydoc} readOnly={readOnly} onPersist={onPersistTitle} />
        {notice && (
          <p className="mb-4 inline-flex items-center rounded-md bg-surface-active px-2 py-1 text-[12px] text-ink-muted">
            {notice}
          </p>
        )}
        {!readOnly && <EditorBubbleMenu editor={editor} />}
        {!readOnly && <EditorDragHandle editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
