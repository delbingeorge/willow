import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDevLogin } from "@/features/auth/hooks/use-dev-login";
import { setAuthToken } from "@/shared/lib/auth-token";
import {
  hasRememberedSession,
  rememberSession,
  forgetSession,
} from "@/features/auth/lib/session-preference";
import type { DevLoginUser } from "@/features/auth/types";

interface AuthContextValue {
  isAuthenticated: boolean;
  isSigningIn: boolean;
  justSignedIn: boolean;
  user: DevLoginUser | null;
  error: string | null;
  signIn: () => void;
  signOut: () => void;
  acknowledgeSignIn: () => void;
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
  const hasRestored = useRef(false);
  const queryClient = useQueryClient();
  const [justSignedIn, setJustSignedIn] = useState(false);
  const { mutate, data, isPending, isError, error, reset } = useDevLogin();

  const signIn = useCallback(() => {
    mutate(undefined, {
      onSuccess: (response) => {
        setAuthToken(response.accessToken);
        rememberSession();
        setJustSignedIn(true);
      },
    });
  }, [mutate]);

  const signOut = useCallback(() => {
    setAuthToken(null);
    forgetSession();
    setJustSignedIn(false);
    reset();
    queryClient.clear();
  }, [queryClient, reset]);

  const acknowledgeSignIn = useCallback(() => setJustSignedIn(false), []);

  useEffect(() => {
    if (hasRestored.current) {
      return;
    }
    hasRestored.current = true;

    if (!hasRememberedSession()) {
      return;
    }

    mutate(undefined, {
      onSuccess: (response) => {
        setAuthToken(response.accessToken);
        rememberSession();
      },
    });
  }, [mutate]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(data),
        isSigningIn: isPending,
        justSignedIn,
        user: data?.user ?? null,
        error: isError ? (error instanceof Error ? error.message : "Sign-in failed") : null,
        signIn,
        signOut,
        acknowledgeSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
