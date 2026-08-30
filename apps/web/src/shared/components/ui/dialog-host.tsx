import { useEffect, useState, useSyncExternalStore } from "react";
import {
  cancelDialog,
  getDialogRequest,
  submitDialog,
  subscribeDialog,
} from "@/shared/lib/dialog-store";
import { buttonVariants } from "@/shared/components/ui/button";
import { Modal, ModalHeader, ModalFooter } from "@/shared/components/ui/modal";
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
    <Modal
      open={request !== null}
      onOpenChange={(open) => {
        if (!open) {
          cancelDialog();
        }
      }}
      className="p-5"
    >
      {request && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submitDialog(isPrompt ? value : true);
          }}
        >
          <ModalHeader title={request.title} description={request.description} />

          {isPrompt && (
            <input
              autoFocus
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={request.placeholder}
              className="h-9 w-full rounded-lg border border-border bg-surface px-2.5 text-[13px] text-ink outline-none placeholder:text-ink-subtle focus:border-ink-subtle"
            />
          )}

          <ModalFooter>
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
          </ModalFooter>
        </form>
      )}
    </Modal>
  );
}
