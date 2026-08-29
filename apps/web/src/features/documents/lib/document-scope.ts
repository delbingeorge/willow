export const DOCUMENT_SCOPES = [
  "all",
  "recent",
  "cloud",
  "local",
  "published",
  "archived",
] as const;

export type DocumentScope = (typeof DOCUMENT_SCOPES)[number];

export const DEFAULT_SCOPE: DocumentScope = "all";

export function isDocumentScope(value: string | null): value is DocumentScope {
  return DOCUMENT_SCOPES.includes(value as DocumentScope);
}

export function parseScope(value: string | null): DocumentScope {
  return isDocumentScope(value) ? value : DEFAULT_SCOPE;
}

export const SCOPE_LABELS: Record<DocumentScope, string> = {
  all: "All documents",
  recent: "Recent",
  cloud: "Cloud documents",
  local: "Local drafts",
  published: "Published",
  archived: "Archived",
};
