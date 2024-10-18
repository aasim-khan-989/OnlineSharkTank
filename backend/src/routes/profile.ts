import { Router } from "express";
import { getUserProfile } from "../controllers/profileController";

const router = Router();

router.get("/profile/:username", getUserProfile);

export default router;
