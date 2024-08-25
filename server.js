import express from "express";
import bodyParser from "body-parser";
import session from 'express-session';
import path from "path";
import { fileURLToPath } from 'url';

import authRoutes from "./src/routes/authRoutes.js";
import novedadRoutes from "./src/routes/novedadRoutes.js";
import excelRoutes from "./src/routes/excelRoutes.js";
import listadosRoutes from "./src/routes/listadosRoutes.js";
import actualizar from "./src/routes/actualizarEstadoRoutes.js";
import revisadoRoutes from "./src/routes/revisadoRoutes.js";
import verRoutes from "./src/routes/verRoutes.js";

// Definir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración de las sesiones
app.use(session({
  secret: 'tuSecretoSuperSeguro',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configurar EJS
app.set("view engine", "ejs");

// Rutas
app.use(authRoutes);
app.use(novedadRoutes);
app.use(excelRoutes);
app.use(listadosRoutes);
app.use(actualizar);
app.use(revisadoRoutes);
app.use(verRoutes);

// Iniciar servidor
app.listen(3005, () => {
  console.log("Servidor corriendo en puerto 3005");
});
