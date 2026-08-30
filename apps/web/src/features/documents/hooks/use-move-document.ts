import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveDocument } from "@/features/documents/api/move-document";
import type { MoveInstruction } from "@/features/documents/lib/tree-move";
import type { DocumentListItem } from "@/features/documents/types";
import { toast } from "@/shared/lib/toast";

const TREE_KEY = ["documents", "tree"];

export function useMoveDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (instructions: MoveInstruction[]) =>
      Promise.all(instructions.map(moveDocument)),

    onMutate: async (instructions) => {
      await queryClient.cancelQueries({ queryKey: TREE_KEY });
      const previous = queryClient.getQueryData<DocumentListItem[]>(TREE_KEY);

      if (previous) {
        const patch = new Map(instructions.map((entry) => [entry.id, entry]));
        queryClient.setQueryData<DocumentListItem[]>(
          TREE_KEY,
          previous.map((document) => {
            const next = patch.get(document.id);
            return next
              ? { ...document, parentId: next.parentId, position: next.position }
              : document;
          }),
        );
      }

      return { previous };
    },

    onError: (_error, _instructions, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TREE_KEY, context.previous);
      }
      toast.error("Couldn't move that document", "Please try again.");
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: TREE_KEY }),
  });
}
