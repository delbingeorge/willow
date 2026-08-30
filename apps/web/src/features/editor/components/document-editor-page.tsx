import { useParams } from "react-router";
import { CollaborativeEditor } from "@/features/editor/components/collaborative-editor";
import { useAuth } from "@/shared/providers/auth-provider";

export function DocumentEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  if (!id) {
    return null;
  }

  return <CollaborativeEditor key={id} documentId={id} user={user} />;
}
