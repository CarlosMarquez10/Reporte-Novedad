const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');
const { Storage } = require('@google-cloud/storage');

const app = express();

// Configurar EJS
app.set('view engine', 'ejs');

// Configurar almacenamiento de multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mi_base_de_datos'
});

// Mostrar el formulario
app.get('/', (req, res) => {
  res.render('formulario');
});

// Subir foto y procesar formulario
app.post('/submit', upload.single('foto'), async (req, res) => {
  const { nombre, terminal, regional, observacion } = req.body;
  const foto = req.file;

  // Subir la foto a Google Cloud Storage
  const fotoUrl = await subirFotoAGoogleCloud(foto);

  // Guardar datos en MySQL
  const query = 'INSERT INTO datos (nombre, terminal, regional, observacion, fotoUrl) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [nombre, terminal, regional, observacion, fotoUrl], (error, results) => {
    if (error) throw error;
    res.send('Datos guardados');
  });
});

// Función para subir la foto a Google Cloud Storage
const subirFotoAGoogleCloud = async (file) => {
  const storage = new Storage({ keyFilename: 'ruta/a/tu/clave.json' });
  const bucket = storage.bucket('nombre-de-tu-bucket');
  const blob = bucket.file(file.originalname);

  const stream = blob.createWriteStream({
    resumable: false,
  });

  stream.end(file.buffer);

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
};

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
