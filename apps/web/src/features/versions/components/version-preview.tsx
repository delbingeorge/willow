import { useMemo } from "react";
import Collaboration from "@tiptap/extension-collaboration";
import { Modal, ModalHeader } from "@/shared/components/ui/modal";
import { buttonVariants } from "@/shared/components/ui/button";
import { EditorShell } from "@/features/editor/components/editor-shell";
import { useVersionContent } from "@/features/versions/hooks/use-document-versions";
import { buildSnapshotDoc } from "@/features/editor/lib/snapshot-doc";
import type { SelectedVersion } from "@/features/versions/types";

function PreviewBody({
  documentId,
  version,
}: {
  documentId: string;
  version: SelectedVersion;
}) {
  const { data, isLoading, isError } = useVersionContent(documentId, version.offset);

  const ydoc = useMemo(() => buildSnapshotDoc(data?.content), [data]);
  const collabExtensions = useMemo(
    () => (ydoc ? [Collaboration.configure({ document: ydoc })] : []),
    [ydoc],
  );

  if (isLoading) {
    return <p className="px-5 py-10 text-center text-[13px] text-ink-subtle">Loading version…</p>;
  }

  if (isError) {
    return (
      <p className="px-5 py-10 text-center text-[13px] text-ink-subtle">
        Couldn&apos;t load that version.
      </p>
    );
  }

  if (data && data.id !== version.id) {
    return (
      <p className="px-5 py-10 text-center text-[13px] text-ink-subtle">
        This history moved while you were reading. Close and reopen to refresh it.
      </p>
    );
  }

  if (!ydoc) {
    return (
      <p className="px-5 py-10 text-center text-[13px] text-ink-subtle">
        This snapshot has no saved content.
      </p>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EditorShell key={version.id} ydoc={ydoc} collabExtensions={collabExtensions} readOnly />
    </div>
  );
}

export function VersionPreview({
  documentId,
  version,
  onClose,
}: {
  documentId: string;
  version: SelectedVersion | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={version !== null}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
        }
      }}
      size="lg"
      className="flex h-[min(46rem,88vh)] flex-col overflow-hidden p-0"
    >
      {version && (
        <>
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 py-4">
            <ModalHeader
              title={`Version ${version.version}`}
              description={`Saved by ${version.createdBy.name} · read-only`}
            />
            <button
              type="button"
              onClick={onClose}
              className={buttonVariants({ variant: "secondary", className: "shrink-0" })}
            >
              Close
            </button>
          </div>

          <PreviewBody documentId={documentId} version={version} />
        </>
      )}
    </Modal>
  );
}
