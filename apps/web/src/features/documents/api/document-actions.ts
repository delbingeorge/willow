import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";

const ARCHIVE_DOCUMENT = gql`
  mutation ArchiveDocument($id: ID!) {
    archiveDocument(id: $id) {
      id
    }
  }
`;

const RESTORE_DOCUMENT = gql`
  mutation RestoreDocument($id: ID!) {
    restoreDocument(id: $id) {
      id
    }
  }
`;

const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: ID!) {
    deleteDocument(id: $id)
  }
`;

const DUPLICATE_DOCUMENT = gql`
  mutation DuplicateDocument($id: ID!) {
    duplicateDocument(id: $id) {
      id
      title
    }
  }
`;

const PUBLISH_DOCUMENT = gql`
  mutation PublishDocument($documentId: ID!) {
    publishDocument(documentId: $documentId) {
      id
      isPublished
      shareLink
    }
  }
`;

const UNPUBLISH_DOCUMENT = gql`
  mutation UnpublishDocument($documentId: ID!) {
    unpublishDocument(documentId: $documentId) {
      id
      isPublished
    }
  }
`;

const RENAME_DOCUMENT = gql`
  mutation RenameDocument($id: ID!, $input: UpdateDocumentInput!) {
    updateDocument(id: $id, input: $input) {
      id
      title
    }
  }
`;

export function archiveDocument(id: string) {
  return graphqlClient.request<unknown, { id: string }>(ARCHIVE_DOCUMENT, { id });
}

export function restoreDocument(id: string) {
  return graphqlClient.request<unknown, { id: string }>(RESTORE_DOCUMENT, { id });
}

export function deleteDocument(id: string) {
  return graphqlClient.request<unknown, { id: string }>(DELETE_DOCUMENT, { id });
}

export function duplicateDocument(id: string) {
  return graphqlClient.request<
    { duplicateDocument: { id: string; title: string } },
    { id: string }
  >(DUPLICATE_DOCUMENT, { id });
}

export function publishDocument(documentId: string) {
  return graphqlClient.request<
    { publishDocument: { id: string; isPublished: boolean; shareLink: string | null } },
    { documentId: string }
  >(PUBLISH_DOCUMENT, { documentId });
}

export function unpublishDocument(documentId: string) {
  return graphqlClient.request<unknown, { documentId: string }>(UNPUBLISH_DOCUMENT, {
    documentId,
  });
}

export function renameDocument({ id, title }: { id: string; title: string }) {
  return graphqlClient.request<unknown, { id: string; input: { title: string } }>(
    RENAME_DOCUMENT,
    { id, input: { title } },
  );
}
