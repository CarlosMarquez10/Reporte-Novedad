import path from "path";
import { v4 as uuidv4 } from "uuid";
import { conexion } from "../model/Db.js"; // Importar la conexión a la base de datos

const connection = conexion();

export const renderForm = (req, res) => {
  res.render('formulario', { user: req.session.user });
};

export const submitForm = (req, res) => {
  const { nombre, terminal, regional, observacion } = req.body;
  const fotoPath = req.file.path.replace(/\\/g, "/");
  const Estado = "Activo";
  
  const query = "INSERT INTO novedades (nombre, terminal, regional, observacion, fotoPath, Estado) VALUES (?, ?, ?, ?, ?, ?)";

  connection.query(query, [nombre, terminal, regional, observacion, fotoPath, Estado], (error, results) => {
    if (error) {
      console.error("Error al guardar en la base de datos:", error.stack);
      return res.render("error");
    }
    res.render("success", { user: req.session.user });
  });
};

// Otras funciones para listado, actualización, eliminación...
