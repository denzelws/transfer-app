// hooks/useList.ts
import { api } from '@/api';
import { useEffect, useState } from 'react';

export function useList<T>(path: string) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const r = await api.get(path);
        const data = Array.isArray(r.data)
          ? r.data
          : (r.data?.results ?? r.data ?? []);
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setItems([]);
        setErr(e?.response?.data ? JSON.stringify(e.response.data) : 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, [path]);

  return { items, isLoading, error };
}
