import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { actualizar } from "../controller/actualizarEstadoController.js";

const router = express.Router();

// Actualizar estado a "Revisado" (requiere autenticación)
router.post("/revisado/:id", isAuthenticated, actualizar);

export default router;