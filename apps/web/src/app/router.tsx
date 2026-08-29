import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/app/root-layout";
import { DocumentPlaceholder } from "@/features/documents/components/document-placeholder";
import { DocumentDetailStub } from "@/features/documents/components/document-detail-stub";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <DocumentPlaceholder /> },
      { path: "documents/:id", element: <DocumentDetailStub /> },
    ],
  },
]);
