import { useParams } from "react-router";
import { useDocumentTree } from "@/features/documents/hooks/use-document-tree";
import { CollaborativeEditor } from "@/features/editor/components/collaborative-editor";

export function DocumentEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { data } = useDocumentTree();
  const title = data?.find((document) => document.id === id)?.title ?? "Untitled";

  if (!id) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <h1 className="mb-4 text-2xl font-semibold text-fg-4">{title}</h1>
      <CollaborativeEditor key={id} documentId={id} />
    </div>
  );
}
