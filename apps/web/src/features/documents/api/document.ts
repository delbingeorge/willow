import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";
import type { DocumentDetail } from "@/features/documents/types";

const DOCUMENT_QUERY = gql`
  query Document($id: ID!) {
    document(id: $id) {
      id
      title
      icon
      coverUrl
      parentId
      updatedAt
      isPublished
      shareLink
      currentVersion
    }
  }
`;

export async function fetchDocument(id: string) {
  const { document } = await graphqlClient.request<{ document: DocumentDetail }>(
    DOCUMENT_QUERY,
    { id },
  );
  return document;
}
