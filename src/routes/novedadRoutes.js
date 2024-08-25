import express from 'express';
import { renderForm, submitForm } from '../controller/novedadController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Configurar almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", renderForm);
router.post("/submit", upload.single("foto"), submitForm);

// Otras rutas para listado, actualización, eliminación...

export default router;
