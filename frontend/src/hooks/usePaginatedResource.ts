import { api } from '@/api';
import type { HttpError, ListPayload, Page } from '@/types/http';
import { toErrorMessage } from '@/utils/errors';
import { useCallback, useEffect, useState } from 'react';

type PaginatedState<T> = {
  items: T[];
  nextUrl: string | null;
  prevUrl: string | null;
  isLoading: boolean;
  error: string | null;
  load: (url?: string) => Promise<void>;
};

function normalizePaginatedPayload<T>(data: ListPayload<T>): {
  items: T[];
  next: string | null;
  prev: string | null;
} {
  if (Array.isArray(data)) {
    return { items: data, next: null, prev: null };
  }
  if (data && Array.isArray((data as Page<T>).results)) {
    const p = data as Page<T>;
    return {
      items: p.results,
      next: p.next ?? null,
      prev: p.previous ?? null,
    };
  }
  return { items: [], next: null, prev: null };
}

function toRelativePath(url: string): string {
  try {
    const u = new URL(url);
    return `${u.pathname}${u.search}`;
  } catch {
    return url;
  }
}

export function usePaginatedResource<T>(
  initialPath: string,
): PaginatedState<T> {
  const [items, setItems] = useState<T[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setErr] = useState<string | null>(null);

  const load = useCallback(
    async (url?: string): Promise<void> => {
      setLoading(true);
      setErr(null);
      try {
        const path = url ? toRelativePath(url) : initialPath;
        const r = await api.get(path);
        const payload = r.data as ListPayload<T>;
        const { items, next, prev } = normalizePaginatedPayload<T>(payload);
        setItems(items);
        setNextUrl(next);
        setPrevUrl(prev);
      } catch (err) {
        setItems([]);
        setNextUrl(null);
        setPrevUrl(null);
        setErr(toErrorMessage(err as HttpError));
      } finally {
        setLoading(false);
      }
    },
    [initialPath],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return { items, nextUrl, prevUrl, isLoading, error, load };
}
