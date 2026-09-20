import { verifyAccessToken } from "../utils/token.js";

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or malformed token" });
    }

    try {
        const decoded = verifyAccessToken(authHeader.split(" ")[1]);
        req.user = {
            ...decoded,
            _id: decoded.sub,
            id: decoded.sub,
        };
        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
};
