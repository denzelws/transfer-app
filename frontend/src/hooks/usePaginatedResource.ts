import { api } from '@/api';
import type { HttpError, ListPayload, Page } from '@/types/http';
import { toErrorMessage } from '@/utils/errors';
import { stripApiPrefix, toRelativePath } from '@/utils/helpers';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function usePaginatedResource<T>(initialPath: string) {
  const [items, setItems] = useState<T[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setErr] = useState<string | null>(null);

  const normalizePaginatedPayload = useCallback(
    <T>(
      data: ListPayload<T>,
    ): {
      items: T[];
      next: string | null;
      prev: string | null;
    } => {
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
    },
    [],
  );

  const normalizedInitial = useMemo(
    () => stripApiPrefix(toRelativePath(initialPath)),
    [initialPath],
  );

  const load = useCallback(
    async (url?: string): Promise<void> => {
      setLoading(true);
      setErr(null);
      try {
        const raw = url ? toRelativePath(url) : normalizedInitial;
        const path = stripApiPrefix(raw);
        const r = await api.get(path);
        const payload = r.data as ListPayload<T>;
        const { items, next, prev } = normalizePaginatedPayload<T>(payload);

        setItems(items);
        setNextUrl(next ? stripApiPrefix(toRelativePath(next)) : null);
        setPrevUrl(prev ? stripApiPrefix(toRelativePath(prev)) : null);
      } catch (err) {
        setItems([]);
        setNextUrl(null);
        setPrevUrl(null);
        setErr(toErrorMessage(err as HttpError));
      } finally {
        setLoading(false);
      }
    },
    [normalizedInitial, normalizePaginatedPayload],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return { items, nextUrl, prevUrl, isLoading, error, load };
}
