import { useQuery } from "@tanstack/react-query";
import { fetchDocument } from "@/features/documents/api/document";

export function useDocument(id: string | undefined) {
  return useQuery({
    queryKey: ["documents", "detail", id],
    queryFn: () => fetchDocument(id as string),
    enabled: Boolean(id),
  });
}
