import type { Editor } from "@tiptap/react";
import { DragHandle } from "@tiptap/extension-drag-handle-react";

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="3.5" r="1.25" />
      <circle cx="9" cy="3.5" r="1.25" />
      <circle cx="5" cy="7" r="1.25" />
      <circle cx="9" cy="7" r="1.25" />
      <circle cx="5" cy="10.5" r="1.25" />
      <circle cx="9" cy="10.5" r="1.25" />
    </svg>
  );
}

export function EditorDragHandle({ editor }: { editor: Editor }) {
  return (
    <DragHandle editor={editor} nested className="editor-drag-handle">
      <button
        type="button"
        aria-label="Drag to reorder block"
        title="Drag to reorder"
        className="flex h-6 w-5 cursor-grab items-center justify-center rounded text-fg-3 transition-colors hover:bg-bg-3 hover:text-fg-4 active:cursor-grabbing"
      >
        <GripIcon />
      </button>
    </DragHandle>
  );
}
