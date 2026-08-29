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
    }
  }
`;

export async function createDocument(title = "Untitled") {
  const { createDocument: document } = await graphqlClient.request<
    { createDocument: DocumentListItem },
    { input: { title: string } }
  >(CREATE_DOCUMENT_MUTATION, { input: { title } });
  return document;
}
