import { useParams } from "react-router";
import { isLocalDocumentId } from "@/features/local-docs/lib/local-doc-id";
import { CollaborativeEditor } from "@/features/editor/components/collaborative-editor";
import { LocalEditor } from "@/features/editor/components/local-editor";

export function DocumentEditorPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return null;
  }

  if (isLocalDocumentId(id)) {
    return <LocalEditor key={id} documentId={id} />;
  }

  return <CollaborativeEditor key={id} documentId={id} />;
}
