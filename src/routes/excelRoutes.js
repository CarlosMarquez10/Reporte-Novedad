import express from 'express';
import { descargarExcel } from '../controller/excelController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/descargarExcel', isAuthenticated, descargarExcel);

export default router;
