import type { ReactNode } from "react";
import { IconRail } from "@/shared/components/layout/icon-rail";

export function AppShell({
  documentList,
  children,
}: {
  documentList: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen gap-2.5 bg-background p-4 text-fg-4">
      <IconRail />
      <aside className="flex w-82 shrink-0 flex-col overflow-y-auto rounded-3xl bg-white p-4">
        {documentList}
      </aside>
      <main className="flex flex-1 flex-col overflow-y-auto rounded-3xl bg-white p-6">
        {children}
      </main>
    </div>
  );
}
