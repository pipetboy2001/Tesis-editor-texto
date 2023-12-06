// App.js
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import TextComponent from "./Components/TextComponent";
import OptionsModal from "./Components/OptionsModal"; // Importa el nuevo componente


const App = () => {
  const [databaseError, setDatabaseError] = useState(false);
  const [texts, setTexts] = useState([]);
  const [paragraphNumbers, setParagraphNumbers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");  // Nuevo estado para el valor seleccionado

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  // Función para alinear el texto
  const handleTextAlignment = async (newAlignment, textId) => {
    try {
      // Actualizar el estado local
      setTexts((prevTexts) =>
        prevTexts.map((text) =>
          text._id === textId ? { ...text, alineacion: newAlignment } : text
        )
      );

      // Actualizar los números de párrafo
      setParagraphNumbers((prevNumbers) =>
        prevNumbers.map((number, index) =>
          index === textId ? number + 1 : number
        )
      );
    } catch (error) {
      console.error("Error al cambiar la alineación:", error.message);
    }
  };

  // Funcion para aplicar estilos al texto
  const applyStyleToContentEditable = (style, value, textId) => {
    setTexts((prevTexts) =>
      prevTexts.map((text) =>
        text._id === textId ? { ...text, [style]: value } : text
      )
    );
  
    const editor = document.getElementById(`editor-${textId}`);
    if (editor) {
      editor.focus();
      document.execCommand(style, false, value);
    }
  };


  const handleSaveClick = async (textId, content) => {
    try {
      // Obtener el texto específico
      const textToUpdate = texts.find((text) => text._id === textId);
      // Verificar si hay cambios en el formato
      if (textToUpdate) {
        const requestBody = {
          alineacion: textToUpdate.alineacion,
          bold: textToUpdate.bold,
          italic: textToUpdate.italic,
          underline: textToUpdate.underline,
          contenido: content,
          // Incluye el nuevo campo de valor seleccionado
          tipo: textToUpdate.selectedValue,
        };

        console.log("RequestBody:", JSON.stringify(requestBody));
        //window.alert("¡Guardado con éxito!");

        // Enviar la actualización al servidor
        const response = await fetch(
          `http://localhost:8000/text/update/${textId}`, // Ajusta la URL según tu API
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
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

  // Agrega esta función para manejar el botón de mostrar marcas de formato
  const handleShowFormatMarks = () => {
    // Enfoca el editor para que el usuario pueda seguir escribiendo
    const editor = document.getElementById("editor");
    if (editor) {
      //console.log("Mostrando marcas de formato...");
      showFormatMarks();
      editor.focus();
    } else {
      console.error("Elemento con ID 'editor' no encontrado en el DOM.");
    }
  };
  
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
            };

            metadata.push(currentParagraphObj);
          });
        }
      });

      // Actualizar el estado con los IDs de párrafo
      setParagraphNumbers(metadata.map((item) => item.id));
      //console.log("Marcas de formato:", metadata);
      // Crear botones para cada párrafo
      const buttonsContainer = document.getElementById("paragraphButtons");
      if (buttonsContainer) {
        buttonsContainer.innerHTML = "";
        metadata.forEach((item) => {
          const button = document.createElement("button");
          button.innerText = item.id + 1; // Sumar 1 para empezar desde 1 en lugar de 0
          button.addEventListener("click", () =>
            handleParagraphButtonClick(item.id)
          );
          buttonsContainer.appendChild(button);
        });
      }
    }
  };

  const handleValueChange = (value) => {
    setSelectedValue(value);
  };

  const handleSaveValue = (textId) => {
    console.log(`Guardando valor "${selectedValue}" para el párrafo ${textId}`);
    setTexts((prevTexts) =>
      prevTexts.map((text) =>
        text._id === textId ? { ...text, selectedValue } : text
      )
    );
    handleModalClose();
  };

  const handleParagraphButtonClick = (paragraphId) => {
    // Enfoca el editor y selecciona el párrafo correspondiente
    const editor = document.getElementById("editor");
    if (editor) {
      const paragraphs = editor.getElementsByClassName("text-editor");
      if (paragraphs.length > paragraphId) {
        paragraphs[paragraphId].focus();
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(paragraphs[paragraphId]);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/text");
        if (!response.ok) {
          setDatabaseError(true);
          throw new Error(`Error al obtener textos: ${response.statusText}`);
        }
  
        const data = await response.json();
        setTexts(data.texts);
  
        // Inicializar los números de párrafo
        const paragraphNumbersArray = Array.from(
          { length: data.texts.length },
          (_, i) => i + 1
        );
        setParagraphNumbers(paragraphNumbersArray);
  
        // Llamar a handleShowFormatMarks después de actualizar texts
        handleShowFormatMarks();
      } catch (error) {
        console.error("Error al obtener textos: ", error);
      }
    };
  
    // Fetch data initially
    fetchData();
  
    // Execute handleShowFormatMarks every 5 seconds (adjust the interval as needed)
    const intervalId = setInterval(() => {
      handleShowFormatMarks();
    }, 100);
  
    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Las dependencias vacías aseguran que solo se ejecute una vez al montar el componente
  


  return (
    <>
      <div className="App">
        {databaseError ? (
          <div>
            <p>¡Falta la conexión a la base de datos!</p>
            <p>
              Por favor, revisa tu configuración o consulta el{" "}
              <a href="https://github.com/Experiencia-de-usuario-2023/ms-editor-texto" target="_blank" rel="noopener noreferrer">
                repositorio en GitHub
              </a>{" "}
              para obtener ayuda.
            </p>
          </div>
        ) : (
          <div id="parentEditor">
            <div id="editor">
              {texts.map((text) => (
                <TextComponent
                  key={text._id}
                  text={text}
                  handleTextAlignment={handleTextAlignment}
                  applyStyleToContentEditable={applyStyleToContentEditable}
                  handleShowFormatMarks={handleShowFormatMarks}
                  handleSaveClick={handleSaveClick}
                  handleModalShow={handleModalShow}
                  // Pasa los nuevos props para el valor seleccionado
                  selectedValue={selectedValue}
                  handleValueChange={handleValueChange}
                  handleSaveValue={handleSaveValue}
                />
              ))}
            </div>
  
            <OptionsModal
              showModal={showModal}
              handleModalClose={handleModalClose}
              selectedValue={selectedValue}
              handleValueChange={handleValueChange}
              handleSaveValue={handleSaveValue}
              textId={texts.length > 0 ? texts[0]._id : null}
            />
          </div>
        )}
        <div></div>
      </div>
    </>
  );
}

export default App;