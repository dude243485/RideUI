import { distanceKm } from './geo.js';
import {
  STANDARD_PICKUP_HUB,
  SHARED_FARES,
  DROP_FARES,
  getTierForDestination,
} from './tariffs.js';

/**
 * Estimates fare and service type based on official UI Students' Union tariff sheet.
 *
 * @param {Object} pickup - Hub object or coordinates { name?, tariffTier?, coordinates?: {lat, lng}, lat?, lng? }
 * @param {Object} destination - Hub object or coordinates { name?, tariffTier?, coordinates?: {lat, lng}, lat?, lng? }
 * @returns {{ fare: number, serviceType: string, tier: string|null, distanceKm: number }}
 */
export function estimateFare(pickup, destination) {
  // Extract coordinates
  const pickupCoords = pickup?.coordinates || (pickup?.lat != null && pickup?.lng != null ? pickup : null);
  const destCoords = destination?.coordinates || (destination?.lat != null && destination?.lng != null ? destination : null);

  const km = distanceKm(pickupCoords, destCoords);

  const pickupName = (pickup?.name || '').trim().toLowerCase();
  const isMainGate = pickupName.includes('main gate') || pickupName === STANDARD_PICKUP_HUB.toLowerCase();

  // Determine destination tier
  let destTier = destination?.tariffTier || getTierForDestination(destination?.name);

  let fare;
  let serviceType;

  if (isMainGate && destTier && SHARED_FARES[destTier]) {
    // Standard shared route from Main Gate to listed destination
    fare = SHARED_FARES[destTier];
    serviceType = 'Shared Car/Keke';
  } else {
    // Non-Main Gate pickup, or unlisted destination -> Drop trip pricing
    if (destTier === 'A') {
      fare = DROP_FARES.A.fare;
      serviceType = DROP_FARES.A.serviceType;
    } else if (destTier === 'B') {
      fare = DROP_FARES.B.fare;
      serviceType = DROP_FARES.B.serviceType;
    } else if (destTier === 'C') {
      fare = DROP_FARES.C.fare;
      serviceType = DROP_FARES.C.serviceType;
    } else if (destTier === 'D') {
      fare = DROP_FARES.D.fare;
      serviceType = DROP_FARES.D.serviceType;
    } else {
      fare = DROP_FARES.unlisted.fare;
      serviceType = DROP_FARES.unlisted.serviceType;
    }
  }

  return {
    fare,
    serviceType,
    tier: destTier || null,
    distanceKm: km,
  };
}
