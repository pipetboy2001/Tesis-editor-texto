import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./../Styles/VistaBonita.css"; // Importa el archivo de estilos
import CompromisoIcon from "./../Assets/png/i__Compromiso.png";
import AcuerdoIcon from "./../Assets/png/i__Acuerdo.png";
import DudaIcon from "./../Assets/png/i__Duda.png";
import DesacuerdoIcon from "./../Assets/png/i__Desacuerdo.png";

const DraggableParagraph = ({ paragraph, index, moveParagraph }) => {
  const [, ref] = useDrag({
    type: "PARAGRAPH",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "PARAGRAPH",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveParagraph(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="formatted-paragraph">
      <span className="paragraph-order">{paragraph.orden}.- </span>
      <span className="paragraph-author">{paragraph.autor}</span>
      <span className="paragraph-content">{paragraph.contenido}</span>
    </div>
  );
};

const VistaBonita = ({ paragraphs, selectedId, selectedText }) => {

  const [orderedParagraphs, setOrderedParagraphs] = useState([]);
  const [viewMode, setViewMode] = useState("orden");
  // Agrega un estado para indicar si se debe guardar automáticamente
  const [autoSave, setAutoSave] = useState(false);

  useEffect(() => {
    if (autoSave) {
      const selectedTextId = selectedText._id;
      saveToServer(selectedTextId, orderedParagraphs);
      setAutoSave(false); // Restablece autoSave después de guardar
    }
  }, [autoSave, selectedText, orderedParagraphs]);
  

  const orderParagraphs = () => {
    const ordered = [...paragraphs].sort((a, b) => a.orden - b.orden);
    setOrderedParagraphs(ordered);
  };

  

  const moveParagraph = (fromIndex, toIndex) => {
    const updatedParagraphs = [...orderedParagraphs];
    const [movedParagraph] = updatedParagraphs.splice(fromIndex, 1);
    updatedParagraphs.splice(toIndex, 0, movedParagraph);
  
    const updatedWithNewOrder = updatedParagraphs.map((paragraph, index) => ({
      ...paragraph,
      orden: index + 1,
    }));
  
    setOrderedParagraphs(updatedWithNewOrder);
    setAutoSave(true); // Activa el auto-guardado después de mover el párrafo
  };
  

  const saveToServer = async (selectedTextId, updatedContents) => {
    try {
      const response = await fetch(`http://localhost:8000/text/update/${selectedTextId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          elementos: updatedContents,
        }),
      });

      if (response.ok) {
        console.log("¡Guardado en el servidor con éxito!");
      } else {
        console.error("Error al guardar en el servidor");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud al servidor:", error);
      alert("Error al realizar la solicitud al servidor");
    }
  };


  
  

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === "orden") {
      orderParagraphs();
    }
  };

  return (
    <div className="vista-bonita">
      <div className="view-toggle">
        <button onClick={() => handleViewModeChange("orden")}>
          Vista por Orden
        </button>
        <button onClick={() => handleViewModeChange("tipo")}>
          Vista por Tipo
        </button>
      </div>

      <div className="paragraph-list">
        {viewMode === "orden"
          ? orderedParagraphs.map((paragraph, index) => (
              <DraggableParagraph
                key={index}
                paragraph={paragraph}
                index={index}
                moveParagraph={moveParagraph}
              />
            ))
          : paragraphs.map((paragraph, index) => (
              <div key={index} className="grouped-paragraphs">
                <div className="Titulo-tipo">
                  <h3>
                    {paragraph.tipo.charAt(0).toUpperCase() +
                      paragraph.tipo.slice(1)}
                  </h3>
                  <img
                    src={
                      paragraph.tipo === "compromiso"
                        ? CompromisoIcon
                        : paragraph.tipo === "acuerdo"
                        ? AcuerdoIcon
                        : paragraph.tipo === "duda"
                        ? DudaIcon
                        : DesacuerdoIcon
                    }
                    alt={paragraph.tipo}
                    style={{ width: "20px", height: "20px" }}
                  />
                </div>
                <div className="formatted-paragraph">
                  <span className="paragraph-author">{paragraph.autor}</span>
                  <span className="paragraph-content">
                    {paragraph.contenido}
                  </span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

const VistaBonitaWrapper = ({ paragraphs, selectedText, selectedId }) => (
  <DndProvider backend={HTML5Backend}>
    <VistaBonita paragraphs={paragraphs} selectedText={selectedText} selectedId={selectedId}/>
  </DndProvider>
);

export default VistaBonitaWrapper;
