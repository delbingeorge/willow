import { Link } from "react-router";
import { DocumentIcon } from "@solar-icons/react/outline/document";
import { FolderIcon } from "@solar-icons/react/outline/folder";
import { GlobalIcon } from "@solar-icons/react/outline/global";
import { AddCircleIcon } from "@solar-icons/react/outline/add-circle";
import { useDocumentTree } from "@/features/documents/hooks/use-document-tree";
import { useCreateDocument } from "@/features/documents/hooks/use-create-document";
import { buildDocumentTree } from "@/features/documents/lib/scoped-documents";
import { DocumentContextMenu } from "@/features/documents/components/document-context-menu";
import { buttonVariants } from "@/shared/components/ui/button";
import { relativeTime } from "@/shared/lib/relative-time";

export function DocumentsPage() {
  const { data: cloud, isLoading, isError } = useDocumentTree();
  const createDocument = useCreateDocument();

  const roots = buildDocumentTree(cloud ?? []);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-[860px] px-14 py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-[22px] font-semibold tracking-tight text-ink">All documents</h1>
          <button
            type="button"
            onClick={() => createDocument.mutate()}
            disabled={createDocument.isPending}
            className={buttonVariants({ variant: "primary", className: "shrink-0" })}
          >
            <AddCircleIcon size={14} />
            New document
          </button>
        </div>

        {isLoading && <p className="text-[13px] text-ink-subtle">Loading…</p>}
        {isError && <p className="text-[13px] text-ink-subtle">Couldn&apos;t load documents.</p>}

        {!isLoading && !isError && roots.length === 0 && (
          <p className="text-[13px] text-ink-subtle">
            Nothing here yet. Create your first document to get started.
          </p>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-2.5">
          {roots.map((node) => (
            <DocumentContextMenu
              key={node.id}
              id={node.id}
              title={node.title}
              isPublished={node.isPublished}
            >
              <Link
                to={`/documents/${node.id}`}
                className="flex h-28 flex-col justify-between rounded-xl border border-border bg-surface p-3 transition-colors hover:bg-surface-hover"
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center text-[15px] text-ink-subtle"
                >
                  {node.icon ??
                    (node.children.length > 0 ? (
                      <FolderIcon size={17} />
                    ) : (
                      <DocumentIcon size={17} />
                    ))}
                </span>

                <span className="flex flex-col gap-1">
                  <span className="truncate text-[13px] font-medium text-ink">
                    {node.title || "Untitled"}
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] text-ink-subtle">
                    <span className="tabular-nums">{relativeTime(node.updatedAt)}</span>
                    {node.children.length > 0 && (
                      <span>
                        · {node.children.length}{" "}
                        {node.children.length === 1 ? "page" : "pages"}
                      </span>
                    )}
                    {node.isPublished && <GlobalIcon size={12} className="shrink-0" />}
                  </span>
                </span>
              </Link>
            </DocumentContextMenu>
          ))}
        </div>
      </div>
    </div>
  );
}
