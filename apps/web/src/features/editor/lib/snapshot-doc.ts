import * as Y from "yjs";

function decodeBase64(value: string) {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

export function buildSnapshotDoc(content: unknown): Y.Doc | null {
  const raw = (content as { rawYjsState?: string | null } | null)?.rawYjsState;

  if (!raw) {
    return null;
  }

  try {
    const doc = new Y.Doc();
    Y.applyUpdate(doc, decodeBase64(raw));
    return doc;
  } catch {
    return null;
  }
}
