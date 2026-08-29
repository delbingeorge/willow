import type { ReactNode } from "react";
import { IconRail } from "@/shared/components/layout/icon-rail";
import { useListPanel } from "@/shared/hooks/use-list-panel";

export function AppShell({
  documentList,
  children,
}: {
  documentList: ReactNode;
  children: ReactNode;
}) {
  const { collapsed } = useListPanel();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface text-ink">
      <IconRail />
      {!collapsed && (
        <aside className="flex w-[260px] shrink-0 flex-col overflow-hidden border-r border-border">
          {documentList}
        </aside>
      )}
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
