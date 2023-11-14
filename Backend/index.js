// index.js (backend)

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const formattingRoutes = require('./routes/formatting');
app.use(cors());
app.use(express.json());

app.use('/formatting', formattingRoutes); // Rutas para formato

app.get('/', (req, res) => {
  res.send('Hola desde el backend');
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
