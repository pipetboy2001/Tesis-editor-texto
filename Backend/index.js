const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Configuraciones centralizadas
const config = {
  textAlignment: "left",
  textColor: "black",
  textBackgroundColor: "white",
};

app.use(cors());
app.use(express.json());

// Middleware para manejar solicitudes no encontradas
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Alinear texto
app.post("/api/text/alignment", (req, res) => {
  const { alignment } = req.body;
  console.log("Texto justificado:", alignment);
  // Actualizar la configuración con la nueva alineación
  config.textAlignment = alignment;
  res.json({
    success: true,
    message: "Justificación del texto cambiada exitosamente",
    data: { alignment: config.textAlignment },
  });
});

app.get("/api/text/alignment", (req, res) => {
  // Devolver la alineación actual almacenada en la configuración
  res.json({ alignment: config.textAlignment });
});

// Texto en negrita
app.post("/api/text/bold", (req, res) => {
  const { bold } = req.body;
  // Lógica para cambiar el texto en negrita en el backend
  console.log("Texto en negrita:", bold);
  res.json({
    success: true,
    message: "Texto en negrita cambiado exitosamente",
  });
});

// Texto en cursiva
app.post("/api/text/italic", (req, res) => {
  const { italic } = req.body;
  console.log("Texto en cursiva:", italic);
  res.json({
    success: true,
    message: "Texto en cursiva cambiado exitosamente",
    italic: italic,
  });
});

// Texto subrayado
app.post("/api/text/underline", (req, res) => {
  const { underline } = req.body;
  console.log("Texto subrayado:", underline);
  res.json({
    success: true,
    message: "Texto subrayado cambiado exitosamente",
    underline: underline,
  });
});

app.post("/api/text/color", (req, res) => {
  const { textColor } = req.body;
  console.log("Texto con nuevo color:", textColor);
  res.json({
    success: true,
    message: "Color del texto cambiado exitosamente",
  });
});

app.post("/api/text/background-color", (req, res) => {
  const { backgroundColor } = req.body;
  console.log("Texto con nuevo color de fondo:", backgroundColor);
  res.json({
    success: true,
    message: "Color de fondo del texto cambiado exitosamente",
  });
});

// Tamaño de letra
app.post("/api/text/size", (req, res) => {
  const { size } = req.body;
  // Lógica para cambiar el tamaño de la letra en el backend
  console.log("Texto con nuevo tamaño:", size);
  res.json({
    success: true,
    message: "Tamaño de la letra cambiado exitosamente",
  });
});

app.get("/", (req, res) => {
  res.send("Hola desde el backend");
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
