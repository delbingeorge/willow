import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { AddCircleIcon } from "@solar-icons/react/outline/add-circle";
import { CopyIcon } from "@solar-icons/react/outline/copy";
import { GlobalIcon } from "@solar-icons/react/outline/global";
import { ArchiveIcon } from "@solar-icons/react/outline/archive";
import { RestartIcon } from "@solar-icons/react/outline/restart";
import { PenNewSquareIcon } from "@solar-icons/react/outline/pen-new-square";
import { TrashBinMinimalisticIcon } from "@solar-icons/react/outline/trash-bin-minimalistic";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/shared/components/ui/context-menu";
import { useDocumentActions } from "@/features/documents/hooks/use-document-actions";
import { useCreateDocument } from "@/features/documents/hooks/use-create-document";
import { useDocumentScope } from "@/features/documents/hooks/use-document-scope";
import { useDocumentTree } from "@/features/documents/hooks/use-document-tree";
import { collectDescendantIds } from "@/features/documents/lib/scoped-documents";
import { confirmDialog, promptDialog } from "@/shared/lib/dialog-store";

export function DocumentContextMenu({
  id,
  title,
  isPublished,
  children,
}: {
  id: string;
  title: string;
  isPublished: boolean;
  children: ReactNode;
}) {
  const actions = useDocumentActions();
  const createDocument = useCreateDocument();
  const { scope } = useDocumentScope();
  const { data: cloudDocuments } = useDocumentTree();
  const navigate = useNavigate();
  const location = useLocation();

  const isArchivedView = scope === "archived";
  const descendants = collectDescendantIds(cloudDocuments ?? [], id);

  const leaveIfAffected = () => {
    const openId = location.pathname.startsWith("/documents/")
      ? location.pathname.slice("/documents/".length)
      : null;
    if (openId && (openId === id || descendants.includes(openId))) {
      void navigate("/");
    }
  };

  const rename = async () => {
    const next = await promptDialog({
      title: "Rename document",
      defaultValue: title,
      placeholder: "Document name",
      confirmLabel: "Rename",
    });
    if (next === null) {
      return;
    }
    actions.rename.mutate({ id, title: next.trim() || "Untitled" });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger render={<div />}>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={rename}>
          <PenNewSquareIcon size={14} className="text-ink-subtle" />
          Rename
        </ContextMenuItem>

        {!isArchivedView && (
          <>
            <ContextMenuItem onClick={() => createDocument.mutate({ parentId: id })}>
              <AddCircleIcon size={14} className="text-ink-subtle" />
              Add page inside
            </ContextMenuItem>
            <ContextMenuItem onClick={() => actions.duplicate.mutate(id)}>
              <CopyIcon size={14} className="text-ink-subtle" />
              Duplicate
            </ContextMenuItem>

            <ContextMenuSeparator />

            <ContextMenuItem
              onClick={() =>
                isPublished ? actions.unpublish.mutate(id) : actions.publish.mutate(id)
              }
            >
              <GlobalIcon size={14} className="text-ink-subtle" />
              {isPublished ? "Unpublish" : "Publish to web"}
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => actions.archive.mutate(id, { onSuccess: leaveIfAffected })}
            >
              <ArchiveIcon size={14} className="text-ink-subtle" />
              Archive
            </ContextMenuItem>
          </>
        )}

        {isArchivedView && (
          <ContextMenuItem onClick={() => actions.restore.mutate(id)}>
            <RestartIcon size={14} className="text-ink-subtle" />
            Restore
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        <ContextMenuItem
          variant="destructive"
          onClick={async () => {
            const nested = descendants.length;
            const confirmed = await confirmDialog({
              title: `Delete "${title}"?`,
              description:
                nested > 0
                  ? `This will also delete ${nested} page${nested === 1 ? "" : "s"} inside it. This cannot be undone.`
                  : "This cannot be undone.",
              confirmLabel: nested > 0 ? `Delete ${nested + 1} pages` : "Delete",
              destructive: true,
            });
            if (!confirmed) {
              return;
            }
            actions.remove.mutate(id, { onSuccess: leaveIfAffected });
          }}
        >
          <TrashBinMinimalisticIcon size={14} />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
