import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";
import type { DocumentListItem } from "@/features/documents/types";

const ARCHIVED_DOCUMENTS_QUERY = gql`
  query ArchivedDocuments {
    documents(isArchived: true) {
      id
      title
      icon
      parentId
      updatedAt
      isPublished
    }
  }
`;

export async function fetchArchivedDocuments() {
  const { documents } = await graphqlClient.request<{ documents: DocumentListItem[] }>(
    ARCHIVED_DOCUMENTS_QUERY,
  );
  return documents;
}
