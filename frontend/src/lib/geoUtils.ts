// University of Ibadan Campus Reverse-Geocoding and Landmark Resolution

export interface CampusHubPoint {
  name: string;
  lat: number;
  lng: number;
  type?: string;
  tariffTier?: string | null;
}

export const CAMPUS_LANDMARKS: CampusHubPoint[] = [
  { name: 'Main Gate', lat: 7.4416, lng: 3.9006, type: 'gate' },
  { name: 'Independence Hall', lat: 7.4435, lng: 3.8965, type: 'hostel' },
  { name: 'Azikiwe Hall', lat: 7.4428, lng: 3.8972, type: 'hostel' },
  { name: 'Queens Hall', lat: 7.4430, lng: 3.9015, type: 'hostel' },
  { name: 'Bookshop', lat: 7.4436, lng: 3.9002, type: 'landmark' },
  { name: 'Tedder Hall', lat: 7.4452, lng: 3.8998, type: 'hostel' },
  { name: 'Mellanby Hall', lat: 7.4458, lng: 3.9005, type: 'hostel' },
  { name: 'S.U.B (Student Union)', lat: 7.4445, lng: 3.9010, type: 'landmark' },
  { name: 'Catholic Church', lat: 7.4451, lng: 3.9022, type: 'landmark' },
  { name: 'Chapel of Resurrection', lat: 7.4460, lng: 3.9018, type: 'landmark' },
  { name: 'UI Central Mosque', lat: 7.4468, lng: 3.9025, type: 'landmark' },
  { name: 'Kuti Hall', lat: 7.4462, lng: 3.8988, type: 'hostel' },
  { name: 'Faculty of Arts', lat: 7.4448, lng: 3.8985, type: 'faculty' },
  { name: 'Benue Road', lat: 7.4480, lng: 3.8990, type: 'other' },
  { name: 'Faculty of Education', lat: 7.4475, lng: 3.9040, type: 'faculty' },
  { name: 'Faculty of Agriculture', lat: 7.4485, lng: 3.9035, type: 'faculty' },
  { name: 'Faculty of Technology', lat: 7.4490, lng: 3.9050, type: 'faculty' },
  { name: 'Faculty of Law', lat: 7.4465, lng: 3.9045, type: 'faculty' },
  { name: 'Faculty of Social Sciences', lat: 7.4470, lng: 3.9055, type: 'faculty' },
  { name: 'Botany Department', lat: 7.4482, lng: 3.9012, type: 'faculty' },
  { name: 'Awo Hall (Obafemi Awolowo)', lat: 7.4520, lng: 3.8980, type: 'hostel' },
  { name: 'Idia Hall', lat: 7.4505, lng: 3.8975, type: 'hostel' },
  { name: 'Abdulsalami Hall', lat: 7.4530, lng: 3.8965, type: 'hostel' },
  { name: 'Palm 77', lat: 7.4420, lng: 3.9030, type: 'landmark' },
  { name: 'Talent Center', lat: 7.4430, lng: 3.9040, type: 'landmark' },
  { name: 'PG College (Postgraduate)', lat: 7.4515, lng: 3.8990, type: 'hostel' },
  { name: 'Staff Club', lat: 7.4495, lng: 3.9020, type: 'landmark' },
  { name: 'Anatomy / College of Medicine', lat: 7.4425, lng: 3.9050, type: 'faculty' },
  { name: 'UI Cooperative', lat: 7.4460, lng: 3.9060, type: 'landmark' },
  { name: 'Works & Maintenance', lat: 7.4500, lng: 3.9040, type: 'landmark' },
  { name: 'Diamond FM', lat: 7.4472, lng: 3.9030, type: 'landmark' },
  { name: 'UI Staff School', lat: 7.4455, lng: 3.9055, type: 'landmark' },
  { name: 'International Conference Centre (ICC)', lat: 7.4405, lng: 3.9080, type: 'landmark' },
  { name: 'Second Gate', lat: 7.4480, lng: 3.9100, type: 'gate' },
  { name: 'Abadina Gate', lat: 7.4540, lng: 3.9060, type: 'gate' },
  { name: 'Awo Stadium', lat: 7.4535, lng: 3.8995, type: 'landmark' },
  { name: 'Poly Gate', lat: 7.4380, lng: 3.8920, type: 'gate' },
  { name: 'Ajibode Maternity Junction', lat: 7.4580, lng: 3.9020, type: 'landmark' },
  { name: 'DLC Sasa', lat: 7.4650, lng: 3.9150, type: 'landmark' },
  { name: 'PAULESI', lat: 7.4560, lng: 3.9040, type: 'faculty' },
  { name: 'Adebayo Akande Hall', lat: 7.4570, lng: 3.8950, type: 'hostel' },
  { name: 'Institute of Education', lat: 7.4510, lng: 3.9070, type: 'faculty' },
  { name: 'IPPS', lat: 7.4545, lng: 3.9050, type: 'faculty' },
  { name: 'CPEEL', lat: 7.4550, lng: 3.9065, type: 'faculty' },
  { name: 'UI Ajibode Extension', lat: 7.4620, lng: 3.9030, type: 'landmark' },
];

export function distanceInKm(
  p1: { lat: number; lng: number },
  p2: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Resolves a GPS coordinate to the nearest campus landmark/building/area name.
 */
export function resolveCampusLandmark(
  coord: { lat: number; lng: number } | null | undefined,
  customHubs?: CampusHubPoint[]
): { name: string; nearestHub: string; distanceMeters: number } {
  if (!coord || coord.lat == null || coord.lng == null) {
    return { name: 'Campus Location', nearestHub: 'Main Gate', distanceMeters: 0 };
  }

  const list = customHubs && customHubs.length > 0 ? customHubs : CAMPUS_LANDMARKS;

  let minDistance = Infinity;
  let closestHub: CampusHubPoint = list[0];

  for (const hub of list) {
    const d = distanceInKm(coord, { lat: hub.lat, lng: hub.lng });
    if (d < minDistance) {
      minDistance = d;
      closestHub = hub;
    }
  }

  const distanceMeters = Math.round(minDistance * 1000);

  let formattedName = closestHub.name;
  if (distanceMeters < 80) {
    formattedName = closestHub.name;
  } else if (distanceMeters < 350) {
    formattedName = `Near ${closestHub.name}`;
  } else if (distanceMeters < 700) {
    formattedName = `${closestHub.name} Area`;
  } else {
    formattedName = `${closestHub.name} Vicinity, UI Campus`;
  }

  return {
    name: formattedName,
    nearestHub: closestHub.name,
    distanceMeters,
  };
}
