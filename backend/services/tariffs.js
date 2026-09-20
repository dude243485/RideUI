// Source-of-truth tariff data from the official UI Students' Union tariff sheet (released 3 Aug 2024)

export const STANDARD_PICKUP_HUB = 'Main Gate';

export const SHARED_FARES = {
  A: 100,
  B: 150,
  C: 200,
  D: 250,
};

export const DROP_FARES = {
  A: { fare: 300, serviceType: 'Keke Drop' },
  B: { fare: 400, serviceType: 'Keke Drop' },
  C: { fare: 500, serviceType: 'Car Drop' },
  D: { fare: 500, serviceType: 'Car Drop' },
  unlisted: { fare: 500, serviceType: 'Car Drop' },
};

export const TARIFF_DESTINATIONS = {
  A: [
    'Independence Hall',
    'Azikiwe Hall',
    'Queens Hall',
    'Bookshop',
    'Tedder Hall',
    'Mellanby Hall',
    'S.U.B',
    'Catholic Church',
    'Chapel',
    'Mosque',
    'Kuti',
    'Faculty of Arts',
  ],
  B: [
    'Benue Road',
    'Faculty of Education',
    'Faculty of Agriculture',
    'Faculty of Technology',
    'Faculty of Law',
    'Faculty of Social Sciences',
    'Botany',
    'Awo Hall',
    'Idia Hall',
    'Abdusalam',
    'Palm 77',
    'Talent',
    'PG',
    'Staff Club',
    'Anatomy',
    'UI Cooperative',
    'Maintenance',
    'Diamond FM',
    'Staff School',
    'ICC',
    'Second Gate',
    'Abadina Gate',
  ],
  C: [
    'Awo Stadium',
    'Poly Gate',
    'Ajibode Maternity Junction',
  ],
  D: [
    'DLC Sasa',
    'PAULESI',
    'Adebayo Akande Hall',
    'Institute of Education',
    'Lakoto',
    'IPPS',
    'CPEEL',
    'UI Ajibode Extension',
  ],
};

// Quick helper to look up a tier given destination hub name
export function getTierForDestination(destName) {
  if (!destName) return null;
  const normalized = destName.trim().toLowerCase();

  for (const [tier, destinations] of Object.entries(TARIFF_DESTINATIONS)) {
    if (destinations.some((d) => d.toLowerCase() === normalized)) {
      return tier;
    }
  }
  return null;
}
