import React, { useState, useEffect } from "react";
import {
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaUnderline,
} from "react-icons/fa";
import "./../Styles/Text.css";

const TextComponent = ({
  text,
  handleTextAlignment,
  applyStyleToContentEditable,
  handleShowFormatMarks,
  handleSaveClick,
  handleModalShow,
}) => {
  const [content, setContent] = useState(text.contenido);
  const [newtext, setNewtext] = useState(text.contenido);

  const handleTextAlignmentLocal = (alignment) => {
    handleTextAlignment(alignment, text._id);
  };

  const applyStyleToContentEditableLocal = (style, value) => {
    applyStyleToContentEditable(style, value, text._id);
  };

  const handleSaveClickLocal = () => {
    console.log("Texto que se enviara: ", newtext);
    handleSaveClick(text._id, newtext); // Cambiado de text.contenido a newtext
  };
  

  const handleModalShowLocal = () => {
    handleModalShow();
  };

  useEffect(() => {
    setContent(text.contenido);
    //console.log("Texto en el editor: ", text.contenido);
  }, [text.contenido]);

  const handleContentChange = (e) => {
    setNewtext(e.target.innerHTML);
    //console.log("Texto en el editor nuevo: ", newtext);
  };
  
  return (
    <div key={text._id} className="card">
      <div id="painelEditor">
        <button
          className="btnColor"
          onClick={() => handleTextAlignmentLocal("left")}
        >
          <FaAlignLeft />
        </button>
        <button
          className="btnColor"
          onClick={() => handleTextAlignmentLocal("center")}
        >
          <FaAlignCenter />
        </button>
        <button
          className="btnColor"
          onClick={() => handleTextAlignmentLocal("right")}
        >
          <FaAlignRight />
        </button>
        <button
          className="btnColor"
          onClick={() => applyStyleToContentEditableLocal("bold", !text.bold)}
          style={{ fontWeight: text.bold ? "bold" : "normal" }}
        >
          <FaBold />
        </button>
        <button
          className="btnColor"
          onClick={() =>
            applyStyleToContentEditableLocal("italic", !text.italic)
          }
          style={{ fontStyle: text.italic ? "italic" : "normal" }}
        >
          <FaItalic />
        </button>
        <button
          className="btnColor"
          onClick={() =>
            applyStyleToContentEditableLocal("underline", !text.underline)
          }
          style={{
            textDecoration: text.underline ? "underline" : "none",
          }}
        >
          <FaUnderline />
        </button>
        <button onClick={handleShowFormatMarks}>Actualizar Acta</button>
      </div>

      <div className="editor-de-texto">
        <div
          id="paragraphButtons"
          className="paragraph-buttons"
          onClick={handleModalShowLocal}
        ></div>

        <ol
          contentEditable={true}
          className="text-editor"
          id={`editor-${text._id}`}
          onBlur={handleSaveClickLocal}
          onInput={handleContentChange}
          dangerouslySetInnerHTML={{ __html: content }}
          style={{
            textAlign: text.alineacion || "left",
            fontWeight: text.bold ? "bold" : "normal",
            fontStyle: text.italic ? "italic" : "normal",
            textDecoration: text.underline ? "underline" : "none",
          }}
        />
      </div>

      <button className="Boton-guardar" onClick={handleSaveClickLocal}>
        Guardar
      </button>
    </div>
  );
};

export default TextComponent;
