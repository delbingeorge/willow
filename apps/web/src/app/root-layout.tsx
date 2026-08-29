import { Outlet } from "react-router";
import { AppShell } from "@/shared/components/layout/app-shell";
import { DocumentList } from "@/features/documents/components/document-list";

export function RootLayout() {
  return (
    <AppShell documentList={<DocumentList />}>
      <Outlet />
    </AppShell>
  );
}
