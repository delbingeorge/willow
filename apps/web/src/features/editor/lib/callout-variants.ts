export const CALLOUT_VARIANTS = ["info", "warning", "error", "success"] as const;

export type CalloutVariant = (typeof CALLOUT_VARIANTS)[number];

export function isCalloutVariant(value: unknown): value is CalloutVariant {
  return CALLOUT_VARIANTS.includes(value as CalloutVariant);
}
