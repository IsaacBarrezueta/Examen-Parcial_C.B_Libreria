const cron = require('node-cron');
const pool = require('../db'); // Asegúrate de que apunte correctamente a tu configuración de la base de datos

// Tarea programada para liberar sanciones
cron.schedule('0 0 * * *', async () => { // Cambia a '*/1 * * * *' para producción (ejecutar por minuto)
  console.log('Ejecutando tarea para liberar sanciones...');
  try {
    const result = await pool.query(
      `UPDATE Estudiantes
       SET EstadoActual = 'Libre'
       WHERE SancionadoHasta <= CURRENT_DATE AND EstadoActual = 'Sancionado'`
    );
    console.log(`Estudiantes liberados: ${result.rowCount}`);
  } catch (err) {
    console.error('Error en la tarea programada:', err.message);
  }
});

module.exports = cron;
