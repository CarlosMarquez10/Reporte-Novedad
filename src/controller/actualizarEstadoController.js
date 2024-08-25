import { conexion } from "../model/Db.js";

const connection = conexion()

export const actualizar = (req, res) => {
  const { id } = req.params;
  const query = "UPDATE novedades SET Estado = 'Revisado' WHERE id = ?";

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error al actualizar el estado del registro:", error.stack);
      res.status(500).send("Error al actualizar el estado del registro");
      return;
    }
    res.redirect("/listado"); // Redirige a la vista de listado después de actualizar
  });
};
