import React, { useState } from "react";
import {FaAlignLeft,FaAlignCenter,FaAlignRight,FaBold,FaItalic,FaUnderline} from "react-icons/fa";
import { ChromePicker } from "react-color"; // Importa el componente de paleta de colores

function App() {
  const [fontColor, setFontColor] = useState("#3c8dbc");
  const [backColor, setBackColor] = useState("orange");
  const [fontSize, setFontSize] = useState("16px");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [alignment, setAlignment] = useState("left");

    const [paragraphs, setParagraphs] = useState([{ id: 0, content: "", text: "" }]);


  const [showFontColorPicker, setShowFontColorPicker] = useState(false);
  const [showBackColorPicker, setShowBackColorPicker] = useState(false);

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
const showFormatMarks = () => {
  const editor = document.getElementById("editor");
  if (editor) {
    const content = editor.innerHTML;

    // Utilizar un elemento temporario para parsear el contenido HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = content;

    // Obtener todos los elementos div y span dentro del editor
    const elements = tempElement.childNodes;

    let metadata = [];
    let currentParagraph = '';

    elements.forEach((element, index) => {
      const text = getInnerText(element);
      if (text) {
        if (currentParagraph !== '') {
          // Agregar el párrafo anterior
          metadata.push({
            id: index - 1,
            content: currentParagraph.replace(/\u00a0/g, '').trim(),
            text: '',
          });
        }
        // Iniciar nuevo párrafo
        currentParagraph = text.replace(/\u00a0/g, '').trim();
      }
    });

    // Agregar el último párrafo si hay uno
    if (currentParagraph !== '') {
      metadata.push({
        id: elements.length - 1,
        content: currentParagraph,
        text: '',
      });
    }

    // Mostrar el array de objetos
    console.log(metadata);

    // Actualizar el estado de los párrafos en React
    setParagraphs(metadata);
  }
};

const getInnerText = (element) => {
  if (element.nodeType === 3) {
    return element.textContent;
  } else if (element.nodeType === 1) {
    let text = '';
    for (let child of element.childNodes) {
      text += getInnerText(child);
    }
    return text;
  }
  return '';
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
            onClick={handleFontColorPickerToggle}
            style={{ color: fontColor }}
          >
            <span>F</span>
          </button>
          {showFontColorPicker && (
            <ChromePicker color={fontColor} onChange={handleFontColorChange} />
          )}

          <button
            className="btnColor"
            onClick={handleBackColorPickerToggle}
            style={{ backgroundColor: backColor }}
          >
            <span>B</span>
          </button>
          {showBackColorPicker && (
            <ChromePicker color={backColor} onChange={handleBackColorChange} />
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


          <select id="inputFontSize" onChange={handleFontSizeChange}>
            <option value="10">12 pt</option>
            <option value="12">16 pt</option>
            <option value="14">18 pt</option>
            <option value="16">20 pt</option>
            <option value="18">24 pt</option>
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
