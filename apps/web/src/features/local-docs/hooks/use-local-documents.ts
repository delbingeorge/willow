import { useSyncExternalStore } from "react";
import {
  getLocalDocuments,
  subscribeLocalDocuments,
} from "@/features/local-docs/lib/local-doc-store";

export function useLocalDocuments() {
  return useSyncExternalStore(subscribeLocalDocuments, getLocalDocuments);
}
