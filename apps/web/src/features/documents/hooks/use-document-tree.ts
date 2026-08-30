import { useQuery } from "@tanstack/react-query";
import { fetchDocumentTree } from "@/features/documents/api/document-tree";

export function useDocumentTree() {
  return useQuery({
    queryKey: ["documents", "tree"],
    queryFn: fetchDocumentTree,
  });
}
