import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";

const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($name: String!) {
    updateOrganization(name: $name) {
      id
      name
    }
  }
`;

const INVITE_MEMBER = gql`
  mutation InviteMember($email: String!, $role: String!) {
    inviteMember(email: $email, role: $role) {
      id
    }
  }
`;

const UPDATE_MEMBER_ROLE = gql`
  mutation UpdateMemberRole($membershipId: ID!, $role: String!) {
    updateMemberRole(membershipId: $membershipId, role: $role) {
      id
      role
    }
  }
`;

const REMOVE_MEMBER = gql`
  mutation RemoveMember($membershipId: ID!) {
    removeMember(membershipId: $membershipId)
  }
`;

export async function updateOrganization(name: string) {
  await graphqlClient.request(UPDATE_ORGANIZATION, { name });
}

export async function inviteMember(input: { email: string; role: string }) {
  await graphqlClient.request(INVITE_MEMBER, input);
}

export async function updateMemberRole(input: { membershipId: string; role: string }) {
  await graphqlClient.request(UPDATE_MEMBER_ROLE, input);
}

export async function removeMember(membershipId: string) {
  await graphqlClient.request(REMOVE_MEMBER, { membershipId });
}
