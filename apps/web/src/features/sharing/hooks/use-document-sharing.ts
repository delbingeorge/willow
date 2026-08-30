import { useQuery } from "@tanstack/react-query";
import { fetchDocumentSharing } from "@/features/sharing/api/document-sharing";

export function useDocumentSharing(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ["documents", "sharing", id],
    queryFn: () => fetchDocumentSharing(id),
    enabled,
  });
}
