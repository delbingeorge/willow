import type { OnlineUser } from "@/features/editor/hooks/use-online-users";

const MAX_VISIBLE = 4;

export function OnlineAvatars({ users }: { users: OnlineUser[] }) {
  if (users.length === 0) {
    return null;
  }

  const visible = users.slice(0, MAX_VISIBLE);
  const overflow = users.length - visible.length;

  return (
    <div
      className="flex items-center"
      aria-label={`${users.length} ${users.length === 1 ? "person" : "people"} here`}
    >
      {visible.map((user) => (
        <span
          key={user.clientId}
          title={user.name}
          style={{ backgroundColor: user.color }}
          className="-ml-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ring-2 ring-surface first:ml-0"
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
      ))}

      {overflow > 0 && (
        <span className="-ml-1.5 flex h-6 shrink-0 items-center justify-center rounded-full bg-surface-active px-1.5 text-[11px] font-medium text-ink-muted ring-2 ring-surface">
          +{overflow}
        </span>
      )}
    </div>
  );
}
