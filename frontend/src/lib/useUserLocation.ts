import { useCallback, useEffect, useState } from 'react';
import type { LatLng } from '../components/CampusMap';

export type LocationStatus = 'locating' | 'granted' | 'denied' | 'unavailable';

export function useUserLocation() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<LocationStatus>('locating');

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPosition({ lat: p.coords.latitude, lng: p.coords.longitude });
        setStatus('granted');
      },
      (err) =>
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, []);

  useEffect(() => {
    locate();
  }, [locate]);

  return { position, status, retry: locate };
}