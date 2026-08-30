import { useEffect, useState, useSyncExternalStore } from "react";
import { Dialog } from "@base-ui/react/dialog";
import {
  cancelDialog,
  getDialogRequest,
  submitDialog,
  subscribeDialog,
} from "@/shared/lib/dialog-store";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";

export function DialogHost() {
  const request = useSyncExternalStore(subscribeDialog, getDialogRequest);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (request?.kind === "prompt") {
      setValue(request.defaultValue ?? "");
    }
  }, [request]);

  const isPrompt = request?.kind === "prompt";
  const destructive = request?.kind === "confirm" && request.destructive;

  return (
    <Dialog.Root
      open={request !== null}
      onOpenChange={(open) => {
        if (!open) {
          cancelDialog();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-ink/25 transition-opacity duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface p-5 shadow-xl outline-none transition-[opacity,transform] duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 motion-reduce:transition-none">
          {request && (
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                submitDialog(isPrompt ? value : true);
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Dialog.Title className="text-[15px] font-semibold text-ink">
                  {request.title}
                </Dialog.Title>
                {request.description && (
                  <Dialog.Description className="text-[13px] text-ink-muted">
                    {request.description}
                  </Dialog.Description>
                )}
              </div>

              {isPrompt && (
                <input
                  autoFocus
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  placeholder={request.placeholder}
                  className="h-9 w-full rounded-lg border border-border bg-surface px-2.5 text-[13px] text-ink outline-none placeholder:text-ink-subtle focus:border-ink-subtle"
                />
              )}

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelDialog}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={cn(
                    buttonVariants({ variant: "primary" }),
                    destructive && "bg-red-600 text-white hover:bg-red-600/90",
                  )}
                >
                  {request.confirmLabel ?? (isPrompt ? "Save" : "Confirm")}
                </button>
              </div>
            </form>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
