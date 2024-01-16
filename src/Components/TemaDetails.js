import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import AddCircleIcon from "@atlaskit/icon/glyph/add";
import DraggableElement from "./DraggableElement";

const BASE_URL = "http://localhost:8000";

const TemaDetails = ({ tema, selectedText }) => {
  const [elementos, setElementos] = useState(tema.elementos || []);
  const [showEditModal, setShowEditModal] = useState(false);

  const updateElementosAfterDelete = (deletedElementId) => {
    const updatedElementos = elementos.filter(
      (elemento) => elemento._id !== deletedElementId
    );
    setElementos(updatedElementos);
  };

  const updatedElementosAfeterEdit = (editedElemento) => {
    const updatedElementos = elementos.map((elemento) => {
      if (elemento._id === editedElemento._id) {
        return editedElemento;
      }
      return elemento;
    });
    setElementos(updatedElementos);
  };

  const idText = selectedText._id;
  const idTema = tema._id;

  const handleDeleteElement = async (elementId) => {
    console.log("se eliminará el elemento", elementId);

    try {
      const response = await fetch(
        `${BASE_URL}/text/temas/${idText}/${idTema}/${elementId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error al eliminar el elemento: ${response.statusText}. Detalles: ${errorData.message}`
        );
      }

      updateElementosAfterDelete(elementId);
    } catch (error) {
      console.error("Error al eliminar el elemento:", error.message);
    }
  };

  const handleAddElement = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/text/temas/${idText}/${idTema}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contenido: "Texto por defecto",
            tipo: "Duda",
            alineacion: "left",
            bold: false,
            italic: true,
            underline: false,
            autor: "Pipet",
            sentimiento: "positivo",
            orden: 1,
            date: new Date(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error al agregar el elemento: ${response.statusText}. Detalles: ${errorData.message}`
        );
      }

      const addedElemento = await response.json();
      const updatedElementos = [...elementos, addedElemento];
      setElementos(updatedElementos);

      console.log("Elemento agregado", addedElemento);
      updatedElementosAfeterEdit(addedElemento);
    } catch (error) {
      console.error("Error al agregar el elemento:", error.message);
    }
  };

  const moveElement = (fromIndex, toIndex) => {
    const updatedElementos = [...elementos];
    const movedElement = updatedElementos.splice(fromIndex, 1)[0];
    updatedElementos.splice(toIndex, 0, movedElement);
    setElementos(updatedElementos);
  };

  const handleDeleteTema = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/text/temas/${idText}/${idTema}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error al eliminar el tema: ${response.statusText}. Detalles: ${errorData.message}`
        );
      }

      console.log("Tema eliminado");
      setElementos([]);
    } catch (error) {
      console.error("Error al eliminar el tema:", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = `${BASE_URL}/text/temas/${idText}/${idTema}`;

      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Error al obtener datos: ${response.statusText}. Detalles: ${errorData.message}`
          );
        }

        const data = await response.json();
        if (data.tema && data.tema.elementos) {
          setElementos(data.tema.elementos);
        } else {
          console.error(
            "La propiedad 'tema' o 'elementos' es undefined en la respuesta del servidor."
          );
        }
      } catch (error) {
        console.error("Error al obtener datos:", error.message);
      }
    };

    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []); 
  
  return (
    <div className="tema-details-container">
      <div className="tema-container row">
        <div className="col-md-6">
          <h3>
            Tema {tema.id_tema} {tema.tema}
          </h3>
        </div>
        <div className="col-md-6">
          <Button
            variant="outline-primary"
            className="edit-button"
            onClick={() => handleAddElement(idText, idTema)}
          >
            <AddCircleIcon size="small" />
            Añadir Elemento
          </Button>
          <Button
            variant="danger"
            className="delete-button"
            onClick={handleDeleteTema}
          >
            <TrashIcon size="small" /> Borrar Tema
          </Button>
        </div>
      </div>
      <div className="tema-informacion">
        {elementos.length > 0 ? (
          <div className="elementos-container">
            {elementos.map((elemento, index) => (
              <DraggableElement
                key={elemento._id}
                elemento={elemento}
                index={index}
                moveElement={moveElement}
                onDeleteElement={() => handleDeleteElement(elemento._id)} // Modifica aquí
                idTema={tema._id}
                idText={selectedText._id}
              />
            ))}
          </div>
        ) : (
          <p>No hay elementos disponibles en este tema.</p>
        )}
      </div>
    </div>
  );
};

export default TemaDetails;
