import { useParams } from "react-router";
import { isLocalDocumentId } from "@/features/local-docs/lib/local-doc-id";
import { CollaborativeEditor } from "@/features/editor/components/collaborative-editor";
import { LocalEditor } from "@/features/editor/components/local-editor";
import { useAuth } from "@/shared/providers/auth-provider";
import { buttonVariants } from "@/shared/components/ui/button";

export function DocumentEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isSigningIn, signIn } = useAuth();

  if (!id) {
    return null;
  }

  if (isLocalDocumentId(id)) {
    return <LocalEditor key={id} documentId={id} />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-ink-subtle">
        <p>This document is stored in the cloud.</p>
        <button
          type="button"
          onClick={signIn}
          disabled={isSigningIn}
          className={buttonVariants({ variant: "primary" })}
        >
          {isSigningIn ? "Signing in…" : "Sign in to open it"}
        </button>
      </div>
    );
  }

  return <CollaborativeEditor key={id} documentId={id} user={user} />;
}
