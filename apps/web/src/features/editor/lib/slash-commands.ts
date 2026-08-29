import type { ComponentType } from "react";
import type { Editor, Range } from "@tiptap/core";
import { TextFieldIcon } from "@solar-icons/react/outline/text-field";
import { HashtagIcon } from "@solar-icons/react/outline/hashtag";
import { ListIcon } from "@solar-icons/react/outline/list";
import { ListArrowDownIcon } from "@solar-icons/react/outline/list-arrow-down";
import { ChecklistMinimalisticIcon } from "@solar-icons/react/outline/checklist-minimalistic";
import { CodeSquareIcon } from "@solar-icons/react/outline/code-square";
import { ChatSquare2Icon } from "@solar-icons/react/outline/chat-square-2";
import { SortHorizontalIcon } from "@solar-icons/react/outline/sort-horizontal";
import { Widget4Icon } from "@solar-icons/react/outline/widget-4";
import { GalleryRoundIcon } from "@solar-icons/react/outline/gallery-round";
import { LinkIcon } from "@solar-icons/react/outline/link";
import { InfoCircleIcon } from "@solar-icons/react/outline/info-circle";
import { DangerTriangleIcon } from "@solar-icons/react/outline/danger-triangle";
import { CloseCircleIcon } from "@solar-icons/react/outline/close-circle";
import { CheckCircleIcon } from "@solar-icons/react/outline/check-circle";
import {
  pickImageFile,
  uploadImage,
  validateImageFile,
} from "@/features/editor/api/upload-image";

export interface SlashCommandItem {
  title: string;
  group: string;
  keywords: string[];
  icon: ComponentType<{ size?: number; className?: string }>;
  run: (props: { editor: Editor; range: Range }) => void;
}

export const SLASH_COMMANDS: SlashCommandItem[] = [
  {
    title: "Text",
    group: "Basic",
    keywords: ["paragraph", "plain", "body"],
    icon: TextFieldIcon,
    run: ({ editor, range }) => editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: "Heading 1",
    group: "Basic",
    keywords: ["h1", "title", "large"],
    icon: HashtagIcon,
    run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    group: "Basic",
    keywords: ["h2", "subtitle", "medium"],
    icon: HashtagIcon,
    run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    group: "Basic",
    keywords: ["h3", "small"],
    icon: HashtagIcon,
    run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run(),
  },
  {
    title: "Bullet list",
    group: "Lists",
    keywords: ["unordered", "ul", "bullet", "point"],
    icon: ListIcon,
    run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered list",
    group: "Lists",
    keywords: ["ordered", "ol", "number"],
    icon: ListArrowDownIcon,
    run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "To-do list",
    group: "Lists",
    keywords: ["task", "todo", "checkbox", "check"],
    icon: ChecklistMinimalisticIcon,
    run: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Code block",
    group: "Blocks",
    keywords: ["code", "snippet", "pre", "syntax"],
    icon: CodeSquareIcon,
    run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Quote",
    group: "Blocks",
    keywords: ["blockquote", "citation"],
    icon: ChatSquare2Icon,
    run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Divider",
    group: "Blocks",
    keywords: ["hr", "horizontal", "rule", "separator", "line"],
    icon: SortHorizontalIcon,
    run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Table",
    group: "Blocks",
    keywords: ["grid", "rows", "columns"],
    icon: Widget4Icon,
    run: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
  {
    title: "Image",
    group: "Blocks",
    keywords: ["picture", "photo", "img", "media", "upload", "file"],
    icon: GalleryRoundIcon,
    run: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();

      void (async () => {
        const file = await pickImageFile();
        if (!file) {
          return;
        }

        const problem = validateImageFile(file);
        if (problem) {
          window.alert(problem);
          return;
        }

        try {
          const { url } = await uploadImage(file);
          editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        } catch {
          window.alert("Upload failed. Please try again.");
        }
      })();
    },
  },
  {
    title: "Info callout",
    group: "Callouts",
    keywords: ["callout", "note", "aside", "tip", "info"],
    icon: InfoCircleIcon,
    run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setCallout({ variant: "info" }).run(),
  },
  {
    title: "Warning callout",
    group: "Callouts",
    keywords: ["callout", "caution", "warning", "attention"],
    icon: DangerTriangleIcon,
    run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setCallout({ variant: "warning" }).run(),
  },
  {
    title: "Error callout",
    group: "Callouts",
    keywords: ["callout", "error", "danger", "problem", "alert"],
    icon: CloseCircleIcon,
    run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setCallout({ variant: "error" }).run(),
  },
  {
    title: "Success callout",
    group: "Callouts",
    keywords: ["callout", "success", "done", "tick", "confirm"],
    icon: CheckCircleIcon,
    run: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setCallout({ variant: "success" }).run(),
  },
  {
    title: "Image from URL",
    group: "Blocks",
    keywords: ["picture", "photo", "img", "link", "embed", "remote"],
    icon: LinkIcon,
    run: ({ editor, range }) => {
      const src = window.prompt("Image URL");
      if (!src) {
        editor.chain().focus().deleteRange(range).run();
        return;
      }
      editor.chain().focus().deleteRange(range).setImage({ src }).run();
    },
  },
];

export function filterSlashCommands(query: string) {
  const normalised = query.trim().toLowerCase();
  if (!normalised) {
    return SLASH_COMMANDS;
  }

  return SLASH_COMMANDS.filter((item) => {
    const haystack = [item.title, item.group, ...item.keywords].join(" ").toLowerCase();
    return haystack.includes(normalised);
  });
}
