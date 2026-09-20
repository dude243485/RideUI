import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import rideRoutes from "./routes/ride.routes.js";
import hubRoutes from "./routes/hub.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
app.set("trust proxy", 1);

app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }));

app.use(express.json());
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "RideUI Backend API is running" });
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