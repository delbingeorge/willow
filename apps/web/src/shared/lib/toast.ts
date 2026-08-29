import { configureToaster, mountToaster, toast as gooey } from "gooey-toast";
import type { ToastOptions } from "gooey-toast";

const SURFACE_STYLES: ToastOptions["styles"] = {
  title: "text-[13px] font-medium text-ink",
  description: "text-[12px] text-ink-muted",
  button: "text-[12px] font-medium text-ink",
};

const BASE: Partial<ToastOptions> = {
  position: "bottom-right",
  duration: 4000,
  roundness: 12,
  fill: "var(--color-surface)",
  styles: SURFACE_STYLES,
};

let mounted = false;

export function setupToaster() {
  if (mounted) {
    return;
  }
  mounted = true;
  mountToaster({ position: "bottom-right", offset: 16, options: BASE });
  configureToaster({ options: BASE });
}

function options(title: string, description?: string): ToastOptions {
  return { ...BASE, title, ...(description ? { description } : {}) };
}

export const toast = {
  success: (title: string, description?: string) => gooey.success(options(title, description)),
  error: (title: string, description?: string) => gooey.error(options(title, description)),
  warning: (title: string, description?: string) => gooey.warning(options(title, description)),
  info: (title: string, description?: string) => gooey.info(options(title, description)),
  dismiss: (id: string) => gooey.dismiss(id),
  clear: () => gooey.clear(),
};
