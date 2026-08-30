import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconRail } from "@/shared/components/layout/icon-rail";
import { useListPanel } from "@/shared/hooks/use-list-panel";
import { transitions } from "@/shared/lib/motion";

const PANEL_WIDTH = 260;

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
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.aside
            key="document-list"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: PANEL_WIDTH, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={transitions.panel}
            className="flex shrink-0 flex-col overflow-hidden border-r border-border"
          >
            <div style={{ width: PANEL_WIDTH }} className="flex h-full flex-col">
              {documentList}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
