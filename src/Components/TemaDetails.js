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

const DraggableElement = ({ elemento, index, moveElement }) => {
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

  const containerClass = `elemento-container ${isDragging ? "elemento-container-dragging" : ""}`;

  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);

  return (
    <div ref={(node) => ref(drop(node))} className={containerClass}>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <Button variant="primary" className="edit-button" onClick={handleEditClick}>
            <EditIcon size="small"/> Editar
          </Button>
          <EditModal
            show={showEditModal}
            handleClose={handleCloseEditModal}
            elemento={elemento}
            onSave={(editedElemento) => console.log(editedElemento)}
          />
        </div>
        <div className="col-md-6 col-sm-12">
          <Button variant="danger" className="delete-button">
            <TrashIcon size="small" />
            Borrar
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <p><strong><MentionIcon size="small" /> Autor </strong> {elemento.autor}</p>
          <p><strong><CommentIcon size="small" /> Tipo:</strong> {elemento.tipo}</p>
        </div>
        <div className="col-md-6 col-sm-12">
          <p><strong><SentimientoIcon size="small" /> Sentimiento:</strong> {elemento.sentimiento}</p>
          <p><strong><DateIcon size="small" /> Fecha:</strong> {elemento.fecha}</p>
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

const TemaDetails = ({ tema }) => {
  const [elementos, setElementos] = useState(tema.elementos || []);
  const [showEditModal, setShowEditModal] = useState(false);

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
          <h3>Tema {tema.id_tema}: {tema.tema}</h3>
        </div>
        <div className="col-md-6">
          <Button variant="outline-primary" className="edit-button">
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
