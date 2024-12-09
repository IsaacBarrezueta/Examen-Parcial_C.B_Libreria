const pool = require('../db');

// Obtener todos los libros y revistas
exports.getLibros = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM LibrosRevistas  Where estado = TRUE');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al obtener los libros y revistas');
  }
};

// Agregar un libro o revista
exports.addLibro = async (req, res) => {
  const { codigo, categoria, editorial, nombre, autor, anioPublicacion, tipo } = req.body;
  try {
    const query = `
      INSERT INTO LibrosRevistas (Codigo, Categoria, Editorial, Nombre, Autor, AnioPublicacion, Tipo)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(query, [codigo, categoria, editorial, nombre, autor, anioPublicacion, tipo]);
    res.status(201).send('Libro/Revista agregado correctamente');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al agregar el libro/revista');
  }
};

// Actualizar un libro
exports.updateLibro = async (req, res) => {
  const { codigo } = req.params; // Código del libro en la URL
  const { categoria, editorial, nombre, autor, anioPublicacion, tipo, disponible, estado } = req.body;

  try {
    const result = await pool.query(
      `UPDATE LibrosRevistas
       SET Categoria = $1, Editorial = $2, Nombre = $3, Autor = $4, AnioPublicacion = $5, Tipo = $6, Disponible = $7, Estado = $8
       WHERE Codigo = $9`,
      [categoria, editorial, nombre, autor, anioPublicacion, tipo, disponible, estado, codigo]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Libro no encontrado');
    }

    res.status(200).send('Libro actualizado correctamente');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al actualizar el libro');
  }
};



// Eliminar lógico de un libro
exports.softDeleteLibro = async (req, res) => {
  const { codigo } = req.params;

  try {
    const result = await pool.query(
      `UPDATE LibrosRevistas
       SET Estado = FALSE
       WHERE Codigo = $1`,
      [codigo]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Libro no encontrado');
    }

    res.status(200).send('Libro eliminado lógicamente');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al eliminar el libro');
  }
};
