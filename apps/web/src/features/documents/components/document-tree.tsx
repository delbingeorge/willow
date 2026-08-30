import { useState } from "react";
import { useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import type { DocumentTreeNode } from "@/features/documents/lib/scoped-documents";
import { DocumentTreeRow } from "@/features/documents/components/document-tree-row";
import { useCreateDocument } from "@/features/documents/hooks/use-create-document";
import { collapse, transitions } from "@/shared/lib/motion";

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
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

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

  const renderNodes = (list: DocumentTreeNode[]) =>
    list.map((node) => {
      const expanded = isExpanded(node.id);

      return (
        <div key={node.id} className="flex flex-col gap-px">
          <DocumentTreeRow
            node={node}
            expanded={expanded}
            onToggle={() => toggle(node.id)}
            onAddChild={() => createDocument.mutate({ parentId: node.id })}
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
