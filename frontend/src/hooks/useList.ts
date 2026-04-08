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
      let msg = 'An unexpected error occurred';

      if (httpErr.response?.data) {
        msg =
          typeof httpErr.response.data === 'string'
            ? httpErr.response.data
            : JSON.stringify(httpErr.response.data);
      } else if (httpErr.message) {
        msg = httpErr.message;
      }

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
