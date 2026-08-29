const STORAGE_KEY = "willow.list-panel-collapsed";

let collapsed: boolean | null = null;
const listeners = new Set<() => void>();

function read() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function isListPanelCollapsed() {
  if (collapsed === null) {
    collapsed = read();
  }
  return collapsed;
}

export function setListPanelCollapsed(value: boolean) {
  if (isListPanelCollapsed() === value) {
    return;
  }
  collapsed = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    return;
  } finally {
    listeners.forEach((listener) => listener());
  }
}

export function toggleListPanel() {
  setListPanelCollapsed(!isListPanelCollapsed());
}

export function subscribeListPanel(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
