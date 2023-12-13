import React from "react";
import Button from "@atlaskit/button";
import { Label } from "@atlaskit/form";
import Textfield from "@atlaskit/textfield";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import CommentIcon from "@atlaskit/icon/glyph/comment";
import MentionIcon from "@atlaskit/icon/glyph/mention";

const ParagraphEditor = ({
  index,
  elemento,
  selectedTipos,
  handleTipoChange,
  handleContentChange,
  handleSave,
  tipoOptions,
  editableContent,
  setEditableContent,
  handleDelete, // Nuevo prop para manejar la eliminación
}) => {
  const { paragraphId, alineacion, bold, italic, underline, contenido, autor } =
    elemento;

  return (
    <div key={index}>
      <div className="header">
        <div className="id-section">
          <Label className="id-label" htmlFor={`id-${index}`}>
            ID:
          </Label>
          <div className="id-value">{paragraphId}</div>
          <Button onClick={() => handleDelete(paragraphId)} appearance="danger">
            <TrashIcon size="small" />
            Eliminar
          </Button>
        </div>
        <div className="tipo-autor-section"></div>
        <div className="tipo-autor-section">
          <div className="tipo-section">
            <label htmlFor={`tipo-${index}`}>
              <CommentIcon size="small" />
              Tipo
            </label>
            <select
              className="tipo-select"
              value={selectedTipos[index]}
              onChange={(e) => handleTipoChange(index, e.target.value)}
            >
              {tipoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="autor-section">
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
        </div>
      </div>

      <div className="editor">
        <div
          style={{
            textAlign: alineacion,
            fontWeight: bold ? "bold" : "normal",
            fontStyle: italic ? "italic" : "normal",
            textDecoration: underline ? "underline" : "none",
          }}
        >
          <Textfield
            id={`id-${index}`}
            className="editable-content"
            value={contenido}
            onChange={(e) => handleContentChange(index, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ParagraphEditor;
