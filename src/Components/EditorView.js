import React from "react";
import TemaDetails from "./TemaDetails";
import { Button } from "react-bootstrap";
import AddCircleIcon from "@atlaskit/icon/glyph/add";
//import "./../Styles/EditorView.css"; // Asegúrate de importar tus estilos CSS

const EditorView = ({ selectedText }) => (
  <div className="sticky-header-container">
    <div className="EditorTexto">
      {selectedText && selectedText.temas && selectedText.temas.length > 0 ? (
        selectedText.temas.map((tema) => (
          <TemaDetails key={tema.id_tema} tema={tema} />
        ))
      ) : (
        "No hay temas disponibles"
      )}
    </div>
    <Button variant="outline-primary" className="add-tema-button">
      <AddCircleIcon size="small" />
      Añadir Tema
    </Button>
  </div>
);

export default EditorView;
