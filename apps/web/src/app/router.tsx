import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/app/root-layout";
import { DocumentPlaceholder } from "@/features/documents/components/document-placeholder";
import { DocumentEditorPage } from "@/features/editor/components/document-editor-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <DocumentPlaceholder /> },
      { path: "documents/:id", element: <DocumentEditorPage /> },
    ],
  },
]);
