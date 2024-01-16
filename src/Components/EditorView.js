import React, { useState } from "react";
import TemaDetails from "./TemaDetails";
import { Button, Modal, Form } from "react-bootstrap";
import AddCircleIcon from "@atlaskit/icon/glyph/add";

const EditorView = ({ selectedText }) => {
  const [showModal, setShowModal] = useState(false);
  const [newTema, setNewTema] = useState({ tema: "", contenido: "", autor: "" });


  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewTema({ tema: "", contenido: "", autor: "" }); // Include the 'autor' property
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTema((prevTema) => ({ ...prevTema, [name]: value }));
  };

  const handleAddTema = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/text/create-tema/${selectedText._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tema: newTema.tema,
            elementos: [
              {
                contenido: newTema.contenido,
                tipo: "compromiso",
                alineacion: "left",
                bold: false,
                italic: false,
                underline: false,
                autor: "Pipet",
                sentimiento: "positive",
                orden: 1,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error al añadir tema: ${response.statusText}`);
      }

      const addedTema = await response.json();
      // Puedes hacer algo con el tema añadido si es necesario

      // Cierra el modal y actualiza la vista
      handleCloseModal();
    } catch (error) {
      console.error("Error al añadir tema: ", error);
      // Manejar el error, si es necesario
    }
  };

  return (
    <div className="sticky-header-container">
    <div className="EditorTexto">
      {selectedText && selectedText.temas && selectedText.temas.length > 0 ? (
        selectedText.temas.map((tema) => (
          <TemaDetails key={tema.id_tema} tema={tema} selectedText={selectedText} />
        ))
      ) : (
        "No hay temas disponibles"
      )}
    </div>
    <Button variant="outline-primary" className="add-tema-button" onClick={handleShowModal}>
      <AddCircleIcon size="small" />
      Añadir Tema
    </Button>

      {/* Modal para añadir un tema */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Tema</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="temaName">
              <Form.Label>Nombre del Tema</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del tema"
                name="tema"
                value={newTema.tema}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="temaContent">
              <Form.Label>Contenido del Tema</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ingrese el contenido del tema"
                name="contenido"
                value={newTema.contenido}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="temaAutor">
              <Form.Label>Autor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el autor"
                name="autor"
                value={newTema.autor}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleAddTema}>
            Añadir Tema
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditorView;
