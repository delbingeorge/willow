import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";

const IMPORT_DOCUMENT_STATE_MUTATION = gql`
  mutation ImportDocumentState($id: ID!, $state: String!) {
    importDocumentState(id: $id, state: $state)
  }
`;

export async function importDocumentState({ id, state }: { id: string; state: string }) {
  const { importDocumentState: imported } = await graphqlClient.request<
    { importDocumentState: boolean },
    { id: string; state: string }
  >(IMPORT_DOCUMENT_STATE_MUTATION, { id, state });
  return imported;
}
