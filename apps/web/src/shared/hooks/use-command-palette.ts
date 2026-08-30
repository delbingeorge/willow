import { useSyncExternalStore } from "react";
import {
  isCommandPaletteOpen,
  setCommandPaletteOpen,
  subscribeCommandPalette,
  toggleCommandPalette,
} from "@/shared/lib/command-palette-state";

export function useCommandPalette() {
  const open = useSyncExternalStore(subscribeCommandPalette, isCommandPaletteOpen);
  return {
    open,
    setOpen: setCommandPaletteOpen,
    toggle: toggleCommandPalette,
  };
}
