import { useSearchParams } from "react-router";
import { parseScope, type DocumentScope } from "@/features/documents/lib/document-scope";

export function useDocumentScope() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scope = parseScope(searchParams.get("scope"));

  const setScope = (next: DocumentScope) => {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        if (next === "all") {
          params.delete("scope");
        } else {
          params.set("scope", next);
        }
        return params;
      },
      { replace: true },
    );
  };

  return { scope, setScope };
}
