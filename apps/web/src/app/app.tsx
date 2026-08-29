import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { router } from "@/app/router";
import { AuthProvider } from "@/shared/providers/auth-provider";
import { queryClient } from "@/shared/lib/query-client";
import { setupToaster } from "@/shared/lib/toast";
import { DialogHost } from "@/shared/components/ui/dialog-host";

export function App() {
  useEffect(() => {
    setupToaster();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <DialogHost />
    </QueryClientProvider>
  );
}
