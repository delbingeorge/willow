import { useMemo, useState } from "react";
import { Switch } from "@base-ui/react/switch";
import { CopyIcon } from "@solar-icons/react/outline/copy";
import { CloseIcon } from "@solar-icons/react/outline/close";
import { Modal, ModalHeader } from "@/shared/components/ui/modal";
import { Select } from "@/shared/components/ui/select";
import { buttonVariants } from "@/shared/components/ui/button";
import { toast } from "@/shared/lib/toast";
import { useAuth } from "@/shared/providers/auth-provider";
import { useOrganization } from "@/features/organization/hooks/use-organization";
import { useDocumentSharing } from "@/features/sharing/hooks/use-document-sharing";
import { useShareActions } from "@/features/sharing/hooks/use-share-actions";
import { useDocumentActions } from "@/features/documents/hooks/use-document-actions";
import type { ShareRole } from "@/features/sharing/types";

const ROLE_OPTIONS = [
  { value: "viewer", label: "Can view" },
  { value: "editor", label: "Can edit" },
];

export function ShareDialog({
  documentId,
  title,
  open,
  onOpenChange,
}: {
  documentId: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const { data: organization } = useOrganization();
  const { data: sharing, isLoading } = useDocumentSharing(documentId, open);
  const actions = useShareActions(documentId);
  const documentActions = useDocumentActions();

  const [pendingUserId, setPendingUserId] = useState("");
  const [pendingRole, setPendingRole] = useState<ShareRole>("viewer");

  const people = useMemo(
    () => (sharing?.shares ?? []).filter((share) => share.user !== null),
    [sharing],
  );

  const candidates = useMemo(() => {
    const taken = new Set(people.map((share) => share.user?.id));
    return (organization?.members ?? [])
      .filter((member) => member.user.id !== user.id && !taken.has(member.user.id))
      .map((member) => ({ value: member.user.id, label: member.user.name }));
  }, [organization, people, user.id]);

  const publicUrl = sharing?.shareLink
    ? `${window.location.origin}${sharing.shareLink}`
    : null;

  const grant = () => {
    if (!pendingUserId) {
      return;
    }
    actions.add.mutate(
      { documentId, userId: pendingUserId, role: pendingRole },
      { onSuccess: () => setPendingUserId("") },
    );
  };

  const copyLink = async () => {
    if (!publicUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy the link", "Copy it from the address bar instead.");
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="md" className="p-5">
      <div className="flex flex-col gap-4">
        <ModalHeader title={`Share “${title || "Untitled"}”`} />

        <div className="flex items-center gap-2">
          <Select
            value={pendingUserId}
            onValueChange={setPendingUserId}
            options={candidates}
            placeholder={candidates.length > 0 ? "Choose a member…" : "No one left to add"}
            disabled={candidates.length === 0}
            aria-label="Member to share with"
            triggerClassName="min-w-0 flex-1"
          />
          <Select
            value={pendingRole}
            onValueChange={(value) => setPendingRole(value as ShareRole)}
            options={ROLE_OPTIONS}
            aria-label="Role for the new member"
            triggerClassName="w-[7.5rem] shrink-0"
          />
          <button
            type="button"
            onClick={grant}
            disabled={!pendingUserId || actions.add.isPending}
            className={buttonVariants({ variant: "primary", className: "shrink-0" })}
          >
            Add
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-medium tracking-wide text-ink-subtle uppercase">
            People with access
          </p>

          {isLoading && <p className="py-2 text-[13px] text-ink-subtle">Loading…</p>}

          {!isLoading && people.length === 0 && (
            <p className="py-2 text-[13px] text-ink-subtle">
              Only you. Add a member above to share this page.
            </p>
          )}

          <div className="flex max-h-[13rem] flex-col overflow-y-auto">
            {people.map((share) => (
              <div key={share.id} className="flex items-center gap-2.5 py-1.5">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-active text-[12px] font-semibold text-ink-muted"
                >
                  {(share.user?.name ?? "?").charAt(0).toUpperCase()}
                </span>

                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[13px] text-ink">{share.user?.name}</span>
                  <span className="truncate text-[12px] text-ink-subtle">
                    {share.user?.email}
                  </span>
                </span>

                <Select
                  value={share.role}
                  onValueChange={(role) =>
                    actions.changeRole.mutate({ shareId: share.id, role: role as ShareRole })
                  }
                  options={ROLE_OPTIONS}
                  aria-label={`Role for ${share.user?.name}`}
                  triggerClassName="w-[7.5rem] shrink-0"
                />

                <button
                  type="button"
                  onClick={() => actions.remove.mutate(share.id)}
                  aria-label={`Remove ${share.user?.name}`}
                  title="Remove access"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-subtle transition-colors hover:bg-surface-hover hover:text-ink"
                >
                  <CloseIcon size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-2.5">
          <label className="flex items-center justify-between gap-3">
            <span className="flex flex-col">
              <span className="text-[13px] font-medium text-ink">Publish to web</span>
              <span className="text-[12px] text-ink-muted">
                Anyone with the link can read this page.
              </span>
            </span>
            <Switch.Root
              checked={sharing?.isPublished ?? false}
              onCheckedChange={(checked) =>
                checked
                  ? documentActions.publish.mutate(documentId)
                  : documentActions.unpublish.mutate(documentId)
              }
              className="relative h-5 w-9 shrink-0 rounded-full bg-surface-active transition-colors outline-none data-[checked]:bg-ink"
            >
              <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-surface shadow-sm transition-transform data-[checked]:translate-x-[1.125rem]" />
            </Switch.Root>
          </label>

          {publicUrl && (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-hover px-2.5 py-1.5">
              <span className="min-w-0 flex-1 truncate text-[12px] text-ink-muted">
                {publicUrl}
              </span>
              <button
                type="button"
                onClick={copyLink}
                aria-label="Copy public link"
                title="Copy link"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-subtle transition-colors hover:bg-surface-active hover:text-ink"
              >
                <CopyIcon size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
