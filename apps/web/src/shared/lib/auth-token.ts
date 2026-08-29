let currentToken: string | null = null;

export function getAuthToken() {
  return currentToken;
}

export function setAuthToken(token: string | null) {
  currentToken = token;
}
