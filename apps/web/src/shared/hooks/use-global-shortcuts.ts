import { useEffect } from "react";
import { toggleCommandPalette } from "@/shared/lib/command-palette-state";
import { toggleListPanel } from "@/shared/lib/panel-state";

export function useGlobalShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) {
        return;
      }

      if (event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggleCommandPalette();
      } else if (event.key === "\\") {
        event.preventDefault();
        toggleListPanel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
