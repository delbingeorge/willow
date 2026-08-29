import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DocumentIcon } from "@solar-icons/react/bold/document";
import { getLocalDocuments } from "@/features/local-docs/lib/local-doc-store";
import { migrateLocalDocuments } from "@/features/local-docs/lib/migrate-local-documents";
import { buttonVariants } from "@/shared/components/ui/button";

export function MigrationDialog({ onDismiss }: { onDismiss: () => void }) {
  const [documents, setDocuments] = useState(() => getLocalDocuments());
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);
  const [failedCount, setFailedCount] = useState(0);

  const handleImport = async () => {
    setIsImporting(true);
    setFailedCount(0);

    const { failed } = await migrateLocalDocuments(documents);
    await queryClient.invalidateQueries({ queryKey: ["documents", "tree"] });

    setIsImporting(false);

    if (failed.length === 0) {
      onDismiss();
      return;
    }
    setDocuments(failed);
    setFailedCount(failed.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/30 p-4">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-semibold text-fg-4">Import your drafts?</h2>
          <p className="text-sm text-fg-3">
            You have {documents.length} draft{documents.length === 1 ? "" : "s"} saved on this
            device. Importing moves {documents.length === 1 ? "it" : "them"} to your workspace so
            you can sync and collaborate.
          </p>
        </div>

        <div className="flex max-h-56 flex-col gap-1.5 overflow-y-auto">
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex items-center gap-2.5 rounded-xl border border-bg-3 px-3 py-2 text-sm text-fg-4"
            >
              <DocumentIcon size={15} className="shrink-0 text-fg-3" />
              <span className="truncate">{document.title}</span>
            </div>
          ))}
        </div>

        {failedCount > 0 && (
          <p className="text-xs text-fg-3">
            {failedCount} draft{failedCount === 1 ? "" : "s"} couldn&apos;t be imported and
            {failedCount === 1 ? " remains" : " remain"} on this device. You can try again.
          </p>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onDismiss}
            disabled={isImporting}
            className={buttonVariants({ variant: "secondary", className: "h-9 px-4" })}
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={isImporting}
            className={buttonVariants({ variant: "primary", className: "h-9 px-4" })}
          >
            {isImporting ? "Importing…" : "Import all"}
          </button>
        </div>
      </div>
    </div>
  );
}
