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


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleFontColorClick = () => {
    const color = prompt("Introduce el color de la fuente:", "#3c8dbc");
    setFontColor(color);
  };

  const handleBackColorClick = () => {
    const color = prompt("Introduce el color de fondo:", "orange");
    setBackColor(color);
  };

  const handleLink = () => {
    const url = prompt("Introduce la URL:");
    // Lógica para insertar enlace aquí (puedes usar alguna librería como `react-draft-wysiwyg` para funcionalidad avanzada)
  };

  const handleFontSizeChange = (e) => {
    const size = e.target.value + "pt";
    setFontSize(size);
  };

  const applyStyle = (style, value) => {
    document.execCommand("styleWithCSS", null, true);
    document.execCommand(style, false, value);
    document.execCommand("styleWithCSS", null, false);
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
      contenido += `<div>${TableComponent({ rows: tableDimensions.rows, columns: tableDimensions.columns })}</div>`;
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
            onClick={() => applyStyle("justifyLeft")}
          >
            <FaAlignLeft />
          </button>
          <button
            className="btnColor"
            onClick={() => applyStyle("justifyCenter")}
          >
            <FaAlignCenter />
          </button>
          <button
            className="btnColor"
            onClick={() => applyStyle("justifyRight")}
          >
            <FaAlignRight />
          </button>
          <button className="btnColor" onClick={() => applyStyle("bold")}>
            <FaBold />
          </button>
          <button className="btnColor" onClick={() => applyStyle("italic")}>
            <FaItalic />
          </button>
          <button className="btnColor" onClick={() => applyStyle("underline")}>
            <FaUnderline />
          </button>
          <button className="btnColor" onClick={handleLink}>
            <ImLink />
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
          style={{ fontSize, display: showContentInConsole ? "none" : "block" }}
          dangerouslySetInnerHTML={{ __html: generarContenido() }}
          onKeyDown={handleEnter}
          onInput={(e) => handleContentChange(e, paragraphs.length - 1)}
        ></div>
      </div>
    </div>
  );
}

export default App;
