import { createBrowserRouter, Navigate } from "react-router";
import { AuthenticatedLayout } from "@/app/authenticated-layout";
import { RouteError } from "@/app/route-error";
import { DocumentsPage } from "@/features/documents/components/documents-page";
import { DocumentEditorPage } from "@/features/editor/components/document-editor-page";
import { SettingsPage } from "@/features/organization/components/settings-page";
import { SharedDocumentPage } from "@/features/sharing/components/shared-document-page";

export const router = createBrowserRouter([
  {
    path: "/shared/:token",
    element: <SharedDocumentPage />,
    errorElement: <RouteError />,
  },
  {
    path: "/",
    element: <AuthenticatedLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Navigate to="/documents" replace /> },
      { path: "documents", element: <DocumentsPage />, errorElement: <RouteError /> },
      { path: "documents/:id", element: <DocumentEditorPage />, errorElement: <RouteError /> },
      { path: "settings", element: <SettingsPage />, errorElement: <RouteError /> },
      { path: "*", element: <RouteError /> },
    ],
  },
]);
