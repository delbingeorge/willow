import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDocument,
  type CreateDocumentInput,
} from "@/features/documents/api/create-document";
import { toast } from "@/shared/lib/toast";

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDocumentInput) => createDocument(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", "tree"] }),
    onError: () => toast.error("Couldn't create that document", "Please try again."),
  });
}
