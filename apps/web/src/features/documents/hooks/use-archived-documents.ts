import { useQuery } from "@tanstack/react-query";
import { fetchArchivedDocuments } from "@/features/documents/api/archived-documents";
import { useAuth } from "@/shared/providers/auth-provider";

export function useArchivedDocuments() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["documents", "archived"],
    queryFn: fetchArchivedDocuments,
    enabled: isAuthenticated,
  });
}
