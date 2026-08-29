import { useEffect } from "react";
import { useAuth } from "@/shared/providers/auth-provider";
import { useLocalDocuments } from "@/features/local-docs/hooks/use-local-documents";
import { MigrationDialog } from "@/features/local-docs/components/migration-dialog";

export function MigrationPrompt() {
  const { justSignedIn, acknowledgeSignIn } = useAuth();
  const documents = useLocalDocuments();
  const hasDocuments = documents.length > 0;

  useEffect(() => {
    if (justSignedIn && !hasDocuments) {
      acknowledgeSignIn();
    }
  }, [justSignedIn, hasDocuments, acknowledgeSignIn]);

  if (!justSignedIn || !hasDocuments) {
    return null;
  }

  return <MigrationDialog onDismiss={acknowledgeSignIn} />;
}
