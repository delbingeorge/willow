import { useState } from "react";
import { useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import type { DocumentTreeNode } from "@/features/documents/lib/scoped-documents";
import { DocumentTreeRow } from "@/features/documents/components/document-tree-row";
import { useCreateDocument } from "@/features/documents/hooks/use-create-document";
import { useDocumentTree } from "@/features/documents/hooks/use-document-tree";
import { useMoveDocument } from "@/features/documents/hooks/use-move-document";
import { canDrop, planMove, type DropZone } from "@/features/documents/lib/tree-move";
import { collapse, transitions } from "@/shared/lib/motion";

interface DropTarget {
  id: string;
  zone: DropZone;
}

function findAncestors(nodes: DocumentTreeNode[], targetId: string): string[] | null {
  for (const node of nodes) {
    if (node.id === targetId) {
      return [];
    }
    const inside = findAncestors(node.children, targetId);
    if (inside) {
      return [node.id, ...inside];
    }
  }
  return null;
}

export function DocumentTree({ nodes }: { nodes: DocumentTreeNode[] }) {
  const location = useLocation();
  const createDocument = useCreateDocument();
  const { data: cloud } = useDocumentTree();
  const moveDocument = useMoveDocument();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const openId = location.pathname.startsWith("/documents/")
    ? location.pathname.slice("/documents/".length)
    : null;
  const ancestors = openId ? (findAncestors(nodes, openId) ?? []) : [];

  const isExpanded = (id: string) => ancestors.includes(id) || !collapsed.has(id);

  const toggle = (id: string) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const endDrag = () => {
    setDraggedId(null);
    setDropTarget(null);
  };

  const handleDrop = (targetId: string, zone: DropZone) => {
    if (!draggedId || !cloud) {
      endDrag();
      return;
    }

    const instructions = planMove({ documents: cloud, draggedId, targetId, zone });

    if (instructions.length > 0) {
      moveDocument.mutate(instructions);
    }

    endDrag();
  };

  const renderNodes = (list: DocumentTreeNode[]) =>
    list.map((node) => {
      const expanded = isExpanded(node.id);
      const droppable =
        draggedId !== null && cloud !== undefined && canDrop(cloud, draggedId, node.id);

      return (
        <div key={node.id} className="flex flex-col gap-px">
          <DocumentTreeRow
            node={node}
            expanded={expanded}
            onToggle={() => toggle(node.id)}
            onAddChild={() => createDocument.mutate({ parentId: node.id })}
            dragging={draggedId === node.id}
            dropTargetActive={droppable}
            dropZone={dropTarget?.id === node.id ? dropTarget.zone : null}
            onDragStart={() => setDraggedId(node.id)}
            onDragEnd={endDrag}
            onDragOverZone={(zone) => setDropTarget({ id: node.id, zone })}
            onDropZone={(zone) => handleDrop(node.id, zone)}
          />
          <AnimatePresence initial={false}>
            {expanded && node.children.length > 0 && (
              <motion.div
                key="children"
                variants={collapse}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={transitions.base}
                className="flex flex-col gap-px overflow-hidden"
              >
                {renderNodes(node.children)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });

  return <div className="flex flex-col gap-px">{renderNodes(nodes)}</div>;
}
