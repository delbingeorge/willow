import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";
import type { DocumentSharing } from "@/features/sharing/types";

const DOCUMENT_SHARING_QUERY = gql`
  query DocumentSharing($id: ID!) {
    document(id: $id) {
      id
      isPublished
      shareLink
      shares {
        id
        role
        token
        createdAt
        user {
          id
          name
          email
        }
      }
    }
  }
`;

export async function fetchDocumentSharing(id: string) {
  const { document } = await graphqlClient.request<{ document: DocumentSharing }>(
    DOCUMENT_SHARING_QUERY,
    { id },
  );
  return document;
}
