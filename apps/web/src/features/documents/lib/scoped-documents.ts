import type { DocumentListItem } from "@/features/documents/types";
import type { LocalDocument } from "@/features/local-docs/lib/local-doc-store";
import type { DocumentScope } from "@/features/documents/lib/document-scope";

export interface ScopedDocument {
  id: string;
  title: string;
  updatedAt: string;
  kind: "cloud" | "local";
  icon: string | null;
  isPublished: boolean;
}

function fromCloud(document: DocumentListItem): ScopedDocument {
  return {
    id: document.id,
    title: document.title,
    updatedAt: document.updatedAt,
    kind: "cloud",
    icon: document.icon,
    isPublished: document.isPublished,
  };
}

function fromLocal(document: LocalDocument): ScopedDocument {
  return {
    id: document.id,
    title: document.title,
    updatedAt: document.updatedAt,
    kind: "local",
    icon: null,
    isPublished: false,
  };
}

function byNewest(a: ScopedDocument, b: ScopedDocument) {
  return b.updatedAt.localeCompare(a.updatedAt);
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

export function buildDocumentTree(
  cloud: DocumentListItem[],
  local: LocalDocument[],
): DocumentTreeNode[] {
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
      return [{ ...fromCloud(document), depth, children: build(document.id, depth + 1) }];
    });

  return [
    ...build(null, 0),
    ...local.map((document) => ({ ...fromLocal(document), depth: 0, children: [] })),
  ];
}

export function selectScopedDocuments({
  scope,
  cloud,
  local,
  archived,
}: {
  scope: DocumentScope;
  cloud: DocumentListItem[];
  local: LocalDocument[];
  archived: DocumentListItem[];
}): ScopedDocument[] {
  const roots = cloud.filter((document) => document.parentId === null);

  switch (scope) {
    case "cloud":
      return roots.map(fromCloud);
    case "local":
      return local.map(fromLocal);
    case "published":
      return cloud.filter((document) => document.isPublished).map(fromCloud);
    case "archived":
      return archived.map(fromCloud);
    case "recent":
      return [...roots.map(fromCloud), ...local.map(fromLocal)].sort(byNewest);
    case "all":
    default:
      return [...roots.map(fromCloud), ...local.map(fromLocal)];
  }
}
