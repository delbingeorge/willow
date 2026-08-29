import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDocument,
  type CreateDocumentInput,
} from "@/features/documents/api/create-document";

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDocumentInput = {}) => createDocument(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", "tree"] }),
  });
}
