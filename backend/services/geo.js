// Haversine distance between two { lat, lng } points, in kilometers.
// Good enough for campus scale — no need for external mapping API.
export function distanceKm(coord1, coord2) {
  if (!coord1 || !coord2) return 0;
  const lat1 = Number(coord1.lat);
  const lng1 = Number(coord1.lng);
  const lat2 = Number(coord2.lat);
  const lng2 = Number(coord2.lng);

  if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
    return 0;
  }

  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}
