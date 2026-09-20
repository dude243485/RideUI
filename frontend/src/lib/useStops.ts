import { useCallback, useEffect, useState } from 'react';
import type { Stop } from '../types/stop';

export type StopsStatus = 'loading' | 'loaded' | 'empty' | 'error';

export function useStops() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [status, setStatus] = useState<StopsStatus>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/stops');
      if (!res.ok) throw new Error('Failed to load stops');
      const data: Stop[] = await res.json();
      setStops(data);
      setStatus(data.length ? 'loaded' : 'empty');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stops, status, reload: load };
}