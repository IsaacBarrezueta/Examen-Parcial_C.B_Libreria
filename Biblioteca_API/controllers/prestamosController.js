const pool = require('../db');


// Obtener todos los prestamos
exports.getPrestamos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        PrestamoID as id, 
        CedulaEstudiante as cedula_estudiante, 
        CodigoLibro as codigo_libro, 
        FechaPrestamo as fecha_prestamo, 
        FechaEntrega as fecha_entrega, 
        Devuelto as devuelto, 
        FechaDevolucion as fecha_devolucion
      FROM Prestamos
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al obtener los préstamos');
  }
};


// Registrar un préstamo
exports.addPrestamo = async (req, res) => {
  const { cedulaEstudiante, codigoLibro, fechaPrestamo, fechaEntrega } = req.body;

  try {
    // Verificar si el estudiante está sancionado
    const estudiante = await pool.query(
      'SELECT SancionadoHasta FROM Estudiantes WHERE Cedula = $1',
      [cedulaEstudiante]
    );

    if (estudiante.rows.length === 0) {
      return res.status(404).send('Estudiante no encontrado');
    }

    const sancionadoHasta = estudiante.rows[0].sancionadohasta;
    if (sancionadoHasta && new Date(sancionadoHasta) > new Date()) {
      return res.status(403).send(`El estudiante está sancionado hasta ${sancionadoHasta}`);
    }

    // Verificar si el libro está disponible
    const libro = await pool.query(
      'SELECT Disponible FROM LibrosRevistas WHERE Codigo = $1',
      [codigoLibro]
    );

    if (libro.rows.length === 0) {
      return res.status(404).send('Libro no encontrado');
    }

    if (!libro.rows[0].disponible) {
      return res.status(400).send('El libro no está disponible');
    }

    // Registrar el préstamo
    await pool.query(
      `INSERT INTO Prestamos (CedulaEstudiante, CodigoLibro, FechaPrestamo, FechaEntrega)
      VALUES ($1, $2, $3, $4)`,
      [cedulaEstudiante, codigoLibro, fechaPrestamo, fechaEntrega]
    );

    // Marcar el libro como no disponible
    await pool.query(
      'UPDATE LibrosRevistas SET Disponible = FALSE WHERE Codigo = $1',
      [codigoLibro]
    );

    res.status(201).send('Préstamo registrado correctamente');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al registrar el préstamo');
  }
};

// Registrar la devolución de un libro
exports.registrarDevolucion = async (req, res) => {
  const { prestamoId, fechaDevolucion } = req.body;

  try {
    // Obtener datos del préstamo
    const prestamo = await pool.query(
      'SELECT CodigoLibro, FechaEntrega, Devuelto FROM Prestamos WHERE PrestamoID = $1',
      [prestamoId]
    );

    if (prestamo.rows.length === 0) {
      return res.status(404).send(`Préstamo con ID ${prestamoId} no encontrado`);
    }

    if (prestamo.rows[0].devuelto) {
      return res.status(400).send(`El préstamo con ID ${prestamoId} ya fue devuelto`);
    }

    const { codigolibro, fechaentrega } = prestamo.rows[0];

    // Actualizar el estado del préstamo
    await pool.query(
      `UPDATE Prestamos
      SET Devuelto = TRUE, FechaDevolucion = $1
      WHERE PrestamoID = $2`,
      [fechaDevolucion, prestamoId]
    );

    // Marcar el libro como disponible
    await pool.query(
      'UPDATE LibrosRevistas SET Disponible = TRUE WHERE Codigo = $1',
      [codigolibro]
    );

    // Verificar si la devolución es tardía
    if (new Date(fechaDevolucion) > new Date(fechaentrega)) {
      const sancionHasta = new Date(fechaDevolucion); // Fecha de sanción = fecha de devolución
      sancionHasta.setDate(sancionHasta.getDate() + 15); // Agregar 15 días

      // Aplicar sanción al estudiante
      await pool.query(
        `UPDATE Estudiantes
        SET SancionadoHasta = $1, EstadoActual = 'Sancionado'
        WHERE Cedula = (SELECT CedulaEstudiante FROM Prestamos WHERE PrestamoID = $2)`,
        [sancionHasta, prestamoId]
      );
    } 

    // Si no hay sanción, el estado del estudiante permanece como está
    res.status(200).send('Devolución registrada correctamente');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al registrar la devolución');
  }
};