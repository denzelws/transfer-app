import { api } from '@/api';
import { useCallback, useEffect, useState } from 'react';

type PageResponse<T> =
  | {
      count: number;
      next: string | null;
      previous: string | null;
      results: T[];
    }
  | T[];

type PaginatedState<T> = {
  items: T[];
  nextUrl: string | null;
  prevUrl: string | null;
  isLoading: boolean;
  error: string | null;
  load: (url?: string) => Promise<void>;
};

export function usePaginatedResource<T>(
  initialPath: string,
): PaginatedState<T> {
  const [items, setItems] = useState<T[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  const normalize = (payload: PageResponse<T>) => {
    if (Array.isArray(payload)) {
      return { items: payload, next: null, prev: null };
    }
    if (Array.isArray(payload?.results)) {
      return {
        items: payload.results,
        next: payload.next ?? null,
        prev: payload.previous ?? null,
      };
    }
    return { items: [], next: null, prev: null };
  };

  const stripBase = (url: string) =>
    url.replace(`${import.meta.env.VITE_API_BASE}/api`, '');

  const load = useCallback(
    async (url?: string) => {
      setLoading(true);
      setErr(null);
      try {
        const path = url ? stripBase(url) : initialPath;
        const r = await api.get(path);
        const { items, next, prev } = normalize(r.data);
        setItems(items);
        setNextUrl(next);
        setPrevUrl(prev);
      } catch (e: any) {
        setItems([]);
        setNextUrl(null);
        setPrevUrl(null);
        setErr(e?.response?.data ? JSON.stringify(e.response.data) : 'Error');
      } finally {
        setLoading(false);
      }
    },
    [initialPath],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return { items, nextUrl, prevUrl, isLoading: isLoading, error, load };
}
