// OptionsModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

const OptionsModal = ({
  showModal,
  handleModalClose,
  selectedValue,
  handleValueChange,
  handleSaveValue,
  textId,
}) => {
  return (
    <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Opciones</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
