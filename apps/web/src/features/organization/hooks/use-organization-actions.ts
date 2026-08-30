import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateOrganization,
  inviteMember,
  updateMemberRole,
  removeMember,
} from "@/features/organization/api/members";
import { graphqlErrorMessage } from "@/shared/lib/graphql-error";
import { toast } from "@/shared/lib/toast";

export function useOrganizationActions() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["organization"] });

  const settled = (message: string, failure: string) => ({
    onSuccess: async () => {
      await invalidate();
      toast.success(message);
    },
    onError: (error: unknown) => toast.error(failure, graphqlErrorMessage(error, "Please try again.")),
  });

  return {
    rename: useMutation({
      mutationFn: updateOrganization,
      ...settled("Workspace renamed", "Couldn't rename the workspace"),
    }),
    invite: useMutation({
      mutationFn: inviteMember,
      ...settled("Member added", "Couldn't add that member"),
    }),
    changeRole: useMutation({
      mutationFn: updateMemberRole,
      ...settled("Role updated", "Couldn't change that role"),
    }),
    remove: useMutation({
      mutationFn: removeMember,
      ...settled("Member removed", "Couldn't remove that member"),
    }),
  };
}
