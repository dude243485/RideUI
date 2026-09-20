import DriverProfile from '../models/DriverProfile.js';
import { distanceKm } from './geo.js';

/**
 * Returns available drivers ranked by distance from the pickup coordinates, closest first.
 *
 * @param {{ lat: number, lng: number }} pickupCoords
 * @param {number} [limit=3]
 * @returns {Promise<Array>}
 */
export async function findNearestDrivers(pickupCoords, limit = 3) {
  if (!pickupCoords || pickupCoords.lat == null || pickupCoords.lng == null) {
    return [];
  }

  const drivers = await DriverProfile.find({ status: 'available' })
    .populate('user', 'name phone')
    .populate('currentHub', 'name coordinates');

  return drivers
    .filter((d) => d.currentHub && d.currentHub.coordinates && d.user)
    .map((d) => ({
      driverId: d._id,
      userId: d.user._id,
      name: d.user.name,
      phone: d.user.phone,
      vehicleType: d.vehicleType,
      plateNumber: d.plateNumber,
      currentHub: {
        id: d.currentHub._id,
        name: d.currentHub.name,
        coordinates: d.currentHub.coordinates,
      },
      distanceKm: distanceKm(pickupCoords, d.currentHub.coordinates),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
