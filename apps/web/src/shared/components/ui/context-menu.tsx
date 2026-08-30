import type { ComponentProps } from "react";
import { ContextMenu as Primitive } from "@base-ui/react/context-menu";
import { cn } from "@/shared/lib/cn";

export function ContextMenu(props: ComponentProps<typeof Primitive.Root>) {
  return <Primitive.Root {...props} />;
}

export function ContextMenuTrigger({
  className,
  ...props
}: ComponentProps<typeof Primitive.Trigger>) {
  return <Primitive.Trigger className={className} {...props} />;
}

export function ContextMenuContent({
  className,
  ...props
}: ComponentProps<typeof Primitive.Popup>) {
  return (
    <Primitive.Portal>
      <Primitive.Positioner sideOffset={4} className="z-50 outline-none">
        <Primitive.Popup
          className={cn(
            "min-w-[180px] rounded-xl border border-border bg-surface p-1 shadow-lg outline-none",
            "origin-[var(--transform-origin)] transition-[opacity,transform] duration-[120ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            "data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0",
            "motion-reduce:transition-none",
            className,
          )}
          {...props}
        />
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}

export function ContextMenuItem({
  className,
  variant = "default",
  ...props
}: ComponentProps<typeof Primitive.Item> & { variant?: "default" | "destructive" }) {
  return (
    <Primitive.Item
      className={cn(
        "flex h-8 cursor-default select-none items-center gap-2 rounded-lg px-2 text-[13px] outline-none",
        "data-[highlighted]:bg-surface-hover",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        variant === "destructive"
          ? "text-danger data-[highlighted]:bg-danger-soft data-[highlighted]:text-danger"
          : "text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function ContextMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof Primitive.Separator>) {
  return (
    <Primitive.Separator className={cn("my-1 h-px bg-border", className)} {...props} />
  );
}

export function ContextMenuGroup(props: ComponentProps<typeof Primitive.Group>) {
  return <Primitive.Group {...props} />;
}

export function ContextMenuLabel({
  className,
  ...props
}: ComponentProps<typeof Primitive.GroupLabel>) {
  return (
    <Primitive.GroupLabel
      className={cn("px-2 py-1 text-[11px] font-medium text-ink-subtle", className)}
      {...props}
    />
  );
}
