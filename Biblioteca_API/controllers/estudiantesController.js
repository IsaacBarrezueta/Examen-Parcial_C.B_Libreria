const pool = require('../db');

// Obtener todos los estudiantes
exports.getEstudiantes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Estudiantes Where estado = TRUE');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al obtener los estudiantes');
  }
};

// Agregar un estudiante
exports.addEstudiante = async (req, res) => {
  const { cedula, nombre, apellido, sexo, fechaNacimiento } = req.body;
  try {
    const query = `
      INSERT INTO Estudiantes (Cedula, Nombre, Apellido, Sexo, FechaNacimiento)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [cedula, nombre, apellido, sexo, fechaNacimiento]);
    res.status(201).send('Estudiante agregado correctamente');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al agregar el estudiante');
  }
};

// Actualizar un estudiante
exports.updateEstudiante = async (req, res) => {
  const { cedula } = req.params; // Obtener el parámetro
  const { nombre, apellido, sexo, fechaNacimiento, estado } = req.body; // Datos del cuerpo de la solicitud

  try {
    const result = await pool.query(
      `UPDATE Estudiantes
       SET Nombre = $1, Apellido = $2, Sexo = $3, FechaNacimiento = $4, Estado = $5
       WHERE Cedula = $6`,
      [nombre, apellido, sexo, fechaNacimiento, estado, cedula]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Estudiante no encontrado');
    }

    res.status(200).send('Estudiante actualizado correctamente');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al actualizar el estudiante');
  }
};


// Eliminar lógico de un estudiante
exports.softDeleteEstudiante = async (req, res) => {
  const { cedula } = req.params;

  try {
    const result = await pool.query(
      `UPDATE Estudiantes
       SET Estado = FALSE
       WHERE Cedula = $1`,
      [cedula]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Estudiante no encontrado');
    }

    res.status(200).send('Estudiante eliminado lógicamente');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al eliminar el estudiante');
  }
};
