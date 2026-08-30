import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";
import type { VersionContent, VersionSummary } from "@/features/versions/types";

const VERSIONS_QUERY = gql`
  query DocumentVersions($id: ID!, $limit: Int!) {
    document(id: $id) {
      id
      versions(limit: $limit) {
        id
        version
        title
        createdAt
        createdBy {
          id
          name
        }
      }
    }
  }
`;

const VERSION_CONTENT_QUERY = gql`
  query DocumentVersionContent($id: ID!, $offset: Int!) {
    document(id: $id) {
      id
      versions(limit: 1, offset: $offset) {
        id
        version
        content
      }
    }
  }
`;

export async function fetchDocumentVersions(id: string, limit: number) {
  const { document } = await graphqlClient.request<{
    document: { versions: VersionSummary[] };
  }>(VERSIONS_QUERY, { id, limit });
  return document.versions;
}

export async function fetchVersionContent(id: string, offset: number) {
  const { document } = await graphqlClient.request<{
    document: { versions: VersionContent[] };
  }>(VERSION_CONTENT_QUERY, { id, offset });
  return document.versions[0] ?? null;
}
