import React, { useEffect, useState } from "react";
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaBold,
  FaItalic,
  FaUnderline, } from "react-icons/fa";

function App() {
  const [texts, setTexts] = useState([]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);

  // Funcion para aplicar estilos al texto
  const applyStyleToContentEditable = (style, value) => {
    document.execCommand("styleWithCSS", null, true);
    document.execCommand(style, false, value);
    document.execCommand("styleWithCSS", null, false);
  };

  // Función para alinear el texto
  const handleTextAlignment = async (newAlignment, textId) => {
    try {
      // Actualizar el estado local
      setTexts((prevTexts) =>
        prevTexts.map((text) =>
          text._id === textId ? { ...text, alineacion: newAlignment } : text
        )
      );
    } catch (error) {
      console.error("Error al cambiar la alineación:", error.message);
    }
  };

   // Funcion para aplicar negrita
   const applyBoldStyle = () => {
    applyStyleToContentEditable("bold");
    setIsBold(!isBold);
  };
  // Funcion para aplicar cursiva
  const applyItalicStyle = () => {
    applyStyleToContentEditable("italic");
    setIsItalic(!isItalic);
  };
  // Funcion para aplicar subrayado
  const applyUnderlineStyle = () => {
    setIsUnderlined(!isUnderlined);
  };

  const handleSaveClick = async (textId) => {
    try {
      // Obtener el texto específico
      const textToUpdate = texts.find((text) => text._id === textId);

      // Verificar si hay cambios en la alineación
      if (textToUpdate && textToUpdate.alineacion) {
        // Enviar la actualización al servidor
        const response = await fetch(
          `http://localhost:8000/text/update/${textId}`, // Ajusta la URL según tu API
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              alineacion: textToUpdate.alineacion,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error al enviar la actualización: ${response.statusText}`);
        }

        console.log("Actualización enviada con éxito.");
      }
    } catch (error) {
      console.error("Error al guardar la actualización:", error.message);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/text")
      .then((response) => response.json())
      .then((data) => {
        setTexts(data.texts);
      })
      .catch((error) => console.error("Error al obtener textos: ", error));
  }, []);

  return (
    <div className="App">
      <div id="parentEditor">
        <div id="editor">
          {texts.map((text) => (
            <div key={text._id} className="card">
              <div id="painelEditor">
                <button
                  className="btnColor"
                  onClick={() => handleTextAlignment("left", text._id)}
                >
                  <FaAlignLeft />
                </button>
                <button
                  className="btnColor"
                  onClick={() => handleTextAlignment("center", text._id)}
                >
                  <FaAlignCenter />
                </button>
                <button
                  className="btnColor"
                  onClick={() => handleTextAlignment("right", text._id)}
                >
                  <FaAlignRight />
                </button>
                <button
                  className="btnColor"
                  onClick={applyBoldStyle}
                  style={{ fontWeight: isBold ? "bold" : "normal" }}
                >
                  <FaBold />
                </button>

                <button
                  className="btnColor"
                  onClick={applyItalicStyle}
                  style={{ fontStyle: isItalic ? "italic" : "normal" }}
                >
                  <FaItalic />
                </button>
                <button
                  className="btnColor"
                  onClick={applyUnderlineStyle}
                  style={{ textDecoration: isUnderlined ? "underline" : "none" }}
                >
                  <FaUnderline />
                </button>

              </div>
              <div
                contentEditable={true}
                style={{ textAlign: text.alineacion || "left",
                fontWeight: text.bold ? "bold" : "normal",
                fontStyle: text.italic ? "italic" : "normal",
                textDecoration: text.underline ? "underline" : "none",}}
              >
                {text.contenido}
              </div>
              <button onClick={() => handleSaveClick(text._id)}>Guardar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;