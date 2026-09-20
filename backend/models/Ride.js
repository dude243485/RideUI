import mongoose from 'mongoose';

const coordinateSchema = new mongoose.Schema(
  {
    lat: { type: Number },
    lng: { type: Number },
    name: { type: String },
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DriverProfile',
    },
    pickupHub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hub',
    },
    destinationHub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hub',
    },
    pickup: coordinateSchema,
    destination: coordinateSchema,
    fare: {
      type: Number,
      required: true,
    },
    serviceType: {
      type: String,
      enum: ['Shared Car/Keke', 'Keke Drop', 'Car Drop'],
      default: 'Keke Drop',
      required: true,
    },
    tier: {
      type: String,
      enum: ['A', 'B', 'C', 'D', null],
      default: null,
    },
    distanceKm: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['requested', 'matched', 'ongoing', 'completed', 'cancelled'],
      default: 'requested',
    },
    matchedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

rideSchema.index({ rider: 1, status: 1 });
rideSchema.index({ driver: 1, status: 1 });
rideSchema.index({ status: 1 });

const Ride = mongoose.models.Ride || mongoose.model('Ride', rideSchema);

export default Ride;
