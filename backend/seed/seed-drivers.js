import '../config/environment.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import DriverProfile from '../models/DriverProfile.js';
import Hub from '../models/Hub.js';
import { seedHubs } from './hubs.js';

const NIGERIAN_DRIVER_NAMES = [
  'Musa Alao', 'Tunde Oladipo', 'Ibrahim Sanni', 'Emeka Obi', 'Rasheed Adeleke',
  'Segun Awolowo', 'Chinedu Eze', 'Babatunde Fashola', 'Haruna Danladi', 'Kelechi Iheanacho',
  'Sunday Dare', 'Taiwo Akinkunmi', 'Kehinde Balogun', 'Idowu Ojo', 'Femi Adesina',
  'Ahmed Bello', 'Usman Danfodio', 'Yakubu Gowon', 'Abiola Kashamu', 'Gbenga Daniel',
  'Olawale Bakare', 'Kayode Fayemi', 'Nnamdi Kanu', 'Jamiu Alabi', 'Damilola Adebayo',
  'Adebisi Akande', 'Saheed Omo', 'Wasiu Ayinde', 'Rotimi Akeredolu', 'Gbolahan Obisesan',
  'Bimbo Ogundipe', 'Lateef Jakande', 'Morufu Adewale', 'Alani Bankole', 'Ayodele Fayose',
  'Gani Adams', 'Yomi Casual', 'Sulaiman Bello', 'Akeem Lasisi', 'Taofeek Arapaja'
];

/**
 * Seeds a specified number of active drivers with custom email format:
 * driver1 -> driver1@test.com
 * driver2 -> driver2@test.com
 * ...
 * driverN -> driverN@test.com
 * 
 * Password for all drivers: password123
 */
export async function seedCustomDrivers(count = 150) {
  console.log(`Ensuring campus hubs are seeded...`);
  await seedHubs();

  const hubs = await Hub.find().sort({ name: 1 });
  if (!hubs || hubs.length === 0) {
    throw new Error('No campus hubs found in database');
  }

  console.log(`Seeding ${count} drivers scattered across ${hubs.length} campus hubs...`);

  // Pre-hash password123 once for high performance
  const passwordHash = await bcrypt.hash('password123', 10);

  const results = [];

  for (let i = 1; i <= count; i++) {
    const email = `driver${i}@test.com`;
    const assignedName = NIGERIAN_DRIVER_NAMES[(i - 1) % NIGERIAN_DRIVER_NAMES.length];
    const name = `Driver ${i} (${assignedName})`;
    const phone = `0803${String(i).padStart(7, '0')}`;
    const vehicleType = i % 3 === 0 ? 'car' : 'keke';
    const plateNumber = `OYO-${1000 + i}-${vehicleType === 'car' ? 'CR' : 'KK'}`;

    // Select hub and scatter coordinates slightly around the hub (~50m - 120m)
    const hub = hubs[(i - 1) % hubs.length];
    const latOffset = Number((Math.sin(i * 1.5) * 0.0011).toFixed(5));
    const lngOffset = Number((Math.cos(i * 1.5) * 0.0011).toFixed(5));

    const coordinates = {
      lat: Number((hub.coordinates.lat + latOffset).toFixed(5)),
      lng: Number((hub.coordinates.lng + lngOffset).toFixed(5)),
    };

    // 1. Create or update User record
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        phone,
        passwordHash,
        role: 'driver',
        status: 'active',
        authProvider: 'local',
      });
    } else {
      user.name = name;
      user.phone = phone;
      user.passwordHash = passwordHash;
      user.role = 'driver';
      user.status = 'active';
      await user.save();
    }

    // 2. Create or update DriverProfile record
    const profile = await DriverProfile.findOneAndUpdate(
      { user: user._id },
      {
        $set: {
          user: user._id,
          vehicleType,
          plateNumber,
          status: 'available', // Active & ready for matching
          currentHub: hub._id,
          currentCoordinates: coordinates,
        },
      },
      { upsert: true, new: true }
    );

    results.push({
      driverId: profile._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      vehicleType: profile.vehicleType,
      plateNumber: profile.plateNumber,
      hub: hub.name,
      coordinates,
      status: profile.status,
    });

    if (i % 25 === 0 || i === count) {
      console.log(`Processed ${i}/${count} drivers...`);
    }
  }

  console.log(`\nSuccessfully seeded ${results.length} active drivers to database!`);
  console.log(`Sample credentials:`);
  console.log(`- Email: driver1@test.com (up to driver${count}@test.com)`);
  console.log(`- Password: password123`);
  console.log(`- Phone: 08030000001 (up to 0803${String(count).padStart(7, '0')})`);

  return results;
}

// CLI Execution: node seed/seed-drivers.js [count]
const isDirectRun = process.argv[1]?.replace(/\\/g, '/').endsWith('seed/seed-drivers.js');
if (isDirectRun) {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/rideui';
  const count = parseInt(process.argv[2] || process.env.DRIVER_COUNT || '150', 10);

  mongoose
    .connect(uri)
    .then(async () => {
      await seedCustomDrivers(count);
      await mongoose.disconnect();
      console.log('Finished. Disconnected from MongoDB.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to seed custom drivers:', err);
      process.exit(1);
    });
}
