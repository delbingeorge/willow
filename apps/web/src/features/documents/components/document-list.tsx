import { useNavigate } from "react-router";
import { DocumentAddIcon } from "@solar-icons/react/bold/document-add";
import { PenNewSquareIcon } from "@solar-icons/react/bold/pen-new-square";
import { useDocumentTree } from "@/features/documents/hooks/use-document-tree";
import { useCreateDocument } from "@/features/documents/hooks/use-create-document";
import { DocumentCard } from "@/features/documents/components/document-card";
import { LocalDocumentList } from "@/features/local-docs/components/local-document-list";
import { createLocalDocument } from "@/features/local-docs/lib/local-doc-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { buttonVariants } from "@/shared/components/ui/button";

export function DocumentList() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError } = useDocumentTree();
  const createDocument = useCreateDocument();
  const navigate = useNavigate();

  const rootDocuments = data?.filter((document) => document.parentId === null) ?? [];

  return (
    <div className="flex h-full flex-col gap-3">
      <button
        type="button"
        onClick={() => {
          const document = createLocalDocument();
          void navigate(`/documents/${document.id}`);
        }}
        className={buttonVariants({
          variant: "secondary",
          className: "w-full justify-start",
        })}
      >
        <PenNewSquareIcon size={16} />
        New draft
      </button>

      {isAuthenticated && (
        <>
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
            New cloud document
          </button>

          {isLoading && <p className="p-2 text-sm text-fg-3">Loading…</p>}
          {isError && <p className="p-2 text-sm text-fg-3">Couldn&apos;t load documents.</p>}

          {rootDocuments.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="px-1 text-xs font-medium text-fg-3">Workspace</p>
              {rootDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          )}
        </>
      )}

      <LocalDocumentList />
    </div>
  );
}
