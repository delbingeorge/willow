import { NavLink, useLocation, useNavigate } from "react-router";
import { DocumentIcon } from "@solar-icons/react/bold/document";
import { TrashBinMinimalisticIcon } from "@solar-icons/react/bold/trash-bin-minimalistic";
import { cn } from "@/shared/lib/cn";
import { useLocalDocuments } from "@/features/local-docs/hooks/use-local-documents";
import { deleteLocalDocument } from "@/features/local-docs/lib/local-doc-store";

export function LocalDocumentList() {
  const documents = useLocalDocuments();
  const navigate = useNavigate();
  const location = useLocation();

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p className="px-1 text-xs font-medium text-fg-3">On this device</p>
      {documents.map((document) => (
        <div key={document.id} className="group/row relative">
          <NavLink
            to={`/documents/${document.id}`}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-2.5 py-2.5 pr-9 text-sm font-medium transition-colors",
                isActive ? "bg-bg-3 text-fg-4" : "text-fg-3 hover:bg-bg-3/50 hover:text-fg-4",
              )
            }
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <DocumentIcon size={16} className="text-fg-3" />
            </span>
            <span className="truncate">{document.title}</span>
          </NavLink>
          <button
            type="button"
            aria-label={`Delete ${document.title}`}
            title="Delete from this device"
            onClick={async () => {
              if (!window.confirm(`Delete "${document.title}" from this device?`)) {
                return;
              }
              await deleteLocalDocument(document.id);
              if (location.pathname === `/documents/${document.id}`) {
                void navigate("/");
              }
            }}
            className="absolute top-1/2 right-2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-fg-3 hover:bg-bg-3 hover:text-fg-4 group-hover/row:flex"
          >
            <TrashBinMinimalisticIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
