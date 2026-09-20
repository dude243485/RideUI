import mongoose from 'mongoose';

const hubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['hostel', 'faculty', 'gate', 'landmark', 'other'],
      default: 'other',
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    // Matches the official UI Students' Union tariff sheet (A-D, or null for Main Gate / custom hubs)
    tariffTier: {
      type: String,
      enum: ['A', 'B', 'C', 'D', null],
      default: null,
    },
  },
  { timestamps: true }
);

// Helpful index for lookup by name and tier
hubSchema.index({ name: 1 });
hubSchema.index({ tariffTier: 1 });

const Hub = mongoose.models.Hub || mongoose.model('Hub', hubSchema);

export default Hub;
