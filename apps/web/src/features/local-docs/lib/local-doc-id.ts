export const LOCAL_DOC_PREFIX = "local_";

export function isLocalDocumentId(id: string) {
  return id.startsWith(LOCAL_DOC_PREFIX);
}
