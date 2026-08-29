import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { createDocument } from "@/features/documents/api/create-document";
import { importDocumentState } from "@/features/local-docs/api/import-document-state";
import { deleteLocalDocument, type LocalDocument } from "@/features/local-docs/lib/local-doc-store";

const CHUNK_SIZE = 0x8000;

function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += CHUNK_SIZE) {
    const chunk = bytes.subarray(offset, offset + CHUNK_SIZE);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

async function readLocalState(id: string) {
  const ydoc = new Y.Doc();
  const persistence = new IndexeddbPersistence(id, ydoc);

  try {
    await persistence.whenSynced;
    const title = ydoc.getText("title").toString().trim();
    const state = Y.encodeStateAsUpdate(ydoc);
    return { state, title };
  } finally {
    await persistence.destroy();
  }
}

export async function migrateLocalDocument(document: LocalDocument) {
  const { state, title } = await readLocalState(document.id);
  const created = await createDocument(title || document.title || "Untitled");
  await importDocumentState({ id: created.id, state: toBase64(state) });
  await deleteLocalDocument(document.id);
  return created;
}

export async function migrateLocalDocuments(documents: LocalDocument[]) {
  const failed: LocalDocument[] = [];

  for (const document of documents) {
    try {
      await migrateLocalDocument(document);
    } catch {
      failed.push(document);
    }
  }

  return { failed };
}
