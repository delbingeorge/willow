import { useQuery } from "@tanstack/react-query";
import { fetchDocumentTree } from "@/features/documents/api/document-tree";
import { useAuth } from "@/shared/providers/auth-provider";

export function useDocumentTree() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["documents", "tree"],
    queryFn: fetchDocumentTree,
    enabled: isAuthenticated,
  });
}
