import { useCallback, useEffect, useState } from 'react';
import type { LatLng } from '../components/CampusMap';

type FareStatus = 'loading' | 'loaded' | 'error';

export function useFare(pickup?: LatLng, destination?: LatLng) {
  const [fare, setFare] = useState<number | null>(null);
  const [status, setStatus] = useState<FareStatus>('loading');

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!pickup || !destination) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/fare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup, destination }),
        signal,
      });
      if (!res.ok) throw new Error('Fare request failed');
      const data: { fare: number } = await res.json();
      setFare(data.fare);
      setStatus('loaded');
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setStatus('error');
    }
  }, [pickup, destination]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { fare, status, retry: () => load() };
}