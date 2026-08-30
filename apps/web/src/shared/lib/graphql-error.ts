export function graphqlErrorMessage(error: unknown, fallback: string) {
  const response = (error as { response?: { errors?: { message?: string }[] } })?.response;
  const message = response?.errors?.[0]?.message;
  return typeof message === "string" && message.length > 0 ? message : fallback;
}
