import { cn } from "@/shared/lib/cn";

const WIDTHS = ["68%", "82%", "54%", "74%", "60%", "78%"];

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block animate-pulse rounded bg-surface-active motion-reduce:animate-none",
        className,
      )}
    />
  );
}

export function SkeletonRows({ count, className }: { count: number; className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("flex flex-col gap-px", className)}>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className="flex h-7 items-center gap-2 px-2">
          <Skeleton className="h-3.5 w-3.5 shrink-0 rounded-sm" />
          <span className="flex-1" style={{ maxWidth: WIDTHS[index % WIDTHS.length] }}>
            <Skeleton className="h-2.5 w-full" />
          </span>
        </span>
      ))}
    </div>
  );
}
