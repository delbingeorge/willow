import { Select as Primitive } from "@base-ui/react/select";
import { AltArrowDownIcon } from "@solar-icons/react/outline/alt-arrow-down";
import { cn } from "@/shared/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

function CheckMark() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
      <path
        d="M2.5 6.5L4.75 8.75L9.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  disabled,
  triggerClassName,
  "aria-label": ariaLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  triggerClassName?: string;
  "aria-label"?: string;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <Primitive.Root
      value={value}
      onValueChange={(next) => onValueChange(String(next))}
      disabled={disabled}
    >
      <Primitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          "flex h-8 select-none items-center justify-between gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-[13px] text-ink transition-colors hover:bg-surface-hover disabled:opacity-50",
          triggerClassName,
        )}
      >
        <span className={cn("truncate", !selected && "text-ink-subtle")}>
          {selected?.label ?? placeholder}
        </span>
        <AltArrowDownIcon size={13} className="shrink-0 text-ink-subtle" />
      </Primitive.Trigger>

      <Primitive.Portal>
        <Primitive.Positioner sideOffset={4} className="z-50 outline-none">
          <Primitive.Popup
            className={cn(
              "max-h-[16rem] min-w-[var(--anchor-width)] overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-lg outline-none",
              "origin-[var(--transform-origin)] transition-[opacity,transform] duration-[120ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              "data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0",
              "motion-reduce:transition-none",
            )}
          >
            {options.map((option) => (
              <Primitive.Item
                key={option.value}
                value={option.value}
                className="flex h-8 cursor-default select-none items-center justify-between gap-3 rounded-lg px-2 text-[13px] text-ink outline-none data-[highlighted]:bg-surface-hover"
              >
                <Primitive.ItemText className="truncate">{option.label}</Primitive.ItemText>
                <Primitive.ItemIndicator className="text-ink">
                  <CheckMark />
                </Primitive.ItemIndicator>
              </Primitive.Item>
            ))}
          </Primitive.Popup>
        </Primitive.Positioner>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
