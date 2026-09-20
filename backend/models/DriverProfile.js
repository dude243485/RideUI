import mongoose from 'mongoose';

const driverProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ['car', 'keke'],
      default: 'keke',
      required: true,
    },
    plateNumber: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'offline',
      required: true,
    },
    currentHub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hub',
      default: null,
    },
  },
  { timestamps: true }
);

driverProfileSchema.index({ status: 1 });
driverProfileSchema.index({ currentHub: 1 });

const DriverProfile =
  mongoose.models.DriverProfile || mongoose.model('DriverProfile', driverProfileSchema);

export default DriverProfile;
