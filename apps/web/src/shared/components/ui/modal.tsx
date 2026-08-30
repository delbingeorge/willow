import type { ComponentProps, ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@/shared/lib/cn";

type ModalSize = "sm" | "md" | "lg";

const SIZES: Record<ModalSize, string> = {
  sm: "w-[min(24rem,calc(100vw-2rem))]",
  md: "w-[min(30rem,calc(100vw-2rem))]",
  lg: "w-[min(44rem,calc(100vw-2rem))]",
};

const BACKDROP =
  "fixed inset-0 z-50 bg-ink/25 transition-opacity duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none";

const POPUP =
  "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface shadow-xl outline-none transition-[opacity,transform] duration-[150ms] ease-[cubic-bezier(0.22,1,0.36,1)] data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 motion-reduce:transition-none";

export function Modal({
  open,
  onOpenChange,
  size = "sm",
  className,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: ModalSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={BACKDROP} />
        <Dialog.Popup className={cn(POPUP, SIZES[size], className)}>{children}</Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ModalHeader({
  title,
  description,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Dialog.Title className="text-[15px] font-semibold text-ink">{title}</Dialog.Title>
      {description && (
        <Dialog.Description className="text-[13px] text-ink-muted">
          {description}
        </Dialog.Description>
      )}
    </div>
  );
}

export function ModalFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center justify-end gap-2", className)} {...props} />
  );
}

export const ModalClose = Dialog.Close;
