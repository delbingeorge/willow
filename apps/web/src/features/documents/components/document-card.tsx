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
          "flex items-center gap-2 rounded-xl border border-bg-3 bg-background px-3 py-2.5 text-sm font-medium shadow-sm transition-colors",
          isActive ? "text-fg-4" : "text-fg-3 hover:text-fg-4",
        )
      }
    >
      {document.icon ? (
        <span aria-hidden="true">{document.icon}</span>
      ) : (
        <DocumentIcon size={16} className="shrink-0 text-fg-3" />
      )}
      <span className="truncate">{document.title}</span>
    </NavLink>
  );
}
