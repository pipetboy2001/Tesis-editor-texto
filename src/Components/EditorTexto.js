import React, { useEffect, useState } from "react";
import Button from "@atlaskit/button";
import Select from "@atlaskit/select";
import { Label } from "@atlaskit/form";
import Textfield from "@atlaskit/textfield";
import { v4 as uuidv4 } from "uuid";
import ParagraphEditor from "./ParagraphEditor";
import VistaBonita from "./VistaBonita";
import "./../Styles/EditorTexto.css";

const tipoOptions = [
  { label: "Compromiso", value: "compromiso" },
  { label: "Desacuerdo", value: "desacuerdo" },
  { label: "Duda", value: "duda" },
  { label: "Acuerdo", value: "acuerdo" },
];

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
      })) || []
    );

    setSelectedTipos(
      selectedTextData?.elementos.map((elemento) => elemento.tipo) || []
    );
  }, [selectedId, texts]);

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
        `http://172.111.10.181:8000/text/update/${selectedText._id}`,
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
      } else {
        console.error("Error al guardar todo");
      }
    } catch (error) {
      console.error("Error al guardar todo:", error);
    }
  };

  const handleAddParagraph = () => {
    setEditableContent((prevContent) => [
      ...prevContent,
      {
        contenido: "",
        tipo: tipoOptions[0].value,
        alineacion: "izquierda",
        bold: false,
        italic: false,
        underline: false,
        autor: "",
        paragraphId: generateUniqueId(),
      },
    ]);

    setSelectedTipos(tipoOptions[0].value);
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
            {viewMode === "editor" ? "Ver Texto Bonito" : "Volver a Editor"}
          </Button>
        </header>
        <div className="view-mode-section">
        {viewMode === "editor" ? (
          <div className="EditorTexto">
            {selectedText &&
              editableContent.map((elemento, index) => (
                <ParagraphEditor
                  key={index}
                  index={index}
                  elemento={elemento}
                  selectedTipos={selectedTipos}
                  handleTipoChange={handleTipoChange}
                  handleContentChange={handleContentChange}
                  handleSave={handleSave}
                  tipoOptions={tipoOptions} // Make sure you pass tipoOptions
                  editableContent={editableContent}
                  setEditableContent={setEditableContent}
                />
              ))}
            <div className="button-section">
              <Button appearance="primary" onClick={handleAddParagraph}>
                Añadir nuevo párrafo
              </Button>
              <Button appearance="primary" onClick={handleSaveAll}>
                Guardar Todo
              </Button>
            </div>
          </div>
        ) : (
          <VistaBonita paragraphs={editableContent} />
        )}
      </div>
    </>
  );
};

export default EditorTexto;
