import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { MagnifierIcon } from "@solar-icons/react/outline/magnifier";
import { DocumentIcon } from "@solar-icons/react/outline/document";
import { Modal } from "@/shared/components/ui/modal";
import { useCommandPalette } from "@/shared/hooks/use-command-palette";
import { relativeTime } from "@/shared/lib/relative-time";
import { useSearch } from "@/features/search/hooks/use-search";
import { parseHighlight } from "@/features/search/lib/highlight";
import type { SearchResult } from "@/features/search/types";
import { SkeletonRows } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/cn";

function ResultTitle({ result }: { result: SearchResult }) {
  return (
    <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
      {parseHighlight(result.snippet, result.title).map((segment, index) => (
        <span key={index} className={segment.match ? "font-semibold text-ink" : undefined}>
          {segment.text}
        </span>
      ))}
    </span>
  );
}

export function SearchPalette() {
  const { open, setOpen } = useCommandPalette();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { results, isLoading, isError, isSettled, enabled } = useSearch(query);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const openResult = (id: string) => {
    setOpen(false);
    void navigate(`/documents/${id}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const result = results[activeIndex];
      if (result) {
        openResult(result.id);
      }
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      size="md"
      className="top-[14vh] translate-y-0 overflow-hidden p-0"
    >
      <div className="flex h-11 items-center gap-2.5 border-b border-border px-3.5">
        <MagnifierIcon size={16} className="shrink-0 text-ink-subtle" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search documents…"
          aria-label="Search documents"
          className="h-full w-full border-none bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-subtle"
        />
      </div>

      <div ref={listRef} className="max-h-[min(22rem,60vh)] overflow-y-auto p-1.5">
        {!enabled && (
          <p className="px-2.5 py-6 text-center text-[13px] text-ink-subtle">
            Type at least two characters to search.
          </p>
        )}

        {enabled && isLoading && <SkeletonRows count={4} className="py-1" />}

        {enabled && isError && (
          <p className="px-2.5 py-6 text-center text-[13px] text-ink-subtle">
            Search failed. Please try again.
          </p>
        )}

        {isSettled && results.length === 0 && (
          <p className="px-2.5 py-6 text-center text-[13px] text-ink-subtle">
            No documents match that search.
          </p>
        )}

        {results.map((result, index) => (
          <button
            key={result.id}
            type="button"
            data-active={index === activeIndex}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => openResult(result.id)}
            className={cn(
              "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left transition-colors",
              index === activeIndex ? "bg-surface-hover" : "bg-transparent",
            )}
          >
            <span
              aria-hidden="true"
              className="flex h-5 w-5 shrink-0 items-center justify-center text-[13px] text-ink-subtle"
            >
              {result.icon ?? <DocumentIcon size={15} />}
            </span>
            <ResultTitle result={result} />
            <span className="shrink-0 text-[12px] tabular-nums text-ink-subtle">
              {relativeTime(result.updatedAt)}
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
