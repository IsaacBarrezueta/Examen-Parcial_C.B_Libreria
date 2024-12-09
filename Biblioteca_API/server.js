const express = require('express');
const pool = require('./db');
const cors = require('cors');
const cron = require('./tasks/sanctionManager'); 

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para verificar que la API funciona
app.get('/', (req, res) => {
  res.send('API de Biblioteca funcionando');
});

// Rutas específicas
const routes = require('./routes/routes');
app.use('/api', routes);


// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});