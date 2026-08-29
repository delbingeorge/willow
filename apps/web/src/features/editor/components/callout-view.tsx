import type { NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { InfoCircleIcon } from "@solar-icons/react/bold/info-circle";
import { DangerTriangleIcon } from "@solar-icons/react/bold/danger-triangle";
import { CloseCircleIcon } from "@solar-icons/react/bold/close-circle";
import { CheckCircleIcon } from "@solar-icons/react/bold/check-circle";
import { CALLOUT_VARIANTS, type CalloutVariant } from "@/features/editor/lib/callout-variants";

const ICONS = {
  info: InfoCircleIcon,
  warning: DangerTriangleIcon,
  error: CloseCircleIcon,
  success: CheckCircleIcon,
};

export function CalloutView({ node, updateAttributes, editor }: NodeViewProps) {
  const variant = (node.attrs.variant as CalloutVariant) ?? "info";
  const Icon = ICONS[variant] ?? InfoCircleIcon;

  const cycleVariant = () => {
    const index = CALLOUT_VARIANTS.indexOf(variant);
    const next = CALLOUT_VARIANTS[(index + 1) % CALLOUT_VARIANTS.length];
    updateAttributes({ variant: next });
  };

  return (
    <NodeViewWrapper className="editor-callout" data-variant={variant}>
      <button
        type="button"
        onClick={cycleVariant}
        disabled={!editor.isEditable}
        contentEditable={false}
        aria-label={`Callout style: ${variant}. Click to change.`}
        title={`${variant} — click to change`}
        className="editor-callout__icon"
      >
        <Icon size={18} />
      </button>
      <NodeViewContent className="editor-callout__content" />
    </NodeViewWrapper>
  );
}
