import React, { useState } from "react";
import {FaAlignLeft,FaAlignCenter,FaAlignRight,FaBold,FaItalic,FaUnderline} from "react-icons/fa";

function App() {
  const [fontColor, setFontColor] = useState("#3c8dbc");
  const [backColor, setBackColor] = useState("orange");
  const [fontSize, setFontSize] = useState("12px");
  const [paragraphs, setParagraphs] = useState([{ id: 0, content: "" }]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [alignment, setAlignment] = useState("left");

  // Funcion para aplicar estilos al texto
  const applyBackendStyle = async (endpoint, data) => {
    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error al aplicar el estilo: ${response.statusText}`);
      }
      const result = await response.json();
      console.log(result.message);
      console.log(result);
    } catch (error) {
      console.error("Error al aplicar el estilo:", error.message);
    }
  };

  // Funcion para aplicar estilos al texto
  const applyStyleToContentEditable = (style, value) => {
    document.execCommand("styleWithCSS", null, true);
    document.execCommand(style, false, value);
    document.execCommand("styleWithCSS", null, false);
  };

  // Funcion para alinear el texto
  const applyTextAlignment = async (newAlignment) => {
    try {
      await applyBackendStyle("changeTextAlignment", {
        alignment: newAlignment,
      });
      setAlignment(newAlignment);
    } catch (error) {
      console.error("Error al cambiar la alineación:", error.message);
    }
  };
  // Funcion para aplicar negrita
  const applyBoldStyle = () => {
    applyBackendStyle("changeTextBold", { bold: !isBold });
    applyStyleToContentEditable("bold");
    setIsBold(!isBold);
  };
  // Funcion para aplicar cursiva
  const applyItalicStyle = () => {
    applyBackendStyle("changeTextItalic", { italic: !isItalic });
    applyStyleToContentEditable("italic");
    setIsItalic(!isItalic);
  };
  // Funcion para aplicar subrayado
  const applyUnderlineStyle = () => {
    applyBackendStyle("changeTextUnderline", { underline: !isUnderlined });
    applyStyleToContentEditable("underline");
    setIsUnderlined(!isUnderlined);
  };
  // Funcion para cambiar el color de fuente
  const handleFontColorClick = () => {
    const color = prompt("Introduce el color de fuente:", "#3c8dbc");
    setFontColor(color);
    applyBackendStyle("changeTextColor", { color: color });
  };
  // Funcion para cambiar el color de fondo
  const handleBackColorClick = () => {
    const color = prompt("Introduce el color de fondo:", "orange");
    setBackColor(color);
    applyBackendStyle("changeTextBackgroundColor", { backgroundColor: color });
  };
  // Funcion para cambiar el tamaño de fuente
  // Funcion para cambiar el tamaño de fuente
  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value) + "pt";
    setFontSize(newSize);
    applyBackendStyle("changeTextSize", { size: newSize });

    // Aplicar el cambio de tamaño directamente al contenido editable
    const editor = document.getElementById("editor");
    if (editor) {
      editor.style.fontSize = newSize;
    }
  };



  return (
    <div className="App">
      <div id="parentEditor">
        <div id="painelEditor">
          <button
            className="btnColor"
            onClick={() => applyTextAlignment("left")}
          >
            <FaAlignLeft />
          </button>
          <button
            className="btnColor"
            onClick={() => applyTextAlignment("center")}
          >
            <FaAlignCenter />
          </button>
          <button
            className="btnColor"
            onClick={() => applyTextAlignment("right")}
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

          <button
            className="btnColor"
            onClick={handleFontColorClick}
            style={{ color: fontColor }}
          >
            <span>F</span>
          </button>
          <button
            className="btnColor"
            onClick={handleBackColorClick}
            style={{ backgroundColor: backColor }}
          >
            <span>B</span>
          </button>
          <button
            className="jscolor"
            style={{
              width: "15px",
              height: "15px",
              border: "none",
              outline: "none",
            }}
          ></button>
          <select id="inputFontSize" onChange={handleFontSizeChange}>
            <option value="10">10 pt</option>
            <option value="12">12 pt</option>
            <option value="14">14 pt</option>
            <option value="16">16 pt</option>
            <option value="18">18 pt</option>
          </select>
        </div>

        <div
          id="editor"
          contentEditable={true}
          style={{ textAlign: alignment }}
        ></div>
      </div>
    </div>
  );
}

export default App;
