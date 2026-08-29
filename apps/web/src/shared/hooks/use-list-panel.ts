import { useSyncExternalStore } from "react";
import {
  isListPanelCollapsed,
  setListPanelCollapsed,
  subscribeListPanel,
  toggleListPanel,
} from "@/shared/lib/panel-state";

export function useListPanel() {
  const collapsed = useSyncExternalStore(subscribeListPanel, isListPanelCollapsed);
  return {
    collapsed,
    toggle: toggleListPanel,
    expand: () => setListPanelCollapsed(false),
  };
}
