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
import Button from '@atlaskit/button';

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
          <Button
            className="btnColor"
            onClick={() => handleTextAlignmentLocal('left')}
          >
            <FaAlignLeft />
          </Button>
          <Button
            className="btnColor"
            onClick={() => handleTextAlignmentLocal('center')}
          >
            <FaAlignCenter />
          </Button>
          <Button
            className="btnColor"
            onClick={() => handleTextAlignmentLocal('right')}
          >
            <FaAlignRight />
          </Button>
          <Button
            className="btnColor"
            onClick={() => applyStyleToContentEditableLocal('bold', !text.bold)}
            style={{ fontWeight: text.bold ? 'bold' : 'normal' }}
          >
            <FaBold />
          </Button>
          <Button
            className="btnColor"
            onClick={() => applyStyleToContentEditableLocal('italic', !text.italic)}
            style={{ fontStyle: text.italic ? 'italic' : 'normal' }}
          >
            <FaItalic />
          </Button>
          <Button
            className="btnColor"
            onClick={() => applyStyleToContentEditableLocal('underline', !text.underline)}
            style={{
              textDecoration: text.underline ? 'underline' : 'none',
            }}
          >
            <FaUnderline />
          </Button>
          <Button onClick={handleShowFormatMarks}>Actualizar Elementos Dialogicos</Button>
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
              textAlign: text.alineacion || 'left',
              fontWeight: text.bold ? 'bold' : 'normal',
              fontStyle: text.italic ? 'italic' : 'normal',
              textDecoration: text.underline ? 'underline' : 'none',
            }}
          />
        </div>
  
        <Button appearance="primary" onClick={handleSaveClickLocal}>
          Guardar
        </Button>
      </div>
    );
  };
  
  export default TextComponent;