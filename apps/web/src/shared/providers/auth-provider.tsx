import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { useDevLogin } from "@/features/auth/hooks/use-dev-login";
import { setAuthToken } from "@/shared/lib/auth-token";
import type { DevLoginUser } from "@/features/auth/types";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: DevLoginUser;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const hasStarted = useRef(false);
  const { mutate, data, isError, error } = useDevLogin();

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    mutate(undefined, {
      onSuccess: (response) => setAuthToken(response.accessToken),
    });
  }, [mutate]);

  if (data) {
    return (
      <AuthContext.Provider value={{ isAuthenticated: true, user: data.user }}>
        {children}
      </AuthContext.Provider>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-sm text-fg-3">
        Couldn&apos;t sign in: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background text-sm text-fg-3">
      Loading Willow…
    </div>
  );
}
