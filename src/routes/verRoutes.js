import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { verdata } from "../controller/verController.js";

const router = express.Router();
// Ver una novedad específica (requiere autenticación)
router.get("/ver/:id", isAuthenticated, verdata);

export default router;