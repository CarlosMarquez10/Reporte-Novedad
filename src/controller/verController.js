import { conexion } from "../model/Db.js";

const connection = conexion();

export const verdata = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM novedades WHERE id = ?";
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error(
        "Error al recuperar los datos de la base de datos:",
        error.stack
      );
      res.status(500).send("Error al recuperar los datos");
      return;
    }
    if (results.length > 0) {
      res.render("ver", { novedad: results[0], user: req.session.user });
    } else {
      res.status(404).send("Novedad no encontrada");
    }
  });
};
