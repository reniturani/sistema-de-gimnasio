require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const clasesRoutes = require('./routes/clasesRoutes');
const usuariosRoutes = require('./routes/usuarios.routes');
const inscripcionesRoutes = require('./routes/inscripciones.routes');
const authRoutes = require('./routes/auth.routes');

app.use(express.json());

app.use('/clases', clasesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/inscripciones', inscripcionesRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});