import { cn } from "@/shared/lib/cn";

type ButtonVariant = "primary" | "secondary";

export function buttonVariants({
  variant = "primary",
  className,
}: {
  variant?: ButtonVariant;
  className?: string;
} = {}) {
  return cn(
    "inline-flex h-8 select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 text-[13px] font-medium transition-colors disabled:opacity-50",
    variant === "primary" && "bg-ink text-surface hover:bg-ink/90",
    variant === "secondary" &&
      "border border-border bg-surface text-ink hover:bg-surface-hover",
    className,
  );
}
