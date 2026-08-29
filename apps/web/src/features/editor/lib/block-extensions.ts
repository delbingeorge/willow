import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style/text-style";
import { Color } from "@tiptap/extension-text-style/color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { TableKit } from "@tiptap/extension-table/kit";
import Image from "@tiptap/extension-image";
import { createLowlight, common } from "lowlight";

const lowlight = createLowlight(common);

export function createBlockExtensions() {
  return [
    StarterKit.configure({
      undoRedo: false,
      codeBlock: false,
      link: { openOnClick: false },
    }),
    Placeholder.configure({ placeholder: "Start typing…" }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    CodeBlockLowlight.configure({ lowlight }),
    TableKit.configure({ table: { resizable: true } }),
    Image,
  ];
}
