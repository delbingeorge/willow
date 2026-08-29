import { cn } from "../../lib/cn";

type ButtonVariant = "primary";

export function buttonVariants({
  variant = "primary",
  className,
}: {
  variant?: ButtonVariant;
  className?: string;
} = {}) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all active:scale-99",
    variant === "primary" &&
      "h-8 px-2.5 bg-[#BFCD90] text-black hover:opacity-90",
    className,
  );
}
