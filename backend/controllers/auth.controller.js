import crypto from "crypto";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/token.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const sendAuthResponse = (res, user, accessToken, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({
        accessToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
};

export const register = async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, passwordHash, role: "rider" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    sendAuthResponse(res, user, accessToken, refreshToken);
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user || user.authProvider !== "local") return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    if (user.status === "suspended") return res.status(403).json({ message: "Account suspended" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    sendAuthResponse(res, user, accessToken, refreshToken);
};

export const googleAuth = async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "idToken is required" });

    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
        user = await User.findOne({ email: payload.email });
        if (user) {
            user.googleId = payload.sub;
            user.authProvider = "google";
        } else {
            user = new User({
                name: payload.name,
                email: payload.email,
                googleId: payload.sub,
                authProvider: "google",
            });
        }
    }

    if (user.status === "suspended") return res.status(403).json({ message: "Account suspended" });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    sendAuthResponse(res, user, accessToken, refreshToken);
};

export const refresh = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

    try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.sub).select("+refreshTokenHash");

        if (!user || user.refreshTokenHash !== hashToken(refreshToken)) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        res.json({ accessToken: signAccessToken(user) });
    } catch {
        res.status(401).json({ message: "Refresh token expired or invalid" });
    }
};

export const logout = async (req, res) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
        try {
            const decoded = verifyRefreshToken(refreshToken);
            await User.findByIdAndUpdate(decoded.sub, { refreshTokenHash: null });
        } catch {
            // Ignore errors, as we wan clear the cookie normally
        }
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
};

export const me = async (req, res) => {
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
};
