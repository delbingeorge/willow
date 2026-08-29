import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDocument } from "@/features/documents/api/create-document";

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", "tree"] }),
  });
}
