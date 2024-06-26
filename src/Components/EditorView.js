import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import AddCircleIcon from "@atlaskit/icon/glyph/add";
import TemaDetails from "./TemaDetails";
import "./../Styles/EditorView.css";
const API_URL = "http://localhost:8000/text";

const EditorView = ({ selectedText }) => {
  const [state, setState] = useState({
    showModal: false,
    newTema: { tema: "", contenido: "", autor: "" },
    loading: true,
    temas: [],
  });

  const { showModal, newTema, loading, temas } = state;

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/${selectedText._id}`);
      if (!response.ok) {
        throw new Error(`Error al obtener temas: ${response.statusText}`);
      }

      const data = await response.json();
      setState((prevState) => ({ ...prevState, temas: data.temas }));
    } catch (error) {
      console.error("Error al obtener temas: ", error);
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const startInterval = () => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(intervalId);
  };

  useEffect(() => {
    if (selectedText && selectedText._id) {
      fetchData();
      const intervalCleanup = startInterval();
      return intervalCleanup;
    }
  }, [newTema, selectedText]);

  const handleShowModal = () => {
    setState((prevState) => ({ ...prevState, showModal: true }));
  };

  const handleCloseModal = () => {
    setState((prevState) => ({
      ...prevState,
      showModal: false,
      newTema: { tema: "", contenido: "", autor: "" },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      newTema: { ...prevState.newTema, [name]: value },
    }));
  };

  const handleAddTema = async () => {
    try {
      const response = await fetch(
        `${API_URL}/create-tema/${selectedText._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tema: newTema.tema,
            ordenTema: temas.length + 1,
            elementos: [
              {
                contenido: newTema.contenido,
                tipo: "compromiso",
                alineacion: "left",
                bold: false,
                italic: false,
                underline: false,
                autor: newTema.autor,
                sentimiento: "positive",
                orden: 1,
                date: new Date(),
              },
            ],
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error al añadir tema: ${response.statusText}`);
      }
  
      // Si llegamos aquí, la solicitud fue exitosa
      const responseData = await response.json();
      console.log("Respuesta exitosa:", responseData);
  
      handleCloseModal();
    } catch (error) {
      console.error("Error al añadir tema: ", error);
      // Manejar el error, si es necesario
    }
  };
  
  return (
    <>
      <div className="sticky-header-container">
      <div className="EditorTexto">
  {loading
    ? "Cargando temas..."
    : temas.length > 0
    ? temas.map((tema, index) => ( // Utiliza el segundo parámetro de map, el índice
        <TemaDetails
          key={index} // Usa el índice como clave
          tema={tema}
          selectedText={selectedText}
        />
      ))
    : "No hay temas disponibles"}
</div>

        <Button
          variant="primary"
          className="add-tema-button sticky-footer custom-button-style"
          onClick={handleShowModal}
        >
          <AddCircleIcon size="small" />
          Añadir Tema
        </Button>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Añadir Tema</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="temaName">
                <Form.Label>¿Cuál es la descripción del tema?</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese de que trata el tema de conversación"
                  name="tema"
                  value={newTema.tema}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="temaContent">
                <Form.Label>Primer elemento dialógico del tema</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ingrese elemento dialógico del tema"
                  name="contenido"
                  value={newTema.contenido}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="temaAutor">
                <Form.Label>Responsable</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el nombre del responsable"
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
              Crear Tema
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default EditorView;
