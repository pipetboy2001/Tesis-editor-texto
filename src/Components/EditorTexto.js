import React, { useEffect, useState, useRef } from "react";
// ... (resto de las importaciones)

import Button from "@atlaskit/button";
import Select from "@atlaskit/select";
import { Label } from "@atlaskit/form";
import Textfield from "@atlaskit/textfield";
import Textarea from "@atlaskit/textfield";
import { v4 as uuidv4 } from "uuid";
import ParagraphEditor from "./ParagraphEditor";
import VistaBonita from "./VistaBonita";
import "./../Styles/EditorTexto.css";
import EditorDoneIcon from "@atlaskit/icon/glyph/editor/done";
import WatchIcon from "@atlaskit/icon/glyph/watch";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

/* const tipoOptions = [
  { label: "Compromiso", value: "compromiso" },
  { label: "Desacuerdo", value: "desacuerdo" },
  { label: "Duda", value: "duda" },
  { label: "Acuerdo", value: "acuerdo" },
]; */

const generateUniqueId = () => {
  return uuidv4();
};

const EditorTexto = ({ selectedId, texts }) => {
  const [selectedText, setSelectedText] = useState(null);
  const [editableContent, setEditableContent] = useState([]);
  const [selectedTipos, setSelectedTipos] = useState([]);
  const [viewMode, setViewMode] = useState("editor"); // Puedes usar "editor" y "bonita" como modos

  const handleToggleView = () => {
    setViewMode((prevMode) => (prevMode === "editor" ? "bonita" : "editor"));
  };

  useEffect(() => {
    const selectedTextData = texts.find((text) => text._id === selectedId);
    setSelectedText(selectedTextData);
    setEditableContent(
      selectedTextData?.elementos.map((elemento) => ({
        contenido: elemento.contenido,
        tipo: elemento.tipo,
        alineacion: elemento.alineacion,
        bold: elemento.bold,
        italic: elemento.italic,
        underline: elemento.underline,
        autor: elemento.autor,
        paragraphId: elemento._id,
        sentimiento: elemento.sentimiento,
        orden: elemento.orden,
      })) || []
    );

    setSelectedTipos(
      selectedTextData?.elementos.map((elemento) => elemento.tipo) || []
    );
  }, [selectedId, texts]);

  const handleProcessParagraphs = () => {
    const inputText = paragraphsInputRef.current.value;
    const paragraphs = inputText.split("\n");

    paragraphs.forEach((paragraph) => {
      handleAddParagraph(paragraph.trim());
    });

    // Limpiar el contenido del textarea después de procesar los párrafos
    paragraphsInputRef.current.value = "";
  };

  const paragraphsInputRef = useRef(null);

  const handleContentChange = (index, newContent) => {
    const newEditableContent = [...editableContent];
    newEditableContent[index].contenido = newContent;
    setEditableContent(newEditableContent);
  };

  const handleSave = (index) => {
    const newEditableContent = [...editableContent];
    newEditableContent[index].tipo = selectedTipos[index];
    setEditableContent(newEditableContent);
    console.log(newEditableContent[index]);
    return newEditableContent[index];
  };

  const handleSaveAll = async () => {
    try {
      const updatedContents = editableContent.map((elemento, index) => {
        return handleSave(index);
      });

      const response = await fetch(
        //`http://172.111.10.181:8000/text/update/${selectedText._id}`,
        `http://localhost:8000/text/update/${selectedText._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            elementos: updatedContents,
          }),
        }
      );

      if (response.ok) {
        console.log("¡Guardado todo con éxito!");
        alert("Guardado todo con éxito");
      } else {
        console.error("Error al guardar todo");
        alert("Error al guardar todo");
      }
    } catch (error) {
      console.error("Error al guardar todo:", error);
    }
  };

  const handleAddParagraph = (newParagraph) => {
    setEditableContent((prevContent) => [
      ...prevContent,
      {
        contenido: newParagraph,
        alineacion: "izquierda",
        bold: false,
        italic: false,
        underline: false,
        autor: "", // Puedes ajustar esto según tus necesidades
        paragraphId: generateUniqueId(),
        tipo: "compromiso",
        sentimiento: "???", // Puedes ajustar esto según tus necesidades.
        orden: prevContent.length + 1,
      },
    ]);
  };

  const handleDelete = (paragraphId) => {
    const newEditableContent = editableContent.filter(
      (elemento) => elemento.paragraphId !== paragraphId
    );
    setEditableContent(newEditableContent);
  };

  const handleTipoChange = (index, selectedValue) => {
    const newSelectedTipos = [...selectedTipos];
    newSelectedTipos[index] = selectedValue;
    setSelectedTipos(newSelectedTipos);
  };

  return (
    <>
      <header className="app-header">
        <Button
          appearance="primary"
          shouldFitContainer
          onClick={handleToggleView}
        >
          <WatchIcon size="small" />
          {viewMode === "editor" ? " Ver Texto Bonito" : " Volver a Editor"}
        </Button>
      </header>
      <div className="view-mode-section">
        {viewMode === "editor" ? (
          <div className="EditorTexto">
            {selectedText && editableContent.length > 0 ? (
              editableContent.map((elemento, index) => (
                <ParagraphEditor
                  key={index}
                  index={index}
                  elemento={elemento}
                  selectedTipos={selectedTipos}
                  handleTipoChange={handleTipoChange}
                  handleContentChange={handleContentChange}
                  handleSave={handleSave}
                  handleDelete={handleDelete}
                  //tipoOptions={tipoOptions}
                  editableContent={editableContent}
                  setEditableContent={setEditableContent}
                />
              ))
            ) : (
              <>
                <div className="add-paragraph-container">
                  <Label label="Ingresar texto con varios párrafos:" />
                  <textarea
                    className="paragraph-input"
                    placeholder="Escribe aquí..."
                    ref={paragraphsInputRef}
                  />
                  <Button
                    appearance="primary"
                    className="process-paragraphs-button"
                    onClick={handleProcessParagraphs}
                  >
                    Procesar Párrafos
                  </Button>
                </div>
              </>
            )}
            <div className="button-section">
              <Button appearance="primary" onClick={handleSaveAll}>
                <EditorDoneIcon size="small" />
                Guardar Todo
              </Button>
            </div>
          </div>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <VistaBonita paragraphs={editableContent} selectedText={selectedText} selectedId={selectedId} />
          </DndProvider>
        )}
      </div>
    </>
  );
};

export default EditorTexto;
