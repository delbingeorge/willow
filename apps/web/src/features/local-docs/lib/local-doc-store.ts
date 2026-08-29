import { clearDocument } from "y-indexeddb";
import { createLocalDocumentId } from "@/features/local-docs/lib/local-doc-id";

export interface LocalDocument {
  id: string;
  title: string;
  updatedAt: string;
}

const STORAGE_KEY = "willow.local-documents";

let cache: LocalDocument[] | null = null;
const listeners = new Set<() => void>();

function isLocalDocument(value: unknown): value is LocalDocument {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

function read(): LocalDocument[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isLocalDocument) : [];
  } catch {
    return [];
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

function persist(documents: LocalDocument[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    return true;
  } catch {
    return false;
  }
}

function write(documents: LocalDocument[]) {
  cache = documents;
  persist(documents);
  notify();
}

export function getLocalDocuments(): LocalDocument[] {
  if (cache === null) {
    cache = read();
  }
  return cache;
}

export function subscribeLocalDocuments(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function handleStorageEvent(event: StorageEvent) {
  if (event.key === STORAGE_KEY || event.key === null) {
    cache = read();
    notify();
  }
}

window.addEventListener("storage", handleStorageEvent);

export function createLocalDocument(): LocalDocument {
  const document: LocalDocument = {
    id: createLocalDocumentId(),
    title: "Untitled",
    updatedAt: new Date().toISOString(),
  };
  write([document, ...getLocalDocuments()]);
  return document;
}

export function renameLocalDocument(id: string, title: string) {
  const documents = getLocalDocuments();
  if (!documents.some((document) => document.id === id)) {
    return;
  }
  write(
    documents.map((document) =>
      document.id === id
        ? { ...document, title, updatedAt: new Date().toISOString() }
        : document,
    ),
  );
}

export async function deleteLocalDocument(id: string) {
  write(getLocalDocuments().filter((document) => document.id !== id));
  try {
    await clearDocument(id);
  } catch {
    return;
  }
}
