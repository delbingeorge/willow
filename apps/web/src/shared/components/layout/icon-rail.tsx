import type { ComponentType } from "react";
import { Link } from "react-router";
import { WidgetIcon } from "@solar-icons/react/outline/widget";
import { WidgetIcon as WidgetIconBold } from "@solar-icons/react/bold/widget";
import { ClockCircleIcon } from "@solar-icons/react/outline/clock-circle";
import { ClockCircleIcon as ClockCircleIconBold } from "@solar-icons/react/bold/clock-circle";
import { CloudIcon } from "@solar-icons/react/outline/cloud";
import { CloudIcon as CloudIconBold } from "@solar-icons/react/bold/cloud";
import { PenNewSquareIcon } from "@solar-icons/react/outline/pen-new-square";
import { PenNewSquareIcon as PenNewSquareIconBold } from "@solar-icons/react/bold/pen-new-square";
import { GlobalIcon } from "@solar-icons/react/outline/global";
import { GlobalIcon as GlobalIconBold } from "@solar-icons/react/bold/global";
import { ArchiveIcon } from "@solar-icons/react/outline/archive";
import { ArchiveIcon as ArchiveIconBold } from "@solar-icons/react/bold/archive";
import { MagnifierIcon } from "@solar-icons/react/outline/magnifier";
import { UsersGroupRoundedIcon } from "@solar-icons/react/outline/users-group-rounded";
import { ShareIcon } from "@solar-icons/react/outline/share";
import { SettingsIcon } from "@solar-icons/react/outline/settings";
import { LoginIcon } from "@solar-icons/react/outline/login";
import { SidebarMinimalisticIcon } from "@solar-icons/react/outline/sidebar-minimalistic";
import { Logo } from "@/shared/components/logo";
import { useAuth } from "@/shared/providers/auth-provider";
import { useListPanel } from "@/shared/hooks/use-list-panel";
import { useDocumentScope } from "@/features/documents/hooks/use-document-scope";
import { SCOPE_LABELS, type DocumentScope } from "@/features/documents/lib/document-scope";
import { cn } from "@/shared/lib/cn";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

function RailButton({
  icon: Icon,
  activeIcon: ActiveIcon,
  label,
  active,
  iconClassName,
  onClick,
  comingSoon,
}: {
  icon: IconComponent;
  activeIcon?: IconComponent;
  label: string;
  active?: boolean;
  iconClassName?: string;
  onClick?: () => void;
  comingSoon?: boolean;
}) {
  const Glyph = active && ActiveIcon ? ActiveIcon : Icon;
  const title = comingSoon ? `${label} — coming soon` : label;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      aria-current={active ? "page" : undefined}
      title={title}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
        active
          ? "border border-border bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          : "hover:bg-surface-hover",
      )}
    >
      <Glyph
        size={20}
        className={cn(iconClassName ?? (active ? "text-ink" : "text-ink-subtle"))}
      />
    </button>
  );
}

function RailDivider() {
  return <span aria-hidden="true" className="my-1 h-px w-6 bg-border" />;
}

export function IconRail() {
  const { user, isAuthenticated, isSigningIn, signIn, signOut, error } = useAuth();
  const { scope, setScope } = useDocumentScope();
  const { collapsed, toggle, expand } = useListPanel();

  const scopeButton = (
    value: DocumentScope,
    icon: IconComponent,
    activeIcon: IconComponent,
    iconClassName?: string,
  ) => (
    <RailButton
      icon={icon}
      activeIcon={activeIcon}
      label={SCOPE_LABELS[value]}
      active={scope === value}
      iconClassName={scope === value ? undefined : iconClassName}
      onClick={() => {
        setScope(value);
        expand();
      }}
    />
  );

  return (
    <aside className="flex w-[60px] shrink-0 flex-col items-center gap-1.5 border-r border-border bg-surface py-3">
      <Link
        to="/"
        aria-label="Willow home"
        title="Willow"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink text-surface"
      >
        <Logo className="size-4" />
      </Link>

      <RailButton
        icon={SidebarMinimalisticIcon}
        label={collapsed ? "Show document list" : "Hide document list"}
        onClick={toggle}
      />

      <RailDivider />

      {scopeButton("all", WidgetIcon, WidgetIconBold)}
      {scopeButton("recent", ClockCircleIcon, ClockCircleIconBold)}
      {isAuthenticated &&
        scopeButton("cloud", CloudIcon, CloudIconBold, "text-signal-synced")}
      {scopeButton("local", PenNewSquareIcon, PenNewSquareIconBold, "text-signal-local")}
      {isAuthenticated && scopeButton("published", GlobalIcon, GlobalIconBold)}
      {isAuthenticated && scopeButton("archived", ArchiveIcon, ArchiveIconBold)}

      <RailDivider />

      <RailButton icon={MagnifierIcon} label="Search" comingSoon />
      <RailButton icon={UsersGroupRoundedIcon} label="Members" comingSoon />
      <RailButton icon={ShareIcon} label="Shared with me" comingSoon />
      <RailButton icon={SettingsIcon} label="Settings" comingSoon />

      <div className="flex-1" />

      {isAuthenticated && user ? (
        <button
          type="button"
          onClick={signOut}
          title={`${user.name} — click to sign out`}
          aria-label={`Signed in as ${user.name}. Click to sign out.`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-[13px] font-semibold text-surface"
        >
          {user.name.charAt(0).toUpperCase()}
        </button>
      ) : (
        <button
          type="button"
          onClick={signIn}
          disabled={isSigningIn}
          title={error ? `Sign-in failed: ${error}` : "Sign in to sync to the cloud"}
          aria-label="Sign in"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors disabled:opacity-50",
            error
              ? "border-red-200 text-red-500"
              : "border-border text-ink-subtle hover:text-ink",
          )}
        >
          <LoginIcon size={16} />
        </button>
      )}
    </aside>
  );
}
