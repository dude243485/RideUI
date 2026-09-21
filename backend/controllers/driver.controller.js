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

// POST /drivers/seed-demo   Seed or activate drivers in MongoDB for immediate demo evaluation
export async function seedDemoDrivers(req, res) {
  try {
    const { seedCustomDrivers } = await import('../seed/seed-drivers.js');
    const count = parseInt(req.body?.count || req.query?.count || 50, 10);
    const created = await seedCustomDrivers(count);

    res.json({
      message: `Successfully seeded and activated ${created.length} live campus transporters in MongoDB`,
      count: created.length,
      sampleCredentials: {
        email: 'driver1@test.com',
        password: 'password123',
        phone: '08030000001',
      },
      drivers: created.slice(0, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /drivers/seed-many   Seed 100-250 drivers with custom format (driver1@test.com ...)
export async function seedManyDrivers(req, res) {
  try {
    const { seedCustomDrivers } = await import('../seed/seed-drivers.js');
    const requestedCount = parseInt(req.body?.count || req.query?.count || 150, 10);
    const count = Math.min(250, Math.max(10, requestedCount));
    const created = await seedCustomDrivers(count);

    res.json({
      message: `Successfully seeded and activated ${created.length} drivers in MongoDB`,
      count: created.length,
      sampleCredentials: {
        email: 'driver1@test.com',
        password: 'password123',
        phone: '08030000001',
      },
      drivers: created.slice(0, 15),
    });
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
