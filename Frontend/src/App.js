import React, { useState } from "react";
import {
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaUnderline,
} from "react-icons/fa";
import { ImLink } from "react-icons/im";
import "./App.css";

function TableComponent({ rows, columns }) {
  // Lógica para generar la tabla según las filas y columnas
  return <table>{/* Generar contenido de la tabla aquí */}</table>;
}

function ImageComponent({ file }) {
  return <img src={URL.createObjectURL(file)} alt="Uploaded" />;
}

function App() {
  const [tableDimensions, setTableDimensions] = useState({
    rows: 0,
    columns: 0,
  });
  const [fontColor, setFontColor] = useState("#3c8dbc");
  const [backColor, setBackColor] = useState("orange");
  const [fontSize, setFontSize] = useState("12px");
  const [file, setFile] = useState(null);
  const [paragraphs, setParagraphs] = useState([{ id: 0, content: "" }]);
  const [showContentInConsole, setShowContentInConsole] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [alignment, setAlignment] = useState("left");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

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

  const handleFontColorClick = () => {
    const color = prompt("Introduce el color de la fuente:", "#3c8dbc");
    setFontColor(color);
    applyBackendStyle("changeTextColor", { textColor: color });
  };

  const handleBackColorClick = () => {
    const color = prompt("Introduce el color de fondo:", "orange");
    setBackColor(color);
    applyBackendStyle("changeTextBackgroundColor", { backgroundColor: color });
  };
  const handleFontSizeChange = (e) => {
    const newSize = e.target.value + "pt";
    setFontSize(newSize);
    applyBackendStyle("changeTextSize", { size: newSize });
  };

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

  const applyStyleToContentEditable = (style, value) => {
    document.execCommand("styleWithCSS", null, true);
    document.execCommand(style, false, value);
    document.execCommand("styleWithCSS", null, false);
  };

  const applyBoldStyle = () => {
    applyBackendStyle("changeTextBold", { bold: !isBold });
    applyStyleToContentEditable("bold");
    setIsBold(!isBold);
  };

  const applyItalicStyle = () => {
    applyBackendStyle("changeTextItalic", { italic: !isItalic });
    applyStyleToContentEditable("italic");
    setIsItalic(!isItalic);
  };

  const applyUnderlineStyle = () => {
    applyBackendStyle("changeTextUnderline", { underline: !isUnderlined });
    applyStyleToContentEditable("underline");
    setIsUnderlined(!isUnderlined);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      const currentParagraph = paragraphs[paragraphs.length - 1];
      const currentLine = currentParagraph.content.split("\n").pop().trim();

      if (currentLine !== "") {
        const newParagraphId = paragraphs.length;
        const newParagraph = {
          id: newParagraphId,
          content: "",
        };
        setParagraphs((prevParagraphs) => [...prevParagraphs, newParagraph]);
      }
    }
  };

  const handleContentChange = (e, paragraphId) => {
    const updatedParagraphs = paragraphs.map((paragraph) =>
      paragraph.id === paragraphId
        ? { ...paragraph, content: e.target.textContent }
        : paragraph
    );

    // Obtener el contenido después del último "Enter"
    const contentAfterLastEnter = updatedParagraphs
      .map((paragraph) => paragraph.content)
      .join("\n")
      .split("\n")
      .pop()
      .trim();

    // Verificar si el contenido después del último "Enter" está vacío
    if (contentAfterLastEnter === "") {
      // Si está vacío, agregar un nuevo párrafo
      const newParagraphId = updatedParagraphs.length;
      const newParagraph = {
        id: newParagraphId,
        content: "",
      };
      setParagraphs((prevParagraphs) => [...prevParagraphs, newParagraph]);
    } else {
      // Si no está vacío, simplemente actualizar el estado
      setParagraphs(updatedParagraphs);
    }

    // Agregar console.log para mostrar ID y contenido
    updatedParagraphs.forEach((paragraph) => {
      console.log(`ID ${paragraph.id}: ${paragraph.content}`);
    });
  };

  const generarContenido = () => {
    let contenido = "";

    if (tableDimensions.rows > 0 && tableDimensions.columns > 0) {
      contenido += `<div>${TableComponent({
        rows: tableDimensions.rows,
        columns: tableDimensions.columns,
      })}</div>`;
    }

    if (file) {
      contenido += `<div>${ImageComponent({ file })}</div>`;
    }

    return contenido;
  };

  return (
    <div className="App">
      <input type="file" id="upload" onChange={handleFileChange} hidden />

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
          onKeyDown={handleEnter}
          onInput={(e) => handleContentChange(e, paragraphs.length - 1)}
        ></div>
      </div>
    </div>
  );
}

export default App;
