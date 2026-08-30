import type { Transition, Variants } from "framer-motion";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const transitions = {
  fast: { duration: 0.12, ease: EASE_OUT },
  base: { duration: 0.18, ease: EASE_OUT },
  panel: { duration: 0.22, ease: EASE_OUT },
} satisfies Record<string, Transition>;

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: -2 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const collapse: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" },
};
