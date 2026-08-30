import { apiFetch } from "@/shared/lib/api-client";

export interface SharedDocument {
  id: string;
  title: string;
  icon: string | null;
  coverUrl: string | null;
  content: unknown;
  updatedAt: string;
}

export function fetchSharedDocument(token: string) {
  return apiFetch<SharedDocument>(`/shared/${encodeURIComponent(token)}`);
}
