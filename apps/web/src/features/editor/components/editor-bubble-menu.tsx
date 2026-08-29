import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { TextBoldIcon } from "@solar-icons/react/bold/text-bold";
import { TextItalicIcon } from "@solar-icons/react/bold/text-italic";
import { TextUnderlineIcon } from "@solar-icons/react/bold/text-underline";
import { TextCrossIcon } from "@solar-icons/react/bold/text-cross";
import { CodeIcon } from "@solar-icons/react/bold/code";
import { LinkIcon } from "@solar-icons/react/bold/link";
import { PaletteIcon } from "@solar-icons/react/bold/palette";
import { AlignLeftIcon } from "@solar-icons/react/bold/align-left";
import { AlignHorizontalCenterIcon } from "@solar-icons/react/bold/align-horizontal-center";
import { AlignRightIcon } from "@solar-icons/react/bold/align-right";
import { CheckCircleIcon } from "@solar-icons/react/bold/check-circle";
import { cn } from "@/shared/lib/cn";
import { TEXT_COLORS, HIGHLIGHT_COLORS } from "@/features/editor/lib/highlight-colors";

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
        active ? "bg-bg-3 text-fg-4" : "text-fg-3 hover:bg-bg-3/60 hover:text-fg-4",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px shrink-0 bg-bg-3" aria-hidden="true" />;
}

export function EditorBubbleMenu({ editor }: { editor: Editor }) {
  const [mode, setMode] = useState<"toolbar" | "link" | "color">("toolbar");
  const [linkValue, setLinkValue] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "link") {
      linkInputRef.current?.focus();
    }
  }, [mode]);

  const openLinkEditor = () => {
    setLinkValue(editor.getAttributes("link").href ?? "");
    setMode("link");
  };

  const applyLink = () => {
    const href = linkValue.trim();
    if (href) {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setMode("toolbar");
  };

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top", onHide: () => setMode("toolbar") }}
      className="flex items-center gap-0.5 rounded-xl border border-bg-3 bg-white p-1 shadow-lg"
    >
      {mode === "toolbar" && (
        <>
          <ToolbarButton
            label="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <TextBoldIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <TextItalicIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <TextUnderlineIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <TextCrossIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Code"
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <CodeIcon size={16} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            label="Text and highlight colour"
            active={editor.isActive("textStyle") || editor.isActive("highlight")}
            onClick={() => setMode("color")}
          >
            <PaletteIcon size={16} />
          </ToolbarButton>
          <ToolbarButton label="Link" active={editor.isActive("link")} onClick={openLinkEditor}>
            <LinkIcon size={16} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton
            label="Align left"
            active={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeftIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Align centre"
            active={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignHorizontalCenterIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            label="Align right"
            active={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRightIcon size={16} />
          </ToolbarButton>
        </>
      )}

      {mode === "link" && (
        <form
          className="flex items-center gap-1"
          onSubmit={(event) => {
            event.preventDefault();
            applyLink();
          }}
        >
          <input
            ref={linkInputRef}
            value={linkValue}
            onChange={(event) => setLinkValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setMode("toolbar");
                editor.commands.focus();
              }
            }}
            placeholder="Paste a link…"
            className="h-8 w-56 rounded-lg bg-transparent px-2 text-sm text-fg-4 outline-none placeholder:text-fg-3"
          />
          <ToolbarButton label="Apply link" onClick={applyLink}>
            <CheckCircleIcon size={16} />
          </ToolbarButton>
        </form>
      )}

      {mode === "color" && (
        <div className="flex flex-col gap-2 p-1">
          <div className="flex items-center gap-1">
            <span className="w-16 text-xs text-fg-3">Text</span>
            {TEXT_COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                title={color.name}
                aria-label={`Text colour ${color.name}`}
                onClick={() => {
                  const chain = editor.chain().focus();
                  if (color.value) {
                    chain.setColor(color.value).run();
                  } else {
                    chain.unsetColor().run();
                  }
                  setMode("toolbar");
                }}
                className="h-5 w-5 shrink-0 rounded-full border border-bg-3 text-[10px] font-semibold"
                style={color.value ? { color: color.value } : undefined}
              >
                A
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="w-16 text-xs text-fg-3">Highlight</span>
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                title={color.name}
                aria-label={`Highlight ${color.name}`}
                onClick={() => {
                  const chain = editor.chain().focus();
                  if (color.value) {
                    chain.setHighlight({ color: color.value }).run();
                  } else {
                    chain.unsetHighlight().run();
                  }
                  setMode("toolbar");
                }}
                className="h-5 w-5 shrink-0 rounded-full border border-bg-3"
                style={color.value ? { backgroundColor: color.value } : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </BubbleMenu>
  );
}
