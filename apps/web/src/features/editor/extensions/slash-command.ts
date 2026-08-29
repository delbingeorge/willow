import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { exitSuggestion } from "@tiptap/suggestion";
import { isChangeOrigin } from "@tiptap/extension-collaboration";
import { SlashMenu, type SlashMenuRef, type SlashMenuProps } from "@/features/editor/components/slash-menu";
import { filterSlashCommands, type SlashCommandItem } from "@/features/editor/lib/slash-commands";

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashCommandItem, SlashCommandItem>({
        editor: this.editor,
        char: "/",
        startOfLine: false,
        allowSpaces: false,

        shouldShow: ({ transaction }) => !isChangeOrigin(transaction),

        items: ({ query }) => filterSlashCommands(query),

        command: ({ editor, range, props }) => props.run({ editor, range }),

        render: () => {
          let renderer: ReactRenderer<SlashMenuRef, SlashMenuProps> | null = null;
          let unmount: (() => void) | null = null;

          return {
            onStart: (props) => {
              renderer = new ReactRenderer(SlashMenu, {
                editor: props.editor,
                props: { items: props.items, command: props.command },
              });
              unmount = props.mount(renderer.element);
            },

            onUpdate: (props) => {
              renderer?.updateProps({ items: props.items, command: props.command });
            },

            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                exitSuggestion(props.view);
                return true;
              }
              return renderer?.ref?.onKeyDown({ event: props.event }) ?? false;
            },

            onExit: () => {
              unmount?.();
              unmount = null;
              renderer?.destroy();
              renderer = null;
            },
          };
        },
      }),
    ];
  },
});
