import { Router } from "express";
import {
    googleAuth,
    login,
    logout,
    me,
    refresh,
    register,
    updateProfile,
    updateUserStatus,
} from "../controllers/auth.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.patch("/profile", requireAuth, updateProfile);
router.patch("/users/status", requireAuth, requireRole("admin"), updateUserStatus);

export default router;
