import ExcelJS from 'exceljs';
import { conexion } from "../model/Db.js";

const connection = conexion();

export const descargarExcel = async (req, res) => {
  const query = "SELECT * FROM novedades";

  connection.query(query, async (error, results) => {
    if (error) {
      console.error("Error al recuperar datos de la base de datos:", error.stack);
      res.status(500).send("Error al recuperar los datos");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Novedades');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Terminal', key: 'terminal', width: 15 },
      { header: 'Regional', key: 'regional', width: 20 },
      { header: 'Observacion', key: 'observacion', width: 50 },
      { header: 'Foto Path', key: 'fotoPath', width: 30 },
      { header: 'Estado', key: 'Estado', width: 15 },
    ];

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

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=novedades.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  });
};
