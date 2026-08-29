import { NavLink } from "react-router";
import { DocumentIcon } from "@solar-icons/react/bold/document";
import { cn } from "@/shared/lib/cn";
import type { DocumentListItem } from "@/features/documents/types";

export function DocumentCard({ document }: { document: DocumentListItem }) {
  return (
    <NavLink
      to={`/documents/${document.id}`}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-2xl px-2.5 py-2.5 text-sm font-medium transition-colors",
          isActive ? "bg-bg-3 text-fg-4" : "text-fg-3 hover:bg-bg-3/50 hover:text-fg-4",
        )
      }
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-base shadow-sm">
        {document.icon ? (
          <span aria-hidden="true">{document.icon}</span>
        ) : (
          <DocumentIcon size={16} className="text-fg-3" />
        )}
      </span>
      <span className="truncate">{document.title}</span>
    </NavLink>
  );
}
