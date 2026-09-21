import '../config/environment.js';
import mongoose from 'mongoose';
import Hub from '../models/Hub.js';

export const campusHubsData = [
  // Primary Origin
  {
    name: 'Main Gate',
    type: 'gate',
    coordinates: { lat: 7.4416, lng: 3.9006 },
    tariffTier: null,
  },

  // Tier A Destinations (₦100 shared)
  {
    name: 'Independence Hall',
    type: 'hostel',
    coordinates: { lat: 7.4468, lng: 3.8936 },
    tariffTier: 'A',
  },
  {
    name: 'Azikiwe Hall',
    type: 'hostel',
    coordinates: { lat: 7.4440, lng: 3.8945 },
    tariffTier: 'A',
  },
  {
    name: 'Jaja Clinic',
    type: 'landmark',
    coordinates: { lat: 7.4472, lng: 3.8968 },
    tariffTier: 'A',
  },
  {
    name: 'Sultan Bello Hall',
    type: 'hostel',
    coordinates: { lat: 7.4455, lng: 3.8985 },
    tariffTier: 'A',
  },
  {
    name: 'Kenneth Dike Library',
    type: 'landmark',
    coordinates: { lat: 7.4446, lng: 3.9002 },
    tariffTier: 'A',
  },
  {
    name: 'Trenchard Hall',
    type: 'landmark',
    coordinates: { lat: 7.4438, lng: 3.9006 },
    tariffTier: 'A',
  },
  {
    name: 'UI Zoo',
    type: 'landmark',
    coordinates: { lat: 7.4422, lng: 3.8982 },
    tariffTier: 'A',
  },
  {
    name: 'Queens Hall',
    type: 'hostel',
    coordinates: { lat: 7.443, lng: 3.9015 },
    tariffTier: 'A',
  },
  {
    name: 'Bookshop',
    type: 'landmark',
    coordinates: { lat: 7.4436, lng: 3.9002 },
    tariffTier: 'A',
  },
  {
    name: 'Tedder Hall',
    type: 'hostel',
    coordinates: { lat: 7.4452, lng: 3.8998 },
    tariffTier: 'A',
  },
  {
    name: 'Mellanby Hall',
    type: 'hostel',
    coordinates: { lat: 7.4458, lng: 3.9005 },
    tariffTier: 'A',
  },
  {
    name: 'S.U.B',
    type: 'landmark',
    coordinates: { lat: 7.4445, lng: 3.901 },
    tariffTier: 'A',
  },
  {
    name: 'Catholic Church',
    type: 'landmark',
    coordinates: { lat: 7.4451, lng: 3.9022 },
    tariffTier: 'A',
  },
  {
    name: 'Chapel',
    type: 'landmark',
    coordinates: { lat: 7.446, lng: 3.9018 },
    tariffTier: 'A',
  },
  {
    name: 'Mosque',
    type: 'landmark',
    coordinates: { lat: 7.4468, lng: 3.9025 },
    tariffTier: 'A',
  },
  {
    name: 'Kuti',
    type: 'hostel',
    coordinates: { lat: 7.4462, lng: 3.8988 },
    tariffTier: 'A',
  },
  {
    name: 'Faculty of Arts',
    type: 'faculty',
    coordinates: { lat: 7.4448, lng: 3.8985 },
    tariffTier: 'A',
  },

  // Tier B Destinations (₦150 shared)
  {
    name: 'Barth Road',
    type: 'other',
    coordinates: { lat: 7.4473, lng: 3.8972 },
    tariffTier: 'B',
  },
  {
    name: 'Abadina Road',
    type: 'other',
    coordinates: { lat: 7.4525, lng: 3.9068 },
    tariffTier: 'B',
  },
  {
    name: 'Faculty of Science',
    type: 'faculty',
    coordinates: { lat: 7.4458, lng: 3.9030 },
    tariffTier: 'B',
  },
  {
    name: 'Benue Road',
    type: 'other',
    coordinates: { lat: 7.448, lng: 3.899 },
    tariffTier: 'B',
  },
  {
    name: 'Faculty of Education',
    type: 'faculty',
    coordinates: { lat: 7.4475, lng: 3.904 },
    tariffTier: 'B',
  },
  {
    name: 'Faculty of Agriculture',
    type: 'faculty',
    coordinates: { lat: 7.4485, lng: 3.9035 },
    tariffTier: 'B',
  },
  {
    name: 'Faculty of Technology',
    type: 'faculty',
    coordinates: { lat: 7.449, lng: 3.905 },
    tariffTier: 'B',
  },
  {
    name: 'Faculty of Law',
    type: 'faculty',
    coordinates: { lat: 7.4465, lng: 3.9045 },
    tariffTier: 'B',
  },
  {
    name: 'Faculty of Social Sciences',
    type: 'faculty',
    coordinates: { lat: 7.447, lng: 3.9055 },
    tariffTier: 'B',
  },
  {
    name: 'Botany',
    type: 'faculty',
    coordinates: { lat: 7.4482, lng: 3.9012 },
    tariffTier: 'B',
  },
  {
    name: 'Awo Hall',
    type: 'hostel',
    coordinates: { lat: 7.452, lng: 3.898 },
    tariffTier: 'B',
  },
  {
    name: 'Idia Hall',
    type: 'hostel',
    coordinates: { lat: 7.4505, lng: 3.8975 },
    tariffTier: 'B',
  },
  {
    name: 'Abdusalam',
    type: 'hostel',
    coordinates: { lat: 7.453, lng: 3.8965 },
    tariffTier: 'B',
  },
  {
    name: 'Palm 77',
    type: 'landmark',
    coordinates: { lat: 7.442, lng: 3.903 },
    tariffTier: 'B',
  },
  {
    name: 'Talent',
    type: 'landmark',
    coordinates: { lat: 7.443, lng: 3.904 },
    tariffTier: 'B',
  },
  {
    name: 'PG',
    type: 'hostel',
    coordinates: { lat: 7.4515, lng: 3.899 },
    tariffTier: 'B',
  },
  {
    name: 'Staff Club',
    type: 'landmark',
    coordinates: { lat: 7.4495, lng: 3.902 },
    tariffTier: 'B',
  },
  {
    name: 'Anatomy',
    type: 'faculty',
    coordinates: { lat: 7.4425, lng: 3.905 },
    tariffTier: 'B',
  },
  {
    name: 'UI Cooperative',
    type: 'landmark',
    coordinates: { lat: 7.446, lng: 3.906 },
    tariffTier: 'B',
  },
  {
    name: 'Maintenance',
    type: 'landmark',
    coordinates: { lat: 7.45, lng: 3.904 },
    tariffTier: 'B',
  },
  {
    name: 'Diamond FM',
    type: 'landmark',
    coordinates: { lat: 7.4472, lng: 3.903 },
    tariffTier: 'B',
  },
  {
    name: 'Staff School',
    type: 'landmark',
    coordinates: { lat: 7.4455, lng: 3.9055 },
    tariffTier: 'B',
  },
  {
    name: 'ICC',
    type: 'landmark',
    coordinates: { lat: 7.4405, lng: 3.908 },
    tariffTier: 'B',
  },
  {
    name: 'Second Gate',
    type: 'gate',
    coordinates: { lat: 7.448, lng: 3.91 },
    tariffTier: 'B',
  },
  {
    name: 'Abadina Gate',
    type: 'gate',
    coordinates: { lat: 7.454, lng: 3.906 },
    tariffTier: 'B',
  },

  // Tier C Destinations (₦200 shared)
  {
    name: 'Awo Stadium',
    type: 'landmark',
    coordinates: { lat: 7.4535, lng: 3.8995 },
    tariffTier: 'C',
  },
  {
    name: 'Poly Gate',
    type: 'gate',
    coordinates: { lat: 7.438, lng: 3.892 },
    tariffTier: 'C',
  },
  {
    name: 'Ajibode Maternity Junction',
    type: 'landmark',
    coordinates: { lat: 7.458, lng: 3.902 },
    tariffTier: 'C',
  },

  // Tier D Destinations (₦250 shared)
  {
    name: 'DLC Sasa',
    type: 'landmark',
    coordinates: { lat: 7.465, lng: 3.915 },
    tariffTier: 'D',
  },
  {
    name: 'PAULESI',
    type: 'faculty',
    coordinates: { lat: 7.456, lng: 3.904 },
    tariffTier: 'D',
  },
  {
    name: 'Adebayo Akande Hall',
    type: 'hostel',
    coordinates: { lat: 7.457, lng: 3.895 },
    tariffTier: 'D',
  },
  {
    name: 'Institute of Education',
    type: 'faculty',
    coordinates: { lat: 7.451, lng: 3.907 },
    tariffTier: 'D',
  },
  {
    name: 'Lakoto',
    type: 'other',
    coordinates: { lat: 7.459, lng: 3.908 },
    tariffTier: 'D',
  },
  {
    name: 'IPPS',
    type: 'faculty',
    coordinates: { lat: 7.4545, lng: 3.905 },
    tariffTier: 'D',
  },
  {
    name: 'CPEEL',
    type: 'faculty',
    coordinates: { lat: 7.455, lng: 3.9065 },
    tariffTier: 'D',
  },
  {
    name: 'UI Ajibode Extension',
    type: 'landmark',
    coordinates: { lat: 7.462, lng: 3.903 },
    tariffTier: 'D',
  },
];

export async function seedHubs() {
  console.log('Seeding campus hubs with University of Ibadan coordinates...');
  let count = 0;
  for (const hubData of campusHubsData) {
    await Hub.findOneAndUpdate(
      { name: hubData.name },
      { $set: hubData },
      { upsert: true, new: true }
    );
    count++;
  }
  console.log(`Successfully seeded/updated ${count} hubs.`);
  return count;
}

// If invoked directly from CLI: node seed/hubs.js
const isDirectRun = process.argv[1]?.endsWith('hubs.js');
if (isDirectRun) {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/rideui';
  mongoose
    .connect(uri)
    .then(async () => {
      await seedHubs();
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to seed hubs:', err);
      process.exit(1);
    });
}
