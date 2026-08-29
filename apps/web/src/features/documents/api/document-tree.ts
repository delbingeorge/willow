import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";
import type { DocumentListItem } from "@/features/documents/types";

const DOCUMENT_TREE_QUERY = gql`
  query DocumentTree {
    documentTree {
      id
      title
      icon
      parentId
      updatedAt
      isPublished
    }
  }
`;

export async function fetchDocumentTree() {
  const { documentTree } = await graphqlClient.request<{ documentTree: DocumentListItem[] }>(
    DOCUMENT_TREE_QUERY,
  );
  return documentTree;
}
