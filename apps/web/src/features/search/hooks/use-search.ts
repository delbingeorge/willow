import { useQuery } from "@tanstack/react-query";
import { fetchSearchResults } from "@/features/search/api/search";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 200;

export function useSearch(query: string) {
  const term = useDebouncedValue(query.trim(), DEBOUNCE_MS);
  const enabled = term.length >= MIN_QUERY_LENGTH;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", term],
    queryFn: () => fetchSearchResults(term),
    enabled,
    staleTime: 30_000,
  });

  return {
    results: data ?? [],
    isLoading: enabled && isLoading,
    isError,
    isSettled: enabled && !isLoading && !isError,
    term,
    enabled,
  };
}
