import Ride from '../models/Ride.js';
import Hub from '../models/Hub.js';
import DriverProfile from '../models/DriverProfile.js';
import { estimateFare } from '../services/pricing.js';
import { findNearestDrivers } from '../services/matching.js';
import {
  notifyDriverNewRequest,
  notifyRiderMatch,
  notifyRiderCancel,
  notifyRideCompleted,
} from '../services/socket.js';

// POST /rides/estimate   { pickupHubId, destinationHubId } OR { pickup: {lat, lng}, destination: {lat, lng} }
// Step 1: fare + service type + tier + ranked driver suggestions.
export async function estimateRide(req, res) {
  try {
    const { pickupHubId, destinationHubId, pickup, destination } = req.body;

    let pickupHub = null;
    let destinationHub = null;

    if (pickupHubId) {
      pickupHub = await Hub.findById(pickupHubId);
    }
    if (destinationHubId) {
      destinationHub = await Hub.findById(destinationHubId);
    }

    // Resolve pickup location
    const pickupObj = pickupHub
      ? {
          hubId: pickupHub._id,
          name: pickupHub.name,
          tariffTier: pickupHub.tariffTier,
          coordinates: pickupHub.coordinates,
        }
      : pickup
      ? {
          name: pickup.name || 'Custom Location',
          coordinates: { lat: Number(pickup.lat), lng: Number(pickup.lng) },
        }
      : null;

    // Resolve destination location
    const destinationObj = destinationHub
      ? {
          hubId: destinationHub._id,
          name: destinationHub.name,
          tariffTier: destinationHub.tariffTier,
          coordinates: destinationHub.coordinates,
        }
      : destination
      ? {
          name: destination.name || 'Custom Destination',
          coordinates: { lat: Number(destination.lat), lng: Number(destination.lng) },
        }
      : null;

    if (!pickupObj || !destinationObj) {
      return res.status(400).json({
        error: 'Please provide valid pickup and destination (either Hub IDs or coordinates)',
      });
    }

    const { distanceKm, fare, serviceType, tier } = estimateFare(pickupObj, destinationObj);
    const suggestedDrivers = await findNearestDrivers(pickupObj.coordinates);

    res.json({
      distanceKm,
      fare,
      serviceType,
      tier,
      pickup: pickupObj,
      destination: destinationObj,
      suggestedDrivers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /rides   { pickupHubId, destinationHubId, driverId } OR { pickup, destination, driverId }
// Step 2: rider books a ride with a specific driver -> creates pending ride.
export async function requestRide(req, res) {
  try {
    const { pickupHubId, destinationHubId, pickup, destination, driverId } = req.body;
    const riderId = req.user._id || req.user.sub;

    if (!driverId) {
      return res.status(400).json({ error: 'Driver ID is required' });
    }

    let pickupHub = null;
    let destinationHub = null;

    if (pickupHubId) pickupHub = await Hub.findById(pickupHubId);
    if (destinationHubId) destinationHub = await Hub.findById(destinationHubId);

    const pickupCoords = pickupHub?.coordinates || (pickup?.lat != null && pickup?.lng != null ? { lat: Number(pickup.lat), lng: Number(pickup.lng) } : null);
    const destCoords = destinationHub?.coordinates || (destination?.lat != null && destination?.lng != null ? { lat: Number(destination.lat), lng: Number(destination.lng) } : null);

    if (!pickupCoords || !destCoords) {
      return res.status(400).json({ error: 'Valid pickup and destination are required' });
    }

    const pickupObj = pickupHub
      ? { name: pickupHub.name, coordinates: pickupHub.coordinates, tariffTier: pickupHub.tariffTier }
      : { name: pickup?.name || 'Custom Location', coordinates: pickupCoords };

    const destObj = destinationHub
      ? { name: destinationHub.name, coordinates: destinationHub.coordinates, tariffTier: destinationHub.tariffTier }
      : { name: destination?.name || 'Custom Destination', coordinates: destCoords };

    const { distanceKm, fare, serviceType, tier } = estimateFare(pickupObj, destObj);

    const ride = await Ride.create({
      rider: riderId,
      driver: driverId,
      pickupHub: pickupHub?._id || null,
      destinationHub: destinationHub?._id || null,
      pickup: {
        lat: pickupCoords.lat,
        lng: pickupCoords.lng,
        name: pickupObj.name,
      },
      destination: {
        lat: destCoords.lat,
        lng: destCoords.lng,
        name: destObj.name,
      },
      distanceKm,
      fare,
      serviceType,
      tier,
      status: 'requested',
    });

    const populatedRide = await Ride.findById(ride._id)
      .populate('rider', 'name phone email')
      .populate('pickupHub', 'name coordinates tariffTier')
      .populate('destinationHub', 'name coordinates tariffTier');

    // Notify driver via Socket.io
    notifyDriverNewRequest(driverId, populatedRide);

    res.status(201).json(populatedRide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PATCH /rides/:id/respond   { action: "accept" | "decline" }
// Step 3: driver accepts or declines request
export async function respondToRide(req, res) {
  try {
    const { action } = req.body;

    const ride = await Ride.findById(req.params.id)
      .populate('rider', 'name phone')
      .populate({ path: 'driver', populate: { path: 'user', select: 'name phone' } });

    if (!ride || ride.status !== 'requested') {
      return res.status(404).json({ error: 'Ride not found or no longer pending' });
    }

    if (action === 'decline') {
      ride.status = 'cancelled';
      ride.cancelledAt = new Date();
      await ride.save();

      notifyRiderCancel(ride.rider._id, {
        rideId: ride._id,
        status: 'cancelled',
        message: 'Driver declined the request',
      });

      return res.json({ status: 'cancelled' });
    }

    if (action !== 'accept') {
      return res.status(400).json({ error: 'Action must be "accept" or "decline"' });
    }

    ride.status = 'matched';
    ride.matchedAt = new Date();
    await ride.save();

    if (ride.driver?._id) {
      await DriverProfile.findByIdAndUpdate(ride.driver._id, { status: 'busy' });
    }

    const matchPayload = {
      rideId: ride._id,
      status: ride.status,
      fare: ride.fare,
      serviceType: ride.serviceType,
      rider: { name: ride.rider?.name, phone: ride.rider?.phone },
      driver: {
        driverId: ride.driver?._id,
        name: ride.driver?.user?.name,
        phone: ride.driver?.user?.phone,
        vehicleType: ride.driver?.vehicleType,
        plateNumber: ride.driver?.plateNumber,
      },
    };

    // Live socket notification to rider
    notifyRiderMatch(ride.rider._id, matchPayload);

    res.json(matchPayload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /rides/:id   Fetch / poll ride details
export async function getRideById(req, res) {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('rider', 'name phone email')
      .populate({ path: 'driver', populate: { path: 'user', select: 'name phone' } })
      .populate('pickupHub', 'name coordinates tariffTier')
      .populate('destinationHub', 'name coordinates tariffTier');

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /rides   Query rides (driver dashboard feed, rider history)
// Examples:
// /rides?driver=me&status=requested -> driver dashboard feed
// /rides?rider=me -> rider ride history
export async function getRides(req, res) {
  try {
    const filter = {};
    const userId = req.user._id || req.user.sub;

    if (req.query.driver === 'me') {
      const driverProfile = await DriverProfile.findOne({ user: userId });
      if (!driverProfile) {
        return res.status(404).json({ error: 'Driver profile not found for current user' });
      }
      filter.driver = driverProfile._id;
    } else if (req.query.driverId) {
      filter.driver = req.query.driverId;
    }

    if (req.query.rider === 'me') {
      filter.rider = userId;
    } else if (req.query.riderId) {
      filter.rider = req.query.riderId;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const rides = await Ride.find(filter)
      .populate('rider', 'name phone')
      .populate({ path: 'driver', populate: { path: 'user', select: 'name phone' } })
      .populate('pickupHub', 'name coordinates')
      .populate('destinationHub', 'name coordinates')
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PATCH /rides/:id/complete   Mark ride as complete and free the driver
export async function completeRide(req, res) {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.status === 'completed' || ride.status === 'cancelled') {
      return res.status(400).json({ error: `Ride is already ${ride.status}` });
    }

    ride.status = 'completed';
    ride.completedAt = new Date();
    await ride.save();

    // Flip driver back to available
    if (ride.driver) {
      await DriverProfile.findByIdAndUpdate(ride.driver, { status: 'available' });
    }

    notifyRideCompleted(ride.rider, ride.driver, {
      rideId: ride._id,
      status: 'completed',
      completedAt: ride.completedAt,
    });

    res.json({ message: 'Ride completed successfully', ride });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PATCH /rides/:id/cancel   Cancel a pending ride before response
export async function cancelRide(req, res) {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.status !== 'requested') {
      return res.status(400).json({ error: `Cannot cancel ride with status '${ride.status}'` });
    }

    ride.status = 'cancelled';
    ride.cancelledAt = new Date();
    await ride.save();

    notifyRiderCancel(ride.rider, {
      rideId: ride._id,
      status: 'cancelled',
      message: 'Ride was cancelled by the rider',
    });

    res.json({ message: 'Ride cancelled successfully', ride });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}