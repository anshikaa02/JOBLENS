import { useEffect, useState } from "react";
import { fetchDashboardData, type DashboardData } from "@/lib/mock-data";

interface UseDashboardDataResult {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * useDashboardData — fetches everything the dashboard needs.
 * Currently backed by mock data (see lib/mock-data.ts). In Phase 9, only
 * the import above changes to a real API client call — this hook's
 * return shape (data/isLoading/error) stays the same, so Dashboard.tsx
 * doesn't need to change at all.
 */
export function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchDashboardData()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load your dashboard. Try refreshing.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading, error };
}
