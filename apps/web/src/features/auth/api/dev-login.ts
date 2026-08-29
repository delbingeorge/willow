import { apiFetch } from "@/shared/lib/api-client";
import type { DevLoginResponse } from "@/features/auth/types";

export function devLogin() {
  return apiFetch<DevLoginResponse>("/auth/dev-login", { method: "POST" });
}
