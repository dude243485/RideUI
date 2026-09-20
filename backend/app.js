import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import rideRoutes from "./routes/ride.routes.js";
import hubRoutes from "./routes/hub.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import Hub from "./models/Hub.js";
import { campusHubsData } from "./seed/hubs.js";
import { estimateRide } from "./controllers/ride.controller.js";

const app = express();
app.set("trust proxy", 1);

app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }));

app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "RideUI Backend API is running" });
});

// Direct aliases for frontend useFare and useStops hooks
app.post(["/api/fare", "/fare"], estimateRide);

app.get(["/api/stops", "/stops"], async (req, res) => {
    try {
        let hubs = await Hub.find().sort({ name: 1 });
        if (!hubs || hubs.length === 0) {
            // Fallback to campus seed data if database hasn't been seeded yet
            hubs = campusHubsData.map((h, i) => ({
                _id: `seed_${i}`,
                name: h.name,
                coordinates: h.coordinates,
                tariffTier: h.tariffTier,
            }));
        }
        const stops = hubs.map((h) => ({
            id: String(h._id || h.name),
            name: h.name,
            lat: h.coordinates.lat,
            lng: h.coordinates.lng,
            tariffTier: h.tariffTier,
        }));
        res.json(stops);
    } catch {
        const stops = campusHubsData.map((h, i) => ({
            id: `seed_${i}`,
            name: h.name,
            lat: h.coordinates.lat,
            lng: h.coordinates.lng,
            tariffTier: h.tariffTier,
        }));
        res.json(stops);
    }
});

// Mounted routes (both /api/* and root prefixes for spec compatibility)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/rides", rideRoutes);
app.use("/rides", rideRoutes);

app.use("/api/hubs", hubRoutes);
app.use("/hubs", hubRoutes);

app.use("/api/drivers", driverRoutes);
app.use("/drivers", driverRoutes);

// Centralized error handling
app.use(errorHandler);

export default app;