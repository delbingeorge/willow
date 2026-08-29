import { DocumentAddIcon } from "@solar-icons/react/bold/document-add";
import { useDocumentTree } from "@/features/documents/hooks/use-document-tree";
import { useCreateDocument } from "@/features/documents/hooks/use-create-document";
import { DocumentCard } from "@/features/documents/components/document-card";
import { buttonVariants } from "@/shared/components/ui/button";

export function DocumentList() {
  const { data, isPending, isError } = useDocumentTree();
  const createDocument = useCreateDocument();

  const rootDocuments =
    data?.filter((document) => document.parentId === null) ?? [];

  return (
    <div className="flex h-full flex-col gap-3">
      <button
        type="button"
        onClick={() => createDocument.mutate()}
        disabled={createDocument.isPending}
        className={buttonVariants({
          variant: "secondary",
          className: "w-full justify-start",
        })}
      >
        <DocumentAddIcon size={16} />
        New document
      </button>

      {isPending && <p className="p-2 text-sm text-fg-3">Loading…</p>}
      {isError && (
        <p className="p-2 text-sm text-fg-3">Couldn&apos;t load documents.</p>
      )}
      {!isPending && !isError && rootDocuments.length === 0 && (
        <p className="p-2 text-sm text-fg-3">No documents yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {rootDocuments.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
}
