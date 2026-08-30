import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";
import type { MoveInstruction } from "@/features/documents/lib/tree-move";

const MOVE_DOCUMENT = gql`
  mutation MoveDocument($id: ID!, $parentId: String, $position: Int!) {
    moveDocument(id: $id, parentId: $parentId, position: $position) {
      id
      parentId
      position
    }
  }
`;

export async function moveDocument(instruction: MoveInstruction) {
  await graphqlClient.request(MOVE_DOCUMENT, instruction);
}
