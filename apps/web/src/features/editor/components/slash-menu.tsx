import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import type { SlashCommandItem } from "@/features/editor/lib/slash-commands";

export interface SlashMenuRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export interface SlashMenuProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export const SlashMenu = forwardRef<SlashMenuRef, SlashMenuProps>(function SlashMenu(
  { items, command },
  ref,
) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (items.length === 0) {
        return false;
      }

      if (event.key === "ArrowUp") {
        setSelectedIndex((current) => (current + items.length - 1) % items.length);
        return true;
      }

      if (event.key === "ArrowDown") {
        setSelectedIndex((current) => (current + 1) % items.length);
        return true;
      }

      if (event.key === "Enter") {
        const item = items[selectedIndex];
        if (item) {
          command(item);
        }
        return true;
      }

      return false;
    },
  }));

  if (items.length === 0) {
    return (
      <div className="w-72 rounded-xl border border-bg-3 bg-white p-3 text-sm text-fg-3 shadow-lg">
        No matching blocks
      </div>
    );
  }

  let lastGroup: string | null = null;

  return (
    <div className="max-h-80 w-72 overflow-y-auto rounded-xl border border-bg-3 bg-white p-1 shadow-lg">
      {items.map((item, index) => {
        const showGroup = item.group !== lastGroup;
        lastGroup = item.group;
        const Icon = item.icon;

        return (
          <div key={item.title}>
            {showGroup && (
              <p className="px-2 pt-2 pb-1 text-xs font-medium text-fg-3">{item.group}</p>
            )}
            <button
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              onClick={() => command(item)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                index === selectedIndex ? "bg-bg-3 text-fg-4" : "text-fg-3 hover:text-fg-4",
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-bg-3 bg-white">
                <Icon size={15} />
              </span>
              {item.title}
            </button>
          </div>
        );
      })}
    </div>
  );
});
