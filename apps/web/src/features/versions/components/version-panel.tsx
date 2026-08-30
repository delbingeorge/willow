import { motion } from "framer-motion";
import { CloseIcon } from "@solar-icons/react/outline/close";
import { transitions } from "@/shared/lib/motion";
import { relativeTime } from "@/shared/lib/relative-time";
import { useDocumentVersions } from "@/features/versions/hooks/use-document-versions";
import type { SelectedVersion } from "@/features/versions/types";
import { cn } from "@/shared/lib/cn";

const PANEL_WIDTH = 260;

export function VersionPanel({
  documentId,
  selectedId,
  onSelect,
  onClose,
}: {
  documentId: string;
  selectedId: string | null;
  onSelect: (version: SelectedVersion) => void;
  onClose: () => void;
}) {
  const { data: versions, isLoading, isError } = useDocumentVersions(documentId, true);

  return (
    <motion.aside
      key="version-panel"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: PANEL_WIDTH, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={transitions.panel}
      className="flex shrink-0 flex-col overflow-hidden border-l border-border"
    >
      <div style={{ width: PANEL_WIDTH }} className="flex h-full flex-col">
        <header className="flex h-10 shrink-0 items-center justify-between border-b border-border pr-1.5 pl-2.5">
          <span className="truncate text-[13px] font-medium text-ink-muted">Version history</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close version history"
            title="Close"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-ink-subtle transition-colors hover:bg-surface-hover hover:text-ink"
          >
            <CloseIcon size={14} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-1">
          {isLoading && (
            <p className="px-2.5 py-3 text-[13px] text-ink-subtle">Loading…</p>
          )}

          {isError && (
            <p className="px-2.5 py-3 text-[13px] text-ink-subtle">
              Couldn&apos;t load history.
            </p>
          )}

          {versions?.length === 0 && (
            <p className="px-2.5 py-3 text-[13px] text-ink-subtle">
              No snapshots yet. Willow saves one every 30 minutes and when everyone leaves.
            </p>
          )}

          {versions?.map((version, index) => (
            <button
              key={version.id}
              type="button"
              onClick={() => onSelect({ ...version, offset: index })}
              className={cn(
                "flex w-full flex-col gap-0.5 rounded-md px-2.5 py-2 text-left transition-colors",
                version.id === selectedId ? "bg-surface-active" : "hover:bg-surface-hover",
              )}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] font-medium text-ink">
                  Version {version.version}
                </span>
                <span className="shrink-0 text-[12px] tabular-nums text-ink-subtle">
                  {relativeTime(version.createdAt)}
                </span>
              </span>
              <span className="truncate text-[12px] text-ink-muted">
                {version.createdBy.name}
                {index === 0 && " · latest"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
