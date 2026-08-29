import { Outlet } from "react-router";
import { AppShell } from "@/shared/components/layout/app-shell";
import { DocumentList } from "@/features/documents/components/document-list";
import { MigrationPrompt } from "@/features/local-docs/components/migration-prompt";

export function RootLayout() {
  return (
    <>
      <AppShell documentList={<DocumentList />}>
        <Outlet />
      </AppShell>
      <MigrationPrompt />
    </>
  );
}
