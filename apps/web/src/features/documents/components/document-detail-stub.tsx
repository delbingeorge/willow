import { useParams } from "react-router";
import { useDocumentTree } from "@/features/documents/hooks/use-document-tree";

export function DocumentDetailStub() {
  const { id } = useParams<{ id: string }>();
  const { data } = useDocumentTree();
  const title =
    data?.find((document) => document.id === id)?.title ?? "Document";

  return (
    <div className="flex h-full items-center justify-center text-sm text-fg-3">
      {title} — editor coming soon
    </div>
  );
}
