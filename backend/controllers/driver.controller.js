import DriverProfile from '../models/DriverProfile.js';
import User from '../models/User.js';

// GET /drivers/me   Get current driver's profile
export async function getMyProfile(req, res) {
  try {
    const userId = req.user._id || req.user.sub;
    const profile = await DriverProfile.findOne({ user: userId })
      .populate('user', 'name email phone status')
      .populate('currentHub', 'name coordinates tariffTier');

    if (!profile) {
      return res.status(404).json({ error: 'Driver profile not found' });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PATCH /drivers/status   One-tap status, hub, and GPS location toggle
// Body: { status: "available" | "busy" | "offline", hubId?: string, coordinates?: { lat, lng } }
export async function updateStatusAndHub(req, res) {
  try {
    const userId = req.user._id || req.user.sub;
    const { status, hubId, coordinates } = req.body;

    const updates = {};
    if (status) {
      if (!['available', 'busy', 'offline'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be available, busy, or offline' });
      }
      updates.status = status;
    }

    if (hubId !== undefined) {
      updates.currentHub = hubId || null;
    }

    if (coordinates && coordinates.lat != null && coordinates.lng != null) {
      updates.currentCoordinates = {
        lat: Number(coordinates.lat),
        lng: Number(coordinates.lng),
      };
    }

    const profile = await DriverProfile.findOneAndUpdate(
      { user: userId },
      { $set: updates },
      { new: true, upsert: true }
    )
      .populate('user', 'name email phone')
      .populate('currentHub', 'name coordinates');

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /drivers/seed-demo   Seed or activate 3 real drivers in MongoDB for immediate demo evaluation
export async function seedDemoDrivers(req, res) {
  try {
    const Hub = (await import('../models/Hub.js')).default;
    const hubs = await Hub.find();
    const mainGate = hubs.find((h) => h.name === 'Main Gate') || hubs[0];
    const tedder = hubs.find((h) => h.name === 'Tedder Hall') || hubs[1];
    const tech = hubs.find((h) => h.name === 'Faculty of Technology') || hubs[2];

    const demoDrivers = [
      {
        name: 'Musa Alao',
        email: 'musa.alao@driver.ui.edu.ng',
        phone: '08034567891',
        vehicleType: 'keke',
        plateNumber: 'OYO-4521-KK',
        hub: mainGate?._id,
        coords: { lat: 7.4416, lng: 3.9006 },
      },
      {
        name: 'Tunde Oladipo',
        email: 'tunde.oladipo@driver.ui.edu.ng',
        phone: '08056789123',
        vehicleType: 'keke',
        plateNumber: 'OYO-7832-KK',
        hub: tedder?._id,
        coords: { lat: 7.4452, lng: 3.8998 },
      },
      {
        name: 'Ibrahim Sanni',
        email: 'ibrahim.sanni@driver.ui.edu.ng',
        phone: '08023456789',
        vehicleType: 'car',
        plateNumber: 'OYO-1190-CR',
        hub: tech?._id,
        coords: { lat: 7.4490, lng: 3.9050 },
      },
    ];

    const created = [];
    for (const d of demoDrivers) {
      let user = await User.findOne({ email: d.email });
      if (!user) {
        user = await User.create({
          name: d.name,
          email: d.email,
          phone: d.phone,
          passwordHash: 'dummy',
          role: 'driver',
        });
      } else {
        user.phone = d.phone;
        user.name = d.name;
        await user.save();
      }

      const profile = await DriverProfile.findOneAndUpdate(
        { user: user._id },
        {
          $set: {
            user: user._id,
            vehicleType: d.vehicleType,
            plateNumber: d.plateNumber,
            status: 'available',
            currentHub: d.hub || null,
            currentCoordinates: d.coords,
          },
        },
        { upsert: true, new: true }
      ).populate('user', 'name phone');

      created.push({
        driverId: profile._id,
        name: user.name,
        phone: user.phone,
        vehicleType: profile.vehicleType,
        plateNumber: profile.plateNumber,
        status: profile.status,
      });
    }

    res.json({ message: 'Live campus transporters activated in database', drivers: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /drivers   Create or register a driver profile
export async function createDriverProfile(req, res) {
  try {
    const { userId, vehicleType, plateNumber, currentHub, status } = req.body;
    const targetUserId = userId || req.user._id || req.user.sub;

    const existingUser = await User.findById(targetUserId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure role is driver
    if (existingUser.role !== 'driver') {
      existingUser.role = 'driver';
      await existingUser.save();
    }

    const existingProfile = await DriverProfile.findOne({ user: targetUserId });
    if (existingProfile) {
      return res.status(409).json({ error: 'Driver profile already exists for this user' });
    }

    const profile = await DriverProfile.create({
      user: targetUserId,
      vehicleType: vehicleType || 'keke',
      plateNumber,
      currentHub: currentHub || null,
      status: status || 'offline',
    });

    const populated = await DriverProfile.findById(profile._id)
      .populate('user', 'name email phone')
      .populate('currentHub', 'name coordinates');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /drivers   Admin list all drivers
export async function listDrivers(req, res) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.vehicleType) filter.vehicleType = req.query.vehicleType;

    const drivers = await DriverProfile.find(filter)
      .populate('user', 'name email phone status')
      .populate('currentHub', 'name coordinates');

    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /drivers/:id   Admin update driver profile
export async function updateDriverProfile(req, res) {
  try {
    const profile = await DriverProfile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('user', 'name email phone')
      .populate('currentHub', 'name coordinates');

    if (!profile) {
      return res.status(404).json({ error: 'Driver profile not found' });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
