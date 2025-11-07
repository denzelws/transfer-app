// hooks/useList.ts
import { api } from '@/api';
import type { HttpError } from '@/types/http';
import { useCallback, useEffect, useState } from 'react';

export function useList<T>(path: string) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await api.get(path);
      const data = Array.isArray(r.data)
        ? r.data
        : (r.data?.results ?? r.data ?? []);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      const httpErr = err as HttpError;
      const msg =
        httpErr.response?.data !== undefined
          ? typeof httpErr.response.data === 'string'
            ? httpErr.response.data
            : (() => {
                try {
                  return JSON.stringify(httpErr.response.data);
                } catch {
                  return 'Error';
                }
              })()
          : (httpErr.message ?? 'Error');
      setItems([]);
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    void load();
  }, [load]);

  return { items, isLoading, error, reload: load };
}
