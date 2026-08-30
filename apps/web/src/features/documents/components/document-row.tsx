import { NavLink } from "react-router";
import { DocumentIcon } from "@solar-icons/react/outline/document";
import { DocumentIcon as DocumentIconBold } from "@solar-icons/react/bold/document";
import { GlobalIcon } from "@solar-icons/react/outline/global";
import { cn } from "@/shared/lib/cn";
import { DocumentContextMenu } from "@/features/documents/components/document-context-menu";
import type { ScopedDocument } from "@/features/documents/lib/scoped-documents";

function relativeTime(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.round(days / 7)}w`;
}

export function DocumentRow({ document }: { document: ScopedDocument }) {
  return (
    <DocumentContextMenu
      id={document.id}
      title={document.title}
      isPublished={document.isPublished}
    >
      <div className="group/row relative">
      <NavLink
        to={`/documents/${document.id}`}
        className={({ isActive }) =>
          cn(
            "flex h-7 items-center gap-2 rounded-md px-2 transition-colors",
            isActive ? "bg-surface-active" : "hover:bg-surface-hover",
          )
        }
      >
        {({ isActive }) => (
          <>
            <span
              aria-hidden="true"
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center text-[13px]",
                isActive ? "text-ink" : "text-ink-subtle",
              )}
            >
              {document.icon ??
                (isActive ? <DocumentIconBold size={15} /> : <DocumentIcon size={15} />)}
            </span>

            <span
              className={cn(
                "min-w-0 flex-1 truncate text-[13px] text-ink",
                isActive && "font-medium",
              )}
            >
              {document.title}
            </span>

            {document.isPublished && (
              <GlobalIcon size={12} className="shrink-0 text-ink-subtle" />
            )}

            <span className="shrink-0 text-[12px] tabular-nums text-ink-subtle">
              {relativeTime(document.updatedAt)}
            </span>
          </>
        )}
      </NavLink>
      </div>
    </DocumentContextMenu>
  );
}
