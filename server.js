const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mysql = require("mysql");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const session = require('express-session');
const ExcelJS = require('exceljs');

const app = express();

// Configuración de las sesiones
app.use(session({
  secret: 'tuSecretoSuperSeguro', // Cambia esto por una clave secreta segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Asegúrate de que sea true si usas HTTPS
}));

// Función middleware para proteger las rutas
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next(); // El usuario está autenticado, puede continuar
  } else {
    res.redirect('/login'); // El usuario no está autenticado, redirige al login
  }
}

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

// Mostrar el formulario (accesible sin autenticación)
app.get("/", (req, res) => {
  res.render('formulario', { user: req.session.user });
});

// Subir foto y procesar formulario (accesible sin autenticación)
app.post("/submit", upload.single("foto"), (req, res) => {
  const { nombre, terminal, regional, observacion } = req.body;
  const fotoPath = req.file.path.replace(/\\/g, "/"); // Reemplazar backslashes en la ruta para asegurar compatibilidad
  const Estado = "Activo";
  
  // Guardar datos en MySQL
  const query =
    "INSERT INTO novedades (nombre, terminal, regional, observacion, fotoPath, Estado) VALUES (?, ?, ?, ?, ?, ?)";
  
  connection.query(
    query,
    [nombre, terminal, regional, observacion, fotoPath, Estado],
    (error, results) => {
      if (error) {
        console.error("Error al guardar en la base de datos:", error.stack);
        return res.render("error"); // Renderizar la vista de error
      }
      // Renderizar la vista de éxito y pasar la variable user
      res.render("success", { user: req.session.user });
    }
  );
});


// Listado (requiere autenticación)
app.get('/listado', isAuthenticated, (req, res) => {
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
});


// Actualizar estado a "Revisado" (requiere autenticación)
app.post("/revisado/:id", isAuthenticated, (req, res) => {
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
});

// Eliminar registro (requiere autenticación)
app.post("/delete/:id", isAuthenticated, (req, res) => {
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

// Información (requiere autenticación)
app.get('/informacion', isAuthenticated, (req, res) => {
  const { fecha, regional } = req.query;
  let query = "SELECT * FROM novedades WHERE Estado = 'Revisado'";
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
    res.render("informacion", { novedades: results, user: req.session.user });
  });
});


// Ver una novedad específica (requiere autenticación)
app.get("/ver/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM novedades WHERE id = ?";
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error al recuperar los datos de la base de datos:", error.stack);
      res.status(500).send("Error al recuperar los datos");
      return;
    }
    if (results.length > 0) {
      res.render("ver", { novedad: results[0], user: req.session.user });
    } else {
      res.status(404).send("Novedad no encontrada");
    }
  });
});


// Página de login
app.get("/login", (req, res) => {
  res.render("login", { user: req.session.user });
});

// Procesar login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Aquí puedes agregar la lógica de autenticación.
  if (username === "CGO" && password === "*Inmel.2024") {
    req.session.user = username; // Establece la sesión del usuario
    res.redirect('/listado'); // Redirige al listado si la autenticación es exitosa
  } else {
    res.redirect('/login'); // Redirige de vuelta al login en caso de fallo
  }
});

// Cerrar sesión
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/login'); // Redirige al login después de cerrar sesión
  });
});

// Ruta para descargar el archivo Excel (requiere autenticación)
app.get('/descargarExcel', isAuthenticated, async (req, res) => {
  const query = "SELECT * FROM novedades";
  
  connection.query(query, async (error, results) => {
    if (error) {
      console.error("Error al recuperar datos de la base de datos:", error.stack);
      res.status(500).send("Error al recuperar los datos");
      return;
    }

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Novedades');

    // Agregar encabezados
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Terminal', key: 'terminal', width: 15 },
      { header: 'Regional', key: 'regional', width: 20 },
      { header: 'Observacion', key: 'observacion', width: 50 },
      { header: 'Foto Path', key: 'fotoPath', width: 30 },
      { header: 'Estado', key: 'Estado', width: 15 },
    ];

    // Agregar datos de la tabla a la hoja de Excel
    results.forEach((novedad) => {
      worksheet.addRow({
        id: novedad.id,
        nombre: novedad.nombre,
        terminal: novedad.terminal,
        regional: novedad.regional,
        observacion: novedad.observacion,
        fotoPath: novedad.fotoPath,
        Estado: novedad.Estado,
      });
    });

    // Configurar la respuesta para descargar el archivo Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=novedades.xlsx');

    // Enviar el archivo Excel al cliente
    await workbook.xlsx.write(res);
    res.end();
  });
});

// Iniciar servidor
app.listen(3005, () => {
  console.log("Servidor corriendo en puerto 3005");
});
