import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { useDevLogin } from "@/features/auth/hooks/use-dev-login";
import { setAuthToken } from "@/shared/lib/auth-token";
import { buttonVariants } from "@/shared/components/ui/button";
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

  const signIn = () =>
    mutate(undefined, {
      onSuccess: (response) => setAuthToken(response.accessToken),
    });

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }
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
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-surface text-center">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[15px] font-semibold text-ink">Couldn&apos;t sign in</h1>
          <p className="max-w-sm text-[13px] text-ink-muted">
            {error instanceof Error ? error.message : "An unexpected error occurred."}
          </p>
        </div>
        <button
          type="button"
          onClick={signIn}
          className={buttonVariants({ variant: "primary" })}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-surface text-[13px] text-ink-subtle">
      Loading Willow…
    </div>
  );
}
