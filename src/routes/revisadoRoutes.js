import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { Revisados } from "../controller/revisadoController.js";

const router = express.Router();
// Información (requiere autenticación)
router.get("/informacion", isAuthenticated, Revisados);

export default router;