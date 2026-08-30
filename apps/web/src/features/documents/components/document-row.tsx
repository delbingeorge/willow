import { NavLink } from "react-router";
import { DocumentIcon } from "@solar-icons/react/outline/document";
import { DocumentIcon as DocumentIconBold } from "@solar-icons/react/bold/document";
import { GlobalIcon } from "@solar-icons/react/outline/global";
import { cn } from "@/shared/lib/cn";
import { relativeTime } from "@/shared/lib/relative-time";
import { DocumentContextMenu } from "@/features/documents/components/document-context-menu";
import type { ScopedDocument } from "@/features/documents/lib/scoped-documents";

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
