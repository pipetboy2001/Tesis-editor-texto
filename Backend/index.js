const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
let textAlignment = 'left'; // Variable global para almacenar la alineación del texto
let textColor = 'black'; // Variable global para almacenar el color del texto
let textBackgroundColor = 'white'; // Variable global para almacenar el color de fondo del texto
app.use(cors());
app.use(express.json());

// Alinear texto
app.post('/api/changeTextAlignment', (req, res) => {
  const { alignment } = req.body;
  console.log('Texto justificado:', alignment);
  // Actualizar la variable global con la nueva alineación
  textAlignment = alignment;
  res.json({ success: true, message: 'Justificación del texto cambiada exitosamente' });
});
app.get('/api/getTextAlignment', (req, res) => {
  // Devolver la alineación actual almacenada en la variable global
  res.json({ alignment: textAlignment });
});

// Texto en negrita
app.post('/api/changeTextBold', (req, res) => {
  const { bold } = req.body;
  console.log('Texto en negrita:', bold);
  res.json({ success: true, message: 'Texto en negrita cambiado exitosamente', bold: bold });
});

// Texto en cursiva
app.post('/api/changeTextItalic', (req, res) => {
  const { italic } = req.body;
  console.log('Texto en cursiva:', italic);
  res.json({ success: true, message: 'Texto en cursiva cambiado exitosamente', italic: italic });
});

// texto en subrayado
app.post('/api/changeTextUnderline', (req, res) => {
  const { underline } = req.body;
  console.log('Texto subrayado:', underline);
  res.json({ success: true, message: 'Texto subrayado cambiado exitosamente', underline: underline });
});



app.post('/api/changeTextColor', (req, res) => {
  const { textColor } = req.body;
  console.log('Texto con nuevo color:', textColor);
  res.json({ success: true, message: 'Color del texto cambiado exitosamente' });
});

app.post('/api/changeTextBackgroundColor', (req, res) => {
  const { backgroundColor } = req.body;
  console.log('Texto con nuevo color de fondo:', backgroundColor);
  res.json({ success: true, message: 'Color de fondo del texto cambiado exitosamente' });
});

// Rutas de tamaño de letra
app.route('/api/changeTextSize')
  .get((req, res) => {
    // Manejar la lógica para solicitudes GET (si es necesario)
    res.status(404).send('Not Found');
  })
  .post((req, res) => {
    const { size } = req.body;
    // Lógica para cambiar el tamaño de la letra en el backend
    console.log('Texto con nuevo tamaño:', size);
    res.json({ success: true, message: 'Tamaño de la letra cambiado exitosamente' });
  });


app.get('/', (req, res) => {
  res.send('Hola desde el backend');
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
