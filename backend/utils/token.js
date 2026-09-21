import jwt from "jsonwebtoken";

const getAccessSecret = () => process.env.JWT_SECRET || "default_jwt_access_secret_rideui_campus";
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "default_jwt_refresh_secret_rideui_campus";

export const signAccessToken = (user) =>
    jwt.sign({ sub: user._id.toString(), role: user.role }, getAccessSecret(), { expiresIn: "15m" });

export const signRefreshToken = (user) =>
    jwt.sign({ sub: user._id.toString() }, getRefreshSecret(), { expiresIn: "30d" });

export const verifyAccessToken = (token) => jwt.verify(token, getAccessSecret());
export const verifyRefreshToken = (token) => jwt.verify(token, getRefreshSecret());
