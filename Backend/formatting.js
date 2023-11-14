// routes/formatting.js

const express = require('express');
const router = express.Router();

// Cambiar la justificación del texto
router.post('/api/changeTextAlignment', (req, res) => {
  const { alignment } = req.body;

  // Lógica para cambiar la justificación del texto en el backend
  console.log('Texto justificado:', alignment);

  res.json({ success: true, message: 'Justificación del texto cambiada exitosamente' });
});

// Cambiar el color del texto
router.post('/api/changeTextColor', (req, res) => {
  const { textColor } = req.body;

  // Lógica para cambiar el color del texto en el backend
  console.log('Texto con nuevo color:', textColor);

  res.json({ success: true, message: 'Color del texto cambiado exitosamente' });
});

// Cambiar el color de fondo del texto
router.post('/api/changeTextBackgroundColor', (req, res) => {
  const { backgroundColor } = req.body;

  // Lógica para cambiar el color de fondo del texto en el backend
  console.log('Texto con nuevo color de fondo:', backgroundColor);

  res.json({ success: true, message: 'Color de fondo del texto cambiado exitosamente' });
});

// Cambiar a negrita la letra
router.post('/api/changeTextBold', (req, res) => {
  const { bold } = req.body;

  // Lógica para cambiar a negrita la letra en el backend
  console.log('Texto en negrita:', bold);

  res.json({ success: true, message: 'Texto en negrita cambiado exitosamente' });
});

// Cambiar a cursiva la letra
router.post('/api/changeTextItalic', (req, res) => {
  const { italic } = req.body;

  // Lógica para cambiar a cursiva la letra en el backend
  console.log('Texto en cursiva:', italic);

  res.json({ success: true, message: 'Texto en cursiva cambiado exitosamente' });
});

// Cambiar a subrayado la letra
router.post('/api/changeTextUnderline', (req, res) => {
  const { underline } = req.body;

  // Lógica para cambiar a subrayado la letra en el backend
  console.log('Texto subrayado:', underline);

  res.json({ success: true, message: 'Texto subrayado cambiado exitosamente' });
});

// Cambiar el tamaño de la letra
router.post('/api/changeTextSize', (req, res) => {
  const { size } = req.body;

  // Lógica para cambiar el tamaño de la letra en el backend
  console.log('Texto con nuevo tamaño:', size);

  res.json({ success: true, message: 'Tamaño de la letra cambiado exitosamente' });
});

// Cambiar el tipo de letra
router.post('/api/changeTextFont', (req, res) => {
  const { font } = req.body;

  // Lógica para cambiar el tipo de letra en el backend
  console.log('Texto con nuevo tipo de letra:', font);

  res.json({ success: true, message: 'Tipo de letra cambiado exitosamente' });
});

// Cambiar el interlineado
router.post('/api/changeTextLineHeight', (req, res) => {
  const { lineHeight } = req.body;

  // Lógica para cambiar el interlineado en el backend
  console.log('Texto con nuevo interlineado:', lineHeight);

  res.json({ success: true, message: 'Interlineado cambiado exitosamente' });
});

// Cambiar el espaciado entre letras
router.post('/api/changeTextLetterSpacing', (req, res) => {
  const { letterSpacing } = req.body;

  // Lógica para cambiar el espaciado entre letras en el backend
  console.log('Texto con nuevo espaciado entre letras:', letterSpacing);

  res.json({ success: true, message: 'Espaciado entre letras cambiado exitosamente' });
});

module.exports = router;
