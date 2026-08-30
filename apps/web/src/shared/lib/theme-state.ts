export type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "willow.theme";
const ORDER: Theme[] = ["system", "light", "dark"];

let theme: Theme = "system";
const listeners = new Set<() => void>();

function read(): Theme {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" || value === "system" ? value : "system";
  } catch {
    return "system";
  }
}

function apply(value: Theme) {
  const root = document.documentElement;
  if (value === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", value);
  }
}

export function initTheme() {
  theme = read();
  apply(theme);
}

export function getTheme() {
  return theme;
}

export function setTheme(value: Theme) {
  if (theme === value) {
    return;
  }

  theme = value;
  apply(value);

  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    return;
  } finally {
    listeners.forEach((listener) => listener());
  }
}

export function cycleTheme() {
  setTheme(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length] as Theme);
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
