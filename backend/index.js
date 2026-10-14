require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const clasesRoutes = require('./routes/clasesRoutes');
const usuariosRoutes = require('./routes/usuarios.routes');

app.use(express.json());
app.use('/clases', clasesRoutes);
app.use('/usuarios', usuariosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});