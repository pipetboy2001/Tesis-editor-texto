import React, { useEffect, useState, useRef } from "react";
import Button from "@atlaskit/button";
import WatchIcon from "@atlaskit/icon/glyph/watch";
import VistaBonita from "./VistaBonita";
import EditorView from "./EditorView";

const Testing = ({ selectedId }) => {
  const [selectedText, setSelectedText] = useState(null);
  const [viewMode, setViewMode] = useState("editor");

  const handleToggleView = () => {
    setViewMode((prevMode) => (prevMode === "editor" ? "bonita" : "editor"));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/text/${selectedId}`
        );
        if (!response.ok) {
          throw new Error(`Error al obtener el texto: ${response.statusText}`);
        }

        const data = await response.json();
        setSelectedText(data);
      } catch (error) {
        console.error("Error al obtener el texto: ", error);
      }
    };

    fetchData();
  }, [selectedId]);

  return (
    <>
      <header className="app-header">
        <Button
          appearance="primary"
          shouldFitContainer
          onClick={handleToggleView}
        >
          <WatchIcon size="small" />
          {viewMode === "editor" ? " Ver Informe" : " Volver a Editor"}
        </Button>
      </header>

      <div className="view-mode-section">
        {viewMode === "editor" ? (
          <EditorView selectedText={selectedText} />
        ) : (
          <VistaBonita
            selectedId={selectedId}
            selectedText={selectedText.temas}
            
          />
        )}
      </div>
    </>
  );
};

export default Testing;
