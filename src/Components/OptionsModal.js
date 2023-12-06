import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const OptionsModal = ({
  showModal,
  handleModalClose,
  selectedValue,
  handleValueChange,
  handleSaveValue,
  textId,
  textContent, // New prop for passing text content
}) => {
  const [author1, setAuthor1] = useState(""); // State for the first author input
  const [author2, setAuthor2] = useState(""); // State for the second author input

  const handleAuthor1Change = (e) => {
    setAuthor1(e.target.value);
  };

  const handleAuthor2Change = (e) => {
    setAuthor2(e.target.value);
  };

  return (
    <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Opciones</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Texto:</p>
        <p>{textContent}</p>

        <Button
          variant={selectedValue === "Desacuerdo" ? "primary" : "secondary"}
          onClick={() => handleValueChange("Desacuerdo")}
        >
          Desacuerdo
        </Button>
        <Button
          variant={selectedValue === "Duda" ? "primary" : "secondary"}
          onClick={() => handleValueChange("Duda")}
        >
          Duda
        </Button>
        <Button
          variant={selectedValue === "Norma" ? "primary" : "secondary"}
          onClick={() => handleValueChange("Norma")}
        >
          Norma
        </Button>
        <Button
          variant={selectedValue === "Compromiso" ? "primary" : "secondary"}
          onClick={() => handleValueChange("Compromiso")}
        >
          Compromiso
        </Button>

        <Form.Group controlId="author1">
          <Form.Label>Autor 1</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre del autor"
            value={author1}
            onChange={handleAuthor1Change}
          />
        </Form.Group>

        {selectedValue === "Desacuerdo" && (
          <Form.Group controlId="author2">
            <Form.Label>Autor 2</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del segundo autor"
              value={author2}
              onChange={handleAuthor2Change}
            />
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleSaveValue(textId)}>
          Guardar
        </Button>
        <Button variant="secondary" onClick={handleModalClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OptionsModal;
