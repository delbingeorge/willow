import { NavLink } from "react-router";
import { DocumentIcon } from "@solar-icons/react/outline/document";
import { DocumentIcon as DocumentIconBold } from "@solar-icons/react/bold/document";
import { FolderIcon } from "@solar-icons/react/outline/folder";
import { FolderIcon as FolderIconBold } from "@solar-icons/react/bold/folder";
import { FolderOpenIcon } from "@solar-icons/react/outline/folder-open";
import { FolderOpenIcon as FolderOpenIconBold } from "@solar-icons/react/bold/folder-open";
import { AddCircleIcon } from "@solar-icons/react/outline/add-circle";
import { cn } from "@/shared/lib/cn";
import { DocumentContextMenu } from "@/features/documents/components/document-context-menu";
import type { DocumentTreeNode } from "@/features/documents/lib/scoped-documents";

const INDENT_PX = 16;
const ROW_PADDING_PX = 8;
const ICON_CENTRE_PX = 10;

function pickGlyph(hasChildren: boolean, expanded: boolean, active: boolean) {
  if (!hasChildren) {
    return active ? DocumentIconBold : DocumentIcon;
  }
  if (expanded) {
    return active ? FolderOpenIconBold : FolderOpenIcon;
  }
  return active ? FolderIconBold : FolderIcon;
}

export function DocumentTreeRow({
  node,
  expanded,
  onToggle,
  onAddChild,
}: {
  node: DocumentTreeNode;
  expanded: boolean;
  onToggle: () => void;
  onAddChild?: () => void;
}) {
  const hasChildren = node.children.length > 0;
  const isLocal = node.kind === "local";

  return (
    <DocumentContextMenu
      id={node.id}
      title={node.title}
      kind={node.kind}
      isPublished={node.isPublished}
    >
      <div className="group/row relative">
      {Array.from({ length: node.depth }, (_, level) => (
        <span
          key={level}
          aria-hidden="true"
          className="absolute top-0 bottom-0 w-px bg-border"
          style={{ left: level * INDENT_PX + ROW_PADDING_PX + ICON_CENTRE_PX }}
        />
      ))}

      <NavLink
        to={`/documents/${node.id}`}
        style={{ paddingLeft: node.depth * INDENT_PX + ROW_PADDING_PX }}
        className={({ isActive }) =>
          cn(
            "flex h-7 items-center gap-2 rounded-md pr-2 transition-colors",
            isActive ? "bg-surface-active" : "hover:bg-surface-hover",
          )
        }
      >
        {({ isActive }) => {
          const Glyph = pickGlyph(hasChildren, expanded, isActive);
          const glyph = node.icon ?? <Glyph size={15} />;
          const tone = isLocal
            ? "text-signal-local"
            : isActive
              ? "text-ink"
              : "text-ink-subtle";

          return (
            <>
              {hasChildren ? (
                <button
                  type="button"
                  aria-label={expanded ? `Collapse ${node.title}` : `Expand ${node.title}`}
                  aria-expanded={expanded}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onToggle();
                  }}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[13px] transition-colors hover:text-ink",
                    tone,
                  )}
                >
                  {glyph}
                </button>
              ) : (
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center text-[13px]",
                    tone,
                  )}
                >
                  {glyph}
                </span>
              )}

              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-[13px] text-ink",
                  isActive && "font-medium",
                )}
              >
                {node.title}
              </span>

              {hasChildren && !expanded && (
                <span
                  className={cn(
                    "shrink-0 text-[11px] tabular-nums text-ink-subtle",
                    onAddChild && "group-hover/row:invisible",
                  )}
                >
                  {node.children.length}
                </span>
              )}
            </>
          );
        }}
      </NavLink>

        {onAddChild && (
          <button
            type="button"
            aria-label={`Add a page inside ${node.title}`}
            title="Add a page inside"
            onClick={onAddChild}
            className="absolute top-1 right-1 hidden h-5 w-5 items-center justify-center rounded text-ink-subtle hover:bg-surface-active hover:text-ink group-hover/row:flex"
          >
            <AddCircleIcon size={13} />
          </button>
        )}
      </div>
    </DocumentContextMenu>
  );
}
