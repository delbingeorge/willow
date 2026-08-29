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
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all active:scale-99",
    variant === "primary" && "h-8 px-2.5 bg-accent-4 text-black hover:opacity-90",
    variant === "secondary" && "h-8 px-2.5 bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
    className,
  );
}
