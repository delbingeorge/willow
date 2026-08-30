import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Tabs } from "@base-ui/react/tabs";
import { CloseIcon } from "@solar-icons/react/outline/close";
import { Select } from "@/shared/components/ui/select";
import { buttonVariants } from "@/shared/components/ui/button";
import { confirmDialog } from "@/shared/lib/dialog-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { useOrganization } from "@/features/organization/hooks/use-organization";
import { useOrganizationActions } from "@/features/organization/hooks/use-organization-actions";
import type { OrganizationMember } from "@/features/organization/types";

const ROLE_OPTIONS = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
];

const INPUT_CLASS =
  "h-9 w-full rounded-lg border border-border bg-surface px-2.5 text-[13px] text-ink outline-none placeholder:text-ink-subtle focus:border-ink-subtle";

function WorkspaceTab({ name }: { name: string }) {
  const actions = useOrganizationActions();
  const [value, setValue] = useState(name);

  useEffect(() => {
    setValue(name);
  }, [name]);

  const trimmed = value.trim();
  const dirty = trimmed.length > 0 && trimmed !== name;

  return (
    <form
      className="flex max-w-md flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (dirty) {
          actions.rename.mutate(trimmed);
        }
      }}
    >
      <label htmlFor="workspace-name" className="text-[13px] font-medium text-ink">
        Workspace name
      </label>
      <div className="flex items-center gap-2">
        <input
          id="workspace-name"
          value={value}
          maxLength={100}
          onChange={(event) => setValue(event.target.value)}
          className={INPUT_CLASS}
        />
        <button
          type="submit"
          disabled={!dirty || actions.rename.isPending}
          className={buttonVariants({ variant: "primary", className: "h-9 shrink-0" })}
        >
          Save
        </button>
      </div>
    </form>
  );
}

function MemberRow({ member, canEdit }: { member: OrganizationMember; canEdit: boolean }) {
  const actions = useOrganizationActions();

  const confirmRemove = async () => {
    const confirmed = await confirmDialog({
      title: `Remove ${member.user.name}?`,
      description: "They lose access to this workspace and every document in it.",
      confirmLabel: "Remove",
      destructive: true,
    });

    if (confirmed) {
      actions.remove.mutate(member.id);
    }
  };

  return (
    <div className="flex items-center gap-3 border-b border-border py-2.5 last:border-b-0">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-active text-[12px] font-semibold text-ink-muted"
      >
        {member.user.name.charAt(0).toUpperCase()}
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13px] text-ink">{member.user.name}</span>
        <span className="truncate text-[12px] text-ink-subtle">{member.user.email}</span>
      </span>

      <Select
        value={member.role}
        onValueChange={(role) => actions.changeRole.mutate({ membershipId: member.id, role })}
        options={ROLE_OPTIONS}
        disabled={!canEdit}
        aria-label={`Role for ${member.user.name}`}
        triggerClassName="w-[7.5rem] shrink-0"
      />

      <button
        type="button"
        onClick={confirmRemove}
        disabled={!canEdit}
        aria-label={`Remove ${member.user.name}`}
        title="Remove from workspace"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-subtle transition-colors hover:bg-surface-hover hover:text-ink disabled:opacity-40"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}

function MembersTab({ members }: { members: OrganizationMember[] }) {
  const { user } = useAuth();
  const actions = useOrganizationActions();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const ordered = [...members].sort((a, b) => a.user.name.localeCompare(b.user.name));

  return (
    <div className="flex flex-col gap-5">
      <form
        className="flex max-w-xl flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = email.trim();
          if (trimmed) {
            actions.invite.mutate({ email: trimmed, role }, { onSuccess: () => setEmail("") });
          }
        }}
      >
        <label htmlFor="invite-email" className="text-[13px] font-medium text-ink">
          Add a member
        </label>
        <div className="flex items-center gap-2">
          <input
            id="invite-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            className={INPUT_CLASS}
          />
          <Select
            value={role}
            onValueChange={setRole}
            options={ROLE_OPTIONS}
            aria-label="Role for the new member"
            triggerClassName="h-9 w-[7.5rem] shrink-0"
          />
          <button
            type="submit"
            disabled={!email.trim() || actions.invite.isPending}
            className={buttonVariants({ variant: "primary", className: "h-9 shrink-0" })}
          >
            Add
          </button>
        </div>
        <p className="text-[12px] text-ink-subtle">
          They need a Willow account already — adding someone here grants an existing user
          access.
        </p>
      </form>

      <div className="flex max-w-xl flex-col">
        {ordered.map((member) => (
          <MemberRow key={member.id} member={member} canEdit={member.user.id !== user.id} />
        ))}
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: organization, isLoading, isError } = useOrganization();

  const tab = searchParams.get("tab") === "members" ? "members" : "workspace";

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-[860px] px-14 py-12">
        <h1 className="mb-6 text-[22px] font-semibold tracking-tight text-ink">Settings</h1>

        {isLoading && <p className="text-[13px] text-ink-subtle">Loading…</p>}
        {isError && (
          <p className="text-[13px] text-ink-subtle">Couldn&apos;t load this workspace.</p>
        )}

        {organization && (
          <Tabs.Root
            value={tab}
            onValueChange={(next) => {
              const params = new URLSearchParams(searchParams);
              if (next === "workspace") {
                params.delete("tab");
              } else {
                params.set("tab", String(next));
              }
              setSearchParams(params, { replace: true });
            }}
          >
            <Tabs.List className="mb-6 flex items-center gap-1 border-b border-border">
              {[
                { value: "workspace", label: "Workspace" },
                { value: "members", label: `Members (${organization.memberCount})` },
              ].map((entry) => (
                <Tabs.Tab
                  key={entry.value}
                  value={entry.value}
                  className="-mb-px cursor-default border-b-2 border-transparent px-2.5 pb-2 text-[13px] text-ink-muted outline-none transition-colors hover:text-ink data-[selected]:border-ink data-[selected]:font-medium data-[selected]:text-ink"
                >
                  {entry.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            <Tabs.Panel value="workspace" className="outline-none">
              <WorkspaceTab name={organization.name} />
            </Tabs.Panel>
            <Tabs.Panel value="members" className="outline-none">
              <MembersTab members={organization.members} />
            </Tabs.Panel>
          </Tabs.Root>
        )}
      </div>
    </div>
  );
}
