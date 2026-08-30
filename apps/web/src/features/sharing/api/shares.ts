import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";
import type { ShareRole } from "@/features/sharing/types";

const SHARE_DOCUMENT = gql`
  mutation ShareDocument($documentId: ID!, $userId: ID!, $role: String!) {
    shareDocument(documentId: $documentId, userId: $userId, role: $role) {
      id
    }
  }
`;

const UPDATE_SHARE = gql`
  mutation UpdateShare($shareId: ID!, $role: String!) {
    updateShare(shareId: $shareId, role: $role) {
      id
      role
    }
  }
`;

const REMOVE_SHARE = gql`
  mutation RemoveShare($shareId: ID!) {
    removeShare(shareId: $shareId)
  }
`;

export async function shareDocument(input: {
  documentId: string;
  userId: string;
  role: ShareRole;
}) {
  await graphqlClient.request(SHARE_DOCUMENT, input);
}

export async function updateShare(input: { shareId: string; role: ShareRole }) {
  await graphqlClient.request(UPDATE_SHARE, input);
}

export async function removeShare(shareId: string) {
  await graphqlClient.request(REMOVE_SHARE, { shareId });
}
