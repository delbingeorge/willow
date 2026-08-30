import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shareDocument, updateShare, removeShare } from "@/features/sharing/api/shares";
import { toast } from "@/shared/lib/toast";

export function useShareActions(documentId: string) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["documents", "sharing", documentId] });

  const settled = (message: string, failure: string) => ({
    onSuccess: async () => {
      await invalidate();
      toast.success(message);
    },
    onError: () => toast.error(failure, "Please try again."),
  });

  return {
    add: useMutation({
      mutationFn: shareDocument,
      ...settled("Access granted", "Couldn't share that document"),
    }),
    changeRole: useMutation({
      mutationFn: updateShare,
      ...settled("Role updated", "Couldn't change that role"),
    }),
    remove: useMutation({
      mutationFn: removeShare,
      ...settled("Access removed", "Couldn't remove that person"),
    }),
  };
}
