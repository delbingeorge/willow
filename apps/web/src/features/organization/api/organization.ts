import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";
import type { Organization } from "@/features/organization/types";

const ORGANIZATION_QUERY = gql`
  query Organization {
    organization {
      id
      name
      slug
      plan
      memberCount
      members {
        id
        role
        user {
          id
          name
          email
        }
      }
    }
  }
`;

export async function fetchOrganization() {
  const { organization } = await graphqlClient.request<{ organization: Organization }>(
    ORGANIZATION_QUERY,
  );
  return organization;
}
