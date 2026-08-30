import { useQuery } from "@tanstack/react-query";
import { fetchDocumentVersions, fetchVersionContent } from "@/features/versions/api/versions";

const VERSION_LIMIT = 50;

export function useDocumentVersions(documentId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["documents", "versions", documentId],
    queryFn: () => fetchDocumentVersions(documentId, VERSION_LIMIT),
    enabled,
  });
}

export function useVersionContent(documentId: string, offset: number | null) {
  return useQuery({
    queryKey: ["documents", "versions", documentId, "content", offset],
    queryFn: () => fetchVersionContent(documentId, offset as number),
    enabled: offset !== null,
  });
}
