import { AuthProvider } from "@/shared/providers/auth-provider";
import { RootLayout } from "@/app/root-layout";

export function AuthenticatedLayout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
