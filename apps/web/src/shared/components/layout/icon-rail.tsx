import type { ComponentType } from "react";
import { Link, NavLink } from "react-router";
import { DocumentsIcon } from "@solar-icons/react/bold/documents";
import { MagnifierIcon } from "@solar-icons/react/bold/magnifier";
import { UsersGroupRoundedIcon } from "@solar-icons/react/bold/users-group-rounded";
import { ShareIcon } from "@solar-icons/react/bold/share";
import { SettingsIcon } from "@solar-icons/react/bold/settings";
import { Logo } from "@/shared/components/logo";
import { useAuth } from "@/shared/providers/auth-provider";
import { cn } from "@/shared/lib/cn";

type RailButtonProps = {
  icon: ComponentType<{ size?: number; className?: string }>;
  active?: boolean;
} & ({ to: string; comingSoon?: never } | { to?: never; comingSoon: string });

function RailButton({ icon: Icon, active, ...props }: RailButtonProps) {
  const className = cn(
    "flex h-8 w-8 shrink-0 items-center justify-center hover:cursor-pointer",
    active ? "text-[#242424]" : "text-[#DFDFDF]",
  );

  if (props.to) {
    return (
      <NavLink to={props.to} end className={className}>
        <Icon size={25} />
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      className={className}
      title={`${props.comingSoon} — coming soon`}
    >
      <Icon size={22} />
    </button>
  );
}

export function IconRail() {
  const { user } = useAuth();
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <aside className="flex w-14 shrink-0 flex-col items-center gap-2.5">
      <Link to="/" aria-label="Willow home">
        <Logo className="size-8" />
      </Link>

      <div className="mt-4 flex flex-col items-center gap-5">
        <RailButton icon={DocumentsIcon} to="/" active />
        <RailButton icon={MagnifierIcon} comingSoon="Search" />
        <RailButton icon={UsersGroupRoundedIcon} comingSoon="Members" />
        <RailButton icon={ShareIcon} comingSoon="Shared with me" />
        <RailButton icon={SettingsIcon} comingSoon="Settings" />
      </div>

      <div className="flex-1" />

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
        {initial}
      </div>
    </aside>
  );
}
