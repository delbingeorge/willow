import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";
import type { DocumentListItem } from "@/features/documents/types";

const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      id
      title
      icon
      parentId
      updatedAt
      isPublished
    }
  }
`;

export interface CreateDocumentInput {
  title?: string;
  parentId?: string;
}

export async function createDocument(input: CreateDocumentInput = {}) {
  const { createDocument: document } = await graphqlClient.request<
    { createDocument: DocumentListItem },
    { input: { title: string; parentId?: string } }
  >(CREATE_DOCUMENT_MUTATION, {
    input: {
      title: input.title ?? "Untitled",
      ...(input.parentId ? { parentId: input.parentId } : {}),
    },
  });
  return document;
}
