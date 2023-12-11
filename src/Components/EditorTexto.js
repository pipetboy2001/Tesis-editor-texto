import React, { useEffect, useState } from "react";
import Button from "@atlaskit/button";
import Select from "@atlaskit/select";
import { Label } from "@atlaskit/form";
import Textfield from "@atlaskit/textfield";
import { v4 as uuidv4 } from 'uuid';
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
  const [selectedTipo, setSelectedTipo] = useState(null);

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
        paragraphId: elemento._id, // Añadir el ID del párrafo
      })) || []
    );
    setSelectedTipo(selectedTextData?.elementos[0]?.tipo || null);
  }, [selectedId, texts]);

  const handleContentChange = (index, newContent) => {
    console.log(newContent); // Imprimir el nuevo contenido en la consola
    const newEditableContent = [...editableContent];
    newEditableContent[index].contenido = newContent;
    setEditableContent(newEditableContent);
  };

  const handleSave = (index) => {
    // Aquí puedes agregar la lógica para guardar el contenido del párrafo
    console.log(
      `Guardando contenido del párrafo ${index}:`,
      editableContent[index]
    );
  };

  const handleAddParagraph = () => {
    // Añadir un nuevo párrafo al estado editableContent
    setEditableContent((prevContent) => [
      ...prevContent,
      {
        contenido: "", // Puedes establecer un contenido predeterminado si lo deseas
        tipo: tipoOptions[0].value, // Puedes establecer un tipo predeterminado si lo deseas
        alineacion: "izquierda", // Puedes establecer una alineación predeterminada si lo deseas
        bold: false,
        italic: false,
        underline: false,
        autor: "", // Puedes establecer un autor predeterminado si lo deseas
        paragraphId: generateUniqueId(), // Asegúrate de tener una función que genere un ID único
      },
    ]);

    // Si deseas también cambiar el tipo seleccionado al predeterminado del nuevo párrafo, puedes hacerlo aquí
    setSelectedTipo(tipoOptions[0].value);
  };

  return (
    <>
      <div className="EditorTexto">
        {selectedText &&
          editableContent.map((elemento, index) => (
            <div key={index}>
              <div className="header">
                <div className="id-section">
                  <Label className="id-label" htmlFor={`id-${index}`}>
                    ID:
                  </Label>
                  <div className="id-value">{elemento.paragraphId}</div>
                </div>
                <div className="tipo-autor-section"></div>
                <div className="tipo-autor-section">
                  <div className="tipo-section">
                    <Label
                      className="label-white-text"
                      htmlFor={`tipo-${index}`}
                    >
                      Tipo
                    </Label>
                    <Select
                      className="tipo-select"
                      options={tipoOptions}
                      defaultValue={tipoOptions.find(
                        (opt) => opt.value === selectedTipo
                      )}
                      onChange={(selectedOption) => {
                        setSelectedTipo(selectedOption.value);
                      }}
                    />
                  </div>
                  <div className="autor-section">
                    <Label htmlFor={`autor-${index}`}>Autor</Label>
                    <Textfield
                      className="autor-textfield"
                      name={`autor-${index}`}
                      id={`autor-${index}`}
                      defaultValue={elemento.autor}
                      onChange={(e) => {
                        const newEditableContent = [...editableContent];
                        newEditableContent[index].autor = e.target.value;
                        setEditableContent(newEditableContent);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="editor">
                <p
                  style={{
                    textAlign: elemento.alineacion,
                    fontWeight: elemento.bold ? "bold" : "normal",
                    fontStyle: elemento.italic ? "italic" : "normal",
                    textDecoration: elemento.underline ? "underline" : "none",
                  }}
                >
                  <Textfield
                    id={`id-${index}`}
                    className="editable-content"
                    value={elemento.contenido} // Asegúrate de pasar el valor correcto
                    onChange={(e) => handleContentChange(index, e.target.value)}
                  />
                </p>
                <Button appearance="primary" onClick={() => handleSave(index)}>
                  Guardar
                </Button>
              </div>
            </div>
          ))}
          <Button appearance="primary" onClick={handleAddParagraph}>
        Añadir nuevo párrafo
      </Button>
      </div>
      
    </>
  );
};

export default EditorTexto;
