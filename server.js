const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mysql = require("mysql");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Configurar EJS
app.set("view engine", "ejs");

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

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuración de la base de datos MySQL
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

// Mostrar el formulario
app.get("/", (req, res) => {
  res.render("formulario");
});

// Subir foto y procesar formulario
app.post("/submit", upload.single("foto"), (req, res) => {
  const { nombre, terminal, regional, observacion } = req.body;
  const fotoPath = req.file.path.replace(/\\/g, "/"); // Reemplazar backslashes en la ruta para asegurar compatibilidad

  // Guardar datos en MySQL
  const query =
    "INSERT INTO novedades (nombre, terminal, regional, observacion, fotoPath) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    query,
    [nombre, terminal, regional, observacion, fotoPath],
    (error, results) => {
      if (error) {
        console.error("Error al guardar en la base de datos:", error.stack);
        return res.render("error"); // Renderizar la vista de error
      }
      res.render("success"); // Renderizar la vista de éxito
    }
  );
});

app.get("/listado", (req, res) => {
  const query = "SELECT * FROM novedades";
  connection.query(query, (error, results) => {
    if (error) {
      console.error(
        "Error al recuperar datos de la base de datos:",
        error.stack
      );
      res.status(500).send("Error al recuperar los datos");
      return;
    }
    res.render("listado", { novedades: results });
  });
});

app.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM novedades WHERE id = ?";

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error al eliminar el registro:", error.stack);
      res.status(500).send("Error al eliminar el registro");
      return;
    }
    res.redirect("/listado"); // Redirige a la vista de listado después de borrar
  });
});

app.get("/informacion", (req, res) => {
  res.render("informacion");
});

app.get("/ver/:id", (req, res) => {
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
      res.render("ver", { novedad: results[0] });
    } else {
      res.status(404).send("Novedad no encontrada");
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)
  // Aquí puedes agregar la lógica de autenticación.
  if (username === "CGO" && password === "*Inmel.2024") {
    res.redirect("/listado"); // Redirige al listado si la autenticación es exitosa
  } else {
    res.redirect("/login"); // Redirige de vuelta al login en caso de fallo
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
