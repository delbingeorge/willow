import { AddCircleIcon } from "@solar-icons/react/outline/add-circle";
import { useCreateDocument } from "@/features/documents/hooks/use-create-document";
import { useDocumentTree } from "@/features/documents/hooks/use-document-tree";
import { useArchivedDocuments } from "@/features/documents/hooks/use-archived-documents";
import { useDocumentScope } from "@/features/documents/hooks/use-document-scope";
import {
  selectScopedDocuments,
  buildDocumentTree,
} from "@/features/documents/lib/scoped-documents";
import { SCOPE_LABELS } from "@/features/documents/lib/document-scope";
import { DocumentRow } from "@/features/documents/components/document-row";
import { DocumentTree } from "@/features/documents/components/document-tree";

const TREE_SCOPES = new Set(["all"]);

export function DocumentList() {
  const { scope } = useDocumentScope();
  const { data: cloud, isLoading, isError } = useDocumentTree();
  const { data: archived } = useArchivedDocuments();
  const createDocument = useCreateDocument();

  const asTree = TREE_SCOPES.has(scope);

  const documents = asTree
    ? []
    : selectScopedDocuments({
        scope,
        cloud: cloud ?? [],
        archived: archived ?? [],
      });

  const treeNodes = asTree ? buildDocumentTree(cloud ?? []) : [];

  const isEmpty = asTree ? treeNodes.length === 0 : documents.length === 0;

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-10 shrink-0 items-center justify-between border-b border-border pr-1.5 pl-2.5">
        <span className="truncate text-[13px] font-medium text-ink-muted">
          {SCOPE_LABELS[scope]}
        </span>
        <button
          type="button"
          onClick={() => createDocument.mutate()}
          disabled={createDocument.isPending}
          aria-label="New document"
          title="New document"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-ink-subtle transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-50"
        >
          <AddCircleIcon size={15} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-1">
        {isLoading && (
          <p className="px-2.5 py-3 text-[13px] text-ink-subtle">Loading…</p>
        )}
        {isError && (
          <p className="px-2.5 py-3 text-[13px] text-ink-subtle">Couldn&apos;t load documents.</p>
        )}
        {isEmpty && !isLoading && (
          <p className="px-2.5 py-3 text-[13px] text-ink-subtle">Nothing here yet.</p>
        )}

        {asTree ? (
          <DocumentTree nodes={treeNodes} />
        ) : (
          documents.map((document) => <DocumentRow key={document.id} document={document} />)
        )}
      </div>
    </div>
  );
}
