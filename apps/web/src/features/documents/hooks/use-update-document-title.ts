import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDocumentTitle } from "@/features/documents/api/update-document";

export function useUpdateDocumentTitle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDocumentTitle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", "tree"] }),
  });
}
