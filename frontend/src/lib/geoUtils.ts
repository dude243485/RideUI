// University of Ibadan Campus Reverse-Geocoding, Landmark Resolution & Road Network Dictionary

export interface CampusHubPoint {
  name: string;
  lat: number;
  lng: number;
  type?: 'hostel' | 'faculty' | 'gate' | 'landmark' | 'road' | 'health' | 'other';
  tariffTier?: 'A' | 'B' | 'C' | 'D' | null;
  shortName?: string;
}

export const CAMPUS_LANDMARKS: CampusHubPoint[] = [
  // ─── CAMPUS GATES ─────────────────────────────────────────────────────────────
  { name: 'UI Main Gate', lat: 7.4416, lng: 3.9006, type: 'gate', tariffTier: null, shortName: 'Main Gate' },
  { name: 'Second Gate', lat: 7.4480, lng: 3.9100, type: 'gate', tariffTier: 'B', shortName: '2nd Gate' },
  { name: 'Abadina Gate', lat: 7.4540, lng: 3.9060, type: 'gate', tariffTier: 'B', shortName: 'Abadina Gate' },
  { name: 'Poly Gate / North Gate', lat: 7.4380, lng: 3.8920, type: 'gate', tariffTier: 'C', shortName: 'Poly Gate' },
  { name: 'Ajibode Gate & Extension', lat: 7.4580, lng: 3.9020, type: 'gate', tariffTier: 'C', shortName: 'Ajibode' },
  { name: 'Distance Learning Centre (DLC Sasa)', lat: 7.4650, lng: 3.9150, type: 'gate', tariffTier: 'D', shortName: 'DLC Sasa' },

  // ─── HEALTH & MEDICAL ─────────────────────────────────────────────────────────
  { name: 'Jaja Clinic (University Health Services)', lat: 7.4472, lng: 3.8968, type: 'health', tariffTier: 'A', shortName: 'Jaja Clinic' },
  { name: 'College of Medicine / Anatomy Building', lat: 7.4425, lng: 3.9050, type: 'faculty', tariffTier: 'B', shortName: 'College of Medicine' },
  { name: 'Faculty of Pharmacy', lat: 7.4468, lng: 3.9058, type: 'faculty', tariffTier: 'B', shortName: 'Pharmacy' },
  { name: 'Faculty of Veterinary Medicine', lat: 7.4460, lng: 3.9065, type: 'faculty', tariffTier: 'B', shortName: 'Vet Medicine' },
  { name: 'Faculty of Clinical Sciences & Dentistry', lat: 7.4428, lng: 3.9052, type: 'faculty', tariffTier: 'B', shortName: 'Dentistry' },

  // ─── HALLS OF RESIDENCE ───────────────────────────────────────────────────────
  { name: 'Independence Hall (Indy Katanga)', lat: 7.4468, lng: 3.8936, type: 'hostel', tariffTier: 'A', shortName: 'Indy Hall' },
  { name: 'Nnamdi Azikiwe Hall (Zik Baluba)', lat: 7.4440, lng: 3.8945, type: 'hostel', tariffTier: 'A', shortName: 'Zik Hall' },
  { name: 'Sultan Bello Hall', lat: 7.4455, lng: 3.8985, type: 'hostel', tariffTier: 'A', shortName: 'Bello Hall' },
  { name: 'Kuti Hall', lat: 7.4465, lng: 3.8988, type: 'hostel', tariffTier: 'A', shortName: 'Kuti Hall' },
  { name: 'Tedder Hall', lat: 7.4450, lng: 3.8998, type: 'hostel', tariffTier: 'A', shortName: 'Tedder Hall' },
  { name: 'Mellanby Hall', lat: 7.4456, lng: 3.9006, type: 'hostel', tariffTier: 'A', shortName: 'Mellanby Hall' },
  { name: 'Queen Elizabeth II Hall (Queens Hall)', lat: 7.4430, lng: 3.9015, type: 'hostel', tariffTier: 'A', shortName: 'Queens Hall' },
  { name: 'Queen Idia Hall', lat: 7.4505, lng: 3.8975, type: 'hostel', tariffTier: 'B', shortName: 'Idia Hall' },
  { name: 'Obafemi Awolowo Hall (Awo Hall)', lat: 7.4525, lng: 3.8980, type: 'hostel', tariffTier: 'B', shortName: 'Awo Hall' },
  { name: 'Abdulsalami Abubakar Hall', lat: 7.4542, lng: 3.8965, type: 'hostel', tariffTier: 'B', shortName: 'Abdulsalami Hall' },
  { name: 'Postgraduate (PG) College Hall', lat: 7.4515, lng: 3.8990, type: 'hostel', tariffTier: 'B', shortName: 'PG College' },
  { name: 'Adebayo Akande Hall', lat: 7.4570, lng: 3.8950, type: 'hostel', tariffTier: 'B', shortName: 'Akande Hall' },

  // ─── CAMPUS ROADS & ARTERIES ──────────────────────────────────────────────────
  { name: 'Barth Road (near Jaja Clinic)', lat: 7.4473, lng: 3.8972, type: 'road', tariffTier: 'A', shortName: 'Barth Rd (Jaja)' },
  { name: 'Barth Road (near Education & Agric)', lat: 7.4480, lng: 3.9025, type: 'road', tariffTier: 'B', shortName: 'Barth Rd (Education)' },
  { name: 'Barth Road (near Works & Maintenance)', lat: 7.4498, lng: 3.9042, type: 'road', tariffTier: 'B', shortName: 'Barth Rd (Maint.)' },
  { name: 'Benue Road (SUB & Mellanby Junction)', lat: 7.4455, lng: 3.9008, type: 'road', tariffTier: 'A', shortName: 'Benue Rd (SUB)' },
  { name: 'Benue Road (near Staff Club)', lat: 7.4485, lng: 3.9005, type: 'road', tariffTier: 'B', shortName: 'Benue Rd (Club)' },
  { name: 'Benue Road (Botanical Garden Junction)', lat: 7.4495, lng: 3.9010, type: 'road', tariffTier: 'B', shortName: 'Benue Rd (Garden)' },
  { name: 'Abadina Road (near Abadina Gate)', lat: 7.4538, lng: 3.9058, type: 'road', tariffTier: 'B', shortName: 'Abadina Rd (Gate)' },
  { name: 'Abadina Road (Market & Complex)', lat: 7.4525, lng: 3.9068, type: 'road', tariffTier: 'B', shortName: 'Abadina Market' },
  { name: 'Abadina Road (Primary & Secondary School)', lat: 7.4515, lng: 3.9075, type: 'road', tariffTier: 'B', shortName: 'Abadina Schools' },
  { name: 'Oduduwa Road (Main Gate Entrance)', lat: 7.4422, lng: 3.9006, type: 'road', tariffTier: 'A', shortName: 'Oduduwa Rd' },
  { name: 'Oduduwa Road (Bookshop & Microfinance Bank)', lat: 7.4433, lng: 3.9005, type: 'road', tariffTier: 'A', shortName: 'Oduduwa Rd (Banks)' },
  { name: 'Oduduwa Road (Trenchard Hall & Senate)', lat: 7.4439, lng: 3.9007, type: 'road', tariffTier: 'A', shortName: 'Oduduwa Rd (Senate)' },
  { name: 'Sultan Bello Road', lat: 7.4458, lng: 3.8992, type: 'road', tariffTier: 'A', shortName: 'Bello Road' },
  { name: 'Indy Road (Independence Road)', lat: 7.4455, lng: 3.8942, type: 'road', tariffTier: 'A', shortName: 'Indy Road' },
  { name: 'Zik Road (Azikiwe Road)', lat: 7.4435, lng: 3.8950, type: 'road', tariffTier: 'A', shortName: 'Zik Road' },
  { name: 'Aminu Kano Way', lat: 7.4450, lng: 3.9045, type: 'road', tariffTier: 'B', shortName: 'Aminu Kano Way' },
  { name: 'Chapel Road', lat: 7.4458, lng: 3.9015, type: 'road', tariffTier: 'A', shortName: 'Chapel Road' },
  { name: 'Niger Road', lat: 7.4475, lng: 3.9015, type: 'road', tariffTier: 'B', shortName: 'Niger Road' },
  { name: 'El-Kanemi Road', lat: 7.4465, lng: 3.8995, type: 'road', tariffTier: 'A', shortName: 'El-Kanemi Rd' },
  { name: 'Appleton Road', lat: 7.4485, lng: 3.8985, type: 'road', tariffTier: 'B', shortName: 'Appleton Road' },

  // ─── LIBRARIES, CENTRAL ADMINISTRATION & STUDENT UNION ─────────────────────────
  { name: 'Kenneth Dike Library (Main Library)', lat: 7.4446, lng: 3.9002, type: 'landmark', tariffTier: 'A', shortName: 'KD Library' },
  { name: 'Trenchard Hall', lat: 7.4438, lng: 3.9006, type: 'landmark', tariffTier: 'A', shortName: 'Trenchard Hall' },
  { name: 'Senate Chamber & Administrative Building', lat: 7.4440, lng: 3.9004, type: 'landmark', tariffTier: 'A', shortName: 'Senate Building' },
  { name: 'Student Union Building (S.U.B)', lat: 7.4445, lng: 3.9012, type: 'landmark', tariffTier: 'A', shortName: 'S.U.B' },
  { name: 'SUB Pitch & Sports Complex', lat: 7.4440, lng: 3.9020, type: 'landmark', tariffTier: 'A', shortName: 'SUB Pitch' },
  { name: 'Heritage Park (Love Garden)', lat: 7.4442, lng: 3.9015, type: 'landmark', tariffTier: 'A', shortName: 'Heritage Park' },
  { name: 'University Bookshop & Printing Press', lat: 7.4436, lng: 3.9002, type: 'landmark', tariffTier: 'A', shortName: 'UI Bookshop' },
  { name: 'UI Microfinance Bank & Post Office', lat: 7.4433, lng: 3.9005, type: 'landmark', tariffTier: 'A', shortName: 'Post Office' },
  { name: 'First Bank & Access Bank ATMs (SUB Junction)', lat: 7.4444, lng: 3.9008, type: 'landmark', tariffTier: 'A', shortName: 'First Bank' },

  // ─── FACULTIES & ACADEMIC DEPARTMENTS ─────────────────────────────────────────
  { name: 'Faculty of Technology Complex', lat: 7.4490, lng: 3.9050, type: 'faculty', tariffTier: 'B', shortName: 'Faculty of Tech' },
  { name: 'Department of Electrical & Electronics Engineering', lat: 7.4492, lng: 3.9048, type: 'faculty', tariffTier: 'B', shortName: 'Electrical Eng' },
  { name: 'Department of Mechanical Engineering', lat: 7.4488, lng: 3.9052, type: 'faculty', tariffTier: 'B', shortName: 'Mechanical Eng' },
  { name: 'Department of Civil Engineering', lat: 7.4491, lng: 3.9055, type: 'faculty', tariffTier: 'B', shortName: 'Civil Eng' },
  { name: 'Department of Petroleum & Food Technology', lat: 7.4493, lng: 3.9054, type: 'faculty', tariffTier: 'B', shortName: 'Petroleum Eng' },
  { name: 'Faculty of Arts (Faculty Square)', lat: 7.4448, lng: 3.8985, type: 'faculty', tariffTier: 'A', shortName: 'Faculty of Arts' },
  { name: 'Arts Theatre (Theatre Arts Department)', lat: 7.4442, lng: 3.8990, type: 'faculty', tariffTier: 'A', shortName: 'Arts Theatre' },
  { name: 'Department of Communication & Language Arts (CLA)', lat: 7.4446, lng: 3.8982, type: 'faculty', tariffTier: 'A', shortName: 'CLA Dept' },
  { name: 'Faculty of Science (Deans Office)', lat: 7.4458, lng: 3.9030, type: 'faculty', tariffTier: 'B', shortName: 'Faculty of Science' },
  { name: 'Department of Computer Science', lat: 7.4462, lng: 3.9032, type: 'faculty', tariffTier: 'B', shortName: 'Computer Science' },
  { name: 'Department of Chemistry', lat: 7.4455, lng: 3.9028, type: 'faculty', tariffTier: 'B', shortName: 'Chemistry' },
  { name: 'Department of Physics & Mathematics', lat: 7.4459, lng: 3.9036, type: 'faculty', tariffTier: 'B', shortName: 'Physics Dept' },
  { name: 'Department of Botany & Microbiology', lat: 7.4482, lng: 3.9012, type: 'faculty', tariffTier: 'B', shortName: 'Botany Dept' },
  { name: 'Department of Zoology', lat: 7.4452, lng: 3.9032, type: 'faculty', tariffTier: 'B', shortName: 'Zoology Dept' },
  { name: 'Faculty of Education', lat: 7.4475, lng: 3.9040, type: 'faculty', tariffTier: 'B', shortName: 'Faculty of Education' },
  { name: 'Faculty of Agriculture & Forestry', lat: 7.4485, lng: 3.9035, type: 'faculty', tariffTier: 'B', shortName: 'Faculty of Agric' },
  { name: 'Faculty of Law', lat: 7.4465, lng: 3.9045, type: 'faculty', tariffTier: 'B', shortName: 'Faculty of Law' },
  { name: 'Faculty of Social Sciences', lat: 7.4470, lng: 3.9055, type: 'faculty', tariffTier: 'B', shortName: 'Social Sciences' },
  { name: 'Department of Economics & Management', lat: 7.4468, lng: 3.9052, type: 'faculty', tariffTier: 'B', shortName: 'Economics Dept' },
  { name: 'Department of Political Science & Sociology', lat: 7.4471, lng: 3.9056, type: 'faculty', tariffTier: 'B', shortName: 'Political Science' },
  { name: 'Institute of Education', lat: 7.4510, lng: 3.9070, type: 'faculty', tariffTier: 'B', shortName: 'Institute of Educ.' },
  { name: 'PAULESI (Pan African University)', lat: 7.4560, lng: 3.9040, type: 'faculty', tariffTier: 'B', shortName: 'PAULESI' },
  { name: 'CPEEL Energy Centre', lat: 7.4550, lng: 3.9065, type: 'faculty', tariffTier: 'B', shortName: 'CPEEL' },
  { name: 'IPPS Centre', lat: 7.4545, lng: 3.9050, type: 'faculty', tariffTier: 'B', shortName: 'IPPS' },

  // ─── WORSHIP, RECREATION & COMMUNITY ──────────────────────────────────────────
  { name: 'UI Zoological Gardens (Zoo)', lat: 7.4422, lng: 3.8982, type: 'landmark', tariffTier: 'A', shortName: 'UI Zoo' },
  { name: 'UI Botanical Gardens', lat: 7.4485, lng: 3.9015, type: 'landmark', tariffTier: 'B', shortName: 'Botanical Gardens' },
  { name: 'Chapel of the Resurrection', lat: 7.4460, lng: 3.9018, type: 'landmark', tariffTier: 'A', shortName: 'Chapel' },
  { name: 'Our Lady Seat of Wisdom Catholic Church', lat: 7.4451, lng: 3.9022, type: 'landmark', tariffTier: 'A', shortName: 'Catholic Church' },
  { name: 'UI Central Mosque', lat: 7.4468, lng: 3.9025, type: 'landmark', tariffTier: 'A', shortName: 'Central Mosque' },
  { name: 'Awo Stadium', lat: 7.4535, lng: 3.8995, type: 'landmark', tariffTier: 'C', shortName: 'Awo Stadium' },
  { name: 'Senior Staff Club', lat: 7.4495, lng: 3.9020, type: 'landmark', tariffTier: 'B', shortName: 'Staff Club' },
  { name: 'Works & Maintenance Department', lat: 7.4500, lng: 3.9040, type: 'landmark', tariffTier: 'B', shortName: 'Works & Maint.' },
  { name: 'Diamond FM (101.1 FM)', lat: 7.4472, lng: 3.9030, type: 'landmark', tariffTier: 'B', shortName: 'Diamond FM' },
  { name: 'UI Staff School', lat: 7.4455, lng: 3.9055, type: 'landmark', tariffTier: 'B', shortName: 'Staff School' },
  { name: 'UI Cooperative Building', lat: 7.4460, lng: 3.9060, type: 'landmark', tariffTier: 'B', shortName: 'UI Cooperative' },
  { name: 'Palm 77 Hotel', lat: 7.4420, lng: 3.9030, type: 'landmark', tariffTier: 'B', shortName: 'Palm 77' },
  { name: 'Talent Discovery Centre', lat: 7.4430, lng: 3.9040, type: 'landmark', tariffTier: 'B', shortName: 'Talent Centre' },
  { name: 'International Conference Centre (ICC UI)', lat: 7.4405, lng: 3.9080, type: 'landmark', tariffTier: 'B', shortName: 'ICC UI' },
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
  if (distanceMeters <= 60) {
    // Exact building or street pin
    formattedName = closestHub.name;
  } else if (distanceMeters <= 160) {
    // Right next to the landmark
    formattedName = closestHub.type === 'road' ? closestHub.name : `Near ${closestHub.name}`;
  } else if (distanceMeters <= 320) {
    // Within the vicinity
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
