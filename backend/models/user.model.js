import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },

        email: { type: String, required: true, unique: true, lowercase: true, trim: true },

        phone: { type: String, trim: true },

        passwordHash: { type: String, select: false },

        authProvider: { type: String, enum: ["local", "google"], default: "local" },

        googleId: { type: String, unique: true, sparse: true },

        role: { type: String, enum: ["rider", "driver", "admin"], default: "rider" },

        status: { type: String, enum: ["active", "suspended"], default: "active" },
        
        refreshTokenHash: { type: String, select: false },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);