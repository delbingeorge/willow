import type { ComponentType } from "react";
import { Link } from "react-router";
import { WidgetIcon } from "@solar-icons/react/outline/widget";
import { WidgetIcon as WidgetIconBold } from "@solar-icons/react/bold/widget";
import { ArchiveIcon } from "@solar-icons/react/outline/archive";
import { ArchiveIcon as ArchiveIconBold } from "@solar-icons/react/bold/archive";
import { MagnifierIcon } from "@solar-icons/react/outline/magnifier";
import { UsersGroupRoundedIcon } from "@solar-icons/react/outline/users-group-rounded";
import { ShareIcon } from "@solar-icons/react/outline/share";
import { SettingsIcon } from "@solar-icons/react/outline/settings";
import { SidebarMinimalisticIcon } from "@solar-icons/react/outline/sidebar-minimalistic";
import { Logo } from "@/shared/components/logo";
import { useAuth } from "@/shared/providers/auth-provider";
import { useListPanel } from "@/shared/hooks/use-list-panel";
import { useCommandPalette } from "@/shared/hooks/use-command-palette";
import { useDocumentScope } from "@/features/documents/hooks/use-document-scope";
import { SCOPE_LABELS, type DocumentScope } from "@/features/documents/lib/document-scope";
import { cn } from "@/shared/lib/cn";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

function RailButton({
  icon: Icon,
  activeIcon: ActiveIcon,
  label,
  active,
  onClick,
  comingSoon,
}: {
  icon: IconComponent;
  activeIcon?: IconComponent;
  label: string;
  active?: boolean;
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
      <Glyph size={20} className={active ? "text-ink" : "text-ink-subtle"} />
    </button>
  );
}

function RailDivider() {
  return <span aria-hidden="true" className="my-1 h-px w-6 bg-border" />;
}

export function IconRail() {
  const { user } = useAuth();
  const { scope, setScope } = useDocumentScope();
  const { collapsed, toggle, expand } = useListPanel();
  const commandPalette = useCommandPalette();

  const scopeButton = (
    value: DocumentScope,
    icon: IconComponent,
    activeIcon: IconComponent,
  ) => (
    <RailButton
      icon={icon}
      activeIcon={activeIcon}
      label={SCOPE_LABELS[value]}
      active={scope === value}
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
      {scopeButton("archived", ArchiveIcon, ArchiveIconBold)}

      <RailDivider />

      <RailButton
        icon={MagnifierIcon}
        label="Search"
        onClick={() => commandPalette.setOpen(true)}
      />
      <RailButton icon={UsersGroupRoundedIcon} label="Members" comingSoon />
      <RailButton icon={ShareIcon} label="Shared with me" comingSoon />
      <RailButton icon={SettingsIcon} label="Settings" comingSoon />

      <div className="flex-1" />

      <span
        title={user.name}
        aria-label={`Signed in as ${user.name}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-[13px] font-semibold text-surface"
      >
        {user.name.charAt(0).toUpperCase()}
      </span>
    </aside>
  );
}
