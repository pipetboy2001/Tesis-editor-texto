// EditModal.js
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditModal = ({ show, handleClose, elemento, onSave }) => {
  const [editedElemento, setEditedElemento] = useState({ ...elemento });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedElemento((prevElemento) => ({
      ...prevElemento,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Aquí puedes manejar la lógica para guardar los cambios en la base de datos
    await onSave(editedElemento);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Elemento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formAutor">
            <Form.Label>Autor</Form.Label>
            <Form.Control
              type="text"
              name="autor"
              value={editedElemento.autor}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formContenido">
            <Form.Label>Contenido</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="contenido"
              value={editedElemento.contenido}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={() => onSave(editedElemento)}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
