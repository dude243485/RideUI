import DriverProfile from '../models/DriverProfile.js';
import { distanceKm } from './geo.js';

/**
 * Returns available drivers ranked by distance from the pickup coordinates, closest first.
 * Queries real DriverProfile records in MongoDB.
 *
 * @param {{ lat: number, lng: number }} pickupCoords
 * @param {number} [limit=10]
 * @returns {Promise<Array>}
 */
export async function findNearestDrivers(pickupCoords, limit = 10) {
  if (!pickupCoords || pickupCoords.lat == null || pickupCoords.lng == null) {
    return [];
  }

  const drivers = await DriverProfile.find({ status: 'available' })
    .populate('user', 'name phone email')
    .populate('currentHub', 'name coordinates');

  return drivers
    .filter((d) => d.user)
    .map((d) => {
      const driverCoords =
        d.currentCoordinates?.lat != null && d.currentCoordinates?.lng != null
          ? d.currentCoordinates
          : d.currentHub?.coordinates || { lat: 7.4416, lng: 3.9006 };

      const dist = distanceKm(pickupCoords, driverCoords);

      return {
        driverId: d._id,
        userId: d.user._id,
        name: d.user.name,
        phone: d.user.phone || '',
        vehicleType: d.vehicleType,
        plateNumber: d.plateNumber,
        currentHub: d.currentHub
          ? {
              id: d.currentHub._id,
              name: d.currentHub.name,
              coordinates: d.currentHub.coordinates,
            }
          : {
              name: 'Campus Transporter Stop',
              coordinates: driverCoords,
            },
        distanceKm: dist,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
