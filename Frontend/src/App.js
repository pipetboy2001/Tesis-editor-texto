import React, { useEffect, useState } from "react";
import {
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaUnderline,
} from "react-icons/fa";
import { ChromePicker } from "react-color"; // Importa el componente de paleta de colores
import "./Styles/Text.css";

function App() {
  const [texts, setTexts] = useState([]);
  const [fontColor, setFontColor] = useState("#3c8dbc");
  const [backColor, setBackColor] = useState("orange");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [showFontColorPicker, setShowFontColorPicker] = useState(false);
  const [showBackColorPicker, setShowBackColorPicker] = useState(false);
  const [currentParagraphNumber, setCurrentParagraphNumber] = useState(1);
    /* eslint-disable no-unused-vars */
  const [text, setText] = useState({
    contenido: "",
    alineacion: "",
    bold: false,
    italic: false,
    underline: false,
    
  });

  const [fontSize, setFontSize] = useState("16px");
  const [paragraphs, setParagraphs] = useState([
    { id: 0, content: "", text: "" },
  ]);

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

  // Función para abrir/cerrar el selector de color de fuente
  const handleFontColorPickerToggle = () => {
    setShowFontColorPicker(!showFontColorPicker);
  };

  // Función para abrir/cerrar el selector de color de fondo
  const handleBackColorPickerToggle = () => {
    setShowBackColorPicker(!showBackColorPicker);
  };

  // Función para aplicar el color de fuente seleccionado
  const handleFontColorChange = (color) => {
    const newFontColor = color.hex;
    setFontColor(newFontColor);
    document.execCommand("foreColor", false, newFontColor);
    applyBackendStyle("changeTextColor", { textColor: newFontColor });
  };

  // Función para aplicar el color de fondo seleccionado
  const handleBackColorChange = (color) => {
    const newBackColor = color.hex;
    setBackColor(newBackColor);
    document.execCommand("hiliteColor", false, newBackColor);
    setBackColor(newBackColor);
  };

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

  // Función para mostrar marcas de formato en la consola
  // Función para mostrar marcas de formato en la consola
  // Función para mostrar marcas de formato en la consola
  // Función para mostrar marcas de formato en la consola
  const showFormatMarks = () => {
    const editor = document.getElementById("editor");
    if (editor) {
      const cards = editor.getElementsByClassName("card");
      let metadata = [];

      Array.from(cards).forEach((card, index) => {
        const textEditor = card.querySelector("#textEditor");
        const paragraphs = Array.from(textEditor.childNodes).map((node) => {
          if (node.nodeType === 3) {
            // Si es un nodo de texto, devolver el contenido
            return node.textContent.trim();
          } else if (node.nodeType === 1 && node.nodeName === "DIV") {
            // Si es un div, devolver el contenido del div
            return node.innerHTML.trim();
          }
          return ""; // Otros nodos se ignoran
        });

        // Filtrar párrafos no vacíos
        const filteredParagraphs = paragraphs.filter(
          (paragraph) => paragraph !== ""
        );

        // Construir un objeto para cada párrafo
        filteredParagraphs.forEach((paragraph, paragraphIndex) => {
          const currentParagraphObj = {
            id: index * filteredParagraphs.length + paragraphIndex,
            content: paragraph,
            text: "",
            number: index * filteredParagraphs.length + paragraphIndex + 1,
          };

          // Agregar el objeto al array
          metadata.push(currentParagraphObj);
        });
      });

      // Actualizar el estado de los párrafos en React
      setTexts(metadata);

      // Mostrar el array de objetos con números de párrafo
      console.log(metadata);
    }
  };

  // Agrega esta función para manejar el botón de mostrar marcas de formato
  const handleShowFormatMarks = () => {
    showFormatMarks();
    // Enfoca el editor para que el usuario pueda seguir escribiendo
    const editor = document.getElementById("editor");
    if (editor) {
      editor.focus();
    }
  };

  // Función para obtener el texto de un elemento
  const getInnerText = (element) => {
    if (element.nodeType === 3) {
      return element.textContent;
    } else if (element.nodeType === 1) {
      let text = "";
      for (let child of element.childNodes) {
        text += getInnerText(child);
      }
      return text;
    }
    return "";
  };

  // Función para guardar los párrafos en un archivo JSON
  const guardarParrafos = () => {
    showFormatMarks();
    const editor = document.getElementById("editor");
    if (editor) {
      const content = editor.innerHTML;
      const tempElement = document.createElement("div");
      tempElement.innerHTML = content;

      const elements = tempElement.childNodes;

      let metadata = [];
      let currentParagraph = "";

      elements.forEach((element, index) => {
        const text = getInnerText(element);
        if (text) {
          if (currentParagraph !== "") {
            metadata.push({
              id: index - 1,
              content: currentParagraph.replace(/\u00a0/g, "").trim(),
              text: "",
              number: currentParagraphNumber,
            });
            setCurrentParagraphNumber(currentParagraphNumber + 1);
          }
          currentParagraph = text.replace(/\u00a0/g, "").trim();
        }
      });

      if (currentParagraph !== "") {
        metadata.push({
          id: elements.length - 1,
          content: currentParagraph,
          text: "",
          number: currentParagraphNumber,
        });
      }

      // Restablecer el número actual del párrafo
      setCurrentParagraphNumber(1);

      // Convertir el array de objetos a formato JSON
      const jsonString = JSON.stringify(metadata, null, 2);
      console.log(jsonString);

      // Guardar el JSON como un archivo
      descargarJSON(jsonString, "parrafos.json");
    }
  };

  // Función para descargar un archivo JSON
  const descargarJSON = (data, filename) => {
    const blob = new Blob([data], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSaveClick = async (textId) => {
    try {
      // Obtener el texto específico
      const textToUpdate = texts.find((text) => text._id === textId);
      showFormatMarks();
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
          throw new Error(
            `Error al enviar la actualización: ${response.statusText}`
          );
        }

        console.log("Actualización enviada con éxito.");
        // Exportar a JSON
        guardarParrafos();
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
              style={{
                textDecoration: isUnderlined ? "underline" : "none",
              }}
            >
              <FaUnderline />
            </button>
            <button
              className="btnColor"
              onClick={handleFontColorPickerToggle}
              style={{ color: fontColor }}
            >
              <span>F</span>
            </button>
            {showFontColorPicker && (
              <ChromePicker
                color={fontColor}
                onChange={handleFontColorChange}
              />
            )}
  
            <button
              className="btnColor"
              onClick={handleBackColorPickerToggle}
              style={{ backgroundColor: backColor }}
            >
              <span>B</span>
            </button>
            {showBackColorPicker && (
              <ChromePicker
                color={backColor}
                onChange={handleBackColorChange}
              />
            )}
  
            <button
              className="jscolor"
              style={{
                width: "15px",
                height: "15px",
                border: "none",
                outline: "none",
              }}
            ></button>
            <button onClick={handleShowFormatMarks}>¶</button>
            <button onClick={() => handleSaveClick(text._id)}>
              Guardar
            </button>
            <select id="inputFontSize" onChange={handleFontSizeChange}>
              <option value="10">12 pt</option>
              <option value="12">16 pt</option>
              <option value="14">18 pt</option>
              <option value="16">20 pt</option>
              <option value="18">24 pt</option>
            </select>
          </div>
  
          {/* Map sobre los textos */}
          {texts.map((text, index) => (
            <div key={index} className="card">
              {/* Contenido del texto */}
              <div
                id="textEditor"
                contentEditable={true}
                style={{
                  textAlign: text.alineacion || "left",
                  fontWeight: text.bold ? "bold" : "normal",
                  fontStyle: text.italic ? "italic" : "normal",
                  textDecoration: text.underline ? "underline" : "none",
                }}
              >
                {text.contenido}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
