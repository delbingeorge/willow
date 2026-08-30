import { gql } from "graphql-request";
import { graphqlClient } from "@/shared/lib/graphql-client";
import type { SearchResult } from "@/features/search/types";

const SEARCH_QUERY = gql`
  query Search($query: String!) {
    search(query: $query) {
      id
      title
      icon
      snippet
      updatedAt
    }
  }
`;

export async function fetchSearchResults(query: string) {
  const { search } = await graphqlClient.request<{ search: SearchResult[] }>(SEARCH_QUERY, {
    query,
  });
  return search;
}
