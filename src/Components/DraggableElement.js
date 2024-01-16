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

  const handleSaveElemento = async (editedElemento) => {
    try {
      const response = await fetch(
        `http://localhost:8000/text/temas/${idText}/${idTema}/${editedElemento._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedElemento),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error al editar el elemento: ${response.statusText}. Detalles: ${errorData.message}`
        );
      }

      const updatedElemento = await response.json();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error al editar el elemento:", error.message);
    }
  };

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
            onSave={(editedElemento) => handleSaveElemento(editedElemento)}
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

export default DraggableElement;
