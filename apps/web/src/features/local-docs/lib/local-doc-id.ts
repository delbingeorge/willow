import { nanoid } from "nanoid";

export const LOCAL_DOC_PREFIX = "local_";

export function isLocalDocumentId(id: string) {
  return id.startsWith(LOCAL_DOC_PREFIX);
}

export function createLocalDocumentId() {
  return `${LOCAL_DOC_PREFIX}${nanoid()}`;
}
