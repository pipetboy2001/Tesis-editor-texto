import React, { useState, useCallback } from "react";
import Button from "@atlaskit/button/standard-button";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from "@atlaskit/modal-dialog";
import { Form } from "react-bootstrap";

import IconDesacuerdo from "./../Assets/png/i__Desacuerdo.png";
import IconDuda from "./../Assets/png/i__Duda.png";
import IconNorma from "./../Assets/png/i__Acuerdo.png";
import IconCompromiso from "./../Assets/png/i__Compromiso.png";

const OptionsModal = ({
  showModal,
  handleModalClose,
  selectedValue,
  handleValueChange,
  handleSaveValue,
  textId,
  textContent,
}) => {
  const [author1, setAuthor1] = useState("");
  const [author2, setAuthor2] = useState("");
  const [isAtlassianModalOpen, setIsAtlassianModalOpen] = useState(false);

  const handleAuthor1Change = (e) => {
    setAuthor1(e.target.value);
  };

  const handleAuthor2Change = (e) => {
    setAuthor2(e.target.value);
  };

  const closeAtlassianModal = useCallback(
    () => setIsAtlassianModalOpen(false),
    []
  );

  const handleSaveValueAndClose = () => {
    handleSaveValue(textId);
    closeAtlassianModal();
  };

  return (
    <div>
      <ModalTransition>
        {showModal && (
          <Modal onClose={handleModalClose}>
            <ModalHeader>
              <ModalTitle>Elementos dialógicos</ModalTitle>
            </ModalHeader>

            <ModalBody>
              <p>Texto:</p>
              <p>{textContent}</p>

              <Button
                variant={
                  selectedValue === "Desacuerdo" ? "primary" : "secondary"
                }
                onClick={() => handleValueChange("Desacuerdo")}
                style={{
                  backgroundColor:
                    selectedValue === "Desacuerdo" ? "#ADD8E6" : "inherit",
                }}
              >
                <img
                  src={IconDesacuerdo}
                  alt="Desacuerdo Icon"
                  style={{ width: "20px", height: "20px", marginRight: "5px" }} // Adjust the size and padding as needed
                />
                Desacuerdo
              </Button>
              <Button
                variant={selectedValue === "Duda" ? "primary" : "secondary"}
                onClick={() => handleValueChange("Duda")}
                style={{
                  backgroundColor:
                    selectedValue === "Duda" ? "#ADD8E6" : "inherit",
                }}
              >
                <img
                  src={IconDuda}
                  alt="Duda Icon"
                  style={{ width: "20px", height: "20px", marginRight: "5px" }} // Adjust the size and padding as needed
                />
                Duda
              </Button>
              <Button
                variant={selectedValue === "Acuerdo" ? "primary" : "secondary"}
                onClick={() => handleValueChange("Acuerdo")}
                style={{
                  backgroundColor:
                    selectedValue === "Norma" ? "#ADD8E6" : "inherit",
                }}
              >
                <img

                  src={IconNorma}
                  alt="Acuerdo Icon"
                  style={{ width: "20px", height: "20px", marginRight: "5px" }} // Adjust the size and padding as needed
                />

                Norma
              </Button>
              <Button
                variant={
                  selectedValue === "Compromiso" ? "primary" : "secondary"
                }
                onClick={() => handleValueChange("Compromiso")}
                style={{
                  backgroundColor:
                    selectedValue === "Compromiso" ? "#ADD8E6" : "inherit",
                }}
              >
                <img
                  src={IconCompromiso}
                  alt="Compromiso Icon"
                  style={{ width: "20px", height: "20px", marginRight: "5px" }} // Adjust the size and padding as needed
                />
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
            </ModalBody>
            <ModalFooter>
              <Button variant="primary" onClick={handleSaveValueAndClose}>
                Guardar
              </Button>
              <Button variant="secondary" onClick={handleModalClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
};

export default OptionsModal;
