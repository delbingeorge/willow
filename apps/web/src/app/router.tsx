import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/app/root-layout";
import { DocumentEditorPage } from "@/features/editor/components/document-editor-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{ path: "documents/:id", element: <DocumentEditorPage /> }],
  },
]);
