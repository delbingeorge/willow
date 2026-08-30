import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";
import { AltArrowRightIcon } from "@solar-icons/react/outline/alt-arrow-right";
import { useDocumentTree } from "@/features/documents/hooks/use-document-tree";
import { buildBreadcrumb } from "@/features/documents/lib/scoped-documents";
import { OnlineAvatars } from "@/features/editor/components/online-avatars";
import type { OnlineUser } from "@/features/editor/hooks/use-online-users";

export function EditorHeader({
  documentId,
  users,
  actions,
}: {
  documentId: string;
  users: OnlineUser[];
  actions?: ReactNode;
}) {
  const { data: cloud } = useDocumentTree();
  const trail = buildBreadcrumb(cloud ?? [], documentId);

  return (
    <header className="sticky top-0 z-10 flex h-10 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-3">
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 items-center gap-1 text-[13px] text-ink-muted"
      >
        {trail.map((entry, index) => {
          const isCurrent = index === trail.length - 1;

          return (
            <Fragment key={entry.id}>
              {index > 0 && (
                <AltArrowRightIcon
                  size={13}
                  aria-hidden="true"
                  className="shrink-0 text-ink-subtle"
                />
              )}
              {isCurrent ? (
                <span aria-current="page" className="truncate font-medium text-ink">
                  {entry.title || "Untitled"}
                </span>
              ) : (
                <Link
                  to={`/documents/${entry.id}`}
                  className="max-w-[12rem] truncate rounded px-1 py-0.5 transition-colors hover:bg-surface-hover hover:text-ink"
                >
                  {entry.title || "Untitled"}
                </Link>
              )}
            </Fragment>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        <OnlineAvatars users={users} />
        {actions}
      </div>
    </header>
  );
}
