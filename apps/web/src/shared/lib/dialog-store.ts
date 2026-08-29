export interface ConfirmRequest {
  kind: "confirm";
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  resolve: (value: boolean) => void;
}

export interface PromptRequest {
  kind: "prompt";
  title: string;
  description?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  resolve: (value: string | null) => void;
}

export type DialogRequest = ConfirmRequest | PromptRequest;

let current: DialogRequest | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function dismiss(request: DialogRequest) {
  if (request.kind === "confirm") {
    request.resolve(false);
  } else {
    request.resolve(null);
  }
}

export function getDialogRequest() {
  return current;
}

export function subscribeDialog(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function open(request: DialogRequest) {
  if (current) {
    dismiss(current);
  }
  current = request;
  emit();
}

export function cancelDialog() {
  if (!current) {
    return;
  }
  const request = current;
  current = null;
  emit();
  dismiss(request);
}

export function submitDialog(value: string | true) {
  if (!current) {
    return;
  }
  const request = current;
  current = null;
  emit();

  if (request.kind === "confirm") {
    request.resolve(true);
  } else {
    request.resolve(typeof value === "string" ? value : "");
  }
}

export function confirmDialog(options: Omit<ConfirmRequest, "kind" | "resolve">) {
  return new Promise<boolean>((resolve) => {
    open({ ...options, kind: "confirm", resolve });
  });
}

export function promptDialog(options: Omit<PromptRequest, "kind" | "resolve">) {
  return new Promise<string | null>((resolve) => {
    open({ ...options, kind: "prompt", resolve });
  });
}
