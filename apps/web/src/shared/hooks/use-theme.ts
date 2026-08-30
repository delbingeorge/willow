import { useSyncExternalStore } from "react";
import { cycleTheme, getTheme, setTheme, subscribeTheme } from "@/shared/lib/theme-state";

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme);
  return { theme, setTheme, cycle: cycleTheme };
}
