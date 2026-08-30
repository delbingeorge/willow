export interface DocumentListItem {
  id: string;
  title: string;
  icon: string | null;
  parentId: string | null;
  updatedAt: string;
  isPublished: boolean;
}

export interface DocumentDetail extends DocumentListItem {
  coverUrl: string | null;
  shareLink: string | null;
  currentVersion: number;
}

export interface DocumentUser {
  id: string;
  name: string;
  email: string;
}

export interface DocumentShare {
  id: string;
  role: string;
  token: string | null;
  createdAt: string;
  user: DocumentUser | null;
}

export interface DocumentVersionSummary {
  id: string;
  version: number;
  title: string;
  createdAt: string;
  createdBy: Pick<DocumentUser, "id" | "name">;
}
