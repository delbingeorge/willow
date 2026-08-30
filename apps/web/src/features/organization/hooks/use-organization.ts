import { useQuery } from "@tanstack/react-query";
import { fetchOrganization } from "@/features/organization/api/organization";

export function useOrganization() {
  return useQuery({
    queryKey: ["organization"],
    queryFn: fetchOrganization,
  });
}
