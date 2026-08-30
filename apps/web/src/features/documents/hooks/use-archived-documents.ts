import { useQuery } from "@tanstack/react-query";
import { fetchArchivedDocuments } from "@/features/documents/api/archived-documents";

export function useArchivedDocuments() {
  return useQuery({
    queryKey: ["documents", "archived"],
    queryFn: fetchArchivedDocuments,
  });
}
