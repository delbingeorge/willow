import { useParams } from "react-router";
import { CollaborativeEditor } from "@/features/editor/components/collaborative-editor";

export function DocumentEditorPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <CollaborativeEditor key={id} documentId={id} />;
}
