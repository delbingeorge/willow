import type { DocumentListItem } from "@/features/documents/types";
import { collectDescendantIds } from "@/features/documents/lib/scoped-documents";

export type DropZone = "above" | "below" | "inside";

export interface MoveInstruction {
  id: string;
  parentId: string | null;
  position: number;
}

export function canDrop(
  documents: DocumentListItem[],
  draggedId: string,
  targetId: string,
): boolean {
  if (draggedId === targetId) {
    return false;
  }
  return !collectDescendantIds(documents, draggedId).includes(targetId);
}

export function planMove({
  documents,
  draggedId,
  targetId,
  zone,
}: {
  documents: DocumentListItem[];
  draggedId: string;
  targetId: string;
  zone: DropZone;
}): MoveInstruction[] {
  if (!canDrop(documents, draggedId, targetId)) {
    return [];
  }

  const byId = new Map(documents.map((document) => [document.id, document]));
  const dragged = byId.get(draggedId);
  const target = byId.get(targetId);

  if (!dragged || !target) {
    return [];
  }

  const parentId = zone === "inside" ? targetId : target.parentId;

  const siblings = documents
    .filter((document) => document.parentId === parentId && document.id !== draggedId)
    .sort((a, b) => a.position - b.position);

  let index = siblings.length;

  if (zone !== "inside") {
    const targetIndex = siblings.findIndex((document) => document.id === targetId);
    if (targetIndex !== -1) {
      index = zone === "above" ? targetIndex : targetIndex + 1;
    }
  }

  const ordered = [...siblings.slice(0, index), dragged, ...siblings.slice(index)];

  return ordered
    .map((document, position) => ({ id: document.id, parentId, position }))
    .filter((instruction) => {
      const current = byId.get(instruction.id);
      return (
        current?.parentId !== instruction.parentId || current.position !== instruction.position
      );
    });
}
