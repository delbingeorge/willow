import type { OrganizationUser } from "@/features/organization/types";

export type ShareRole = "viewer" | "editor";

export interface DocumentShare {
  id: string;
  role: string;
  token: string | null;
  createdAt: string;
  user: OrganizationUser | null;
}

export interface DocumentSharing {
  id: string;
  isPublished: boolean;
  shareLink: string | null;
  shares: DocumentShare[];
}
