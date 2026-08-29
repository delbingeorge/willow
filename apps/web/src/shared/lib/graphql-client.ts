import { GraphQLClient } from "graphql-request";
import { getAuthToken } from "@/shared/lib/auth-token";

const API_URL = import.meta.env.VITE_API_URL;

export const graphqlClient = new GraphQLClient(`${API_URL}/graphql`, {
  requestMiddleware: (request) => {
    const token = getAuthToken();
    const headers = new Headers(request.headers);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return { ...request, headers };
  },
});
