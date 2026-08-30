let open = false;
const listeners = new Set<() => void>();

export function isCommandPaletteOpen() {
  return open;
}

export function setCommandPaletteOpen(value: boolean) {
  if (open === value) {
    return;
  }
  open = value;
  listeners.forEach((listener) => listener());
}

export function toggleCommandPalette() {
  setCommandPaletteOpen(!open);
}

export function subscribeCommandPalette(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
