export interface VersionSummary {
  id: string;
  version: number;
  title: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface VersionContent {
  id: string;
  version: number;
  content: unknown;
}

export type SelectedVersion = VersionSummary & { offset: number };
