import { conexion } from "../model/Db.js";

const connection = conexion();

export const listado = (req, res) => {
    const { fecha, regional } = req.query;
    let query = "SELECT * FROM novedades WHERE Estado = 'Activo'";
    const queryParams = [];

    if (fecha) {
        query += " AND DATE(terminal) = ?";
        queryParams.push(fecha);
    }

    if (regional) {
        query += " AND regional = ?";
        queryParams.push(regional);
    }

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error("Error al recuperar datos de la base de datos:", error.stack);
            res.status(500).send("Error al recuperar los datos");
            return;
        }
        res.render("listado", { novedades: results, user: req.session.user });
    });
};