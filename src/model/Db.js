import mysql from "mysql";

// Configuración de la base de datos MySQL
export const conexion = () => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "NovedadesRepo",
    password: "Novedades.2024",
    database: "db_reportenovedad",
  });

  connection.connect((err) => {
    if (err) {
      console.error("Error conectando a la base de datos:", err.stack);
      return;
    }
    console.log("Conectado a la base de datos como id " + connection.threadId);
  });

  return connection;
};
