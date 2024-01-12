import React, { useState } from "react";
import Button from "@atlaskit/button";
import { Label } from "@atlaskit/form";
import Textfield from "@atlaskit/textfield";
import CommentIcon from "@atlaskit/icon/glyph/comment";
import MentionIcon from "@atlaskit/icon/glyph/mention";
import ModalEditarContenido from "./ModalEditar";

const ParagraphEditor = ({
  index,
  elemento,
  handleContentChange,
  editableContent,
  setEditableContent,
  handleDelete, // Nuevo prop para manejar la eliminación
}) => {
  const {
    paragraphId,
    alineacion,
    bold,
    italic,
    underline,
    contenido,
    autor,
    tipo,
    sentimiento,
    orden,
  } = elemento;

  const [showModal, setShowModal] = useState(false);
  const [nuevoContenido, setNuevoContenido] = useState(contenido);

  const abrirModal = () => {
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const guardarCambios = () => {
    handleContentChange(index, nuevoContenido);
    cerrarModal();
  };

  return (
    <div key={index} className="EditorTexto">
      <div className="header-section">
        <div className="id-section">
          <div className="action-buttons">
            <Button appearance="primary" onClick={abrirModal}>
              Editar
            </Button>
            <Button onClick={() => handleDelete(paragraphId)} appearance="danger">
              Borrar
            </Button>
          </div>
          <div className="id-info">
            <Label className="id-label" htmlFor={`id-${index}`}>
              Orden:
            </Label>
            <input
              className="id-value"
              type="number"
              inputMode="numeric"
              id={`id-${index}`}
              name={`id-${index}`}
              value={orden}
              onChange={(e) => {
                const inputValue = parseInt(e.target.value, 10);
                const newEditableContent = [...editableContent];
                newEditableContent[index].orden = isNaN(inputValue) || inputValue <= 0 ? 1 : inputValue;
                setEditableContent(newEditableContent);
              }}
            />
          </div>
  
          <div className="autor-info">
            <Label htmlFor={`autor-${index}`}>
              <MentionIcon size="small" />
              Autor
            </Label>
            <Textfield
              className="autor-textfield"
              name={`autor-${index}`}
              id={`autor-${index}`}
              defaultValue={autor}
              onChange={(e) => {
                const newEditableContent = [...editableContent];
                newEditableContent[index].autor = e.target.value;
                setEditableContent(newEditableContent);
              }}
            />
          </div>
          <div className="tipo-info">
            <label htmlFor={`tipo-${index}`}>
              <CommentIcon size="small" />
              Tipo
            </label>
            <Textfield
              className="tipo-textfield"
              name={`tipo-${index}`}
              id={`tipo-${index}`}
              defaultValue={tipo}
              isReadOnly
              isDisabled
            />
          </div>
  
          <div className="sentimiento-info">
            <label htmlFor={`sentimiento-${index}`}>
              {/* <SentimientoIcon size="small" /> */}
              Sentimiento
            </label>
            <Textfield
              className="sentimiento-textfield"
              name={`sentimiento-${index}`}
              id={`sentimiento-${index}`}
              defaultValue={sentimiento}
              isReadOnly
              isDisabled
            />
          </div>
        </div>
      </div>
  
      <div className="editor">
        <div
          style={{
            textAlign: alineacion,
            fontWeight: bold ? "bold" : "normal",
            fontStyle: italic ? "italic" : "normal",
            textDecoration: underline ? "underline" : "none",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {contenido}
        </div>
      </div>
  
      {/* Modal de edición de Bootstrap */}
      <ModalEditarContenido
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onGuardar={(nuevoContenido) => {
          handleContentChange(index, nuevoContenido);
          setShowModal(false);
        }}
        valorInicial={contenido}
        bold={bold}
        italic={italic}
        underline={underline}
        alineacion={alineacion}
      />
    </div>
  );
}  

export default ParagraphEditor;
