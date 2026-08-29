import { useMutation } from "@tanstack/react-query";
import { devLogin } from "@/features/auth/api/dev-login";

export function useDevLogin() {
  return useMutation({ mutationFn: devLogin });
}
