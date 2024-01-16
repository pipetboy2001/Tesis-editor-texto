import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDrag, useDrop } from "react-dnd";
import CommentIcon from "@atlaskit/icon/glyph/comment";
import MentionIcon from "@atlaskit/icon/glyph/mention";
import SentimientoIcon from "@atlaskit/icon/glyph/emoji";
import DateIcon from "@atlaskit/icon/glyph/calendar";
import EditIcon from "@atlaskit/icon/glyph/edit";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import AddCircleIcon from "@atlaskit/icon/glyph/add";
import EditModal from "./EditModal";

const DraggableElement = ({
  elemento,
  index,
  moveElement,
  onDeleteElement,
  idTema,
  idText,
}) => {
  const [{ isDragging }, ref] = useDrag({
    type: "ELEMENTO",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "ELEMENTO",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveElement(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const containerClass = `elemento-container ${
    isDragging ? "elemento-container-dragging" : ""
  }`;

  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleDeleteClick = () => onDeleteElement(idText, idTema, elemento._id);

  return (
    <div ref={(node) => ref(drop(node))} className={containerClass}>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <Button
            variant="primary"
            className="edit-button"
            onClick={handleEditClick}
          >
            <EditIcon size="small" /> Editar
          </Button>
          <EditModal
            show={showEditModal}
            handleClose={handleCloseEditModal}
            elemento={elemento}
            onSave={(editedElemento) => console.log(editedElemento)}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Button
            variant="danger"
            className="delete-button"
            onClick={handleDeleteClick}
          >
            <TrashIcon size="small" /> Eliminar
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <p>
            <strong>
              <MentionIcon size="small" /> Autor{" "}
            </strong>{" "}
            {elemento.autor}
          </p>
          <p>
            <strong>
              <CommentIcon size="small" /> Tipo:
            </strong>{" "}
            {elemento.tipo}
          </p>
        </div>
        <div className="col-md-6 col-sm-12">
          <p>
            <strong>
              <SentimientoIcon size="small" /> Sentimiento:
            </strong>{" "}
            {elemento.sentimiento}
          </p>
          <p>
            <strong>
              <DateIcon size="small" /> Fecha:
            </strong>{" "}
            {elemento.fecha}
          </p>
        </div>
      </div>
      <div className="row contenido-section">
        <div className="col-md-12">
          <p>{elemento.contenido}</p>
        </div>
      </div>
    </div>
  );
};

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


  // console.log de text, tema y elementos
  //console.log("id documento", selectedText._id);
  //console.log("id tema", tema._id);

  const idText = selectedText._id;
  const idTema = tema._id;

  const handleDeleteElement = async (idText, idTema, elementId) => {
    console.log("se eleminara el elemento", elementId);

    try {
      const response = await fetch(
        `http://localhost:8000/text/temas/${idText}/${idTema}/${elementId}`,
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

  const handleAddElement = async (idText, idTema) => {
    try {
      const response = await fetch(
        `http://localhost:8000/text/temas/${idText}/${idTema}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contenido: "Introduction to the new topic 230404",
            tipo: "paragraph",
            alineacion: "left",
            bold: false,
            italic: true,
            underline: false,
            autor: "Pipet",
            sentimiento: "positive",
            orden: 1,
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
      //actualizar vista
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
                onDeleteElement={handleDeleteElement}
                idTema={tema._id} // Pasar idTema como prop
                idText={selectedText._id} // Pasar idText como prop
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
