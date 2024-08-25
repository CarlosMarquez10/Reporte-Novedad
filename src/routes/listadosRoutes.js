import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { listado } from "../controller/listadoController.js";

const router = express.Router();
// Listado (requiere autenticación)
router.get('/listado', isAuthenticated, listado);

export default router;