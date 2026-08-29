import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";

const UPDATE_DOCUMENT_TITLE_MUTATION = gql`
  mutation UpdateDocumentTitle($id: ID!, $input: UpdateDocumentInput!) {
    updateDocument(id: $id, input: $input) {
      id
      title
    }
  }
`;

export async function updateDocumentTitle({ id, title }: { id: string; title: string }) {
  const { updateDocument } = await graphqlClient.request<
    { updateDocument: { id: string; title: string } },
    { id: string; input: { title: string } }
  >(UPDATE_DOCUMENT_TITLE_MUTATION, { id, input: { title } });
  return updateDocument;
}
