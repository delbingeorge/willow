import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/app/root-layout";
import { RouteError } from "@/app/route-error";
import { DocumentEditorPage } from "@/features/editor/components/document-editor-page";
import { SettingsPage } from "@/features/organization/components/settings-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { path: "documents/:id", element: <DocumentEditorPage />, errorElement: <RouteError /> },
      { path: "settings", element: <SettingsPage />, errorElement: <RouteError /> },
      { path: "*", element: <RouteError /> },
    ],
  },
]);
