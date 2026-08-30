import { Outlet } from "react-router";
import { AppShell } from "@/shared/components/layout/app-shell";
import { DocumentList } from "@/features/documents/components/document-list";
import { SearchPalette } from "@/features/search/components/search-palette";
import { useGlobalShortcuts } from "@/shared/hooks/use-global-shortcuts";

export function RootLayout() {
  useGlobalShortcuts();

  return (
    <>
      <AppShell documentList={<DocumentList />}>
        <Outlet />
      </AppShell>
      <SearchPalette />
    </>
  );
}
