const express = require('express');
const { getLibros, addLibro, softDeleteLibro, updateLibro } = require('../controllers/librosController');
const { getEstudiantes, addEstudiante, softDeleteEstudiante, updateEstudiante } = require('../controllers/estudiantesController');
const { addPrestamo, registrarDevolucion, getPrestamos } = require('../controllers/prestamosController');

const router = express.Router();

// Libros
router.get('/libros', getLibros);
router.post('/libros', addLibro);
router.put('/libros/:codigo', updateLibro);
router.patch('/libros/:codigo', softDeleteLibro);


// Estudiantes
router.get('/estudiantes', getEstudiantes);
router.post('/estudiantes', addEstudiante);
router.put('/estudiantes/:cedula', updateEstudiante);
router.patch('/estudiantes/:cedula', softDeleteEstudiante);

router.get('/prestamos', getPrestamos);
router.post('/prestamos', addPrestamo);
router.post('/devoluciones', registrarDevolucion);


module.exports = router;