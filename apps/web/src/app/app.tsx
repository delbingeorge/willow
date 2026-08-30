import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { MotionConfig } from "framer-motion";
import { router } from "@/app/router";
import { queryClient } from "@/shared/lib/query-client";
import { setupToaster } from "@/shared/lib/toast";
import { DialogHost } from "@/shared/components/ui/dialog-host";

export function App() {
  useEffect(() => {
    setupToaster();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <DialogHost />
      </QueryClientProvider>
    </MotionConfig>
  );
}
