// University of Ibadan Campus Reverse-Geocoding, Landmark Resolution & Road Network Dictionary
// Exact ground-truth coordinates mapped to OpenStreetMap tile layer

export interface CampusHubPoint {
  name: string;
  lat: number;
  lng: number;
  type?: 'hostel' | 'faculty' | 'gate' | 'landmark' | 'road' | 'health' | 'other';
  tariffTier?: 'A' | 'B' | 'C' | 'D' | null;
  shortName?: string;
}

export const CAMPUS_LANDMARKS: CampusHubPoint[] = [
  // ─── INDEPENDENCE HALL & WEST AXIS (EXACT OSM TILE GROUND TRUTH) ──────────────
  { name: 'Independence Hall (Indy Katanga)', lat: 7.4394, lng: 3.8972, type: 'hostel', tariffTier: 'A', shortName: 'Indy Hall' },
  { name: 'Independence Hall (East Block)', lat: 7.4392, lng: 3.8978, type: 'hostel', tariffTier: 'A', shortName: 'Indy East' },
  { name: 'Independence Hall (West Block)', lat: 7.4395, lng: 3.8966, type: 'hostel', tariffTier: 'A', shortName: 'Indy West' },
  { name: 'Abu Bakar Salam P. G. Hall', lat: 7.4396, lng: 3.8949, type: 'hostel', tariffTier: 'B', shortName: 'Abu Bakar Salam' },
  { name: 'Nnamdi Azikiwe Hall (Zik Baluba)', lat: 7.4408, lng: 3.8968, type: 'hostel', tariffTier: 'A', shortName: 'Zik Hall' },
  { name: "Nnamdi Azikiwe Hall's Food Court", lat: 7.4411, lng: 3.8963, type: 'landmark', tariffTier: 'A', shortName: 'Zik Food Court' },
  { name: 'Plateau Place', lat: 7.4405, lng: 3.8924, type: 'road', tariffTier: 'B', shortName: 'Plateau Place' },
  { name: 'Appleton Road', lat: 7.4415, lng: 3.8939, type: 'road', tariffTier: 'B', shortName: 'Appleton Rd' },
  { name: 'Technology Drive', lat: 7.4418, lng: 3.8933, type: 'road', tariffTier: 'B', shortName: 'Tech Drive' },
  { name: 'Sankore Avenue', lat: 7.4449, lng: 3.8920, type: 'road', tariffTier: 'B', shortName: 'Sankore Ave' },
  { name: 'Niger Road', lat: 7.4462, lng: 3.8930, type: 'road', tariffTier: 'B', shortName: 'Niger Rd' },
  { name: 'Akinyele Road', lat: 7.4440, lng: 3.8954, type: 'road', tariffTier: 'B', shortName: 'Akinyele Rd' },

  // ─── HEALTH & MEDICAL ─────────────────────────────────────────────────────────
  { name: 'Jaja Clinic (University Health Services)', lat: 7.4426, lng: 3.9008, type: 'health', tariffTier: 'A', shortName: 'Jaja Clinic' },
  { name: 'Jaja Avenue', lat: 7.4411, lng: 3.9010, type: 'road', tariffTier: 'A', shortName: 'Jaja Avenue' },
  { name: 'Poly Clinic', lat: 7.4451, lng: 3.8986, type: 'health', tariffTier: 'B', shortName: 'Poly Clinic' },
  { name: 'Faculty of Nursing', lat: 7.4474, lng: 3.8974, type: 'faculty', tariffTier: 'B', shortName: 'Nursing' },
  { name: 'College of Medicine / Anatomy Building', lat: 7.4425, lng: 3.9050, type: 'faculty', tariffTier: 'B', shortName: 'College of Medicine' },
  { name: 'Faculty of Pharmacy', lat: 7.4468, lng: 3.9058, type: 'faculty', tariffTier: 'B', shortName: 'Pharmacy' },
  { name: 'Faculty of Veterinary Medicine', lat: 7.4460, lng: 3.9065, type: 'faculty', tariffTier: 'B', shortName: 'Vet Medicine' },
  { name: 'Faculty of Clinical Sciences & Dentistry', lat: 7.4428, lng: 3.9052, type: 'faculty', tariffTier: 'B', shortName: 'Dentistry' },

  // ─── CENTRAL CAMPUS & HALLS OF RESIDENCE ───────────────────────────────────────
  { name: 'Tafawa Balewa Hall', lat: 7.4424, lng: 3.8996, type: 'hostel', tariffTier: 'A', shortName: 'Balewa Hall' },
  { name: 'Student Union Building (S.U.B)', lat: 7.4440, lng: 3.8987, type: 'landmark', tariffTier: 'A', shortName: 'S.U.B' },
  { name: 'Students Affairs Building', lat: 7.4438, lng: 3.8995, type: 'landmark', tariffTier: 'A', shortName: 'Student Affairs' },
  { name: "UI Swimming Pool & Pavillion", lat: 7.4439, lng: 3.8995, type: 'landmark', tariffTier: 'A', shortName: 'UI Pool' },
  { name: 'Administration Building & Senate', lat: 7.4431, lng: 3.9002, type: 'landmark', tariffTier: 'A', shortName: 'Senate Building' },
  { name: 'Trenchard Hall', lat: 7.4449, lng: 3.8999, type: 'landmark', tariffTier: 'A', shortName: 'Trenchard Hall' },
  { name: 'University Bookshop', lat: 7.4453, lng: 3.9005, type: 'landmark', tariffTier: 'A', shortName: 'Bookshop' },
  { name: 'Tedder Hall', lat: 7.4470, lng: 3.8977, type: 'hostel', tariffTier: 'A', shortName: 'Tedder Hall' },
  { name: "Tedder's Foodcourt", lat: 7.4455, lng: 3.9012, type: 'landmark', tariffTier: 'A', shortName: 'Tedder Foodcourt' },
  { name: 'Mellanby Hall', lat: 7.4455, lng: 3.8998, type: 'hostel', tariffTier: 'A', shortName: 'Mellanby Hall' },
  { name: "Mellanby's Reading Room & Court", lat: 7.4458, lng: 3.8993, type: 'landmark', tariffTier: 'A', shortName: 'Mellanby Court' },
  { name: 'Sultan Bello Hall', lat: 7.4455, lng: 3.8985, type: 'hostel', tariffTier: 'A', shortName: 'Bello Hall' },
  { name: 'Kuti Hall', lat: 7.4465, lng: 3.8988, type: 'hostel', tariffTier: 'A', shortName: 'Kuti Hall' },
  { name: 'Queen Elizabeth II Hall (Queens Hall)', lat: 7.4430, lng: 3.9015, type: 'hostel', tariffTier: 'A', shortName: 'Queens Hall' },
  { name: 'Queen Idia Hall', lat: 7.4505, lng: 3.8975, type: 'hostel', tariffTier: 'B', shortName: 'Idia Hall' },
  { name: 'Obafemi Awolowo Hall (Awo Hall)', lat: 7.4525, lng: 3.8980, type: 'hostel', tariffTier: 'B', shortName: 'Awo Hall' },
  { name: 'Abdulsalami Abubakar Hall', lat: 7.4542, lng: 3.8965, type: 'hostel', tariffTier: 'B', shortName: 'Abdulsalami Hall' },
  { name: 'Postgraduate (PG) College Hall', lat: 7.4515, lng: 3.8990, type: 'hostel', tariffTier: 'B', shortName: 'PG College' },
  { name: 'Adebayo Akande Hall', lat: 7.4570, lng: 3.8950, type: 'hostel', tariffTier: 'B', shortName: 'Akande Hall' },
  { name: "Maryam's Hostel", lat: 7.4454, lng: 3.9049, type: 'hostel', tariffTier: 'B', shortName: "Maryam's Hostel" },

  // ─── CAMPUS ROADS & ARTERIES ──────────────────────────────────────────────────
  { name: 'Barth Road (near Independence Hall)', lat: 7.4382, lng: 3.8966, type: 'road', tariffTier: 'A', shortName: 'Barth Rd (Indy)' },
  { name: 'Barth Road (near Jaja Clinic)', lat: 7.4405, lng: 3.9010, type: 'road', tariffTier: 'A', shortName: 'Barth Rd (Jaja)' },
  { name: 'Barth Road (East Axis)', lat: 7.4386, lng: 3.9032, type: 'road', tariffTier: 'B', shortName: 'Barth Rd (East)' },
  { name: 'Benue Road', lat: 7.4485, lng: 3.8953, type: 'road', tariffTier: 'B', shortName: 'Benue Road' },
  { name: 'Chapel Road', lat: 7.4450, lng: 3.9000, type: 'road', tariffTier: 'A', shortName: 'Chapel Road' },
  { name: 'Dyke Road', lat: 7.4442, lng: 3.9021, type: 'road', tariffTier: 'A', shortName: 'Dyke Road' },
  { name: 'Oduduwa Road', lat: 7.4423, lng: 3.9040, type: 'road', tariffTier: 'A', shortName: 'Oduduwa Road' },
  { name: 'El-Kanemi Road', lat: 7.4412, lng: 3.9023, type: 'road', tariffTier: 'A', shortName: 'El-Kanemi Road' },
  { name: 'Lander Road', lat: 7.4409, lng: 3.9039, type: 'road', tariffTier: 'A', shortName: 'Lander Road' },
  { name: 'Ijoma Road', lat: 7.4412, lng: 3.9002, type: 'road', tariffTier: 'A', shortName: 'Ijoma Road' },
  { name: 'Abadina Road (near Abadina Gate)', lat: 7.4538, lng: 3.9058, type: 'road', tariffTier: 'B', shortName: 'Abadina Rd' },
  { name: 'Abadina Road (Market & Complex)', lat: 7.4525, lng: 3.9068, type: 'road', tariffTier: 'B', shortName: 'Abadina Market' },
  { name: 'Sultan Bello Road', lat: 7.4458, lng: 3.8992, type: 'road', tariffTier: 'A', shortName: 'Bello Road' },
  { name: 'Aminu Kano Way', lat: 7.4450, lng: 3.9045, type: 'road', tariffTier: 'B', shortName: 'Aminu Kano Way' },

  // ─── FACULTIES & ACADEMIC LIBRARIES ───────────────────────────────────────────
  { name: 'Kenneth Dike Library (Main Library)', lat: 7.4467, lng: 3.8961, type: 'landmark', tariffTier: 'A', shortName: 'KD Library' },
  { name: 'Faculty of Arts', lat: 7.4457, lng: 3.8975, type: 'faculty', tariffTier: 'A', shortName: 'Faculty of Arts' },
  { name: "Faculty of Art's Large Lecture Theatre (LLT)", lat: 7.4469, lng: 3.8972, type: 'faculty', tariffTier: 'A', shortName: 'Arts LLT' },
  { name: 'Faculty of Education', lat: 7.4476, lng: 3.8957, type: 'faculty', tariffTier: 'B', shortName: 'Faculty of Education' },
  { name: 'Faculty of Technology Complex', lat: 7.4490, lng: 3.9050, type: 'faculty', tariffTier: 'B', shortName: 'Faculty of Tech' },
  { name: 'Faculty of Science', lat: 7.4458, lng: 3.9030, type: 'faculty', tariffTier: 'B', shortName: 'Faculty of Science' },
  { name: 'Faculty of Agriculture & Forestry', lat: 7.4485, lng: 3.9035, type: 'faculty', tariffTier: 'B', shortName: 'Faculty of Agric' },
  { name: 'Faculty of Law', lat: 7.4465, lng: 3.9045, type: 'faculty', tariffTier: 'B', shortName: 'Faculty of Law' },
  { name: 'Faculty of Social Sciences', lat: 7.4470, lng: 3.9055, type: 'faculty', tariffTier: 'B', shortName: 'Social Sciences' },
  { name: 'Institute of African Studies & IFRA', lat: 7.4477, lng: 3.8940, type: 'faculty', tariffTier: 'B', shortName: 'African Studies' },
  { name: 'Institute of Education', lat: 7.4510, lng: 3.9070, type: 'faculty', tariffTier: 'B', shortName: 'Institute of Educ.' },
  { name: 'PAULESI (Pan African University)', lat: 7.4560, lng: 3.9040, type: 'faculty', tariffTier: 'B', shortName: 'PAULESI' },

  // ─── WORSHIP, RECREATION & GATES ──────────────────────────────────────────────
  { name: 'UI Chapel of the Resurrection', lat: 7.4466, lng: 3.8989, type: 'landmark', tariffTier: 'A', shortName: 'UI Chapel' },
  { name: "UI's Central Mosque", lat: 7.4474, lng: 3.8993, type: 'landmark', tariffTier: 'A', shortName: 'UI Mosque' },
  { name: 'Our Lady Seat of Wisdom Catholic Church', lat: 7.4451, lng: 3.9022, type: 'landmark', tariffTier: 'A', shortName: 'Catholic Church' },
  { name: 'UI Main Gate', lat: 7.4416, lng: 3.9006, type: 'gate', tariffTier: null, shortName: 'Main Gate' },
  { name: 'UI Campus Cab Terminus', lat: 7.4406, lng: 3.9070, type: 'gate', tariffTier: 'A', shortName: 'Cab Terminus' },
  { name: 'Second Gate', lat: 7.4480, lng: 3.9100, type: 'gate', tariffTier: 'B', shortName: '2nd Gate' },
  { name: 'Abadina Gate', lat: 7.4540, lng: 3.9060, type: 'gate', tariffTier: 'B', shortName: 'Abadina Gate' },
  { name: 'Poly Gate / North Gate', lat: 7.4380, lng: 3.8920, type: 'gate', tariffTier: 'C', shortName: 'Poly Gate' },
  { name: 'Ajibode Gate & Extension', lat: 7.4580, lng: 3.9020, type: 'gate', tariffTier: 'C', shortName: 'Ajibode Gate' },
  { name: 'Distance Learning Centre (DLC Sasa)', lat: 7.4650, lng: 3.9150, type: 'gate', tariffTier: 'D', shortName: 'DLC Sasa' },
  { name: 'Awo Stadium', lat: 7.4535, lng: 3.8995, type: 'landmark', tariffTier: 'C', shortName: 'Awo Stadium' },
  { name: 'Senior Staff Club', lat: 7.4495, lng: 3.9020, type: 'landmark', tariffTier: 'B', shortName: 'Staff Club' },
  { name: 'Works & Maintenance Department', lat: 7.4500, lng: 3.9040, type: 'landmark', tariffTier: 'B', shortName: 'Works & Maint.' },
  { name: 'UI Zoological Gardens (Zoo)', lat: 7.4355, lng: 3.8980, type: 'landmark', tariffTier: 'A', shortName: 'UI Zoo' },
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
 * Resolves a GPS coordinate to the closest high-fidelity campus landmark or street.
 */
export function resolveCampusLandmark(
  coord: { lat: number; lng: number } | null | undefined,
  customHubs?: CampusHubPoint[]
): { name: string; nearestHub: string; distanceMeters: number; type?: string } {
  if (!coord || coord.lat == null || coord.lng == null) {
    return { name: 'UI Main Gate', nearestHub: 'UI Main Gate', distanceMeters: 0, type: 'gate' };
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
  if (distanceMeters <= 50) {
    // Directly inside or at the building/point
    formattedName = closestHub.name;
  } else if (distanceMeters <= 120) {
    // Immediately adjacent
    formattedName = closestHub.type === 'road' ? closestHub.name : `Near ${closestHub.name}`;
  } else if (distanceMeters <= 280) {
    // In the area
    formattedName = closestHub.type === 'road' ? `${closestHub.name} Area` : `${closestHub.name} Vicinity`;
  } else {
    formattedName = `${closestHub.name} Axis, UI Campus`;
  }

  return {
    name: formattedName,
    nearestHub: closestHub.name,
    distanceMeters,
    type: closestHub.type,
  };
}
