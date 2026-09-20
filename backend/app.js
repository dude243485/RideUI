import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";


const app = express();
app.set("trust proxy", 1);

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));  //should set some allowed origins later

app.use(express.json());
app.use(cookieParser());

//Health check route
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/auth", authRoutes);

export default app;