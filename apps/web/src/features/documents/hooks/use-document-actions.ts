import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveDocument,
  restoreDocument,
  deleteDocument,
  duplicateDocument,
  publishDocument,
  unpublishDocument,
  renameDocument,
} from "@/features/documents/api/document-actions";
import { toast } from "@/shared/lib/toast";

export function useDocumentActions() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["documents", "tree"] }),
      queryClient.invalidateQueries({ queryKey: ["documents", "archived"] }),
      queryClient.invalidateQueries({ queryKey: ["documents", "sharing"] }),
      queryClient.invalidateQueries({ queryKey: ["documents", "detail"] }),
    ]);

  const settled = (message: string, failure: string) => ({
    onSuccess: async () => {
      await invalidate();
      toast.success(message);
    },
    onError: () => toast.error(failure, "Please try again."),
  });

  return {
    archive: useMutation({
      mutationFn: archiveDocument,
      ...settled("Moved to archive", "Couldn't archive that document"),
    }),
    restore: useMutation({
      mutationFn: restoreDocument,
      ...settled("Restored", "Couldn't restore that document"),
    }),
    remove: useMutation({
      mutationFn: deleteDocument,
      ...settled("Document deleted", "Couldn't delete that document"),
    }),
    duplicate: useMutation({
      mutationFn: duplicateDocument,
      ...settled("Duplicated", "Couldn't duplicate that document"),
    }),
    publish: useMutation({
      mutationFn: publishDocument,
      ...settled("Published to the web", "Couldn't publish that document"),
    }),
    unpublish: useMutation({
      mutationFn: unpublishDocument,
      ...settled("Unpublished", "Couldn't unpublish that document"),
    }),
    rename: useMutation({
      mutationFn: renameDocument,
      ...settled("Renamed", "Couldn't rename that document"),
    }),
  };
}
