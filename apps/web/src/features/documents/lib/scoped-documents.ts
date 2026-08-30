import type { DocumentListItem } from "@/features/documents/types";
import type { DocumentScope } from "@/features/documents/lib/document-scope";

export interface ScopedDocument {
  id: string;
  title: string;
  updatedAt: string;
  icon: string | null;
  isPublished: boolean;
}

function toScoped(document: DocumentListItem): ScopedDocument {
  return {
    id: document.id,
    title: document.title,
    updatedAt: document.updatedAt,
    icon: document.icon,
    isPublished: document.isPublished,
  };
}

export function collectDescendantIds(
  cloud: DocumentListItem[],
  rootId: string,
): string[] {
  const byParent = new Map<string, string[]>();
  for (const document of cloud) {
    if (document.parentId) {
      byParent.set(document.parentId, [...(byParent.get(document.parentId) ?? []), document.id]);
    }
  }

  const found: string[] = [];
  const walk = (id: string) => {
    for (const childId of byParent.get(id) ?? []) {
      if (found.includes(childId)) {
        continue;
      }
      found.push(childId);
      walk(childId);
    }
  };
  walk(rootId);
  return found;
}

export interface DocumentTreeNode extends ScopedDocument {
  depth: number;
  children: DocumentTreeNode[];
}

export function buildDocumentTree(cloud: DocumentListItem[]): DocumentTreeNode[] {
  const byParent = new Map<string | null, DocumentListItem[]>();
  for (const document of cloud) {
    const siblings = byParent.get(document.parentId) ?? [];
    siblings.push(document);
    byParent.set(document.parentId, siblings);
  }

  const seen = new Set<string>();

  const build = (parentId: string | null, depth: number): DocumentTreeNode[] =>
    (byParent.get(parentId) ?? []).flatMap((document) => {
      if (seen.has(document.id)) {
        return [];
      }
      seen.add(document.id);
      return [{ ...toScoped(document), depth, children: build(document.id, depth + 1) }];
    });

  return build(null, 0);
}

export function selectScopedDocuments({
  scope,
  cloud,
  archived,
}: {
  scope: DocumentScope;
  cloud: DocumentListItem[];
  archived: DocumentListItem[];
}): ScopedDocument[] {
  const roots = cloud.filter((document) => document.parentId === null);

  switch (scope) {
    case "archived":
      return archived.map(toScoped);
    case "all":
    default:
      return roots.map(toScoped);
  }
}
