import { useQuery } from "@tanstack/react-query";
import { fetchSharedDocument } from "@/features/sharing/api/shared-document";

export function useSharedDocument(token: string | undefined) {
  return useQuery({
    queryKey: ["shared", token],
    queryFn: () => fetchSharedDocument(token as string),
    enabled: Boolean(token),
    retry: false,
  });
}
