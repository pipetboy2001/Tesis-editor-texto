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
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);

  //const heredados
  const [fontColor, setFontColor] = useState("#3c8dbc");
  const [backColor, setBackColor] = useState("orange");
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
          throw new Error(
            `Error al enviar la actualización: ${response.statusText}`
          );
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

  // Función para mostrar marcas de formato en la consola
  const showFormatMarks = () => {
    const editor = document.getElementById("editor");
    if (editor) {
      const cards = editor.getElementsByClassName("card");
      let metadata = [];

      Array.from(cards).forEach((card, index) => {
        const textEditor = card.querySelector("[contenteditable='true']");
        if (textEditor) {
          const paragraphs = Array.from(textEditor.childNodes).map((node) => {
            if (node.nodeType === 3) {
              return node.textContent.trim();
            } else if (node.nodeType === 1 && node.nodeName === "DIV") {
              return node.innerHTML.trim();
            }
            return "";
          });

          const filteredParagraphs = paragraphs.filter(
            (paragraph) => paragraph !== ""
          );

          filteredParagraphs.forEach((paragraph, paragraphIndex) => {
            const currentParagraphObj = {
              id: index * filteredParagraphs.length + paragraphIndex,
              content: paragraph,
              text: "",
              number: index * filteredParagraphs.length + paragraphIndex + 1,
            };

            metadata.push(currentParagraphObj);
          });
        }
      });

      setTexts(metadata);
      console.log(metadata);
    }
  };

  // Agrega esta función para manejar el botón de mostrar marcas de formato
  const handleShowFormatMarks = () => {
    // Enfoca el editor para que el usuario pueda seguir escribiendo
    const editor = document.getElementById("editor");
    if (editor) {
      showFormatMarks();
      editor.focus();
    } else {
      console.error("Elemento con ID 'editor' no encontrado en el DOM.");
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

  return (
    <div className="App">
      <div id="parentEditor">
        <div id="editor">
          {texts.map((text, index) => (
            <div key={index} className="card">
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
                <button onClick={handleShowFormatMarks}>¶</button>
              </div>
              <div
                contentEditable={true}
                className="text-editor"
                style={{
                  textAlign: text.alineacion || "left",
                  fontWeight: text.bold ? "bold" : "normal",
                  fontStyle: text.italic ? "italic" : "normal",
                  textDecoration: text.underline ? "underline" : "none",
                }}
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
